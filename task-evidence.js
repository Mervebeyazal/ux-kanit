// Explicit user observations only. No keyboard listeners or form values.
let taskEvidence=null;
const taskKeys=['taskVisibility','taskFeedback','taskConstraints','taskMapping','taskConsistency','taskAffordance'];
const taskQuestions=[
  'Görünürlük: Tab ile menüye ulaşınca odak çerçevesi belirgin mi?',
  'Geri Bildirim: Enter ile açılınca seçenekler ve ok yönü değişiyor mu?',
  'Kısıtlar: Açık menü Esc ile kapanıyor mu? (Kapanmıyorsa sorun adayı seç.)',
  'Eşleme: İstanbul başlığı ile açılan İstanbul seçenekleri ilişkili mi?',
  'Tutarlılık: Hizmetler, Kurumsal, Gündem ve İstanbul başlıklarının yazı/ok düzeni tutarlı mı?',
  'Sağlarlık: Başlığın yanındaki aşağı ok, açılabilir menü olduğunu belli ediyor mu?'
];
const taskSection=document.createElement('details');
taskSection.innerHTML='<summary>İBB İstanbul menüsü — kullanıcı görev kanıtı</summary><p>Bu alan yalnız yaptığın menü testini kaydeder. Her soruyu gerçekten gözlemlediysen yanıtla. Kod ölçümü değildir; tüm siteyi temsil etmez. Form doldurma veya gönderme gerekmez.</p>';
const taskSelects=taskQuestions.map((question,index)=>{
  const label=document.createElement('label');label.textContent=question;
  const select=document.createElement('select');select.id=taskKeys[index];
  for(const [value,text] of [['untested','Gözlemlemedim'],['good','Gözledim: uygun'],['problem','Gözledim: sorun adayı']]) {
    const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);
  }
  select.addEventListener('change',()=>{taskEvidence=null;resetAI();});
  label.append(select);taskSection.append(label);return select;
});
const taskConfirmLabel=document.createElement('label');
const taskConfirm=document.createElement('input');taskConfirm.type='checkbox';
taskConfirmLabel.append(taskConfirm,document.createTextNode('Bu yanıtlar benim gerçek klavye/görsel gözlemlerim; otomatik ölçüm değildir.'));
taskSection.append(taskConfirmLabel);
const taskSave=document.createElement('button');taskSave.textContent='Görev gözlemlerini mevcut menüye bağla';taskSection.append(taskSave);
document.querySelector('#ai-prepare').before(taskSection);
taskConfirm.addEventListener('change',()=>{taskEvidence=null;resetAI();});
taskSave.addEventListener('click',async()=>{
  if(!taskConfirm.checked || !lastReport || !document.querySelector('#consent').checked) {status.textContent='Önce yerel analiz ve gerçek görev gözlemi onayı gerekli.';return;}
  try {
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    const [capture]=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>{
      if(location.origin!=='https://www.ibb.istanbul' || document.querySelector('input[type="password"]'))return null;
      const menu=[...document.querySelectorAll('a,button,[role="button"]')].find(el=>el.textContent.trim()==='İstanbul' && el.getBoundingClientRect().width>0);
      if(!menu)return null;
      const parts=[];let el=menu;
      while(el && el!==document.documentElement){const peers=[...el.parentElement.children].filter(p=>p.tagName===el.tagName);parts.unshift(`${el.localName}:nth-of-type(${peers.indexOf(el)+1})`);el=el.parentElement;}
      return {origin:location.origin,selector:['html',...parts].join(' > ')};
    }});
    if(!capture.result || capture.result.origin!==lastReport.page.origin)throw new Error('İBB İstanbul menüsü bulunamadı. İBB ana sayfasında yerel analizi çalıştır.');
    resetAI();
    taskEvidence={tabId:tab.id,origin:capture.result.origin,selector:capture.result.selector,
      observations:Object.fromEntries(taskKeys.map((key,index)=>[key,taskSelects[index].value]))};
    status.textContent='Görev gözlemleri gerçek menü seçicisine bağlandı. Şimdi yeni AI önizlemesi hazırla; gözlemler henüz gönderilmedi.';
  }catch(error){status.textContent=error.message;}
});
button.addEventListener('click',()=>{taskEvidence=null;taskConfirm.checked=false;taskSelects.forEach(select=>select.value='untested');});
