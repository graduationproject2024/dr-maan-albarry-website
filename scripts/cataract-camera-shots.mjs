// Camera QA screenshots of the cataract simulator (src/cataract-sim) as mounted on the cataract procedure page: every
// stage at desktop (1440x900), phone portrait (390x844) and phone landscape (844x390), viewport only, labels off (the
// default), reduced motion so every stage camera is reached instantly. Each stage is shown at 55 % of its playback
// (instruments in view). When the simulator has Before / After, both views are captured too. Writes one contact sheet
// per language and viewport and a JSON log of the overlaid-control boxes (and the camera, when the build reports it).
//   node scripts/cataract-camera-shots.mjs <base-url> <out-dir> [en|ar ...]
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [base = 'http://localhost:4801', out = 'shots', ...langsArg] = process.argv.slice(2);
const LANGS = langsArg.length ? langsArg : ['en', 'ar'];
const SIZES = [['desktop', 1440, 900], ['portrait', 390, 844], ['landscape', 844, 390]];
const DUR = [9, 8, 8, 10, 12, 12, 9];
const TOTAL = DUR.reduce((a, b) => a + b, 0);
const gpu = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];
const browser = await chromium.launch({ args: gpu });
const log = [];
const errors = [];

for (const lang of LANGS) {
  for (const [vp, width, height] of SIZES) {
    const isPhone = vp !== 'desktop';
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: isPhone, isMobile: isPhone, deviceScaleFactor: isPhone ? 2 : 1 });
    await ctx.addInitScript((l) => { try { localStorage.setItem('lang', l); localStorage.setItem('theme', 'light'); } catch { /* ignore */ } }, lang);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${lang} ${vp}: ${e}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${lang} ${vp}: ${m.text()}`); });
    await page.goto(`${base}${lang === 'en' ? '/en' : ''}/procedures/cataract-surgery/`);
    await page.locator('#cataract-3d-start').click();
    await page.locator('#cataract-3d-stage .csim[data-state="ready"]').waitFor({ timeout: 45000 });
    const dir = join(out, lang, vp);
    mkdirSync(dir, { recursive: true });
    const sheet = [];
    const place = () => page.evaluate(() => {
      const hd = document.querySelector('.site-header, #site-header'); const v = document.querySelector('.csim-viewport');
      scrollBy(0, v.getBoundingClientRect().top - (hd ? hd.getBoundingClientRect().bottom : 0) - 4);
    });
    const shoot = async (name, extra = {}) => {
      await place();
      await page.waitForTimeout(350);
      const file = join(dir, `${name}.jpg`);
      await page.locator('#cataract-3d-stage .csim-viewport').screenshot({ path: file, type: 'jpeg', quality: 70 });
      const boxes = await page.evaluate(() => {
        const vpr = document.querySelector('.csim-viewport').getBoundingClientRect();
        const rel = (sel) => { const el = document.querySelector(sel); if (!el || el.hidden || !el.offsetParent) return null; const r = el.getBoundingClientRect(); return [Math.round(r.left - vpr.left), Math.round(r.top - vpr.top), Math.round(r.width), Math.round(r.height)]; };
        const c = window.__cataractCamera ? window.__cataractCamera() : null;
        return { viewport: [Math.round(vpr.width), Math.round(vpr.height)], tools: rel('.csim-viewtools'), chip: rel('.csim-chip'), rayNote: rel('.csim-raynote'), compare: rel('.csim-ba'), camera: c };
      });
      log.push({ lang, vp, name, ...extra, ...boxes });
      sheet.push({ name, file });
    };
    for (let i = 0; i < DUR.length; i++) {
      await page.locator(`.csim-seg[data-seg="${i}"]`).click();
      const start = DUR.slice(0, i).reduce((a, b) => a + b, 0);
      await page.locator('.csim-scrubber').fill(String(Math.round(((start + DUR[i] * 0.55) / TOTAL) * 1000)));
      const id = await page.evaluate(() => document.querySelector('.csim-seg[aria-current="step"]').dataset.seg);
      await shoot(`${String(i + 1).padStart(2, '0')}-stage`, { stage: Number(id) });
    }
    if (await page.locator('.csim-ba-btn[data-value="before"]').count()) {
      for (const which of ['before', 'after']) {
        await page.locator(`.csim-ba-btn[data-value="${which}"]`).click();
        await shoot(`ba-${which}`, { compare: which });
      }
    }
    await ctx.close();
    const cols = vp === 'portrait' ? 5 : 3;
    const w = vp === 'portrait' ? 220 : 420;
    const html = `<body style="margin:0;background:#222;font:12px sans-serif;color:#eee"><div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:6px;padding:6px">${sheet
      .map((s) => `<figure style="margin:0"><img style="width:${w}px;display:block" src="data:image/jpeg;base64,${readFileSync(s.file).toString('base64')}"><figcaption>${lang} ${vp} ${s.name}</figcaption></figure>`).join('')}</div></body>`;
    const sp = await browser.newPage({ viewport: { width: cols * (w + 6) + 6, height: 400 } });
    await sp.setContent(html);
    await sp.waitForTimeout(200);
    await sp.screenshot({ path: join(out, `_sheet-${lang}-${vp}.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    await sp.close();
  }
}
writeFileSync(join(out, 'cameras.json'), JSON.stringify(log, null, 1));
await browser.close();
console.log(JSON.stringify({ shots: log.length, errors }));
