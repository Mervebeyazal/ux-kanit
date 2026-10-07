const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeLocal } = require('../server/ollama.cjs');
test('local adapter sends schema to loopback and retains provider metadata', async () => {
  const result = await analyzeLocal({ model:'qwen3:1.7b',snapshot:{elements:[]},instructions:'test',schema:{type:'object'},
    fetchImpl:async (url,opts) => {
      assert.equal(url,'http://127.0.0.1:11434/api/chat');
      assert.equal(opts.headers.Authorization,undefined);
      const body=JSON.parse(opts.body);
      assert.equal(body.stream,false); assert.deepEqual(body.format,{type:'object'});
      assert.equal(body.options.temperature,0);
      return {ok:true,json:async()=>({done:true,done_reason:'stop',model:'qwen3:1.7b',message:{content:'{"principles":[]}'},eval_count:4})};
    } });
  assert.deepEqual(result.raw,{principles:[]}); assert.equal(result.usage.output_tokens,4);
});
test('cloud model names rejected before any request', async () => {
  await assert.rejects(analyzeLocal({model:'example:cloud',fetchImpl:()=>assert.fail('No request allowed')}));
});
test('truncated model response is not accepted', async () => {
  await assert.rejects(analyzeLocal({model:'qwen3:1.7b',fetchImpl:async()=>({ok:true,json:async()=>({done:true,done_reason:'length',message:{content:'{}'}})})}));
});
