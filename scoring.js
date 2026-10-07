globalThis.UXScoring = (() => {
  const categories = [
    ['language', 'Sayfa dili', 5], ['image', 'Görsel alternatif metni', 15],
    ['form', 'Form etiketi', 20], ['target', 'Dokunma hedefi', 15],
    ['name', 'Düğme/bağlantı adı', 20], ['contrast', 'Metin kontrastı', 25]
  ];
  function compute(scan) {
    const counts = {
      language: [1, 0], image: [scan.visibleImageCount, 0], form: [scan.fieldCount, 0],
      target: [scan.targetCount, 0], name: [scan.controlCount - scan.unknownNameCount, scan.unknownNameCount],
      contrast: [scan.contrastMeasured, scan.contrastUnknown]
    };
    const subscores = categories.map(([id, label, weight]) => {
      const [measured, unknown] = counts[id];
      const candidates = new Set(scan.findings.filter(item => item.category === id).map(item => item.selector)).size;
      if (!Number.isInteger(measured) || measured < 0 || !Number.isInteger(unknown) || unknown < 0 || candidates > measured) throw new Error('Skor için tutarsız ölçüm sayıları.');
      return { id, label, weight, measured, unknown, candidates,
        score: measured ? 100 * (1 - candidates / measured) : null,
        coverage: measured + unknown ? measured / (measured + unknown) : null,
        status: measured ? 'provisional' : (unknown ? 'unmeasurable' : 'not_applicable') };
    });
    const available = subscores.filter(item => item.score !== null);
    const availableWeight = available.reduce((sum, item) => sum + item.weight, 0);
    return { modelVersion: 'candidate-rate-v1', status: 'provisional', subscores, availableWeight,
      score: availableWeight ? available.reduce((sum, item) => sum + item.score * item.weight, 0) / availableWeight : null };
  }
  return { compute };
})();
if (typeof module !== 'undefined') module.exports = globalThis.UXScoring;
