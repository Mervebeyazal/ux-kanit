const fs=require('node:fs');
const files=process.argv.slice(2);
if(files.length<3) { console.error('En az üç gerçek AI JSON raporu verin: node server/compare-repeats.cjs rapor1.json rapor2.json rapor3.json'); process.exit(1); }
try {
  const runs=files.map(file=>JSON.parse(fs.readFileSync(file,'utf8')).scores?.llm);
  if(runs.some(r=>!r?.snapshotHash || !r.principles?.length || r.status==='not_evaluated')) throw Error('Başarılı gerçek LLM raporu eksik.');
  const first=runs[0];
  for(const key of ['snapshotHash','model','provider','temperature','promptVersion','seed']) if(runs.some(r=>r[key]!==first[key])) throw Error(`${key} farklı: karşılaştırılabilir aynı gözlem/model koşulu yok.`);
  if(new Set(runs.map(r=>r.requestId)).size!==runs.length || runs.some(r=>!r.requestId)) throw Error('Bağımsız istek kimlikleri eksik veya tekrar edilmiş.');
  const metrics=values=>{
    if(values.some(v=>!Number.isFinite(v))) return {status:'insufficient_evidence'};
    const mean=values.reduce((a,b)=>a+b,0)/values.length;
    const range=Math.max(...values)-Math.min(...values);
    return {values,mean,rangePoints:range,populationStdDev:Math.sqrt(values.reduce((a,b)=>a+(b-mean)**2,0)/values.length),exceeds10Points:range>10};
  };
  console.log(JSON.stringify({runs:runs.length,model:first.model,snapshotHash:first.snapshotHash,
    definition:'Sapma = en yüksek skor − en düşük skor; null skorlar karşılaştırılmaz.',
    overall:metrics(runs.map(r=>r.score)),principles:first.principles.map(p=>({principle:p.principle,...metrics(runs.map(r=>r.principles.find(x=>x.principle===p.principle)?.score))})),
    note:'10 puanı aşan sapma için gerçek bulgu farkları incelenmeli ve çözüm sonrası yeniden ölçülmeli. Bu çıktı yorum doğruluğunu kanıtlamaz.'},null,2));
} catch(error) {console.error(error.message);process.exit(1);}
