# Nihai raporlar

Bu klasöre eklentinin JSON raporunu indir düğmesinden alınan gerçek site raporları eklenecek. Henüz nihai rapor yok. Ön testler docs/on-testler.md içindedir. LLM ve doğrulama tamamlanmadan raporlar nihai teslim kabul edilmemelidir. Aynı siteyi farklı sürümlerle karşılaştırırken model ve eklenti sürümlerini belirtin.

## Acıbadem ön raporu

acibadem-preliminary-2026-10-07.json kullanıcının indirdiği gerçek dosyanın değiştirilmemiş kopyasıdır. Deterministik ön skor 76.23468877504196; 55 aday (1 form, 37 hedef, 13 ad, 4 kontrast). Skor dosyadaki sayılardan yeniden hesaplanıp eşleşti. LLM ve toplam skor null; tüm adayların manuel doğrulaması bekliyor. Dosyada form değerleri veya sayfa metni alanları bulunmuyor.

Sürüm tutarsızlığı: panel çıktısı 0.7.0 gösterse de JSON extensionVersion alanı 0.2.0 bildiriyor. Yerel manifest 0.7.0. Chrome'a yüklenmiş manifestin yenilenmemiş olması olası neden, henüz kesinleşmedi. Kaynak dosya değiştirilmedi; nihai rapor yerine ön kayıt olarak saklandı. Eklenti Chrome Uzantılar sayfasından yeniden yüklendikten sonra yeni dışa aktarımda sürüm kontrol edilmeli.

### Yeniden yükleme sonrası kayıt

acibadem-0.7.0-preliminary.json yeni indirilen dosyanın değiştirilmemiş kopyasıdır. 2026-10-07T17:06:16.234Z anında extensionVersion=0.7.0 olarak kaydedildi; sürüm tutarsızlığı yeniden yükleme sonrası giderildi. Skor yeniden hesaplanıp doğrulandı: 76.23468877504196. 55 aday: 1 form, 37 hedef, 13 ad, 4 kontrast. Güncel Acıbadem ön kaydı olarak bu dosya kullanılmalı; eski kayıt yalnızca tutarsızlığın izini korur. LLM ve manuel doğrulama tamamlanmadığı için bu da nihai rapor değildir.

## Hepsiburada ön raporu

hepsiburada-0.7.0-preliminary.json kullanıcının indirdiği dosyanın değiştirilmemiş kopyasıdır. Kayıt zamanı 2026-10-07T17:07:29.252Z; sürüm 0.7.0. Ön skor dosyadaki sayılardan yeniden hesaplanıp eşleşti: 85.81208281646879. 254 kategori adayı: 34 görsel, 152 küçük hedef, 56 adsız kontrol, 12 kontrast. Aynı DOM öğesi farklı kategorilerde yer alabilir; 254 benzersiz öğe veya kesin ihlal anlamına gelmez. Form alanı 1, etiket adayı 0. Kontrast 243 öğede ölçüldü, 214 öğe ölçülemedi. Kategoriler öğe oranıyla ağırlıklandırıldığından daha fazla aday sayısı her zaman daha düşük toplam skor anlamına gelmez. LLM ve manuel doğrulama bekliyor.
