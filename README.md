# UX Kanıt — Adım 3 (0.3.0)

Bu, Deneyim Mühendisliği ödevi için geliştirilen ilk iskelettir. Tam teslim sürümü değildir.

## Chrome'a yükleme

1. Chrome adres çubuğunda `chrome://extensions` açın.
2. Sağ üstte Geliştirici modu seçeneğini açın.
3. Paketlenmemiş öğe yükle düğmesine basın.
4. Bu README ile manifest.json dosyasının bulunduğu ux-kanit klasörünü seçin.
5. Herkese açık bir web sayfası açın. Eklentiler menüsünden UX Kanıt simgesine basın.
6. Sayfanın uygunluğunu doğrulayın ve dil kontrolünü başlatın.

## Bu adımın kapsamı

Manifest V3, yan panel ve kullanıcı tarafından başlatılan tek bir deterministik kontrol: html lang niteliğinin eksik veya boş olması. Form değerleri, sayfa metni, çerezler ve klavye vuruşları okunmaz. Ağ isteği ve API anahtarı yoktur. Parola alanı görülen sayfa engellenir; diğer hassas sayfalar için kullanıcı doğrulaması gerekir. Parola alanı kontrolü hassas sayfaları eksiksiz tanımaz.

## Henüz tamamlanmayanlar

axe-core, diğer kontroller, Norman LLM katmanı, skorlar, JSON dışa aktarımı, üç site raporu, manuel ekran okuyucu testi, tekrar ölçümleri, demo ve yansıtma notu sonraki adımlardadır. Doğrulama sonuçları henüz yoktur.

## Eksik alternatif metin kontrolü

Görünür img öğeleri içinde alt niteliği bulunmayan ve alternatif ad ya da açık dekoratif semantik taşımayan öğeler raporlanır. alt="" otomatik ihlal sayılmaz; dekoratif görsellerde geçerlidir. Bulgu WCAG 1.1.1 ile ilişkilidir ancak kesin WCAG ihlali ilan edilmeden görselin amacı elle doğrulanmalıdır. Her bulguda yapısal CSS seçicisi, kanıt, şiddet ve öneri vardır. Sayfada göster düğmesi dört saniyelik geçici, tıklamaları engellemeyen çerçeve ekler. Sayfa öğelerine tıklamaz ve form göndermez. Form değerleri ve görsel adresleri toplanmaz. iframe, Shadow DOM, CSS arka planları ve alternatif ad kalitesi kapsam dışıdır.

## Form etiketi kontrolü

Görünür input, select ve textarea alanlarında metinli ilişkili label, dolu aria-label, metinli referansa çözülen aria-labelledby ve title varlığı kontrol edilir. Alan değerleri, varsayılan değerler ve seçili seçenekler okunmaz. Tam erişilebilir ad hesaplaması değildir; adaylar manuel doğrulanmalıdır. Görünür etiket ve erişilebilir ad farklı kontrollerdir: bu sürüm erişilebilir ad adayı yokluğunu WCAG 4.1.2 ile ilişkilendirir, yalnızca aria-label bulunmasını WCAG 3.3.2 için yeterli saymaz. Kaynak: https://www.w3.org/WAI/tutorials/forms/labels/
