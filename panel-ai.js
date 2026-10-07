const aiPrepare = document.querySelector('#ai-prepare');
const aiSend = document.querySelector('#ai-send');
const aiConsent = document.querySelector('#ai-consent');
const aiPreview = document.querySelector('#ai-preview');
const aiResult = document.querySelector('#ai-result');
const aiStatus = document.querySelector('#ai-status');
// Keep feedback beside the AI button as well as at the top of the panel.
new MutationObserver(() => { aiStatus.textContent=status.textContent; }).observe(status,{childList:true,characterData:true,subtree:true});
let preparedAI = null;
function normalizeSnapshot(raw) {
  return { snapshotVersion:raw.snapshotVersion, observationMode:raw.observationMode, viewport:raw.viewport,
    sampledCount:raw.elements.length, elements:raw.elements };
}
async function readSnapshot(tabId) {
  await chrome.scripting.executeScript({ target:{ tabId }, files:['control-name.js','ai-snapshot.js'] });
  const [response] = await chrome.scripting.executeScript({ target:{tabId}, func:() => ({ origin:location.origin, snapshot:globalThis.UXSnapshot() }) });
  return response.result;
}
function resetAI() {
  preparedAI=null; aiSend.disabled=true; aiConsent.checked=false; aiPreview.textContent=''; aiResult.textContent='';
}
button.addEventListener('click', resetAI);
aiConsent.addEventListener('change',() => { aiSend.disabled = !preparedAI || !aiConsent.checked; });
aiPrepare.addEventListener('click',async () => {
  resetAI();
  if (!lastReport || !document.querySelector('#consent').checked) { status.textContent='Önce herkese açık sayfada yerel analizi çalıştır.'; return; }
  aiPrepare.disabled=true;
  try {
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    const current=await readSnapshot(tab.id);
    if (current.origin !== lastReport.page.origin) throw new Error('Sayfa değişmiş; yerel analizi yeniden çalıştır.');
    preparedAI={ tabId:tab.id, report:lastReport, snapshot:normalizeSnapshot(current.snapshot) };
    aiPreview.textContent=JSON.stringify(preparedAI.snapshot,null,2);
    status.textContent='Önizleme hazır. Veri henüz gönderilmedi. İçeriği inceleyip ayrı gönderim onayını işaretle.';
  } catch (error) { status.textContent=`Önizleme hazırlanamadı: ${error.message}`; }
  finally { aiPrepare.disabled=false; }
});
aiSend.addEventListener('click',async () => {
  if (!preparedAI || !aiConsent.checked || !document.querySelector('#consent').checked) return;
  const task=preparedAI;
  const pairing=document.querySelector('#ai-pairing').value.trim();
  if (!/^[a-f0-9]{36}$/.test(pairing)) { status.textContent='Yardımcı servis terminalindeki yerel bağlantı kodunu gir. API anahtarını buraya girme.'; return; }
  aiSend.disabled=true; aiPrepare.disabled=true; button.disabled=true; exportButton.disabled=true;
  aiResult.textContent='';
  status.textContent='Sayfanın onaylanan önizlemeyle eşleşmesi kontrol ediliyor…';
  let waitTimer=null;
  try {
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if (tab.id !== task.tabId || lastReport !== task.report) throw new Error('Analiz sayfası değişti; önizlemeyi yeniden hazırla.');
    const current=await readSnapshot(task.tabId);
    if (current.origin !== task.report.page.origin || JSON.stringify(normalizeSnapshot(current.snapshot)) !== JSON.stringify(task.snapshot)) throw new Error('Sayfa gözlemi değişti; önizlemeyi yeniden hazırla ve onayla.');
    status.textContent='Onaylanan yapı verileri OpenAI’a gönderiliyor. Bu işlem API kullanımına tabidir.';
    const started=Date.now();
    waitTimer=setInterval(() => {status.textContent=`AI yanıtı bekleniyor: ${Math.floor((Date.now()-started)/1000)} saniye. Bu aşamada düğmeye tekrar basma.`;},5000);
    const response=await fetch('http://127.0.0.1:8787/analyze', {
      method:'POST', headers:{'Content-Type':'application/json','X-UX-Pairing':pairing},
      body:JSON.stringify({consent:true,snapshot:task.snapshot}), signal:AbortSignal.timeout(190000)
    });
    const data=await response.json();
    clearInterval(waitTimer);waitTimer=null;
    if (!response.ok) throw new Error(data.error || 'AI bağlantısı başarısız.');
    status.textContent='AI yanıtı alındı; bulgular güncel sayfada doğrulanıyor…';
    const after=await readSnapshot(task.tabId);
    const currentBySelector=new Map(after.snapshot.elements.map(item => [item.selector,item]));
    const accepted=[], rejected=[...data.rejected];
    for (const item of data.findings) {
      const live=currentBySelector.get(item.selector);
      if (!live) { rejected.push({reason:'not_in_current_sample',finding:item}); continue; }
      if (JSON.stringify(live.facts[item.factKey]) !== item.factValueJSON) { rejected.push({reason:'current_fact_changed',finding:item}); continue; }
      accepted.push({...item, id:`L-${accepted.length+1}`, validationStatus:'current_sample_fact_matched_interpretation_pending_manual_review'});
    }
    const changedPrinciples=new Set(rejected.filter(r=>['not_in_current_sample','current_fact_changed'].includes(r.reason)).map(r=>r.finding.principle));
    const principles=data.principles.map(p=>changedPrinciples.has(p.principle)?{...p,score:null,status:'page_changed'}:p);
    const scored=principles.filter(p=>p.score!==null);
    const llmScore=scored.length ? scored.reduce((sum,p)=>sum+p.score,0)/scored.length:null;
    const llm={...data, score:llmScore, principles, findings:accepted, rejected, complete:scored.length===6,
      status:'provisional_static', currentSampleValidation:{ checked:data.findings.length, accepted:accepted.length, rejected:data.findings.length-accepted.length },
      snapshot:task.snapshot };
    task.report.scores.llm=llm;
    task.report.scores.combined={score:llm.complete && llmScore!==null ? .6*task.report.scores.deterministic.score+.4*llmScore:null,
      status:llm.complete?'provisional':'insufficient_principle_coverage',weights:{deterministic:.6,llm:.4}};
    task.report.privacy.localOnly=false; task.report.privacy.llmSendConsent=true;
    task.report.privacy.llmDestination=data.provider==='ollama'?'local-model-service':'openai-api';
    task.report.privacy.llmPayloadScope='fixed UI tokens and anonymous structure; form values masked';
    task.report.findings=task.report.findings.filter(item=>item.source!=='llm').concat(accepted);
    scores.querySelector('p').textContent=`Yerel skor aday oranına dayalıdır. AI statik ön skoru: ${llmScore===null?'Kanıt yetersiz':llmScore.toFixed(1)+' / 100'} (${scored.length}/6 ilke). Birleşik toplam: ${task.report.scores.combined.score===null?'İlke kapsamı eksik':task.report.scores.combined.score.toFixed(1)+' / 100'}.`;
    const title=document.createElement('h2'); title.textContent=`AI statik ön skor: ${llmScore===null?'Değerlendirilemedi':llmScore.toFixed(1)+' / 100'} (${scored.length}/6 ilke)`;
    aiResult.append(title);
    const note=document.createElement('p'); note.textContent='Bu skor yalnızca kanıtı yeterli statik ilkelerin ortalaması. Geri bildirim davranışı gözlenmedi; birleşik toplam için altı ilkenin tamamı gerekir. Yorumlar manuel doğrulama bekliyor.'; aiResult.append(note);
    for (const p of principles) {
      const paragraph=document.createElement('p'); paragraph.textContent=`${p.principle}: ${p.score===null?'Kanıt yetersiz':p.score.toFixed(1)+' / 100'}\n${p.rationale}`; aiResult.append(paragraph);
    }
    for (const item of accepted) {
      const card=document.createElement('article'); const description=document.createElement('p');
      description.textContent=`${item.title}\nÖğe: ${item.selector}\n${item.rule}\nŞiddet: ${item.severity}\nKanıt: ${item.evidence}\nAI yorumu: ${item.rationale}\nÖneri: ${item.recommendation}`;
      const show=document.createElement('button'); show.textContent='Sayfada göster';
      show.addEventListener('click',async () => {
        try {
          const [highlight]=await chrome.scripting.executeScript({target:{tabId:task.tabId},args:[item.selector],func:selector=>{
            if (document.querySelector('input[type="password"]')) return false;
            const element=document.querySelector(selector); if (!element) return false;
            element.scrollIntoView({block:'center',behavior:'instant'});
            const marker=document.createElement('div'); marker.setAttribute('aria-hidden','true');
            marker.style.cssText='position:fixed;pointer-events:none;border:4px solid #e11d48;z-index:2147483647;box-sizing:border-box;';
            document.documentElement.append(marker); const end=performance.now()+4000;
            const update=()=>{if(performance.now()>end||!element.isConnected){marker.remove();return;}const r=element.getBoundingClientRect();Object.assign(marker.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});requestAnimationFrame(update);};update();return true;
          }});
          status.textContent=highlight.result?'AI bulgusunun öğesi vurgulandı; yorum ayrıca doğrulanmalıdır.':'Öğe bulunamadı veya sayfa engellendi.';
        } catch {status.textContent='AI bulgusu vurgulanamadı; sayfayı yeniden analiz et.';}
      });
      card.append(description,show);aiResult.append(card);
    }
    const rejectedNote=document.createElement('p'); rejectedNote.textContent=`AI önerileri: ${data.hallucination.proposed}. Kabul edilen: ${accepted.length}. Reddedilen: ${rejected.length}. Snapshotta olmayan seçici oranı: ${data.hallucination.nonexistentSnapshotSelectorRate===null?'Uygulanamaz':(100*data.hallucination.nonexistentSnapshotSelectorRate).toFixed(1)+'%'}. Bu oran yorumların doğruluğunu kanıtlamaz.`;aiResult.append(rejectedNote);
    status.textContent='AI yanıtı alındı ve seçici/ölçüm eşleşmesi kontrol edildi. Güncellenmiş JSON’u indirebilirsin.';
  } catch(error) {
    status.textContent=error instanceof TypeError ? 'Yardımcı servise ulaşılamadı. Terminalde servisin açık olduğunu kontrol et.' : `AI analizi tamamlanamadı: ${error.message}`;
  } finally {
    clearInterval(waitTimer);
    button.disabled=false;aiPrepare.disabled=false;exportButton.disabled=!lastReport;
    preparedAI=null;aiSend.disabled=true;aiConsent.checked=false;
  }
});
