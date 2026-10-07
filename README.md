# UX Kanıt — Skor ve JSON (0.7.0)

Bu, Deneyim Mühendisliği ödevi için geliştirilen ilk iskelettir. Tam teslim sürümü değildir.

## Chrome'a yükleme

1. Chrome adres çubuğunda `chrome://extensions` açın.
2. Sağ üstte Geliştirici modu seçeneğini açın.
3. Paketlenmemiş öğe yükle düğmesine basın.
4. Bu README ile manifest.json dosyasının bulunduğu ux-kanit klasörünü seçin.
5. Herkese açık bir web sayfası açın. Eklentiler menüsünden UX Kanıt simgesine basın.
6. Sayfanın uygunluğunu doğrulayın ve Sayfayı kontrol et düğmesine basın.

## Bu adımın kapsamı

Manifest V3, yan panel ve kullanıcı tarafından başlatılan altı yerel kontrol: sayfa dili, görsel alternatif metni, form etiketi, hedef boyutu, düğme/bağlantı adı ve metin kontrastı. Form değerleri, çerezler ve klavye vuruşları okunmaz. Etiket ve kontrol metinlerinin yalnızca varlığı yerelde incelenir; içerikleri rapora alınmaz veya gönderilmez. Ağ isteği ve API anahtarı yoktur. Parola alanı görülen sayfa engellenir; diğer hassas sayfalar için kullanıcı doğrulaması gerekir. Parola alanı kontrolü hassas sayfaları eksiksiz tanımaz.

## Metin kontrastı

Doğrudan metin düğümü olan görünür öğelerin CSS renkleri yerelde incelenir; metin içerikleri rapora eklenmez. Form kontrolleri, düzenlenebilir içerik ve devre dışı kontroller kapsam dışıdır. Düz opak RGB arka plan bir üst öğeden çözülebiliyorsa oran=(L_açık+0.05)/(L_koyu+0.05) hesaplanır. sRGB kanalları c<=0.04045 için c/12.92, aksi halde ((c+0.055)/1.055)^2.4 ile lineerleştirilir; L=0.2126R+0.7152G+0.0722B. Eşik normal metin için 4.5, en az 24 CSS px veya en az 18.6667 CSS px ve 700 ağırlıktaki metin için 3'tür. Karşılaştırmada oran yuvarlanmaz.

Görsel/gradyan arka plan, saydam renk, opaklık efekti, filtre, blend, transform, metin gölgesi, üretilmiş sözde öğe veya bilinmeyen canvas rengi ölçülemeyen sayılır. Bu muhafazakâr uygulama ölçüm kapsamını azaltır. Üst üste binen kardeşler, videolar, özel boyama, logo istisnaları, hover/focus durumu, placeholder ve görsel içindeki metin ayrıca incelenmelidir. Ölçümler adaydır; tam WCAG uygunluk denetimi değildir. Kaynak: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

0.6.1 düzeltmesi: Metin öğesinin sınır kutusu görünür img/video/canvas/svg sınır kutusuyla örtüşürse oran hesaplanmaz. Böylece kardeş öğe olarak konumlandırılmış fotoğrafı CSS arka plan rengi sanan yanlış ölçüm engellenir. Katman sırası çözülmediği için ilgisiz örtüşmeler de ölçümü dışarıda bırakabilir; bu, bilinçli olarak muhafazakâr bir yaklaşımdır.

## Henüz tamamlanmayanlar

axe-core, Norman LLM katmanı, birleşik skorun tamamlanması, üç nihai site raporu, manuel ekran okuyucu testi, LLM tekrar ölçümleri, demo ve yansıtma notu sonraki adımlardadır. Ön testler docs/on-testler.md içinde; nihai doğrulama tamamlanmadı.

## Skor formülü ve gerekçe

Bu sürümün skoru doğrulanmış WCAG uygunluk puanı değil, aday bulgulara dayalı ön tarama göstergesidir. Her kategori için n ölçülen öğe sayısı, f aynı kategoride benzersiz seçiciye sahip aday sayısıdır: S=100×(1−f/n). n=0 ise S=null; ölçülemeyen öğeler başarı kabul edilmez. Sayfa dili kategorisinde n=1. Görsel için görünür görseller, form için incelenen görünür alanlar, hedef için ölçülen hedefler, ad için sınır nedeniyle belirsiz olmayan kontroller, kontrast için yalnızca güvenilir ölçülen metin öğeleri kullanılır. Ad ve kontrast için kapsam oranı n/(n+bilinmeyen) ayrıca JSON'da tutulur; bu diğer kapsam dışı DOM öğelerini kapsamaz.

| Kategori | Ağırlık |
|---|---:|
| Dil | 5 |
| Görseller | 15 |
| Form | 20 |
| Hedef boyutu | 15 |
| Kontrol adı | 20 |
| Kontrast | 25 |

Deterministik ön toplam D=Σ(w×S)/Σ(w), yalnızca skoru null olmayan kategoriler üzerinde hesaplanır. Payda availableWeight alanındadır. Form ve kontrol adları temel işlemleri, kontrast geniş metin okunabilirliğini etkilediği için daha yüksek ağırlık alır; bu ağırlıklar proje tasarım kararıdır, WCAG'nin resmi puan sistemi değildir. Öğe oranı kullanımı büyük sayfalarda salt bulgu sayısının puanı gereksizce düşürmesini önler. Şiddet bu sürümde inceleme önceliğini gösterir, formülde ayrıca çarpılmaz; kategoride aynı öğe iki kez cezalandırılmaz. Çok sayıda sorunsuz öğe önemli bir tek sorunun etkisini seyreltebilir; bu sınırlama nedeniyle kritik görevler ayrıca manuel denetlenir.

