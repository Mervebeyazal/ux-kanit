async function analyzeGroq({ apiKey, model, snapshot, instructions, schema, fetchImpl = fetch }) {
  const elements=snapshot?.elements || [];
  const aliases=new Map(elements.map((item,index)=>[`E${index+1}`,item.selector]));
  const compactSnapshot=snapshot ? {...snapshot,elements:elements.map((item,index)=>({...item,selector:`E${index+1}`}))} : snapshot;
  // Six required properties avoid an unconstrained array of principle results.
  const names=schema?.properties?.principles?.items?.properties?.principle?.enum;
  let responseSchema=schema;
  if (names) {
    const item=schema.properties.principles.items;
    const properties={...item.properties};delete properties.principle;
    const rating={type:'object',properties,required:Object.keys(properties),additionalProperties:false};
    responseSchema={...schema,properties:{...schema.properties,
      principles:{type:'object',properties:Object.fromEntries(names.map(name=>[name,rating])),required:names,additionalProperties:false}}};
    const selectors=[...aliases.keys()];
    if(selectors.length) {
      rating.properties={...rating.properties,observationSelectors:{type:'array',items:{type:'string',enum:selectors}}};
      const finding=schema.properties.findings.items;
      responseSchema.properties.findings={type:'array',items:{...finding,properties:{...finding.properties,
        selector:{type:'string',enum:selectors},factKey:{type:'string',enum:['hasName','width','height']}}}};
    }
  }
  const jsonMode=process.env.UX_GROQ_JSON_MODE==='object';
  const response = await fetchImpl('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST', signal:AbortSignal.timeout(90000),
    headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`},
    body:JSON.stringify({ model, temperature:0, seed:42, max_completion_tokens:3500,
      reasoning_effort:'low', stream:false,
      messages:[{role:'system',content:instructions + (jsonMode ? ' JSON yanıtını bu şemaya uygun üret: '+JSON.stringify(responseSchema) : '') + ' principles alanını altı ilke adını anahtar olarak içeren bir nesne olarak döndür; her anahtarda score, rationale, observationSelectors olsun. Bu pakette selector kısa öğe kodudur (E1 vb); kodu birebir kullan. Servis kodu özgün DOM seçicisine çevirecek. hasName=true adsızlık değildir. uiToken=null veya metnin anonimleştirilmesi, öğenin sayfada metinsiz ya da simgesiz olduğu anlamına gelmez. MASKED gizlilik işaretidir; gerçek alanın gizli olduğunu veya doğrulamasının eksik olduğunu göstermez. Sağlarlık eylem olanaklarının algılanabilirliğidir, hata önleme ile karıştırma. Bulgular yalnız hasName=false veya 24 piksel altındaki width/height ile temellendirilebilir; bu adaylar kesin ihlal değildir. findings her zaman bir dizi olsun; desteklenmiş sorun yoksa boş dizi kullan. Bu küçük örneklem için en fazla 3 bulgu üret; ilke gerekçeleri ve öneriler kısa olsun.'},{role:'user',content:JSON.stringify(compactSnapshot)}],
      response_format:jsonMode ? {type:'json_object'} : {type:'json_schema',json_schema:{name:'norman_audit',strict:true,schema:responseSchema}} })
  });
  if (!response.ok) {
    let detail='';
    if(response.status===400) {
      // Only fixed explanations leave the service; never echo generated text or payloads.
      try {
        const failure=await response.json();
        const code=failure?.error?.code;
        const message=typeof failure?.error?.message==='string'?failure.error.message:'';
        if(code==='json_validate_failed') detail=' Model yanıtı zorunlu JSON biçimine uymadı (GROQ_JSON_SCHEMA_FAILED). Yeni önizleme hazırlayıp ayrı onayla yeniden deneyebilirsin.';
        else if(code==='tool_use_failed') detail=' Model yapılandırılmış yanıtı üretemedi (GROQ_STRUCTURED_OUTPUT_FAILED).';
        else if(/schema|response_format/i.test(message)) detail=' Sağlayıcı yanıt şemasını reddetti (GROQ_SCHEMA_REJECTED).';
        else if(/token|context|length/i.test(message)) detail=' Sağlayıcı istek veya yanıt uzunluğunu reddetti (GROQ_LENGTH_REJECTED).';
        else detail=' Sağlayıcı isteği geçersiz buldu (GROQ_BAD_REQUEST).';
      } catch { detail=' Sağlayıcı isteği geçersiz buldu (GROQ_BAD_REQUEST).'; }
    }
    const error = new Error(response.status === 429 ? 'Groq ücretsiz kota veya hız sınırına ulaşıldı. Bir süre bekle ve Groq Limits bölümünü kontrol et.'
      : response.status === 401 ? 'Groq API anahtarı kabul edilmedi.' : `Groq isteği başarısız (${response.status}); otomatik tekrar yapılmadı.${detail}`);
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
  const restore=value=>aliases.get(value) || value;
  if(Array.isArray(raw.principles)) raw.principles=raw.principles.map(p=>({...p,
    observationSelectors:Array.isArray(p.observationSelectors)?p.observationSelectors.map(restore):p.observationSelectors}));
  if(Array.isArray(raw.findings)) raw.findings=raw.findings.map(f=>({...f,selector:restore(f.selector)}));
  return {raw,model:result.model || model,
    requestId:result.id,usage:result.usage,seed:42,systemFingerprint:result.system_fingerprint ?? null};
}
module.exports={analyzeGroq};



