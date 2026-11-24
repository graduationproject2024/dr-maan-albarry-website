// Camera QA screenshots of the procedure simulators: every procedure, technique and stage at desktop (1440x900),
// phone portrait (390x844) and phone landscape (844x390), viewport only, labels off (the default), reduced motion so
// every stage camera is reached instantly. Also writes one contact sheet per procedure and viewport and a JSON log of
// the camera state per shot.
//   node scripts/camera-shots.mjs <base-url> <out-dir> [slug...]
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [base = 'http://localhost:4701', out = 'shots', ...only] = process.argv.slice(2);
const SLUGS = only.length ? only : ['lens-implants', 'icl', 'laser-vision-correction', 'keratoconus-cxl', 'corneal-transplant', 'intravitreal-injections'];
const SIZES = [['desktop', 1440, 900], ['portrait', 390, 844], ['landscape', 844, 390]];
const gpu = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];
const browser = await chromium.launch({ args: gpu });
const log = [];
const errors = [];

for (const slug of SLUGS) {
  for (const [vp, width, height] of SIZES) {
    const isPhone = vp !== 'desktop';
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: isPhone, isMobile: isPhone, deviceScaleFactor: isPhone ? 2 : 1 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${slug} ${vp}: ${e}`));
    await page.goto(`${base}/en/procedures/${slug}/`);
    await page.locator('#procedure-3d-start').click();
    await page.waitForFunction(() => window.__procedureSim && window.__procedureSim.getState().state === 'ready', null, { timeout: 45000 });
    // put the viewport just under the fixed site header (on a phone held sideways the booking bar covers the bottom)
    await page.evaluate(() => { const hd = document.querySelector('.site-header'); const v = document.querySelector('.ssim-viewport'); scrollBy(0, v.getBoundingClientRect().top - (hd ? hd.getBoundingClientRect().bottom : 0) - 4); });
    await page.waitForTimeout(200);
    const variants = await page.evaluate(() => [...document.querySelectorAll('[data-variant]')].map((b) => b.dataset.variant));
    const dir = join(out, slug, vp);
    mkdirSync(dir, { recursive: true });
    const sheet = [];
    for (const v of variants.length ? variants : [null]) {
      if (v) await page.evaluate((id) => window.__procedureSim.setVariant(id), v);
      const n = await page.evaluate(() => window.__procedureSim.getState().stageCount);
      for (let i = 0; i < n; i++) {
        await page.evaluate((k) => window.__procedureSim.setStage(k), i);
        await page.waitForFunction(() => !window.__procedureSim.getState().camera.moving, null, { timeout: 5000 });
        await page.waitForTimeout(250);
        const st = await page.evaluate(() => window.__procedureSim.getState());
        const name = `${v ? v + '-' : ''}${String(i + 1).padStart(2, '0')}-${st.stageId}`;
        const file = join(dir, `${name}.jpg`);
        await page.locator('.ssim-viewport').screenshot({ path: file, type: 'jpeg', quality: 70 });
        log.push({ slug, vp, variant: v, stage: i, id: st.stageId, camera: st.camera });
        sheet.push({ name, file });
      }
    }
    await ctx.close();
    // contact sheet
    const cols = vp === 'portrait' ? 6 : 4;
    const w = vp === 'portrait' ? 220 : 340;
    const html = `<body style="margin:0;background:#222;font:12px sans-serif;color:#eee"><div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:6px;padding:6px">${sheet
      .map((s) => `<figure style="margin:0"><img style="width:${w}px;display:block" src="data:image/jpeg;base64,${readFileSync(s.file).toString('base64')}"><figcaption>${s.name}</figcaption></figure>`).join('')}</div></body>`;
    const sp = await browser.newPage({ viewport: { width: cols * (w + 6) + 6, height: 400 } });
    await sp.setContent(html);
    await sp.waitForTimeout(200);
    await sp.screenshot({ path: join(out, `_sheet-${slug}-${vp}.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    await sp.close();
  }
}
writeFileSync(join(out, 'cameras.json'), JSON.stringify(log, null, 1));
await browser.close();
console.log(JSON.stringify({ shots: log.length, errors }));
