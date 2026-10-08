# Gerçek LLM denemesi — inceleme sürüyor

İlk başarılı yanıt: [ham JSON](../reports/acibadem-groq-run1-raw.json), Groq openai/gpt-oss-20b, norman-static-small-v3, sıcaklık 0, seed 42. Yanıt tarihi 2026-10-07T21:29:22.265Z (Türkiye saatinde 8 Ekim). Statik ön ortalama 70, üç ilke puanlı; birleşik skor yok. Bu puan henüz güvenilir tanı olarak onaylanmadı.

| Bulgu | Eşleşen olgu | Yorum kontrolü |
|---|---|---|
| L-1 Butona isim yok | hasName=true | Başlık olguyla çelişiyor. Tam ad kalitesi ayrıca incelenebilir ama adsızlık iddiası bu kanıtla desteklenmiyor. |
| L-2 İletişim linki görünür değil | uiToken=iletişim | Bu token görselin yokluğunu veya linkin görünmezliğini ölçmüyor. Yorum kanıtsız. |
| L-3 Yardım linki görsel eksik | uiToken=yardım | Token simge varlığı ölçümü değil. Görsel eksikliği iddiası kanıtsız. |

Örneklem dışı seçici oranı 0/3=%0; panelin güncel örneklem kontrolünde de üç seçici/olgu eşleşmiş. Bu, tüm DOM'un bağımsız manuel kontrolü veya yorum doğruluğu değildir. Üç yorumun üçü verilen olguyla gerekçelendirilemedi (bu örnek için %100 desteklenmeyen yorum); L-1 açık çelişki içeriyor. L-2 ve L-3'ün gerçek sayfada doğru/yanlış oluşu ayrıca görsel inceleme bekler. Kanıtsız olduklarından doğrulanmış bulgu sayılmamalıdır.

Ham rapor değiştirilmedi. Ön skor 70, bu adaylara dayandığı için nihai sonuç olarak kullanılmamalı. Tekrar ölçümü henüz bir run içeriyor; sapma hesaplanmadı. Aynı paket ve promptla iki bağımsız denemeden sonra önce bu başlangıç davranışının tutarlılığı ölçülecek; daha sonra kanıt kısıtları iyileştirilip ayrı sürümle yeniden denenecek. Prompt sürümleri karıştırılmayacak.

## Aynı pakette üç tekrar — başlangıç ölçümü

İkinci ve üçüncü ham raporlar reports/acibadem-groq-run2-raw.json ve reports/acibadem-groq-run3-raw.json içinde. Üç ayrı istek kimliği doğrulandı. Snapshot hash, model, provider, prompt sürümü, sıcaklık ve seed aynı. Üç isteğin systemFingerprint değerleri farklı; aynı sağlayıcı altyapısı garanti edilemedi ve bu bir sınırlamadır. Hesaplama çıktısı: [tekrar özeti](../reports/acibadem-groq-repeat-summary.json).

| Skor | 1 | 2 | 3 | Aralık (max−min) |
|---|---:|---:|---:|---:|
| Statik ön toplam | 70.00 | 63.33 | 63.33 | 6.67 |
| Görünürlük | 70 | 70 | 70 | 0 |
| Kısıtlar | 70 | 60 | 60 | 10 |
| Eşleme | 70 | 60 | 60 | 10 |
| Diğer üç ilke | null | null | null | Ölçülmedi |

Statik ön toplam ortalaması 65.56, popülasyon standart sapması 3.14. Hiçbir ölçülen skor aralığı 10 puanı aşmadı; iki ilke tam 10 puan aralığında. Bu nedenle yönergedeki '10 puandan fazla' koşulu bu örnekte oluşmadı. Altyapı parmak izi değişimini skor değişiminin kesin nedeni olarak göstermiyoruz. Statik skorlar üç kanıtı zayıf yoruma dayandığı için güvenilirlik sorunu sürüyor; bu ölçüm kararlılık ile doğruluğun ayrı olduğunu gösterir.

