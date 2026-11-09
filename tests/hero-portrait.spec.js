// The doctor leads the homepage hero (owner requirement, premium-ux-refinement). Real browser geometry at each width.
import { test, expect } from '@playwright/test';

const box = (page, sel) => page.locator(sel).first().evaluate((el) => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }; });
const overlap = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const ready = async (page, url) => { await page.goto(url); await page.waitForFunction(() => /lang-/.test(document.body.className)); await page.evaluate(() => document.fonts.ready); };

test.describe('phones: the doctor is recognizable first', () => {
  for (const [w, h] of [[320, 640], [360, 800], [375, 812], [390, 844], [430, 932]]) {
    for (const [lang, url] of [['ar', '/'], ['en', '/en/']]) {
      test(`${w}x${h} ${lang}`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await ready(page, url);
        const portrait = await box(page, '.portrait-frame');
        const title = await box(page, '.hero-title');
        expect(portrait.top).toBeLessThan(90);
        expect(portrait.height).toBeGreaterThanOrEqual(190);
        expect(portrait.width).toBeGreaterThanOrEqual(w - 48);
        expect(overlap(portrait, title)).toBe(false);
        expect(portrait.bottom).toBeLessThanOrEqual(title.top);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        // the anatomy plate never competes on a phone
        await expect(page.locator('.hero-plate')).toBeHidden();
      });
    }
  }
  for (const [w, h] of [[360, 800], [390, 844], [430, 932]]) {
    test(`booking button is on the first screen at ${w}x${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await ready(page, '/');
      const cta = await box(page, '#hero-primary-cta');
      const bar = await box(page, '.booking-bar');
      expect(cta.bottom).toBeLessThanOrEqual(bar.top);
    });
  }
});

test.describe('desktop: portrait outweighs the plate and overlaps nothing', () => {
  for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
    for (const [lang, url] of [['ar', '/'], ['en', '/en/']]) {
      test(`${w}x${h} ${lang}`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await ready(page, url);
        const portrait = await box(page, '.portrait-frame');
        const plate = await box(page, '.hero-plate-illus');
        const title = await box(page, '.hero-title');
        const cta = await box(page, '#hero-primary-cta');
        expect(portrait.width).toBeGreaterThanOrEqual(340);
        expect(portrait.width * portrait.height).toBeGreaterThan(plate.width * plate.height * 3);
        expect(overlap(portrait, title)).toBe(false);
        expect(overlap(portrait, plate)).toBe(false);
        expect(portrait.bottom).toBeLessThanOrEqual(h);
        expect(cta.bottom).toBeLessThanOrEqual(h);
      });
    }
  }
});

test('the portrait is never stretched and stays within twice its source figure', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await ready(page, '/en/');
  const r = await page.locator('.portrait-frame img').evaluate((img) => ({ nw: img.naturalWidth, nh: img.naturalHeight, w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height, fit: getComputedStyle(img).objectFit }));
  expect(r.nw).toBeGreaterThan(0);
  expect(r.fit).toBe('cover');
  expect(Math.abs(r.w / r.h - r.nw / r.nh)).toBeLessThan(0.02); // no distortion
  expect(r.w / (r.nw / 2)).toBeLessThanOrEqual(2.1); // source figure is 187 px wide; the file is a 2x resample of it
});
