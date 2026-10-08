const test=require('node:test');const assert=require('node:assert/strict');
const {analyzeGroq}=require('../server/groq.cjs');
test('all six principles are required and normalized for evidence validation',async()=>{
  const {schema,principles}=require('../server/contract.cjs');
  const result=await analyzeGroq({schema,snapshot:{elements:[]},fetchImpl:async(url,opts)=>{
    const format=JSON.parse(opts.body).response_format.json_schema.schema;
    assert.equal(format.properties.principles.type,'object');
    assert.deepEqual(format.properties.principles.required,principles);
    const ratings=Object.fromEntries(principles.map(p=>[p,{score:null,rationale:'Yetersiz kanıt',observationSelectors:[]}]));
    return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify({principles:ratings,findings:[]})}}]})};
  }});
  assert.deepEqual(result.raw.principles.map(p=>p.principle),principles);
});
test('Groq adapter sends strict schema and records repeat metadata',async()=>{
  const result=await analyzeGroq({apiKey:'test-only',model:'openai/gpt-oss-20b',snapshot:{elements:[]},instructions:'test',schema:{type:'object'},
    fetchImpl:async(url,opts)=>{
      assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');
      const body=JSON.parse(opts.body);assert.equal(body.response_format.json_schema.strict,true);
      assert.equal(body.seed,42);assert.equal(body.temperature,0);
      return {ok:true,json:async()=>({id:'test-request',model:'test-model',system_fingerprint:'test-fingerprint',choices:[{finish_reason:'stop',message:{content:'{}'}}]})};
    }});
  assert.equal(result.requestId,'test-request');assert.equal(result.systemFingerprint,'test-fingerprint');
});
test('Groq selectors constrained to actual snapshot options',async()=>{
  const {schema}=require('../server/contract.cjs');
  const selector='html > body:nth-of-type(1) > button:nth-of-type(1)';
  await analyzeGroq({schema,snapshot:{elements:[{selector}]},fetchImpl:async(url,opts)=>{
    const format=JSON.parse(opts.body).response_format.json_schema.schema;
    assert.deepEqual(format.properties.findings.items.properties.selector.enum,['E1']);
    assert.deepEqual(format.properties.principles.properties.Görünürlük.properties.observationSelectors.items.enum,['E1']);
    return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:'{}'}}]})};
  }});
});
test('Groq error never echoes upstream body or credentials',async()=>{
  await assert.rejects(analyzeGroq({apiKey:'secret',fetchImpl:async()=>({ok:false,status:429,json:()=>assert.fail('Do not read upstream error text')})}), e=>e.safeProviderError && !e.message.includes('secret'));
});
test('Groq truncated response rejected',async()=>{
  await assert.rejects(analyzeGroq({fetchImpl:async()=>({ok:true,json:async()=>({choices:[{finish_reason:'length',message:{content:'{}'}}]})})}));
});


test('compact aliases round-trip and unknown IDs remain rejectable',async()=>{
  const {schema,principles}=require('../server/contract.cjs');
  const selector='html > body:nth-of-type(1) > button:nth-of-type(1)';
  const result=await analyzeGroq({schema,snapshot:{elements:[{selector,facts:{hasName:false}}]},fetchImpl:async(url,opts)=>{
    const body=JSON.parse(opts.body);
    assert.equal(JSON.parse(body.messages[1].content).elements[0].selector,'E1');
    assert.equal(body.messages[1].content.includes(selector),false);
    const ratings=Object.fromEntries(principles.map(p=>[p,{score:null,rationale:'test',observationSelectors:['E1','E99']}]));
    return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify({principles:ratings,findings:[{selector:'E1'}]})}}]})};
  }});
  assert.equal(result.raw.findings[0].selector,selector);
  assert.deepEqual(result.raw.principles[0].observationSelectors,[selector,'E99']);
});

test('JSON object fallback keeps evidence schema in instructions without automatic retry',async()=>{
  const prior=process.env.UX_GROQ_JSON_MODE;process.env.UX_GROQ_JSON_MODE='object';
  let calls=0;
  try {
    await analyzeGroq({instructions:'test',schema:{type:'object'},snapshot:{elements:[]},fetchImpl:async(url,opts)=>{
      calls++;const body=JSON.parse(opts.body);
      assert.deepEqual(body.response_format,{type:'json_object'});
      assert.ok(body.messages[0].content.includes('"type":"object"'));
      return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:'{}'}}]})};
    }});
    assert.equal(calls,1);
  } finally { if(prior===undefined)delete process.env.UX_GROQ_JSON_MODE;else process.env.UX_GROQ_JSON_MODE=prior; }
});
