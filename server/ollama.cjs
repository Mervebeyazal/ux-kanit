const { randomUUID } = require('node:crypto');
async function analyzeLocal({ model, snapshot, instructions, schema, fetchImpl = fetch }) {
  if (!model || /cloud/i.test(model) || !/^[a-z0-9_.:-]+$/i.test(model)) throw new Error('Yerel model adı geçersiz.');
  const response = await fetchImpl('http://127.0.0.1:11434/api/chat', {
    method: 'POST', signal: AbortSignal.timeout(180000), headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, stream: false, format: schema, keep_alive: 0,
      options: { temperature: 0, seed: 42, num_ctx: 16384, num_predict: 5000 },
      messages: [{ role: 'system', content: instructions },
        { role: 'user', content: JSON.stringify(snapshot) }] })
  });
  if (!response.ok) throw new Error('Yerel model yanıt vermedi.');
  const result = await response.json();
  if (result.done !== true || result.done_reason === 'length' || typeof result.message?.content !== 'string') throw new Error('Yerel yanıt eksik.');
  return { raw: JSON.parse(result.message.content), model: result.model || model,
    requestId: `local-${randomUUID()}`, usage: { input_tokens: result.prompt_eval_count ?? null,
      output_tokens: result.eval_count ?? null }, seed: 42 };
}
module.exports = { analyzeLocal };
