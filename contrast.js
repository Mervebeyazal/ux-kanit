globalThis.UXContrast = (() => {
  function rgb(value) {
    const match = /^rgba?\(([^)]+)\)$/.exec(value || '');
    if (!match) return null;
    const parts = match[1].split(',').map(Number);
    if (![3, 4].includes(parts.length) || parts.some(v => !Number.isFinite(v))) return null;
    if (parts.slice(0, 3).some(v => v < 0 || v > 255)) return null;
    return { channels: parts.slice(0, 3), alpha: parts[3] ?? 1 };
  }
  function luminance(channels) {
    const linear = channels.map(v => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
  }
  function ratio(first, second) {
    const a = luminance(first), b = luminance(second);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  }
  function minimum(size, weight) {
    return size >= 24 || (size >= 14 * 96 / 72 && weight >= 700) ? 3 : 4.5;
  }
  function measure(element, styleOf) {
    const style = styleOf(element);
    const foreground = rgb(style.color);
    if (!foreground || foreground.alpha !== 1) return null;
    if (style.textShadow !== 'none') return null;
    let background = null;
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      const current = styleOf(ancestor);
      if (Number(current.opacity) !== 1 || current.filter !== 'none' || current.mixBlendMode !== 'normal' || current.backgroundImage !== 'none') return null;
      if (current.transform !== 'none') return null;
      const before = styleOf(ancestor, '::before'), after = styleOf(ancestor, '::after');
      if ([before, after].some(pseudo => !['none', 'normal'].includes(pseudo.content))) return null;
      if (!background) {
        const color = rgb(current.backgroundColor);
        if (!color || (color.alpha !== 0 && color.alpha !== 1)) return null;
        if (color.alpha === 1) background = color.channels;
      }
    }
    // Do not assume an unspecified browser canvas is white.
    if (!background) return null;
    const size = parseFloat(style.fontSize), weight = Number(style.fontWeight);
    if (!Number.isFinite(size) || !Number.isFinite(weight)) return null;
    return { foreground: foreground.channels, background, ratio: ratio(foreground.channels, background),
      minimum: minimum(size, weight), fontSize: size, fontWeight: weight };
  }
  return { rgb, ratio, minimum, measure };
})();
if (typeof module !== 'undefined') module.exports = globalThis.UXContrast;
