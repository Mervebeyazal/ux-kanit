# Nihai raporlar

Bu klasöre eklentinin JSON raporunu indir düğmesinden alınan gerçek site raporları eklenecek. Henüz nihai rapor yok. Ön testler docs/on-testler.md içindedir. LLM ve doğrulama tamamlanmadan raporlar nihai teslim kabul edilmemelidir. Aynı siteyi farklı sürümlerle karşılaştırırken model ve eklenti sürümlerini belirtin.

## Acıbadem ön raporu

acibadem-preliminary-2026-10-07.json kullanıcının indirdiği gerçek dosyanın değiştirilmemiş kopyasıdır. Deterministik ön skor 76.23468877504196; 55 aday (1 form, 37 hedef, 13 ad, 4 kontrast). Skor dosyadaki sayılardan yeniden hesaplanıp eşleşti. LLM ve toplam skor null; tüm adayların manuel doğrulaması bekliyor. Dosyada form değerleri veya sayfa metni alanları bulunmuyor.

Sürüm tutarsızlığı: panel çıktısı 0.7.0 gösterse de JSON extensionVersion alanı 0.2.0 bildiriyor. Yerel manifest 0.7.0. Chrome'a yüklenmiş manifestin yenilenmemiş olması olası neden, henüz kesinleşmedi. Kaynak dosya değiştirilmedi; nihai rapor yerine ön kayıt olarak saklandı. Eklenti Chrome Uzantılar sayfasından yeniden yüklendikten sonra yeni dışa aktarımda sürüm kontrol edilmeli.

### Yeniden yükleme sonrası kayıt

acibadem-0.7.0-preliminary.json yeni indirilen dosyanın değiştirilmemiş kopyasıdır. 2026-10-07T17:06:16.234Z anında extensionVersion=0.7.0 olarak kaydedildi; sürüm tutarsızlığı yeniden yükleme sonrası giderildi. Skor yeniden hesaplanıp doğrulandı: 76.23468877504196. 55 aday: 1 form, 37 hedef, 13 ad, 4 kontrast. Güncel Acıbadem ön kaydı olarak bu dosya kullanılmalı; eski kayıt yalnızca tutarsızlığın izini korur. LLM ve manuel doğrulama tamamlanmadığı için bu da nihai rapor değildir.

## Hepsiburada ön raporu

hepsiburada-0.7.0-preliminary.json kullanıcının indirdiği dosyanın değiştirilmemiş kopyasıdır. Kayıt zamanı 2026-10-07T17:07:29.252Z; sürüm 0.7.0. Ön skor dosyadaki sayılardan yeniden hesaplanıp eşleşti: 85.81208281646879. 254 kategori adayı: 34 görsel, 152 küçük hedef, 56 adsız kontrol, 12 kontrast. Aynı DOM öğesi farklı kategorilerde yer alabilir; 254 benzersiz öğe veya kesin ihlal anlamına gelmez. Form alanı 1, etiket adayı 0. Kontrast 243 öğede ölçüldü, 214 öğe ölçülemedi. Kategoriler öğe oranıyla ağırlıklandırıldığından daha fazla aday sayısı her zaman daha düşük toplam skor anlamına gelmez. LLM ve manuel doğrulama bekliyor.

## İBB ön raporu

ibb-0.7.0-preliminary.json kullanıcının indirdiği dosyanın değiştirilmemiş kopyasıdır. Kayıt zamanı 2026-10-07T17:08:30.966Z; sürüm 0.7.0. Ön skor yeniden hesaplanıp eşleşti: 73.48484848484848. 14 aday: 1 form, 10 küçük hedef, 3 kontrast. 36 görünür görselde alt adayı ve 98 kontrolde adsız kontrol adayı yok. 99 hedef ölçüldü; kontrast 15 öğede ölçüldü, 82 öğe ölçülemedi. Özellikle kontrast kapsamı düşük olduğundan toplam skor kesin uygunluk veya siteler arası kalite sıralaması olarak yorumlanmamalı. LLM ve manuel doğrulama bekliyor.

## 0.7.0 ön kayıt özeti

| Kategori | Site | Deterministik ön skor | Kategori adayları |
|---|---|---:|---:|
| Sağlık | Acıbadem | 76.23 | 55 |
| Türk e-ticaret | Hepsiburada | 85.81 | 254 |
| Kamu | İBB | 73.48 | 14 |

Üç dosyanın skorları yeniden hesaplandı ve temel bulgu alanları kontrol edildi. Bu doğrulama, bulguların gerçek ihlal olduğunu veya manuel testlerin tamamlandığını kanıtlamaz. Üç raporda da LLM ve birleşik skor henüz yoktur.

Ek manuel karşılaştırma raporu: `acibadem-atasehir-0.8.1-manual-comparison.json`. Kullanıcı tarafından hastane bilgisi görevi sonrasında dışa aktarıldı; sayfa ilişkilendirmesi sohbet bağlamına dayanır (JSON yalnızca origin içerir). Ön skor 80.31; 81 aday (form 5, hedef 62, kontrol adı 4, kontrast 10). Alt skorlar yeniden hesaplandı. Bulgular henüz tek tek doğrulanmadı; LLM değerlendirilmedi. Ayrıntılar: [Manuel denetim](../docs/manuel-denetim.md).

Hepsiburada güncel AI kaydı: [hepsiburada-groq-0.8.10.json](hepsiburada-groq-0.8.10.json). Yerel ön skor 89.1; AI 70 (1/6), birleşik skor yok. Üç öneriden biri kabul; canlı DOM ve yorum doğrulaması bekliyor.

İBB güncel AI kaydı: [ibb-groq-0.8.10.json](ibb-groq-0.8.10.json). 2026-10-08T09:33:25.297Z; yerel ön skor 73.45, AI 73.33 (3/6), birleşik skor yok. Üç önerinin seçici/ölçüm kontrolü geçti; canlı hedef ve yorum doğrulaması bekliyor.

[ibb-task-0.9.0-unvalidated.json](ibb-task-0.9.0-unvalidated.json) altı ilke ve toplam skor üreten gerçek koşunun ham kaydıdır. Kısıtlar gözlemi manuel testle çeliştiği için 80.09 toplamı doğrulanmış nihai sonuç değildir; dosya değiştirilmedi.