LLM toplamı L uygulandıktan sonra planlanan birleşik toplam T=0.60D+0.40L'dir. D veya L yoksa T=null; eksik LLM skoru 0 veya 100 ile doldurulmaz. LLM katmanı henüz uygulanmadığından panel ve JSON bunu açıkça belirtir. Norman ilkelerinin ağırlıkları ve L formülü ilgili katman geliştirilirken belgelenecek. Skor modeli candidate-rate-v1 olarak sürümlenir; elle doğrulanmış ihlal skoru ile karıştırılmamalıdır.

## JSON dışa aktarımı

Başarılı analizden sonra JSON raporunu indir düğmesi sonuçları yerel dosyaya kaydeder. Raporda zaman, eklenti/model sürümü, kategori skorları, kapsam/sayılar, seçiciler, kanıtlar, öneriler ve manuel doğrulama durumu bulunur. Form değerleri ve sayfa metinleri yoktur. Adresin yalnızca origin kısmı kaydedilir; hassas yol/sorgu/fragment dışarı aktarılmaz. Test edilen herkese açık tam adres doğrulama notunda ayrıca kaydedilmeli. Yeni veya başarısız analiz eski raporu indirilebilir bırakmaz. JSON bir anlık görüntüdür; sayfa değişirse yeniden analiz gerekir. on-demand-highlight alanı vurgulamanın kullanılabilir olduğunu belirtir, her öğenin manuel doğrulandığını iddia etmez.

## Düğme ve bağlantı adı kontrolü

Ölçülebilen, etkin bağlantılar/düğmeler ve role=button/link kontrollerinde ad kaynaklarının varlığı incelenir. Mevcut aria-labelledby referansları önceliklidir; ardından aria-label, gizlenmemiş içerik (görsel alt ve SVG title dahil) ve title incelenir. Gizli doğrudan ad referansları da değerlendirilir. Form kontrollerinin değerleri okunmaz; ad metinleri rapora yazılmaz. Adaylar WCAG 4.1.2 ile ilişkilendirilir ancak kesin ihlal ilan edilmez. Bu, tam Accessible Name Computation uygulaması değildir: CSS sözde öğeleri, karmaşık iç içe ARIA referansları, özel bileşenler, iframe ve Shadow DOM kapsam dışıdır. Her kontrol için 1500 düğüm/60 derinlik sınırı vardır; sınır aşımı bulgu yerine belirsiz sayılır. Adın kalitesi, görünür metinle uyumu ve ekran okuyucu çıktısı ayrıca denetlenmelidir. Kaynak: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html

## Eksik alternatif metin kontrolü

Görünür img öğeleri içinde alt niteliği bulunmayan ve alternatif ad ya da açık dekoratif semantik taşımayan öğeler raporlanır. alt="" otomatik ihlal sayılmaz; dekoratif görsellerde geçerlidir. Bulgu WCAG 1.1.1 ile ilişkilidir ancak kesin WCAG ihlali ilan edilmeden görselin amacı elle doğrulanmalıdır. Her bulguda yapısal CSS seçicisi, kanıt, şiddet ve öneri vardır. Sayfada göster düğmesi dört saniyelik geçici, tıklamaları engellemeyen çerçeve ekler. Sayfa öğelerine tıklamaz ve form göndermez. Form değerleri ve görsel adresleri toplanmaz. iframe, Shadow DOM, CSS arka planları ve alternatif ad kalitesi kapsam dışıdır.

## Form etiketi kontrolü

Görünür input, select ve textarea alanlarında metinli ilişkili label, dolu aria-label, metinli referansa çözülen aria-labelledby ve title varlığı kontrol edilir. Alan değerleri, varsayılan değerler ve seçili seçenekler okunmaz. Tam erişilebilir ad hesaplaması değildir; adaylar manuel doğrulanmalıdır. Görünür etiket ve erişilebilir ad farklı kontrollerdir: bu sürüm erişilebilir ad adayı yokluğunu WCAG 4.1.2 ile ilişkilendirir, yalnızca aria-label bulunmasını WCAG 3.3.2 için yeterli saymaz. Kaynak: https://www.w3.org/WAI/tutorials/forms/labels/

## Dokunma hedefi boyutu

Bağlantılar, düğmeler, görünür yerel form kontrolleri ve role=button/link öğeleri getBoundingClientRect ile ölçülür. Genişlik VEYA yükseklik 24 CSS px altındaysa aday raporlanır; tam 24 × 24 sınırın altı değildir. Sıfır boyutlu, gizli, inert, devre dışı veya pointer-events:none öğeleri hariç tutulur. Ham ölçümler bulguya eklenir; gösterim iki ondalıkla yapılır. Değerler okunmaz ve kontrol hiçbir öğeyi etkinleştirmez.

Bu bir sınır kutusu ölçümüdür; gerçek tıklanabilir şekli, üstü örtülmüş alanları, taşan alt öğeleri, çok satırlı bağlantıların birleşik alanını ve özel JavaScript tıklama alanlarını tam belirleyemez. Ekran dışında düzenlenen öğeler de ölçülebilir. Boyutu yeterli öğelere kesin uygunluk sonucu verilmez. WCAG 2.5.8'in aralık, eşdeğer kontrol, satır içi hedef, tarayıcı kontrolü ve zorunlu sunum istisnaları otomatik hesaplanmaz; küçük hedef adayları manuel doğrulanmalıdır. Kaynak: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