Üç koşuda toplam 9 öneri (aynı üç öğe tekrarları), örneklem dışı seçici 0/9=%0. Bu oran snapshot eşleşmesidir, bağımsız tam DOM denetimi değildir. 9/9 yorum kendi verilen olgusuyla desteklenmiyor; 3 adsızlık iddiası hasName=true ile çelişiyor. Gerçek sayfada bulguların görsel doğrulaması tamamlanmadı. Düzeltme planı: ad kaynağı varlığından ad yokluğu çıkarımını ve izin listeli token bilgisinden simge/görsel yokluğu çıkarımını engellemek; yorum kanıtını sınırlayıp yeni prompt sürümünde ayrı tekrar testi yapmak. Henüz bu planın iyileşme sonucu ölçülmedi.

## L-1 görsel doğrulama

Kullanıcı ilk AI bulgusunu vurgulayıp [panel ve dil düğmesi görüntüsünü](evidence/acibadem-llm-language-false-positive.png) gönderdi. Panel seçicisi üç koşudaki L-1 ile eşleşiyor; çerçeve dünya simgesi ve TR metni olan dil düğmesinde. Böylece hedef öğenin gerçek sayfada varlığı görsel olarak doğrulandı. AI'ın 'etiket metni gizlenmiş' iddiası görünür TR metniyle çelişiyor; 'Ara' metni önerisi de hedefin dil kontrolü olmasıyla ilgisiz. Bu yorum yanlış alarm olarak kaydedildi. Düğmenin erişilebilir adının kalitesi veya dil değiştirmenin davranışı ayrıca test edilmedi. Bu tek görüntü diğer iki bulgunun görsel kontrolünün yerine geçmez.

## L-2 görsel doğrulama

Kullanıcının [ikinci AI bulgusu görüntüsünde](evidence/acibadem-llm-contact-false-positive.png) panel seçicisi L-2 ile eşleşiyor ve çerçeve görünür İletişim metnini çevreliyor. Hedef öğe sayfada var. 'İletişim linki görünür değil' başlığı ve 'metin ekleyin' önerisi görüntüyle çelişiyor. Link yanında simge bulunmaması tek başına yönlendirme sorunu veya Norman Kısıtlar ihlali kanıtı değildir. Bu bulgu yanlış alarm olarak kaydedildi; gerçek bağlantı davranışı test edilmedi.

## L-3 görsel doğrulama ve örneklem sonucu

Kullanıcının [Yardım bağlantısı görüntüsünde](evidence/acibadem-llm-help-unsupported.png) paneldeki L-3 seçicisiyle işaretlenen görünür Yardım metni bulunuyor. Öğe sayfada mevcut. Bağlantının yanında simge bulunmaması tek başına Eşleme sorunu veya kullanıcı yönlendirmesinin belirsizliği kanıtı değildir. Bağlantı hedefi ve görev davranışı test edilmedi; AI'ın sorun iddiası desteklenmeyen yorum olarak kaldı. Görünür metin zaten mevcut olduğu için metin ekleme önerisi de gerekçelendirilmedi.

Üç benzersiz AI hedefinin üçü gerçek sayfada ayrı vurgulama görüntüleriyle doğrulandı. Bu manuel örneklemde var olmayan öğeye işaret eden oran 0/3=%0. İlk iki bulgu görünürlük/ad iddiaları bakımından yanlış alarm; üçüncü bulgu sorun iddiası kanıtsız. Üç önerinin hiçbiri doğrulanmış ihlal olarak kabul edilmedi. Bu sonuç tüm siteler veya gelecekteki AI yanıtları için genellenemez. Aynı üç öğenin üç koşuda tekrarlanması bağımsız dokuz manuel hedef denetimi olarak sayılmadı.

## 0.8.8 yeni gerçek deneme — kullanıcı panel metni

