// Anatomical atlas audit in page context (final stabilization, section 5.1). Run against a running preview:
//   PW_PORT=4174 node tests/audit-atlas.mjs
// Visits every place an atlas image is shown (procedure cards, the procedure pages' main figure, the close-ups behind
// "More detail") on a phone and a desktop, in English and Arabic, and records for each image: rendered size, whether
// the file is sharp enough for the screen, how many numbered pins and key entries are showing, pin and key text size,
// pins that overlap each other or leave the frame, caption length, alt text, and the "pending physician review" note.
// Saves a phone screenshot of each figure. It measures usability; it says nothing about medical correctness.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const port = Number(process.env.PW_PORT || 4174);
const base = `http://127.0.0.1:${port}/`;
const OUT = 'docs/implementation/final-stabilization-phase-2-3-readiness/evidence/after/atlas';
fs.mkdirSync(OUT, { recursive: true });
const manifest = JSON.parse(fs.readFileSync('public/images/procedures/manifest.json', 'utf8'));
const slugs = [...new Set(manifest.assets.map((a) => a.procedure))];
const browser = await chromium.launch();
const rows = [];
const measure = (page, scope) => page.evaluate((sel) => {
  const out = [];
  for (const il of document.querySelectorAll(sel)) {
    const img = il.querySelector('img');
    if (!img || !il.getClientRects().length) continue;
    const r = il.getBoundingClientRect();
    const id = (img.currentSrc || img.src).split('/').pop().replace(/-(alpha|neutral)-\d+\.(webp|jpg)$/, '');
    const pins = [...il.querySelectorAll('.pin')].filter((p) => p.getClientRects().length && getComputedStyle(p).display !== 'none' && getComputedStyle(p).visibility !== 'hidden');
    const pb = pins.map((p) => p.getBoundingClientRect());
    let overlaps = 0;
    // the pins are circles: two overlap when their centres are closer than one diameter
    const cx = (b) => b.left + b.width / 2, cy = (b) => b.top + b.height / 2;
    for (let i = 0; i < pb.length; i++) for (let j = i + 1; j < pb.length; j++) if (Math.hypot(cx(pb[i]) - cx(pb[j]), cy(pb[i]) - cy(pb[j])) < pb[i].width - 0.5) overlaps++;
    const outside = pb.filter((b) => b.left < r.left - 1 || b.right > r.right + 1 || b.top < r.top - 1 || b.bottom > r.bottom + 1).length;
    const fig = il.closest('figure, article');
    const keys = fig ? [...fig.querySelectorAll('.pin-key li')].filter((k) => k.getClientRects().length) : [];
    const cap = fig ? fig.querySelector('.fig-text, .loupe-cap, figcaption') : null;
    out.push({
      // naturalWidth of a srcset image is corrected for density, so the real file width is read from the file name
      id, w: Math.round(r.width), h: Math.round(r.height), natural: Number(((img.currentSrc || img.src).match(/-(\d+)\.(webp|jpg)$/) || [])[1] || img.naturalWidth), sharp: Number(((img.currentSrc || img.src).match(/-(\d+)\.(webp|jpg)$/) || [])[1] || img.naturalWidth) >= Math.round(r.width * Math.min(devicePixelRatio, 2) * 0.9),
      loaded: img.complete && img.naturalWidth > 0, alt: (img.alt || '').length, pins: pins.length, pinPx: pb.length ? Math.round(pb[0].width) : 0, pinOverlaps: overlaps, pinsOutside: outside,
      keyEntries: keys.length, keyFontPx: keys.length ? Math.round(parseFloat(getComputedStyle(keys[0]).fontSize) * 10) / 10 : null, longestKey: keys.reduce((m, k) => Math.max(m, k.textContent.trim().length), 0),
      captionChars: cap ? cap.textContent.trim().length : 0, pendingNote: fig ? !!fig.querySelector('.fig-pending') || /pending|قيد/.test(fig.textContent) : false,
    });
  }
  return out;
}, scope);

