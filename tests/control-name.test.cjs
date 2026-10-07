const test = require('node:test');
const assert = require('node:assert/strict');
const check = require('../control-name.js');
const text = value => ({ nodeType: 3, nodeValue: value });
function element(tag, attributes = {}, children = []) {
  return {
    nodeType: 1, tagName: tag, childNodes: children,
    getAttribute: key => attributes[key] ?? null,
    hasAttribute: key => Object.hasOwn(attributes, key),
    matches: () => ['INPUT', 'TEXTAREA', 'SELECT', 'SCRIPT', 'STYLE', 'TEMPLATE'].includes(tag) || Object.hasOwn(attributes, 'contenteditable'),
    get value() { throw new Error('Form value must not be read'); }
  };
}
const style = node => ({ display: node.hasAttribute('hidden') ? 'none' : 'block', visibility: 'visible' });
const run = (root, refs = {}) => check(root, { getElementById: id => refs[id] || null }, style);
test('icon-only button is a candidate', () => assert.equal(run(element('BUTTON', {}, [element('SVG')])).present, false));
test('visible button text supplies a name', () => assert.equal(run(element('BUTTON', {}, [text('Ara')])).present, true));
test('aria-label names an icon-only button', () => assert.equal(run(element('BUTTON', { 'aria-label': 'Menüyü aç' })).source, 'aria-label'));
test('hidden descendant text does not supply a name', () => assert.equal(run(element('BUTTON', {}, [element('SPAN', { hidden: '' }, [text('Ara')])])).present, false));
test('hidden directly referenced label can supply a name', () => assert.equal(run(element('BUTTON', { 'aria-labelledby': 'name' }), { name: element('SPAN', { hidden: '' }, [text('Ara')]) }).present, true));
test('valid empty reference takes priority over fallback', () => assert.equal(run(element('BUTTON', { 'aria-labelledby': 'empty', 'aria-label': 'Ara' }), { empty: element('SPAN') }).present, false));
test('image alt can name a link', () => assert.equal(run(element('A', {}, [element('IMG', { alt: 'Instagram' })])).present, true));
test('nested form values and textarea content are ignored', () => assert.equal(run(element('BUTTON', {}, [element('INPUT'), element('TEXTAREA', {}, [text('private')])])).present, false));
