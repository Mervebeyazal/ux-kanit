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
