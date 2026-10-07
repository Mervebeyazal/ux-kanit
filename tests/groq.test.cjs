const test=require('node:test');const assert=require('node:assert/strict');
const {analyzeGroq}=require('../server/groq.cjs');
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
test('Groq error never echoes upstream body or credentials',async()=>{
  await assert.rejects(analyzeGroq({apiKey:'secret',fetchImpl:async()=>({ok:false,status:429,json:()=>assert.fail('Do not read upstream error text')})}), e=>e.safeProviderError && !e.message.includes('secret'));
});
test('Groq truncated response rejected',async()=>{
  await assert.rejects(analyzeGroq({fetchImpl:async()=>({ok:true,json:async()=>({choices:[{finish_reason:'length',message:{content:'{}'}}]})})}));
});
