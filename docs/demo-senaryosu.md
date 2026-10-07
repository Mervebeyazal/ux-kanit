# Demo — yaklaşık 4 dakika

Bu senaryo mevcut sürümü dürüstçe gösterir. Nihai kayıt LLM bölümü tamamlandıktan sonra güncellenmelidir. Senaryonun hazırlanması video teslim edildiği anlamına gelmez.

## Kayıttan önce

- Yalnızca herkese açık, giriş yapılmamış sayfaları kullan. Formları boş bırak.
- .env dosyasını, API anahtarını ve yerel bağlantı kodunu ekranda gösterme. Kişisel sekmeleri ve bildirimleri kapat.
- Panel sürümünü kontrol et; kayıt için Acıbadem, Hepsiburada ve İBB ön raporlarını hazır tut.
- OBS zaten varsa ekran kaydı kullanılabilir. Yoksa Windows ekran kaydı için Win+G menüsünü dene. Dosyanın görüntü ve mikrofon sesini kısa bir prova ile kontrol et.

## Konuşma ve gösterim sırası

| Süre | Gösterim | Söylenecek ana fikir |
|---|---|---|
| 0:00–0:30 | Eklenti ve herkese açık sayfa | “UX Kanıt, bulguyu DOM seçicisi ve ölçüm kanıtıyla gösteren bir Chrome Manifest V3 eklentisi. Otomatik aday ile doğrulanmış ihlali ayırıyorum.” |
| 0:30–1:20 | Onay, yerel analiz, bir aday ve Sayfada göster | “Altı yerel kontrol var. Bu örnekte ilgili öğe işaretleniyor. Kural, şiddet, kanıt ve düzeltme önerisi panelde bulunuyor. Form değerleri okunmuyor.” |
| 1:20–1:50 | Alt skorlar ve JSON dışa aktarımı | “Ön skor, kategorideki benzersiz adayların ölçülen öğelere oranından hesaplanıyor. Ölçülemeyen öğeler başarılı sayılmıyor. Bu bir WCAG uygunluk sertifikası değil.” |
| 1:50–2:30 | Üç sitenin JSON dosyaları ve README tablosu | “Sağlık, Türk e-ticaret ve kamu kategorilerini test ettim. Skorları yeniden hesapladım; adayların tamamını elle doğruladığımı iddia etmiyorum.” |
| 2:30–3:15 | Manuel kayıt ve kanıt görüntüleri | “Fare kullanmadan hastane bilgi sayfasına ulaştım. Arama ve mesaj alanlarının amacı duyuruldu; telefonda yalnız biçim duyuruldu. Yaklaşık üç dakikada acil servis saatini bulamadım. Yerel tarama bu görev sorununu ölçmüyor.” |
| 3:15–3:45 | AI önizleme ekranı; gizli bilgileri göstermeden | “AI katmanı ayrı onay ve seçici/olgu doğrulaması içeriyor. Mevcut gerçek API denemesi başarısız oldu; skor ve halüsinasyon oranı henüz yok.” Nihai kayıtta burası gerçek LLM sonucu ve üç tekrar tablosuyla değiştirilmelidir. |
| 3:45–4:10 | GitHub geçmişi ve sınırlamalar | “Fotoğraf kontrastı ve vurgulama hatalarını gerçek kanıtla fark edip düzelttim. Kod testlerini saha doğrulamasından ayrı raporluyorum.” |

## Teslim

Kaydı izleyerek yazıların okunabildiğini, sesin duyulduğunu ve gizli bilgi görünmediğini kontrol et. 3–5 dakika aralığında MP4 dosyası teslim et veya hocanın istediği platforma yükleyip erişilebilir bağlantısını README'ye ekle. Büyük videoyu zorunlu olmadıkça Git reposuna koyma. Video bağlantısı ve kayıt tarihi henüz mevcut değil.

## 7 Ekim kayıt durumu

Kullanıcı iki sessiz kayıt oluşturdu: eklenti gösterimi 95.1 saniye, açıklamalar 64.4 saniye. Windows dosya metaverisinden toplam 159.5 saniye (yaklaşık 2:40) doğrulandı. Kullanıcı yeni kayıt eklememeyi tercih etti; bu süre yönergedeki 3–5 dakika aralığının altındadır. Dosyalar henüz tek videoda birleştirilmedi. Birleştirme için araç indirmesi bağlantı kesilmesi ve yavaşlık nedeniyle tamamlanamadı; Clipchamp ile yerel birleştirme sonraki adımdır. Video içeriği ve ses anlaşılabilirliği metaveriden doğrulanamaz. API/LLM bölümü eksik olarak gösterilmelidir.
