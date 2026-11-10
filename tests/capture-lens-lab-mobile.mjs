// Evidence capture for the Lens Lab mobile workbench. Run against a running preview:
//   PW_PORT=4681 node tests/capture-lens-lab-mobile.mjs before|after
// Writes JPEG screenshots to docs/implementation/premium-ux-refinement/evidence/lens-lab/ and prints measurements.
import { chromium } from '@playwright/test';
import path from 'node:path';

const port = Number(process.env.PW_PORT || 4681);
const phase = process.argv[2] === 'after' ? 'after' : 'before';
const OUT = 'docs/implementation/premium-ux-refinement/evidence/lens-lab';
const args = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];
const browser = await chromium.launch({ args });
const SIZES = [[390, 844], [320, 640], [360, 800], [375, 812], [430, 932], [844, 390], [667, 375]];
const report = [];

for (const lang of ['ar', 'en']) {
  for (const [width, height] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${port}/${lang === 'en' ? 'en/' : ''}lens-lab/`);
    await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#simulator-host canvas'), null, { timeout: 45000 });
    await page.waitForTimeout(700);
    // the page's full length needs the lazy Lens Lab mounted too
    await page.locator('#lens-lab-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.feature-lens-lab.is-mounted'), null, { timeout: 45000 });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      const top = document.querySelector('#simulator-host .vsim-stage').getBoundingClientRect().top;
      window.scrollBy(0, top - document.getElementById('site-header').offsetHeight);
    });
    await page.waitForTimeout(500);
    const m = await page.evaluate(() => {
      const r = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
      const y = scrollY;
      const v = r('#simulator-host .vsim-viewport');
      const box = (g) => document.querySelector(`#simulator-host input[data-group="${g}"]`).closest('fieldset').getBoundingClientRect();
      const lens = box('lensA'), light = box('lighting'), preset = box('preset');
      const actions = r('#simulator-host .vsim-bench-actions');
      const strip = r('#simulator-host .vsim-disclaimer');
      const header = r('#site-header'), bar = r('.booking-bar');
      return {
        pageH: document.documentElement.scrollHeight,
        canvases: document.querySelectorAll('canvas').length,
        simTop: Math.round(r('#simulator').top + y),
        viewerH: Math.round(v.height), viewerW: Math.round(v.width),
        gapViewerToPreset: Math.round(preset.top - v.bottom),
        gapViewerToLens: Math.round(lens.top - v.bottom),
        spanPx: Math.round(Math.max(light.bottom, lens.bottom, preset.bottom, actions ? actions.bottom : 0) - Math.min(v.top, strip.top)),
        headerH: Math.round(header.height), barH: bar && bar.height ? Math.round(bar.height) : 0,
      };
    });
    m.available = height - m.headerH - m.barH;
    m.fits = m.spanPx <= m.available;
    report.push({ lang, size: `${width}x${height}`, ...m });
    const shot = (lang === 'ar' && ((width === 390 && height === 844) || (width === 320 && height === 640))) || (phase === 'after' && lang === 'en' && width === 844);
    if (shot) {
      const name = (s) => path.join(OUT, `${phase}-${width}x${height}-${s}.jpg`);
      await page.screenshot({ path: name('1-viewer-in-view'), type: 'jpeg', quality: 82 });
      if (phase === 'before') {
        await page.evaluate(() => { document.querySelector('#simulator-host input[data-group="lighting"]').closest('fieldset').scrollIntoView({ block: 'center' }); });
        await page.waitForTimeout(500);
        await page.screenshot({ path: name('2-controls-in-view'), type: 'jpeg', quality: 82 });
      } else {
        await page.locator('#simulator-host label[for$="-lensA-trifocal"]').tap();
        await page.locator('#simulator-host label[for$="-preset-near"]').tap();
        await page.waitForTimeout(500);
        await page.screenshot({ path: name('2-trifocal-near'), type: 'jpeg', quality: 82 });
        await page.locator('#simulator-host label[for$="-lighting-night"]').tap();
        await page.locator('#simulator-host label[for$="-preset-distance"]').tap();
        await page.locator('#simulator-host label[for$="-lensA-edof"]').tap();
        await page.waitForTimeout(500);
        await page.screenshot({ path: name('3-edof-night-far'), type: 'jpeg', quality: 82 });
        await page.locator('#simulator-host .vsim-more').tap();
        await page.evaluate(() => window.scrollBy(0, 420));
        await page.waitForTimeout(700);
        await page.screenshot({ path: name('4-more-settings-scrolled'), type: 'jpeg', quality: 82 });
      }
    }
    await ctx.close();
  }
}
await browser.close();
console.table(report);
