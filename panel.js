const button = document.querySelector('#analyze');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
button.addEventListener('click', async () => {
  result.textContent = '';
  if (!document.querySelector('#consent').checked) {
    status.textContent = 'Devam etmek için sayfanın uygun olduğunu doğrula.';
    return;
  }
  button.disabled = true;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('Aktif sekme bulunamadı. Web sayfasını açıp eklenti simgesine tekrar bas.');
    // Chrome can omit tab.url when activeTab has not been granted. Missing
    // metadata is not evidence that the page uses an unsupported protocol.
    if (tab.url && !/^https?:\/\//.test(tab.url)) throw new Error('Chrome ayarları veya yeni sekme yerine normal bir web sayfası aç.');
    const [execution] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (!/^https?:$/.test(location.protocol)) return { unsupported: true };
        // No form values, text content, cookies or keystrokes are collected.
        if (document.querySelector('input[type="password"]')) return { blocked: true };
        const language = document.documentElement.getAttribute('lang');
        function selectorFor(target) {
          const parts = [];
          let element = target;
          while (element && element !== document.documentElement) {
            const siblings = [...element.parentElement.children].filter(item => item.tagName === element.tagName);
            parts.unshift(`${element.localName}:nth-of-type(${siblings.indexOf(element) + 1})`);
            element = element.parentElement;
          }
          return ['html', ...parts].join(' > ');
        }
        const images = [...document.querySelectorAll('img')];
        const visibleImages = images.filter(img => {
          const style = getComputedStyle(img);
          return img.getClientRects().length && style.visibility !== 'hidden' && style.visibility !== 'collapse' && style.opacity !== '0';
        });
        const findings = [];
        for (const img of visibleImages) {
          if (img.hasAttribute('alt')) continue;
          // Alternative accessible names and explicit decorative semantics
          // need a richer accessibility audit; do not flag them here.
          if (img.closest('[aria-hidden="true"], [inert]') ||
              ['presentation', 'none'].includes(img.getAttribute('role')) ||
              img.getAttribute('aria-label')?.trim() ||
              img.getAttribute('aria-labelledby')?.trim() ||
              img.getAttribute('title')?.trim()) continue;
          const parts = [];
          let element = img;
          while (element && element !== document.documentElement) {
            const siblings = [...element.parentElement.children].filter(item => item.tagName === element.tagName);
            parts.unshift(`${element.localName}:nth-of-type(${siblings.indexOf(element) + 1})`);
            element = element.parentElement;
          }
          const selector = ['html', ...parts].join(' > ');
          findings.push({ selector, category: 'image', title: 'Eksik görsel alternatif metni', tag: 'IMG', rule: 'WCAG 1.1.1 — manuel doğrulama gerekli', severity: 'Yüksek',
            evidence: 'Görünür img öğesinde alt niteliği yok; aria-label, aria-labelledby ve title ile alternatif ad veya açık dekoratif rol de tanımlanmamış.',
            recommendation: 'Bilgi taşıyan görsele amacını açıklayan alt metni ekle. Yalnızca dekoratifse alt="" kullan.' });
        }
        const fields = [...document.querySelectorAll('input, select, textarea')].filter(field => {
          if (['hidden', 'submit', 'reset', 'button', 'image'].includes(field.type)) return false;
          const style = getComputedStyle(field);
          return field.getClientRects().length && !field.closest('[aria-hidden="true"], [inert]') &&
            style.visibility !== 'hidden' && style.visibility !== 'collapse' && style.opacity !== '0';
        });
        for (const field of fields) {
          // Inspect labeling structure only. Never read .value, defaultValue,
          // selected options, placeholders or textarea content.
          const hasLabel = [...(field.labels || [])].some(label => label.textContent.trim());
          const hasAriaLabel = !!field.getAttribute('aria-label')?.trim();
          const hasReference = (field.getAttribute('aria-labelledby') || '').trim().split(/\s+/)
            .some(id => id && document.getElementById(id)?.textContent.trim());
          const hasTitle = !!field.getAttribute('title')?.trim();
          if (hasLabel || hasAriaLabel || hasReference || hasTitle) continue;
          findings.push({ selector: selectorFor(field), category: 'form', title: 'Form alanında erişilebilir etiket adayı eksik',
            tag: field.tagName, rule: 'WCAG 4.1.2 — manuel doğrulama gerekli', severity: 'Yüksek',
            evidence: 'Görünür form alanında metinli ilişkili label, dolu aria-label, metinli bir öğeye çözülen aria-labelledby veya dolu title bulunamadı. Alanın değeri okunmadı.',
            recommendation: 'Alan için görünür bir label ekle ve for niteliğini alanın id niteliğiyle eşleştir. Yer tutucu metni tek etiket olarak kullanma.' });
        }
        const targets = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"]')].filter(target => {
          const style = getComputedStyle(target);
          const rect = target.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && target.getClientRects().length &&
            !target.closest('[aria-hidden="true"], [inert]') && !target.matches(':disabled, [aria-disabled="true"]') &&
            style.visibility !== 'hidden' && style.visibility !== 'collapse' && style.opacity !== '0' && style.pointerEvents !== 'none';
        });
        for (const target of targets) {
          const rect = target.getBoundingClientRect();
          // Compare unrounded values: 23.99 is below the threshold, 24 is not.
          if (rect.width >= 24 && rect.height >= 24) continue;
          const width = Number(rect.width.toFixed(2));
          const height = Number(rect.height.toFixed(2));
          findings.push({ selector: selectorFor(target), category: 'target', tag: target.tagName,
            title: '24 × 24 CSS pikselden küçük hedef adayı', severity: 'Orta',
            rule: 'WCAG 2.5.8 — istisnalar için manuel doğrulama gerekli',
            measurement: { width: rect.width, height: rect.height, minimum: 24, unit: 'CSS px' },
            evidence: `Öğenin ölçülen sınır kutusu ${width} × ${height} CSS px. Genişlik veya yükseklik 24 CSS px altında. Bu ölçüm tek başına kesin WCAG ihlali değildir.`,
            recommendation: 'Tıklanabilir alanı en az 24 × 24 CSS px olacak şekilde büyüt. Aralık, satır içi bağlantı, eşdeğer kontrol, tarayıcı kontrolü ve zorunlu sunum istisnalarını ayrıca doğrula.' });
        }
        return { blocked: false, language, selector: 'html', rule: 'WCAG 3.1.1', missing: !language?.trim(),
          targetCount: targets.length, fieldCount: fields.length, imageCount: images.length, visibleImageCount: visibleImages.length, findings };
      }
    });
    const finding = execution.result;
    if (!finding || finding.unsupported) throw new Error('Normal bir http veya https web sayfası aç.');
    if (finding.blocked) {
      status.textContent = 'Parola alanı bulunan sayfalarda bu sürüm analiz yapmaz.';
      return;
    }
    status.textContent = 'Yerel kontrol tamamlandı.';
    result.textContent = finding.missing
      ? 'Bulgu: Sayfa dili tanımlanmamış.\nÖğe: html\nKural: WCAG 3.1.1\nŞiddet: Orta\nKanıt: html öğesinin lang niteliği yok veya boş.\nÖneri: Sayfanın gerçek diline uygun lang niteliği ekle; Türkçe için lang="tr". '
      : `Sayfa dili niteliği mevcut: ${finding.language}\nKanıt: html[lang] niteliği okundu.\nBu kontrol dil kodunun geçerliliğini veya içerikle eşleşmesini henüz doğrulamaz.`;
    const summary = document.createElement('p');
    summary.textContent = `Görseller: ${finding.imageCount} toplam, ${finding.visibleImageCount} görünür. Eksik alternatif metin bulgusu: ${finding.findings.filter(item => item.category === 'image').length}.\nForm alanları: ${finding.fieldCount} görünür. Etiket eksikliği adayı: ${finding.findings.filter(item => item.category === 'form').length}.\nBoş alt metninin uygunluğu ve alternatif adların kalitesi henüz değerlendirilmez. iframe ve Shadow DOM kapsam dışıdır.`;
    result.append(summary);
    const targetSummary = document.createElement('p');
    targetSummary.textContent = `Dokunma hedefleri: ${finding.targetCount} ölçüldü. Küçük hedef adayı: ${finding.findings.filter(item => item.category === 'target').length}. Aralık ve diğer WCAG istisnaları otomatik değerlendirilmez; adaylar kesin ihlal sayılmaz.`;
    result.append(targetSummary);
    for (const item of finding.findings) {
      const card = document.createElement('article');
      const detail = document.createElement('p');
      detail.textContent = `${item.title}\nÖğe: ${item.selector}\nKural: ${item.rule}\nŞiddet: ${item.severity}\nKanıt: ${item.evidence}\nÖneri: ${item.recommendation}`;
      const show = document.createElement('button');
      show.textContent = 'Sayfada göster';
      show.addEventListener('click', async () => {
        show.disabled = true;
        try {
          const [highlight] = await chrome.scripting.executeScript({
            target: { tabId: tab.id }, args: [item.selector, item.tag, item.category],
            func: (selector, tag, category) => {
              if (document.querySelector('input[type="password"]')) return 'blocked';
              const element = document.querySelector(selector);
              if (!element || element.tagName !== tag || (category === 'image' && element.hasAttribute('alt'))) return 'stale';
              if (category === 'target') {
                const bounds = element.getBoundingClientRect();
                if (bounds.width >= 24 && bounds.height >= 24) return 'stale';
              }
              const marker = document.createElement('div');
              marker.setAttribute('aria-hidden', 'true');
              marker.style.cssText = 'position:absolute;pointer-events:none;border:4px solid #e11d48;box-sizing:border-box;z-index:2147483647;background:transparent;';
              const rect = element.getBoundingClientRect();
              Object.assign(marker.style, { left: `${rect.left + scrollX}px`, top: `${rect.top + scrollY}px`, width: `${rect.width}px`, height: `${rect.height}px` });
              document.documentElement.append(marker);
              element.scrollIntoView({ block: 'center', behavior: 'instant' });
              setTimeout(() => marker.remove(), 4000);
              return 'shown';
            }
          });
          status.textContent = highlight.result === 'shown' ? 'Öğe dört saniye boyunca kırmızı çerçeveyle vurgulandı.' : 'Sayfa değişmiş veya analiz engellenmiş. Kontrolü yeniden başlat.';
        } catch (error) {
          status.textContent = `Vurgulama çalışmadı: ${error.message}`;
        } finally { show.disabled = false; }
      });
      card.append(detail, show);
      result.append(card);
    }
  } catch (error) {
    const message = error.message || String(error);
    status.textContent = /permission|Cannot access|host permission/i.test(message)
      ? `Sayfaya erişim izni yok. Paneli kapat; web sayfasının sekmesindeyken Chrome araç çubuğundaki UX Kanıt simgesine basıp tekrar dene. Teknik ayrıntı: ${message}`
      : `Kontrol çalışmadı: ${message}`;
  } finally {
    button.disabled = false;
  }
});
