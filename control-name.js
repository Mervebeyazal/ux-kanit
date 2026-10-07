// Presence check, not a full Accessible Name Computation implementation.
// Never return page text or read form values.
globalThis.UXControlName = function (root, doc, styleOf) {
  const nonblank = value => typeof value === 'string' && !!value.trim();
  let remaining = 1500;
  function contentExists(node, referenced = false, depth = 0) {
    if (--remaining < 0 || depth > 60) return null;
    if (node.nodeType === 3) return nonblank(node.nodeValue);
    if (node.nodeType !== 1) return false;
    if (node.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"]), script, style, template')) return false;
    if (!referenced) {
      const style = styleOf(node);
      if (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden') || style.display === 'none' || style.visibility === 'hidden') return false;
    }
    if (nonblank(node.getAttribute('aria-label'))) return true;
    if (node.tagName === 'IMG' && nonblank(node.getAttribute('alt'))) return true;
    let unknown = false;
    for (const child of node.childNodes) {
      const found = contentExists(child, referenced, depth + 1);
      if (found === true) return true;
      if (found === null) unknown = true;
    }
    return unknown ? null : false;
  }
  const ids = (root.getAttribute('aria-labelledby') || '').trim().split(/\s+/).filter(Boolean);
  const references = ids.map(id => doc.getElementById(id)).filter(Boolean);
  if (references.length) {
    const results = references.map(node => contentExists(node, true));
    if (results.includes(true)) return { present: true, source: 'aria-labelledby' };
    if (results.includes(null)) return { present: null, source: 'limit' };
    // A valid but empty reference takes precedence over fallback names.
    return { present: false, source: 'empty-reference' };
  }
  if (nonblank(root.getAttribute('aria-label'))) return { present: true, source: 'aria-label' };
  const content = contentExists(root);
  if (content === true) return { present: true, source: 'content' };
  if (content === null) return { present: null, source: 'limit' };
  if (nonblank(root.getAttribute('title'))) return { present: true, source: 'title' };
  return { present: false, source: 'missing' };
};
if (typeof module !== 'undefined') module.exports = globalThis.UXControlName;
