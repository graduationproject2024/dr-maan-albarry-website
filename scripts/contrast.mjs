// WCAG 2.x contrast check for the design tokens (docs: clinical-visual-reconstruction/DESIGN_SYSTEM.md).
// Usage: node scripts/contrast.mjs   — exits 1 if any pair is below its threshold.
const hex = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16));
const lum = c => { const [r, g, b] = hex(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const T = {
  light: { bg: '#F4F6F5', surface: '#FFFFFF', band: '#E9EFED', plate: '#E4ECEA', ink: '#0F1E1C', ink2: '#33433F', muted: '#56655F', primary: '#0B5A52', onPrimary: '#FFFFFF', primaryInk: '#0B5A52', accent: '#9E4322', lineStrong: '#7C8B87', alertInk: '#8F2A1C', alertBg: '#FBEEEA', draftInk: '#7A4A0C', draftBg: '#FBF1DF', closing: '#0B5A52', onClosing: '#FFFFFF', closingMuted: '#CFE5E0', wa: '#15803D' },
  dark: { bg: '#0E1716', surface: '#14201F', band: '#111C1B', plate: '#182625', ink: '#E7EFEC', ink2: '#B9C8C4', muted: '#93A6A1', primary: '#6CCBBE', onPrimary: '#06201D', primaryInk: '#7DD3C7', accent: '#EBA27F', lineStrong: '#5E716D', alertInk: '#F3B9AC', alertBg: '#2A1714', draftInk: '#F0CB8C', draftBg: '#2A2112', closing: '#0F3F3A', onClosing: '#FFFFFF', closingMuted: '#BFDAD5', wa: '#15803D' },
  stage: { stage: '#0C1517', text: '#EAF1EF', muted: '#A9BAB6', btn: '#F4F6F5', onBtn: '#0B3D38' }
};
const checks = [];
for (const m of ['light', 'dark']) {
  const t = T[m];
  for (const bg of ['bg', 'surface', 'band']) {
    checks.push([`${m} ink/${bg}`, t.ink, t[bg], 4.5], [`${m} ink-2/${bg}`, t.ink2, t[bg], 4.5], [`${m} muted/${bg}`, t.muted, t[bg], 4.5], [`${m} primary-ink/${bg}`, t.primaryInk, t[bg], 4.5], [`${m} accent/${bg}`, t.accent, t[bg], 4.5], [`${m} line-strong/${bg} (UI)`, t.lineStrong, t[bg], 3]);
  }
  checks.push([`${m} muted/plate`, t.muted, t.plate, 4.5], [`${m} on-primary/primary`, t.onPrimary, t.primary, 4.5], [`${m} alert`, t.alertInk, t.alertBg, 4.5], [`${m} draft badge`, t.draftInk, t.draftBg, 4.5],
    [`${m} closing text`, t.onClosing, t.closing, 4.5], [`${m} closing muted`, t.closingMuted, t.closing, 4.5], [`${m} white/WhatsApp`, '#FFFFFF', t.wa, 4.5], [`${m} primary/bg (UI)`, t.primary, t.bg, 3]);
}
const s = T.stage;
checks.push(['stage text', s.text, s.stage, 4.5], ['stage muted', s.muted, s.stage, 4.5], ['stage button', s.onBtn, s.btn, 4.5]);
let fail = 0;
for (const [name, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  if (r < min) fail++;
  console.log(`${r >= min ? 'ok  ' : 'FAIL'} ${name.padEnd(30)} ${fg} on ${bg}  ${r.toFixed(2)}:1 (min ${min})`);
}
process.exit(fail ? 1 : 0);
