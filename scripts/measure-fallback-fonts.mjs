// Measures the metric overrides for the local fallback faces in style.css §0 (BUG-05: no font-swap layout shift).
// For each web font / local font pair and weight: size-adjust = web text width / local text width, and
// ascent/descent-override = web ascent/descent (as a fraction of the font size) / size-adjust.
// Usage: node scripts/measure-fallback-fonts.mjs   (needs network access to Google Fonts)
import { chromium } from '@playwright/test';

const PAIRS = [
  { web: 'Noto Naskh Arabic', local: 'Times New Roman', weights: [500, 700], sample: 'د. معن بن عبدالله البري استشاري طب وجراحة العيون ما الذي يعالجه خبرة سريرية وأكاديمية منذ' },
  { web: 'Noto Sans Arabic', local: 'Segoe UI', weights: [400, 700], sample: 'يعمل ضمن وحدة الماء الأبيض ووحدة القرنية وتصحيح النظر في مغربي الصحية للعيون والأذن' },
  { web: 'Source Serif 4', local: 'Times New Roman', weights: [400, 600], sample: 'Dr. Maan bin Abdullah Al Barry, Consultant Ophthalmologist, What Dr. Maan treats' },
  { web: 'Public Sans', local: 'Arial', weights: [400, 700], sample: 'He works within the cataract unit and the cornea and refractive surgery unit at Magrabi' }
];
const FONTS = 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Public+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<html><head><link rel="stylesheet" href="${FONTS}"></head><body>${PAIRS.map(p => p.weights.map(w => `<span style="font-family:'${p.web}';font-weight:${w}">${p.sample}</span>`).join('')).join('')}</body></html>`);
await page.evaluate(() => document.fonts.ready);
const out = await page.evaluate(async (pairs) => {
  const c = document.createElement('canvas').getContext('2d');
  const m = (family, w, text) => { c.font = `${w} 100px "${family}"`; const r = c.measureText(text); return { width: r.width, ascent: r.fontBoundingBoxAscent / 100, descent: r.fontBoundingBoxDescent / 100 }; };
  const res = [];
  for (const p of pairs) for (const w of p.weights) {
    await document.fonts.load(`${w} 100px "${p.web}"`, p.sample);
    const web = m(p.web, w, p.sample); const loc = m(p.local, w, p.sample);
    const sa = web.width / loc.width;
    res.push({ face: `${p.web} ${w} ← local ${p.local}`, sizeAdjust: +(sa * 100).toFixed(2), ascentOverride: +(web.ascent / sa * 100).toFixed(2), descentOverride: +(web.descent / sa * 100).toFixed(2) });
  }
  return res;
}, PAIRS);
console.table(out);
await browser.close();
