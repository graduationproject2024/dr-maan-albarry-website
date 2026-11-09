// Regressions for the defects behind the flaky journeys (docs/implementation/premium-ux-refinement/TECHNICAL_FIXES.md).
import { test, expect } from '@playwright/test';
import { viewportProfile } from './journeys/harness.js';

const freeBand = (page) => page.evaluate(() => {
  const h = document.getElementById('site-header').getBoundingClientRect();
  const b = document.getElementById('booking-bar');
  return { top: h.bottom, bottom: getComputedStyle(b).display === 'none' ? innerHeight : b.getBoundingClientRect().top };
});

test.describe('The 3D viewer controls are not left under the booking bar', () => {
  for (const [w, h] of [[320, 568], [360, 640], [375, 667], [390, 664], [390, 844]]) {
    for (const url of ['/en/procedures/cataract-surgery/', '/surgical-education/']) {
      test.describe(`${w}×${h}`, () => {
        test.use(viewportProfile(w, h, { touch: true, extra: { reducedMotion: 'reduce' } }));
        test(`${url}`, async ({ page }) => {
          await page.goto(url);
          const btn = page.locator('#cataract-3d-start');
          await btn.scrollIntoViewIfNeeded();
          await btn.tap();
          await expect(page.locator('#cataract-3d-stage .csim')).toHaveAttribute('data-state', 'ready', { timeout: 40_000 });
          await expect.poll(async () => {
            const scrub = await page.locator('#cataract-3d-stage [data-ref="scrubber"]').boundingBox();
            const band = await freeBand(page);
            return scrub.y + scrub.height <= band.bottom && scrub.y >= band.top;
          }).toBe(true);
          // and what is under the middle of the timeline is the timeline
          const hit = await page.evaluate(() => {
            const r = document.querySelector('#cataract-3d-stage [data-ref="scrubber"]').getBoundingClientRect();
            return document.elementFromPoint(r.x + r.width * 0.6, r.y + r.height / 2)?.className || '';
          });
          expect(hit).toContain('csim-scrubber');
        });
      });
    }
  }

  test('on a phone a tap on the timeline jumps there and pauses', async ({ browser }) => {
    const ctx = await browser.newContext({ ...viewportProfile(390, 664, { touch: true }), reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/en/surgical-education/');
    await page.locator('#cataract-3d-start').tap();
    await expect(page.locator('#cataract-3d-stage .csim')).toHaveAttribute('data-state', 'ready', { timeout: 40_000 });
    await page.locator('#cataract-3d-stage [data-ref="start"]').tap();
    await expect(page.locator('#cataract-3d-stage .csim')).toHaveAttribute('data-state', 'playing');
    const scrub = await page.locator('#cataract-3d-stage [data-ref="scrubber"]').boundingBox();
    await page.touchscreen.tap(scrub.x + scrub.width * 0.6, scrub.y + scrub.height / 2);
    await expect(page.locator('#cataract-3d-stage .csim')).toHaveAttribute('data-state', 'paused');
    await expect.poll(() => page.locator('#cataract-3d-stage [data-ref="scrubber"]').inputValue().then(Number)).toBeGreaterThan(500);
    await ctx.close();
  });
});

test.describe('A jump keeps its target when a module arrives late', () => {
  // The Lens Lab module sits above the simulator. Holding its download back reproduces a slow device exactly.
  const holdLensLab = async (page) => {
    let release;
    const held = new Promise((r) => { release = r; });
    await page.route(/assets\/lens-lab-[^/]+\.js$/, async (route) => { await held; await route.continue(); });
    return release;
  };
  const inPlace = (page, id) => page.evaluate((i) => { const t = document.getElementById(i).getBoundingClientRect().top; return t > -20 && t < 140; }, id);

  for (const profile of [viewportProfile(768, 1024, { touch: true }), viewportProfile(1280, 800)]) {
    test.describe(`${profile.viewport.width}px`, () => {
      test.use({ ...profile, reducedMotion: 'reduce' });

      test('the "full vision simulator" link lands on the simulator', async ({ page }) => {
        const release = await holdLensLab(page);
        await page.goto('/en/lens-lab/');
        await expect(page.locator('html')).not.toHaveClass(/first-load/);
        await page.locator('#sim-jump').click();
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
        release();
        await expect(page.locator('.feature-lens-lab')).toHaveClass(/is-mounted/, { timeout: 40_000 });
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
        await expect(page.locator('#simulator-host .vsim canvas, #simulator-host .vsim--fallback').first()).toBeAttached({ timeout: 40_000 });
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
      });

      test('a bookmark to the simulator stays on the simulator', async ({ page }) => {
        const release = await holdLensLab(page);
        await page.goto('/en/lens-lab/#simulator');
        await expect(page.locator('html')).not.toHaveClass(/first-load/);
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
        release();
        await expect(page.locator('.feature-lens-lab')).toHaveClass(/is-mounted/, { timeout: 40_000 });
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
      });
    });
  }

  test('the jump lets go as soon as the visitor scrolls', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const release = await holdLensLab(page);
    await page.goto('/en/lens-lab/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await page.locator('#sim-jump').click();
    await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => inPlace(page, 'simulator')).toBe(false);
    release();
    await expect(page.locator('.feature-lens-lab')).toHaveClass(/is-mounted/, { timeout: 40_000 });
    // the page does not pull the reader back to the simulator: at most the browser's own anchoring moves it
    expect(await inPlace(page, 'simulator')).toBe(false);
  });
});
