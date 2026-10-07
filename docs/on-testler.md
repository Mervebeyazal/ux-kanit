# Üç site ön testi — 7 Ekim 2026

Eklenti sürümü: 0.3.0. Kaynak: kullanıcının sohbet üzerinden paylaştığı panel çıktıları ve ekran görüntüleri. Bu kayıtlar bağımsız tarayıcı denetimi veya eklentiden dışa aktarılmış nihai JSON raporları değildir. Sayfaların tam son adresleri, analiz saatleri, ekran boyutları ve çerez durumları kaydedilmedi. Ana sayfa adresleri test için önerilen adreslerdir.

| Kategori | Önerilen ana sayfa | Dil | Toplam görsel | Görünür görsel | Alt metni eksik adayı | Görünür form alanı | Etiket eksikliği adayı |
|---|---|---|---:|---:|---:|---:|---:|
| Sağlık | https://www.acibadem.com.tr/ | tr | 153 | 92 | 0 | 1 | 1 |
| Türk e-ticaret | https://www.hepsiburada.com/ | tr | 88 | 82 | 33 | 1 | 0 |
| Kamu | https://www.ibb.istanbul/ | tr | 37 | 36 | 0 | 1 | 1 |

## Kanıt ve doğrulama durumu

- Acıbadem: Kullanıcının görüntüsünde arama kutusu kırmızı çerçeveyle vurgulandı. Alanın erişilebilir adı ekran okuyucuyla henüz denetlenmedi. WCAG 4.1.2 adayı doğrulama bekliyor.
- Hepsiburada: Paylaşılan 33 seçici footer içindeki img öğelerine ait. Kullanıcı alt bölümdeki görsellerin çerçevelendiğini gösterdi; YouTube ve Instagram simgelerinin de işaretlendiğini bildirdi. Görsellerin dekoratif olup olmadığı ve üst bağlantıların erişilebilir adları henüz denetlenmedi. 33 sayısı kesin ihlal sayısı değildir. İlk paylaşılan Webasto Isıtıcı görüntüsü belirli bir seçiciyle eşleştirilemedi; bu görüntü doğrulanmış bulgu kanıtı sayılmadı.
- İBB: Görüntüde 'Size nasıl yardımcı olabiliriz?' metnini gösteren arama alanı kırmızı çerçeveyle vurgulandı. Görseldeki yer tutucu yazı erişilebilir adın varlığını veya yokluğunu kanıtlamaz. WCAG 4.1.2 adayı ekran okuyucu doğrulaması bekliyor.

## İBB form adayı seçicisi

```css
html > body:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > header:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > input:nth-of-type(1)
```

Panel kanıtı: Görünür form alanında metinli ilişkili label, dolu aria-label, metinli bir öğeye çözülen aria-labelledby veya dolu title bulunamadı. Alanın değeri okunmadı.

## Tamamlanmamış doğrulamalar

LLM değerlendirmesi, skorlar, üç tekrarlı tutarlılık testi, klavye ve ekran okuyucu görevi, halüsinasyon oranı, büyükanne ve gece 3 senaryoları henüz gerçekleştirilmedi. Nihai raporlar tüm analiz katmanları tamamlanınca yeniden alınmalı. Sıfır bulgu tam erişilebilirlik anlamına gelmez.

## Kontrast ön testi ve bulunan yanlış ölçüm

Kullanıcının 0.6.0 Acıbadem çıktısı: 151 öğe ölçüldü, 10 düşük kontrast adayı, 211 ölçülemeyen öğe. 'Doktorunuz ile Görüntülü Görüşün' başlığı için beyaz metin/açık mavi arka plan ve 1.211:1 oran raporlandı. Kullanıcının ekran görüntüsü metnin fotoğraf üzerinde olduğunu gösterdi. Dolayısıyla bu CSS arka plan ölçümü geçersiz; bu aday doğrulanmış ihlal sayılmadı. Fotoğraftaki gerçek kontrastın yeterli olduğu da bu görüntüden sayısal olarak doğrulanmadı.

0.6.1'de img/video/canvas/svg ile sınır kutusu örtüşen metinleri ölçülemeyen olarak ayıran kontrol ve regresyon testi eklendi. Gerçek sitedeki düzeltme henüz yeniden test edilmedi; 0.6.0 sayıları nihai raporda kullanılmamalı.