Kullanıcı 0.8.8 panel metnini paylaştı: deterministik ön skor 75.7, AI ilkeleri 0/6, öneri 3, kabul 0, ret 3, örneklem dışı seçici oranı %100. Bu yeni model yanıtının önceki üç koşuyla aynı hash/prompt/backend koşulunda olduğu henüz JSON'dan doğrulanmadı. %100, bu koşunun snapshot seçici oranıdır; öğelerin tüm DOM'da yokluğu anlamına gelmez. Önceki üç koşunun görsel olarak doğrulanan 0/3 olmayan öğe oranı değiştirilmedi. Yeni JSON reddetme nedenleri için bekleniyor. Modelin Sağlarlık ilkesini hata önleme olarak yorumlaması da kavramsal sınırlama; eylem olasılıklarının algılanabilirliği ayrıca incelenmeli.

Paylaşılan panelde Groq bağlantısına rağmen OpenAI gönderim metni bulundu. Metin model bağlantısının terminalden kontrol edilmesini ve Groq/OpenAI bulut veya Ollama yerel seçeneklerini açıklayacak şekilde düzeltildi. Veri gönderim onayı her yeni denemede ayrıca alınır.

## 0.8.8 JSON doğrulaması

[Gerçek yeniden deneme raporu](../reports/acibadem-groq-0.8.8-retest.json) üç reddin nedenini nonexistent_snapshot_selector olarak doğruladı: model nth-of-type içeren seçicileri kısalttı. Hash 27ac4174… ile önceki be28342d… farklı; bu yanıt önceki tutarlılık hesabına eklenmedi. 0 kabul ve skor null. Yeni korumanın anlamsal reddi bu gerçek yanıtta sınanmadı; seçici kontrolü önce devreye girdi. Bu rapor yalnız mevcut seçici doğrulamasının gerçek reddini kanıtlar.

0.8.9: Groq JSON şemasındaki seçiciler artık yalnız gönderilen gerçek seçeneklerden oluşan enum ile sınırlandı; factKey aday sorun temelleriyle sınırlandı. Anonimleştirilmiş veri ile görünür UI eksikliği arasındaki fark ve Sağlarlık anlamı promptta açıklığa kavuşturuldu. Prompt sürümü norman-static-small-v4; eski tekrarlarla karıştırılmayacak. İlgili 17 test geçti; yeni gerçek API yanıtı bekleniyor. Uzun seçicilerin şemada tekrarı paket boyutunu artırabilir; API kota/boyut sınırı ayrıca izlenmeli.

## 0.8.10 gerçek panel sonucu — JSON bekleniyor

Kullanıcı panel metninde gerçek AI yanıtının alındığını bildirdi: 3 öneri, 1 kabul, 2 ret, örneklem dışı seçici %0; yalnız Görünürlük skoru 70 (1/6), birleşik skor boş. Kabul edilen aday, arama input seçicisi ve hasName=false olgusuna dayanıyor. Bu olgu tam erişilebilir ad hesabı değildir: önceki manuel testte bu arama alanı ekran okuyucuyla Acıbadem'de ara diye duyurulmuştu. Bu yüzden adayın 'erişilebilir ad kesin yok' yorumu olası yanlış alarmdır, doğrulanmış ihlal değildir. 'name ekleyin' önerisi teknik olarak yeterli değildir; input name niteliği tek başına erişilebilir etiket sağlamaz. Görünür label/for/id veya uygun aria-label tercih edilmelidir. Modelin maskeli değeri Kısıtlar sorunu olarak anması hâlâ kanıtsız yorum riskini gösteriyor.

Yeni koşunun paket/model/ret nedenleri JSON'dan doğrulanmalı. Bu panel sonucu bütün altı ilkenin başarıyla değerlendirildiği anlamına gelmez. Önceki üç koşunun sapma hesabına yeni prompt sürümü eklenmedi.

