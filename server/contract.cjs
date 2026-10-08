const { createHash } = require('node:crypto');
const principles = ['Görünürlük', 'Geri Bildirim', 'Kısıtlar', 'Eşleme', 'Tutarlılık', 'Sağlarlık'];
const taskKeys=['taskVisibility','taskFeedback','taskConstraints','taskMapping','taskConsistency','taskAffordance'];
const uiTokens = ['ara','arama','randevu al','doktor bul','hastane bul','giriş yap','üye ol','menü','geri','ileri','detaylı bilgi','iletişim','yardım','sepete ekle','satın al','gönder','kapat'];
const hash = snapshot => createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
function validateSnapshot(snapshot) {
  if (snapshot?.snapshotVersion !== 'static-ui-v1' || snapshot.observationMode !== 'static-no-interactions' || !Array.isArray(snapshot.elements) || snapshot.elements.length > 150) throw new Error('Geçersiz gözlem paketi.');
  const keys = ['tag','width','height','x','y','fontSize','hasName','uiToken','isField','formValue','required','disabled','statusRole','expanded','inViewport'];
  const selectors = new Set();
  for (const item of snapshot.elements) {
    if (!item || Object.keys(item).length !== 2 || Object.keys(item).some(key => !['selector','facts'].includes(key))) throw new Error('Öğe paketinde izin verilmeyen veri.');
    if (!/^html(?: > [a-z][a-z0-9-]*:nth-of-type\([1-9]\d*\))+$/.test(item.selector) || item.selector.length > 5000 || selectors.has(item.selector)) throw new Error('Geçersiz seçici.');
    selectors.add(item.selector);
    const f = item.facts;
    const hasTask=Object.hasOwn(f || {},'taskEvidenceSource');
    const allowed=hasTask ? [...keys,'taskEvidenceSource',...taskKeys] : keys;
    if (!f || Object.keys(f).length !== allowed.length || Object.keys(f).some(k => !allowed.includes(k))) throw new Error('İzin verilmeyen veri alanı.');
    if(hasTask && (f.taskEvidenceSource!=='user-confirmed' || taskKeys.some(key=>!['good','problem','untested'].includes(f[key]))))throw new Error('Geçersiz görev gözlemi.');
    if (!['a','button','input','select','textarea','div','span','p','section','nav','ul','li','summary','label','svg'].includes(f.tag)) throw new Error('Desteklenmeyen öğe.');
    for (const key of ['width','height','x','y','fontSize']) if (!Number.isFinite(f[key]) || Math.abs(f[key]) > 1e7) throw new Error('Geçersiz ölçüm.');
    for (const key of ['isField','required','disabled','inViewport']) if (typeof f[key] !== 'boolean') throw new Error('Geçersiz durum.');
    for (const key of ['hasName','expanded']) if (f[key] !== null && typeof f[key] !== 'boolean') throw new Error('Geçersiz durum.');
    if (f.uiToken !== null && !uiTokens.includes(f.uiToken)) throw new Error('Serbest metin gönderilemez.');
    if (f.formValue !== (f.isField ? '[MASKED]' : null) || (f.statusRole !== null && !['status','alert'].includes(f.statusRole))) throw new Error('Form verisi veya rol geçersiz.');
  }
  if (![snapshot.viewport?.width,snapshot.viewport?.height].every(value => Number.isFinite(value) && value > 0 && value < 100000)) throw new Error('Geçersiz ekran boyutu.');
  // Construct a new allowlisted payload: discard unknown top-level data.
  return { snapshotVersion: snapshot.snapshotVersion, observationMode: snapshot.observationMode,
    viewport: { width: Number(snapshot.viewport?.width), height: Number(snapshot.viewport?.height) },
    sampledCount: snapshot.elements.length, elements: snapshot.elements };
}
const string = { type: 'string' };
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const schema = object({
  principles: { type: 'array', items: object({ principle: { type: 'string', enum: principles }, score: { type: ['number','null'], minimum: 0, maximum: 100 }, rationale: string,
    observationSelectors: { type: 'array', items: string } }) },
  findings: { type: 'array', items: object({ principle: { type: 'string', enum: principles }, selector: string,
    factKey: string, factValueJSON: string, title: string, rationale: string,
    severity: { type: 'string', enum: ['Kritik','Yüksek','Orta','Düşük'] }, recommendation: string }) }
});
function validateResult(raw, snapshot) {
  if (!Array.isArray(raw?.principles) || raw.principles.length !== 6 || !Array.isArray(raw.findings) || raw.findings.length > 60) throw new Error('AI yanıt yapısı geçersiz.');
  if (new Set(raw.principles.map(p => p.principle)).size !== 6 || raw.principles.some(p => !principles.includes(p.principle))) throw new Error('Altı ilke eksik.');
  const bySelector = new Map(snapshot.elements.map(item => [item.selector,item]));
  const accepted = [], rejected = [];
  for (const item of raw.findings) {
    const observed = bySelector.get(item.selector);
    if (!observed) { rejected.push({ reason: 'nonexistent_snapshot_selector', finding: item }); continue; }
    if (!Object.hasOwn(observed.facts,item.factKey) || JSON.stringify(observed.facts[item.factKey]) !== item.factValueJSON) {
      rejected.push({ reason: 'unsupported_fact', finding: item }); continue;
    }
    // A matched positive name or a UI token does not evidence a defect.
    // Conservative scope: only absent name sources or small bounds can underpin candidates.
    const taskIssue=taskKeys[principles.indexOf(item.principle)]===item.factKey && observed.facts.taskEvidenceSource==='user-confirmed' && observed.facts[item.factKey]==='problem';
    const issueBasis=taskIssue || (item.factKey==='hasName' && observed.facts.hasName===false) ||
      (['width','height'].includes(item.factKey) && observed.facts[item.factKey]>0 && observed.facts[item.factKey]<24);
    if (!issueBasis) { rejected.push({reason:'insufficient_issue_evidence',finding:item}); continue; }
    if (!principles.includes(item.principle) || !['Kritik','Yüksek','Orta','Düşük'].includes(item.severity) || !item.title || !item.rationale || !item.recommendation) throw new Error('AI bulgusu geçersiz.');
    accepted.push({ ...item, source: 'llm', rule: `Norman: ${item.principle}`, evidence: `${item.factKey} = ${item.factValueJSON}`,
      evidenceSource:taskIssue?'user-confirmed-task-observation':'dom-measurement',
      validationStatus: 'fact_matched_interpretation_pending_manual_review' });
  }
  const evaluated = raw.principles.map(p => {
    if (typeof p.rationale !== 'string' || !p.rationale.trim() || !Array.isArray(p.observationSelectors)) throw new Error('İlke gerekçesi eksik.');
    const backed = Array.isArray(p.observationSelectors) && p.observationSelectors.length && p.observationSelectors.every(s => bySelector.has(s));
    const relatedRejected = rejected.some(r => r.finding.principle === p.principle);
    if (p.score !== null && (!Number.isFinite(p.score) || p.score < 0 || p.score > 100)) throw new Error('Geçersiz AI skoru.');
    // No interaction was observed: do not fabricate a feedback score.
    const taskKey=taskKeys[principles.indexOf(p.principle)];
    const taskBacked=backed && p.observationSelectors.some(s=>{
      const facts=bySelector.get(s).facts;
      return facts.taskEvidenceSource==='user-confirmed' && ['good','problem'].includes(facts[taskKey]);
    });
    const score = !backed || relatedRejected || (p.principle === 'Geri Bildirim' && !taskBacked) ? null : p.score;
    return { ...p, score, evidenceSource:taskBacked?'user-confirmed-task-observation':'static-dom',status: score === null ? 'insufficient_evidence' : taskBacked?'provisional_task':'provisional_static' };
  });
  const scored = evaluated.filter(p => p.score !== null);
  const score = scored.length ? scored.reduce((sum,p) => sum+p.score,0)/scored.length : null;
  const nonexistent = rejected.filter(r => r.reason === 'nonexistent_snapshot_selector').length;
  return { principles: evaluated, score, scoreScope: snapshot.elements.some(el=>el.facts.taskEvidenceSource==='user-confirmed')?'available-principles-with-user-task-evidence':'available-static-principles-only', complete: scored.length === 6,
    findings: accepted, rejected, hallucination: { proposed: raw.findings.length, nonexistentSnapshotSelectors: nonexistent,
      nonexistentSnapshotSelectorRate: raw.findings.length ? nonexistent/raw.findings.length : null,
      note: 'Bu oran snapshot seçicileri içindir; güncel DOM varlığı ve yorum doğruluğu ayrıca doğrulanır.' } };
}
module.exports = { principles, validateSnapshot, validateResult, schema, hash };
