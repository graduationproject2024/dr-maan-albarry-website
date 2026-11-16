// 3D viewer startup (final stabilization, section 7): the 3D code starts downloading a little before the tap, so the
// wait after the tap is the scene set-up only. It must never load on the home page by itself, never on a data-saver
// connection, and it must only download code: no WebGL context and no canvas before the visitor asks.
import { test, expect } from '@playwright/test';

const is3D = (u) => /assets\/(cataract-sim|three\.module)-[^/]+\.js$/.test(u);
function watch(page) {
  const seen = [];
  page.on('request', (r) => { if (is3D(r.url())) seen.push(r.url().split('/').pop()); });
  return seen;
}
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

test.describe('3D code is fetched just before it is needed', () => {
  test.use(phone);

  test('cataract page: nothing at load; the download starts when the 3D section is about one screen away', async ({ page }) => {
    const seen = watch(page);
    await page.goto('/en/procedures/cataract-surgery/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await page.waitForLoadState('networkidle');
    const far = await page.locator('#cataract-3d-start').evaluate((e) => e.getBoundingClientRect().top > innerHeight * 2.2);
    test.skip(!far, 'the 3D section is within two screens of the top on this layout');
    expect(seen, 'no 3D code while the section is far below').toEqual([]);
    await page.locator('#cataract-3d-start').evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * 1.6));
    await expect.poll(() => seen.length, { timeout: 8000 }).toBeGreaterThan(0);
    expect(seen.some((f) => /three\.module/.test(f))).toBe(true);
    // code only: no canvas, no viewer, the button is still an ordinary button
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('#cataract-3d-stage .csim')).toHaveCount(0);
    await expect(page.locator('#cataract-3d-start')).not.toHaveAttribute('aria-busy', 'true');
    // the tap then starts at once, with nothing fetched twice
    const before = seen.length;
    await page.locator('#cataract-3d-start').scrollIntoViewIfNeeded();
    await page.locator('#cataract-3d-start').tap();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 45_000 });
    expect(seen.length, 'no second download').toBe(before);
    await expect(page.locator('#cataract-3d-stage canvas')).toHaveCount(1);
  });

  test('home page: reading the whole page downloads no 3D code', async ({ page }) => {
    const seen = watch(page);
    await page.goto('/en/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
    await page.waitForTimeout(3200); // longer than the idle timeout used on the pages that host the viewer
    expect(seen, 'the home page never fetches 3D code by itself').toEqual([]);
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('surgical-education page: the button itself starts the download when the visitor reaches for it', async ({ page }) => {
    const seen = watch(page);
    await page.goto('/en/surgical-education/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    const btn = page.locator('#cataract-3d-start');
    await expect(btn).toHaveCount(1);
    await btn.scrollIntoViewIfNeeded();
    await expect.poll(() => seen.length, { timeout: 8000 }).toBeGreaterThan(0);
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('data saver: nothing is fetched before the tap, and the tap still works', async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, effectiveType: '4g' } }); });
    const seen = watch(page);
    await page.goto('/en/procedures/cataract-surgery/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await page.locator('#cataract-3d-start').scrollIntoViewIfNeeded();
    await page.locator('#cataract-3d-start').dispatchEvent('touchstart');
    await page.waitForTimeout(3200);
    expect(seen).toEqual([]);
    await page.locator('#cataract-3d-start').tap();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 45_000 });
    expect(seen.length).toBeGreaterThan(0);
  });

  test('a failed early download is silent, and the tap reports the failure with a retry', async ({ page }) => {
    let fail = true;
    await page.route(/assets\/cataract-sim-[^/]+\.js$/, (r) => (fail ? r.abort() : r.continue()));
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/en/procedures/cataract-surgery/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await page.locator('#cataract-3d-start').scrollIntoViewIfNeeded();
    await page.waitForTimeout(3200);
    await expect(page.locator('#cataract-3d-start')).toBeVisible();
    expect(errors, 'no uncaught error from the early download').toEqual([]);
    await page.locator('#cataract-3d-start').tap();
    await expect(page.locator('.c3d-status')).toContainText('could not');
    fail = false;
    await page.locator('#cataract-3d-start').tap();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 45_000 });
  });
});
