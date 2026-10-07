const test = require('node:test');
const assert = require('node:assert/strict');
const { compute } = require('../scoring.js');
const base = { visibleImageCount: 10, fieldCount: 1, targetCount: 10, controlCount: 10,
  unknownNameCount: 0, contrastMeasured: 10, contrastUnknown: 0, findings: [] };
test('no detected candidates yields provisional 100', () => {
  const result = compute(base); assert.equal(result.score, 100); assert.equal(result.status, 'provisional');
});
test('one missing label out of one yields category 0 and weighted score 80', () => {
  const result = compute({ ...base, findings: [{ category: 'form', selector: 'input' }] });
  assert.equal(result.subscores.find(item => item.id === 'form').score, 0); assert.equal(result.score, 80);
});
test('unknown contrast does not receive score 100', () => {
  const result = compute({ ...base, contrastMeasured: 0, contrastUnknown: 10 });
  assert.equal(result.subscores.find(item => item.id === 'contrast').score, null); assert.equal(result.availableWeight, 75);
});
test('duplicate findings on one element are not penalized twice', () => {
  const item = { category: 'target', selector: 'button' };
  assert.equal(compute({ ...base, findings: [item, item] }).subscores.find(item => item.id === 'target').score, 90);
});
test('contrast coverage is separate from candidate rate', () => {
  const result = compute({ ...base, contrastUnknown: 10 });
  const contrast = result.subscores.find(item => item.id === 'contrast');
  assert.equal(contrast.coverage, .5); assert.equal(contrast.score, 100);
});
test('candidate count cannot exceed measured elements', () => assert.throws(() => compute({ ...base, fieldCount: 0, findings: [{ category: 'form', selector: 'input' }] })));
