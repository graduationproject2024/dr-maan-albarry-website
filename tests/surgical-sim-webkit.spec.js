// Procedure simulators in Playwright's WebKit (Windows build, iPhone 13 user agent and pixel ratio) — browser-engine
// compatibility only, NOT Safari on iOS (see IPHONE_SAFARI_RESULTS.md). Same host-scaling setup as journeys/webkit.spec.js.
import { test, expect, devices } from '@playwright/test';

const { defaultBrowserType, ...iphone } = devices['iPhone 13'];
test.use({ ...iphone, viewport: { width: 488, height: 830 }, isMobile: false, hasTouch: false, browserName: 'webkit', launchOptions: { args: [] } });
test.setTimeout(120_000);

const SLUGS = ['lens-implants', 'icl', 'laser-vision-correction', 'keratoconus-cxl', 'corneal-transplant', 'intravitreal-injections'];
const S = (page) => page.evaluate(() => (window.__procedureSim ? window.__procedureSim.getState() : null));

for (const slug of SLUGS) {
  test(`WebKit ${slug}: start, play, pause, next, language, close`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`/en/procedures/${slug}/`);
    await page.locator('#procedure-3d-start').click();
    await expect.poll(async () => (await S(page))?.state, { timeout: 60_000 }).toMatch(/ready|fallback/);
    const st = await S(page);
    test.info().annotations.push({ type: 'webkit-state', description: `${slug}: ${st.state}, triangles ${st.render ? st.render.triangles : 0}` });
    expect(st.state).toBe('ready'); // WebGL works in this WebKit build; a fallback here would be a regression
    await expect(page.locator('#procedure-3d-stage canvas')).toHaveCount(1);
    await page.locator('.ssim-play').click();
    await expect.poll(async () => (await S(page)).elapsed, { timeout: 8000 }).toBeGreaterThan(0.3);
    await page.locator('.ssim-play').click();
    const e0 = (await S(page)).elapsed; await page.waitForTimeout(600);
    expect((await S(page)).elapsed).toBe(e0);
    await page.locator('[data-act="next"]').click();
    expect((await S(page)).stageIndex).toBeGreaterThanOrEqual(1);
    await page.evaluate(() => window.toggleLang());
    await expect(page.locator('#procedure-3d-stage .ssim')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('#procedure-3d-stage canvas')).toHaveCount(1);
    await page.locator('.ssim-close').click();
    await expect(page.locator('#procedure-3d-stage canvas')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
