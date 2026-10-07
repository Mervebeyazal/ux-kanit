# Yansıtma notu — öğrenci kontrolü bekleyen taslak

Bu projede AI'dan Chrome eklentisinin dosya yapısını oluşturmak, yerel kontrolleri geliştirmek, skor formülünü açıklamak ve test kayıtlarını düzenlemek için yardım aldım. Geliştirmeyi tek seferde bitirmek yerine çalışan küçük sürümler üzerinden ilerlettim. Eklentiyi Chrome'da kendim denedim, bulguları sayfada vurguladım ve sonuçları JSON olarak dışa aktardım. GitHub'a farklı aşamalarda yükleme yaparak geliştirme geçmişini korudum.

AI yardımıyla üretilen bir çıktının doğru görünmesinin yeterli olmadığını gerçek testlerde gördüm. Örneğin fotoğraf üzerindeki beyaz bir metnin kontrast hesabında fotoğraf yerine CSS arka plan renginin kullanılması yanlış bir aday oluşturdu. Ekran görüntüsüyle sonucu karşılaştırınca ölçümün gerçek görüntüyü temsil etmediğini fark ettik. Görselle örtüşen ve güvenilir ölçülemeyen metinleri başarılı saymak yerine ölçüm dışında bıraktık. Daha sonra vurgulama çerçevesinin boş bir bölgeye kaydığını gördüm; düzeltme sonrasında aynı adayın arama alanını gösterdiğini yeniden kontrol ettim.

Manuel ekran okuyucu denetimi de otomatik bulguların yorumunu değiştirdi. Araç arama ve mesaj alanlarında etiket eksikliği adayı üretmesine rağmen ekran okuyucu bu alanların amacını duyurdu. Bu sonuçları kesin ihlal ilan etmek yerine olası yanlış alarm olarak kaydettik. Telefon alanında ise görünür Telefon yazısına rağmen yalnız numara biçimi duyuruldu; bu gözlem etiket bağlantısının incelenmesi gerektiğini destekledi. Acil servis saatini bulma görevinde yaklaşık üç dakika arayıp bilgiyi bulamamam, mevcut yerel kontrollerin görev başarısını ölçmediğini gösterdi.

LLM isteği erişim/kota hatasıyla sonuçlandığı için gerçek Norman skorlarını, üç tekrarın sapmasını ve halüsinasyon oranını henüz elde edemedim. Bu sonuçları uydurmak yerine eksik olarak belirttim. Bu süreçte AI'ın uygulama ve dokümantasyon işini hızlandırdığını, fakat kanıt toplama ve sonuçları doğrulama sorumluluğunun bende kaldığını öğrendim.

Not: Bu metin sohbet ve test kayıtlarından hazırlanmış taslaktır. Öğrenci kendi deneyimine uymayan ifadeleri düzeltmeli; LLM bölümü tamamlandığında son paragraf gerçek sonuçlarla güncellenmelidir.
