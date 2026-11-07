// WCAG 2.x contrast check for the Direction A design tokens (style.css §1;
// docs/implementation/premium-experience-reconstruction/DESIGN_SYSTEM.md).
// Usage: node scripts/contrast.mjs   — exits 1 if any pair is below its threshold.
const hex = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16));
const lum = c => { const [r, g, b] = hex(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// Keep in step with style.css §1 (:root, [data-theme="dark"], .chapter-night / .closing / .section-stage).
export const T = {
  light: { paper: '#F3EEE7', paper2: '#ECE5DA', paper3: '#E4DACB', ink: '#1B1915', ink2: '#544C42', ink3: '#655B4F', rule: '#D6CCBE', ruleStrong: '#82776A', accent: '#8A4B22', ctaBg: '#1B1915', ctaFg: '#F3EEE7', alertInk: '#8C2B1D', alertBg: '#F6E6DF', wa: '#1C7342', focus: '#8A4B22' },
  dark: { paper: '#181A1E', paper2: '#1F2227', paper3: '#272A30', ink: '#EFE9E0', ink2: '#ADA59A', ink3: '#A19A8E', rule: '#353840', ruleStrong: '#767982', accent: '#D99C6C', ctaBg: '#EFE9E0', ctaFg: '#181A1E', alertInk: '#F0B6A8', alertBg: '#2C1B18', wa: '#62C48D', focus: '#D99C6C' },
  // night chapters (the dark render's ground): light theme uses #181A1E, dark theme a deeper #111316
  nightLight: { paper: '#181A1E', paper2: '#202328', ink: '#EFE9E0', ink2: '#B3AB9F', ink3: '#A19A8E', ruleStrong: '#6E717A', accent: '#D99C6C', ctaBg: '#EFE9E0', ctaFg: '#181A1E' },
  nightDark: { paper: '#111316', paper2: '#191B1F', ink: '#EFE9E0', ink2: '#B3AB9F', ink3: '#A19A8E', ruleStrong: '#6E717A', accent: '#D99C6C', ctaBg: '#EFE9E0', ctaFg: '#181A1E' }
};
const checks = [];
for (const m of ['light', 'dark']) {
  const t = T[m];
  for (const bg of ['paper', 'paper2', 'paper3']) {
    checks.push([`${m} ink/${bg}`, t.ink, t[bg], 4.5], [`${m} ink-2/${bg}`, t.ink2, t[bg], 4.5], [`${m} ink-3/${bg}`, t.ink3, t[bg], 4.5],
      [`${m} accent/${bg}`, t.accent, t[bg], 4.5], [`${m} rule-strong/${bg} (UI)`, t.ruleStrong, t[bg], 3], [`${m} focus/${bg} (UI)`, t.focus, t[bg], 3], [`${m} wa glyph/${bg} (UI)`, t.wa, t[bg], 3]);
  }
  checks.push([`${m} cta`, t.ctaFg, t.ctaBg, 4.5], [`${m} alert`, t.alertInk, t.alertBg, 4.5], [`${m} alert/paper`, t.alertInk, t.paper, 4.5]);
}
for (const m of ['nightLight', 'nightDark']) {
  const t = T[m];
  for (const bg of ['paper', 'paper2']) checks.push([`${m} ink/${bg}`, t.ink, t[bg], 4.5], [`${m} ink-2/${bg}`, t.ink2, t[bg], 4.5], [`${m} ink-3/${bg}`, t.ink3, t[bg], 4.5], [`${m} accent/${bg}`, t.accent, t[bg], 4.5], [`${m} rule-strong/${bg} (UI)`, t.ruleStrong, t[bg], 3]);
  checks.push([`${m} cta`, t.ctaFg, t.ctaBg, 4.5]);
}
let fail = 0;
for (const [name, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  if (r < min) fail++;
  console.log(`${r >= min ? 'ok  ' : 'FAIL'} ${name.padEnd(34)} ${fg} on ${bg}  ${r.toFixed(2)}:1 (min ${min})`);
}
process.exit(fail ? 1 : 0);