for (const [w, h, device] of [[390, 844, 'phone'], [1440, 900, 'desktop']]) {
  for (const lang of ['en', 'ar']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: device === 'phone' ? 2 : 1, isMobile: device === 'phone', hasTouch: device === 'phone', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const pre = lang === 'en' ? 'en/' : '';
    // L1 cards: the library page
    await page.goto(`${base}${pre}procedures/`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
    await page.waitForTimeout(600);
    for (const m of await measure(page, '.plate-card .atlas-illus')) rows.push({ device, lang, where: 'library card (L1)', ...m });
    if (device === 'phone' && lang === 'en') { const cards = page.locator('.plate-card'); for (let i = 0; i < await cards.count(); i++) { const c = cards.nth(i); await c.scrollIntoViewIfNeeded(); await c.screenshot({ path: path.join(OUT, `L1-${await c.getAttribute('data-slug')}.jpg`), type: 'jpeg', quality: 78 }); } }
    for (const slug of slugs) {
      await page.goto(`${base}${pre}procedures/${slug}/`);
      await page.locator('#p-anatomy').waitFor({ timeout: 20000 });
      await page.locator('#p-anatomy').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      for (const m of await measure(page, 'figure.plate .atlas-illus')) rows.push({ device, lang, where: 'page figure (L2), essential labels', ...m });
      if (device === 'phone' && lang === 'en') await page.locator('figure.plate').first().screenshot({ path: path.join(OUT, `L2-${slug}.jpg`), type: 'jpeg', quality: 78 });
      const more = page.locator('figure.plate details.labels-more > summary').first();
      if (await more.count()) { await more.click(); await page.waitForTimeout(250); for (const m of await measure(page, 'figure.plate .atlas-illus')) rows.push({ device, lang, where: 'page figure (L2), all labels', ...m }); }
      const detail = page.locator('details.anat-detail > summary').first();
      if (await detail.count()) {
        await detail.click(); await page.waitForTimeout(300);
        await page.locator('.loupe').first().scrollIntoViewIfNeeded(); await page.waitForTimeout(700);
        for (const m of await measure(page, '.loupe .atlas-illus')) rows.push({ device, lang, where: 'close-up (L3), behind More detail', ...m });
        if (device === 'phone' && lang === 'en') { const l = page.locator('.loupe'); for (let i = 0; i < await l.count(); i++) { await l.nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await l.nth(i).screenshot({ path: path.join(OUT, `L3-${slug}-${i + 1}.jpg`), type: 'jpeg', quality: 78 }); } }
      }
    }
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(rows, null, 1));
const ids = [...new Set(rows.map((r) => r.id))];
console.log(`${ids.length} distinct images seen, ${rows.length} measurements`);
const bad = (f, name) => { const x = rows.filter(f); console.log(`${name}: ${x.length}${x.length ? ' → ' + [...new Set(x.map((r) => `${r.id} [${r.device} ${r.lang} ${r.where.split(' ')[0]}] `))].slice(0, 12).join('; ') : ''}`); };
bad((r) => !r.loaded, 'not loaded');
bad((r) => !r.sharp, 'file narrower than the screen needs');
bad((r) => !r.alt, 'no alt text');
bad((r) => r.pinOverlaps > 0, 'pins overlapping');
bad((r) => r.pinsOutside > 0, 'pins outside the frame');
bad((r) => /essential/.test(r.where) && r.pins > 4, 'more than 4 pins by default on L2');
bad((r) => /L1/.test(r.where) && r.pins > 2, 'more than 2 pins on a card');
bad((r) => r.keyFontPx !== null && r.keyFontPx < 14, 'key text under 14 px');
bad((r) => r.pins > 0 && r.pinPx < 20, 'pins under 20 px');
bad((r) => r.device === 'phone' && r.w < 260 && !/L1/.test(r.where), 'figure under 260 px wide on the phone');
bad((r) => !r.pendingNote && !/L1/.test(r.where), 'no pending-review note on a figure');
const missing = manifest.assets.map((a) => a.assetId).filter((id) => !ids.includes(id));
console.log('manifest images never seen on a page:', missing.join(', ') || 'none');
