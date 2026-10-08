// Only fixed UI tokens and structural facts leave the page; never raw text.
globalThis.UXSnapshot = (preferredSelector=null) => {
  if (!/^https?:$/.test(location.protocol) || document.querySelector('input[type="password"]')) throw new Error('Bu sayfada AI analizi engellendi.');
  const tokens = new Map(['ara', 'arama', 'randevu al', 'doktor bul', 'hastane bul', 'giriş yap', 'üye ol', 'menü', 'geri', 'ileri', 'detaylı bilgi', 'iletişim', 'yardım', 'sepete ekle', 'satın al', 'gönder', 'kapat'].map(text => [text, text]));
  function selectorFor(element) {
    const parts = [];
    while (element && element !== document.documentElement) {
      const peers = [...element.parentElement.children].filter(peer => peer.tagName === element.tagName);
      parts.unshift(`${element.localName}:nth-of-type(${peers.indexOf(element) + 1})`);
      element = element.parentElement;
    }
    return ['html', ...parts].join(' > ');
  }
  const eligible = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="status"], [role="alert"]')].filter(element => {
    const style = getComputedStyle(element), rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && style.visibility === 'visible' && style.opacity !== '0' &&
      !element.closest('[aria-hidden="true"], [inert], [contenteditable]:not([contenteditable="false"])');
  });
  const preferred=preferredSelector ? document.querySelector(preferredSelector) : null;
  const sample=preferred && eligible.includes(preferred) ? [preferred,...eligible.filter(el=>el!==preferred)] : eligible;
  const elements = sample.slice(0, 20).map(element => {
    const field = element.matches('input, textarea, select');
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    let uiToken = null;
    // Inputs, placeholders, options and values are never consulted.
    if (!field && !element.querySelector('input, textarea, select, [contenteditable]')) {
      const candidate = (element.getAttribute('aria-label') || element.textContent || '').trim().toLocaleLowerCase('tr').replace(/\s+/g, ' ');
      uiToken = tokens.get(candidate) || null;
    }
    const hasName = field
      ? !!(element.getAttribute('aria-label')?.trim() || element.getAttribute('aria-labelledby')?.trim() || element.labels?.length || element.getAttribute('title')?.trim())
      : globalThis.UXControlName(element, document, getComputedStyle).present;
    const role = element.getAttribute('role');
    return { selector: selectorFor(element), facts: {
      tag: element.tagName.toLowerCase(), width: Number(rect.width.toFixed(2)), height: Number(rect.height.toFixed(2)),
      x: Number(rect.left.toFixed(2)), y: Number(rect.top.toFixed(2)), fontSize: parseFloat(style.fontSize),
      hasName, uiToken, isField: field, formValue: field ? '[MASKED]' : null,
      required: field && element.hasAttribute('required'), disabled: element.matches(':disabled, [aria-disabled="true"]'),
      statusRole: ['status', 'alert'].includes(role) ? role : null,
      expanded: element.hasAttribute('aria-expanded') ? element.getAttribute('aria-expanded') === 'true' : null,
      inViewport: rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth
    } };
  });
  return { snapshotVersion: 'static-ui-v1', observationMode: 'static-no-interactions',
    viewport: { width: innerWidth, height: innerHeight }, eligibleCount: eligible.length, sampledCount: elements.length,
    elements, limitations: ['İlk 20 görünür UI öğesi; sayfanın tamamı değil.', 'Form değerleri maskeli; ham sayfa metni ve URL gönderilmez.', 'Etkileşim sonrası geri bildirim ve görev başarısı gözlenmedi.'] };
};

