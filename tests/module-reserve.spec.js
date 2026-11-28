// The space held for a lazy module while it downloads must match the module, so a reader already scrolled into that
// space does not jump when it arrives (acceptance audit 2026-11-26: Lens Lab CLS 0.141 at 1440 px with a 1,200 px reserve
// for a ~6,500 px module). The module download is delayed 3 s; the reader scrolls to the end of the reserve meanwhile.
import { test, expect } from '@playwright/test';

const CASES = [
  { path: '/en/lens-lab/', module: 'lens-lab', chunk: /lens-lab-[^/]*\.js$/ },
  { path: '/lens-lab/', module: 'lens-lab', chunk: /lens-lab-[^/]*\.js$/ },
  { path: '/en/how-vision-works/', module: 'light-journey', chunk: /light-journey-[^/]*\.js$/ },
  { path: '/how-vision-works/', module: 'light-journey', chunk: /light-journey-[^/]*\.js$/ },
];

for (const [w, h] of [[390, 844], [800, 1000], [1024, 768], [1440, 900]]) {
  for (const c of CASES) {
    test(`${c.module} ${c.path} at ${w}x${h}: a late module moves the page less than CLS 0.1`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.route(c.chunk, async (r) => { await new Promise((res) => setTimeout(res, 3000)); r.continue(); });
      await page.goto(c.path, { waitUntil: 'domcontentloaded' });
      const slot = page.locator(`.feature-${c.module} .feature-slot`);
      await expect(slot).toHaveAttribute('data-reserve', '');
      await slot.evaluate((s) => { const r = s.getBoundingClientRect(); window.scrollTo(0, r.bottom + scrollY - innerHeight + 200); });
      await expect(page.locator(`.feature-${c.module}`)).toHaveClass(/is-mounted/, { timeout: 30_000 });
      await page.waitForTimeout(800);
      const cls = await page.evaluate(() => window.__cls);
      expect(cls, `layout shift after the ${c.module} module arrived`).toBeLessThan(0.1);
    });
  }
}
