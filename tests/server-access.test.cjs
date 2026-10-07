const test=require('node:test');const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');const path=require('node:path');
test('local service rejects web origins and invalid pairing without API requests',async t=>{
  const child=spawn(process.execPath,[path.join(__dirname,'../server/server.cjs')],{
    env:{...process.env,OPENAI_API_KEY:'sk-test-placeholder-never-used'},stdio:['ignore','pipe','pipe'],windowsHide:true
  });
  t.after(()=>child.kill());
  await new Promise((resolve,reject)=>{
    let output='';const timer=setTimeout(()=>reject(new Error('Local server startup timed out')),5000);
    child.stdout.on('data',chunk=>{output+=chunk.toString();if(output.includes('yerel bağlantı kodu:')){clearTimeout(timer);resolve();}});
    child.once('exit',()=>{clearTimeout(timer);reject(new Error('Local test server could not start'));});
  });
  const url='http://127.0.0.1:8787/analyze';
  const web=await fetch(url,{method:'POST',headers:{Origin:'https://example.com'}});assert.equal(web.status,403);
  const wrong=await fetch(url,{method:'POST',headers:{Origin:'chrome-extension://'+'a'.repeat(32),'X-UX-Pairing':'wrong'}});assert.equal(wrong.status,401);
  const preflight=await fetch(url,{method:'OPTIONS',headers:{Origin:'chrome-extension://'+'a'.repeat(32)}});assert.equal(preflight.status,200);
  assert.equal(preflight.headers.get('access-control-allow-origin'),'chrome-extension://'+'a'.repeat(32));
});
