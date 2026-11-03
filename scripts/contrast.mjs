// WCAG 2.x contrast check for the design tokens (docs: clinical-visual-reconstruction/DESIGN_SYSTEM.md).
// Usage: node scripts/contrast.mjs   — exits 1 if any pair is below its threshold.
const hex = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16));
const lum = c => { const [r, g, b] = hex(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// Phase 1 tokens (docs/phase-1/DESIGN_SYSTEM.md, style.css §1).
const T = {
  light: { bg: '#F6F3EC', surface: '#FFFDF8', band: '#EEE8DC', plate: '#E7E1D4', ink: '#14201E', ink2: '#33403D', muted: '#545D59', primary: '#0D4D47', onPrimary: '#FFFFFF', primaryInk: '#0E5750', accent: '#9C4220', gold: '#7D5A1C', lineStrong: '#7A817B', alertInk: '#8F2A1C', alertBg: '#FBEEEA', draftInk: '#7A4A0C', draftBg: '#FBF1DF', infoInk: '#1C5680', infoBg: '#E5EEF4', closing: '#0D4D47', onClosing: '#FFFFFF', closingMuted: '#CFE3DD', wa: '#15803D' },
  dark: { bg: '#0F1514', surface: '#161E1D', band: '#121A19', plate: '#1B2423', ink: '#EDE9E0', ink2: '#C5C9C2', muted: '#9DA7A1', primary: '#7FCFC2', onPrimary: '#062320', primaryInk: '#86D3C7', accent: '#EBA27F', gold: '#D9B46C', lineStrong: '#5F6D69', alertInk: '#F3B9AC', alertBg: '#2A1714', draftInk: '#F0CB8C', draftBg: '#2A2112', infoInk: '#A9CBE6', infoBg: '#14212B', closing: '#0F3B37', onClosing: '#FFFFFF', closingMuted: '#BFDAD5', wa: '#15803D' },
  stage: { stage: '#0C1416', card: '#111D1F', text: '#EDEAE2', ink2: '#CCD5D1', muted: '#AAB5B1', btn: '#F6F3EC', onBtn: '#0B3D38', link: '#8ADACF', accent: '#EBA27F', gold: '#D9B46C' }
};
const checks = [];
for (const m of ['light', 'dark']) {
  const t = T[m];
  for (const bg of ['bg', 'surface', 'band']) {
    checks.push([`${m} ink/${bg}`, t.ink, t[bg], 4.5], [`${m} ink-2/${bg}`, t.ink2, t[bg], 4.5], [`${m} muted/${bg}`, t.muted, t[bg], 4.5], [`${m} primary-ink/${bg}`, t.primaryInk, t[bg], 4.5], [`${m} accent/${bg}`, t.accent, t[bg], 4.5], [`${m} gold/${bg}`, t.gold, t[bg], 4.5], [`${m} line-strong/${bg} (UI)`, t.lineStrong, t[bg], 3]);
  }
  checks.push([`${m} muted/plate`, t.muted, t.plate, 4.5], [`${m} on-primary/primary`, t.onPrimary, t.primary, 4.5], [`${m} alert`, t.alertInk, t.alertBg, 4.5], [`${m} draft badge`, t.draftInk, t.draftBg, 4.5], [`${m} info note`, t.infoInk, t.infoBg, 4.5],
    [`${m} closing text`, t.onClosing, t.closing, 4.5], [`${m} closing muted`, t.closingMuted, t.closing, 4.5], [`${m} white/WhatsApp`, '#FFFFFF', t.wa, 4.5], [`${m} primary/bg (UI)`, t.primary, t.bg, 3]);
}
const s = T.stage;
for (const bg of ['stage', 'card']) checks.push([`stage text/${bg}`, s.text, s[bg], 4.5], [`stage ink-2/${bg}`, s.ink2, s[bg], 4.5], [`stage muted/${bg}`, s.muted, s[bg], 4.5], [`stage link/${bg}`, s.link, s[bg], 4.5], [`stage accent/${bg}`, s.accent, s[bg], 4.5], [`stage gold/${bg}`, s.gold, s[bg], 4.5]);
checks.push(['stage button', s.onBtn, s.btn, 4.5]);
let fail = 0;
for (const [name, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  if (r < min) fail++;
  console.log(`${r >= min ? 'ok  ' : 'FAIL'} ${name.padEnd(30)} ${fg} on ${bg}  ${r.toFixed(2)}:1 (min ${min})`);
}
process.exit(fail ? 1 : 0);
