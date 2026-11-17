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

// Phase 2 (CATARACT_PERFORMANCE.md): every shader program the opening frame needs is built in the parallel pre-compile,
// none inside the first render (three r170 compile() skipped local clipping, so 8 cross-section programs used to be
// rebuilt one at a time, blocking, in the first frame). Closing the viewer during that pre-compile must stay silent.
test.describe('3D viewer start: shader programs', () => {
  const instrument = () => {
    window.__links = 0;
    const P = WebGL2RenderingContext.prototype, link = P.linkProgram;
    P.linkProgram = function (p) { window.__links++; return link.call(this, p); };
    // recorded synchronously, at the moment the loading text is set to 100 % (the first frame is drawn right after, in
    // the same task, so an observer callback would come too late)
    window.__at100 = null;
    const d = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
    Object.defineProperty(Node.prototype, 'textContent', {
      configurable: true, get() { return d.get.call(this); },
      set(v) { if (window.__at100 === null && this.dataset && this.dataset.ref === 'loadingText' && /100\s*%/.test(String(v))) window.__at100 = window.__links; d.set.call(this, v); }
    });
  };
  test('no program is linked between the end of the pre-compile and the first drawn frame', async ({ page }) => {
    await page.addInitScript(instrument);
    await page.goto('/en/procedures/cataract-surgery/');
    await page.locator('#cataract-3d-start').scrollIntoViewIfNeeded();
    await page.locator('#cataract-3d-start').click();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 60_000 });
    const r = await page.evaluate(() => ({ at100: window.__at100, atReady: window.__links }));
    expect(r.at100, 'the 100 % step was seen').not.toBeNull();
    expect(r.atReady - r.at100, 'programs linked inside the first render').toBe(0);
  });
  test('closing the viewer while it is still compiling leaves no error and one canvas at most', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/en/procedures/cataract-surgery/');
    // closed while loading, and right after it is ready (while the background pre-compile of later stages runs)
    for (const [when, after] of [['loading', 0], ['loading', 0], ['ready', 0], ['ready', 60], ['ready', 150], ['ready', 300], ['ready', 600]]) {
      await page.locator('#cataract-3d-start').scrollIntoViewIfNeeded();
      await page.locator('#cataract-3d-start').click();
      if (when === 'loading') await page.waitForFunction(() => /\d+\s*%/.test(document.querySelector('#cataract-3d-stage [data-ref="loadingText"]')?.textContent || ''), null, { timeout: 60_000 });
      else await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 60_000 });
      if (after) await page.waitForTimeout(after);
      await page.evaluate(() => window.closeCataract3D());
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1500); // let any polling timer of the abandoned starts fire
    expect(errors).toEqual([]);
    expect(await page.locator('#cataract-3d-stage canvas').count()).toBeLessThanOrEqual(1);
  });
});