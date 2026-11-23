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
        // the decorative anatomy plate was removed from the hero (owner, 2026-11-23)
        await expect(page.locator('.hero-plate')).toHaveCount(0);
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

test.describe('desktop: the portrait leads the hero and overlaps nothing', () => {
  for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
    for (const [lang, url] of [['ar', '/'], ['en', '/en/']]) {
      test(`${w}x${h} ${lang}`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await ready(page, url);
        const portrait = await box(page, '.portrait-frame');
        const title = await box(page, '.hero-title');
        const cta = await box(page, '#hero-primary-cta');
        expect(portrait.width).toBeGreaterThanOrEqual(340);
        await expect(page.locator('.hero-plate')).toHaveCount(0); // no decorative eye beside the doctor
        expect(overlap(portrait, title)).toBe(false);
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

// The portrait is one setting (doctor-data.js PORTRAIT): a new photograph replaces it without touching the layout.
test.describe('portrait setting', () => {
  test('the page, the preload and the setting name the same file and size', async ({ page }) => {
    const { PORTRAIT, portraitSrcset } = await import('../doctor-data.js');
    const fs = await import('node:fs');
    expect(fs.existsSync(`public/${PORTRAIT.src}`), 'the portrait file exists').toBe(true);
    for (const v of PORTRAIT.variants) expect(fs.existsSync(`public/${v.src}`), `${v.src} exists`).toBe(true);
    await page.goto('/en/');
    const img = page.locator('.hero-portrait img');
    await expect(img).toHaveAttribute('src', PORTRAIT.src);
    await expect(img).toHaveAttribute('width', String(PORTRAIT.width));
    await expect(img).toHaveAttribute('height', String(PORTRAIT.height));
    const natural = await img.evaluate((e) => [e.naturalWidth, e.naturalHeight]);
    expect(natural, 'the declared size is the real size (no layout shift)').toEqual([PORTRAIT.width, PORTRAIT.height]);
    const html = fs.readFileSync('dist/en/index.html', 'utf8');
    expect(html).toContain(`<link rel="preload" as="image" href="./${PORTRAIT.src}"`);
    if (portraitSrcset()) await expect(img).toHaveAttribute('srcset', portraitSrcset()); else expect(await img.getAttribute('srcset')).toBeNull();
  });

  test('srcset is built only when wider copies exist', async () => {
    const { portraitSrcset } = await import('../doctor-data.js');
    expect(portraitSrcset({ src: 'a.webp', width: 480, variants: [] })).toBe('');
    expect(portraitSrcset({ src: 'a.webp', width: 480, variants: [{ src: 'b.webp', width: 800 }, { src: 'c.webp', width: 1200 }] })).toBe('a.webp 480w, b.webp 800w, c.webp 1200w');
  });
});
