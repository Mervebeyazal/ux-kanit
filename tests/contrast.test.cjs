const test = require('node:test');
const assert = require('node:assert/strict');
const contrast = require('../contrast.js');
test('black on white has contrast 21', () => assert.equal(contrast.ratio([0, 0, 0], [255, 255, 255]), 21));
test('identical colors have contrast 1', () => assert.equal(contrast.ratio([88, 88, 88], [88, 88, 88]), 1));
test('normal text threshold and large text boundaries', () => {
  assert.equal(contrast.minimum(23.99, 400), 4.5);
  assert.equal(contrast.minimum(24, 400), 3);
  assert.equal(contrast.minimum(14 * 96 / 72, 700), 3);
  assert.equal(contrast.minimum(18.66, 700), 4.5);
});
test('gray 119 on white remains below 4.5 without rounding', () => assert.ok(contrast.ratio([119, 119, 119], [255, 255, 255]) < 4.5));
const base = { color: 'rgb(119, 119, 119)', backgroundColor: 'rgb(255, 255, 255)', fontSize: '16px', fontWeight: '400', opacity: '1', filter: 'none', mixBlendMode: 'normal', backgroundImage: 'none', transform: 'none', textShadow: 'none' };
const measure = changes => contrast.measure({ parentElement: null }, (node, pseudo) => pseudo ? { content: 'none' } : { ...base, ...changes });
test('solid background can be measured', () => assert.equal(measure({}).minimum, 4.5));
test('image, transparency and unknown canvas are not assigned fabricated ratios', () => {
  assert.equal(measure({ backgroundImage: 'url(image)' }), null);
  assert.equal(measure({ opacity: '.5' }), null);
  assert.equal(measure({ backgroundColor: 'rgba(0, 0, 0, 0)' }), null);
});
test('text overlapping a sibling image is unmeasurable, not low contrast', () => {
  const heading = { parentElement: null, getBoundingClientRect: () => ({ left: 20, right: 300, top: 50, bottom: 90 }) };
  const styleOf = (node, pseudo) => pseudo ? { content: 'none' } : base;
  assert.equal(contrast.measure(heading, styleOf, [{ left: 0, right: 500, top: 0, bottom: 200 }]), null);
  assert.ok(contrast.measure(heading, styleOf, [{ left: 0, right: 500, top: 200, bottom: 300 }]));
});
