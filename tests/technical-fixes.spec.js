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
  // Page order since the Lens Lab reconstruction: hero, vision simulator (#simulator), Lens Lab comparison (#lab).
  // The simulator reserves a height and then sizes itself, so it is the module that moves what is below it when it
  // arrives late. Holding its download back reproduces a slow device exactly.
  const holdSimulator = async (page) => {
    let release;
    const held = new Promise((r) => { release = r; });
    await page.route(/assets\/vision-sim-[^/]+\.js$/, async (route) => { await held; await route.continue(); });
    return release;
  };
  const inPlace = (page, id) => page.evaluate((i) => { const t = document.getElementById(i).getBoundingClientRect().top; return t > -20 && t < 140; }, id);
  const simulatorUp = (page) => expect(page.locator('#simulator-host .vsim canvas, #simulator-host .vsim--fallback').first()).toBeAttached({ timeout: 40_000 });

  for (const profile of [viewportProfile(768, 1024, { touch: true }), viewportProfile(1280, 800)]) {
    test.describe(`${profile.viewport.width}px`, () => {
      test.use({ ...profile, reducedMotion: 'reduce' });

      test('the "comparison" link lands on the Lens Lab and stays there while the simulator above it arrives', async ({ page }) => {
        const release = await holdSimulator(page);
        await page.goto('/en/lens-lab/');
        await expect(page.locator('html')).not.toHaveClass(/first-load/);
        await page.locator('.page-hero-links a[href$="#lab"]').click();
        await expect.poll(() => inPlace(page, 'lab')).toBe(true);
        release();
        await simulatorUp(page);
        await expect.poll(() => inPlace(page, 'lab')).toBe(true);
        await expect(page.locator('.feature-lens-lab')).toHaveClass(/is-mounted/, { timeout: 40_000 });
        await expect.poll(() => inPlace(page, 'lab')).toBe(true);
      });

      test('a bookmark to the Lens Lab stays on the Lens Lab', async ({ page }) => {
        const release = await holdSimulator(page);
        await page.goto('/en/lens-lab/#lab');
        await expect(page.locator('html')).not.toHaveClass(/first-load/);
        await expect.poll(() => inPlace(page, 'lab')).toBe(true);
        release();
        await simulatorUp(page);
        await expect.poll(() => inPlace(page, 'lab')).toBe(true);
      });

      test('the "full vision simulator" link and bookmark land on the simulator and stay there while it mounts', async ({ page }) => {
        const release = await holdSimulator(page);
        await page.goto('/en/lens-lab/');
        await expect(page.locator('html')).not.toHaveClass(/first-load/);
        await page.locator('#sim-jump').click();
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
        release();
        await simulatorUp(page);
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
        await page.goto('/en/lens-lab/#simulator');
        await simulatorUp(page);
        await expect.poll(() => inPlace(page, 'simulator')).toBe(true);
      });
    });
  }

  test('the jump lets go as soon as the visitor scrolls', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const release = await holdSimulator(page);
    await page.goto('/en/lens-lab/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await page.locator('.page-hero-links a[href$="#lab"]').click();
    await expect.poll(() => inPlace(page, 'lab')).toBe(true);
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => inPlace(page, 'lab')).toBe(false);
    release();
    await simulatorUp(page);
    // the page does not pull the reader back to the Lens Lab: at most the browser's own anchoring moves it
    expect(await inPlace(page, 'lab')).toBe(false);
  });
});

// BUG-P2-05, found in Chrome 113 on the Android Emulator (console error on every page): the build moves the manifest to
// assets/manifest-<hash>.webmanifest, so its relative icon "./favicon.svg" pointed at assets/favicon.svg, which does not
// exist (404). Every icon of the manifest the pages actually link must load as an image.
test.describe('Web app manifest', () => {
  for (const url of ['/', '/en/lens-lab/', '/procedures/cataract-surgery/']) {
    test(`${url}: every manifest icon loads`, async ({ page, request }) => {
      await page.goto(url);
      const href = await page.locator('link[rel="manifest"]').getAttribute('href');
      const manifestUrl = new URL(href, await page.evaluate(() => document.baseURI)).href;
      const res = await request.get(manifestUrl);
      expect(res.status()).toBe(200);
      const manifest = await res.json();
      expect(manifest.icons.length).toBeGreaterThan(0);
      for (const icon of manifest.icons) {
        const iconUrl = new URL(icon.src, manifestUrl).href;
        const r = await request.get(iconUrl);
        expect(r.status(), iconUrl).toBe(200);
        expect(r.headers()['content-type'] || '', iconUrl).toMatch(/^image\//);
      }
    });
  }
});
// BUG-P2-09 (found while driving the Android Emulator with the browser's own scroll-into-view): on phone widths, keyboard
// focus landed on links and buttons fully hidden behind the fixed booking bar (6-12 per page at 390 x 844). WCAG 2.2,
// 2.4.11 Focus Not Obscured. Every focus stop must be fully visible between the header and the booking bar.
test.describe('Keyboard focus is never hidden behind the booking bar (phone widths)', () => {
  for (const [w, h] of [[390, 844], [360, 652]]) {
    for (const url of ['/en/', '/procedures/cataract-surgery/', '/en/surgical-education/', '/en/lens-lab/']) {
      test(`${w}×${h} ${url}`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
        const page = await ctx.newPage();
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        const hidden = [];
        for (let i = 0; i < 120; i++) {
          await page.keyboard.press('Tab');
          const r = await page.evaluate(() => {
            const e = document.activeElement;
            if (!e || e === document.body) return null;
            const b = e.getBoundingClientRect();
            const bar = document.querySelector('.booking-bar'), hdr = document.getElementById('site-header');
            if (!b.width || !b.height || e.closest('.skip-link') || (bar && bar.contains(e)) || (hdr && hdr.contains(e))) return { skip: true };
            const barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
            const hb = hdr ? hdr.getBoundingClientRect().bottom : 0;
            return { name: (e.getAttribute('aria-label') || e.textContent || e.tagName).trim().slice(0, 40), ok: b.top >= hb - 1 && b.bottom <= barTop + 1 };
          });
          if (!r) break;
          if (!r.skip && !r.ok) hidden.push(r.name);
        }
        expect(hidden, 'focused elements not fully visible between the header and the booking bar').toEqual([]);
        await ctx.close();
      });
    }
  }
});