0.8.10 JSON alındı: [rapor](../reports/acibadem-groq-0.8.10.json). prompt norman-static-small-v5 ve hash 27ac4174… doğrulandı. Önceki 0.8.8 ret denemesiyle aynı paket, farklı prompt. İki ret insufficient_issue_evidence: model 166.83px genişliği yetersiz diye yorumladı; 45px yüksekliği 24px altında diye yanlış karşılaştırdı. Yeni sorun temeli kontrolü bunları kabul etmedi. Bir kabul edilen hasName=false adayı tam ad hesabı olmadığı için manuel olası yanlış alarm durumunda. 70 ön skoru nihai uygunluk sonucu değildir.

## Hepsiburada 0.8.10 gerçek AI raporu

[Değiştirilmemiş JSON](../reports/hepsiburada-groq-0.8.10.json), 2026-10-08T06:14:45.782Z. Deterministik ön skor 89.1; AI ön skoru 70, yalnız Sağlarlık (1/6). Birleşik skor yok. Üç öneriden biri kabul, ikisi insufficient_issue_evidence nedeniyle reddedildi. Adı bulunan bağlantıyı sorun diye listelemek ve 99.94px genişliği yetersiz ilan etmek desteklenmedi. Snapshot dışı seçici oranı 0/3; güncel DOM doğrulaması henüz yapılmadı.

Kabul edilen aday bir bağlantının 15 CSS px yüksekliğine dayanır. Bu ölçüm tek başına Sağlarlık sorununun veya WCAG ihlalinin kanıtı değildir; satır içi bağlantı ve hedef aralığı istisnaları elle incelenmeli. Modelin 44px önerisi ergonomi önerisidir, 24px AA eşiğiyle aynı değildir. Canlı vurgulama görüntüsü bekleniyor. İlk 20 öğelik örneklem ve kontrastta 533 ölçülemeyen öğe kapsam sınırlamasıdır. Bu farklı sitenin koşusu Acıbadem tekrar hesabına katılmadı.

### Hepsiburada canlı hedef doğrulaması

[Kullanıcının vurgulama görüntüsü](evidence/hepsiburada-llm-inline-link.png), kabul edilen L-1 seçicisinin paragraf içindeki “Samsung telefon” bağlantısını işaretlediğini gösteriyor. Bu benzersiz hedef için var olmayan öğe oranı 0/1=%0; diğer iki reddedilen önerinin canlı hedefleri ayrıca incelenmedi. Görüntü ölçümün yeniden hesaplanmasını sağlamaz; 15 CSS px yüksekliği JSON ölçümüdür.

Bağlantı cümle/paragraf içinde yer alıyor. Küçük yükseklikten kesin hedef boyutu ihlali çıkarılamaz; satır içi bağlantı istisnası dikkate alınmalıdır. Sağlarlık yorumu için kullanıcı görevinde güçlük gösterilmedi. Sonuç: DOM hedefi doğrulandı, sorun iddiası doğrulanmadı; kesin ihlal olarak sayılmadı. 44px önerisi bu metin bağlantısına zorunlu WCAG eşiği olarak uygulanamaz.

## İBB gerçek panel sonucu — alternatif JSON modu

[Paylaşılan panel kaydı](evidence/ibb-0.8.10-panel.txt): yerel ön skor 73.5; AI statik ön skor 73.3 (Görünürlük 70, Tutarlılık 80, Sağlarlık 70; 3/6). Üç öneri kabul, ret yok, snapshot dışı seçici oranı %0. JSON dosyası ve üç canlı vurgulama görüntüsü bekleniyor. Kabul, ölçüm/seçici eşleşmesidir; sorun yorumunun doğruluğu anlamına gelmez. İki aday 14px ve 12.25px genişliğinde bağlantı, üçüncü aday hasName=false form alanıdır. Hedef aralığı istisnaları ve gerçek erişilebilir ad elle incelenmeli. Sağlarlık gerekçesindeki “hata önleme” kavramı ilkeyle karıştırılmış; bu yorum doğrulanmış sonuç sayılmadı.

