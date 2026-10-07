async function analyzeGroq({ apiKey, model, snapshot, instructions, schema, fetchImpl = fetch }) {
  // Six required properties avoid an unconstrained array of principle results.
  const names=schema?.properties?.principles?.items?.properties?.principle?.enum;
  let responseSchema=schema;
  if (names) {
    const item=schema.properties.principles.items;
    const properties={...item.properties};delete properties.principle;
    const rating={type:'object',properties,required:Object.keys(properties),additionalProperties:false};
    responseSchema={...schema,properties:{...schema.properties,
      principles:{type:'object',properties:Object.fromEntries(names.map(name=>[name,rating])),required:names,additionalProperties:false}}};
  }
  const response = await fetchImpl('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST', signal:AbortSignal.timeout(90000),
    headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`},
    body:JSON.stringify({ model, temperature:0, seed:42, max_completion_tokens:3500,
      reasoning_effort:'low', stream:false,
      messages:[{role:'system',content:instructions + ' principles alanını altı ilke adını anahtar olarak içeren bir nesne olarak döndür; her anahtarda score, rationale, observationSelectors olsun. findings her zaman bir dizi olsun; bulgu yoksa boş dizi kullan. Bu küçük örneklem için en fazla 3 bulgu üret; ilke gerekçeleri ve öneriler kısa olsun.'},{role:'user',content:JSON.stringify(snapshot)}],
      response_format:{type:'json_schema',json_schema:{name:'norman_audit',strict:true,schema:responseSchema}} })
  });
  if (!response.ok) {
    const error = new Error(response.status === 429 ? 'Groq ücretsiz kota veya hız sınırına ulaşıldı. Bir süre bekle ve Groq Limits bölümünü kontrol et.'
      : response.status === 401 ? 'Groq API anahtarı kabul edilmedi.' : `Groq isteği başarısız (${response.status}); otomatik tekrar yapılmadı.`);
    error.safeProviderError=true; throw error;
  }
  const result=await response.json();
  const choice=result.choices?.[0];
  if(choice?.finish_reason!=='stop' || typeof choice.message?.content!=='string') {
    const error=new Error(choice?.finish_reason==='length'
      ? 'Groq yanıtı çıktı token sınırında kesildi (GROQ_OUTPUT_LIMIT). Analiz sonucu kabul edilmedi.'
      : 'Groq tamamlanmış metin yanıtı vermedi (GROQ_INCOMPLETE).');
    error.safeProviderError=true; throw error;
  }
  let raw;
  try { raw=JSON.parse(choice.message.content); } catch {
    const error=new Error('Groq yanıtı geçerli JSON değil (GROQ_INVALID_JSON).');error.safeProviderError=true;throw error;
  }
  if (names && raw.principles && !Array.isArray(raw.principles)) {
    raw={...raw,principles:names.map(principle=>({ ...raw.principles[principle],principle }))};
  }
  return {raw,model:result.model || model,
    requestId:result.id,usage:result.usage,seed:42,systemFingerprint:result.system_fingerprint ?? null};
}
module.exports={analyzeGroq};


