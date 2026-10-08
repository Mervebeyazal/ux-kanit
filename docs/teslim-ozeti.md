# UX Kanıt — teslim özeti

GitHub: https://github.com/Mervebeyazal/ux-kanit

## Teslim dosyaları

- ux-kanit-teslim.zip: eklenti kaynakları, testler, README, raporlar ve kanıt belgeleri. API anahtarı ve .env içermez.
- ux-kanit-demo.mp4: 3 dakika 10 saniyelik, 1920×1080 sessiz demo. Ayrı video dosyası olarak teslim edilir.
- docs/yansitma-notu.md: AI desteği, yanlış sonuçların fark edilmesi ve doğrulama deneyimi.

## Ölçülen sonuçlar

| Site | Yerel ön skor | AI ön skor | Kapsam |
|---|---:|---:|---|
| Acıbadem | 75.7 | 70 | Statik 1/6 ilke |
| Hepsiburada | 89.1 | 70 | Statik 1/6 ilke |
| İBB | 73.5 | 73.3 | Statik 3/6 ilke |

Bu üç gerçek 0.8.10 JSON kaydı reports klasöründedir. Yerel skor aday oranı, AI skoru yalnız gözlenen ilkelerin ortalamasıdır; site uygunluğu veya bütün kullanıcı görevleri hakkında nihai hüküm değildir. 0.9.0 sürümü kullanıcı görev gözlemlerini altı ilkeye ekler ve kapsam tamamlanırsa 0.6D+0.4L toplamını hesaplar. Gerçek görev koşusunun 80.09 toplamı yanlış olumlu Kısıtlar gözlemi nedeniyle doğrulanmış sonuç olarak kullanılmamıştır; ham JSON korunur.

## Doğrulama

Aynı anonim Acıbadem paketinde üç ayrı gerçek LLM isteği: 70, 63.33, 63.33. Aralık 6.67, nüfus standart sapması 3.14. İki ilkenin aralığı 10; 10'u aşan yok. Sağlayıcı backend fingerprint değişikliği sınırlamadır. Bu statik tekrar sonucu görev promptunun tutarlılığını kanıtlamaz.

Manuel Acıbadem görevinde klavye ve ekran okuyucu ile hastane bilgisine ulaşma, arama/form alanı duyuruları ve araç adayları karşılaştırıldı. Görünür İletişim ve TR düğmesi hakkında AI yanlış alarm üretti; Yardım yorumu desteklenmedi. Üç benzersiz eski AI hedefi sayfada mevcut (0/3 olmayan). Hepsiburada'nın bir kabul edilen hedefi paragraf içi bağlantı olarak bulundu (0/1 olmayan); küçük yükseklik tek başına ihlal sayılmadı. İBB'nin üç kabul edilen hedefi görüntülerle bulundu (0/3 olmayan); yorum doğruluğu ayrı tutuldu.

Sağlık senaryolarında telefon bilgisi büyük ve kolay bulundu. Gece acil hizmet saatini yaklaşık üç dakika arayan kullanıcı 24 saat bilgisini bulamadı; bu, hizmetin kapalı olduğunu kanıtlamaz. Gerçek büyükanne katılımcısı kullanılmadı; senaryo öğrenci tarafından uygulandı. Ayrıntılar manuel-denetim.md ve llm-dogrulama.md içindedir.

## Güvenlik ve sınırlar

Yerel analiz veri göndermez; AI gönderimi önizleme ve ayrı onay ister. Form değerleri ve klavye vuruşları toplanmaz. API anahtarı .env içinde, Git dışında tutulur. Otomatik form gönderimi veya tıklama yoktur. Parola alanı engellenir; hassas sayfa algılama kullanıcı doğrulamasıyla desteklenir. Iframe ve Shadow DOM kapsam dışıdır. Kontrastta ölçülemeyen öğeler başarılı sayılmaz. Görev gözlemleri kullanıcı beyanıdır; otomatik etkileşim kaydı değildir.

Son doğrulamada 46 bağımsız birim testi geçti. Çalışan kullanıcı servisini etkileyen HTTP testi bu koşuda çalıştırılmadı. Eklentinin yeni görev bölümü gerçek kullanımla denendi; son skorun gözlem tutarlılığı tamamlanmadı. Kullanıcı tercihiyle ek geliştirme/test yapılmadan bu sürüm teslim edildi.
