// Web fonts that arrive after the first paint must not re-wrap the page (live 2026-11-28: home at 800 px CLS 0.19 when
// the Arabic face arrived late; 920 px re-wrapped by the Latin faces). All faces use font-display: optional, so a face
// that misses the first paint is used from the next page view on, never swapped in. Fonts are delayed 900 ms here, as
// on a real network; the shift must stay under 0.01.
import { test, expect } from '@playwright/test';

const PAGES = ['/', '/en/', '/about/', '/lens-lab/', '/procedures/cataract-surgery/'];
for (const w of [390, 800, 920, 1280]) {
  for (const path of PAGES) {
    test(`late web fonts do not move ${path} at ${w} px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.route(/\.woff2$/, async (r) => { await new Promise((x) => setTimeout(x, 900)); r.continue(); });
      await page.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(path, { waitUntil: 'load' });
      await page.waitForTimeout(1500);
      expect(await page.evaluate(() => window.__cls)).toBeLessThan(0.01);
    });
  }
}

test('on a normal load the web fonts are used, not the fallbacks', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  const loaded = await page.evaluate(() => document.fonts.ready.then(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''))));
  expect(loaded).toEqual(expect.arrayContaining(['Noto Naskh Arabic', 'IBM Plex Sans Arabic']));
});
