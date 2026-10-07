# Nihai raporlar

Bu klasöre eklentinin JSON raporunu indir düğmesinden alınan gerçek site raporları eklenecek. Henüz nihai rapor yok. Ön testler docs/on-testler.md içindedir. LLM ve doğrulama tamamlanmadan raporlar nihai teslim kabul edilmemelidir. Aynı siteyi farklı sürümlerle karşılaştırırken model ve eklenti sürümlerini belirtin.

## Acıbadem ön raporu

acibadem-preliminary-2026-10-07.json kullanıcının indirdiği gerçek dosyanın değiştirilmemiş kopyasıdır. Deterministik ön skor 76.23468877504196; 55 aday (1 form, 37 hedef, 13 ad, 4 kontrast). Skor dosyadaki sayılardan yeniden hesaplanıp eşleşti. LLM ve toplam skor null; tüm adayların manuel doğrulaması bekliyor. Dosyada form değerleri veya sayfa metni alanları bulunmuyor.

Sürüm tutarsızlığı: panel çıktısı 0.7.0 gösterse de JSON extensionVersion alanı 0.2.0 bildiriyor. Yerel manifest 0.7.0. Chrome'a yüklenmiş manifestin yenilenmemiş olması olası neden, henüz kesinleşmedi. Kaynak dosya değiştirilmedi; nihai rapor yerine ön kayıt olarak saklandı. Eklenti Chrome Uzantılar sayfasından yeniden yüklendikten sonra yeni dışa aktarımda sürüm kontrol edilmeli.
