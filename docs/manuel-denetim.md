# Manuel denetim — devam eden kayıt

Kaynak: kullanıcının sohbet üzerinden bildirdiği gerçek klavye ve Windows Ekran Okuyucusu gözlemleri. Test sayfası: Acıbadem ana sayfası (önerilen adres https://www.acibadem.com.tr/). Chrome sürümü ve ekran okuyucu sürümü henüz kaydedilmedi. Bu belge tamamlanmış manuel görev raporu değildir.

## Arama alanına erişim

Kullanıcı Tab/Shift+Tab ile arama alanına ulaşabildiğini ve her şeyin iyi olduğunu bildirdi. Kullanıcı sonraki yanıtında Tab ile ilerlerken odak çerçevesini görebildiğini doğruladı. Klavye tuzağı ayrı olarak doğrulanmadı.

Windows Ekran Okuyucusu ile alana odaklandığında kullanıcı 'Acıbademde arayın' duyurusunu bildirdi. Söylenen ifade alanın amacını aktarıyor. Aracın etiket adayı kontrolü label/ARIA/title varlığını denetliyordu; placeholder gibi tarayıcı/ekran okuyucu yedek ad kaynaklarını tam hesaplamıyordu. Duyurunun tam olarak hangi kaynaktan üretildiği doğrulanmadı. Bu nedenle aday 'kesin erişilebilir ad yok' şeklinde yorumlanamaz; olası yanlış alarm veya eksik ad hesabı olarak inceleme bekler. Bu gözlem tek başına görünür label veya WCAG uygunluğunu kanıtlamaz.

| Konu | Araç çıktısı | Manuel gözlem | Karşılaştırma durumu |
|---|---|---|---|
| Arama alanına klavye erişimi | Araç klavye gezinimini test etmiyor | Kullanıcı alana Tab ile ulaştı | Manuel olarak gözlendi; araç kapsamı dışında |
| Arama alanının erişilebilir adı | 1 etiket eksikliği adayı | Ekran okuyucu 'Acıbademde arayın' dedi | Olası yanlış alarm; ad kaynağı ve placeholder fallback doğrulanmalı |
| Odak görünürlüğü | Araç test etmiyor | Kullanıcı Tab ile ilerlerken odak çerçevesini görebildiğini doğruladı | Test edilen gezinimde kullanıcı bildirimiyle gözlendi |
| Klavye tuzağı | Araç test etmiyor | Ayrı ölçüt yanıtı alınmadı | Değerlendirilmedi |

## Henüz tamamlanmayan görev

Yalnızca alanı bulmak ve duyurusunu dinlemek gözlendi. Hastane bilgisine klavye ve ekran okuyucuyla ulaşma görevi, sonucu ve engelleri henüz kaydedilmedi. Nihai karşılaştırmada yakalanan/kaçırılan/yanlış alarm ayrımı, doğrulanmış gözlemlerle tamamlanmalı.

### Hastane bilgi sayfasına ulaşma — yeni gözlem

Kullanıcı 'detaylı bilgi ile buraya geldim' diyerek Acıbadem Ataşehir Hastanesi sayfasının ekran görüntüsünü paylaştı. Görüntüde hastane başlığı, adres, iletişim alanı ve Yol tarifi al bağlantısı görülüyor. Kanıt: [Hedef sayfa görüntüsü](evidence/acibadem-atasehir-manual-destination.png).

Hedef sayfaya ulaşma sonucu görsel olarak doğrulandı. Kullanıcı sonraki yanıtında fare kullanmadığını doğruladı. Ekran okuyucunun bağlantı duyurusu sorulduğunda yalnızca 'Detaylı Bilgi' dediğini açıkladı. Kullanıcı bildirimine göre klavye ve ekran okuyucuyla hastane bilgi sayfasına ulaşma görevi tamamlandı; gezinim kaydı veya ses kaydı alınmadı. Tam hedef URL ve tarayıcı/ekran okuyucu sürümleri henüz yok.

| Konu | Araç çıktısı | Manuel gözlem | Karşılaştırma durumu |
|---|---|---|---|
| Hastane bilgi sayfasına erişme | Statik kontroller görev başarısını ölçmüyor | Kullanıcı fare kullanmadan Ataşehir Hastanesi bilgi sayfasına ulaştı; hedef görüntüsü mevcut | Görev sonucu kullanıcı bildirimi ve ekran görüntüsüyle doğrulandı |
| Detaylı Bilgi bağlantısının bağlamı | Mevcut ad kontrolü boş olmayan bağlantı metnini yeterli aday ad sayar; bağlamsal açıklığı değerlendirmez | Ekran okuyucu yalnızca 'Detaylı Bilgi' dedi; hastane adı birlikte okunmadı | Araç kapsamı dışında kalan kullanılabilirlik adayı; kesin WCAG ihlali olarak sayılmadı |

Öneri: Bağlantının erişilebilir adında hastane adını da belirtmek (ör. 'Acıbadem Ataşehir Hastanesi hakkında detaylı bilgi'). Duyuru tek başına WCAG 2.4.4 ihlalini kanıtlamaz: programatik olarak belirlenebilen çevre bağlamı ayrıca incelenmelidir. Kullanıcı Tab ile ilerlerken görünür odak çerçevesini görebildiğini doğruladı. Bu gözlem tüm öğelerde odak uygunluğu anlamına gelmez. Görev sırasında yaşanan güçlük henüz ayrı olarak doğrulanmadı.

## Büyükanne Testi — senaryo gözlemi

Görev: Ataşehir Hastanesi'nin telefonunu bulmak. Kullanıcı telefonun Ataşehir Hastanesi bilgi sayfasında büyük biçimde gösterildiğini ve hiç zorlanmadığını bildirdi; bunun ana sayfa değil hastane bilgi sayfası olduğunu ayrıca doğruladı. Yukarıdaki hedef sayfa görüntüsünde iletişim alanı görülüyor.

Sonuç yalnızca bilgi sayfasında telefonun fark edilmesine ilişkindir. Ana sayfadan toplam adım sayısı ve süre ölçülmedi. Yaşlı bir katılımcıyla test yapılmadı; bu kayıt senaryo temelli incelemedir. Aracın mevcut statik kontrolleri telefon bulma görevini veya yaşlı kullanıcı başarısını ölçmez. Bu adımda doğrulanmış kritik sorun bulunmadı; tüm senaryonun sorunsuz olduğu sonucuna varılamaz.

## Gece 3 Acil Durum Testi — senaryo gözlemi

Görev: Ataşehir Hastanesi acil servisinin 24 saat açık olup olmadığını bulmak. Kullanıcı bu bilgiyi bulamadığını bildirdi ve arama süresini yaklaşık 3 dakika olarak tahmin etti. Süre kronometreyle ölçülmedi; kullanıcı tahminidir. İzlenen tam gezinim yolu kaydedilmedi. Bu sonuç bilginin tüm sitede bulunmadığını veya acil servisin kapalı olduğunu kanıtlamaz.

7 Ekim 2026 resmî kaynak kontrolü: [Ataşehir Hastanesi bilgi sayfası](https://www.acibadem.com.tr/hastane/acibadem-atasehir-hastanesi/) Acil Servis birimini listeliyor; alınan sayfa metninde bu birimin saatlerini açıkça doğrulayan ifade bulunamadı. Çocuk kliniği için belirtilen 24 saat ifadesi acil servis saatlerinin kanıtı olarak kullanılmadı. [İletişim sayfasındaki](https://www.acibadem.com.tr/iletisim/) çağrı merkezi için 7/24 ifadesi de acil servis çalışma saati anlamına gelmez.

Karşılaştırma: Mevcut altı deterministik kontrol bu bilgi bulma görevini değerlendirmiyor; LLM isteği kota/bakiye nedeniyle tamamlanmadığından bu sorun için AI tespiti iddia edilemez. Manuel incelemede acil durumda önemli olabilecek bilgiye erişim güçlüğü gözlendi. Öneri: Doğrulanmış acil servis çalışma saatlerini hastane sayfasında belirgin bir acil hizmetler alanında göstermek. Bu öneri hizmetin gerçek saatlerine ilişkin bir iddia değildir; kesin kritik ihlal veya skor cezası atanmadı.

## Görev sonrası yerel rapor

Kullanıcı hastane bilgi sayfasında analiz yapma yönergesinden sonra [0.8.1 JSON raporunu](../reports/acibadem-atasehir-0.8.1-manual-comparison.json) paylaştı. Tarih: 2026-10-07T18:30:20.572Z. Sayfa yolu JSON'da gizlilik nedeniyle yoktur; Ataşehir sayfasıyla ilişkilendirme görev bağlamına dayanır, JSON'dan bağımsız doğrulanamaz.

Deterministik ön skor 80.31/100. Toplam 81 aday: 5 form etiketi, 62 küçük hedef, 4 kontrol adı, 10 kontrast. Dil ve görsel kategorisinde aday yok. Alt skorlar benzersiz seçici sayısından yeniden hesaplandı ve raporla eşleşti. Kontrastta 119 öğe ölçüldü, 304 öğe ölçülemedi (kapsama %28.13); bu nedenle yüksek skor tüm metinlerin uygunluğu anlamına gelmez. Her adayın manuel inceleme durumu beklemededir. LLM ve birleşik skor boş; gerçek LLM bulgusu veya halüsinasyon oranı üretilemedi.

Bu rapor acil servis saatini bulma güçlüğünü ölçmez. Ana sayfadaki 'Detaylı Bilgi' duyurusu farklı sayfada gözlendiğinden yeni rapordaki belirli bir seçiciyle eşleştirilmedi. İlk form adayı D-1'in sayfada vurgulanması, hangi alana karşılık geldiğini doğrulamak için sonraki manuel adımdır.

### Vurgulama konum hatası — 0.8.1

Kullanıcının [vurgulama ekran görüntüsünde](evidence/acibadem-0.8.1-highlight-offset.png) form etiketi adayı seçildiğinde çerçeve tıbbi birimler listesindeki boş bir alanda görünüyor. Bu görüntü hedef form alanını doğrulamaz. Kod incelemesinde çerçeve koordinatlarının kaydırmadan önce bir kez hesaplandığı görüldü; sabit başlıklar ve yerleşim değişiklikleriyle konumun ayrışması mümkündür. Görüntüden tek başına hatanın kesin nedeni belirlenemez.

0.8.2 düzeltmesi çerçeveyi viewport koordinatlarıyla her animasyon karesinde hedef öğenin güncel sınır kutusuna taşır. Sözdizimi kontrolü geçti; gerçek sayfada yeniden doğrulama bekleniyor. Bu bir araç hatasıdır; sitenin erişilebilirlik ihlali veya LLM halüsinasyonu olarak sayılmadı.

Yeniden yükleme ve yeniden analiz yönergesinin ardından kullanıcı [yeni görüntüyü](evidence/acibadem-highlight-search-retest.png) gönderdi. Çerçeve artık 'Acıbadem’de ara…' arama alanını gösteriyor; paneldeki seçici ilk form adayı D-1'in seçicisiyle eşleşiyor. Böylece bu örnekte vurgulama konumu ve hedef öğenin varlığı görsel olarak doğrulandı. Sürüm etiketi görüntüde görünmediğinden 0.8.2 kullanımı yönerge bağlamına dayanır. Bu görüntü erişilebilir adın gerçekten eksik olduğunu kanıtlamaz; hastane bilgi sayfasındaki alanın ekran okuyucu duyurusu ayrıca doğrulanmalıdır. Ana sayfadaki önceki 'Acıbademde arayın' gözlemi farklı sayfaya aittir.



### D-1 ekran okuyucu karşılaştırması

Kullanıcı vurgulanan arama alanına ekran okuyucuyla geldiğinde 'Acıbadem’de ara' duyurusunu bildirdi. Böylece hastane bilgi sayfasında da alanın amacı kullanıcıya duyuruldu. D-1'in ölçtüğü label/ARIA/title eksikliği ile 'erişilebilir ad yok' iddiası aynı şey değildir. Adın hangi DOM kaynağından üretildiği doğrulanmadı; placeholder yedeği olasıdır. D-1, erişilebilir adın tamamen yokluğu bakımından olası yanlış alarm olarak kaydedildi; görünür kalıcı etiketin uygunluğu ve kesin WCAG sonucu henüz değerlendirilmedi. Orijinal JSON değiştirilmedi, skordan aday çıkarılmadı.

| Tür | Karşılaştırma sonucu | Kanıt ve sınır |
|---|---|---|
| Yakalanan aday | D-1 mevcut arama alanına işaret ediyor | Yeniden vurgulama görüntüsü öğenin varlığını doğruluyor; ihlali doğrulamıyor |
| Olası yanlış alarm | D-1 erişilebilir adın tamamen yokluğu şeklinde yorumlanırsa | Kullanıcı ekran okuyucudan 'Acıbadem’de ara' duydu; ad kaynağı ayrıca incelenmeli |
| Kapsam dışında kalan sorun | Acil servis çalışma saatini bulma güçlüğü | Kullanıcı yaklaşık 3 dakika arayıp bulamadı; araç görev başarısını ölçmüyor |
| Kapsam dışında kalan aday | Bağlantının yalnız 'Detaylı Bilgi' diye duyurulması | Önceki ana sayfa görevinde bildirildi; bağlam incelenmeden kesin ihlal değil |

81 adayın tamamı elle doğrulanmadığından bu örneklerden genel doğruluk/yanlış alarm yüzdesi hesaplanmadı.

### Telefon alanı — görünür etiket / ekran okuyucu karşılaştırması

İkinci form adayını vurgulama yönergesinden sonra kullanıcı [telefon alanının görüntüsünü](evidence/acibadem-phone-label-candidate.png) gönderdi. Görüntüde görünür Telefon etiketi, ülke kodu ve 5XX biçiminde yer tutucu var; girilmiş kişisel telefon değeri görünmüyor. Panel/seçici görüntüde yer almadığından bu alan belirli bir D kimliğiyle kesin eşleştirilmedi.

Kullanıcı ekran okuyucuyla alana geldiğinde 'Telefon' yerine '5XX…' duyurulduğunu bildirdi. Görünür etiketin duyuruda yer almaması, aracın form etiketi adayını destekleyen manuel gözlemdir. Alan tamamen adsız olarak sınıflandırılmadı: yer tutucu biçimi okunuyor. Kesin DOM etiket ilişkisi ve WCAG sonucu ayrıca incelenmeli. Öneri: Görünür Telefon etiketini input ile label/for/id ilişkisi kullanarak bağlamak, numara biçimini ek açıklama olarak sunmak. Bu görevde değer girilmedi ve form gönderilmedi.

| Tür | Araç | Manuel gözlem | Sonuç |
|---|---|---|---|
| Desteklenen form etiketi adayı | Form etiketi eksikliği adayı | Görünür Telefon yazısına rağmen duyuruda yalnız 5XX biçimi bildirildi | Etiket ilişkisinin incelenmesini destekler; kesin ihlal ve D kimliği henüz doğrulanmadı |

### Mesaj alanı — ekran okuyucu karşılaştırması

Kullanıcı [Mesajınız alanının vurgulandığı görüntüyü](evidence/acibadem-message-label-candidate.png) paylaştı ve ekran okuyucunun 'Mesajınız' dediğini bildirdi. Görüntüde aynı ifade hem alan üstünde hem yer tutucu olarak görülüyor. Alanın amacı duyuruluyor; adın kaynağı (ilişkili etiket veya yer tutucu yedeği) doğrulanmadı. Bu nedenle 'erişilebilir ad tamamen yok' yorumu bakımından olası yanlış alarm, görünür etiket bağlantısı bakımından inceleme bekleyen aday olarak kaydedildi. Görüntüde seçici olmadığı için kesin D kimliği atanmadı. Alana değer girilmedi ve form gönderilmedi.

| Tür | Alan | Manuel gözlem | Sınır |
|---|---|---|---|
| Olası yanlış alarm | Mesajınız | Ekran okuyucu 'Mesajınız' dedi | Erişilebilir ad tamamen yok denemez; etiket ilişkisinin kaynağı doğrulanmadı |
