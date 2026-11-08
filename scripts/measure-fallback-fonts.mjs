// Measures the metric overrides for the local fallback faces in style.css §0 (BUG-05: no font-swap layout shift).
// For each self-hosted web font / local font pair and weight: size-adjust = web text width / local text width, and
// ascent/descent-override = web ascent/descent (as a fraction of the font size) / size-adjust.
// Usage: node scripts/measure-fallback-fonts.mjs   (reads public/fonts/*.woff2; prints a table and the @font-face rules)
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const font = f => `data:font/woff2;base64,${fs.readFileSync(`public/fonts/${f}`).toString('base64')}`;
const AR_D = 'د. معن بن عبدالله البري استشاري طب وجراحة العيون ما الذي يعالجه خبرة سريرية وأكاديمية منذ';
const AR_T = 'يعمل ضمن وحدة الماء الأبيض ووحدة القرنية وتصحيح النظر في مغربي الصحية للعيون والأذن';
const EN_D = 'Dr. Maan bin Abdullah Al Barry, Consultant Ophthalmologist, What Dr. Maan treats 1998 15,000+';
const EN_T = 'He works within the cataract unit and the cornea and refractive surgery unit at Magrabi';
const PAIRS = [
  { web: 'Noto Naskh Arabic', file: { 600: 'noto-naskh-arabic-600.woff2' }, local: { 600: 'Times New Roman' }, weights: [600], sample: AR_D, fallback: 'Noto Naskh Arabic Fallback', src: { 600: 'local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT")' } },
  { web: 'IBM Plex Sans Arabic', file: { 400: 'plex-arabic-400.woff2', 600: 'plex-arabic-600.woff2' }, local: { 400: 'Segoe UI', 600: 'Segoe UI' }, weights: [400, 600], sample: AR_T, fallback: 'IBM Plex Sans Arabic Fallback', src: { 400: 'local("Segoe UI")', 600: 'local("Segoe UI Semibold"), local("SegoeUI-Semibold")' } },
  { web: 'Newsreader', file: { 400: 'newsreader-roman.woff2' }, local: { 400: 'Times New Roman' }, weights: [400], sample: EN_D, fallback: 'Newsreader Fallback', src: { 400: 'local("Times New Roman"), local("TimesNewRomanPSMT")' } },
  { web: 'IBM Plex Sans', file: { 400: 'plex-sans-400.woff2', 600: 'plex-sans-600.woff2' }, local: { 400: 'Arial', 600: 'Arial' }, weights: [400, 600], sample: EN_T, fallback: 'IBM Plex Sans Fallback', src: { 400: 'local("Arial"), local("ArialMT")', 600: 'local("Arial Bold"), local("Arial-BoldMT")' } }
];
const faces = PAIRS.flatMap(p => p.weights.map(w => `@font-face{font-family:"${p.web}";font-weight:${w};src:url(${font(p.file[w])}) format("woff2")}`)).join('\n');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<html><head><style>${faces}</style></head><body>${PAIRS.map(p => p.weights.map(w => `<span style="font-family:'${p.web}';font-weight:${w}">${p.sample}</span>`).join('')).join('')}</body></html>`);
await page.evaluate(() => document.fonts.ready);
const out = await page.evaluate(async (pairs) => {
  const c = document.createElement('canvas').getContext('2d');
  const m = (family, w, text) => { c.font = `${w} 100px "${family}"`; const r = c.measureText(text); return { width: r.width, ascent: r.fontBoundingBoxAscent / 100, descent: r.fontBoundingBoxDescent / 100 }; };
  const res = [];
  for (const p of pairs) for (const w of p.weights) {
    await document.fonts.load(`${w} 100px "${p.web}"`, p.sample);
    const web = m(p.web, w, p.sample); const loc = m(p.local[w], w, p.sample);
    const sa = web.width / loc.width;
    res.push({ face: `${p.web} ${w} <- ${p.local[w]}`, fallback: p.fallback, weight: w, src: p.src[w], sizeAdjust: +(sa * 100).toFixed(2), ascentOverride: +(web.ascent / sa * 100).toFixed(2), descentOverride: +(web.descent / sa * 100).toFixed(2) });
  }
  return res;
}, PAIRS);
console.table(out.map(({ face, sizeAdjust, ascentOverride, descentOverride }) => ({ face, sizeAdjust, ascentOverride, descentOverride })));
for (const o of out) {
  const range = o.weight >= 550 ? '550 900' : '100 549';
  console.log(`@font-face { font-family: "${o.fallback}"; src: ${o.src}; font-weight: ${range}; size-adjust: ${o.sizeAdjust}%; ascent-override: ${o.ascentOverride}%; descent-override: ${o.descentOverride}%; line-gap-override: 0%; }`);
}
await browser.close();
