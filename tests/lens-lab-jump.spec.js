// The "full vision simulator" link (and a #simulator bookmark) lands on the workbench on phones: the picture and every
// essential control are between the top of the screen and the booking bar at once, and taps do not move the page.
import { test, expect } from '@playwright/test';

const SIZES = [[320, 640], [360, 800], [375, 812], [390, 844], [430, 932], [844, 390]];
const state = (page) => page.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return { top: b.top, bottom: b.bottom }; };
  return { y: scrollY, canvas: r('#simulator-host canvas'), bench: r('.vsim-bench'), bar: r('.booking-bar'), vh: innerHeight };
});

// the jump is a smooth scroll that is held while the simulator sizes itself: wait until the page has really stopped
const settled = (page) => page.evaluate(() => new Promise((resolve) => {
  let last = scrollY, still = 0;
  const tick = () => { if (scrollY === last) still++; else { still = 0; last = scrollY; } if (still >= 30) resolve(); else requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}));

for (const [w, h] of SIZES) {
  for (const [lang, url, lens, light, dist] of [['ar', '/lens-lab/', /ثلاثية/, /ليل/, /قريب/], ['en', '/en/lens-lab/', /Trifocal/, /Night/, /Near/]]) {
    test(`${w}x${h} ${lang}: jump lands on the workbench, controls and picture together, taps do not scroll`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(url);
      await expect(page.locator('html')).not.toHaveClass(/first-load/);
      await page.locator('#sim-jump').tap();
      await page.locator('#simulator-host .vsim canvas').first().waitFor({ timeout: 60_000 });
      await expect.poll(async () => { const s = await state(page); return s.bench.top >= 0 && s.bench.bottom <= s.bar.top + 1; }, { timeout: 15_000 }).toBe(true);
      await settled(page);
      const s0 = await state(page);
      expect(s0.bench.top).toBeGreaterThanOrEqual(0);
      expect(s0.bench.bottom).toBeLessThanOrEqual(s0.bar.top + 1);
      expect(s0.canvas.top).toBeGreaterThanOrEqual(0);
      expect(s0.canvas.bottom).toBeLessThanOrEqual(s0.bar.top);
      for (const re of [lens, light, dist]) {
        const label = page.locator('.vsim-bench label').filter({ hasText: re }).first();
        const box = await label.boundingBox();
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(s0.bar.top + 1); // reachable without scrolling, not under the bar
        // A raw touch at the control, as a finger does it. (locator.tap() first scrolls its target clear of the root's
        // scroll-padding, which moves the page by itself and would hide what this test is measuring.)
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        await expect(page.locator(`#${await label.getAttribute('for')}`)).toBeChecked();
        const s = await state(page);
        expect(Math.abs(s.y - s0.y)).toBeLessThanOrEqual(1);
        expect(s.canvas.top).toBeGreaterThanOrEqual(0);
        expect(s.canvas.bottom).toBeLessThanOrEqual(s.bar.top);
      }
      await ctx.close();
    });
  }
}

test('a #simulator bookmark on a phone also lands on the workbench', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('/en/lens-lab/#simulator');
  await page.locator('#simulator-host .vsim canvas').first().waitFor({ timeout: 60_000 });
  await expect.poll(async () => { const s = await state(page); return s.bench.top >= 0 && s.bench.bottom <= s.bar.top + 1; }, { timeout: 15_000 }).toBe(true);
  await ctx.close();
});