Groq strict JSON şema üretimi 400/json_validate_failed ile başarısız oldu. Kullanıcının yeni ayrı onayından sonra UX_GROQ_JSON_MODE=object seçeneğiyle JSON modu kullanıldı; servisteki biçim, altı ilke, seçici ve olgu doğrulamaları korunur. Bu mod şemayı sistem mesajına eklediği için önceki strict mod koşularıyla aynı istem değildir; tutarlılık hesabına eklenmedi. Yeni mod için üç aynı-paket koşusu henüz yapılmadı.

İBB JSON alındı: [gerçek rapor](../reports/ibb-groq-0.8.10.json). Panelle skorlar ve üç olgu eşleşiyor: width=14, width=12.25, hasName=false. Snapshot hash b2b005e7…; Acıbadem tekrarıyla farklıdır. Rapor promptVersion=v5 gösterse de alternatif JSON modu şemayı mesaja ekler; mod farkı bu doğrulama notunda korunmuştur. Üç sitenin güncel AI içeren JSON kayıtları artık reports klasöründedir; tam altı ilke kapsamı ve nihai toplam halen eksiktir.

### İBB arama alanının canlı doğrulaması

[Arama alanı görüntüsü](evidence/ibb-llm-search.png) paneldeki L-3 input seçicisinin “Size nasıl yardımcı olabiliriz?” yer tutucusu bulunan arama alanını işaretlediğini gösteriyor. Bu hedef mevcut; bu aşamada canlı doğrulanan AI hedefi 1/3. hasName=false sınırlı etiket sezgisidir; görünür placeholder, erişilebilir adın kaynağını veya yokluğunu kanıtlamaz. DOM etiket ilişkisi ve ekran okuyucu duyurusu ayrıca incelenmeden kesin adsızlık ihlali sayılmadı. Üstte Instagram simgesi üzerinde de bir çerçeve görünüyor; ilgili bulgu kartı görüntüde olmadığı için bu çerçeve L-1 veya L-2 doğrulaması olarak sayılmadı.

### İBB ilk bağlantının canlı doğrulaması

[X bağlantısı görüntüsü](evidence/ibb-llm-target-x.png), yerel WCAG hedef adayı kartında li:nth-of-type(1) > a:nth-of-type(1) seçicisini ve X simgesinin vurgulanmasını birlikte gösterir. Bu tam seçici, JSON'daki ilk AI önerisinin seçicisiyle aynıdır. Bu nedenle görüntü yerel karttan alınmış olsa da AI hedefinin varlığı doğrulandı; canlı doğrulanan hedef 2/3 oldu. Kartta ölçüm 14 × 36 CSS px olarak yer alır. Görüntü tek başına yeniden ölçüm veya aralık istisnasının değerlendirmesi değildir. Küçük genişlikten Görünürlük sorunu ya da kesin WCAG ihlali çıkarılmadı.

### İBB ikinci bağlantı ve hedef varlığı sonucu

[Instagram bağlantısı görüntüsü](evidence/ibb-llm-target-instagram.png) yerel karttaki li:nth-of-type(2) > a:nth-of-type(1) seçicisi ile vurgulanan Instagram simgesini birlikte gösterir. Bu seçici ikinci AI bulgusuyla aynıdır; ölçüm kartta 12.25 × 36 CSS px olarak bulunur. Üç benzersiz AI hedefi (X, Instagram, arama input) canlı sayfada doğrulandı: var olmayan öğeye işaret eden oran 0/3=%0. Bu sonuç yalnız bu koşunun üç kabul edilen hedefi içindir. Aralık istisnası, gerçek erişilebilir ad ve kullanıcı görevindeki güçlük ayrıca doğrulanmadığından üç sorun iddiası kesin ihlal sayılmadı. Tüm sayfanın veya yorumların doğruluğu bu oranla kanıtlanmaz.
