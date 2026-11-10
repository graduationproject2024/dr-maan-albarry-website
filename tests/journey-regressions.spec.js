// Regression tests for the defects found by the patient-journey QA (docs/.../BUG_REGISTER.md).
// Each test names its bug ID. Emulated Chromium; real input (tap/click/keyboard) for user actions.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const GL_PROBE = () => {
  const orig = HTMLCanvasElement.prototype.getContext;
  window.__gl = new Set();
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const ctx = orig.call(this, type, ...rest);
    if (ctx && /webgl/.test(String(type))) window.__gl.add(ctx);
    return ctx;
  };
};
const liveGL = (page) => page.evaluate(() => [...window.__gl].filter((c) => !c.isContextLost()).length);
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

test.describe('journey regressions — phone', () => {
  test.use(phone);

  for (const [lang, url] of [['ar', '/procedures/lens-implants/'], ['en', '/en/procedures/cataract-surgery/']]) {
    test(`BUG-01 procedure body text is at least 16px (${lang})`, async ({ page }) => {
      await page.goto(url); await page.locator('#p-faq').waitFor();
      const small = await page.locator('.proc-sec p:not(.type-code), .proc-sec li, .proc-sec dd, .proc-lede').evaluateAll((els) =>
        els.filter((e) => e.getClientRects().length && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 15.99).map((e) => `${e.className} ${getComputedStyle(e).fontSize}`));
      expect(small).toEqual([]);
    });
  }

  test('BUG-02 3D stage text is at least 16px; BUG-03 opening/closing the 3D viewer leaks no WebGL contexts', async ({ page }) => {
    await page.addInitScript(GL_PROBE);
    await page.goto('/procedures/cataract-surgery/'); await page.locator('#p-faq').waitFor();
    for (let i = 0; i < 5; i++) {
      await page.locator('#cataract-3d-start').tap();
      await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready');
      if (i === 0) expect(await page.locator('#cataract-3d-stage [data-ref="stageText"]').evaluate((e) => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
      expect(await liveGL(page)).toBe(1); // only the viewer's own renderer — the capability probe is released
      await page.locator('#cataract-3d-stage [data-ref="close"]').tap();
      await expect(page.locator('#cataract-3d-stage .csim')).toHaveCount(0);
    }
    expect(await liveGL(page)).toBe(0);
  });

  test('BUG-03 the vision simulator keeps exactly one live WebGL context', async ({ page }) => {
    await page.addInitScript(GL_PROBE);
    await page.goto('/en/lens-lab/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#simulator-host canvas'));
    expect(await liveGL(page)).toBe(1);
  });

  test('BUG-04 the cataract page offers a visible 3D walkthrough link near the top; other pages do not', async ({ page }) => {
    await page.goto('/en/procedures/cataract-surgery/'); await page.locator('#p-faq').waitFor();
    const link = page.locator('.proc-3d-jump a');
    await expect(link).toBeVisible();
    const r = await link.boundingBox();
    expect(r.y + r.height).toBeLessThan(844 * 2);
    expect(r.height).toBeGreaterThanOrEqual(44);
    await link.tap();
    await expect.poll(async () => (await page.locator('#cataract-3d').boundingBox()).y).toBeLessThan(200);
    await page.goto('/en/procedures/icl/'); await page.locator('#p-faq').waitFor();
    await expect(page.locator('.proc-3d-jump')).toHaveCount(0);
  });

  test('BUG-08 the Start button reports aria-busy="true" while the 3D code downloads', async ({ page }) => {
    let release; const gate = new Promise((r) => { release = r; });
    await page.route(/\/assets\/cataract-sim[^/]*\.js/, async (route) => { await gate; await route.continue(); });
    await page.goto('/procedures/cataract-surgery/'); await page.locator('#p-faq').waitFor();
    await page.locator('#cataract-3d-start').tap();
    await expect(page.locator('#cataract-3d-start')).toHaveAttribute('aria-busy', 'true');
    release();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready');
  });

  test('BUG-09 a failed vision-simulator download explains itself, frees the reserved space and retries', async ({ page }) => {
    const VS = /\/assets\/vision-sim[^/]*\.js/;
    await page.route(VS, (r) => r.abort('connectionfailed'));
    await page.goto('/en/lens-lab/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    const err = page.locator('#simulator-host .vsim-load-error');
    await expect(err).toBeVisible();
    await expect(err).toContainText('could not load');
    await expect(page.locator('#simulator-host')).not.toHaveAttribute('data-reserve', /.*/);
    expect((await page.locator('#simulator-host').boundingBox()).height).toBeLessThan(400);
    await page.unroute(VS);
    await err.locator('button').tap();
    await page.waitForFunction(() => document.querySelector('#simulator-host canvas'));
    await expect(err).toHaveCount(0);
  });

  test('BUG-11 an unknown deep URL served by an SPA fallback still boots the app', async ({ page }) => {
    const ok = [];
    page.on('response', (r) => { if (r.status() === 200 && /localhost:\d+\/assets\/index-[^/]+\.js$/.test(r.url())) ok.push(r.url()); });
    await page.goto('/procedures/not-a-procedure/');
    // body classes are set only by the running app (the prerendered markup has none)
    await page.waitForFunction(() => document.body.classList.contains('is-home'));
    expect(ok.length).toBeGreaterThan(0); // the app bundle was loaded from the site root
    // (Chromium's preload scanner may still speculatively request ./assets/* relative to the static <base>
    //  before the inline script corrects it; those speculative 404s are harmless.)
  });

  test('BUG-12 a deep link to a section of a procedure page lands on that section', async ({ page }) => {
    await page.goto('/en/procedures/keratoconus-cxl/#p-risks');
    await page.locator('#p-risks').waitFor();
    await page.waitForTimeout(600);
    const top = (await page.locator('#p-risks').boundingBox()).y;
    expect(top).toBeGreaterThan(-5);
    expect(top).toBeLessThan(844 / 2);
  });

  test('VS-RTL in Arabic the sharpness bars fill from the right (single and compare)', async ({ page }) => {
    await page.goto('/lens-lab/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#simulator-host canvas'));
    const check = () => page.locator('#simulator-host .vsim-bar').evaluateAll((els) => els.filter((b) => b.getClientRects().length).map((b) => {
      const r = b.getBoundingClientRect(), f = b.firstElementChild.getBoundingClientRect();
      return { partial: f.width > 2 && f.width < r.width - 4, gapRight: r.right - f.right };
    }));
    await page.locator('#simulator-host label[for$="-preset-near"]').tap();
    await page.locator('#simulator-host .vsim-clarity > summary').tap(); // expandable since the workbench rebuild
    await page.locator('#simulator-host .vsim-more').tap(); // compare lives in More settings since the workbench rebuild
    await page.locator('#simulator-host .vsim-switch').tap();
    const bars = await check();
    expect(bars.filter((b) => b.partial).length).toBeGreaterThan(0);
    for (const b of bars) expect(b.gapRight).toBeLessThanOrEqual(2);
  });

  test('FIXED-1 tapping "Clinic & booking" from the top lands on the clinic page, booking first, nothing shifts it', async ({ page }) => {
    // Phase 1: "Clinic & booking" is its own page; the homepage no longer mounts a simulator above the clinic.
    await page.goto('/en/'); await page.locator('main h1').waitFor();
    await page.locator('.mobile-menu-btn').tap();
    await page.locator('#mobile-nav a[data-section="clinic"]').tap();
    await expect(page).toHaveURL(/\/en\/clinic\/$/);
    await page.waitForTimeout(1500);
    const top = (await page.locator('main h1').boundingBox()).y;
    expect(top).toBeGreaterThan(-10);
    expect(top).toBeLessThan(200);
    const cta = (await page.locator('#clinic-booking-cta').boundingBox()).y;
    expect(cta).toBeLessThan(844 * 1.5);
    // the homepage clinic section stays reachable by its anchor and is not shifted by any lazy mount
    await page.goto('/en/#clinic'); await page.locator('main h1').waitFor();
    await page.waitForTimeout(1500);
    const sec = (await page.locator('#clinic').boundingBox()).y;
    expect(sec).toBeGreaterThan(-10);
    expect(sec).toBeLessThan(200);
  });

  test('FIXED-2 the vision viewer keeps at least viewport − 56 px at 390 px', async ({ page }) => {
    await page.goto('/lens-lab/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#simulator-host .vsim-viewport'));
    expect((await page.locator('#simulator-host .vsim-viewport').boundingBox()).width).toBeGreaterThanOrEqual(390 - 56);
  });

  test('BUG-16 vision simulator card and meter titles are readable in the light theme (contrast >= 4.5)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.goto('/en/lens-lab/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#simulator-host .vsim-card h3'));
    const ratios = await page.locator('#simulator-host .vsim-card h3, #simulator-host .vsim-clarity > summary').evaluateAll((els) => els.map((e) => {
      const rgb = (c) => c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
      const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      let bgEl = e; let bg = 'rgba(0, 0, 0, 0)';
      while (bgEl && /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) { bg = getComputedStyle(bgEl).backgroundColor; bgEl = bgEl.parentElement; }
      const a = lum(rgb(getComputedStyle(e).color)), b = lum(rgb(bg));
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }));
    expect(ratios.length).toBeGreaterThan(1);
    for (const r of ratios) expect(r).toBeGreaterThanOrEqual(4.5);
  });

  test('BUG-17 header controls have names that contain their visible text', async ({ page }) => {
    await page.goto('/'); await page.locator('main h1').waitFor();
    // the switch shows the other language's own name ("English"); its accessible name must start with that visible text
    const lang = page.locator('.site-header .lang-switch');
    const visible = (await lang.innerText()).trim();
    expect(visible).toBe('English');
    await expect(lang).toHaveAccessibleName(new RegExp(`^${visible}`));
    await expect(page.locator('.site-header .wordmark')).toHaveAccessibleName(/^د\. معن البري/);
  });
});

test.describe('journey regressions — keyboard', () => {
  test.use({ viewport: { width: 1366, height: 768 } });
  test('BUG-06 starting the 3D viewer from the keyboard keeps focus in the viewer', async ({ page }) => {
    await page.goto('/en/procedures/cataract-surgery/'); await page.locator('#p-faq').waitFor();
    await page.locator('#cataract-3d-start').focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready');
    await page.waitForTimeout(100);
    const f = await page.evaluate(() => ({ body: document.activeElement === document.body, inViewer: !!document.activeElement.closest('#cataract-3d-stage') }));
    expect(f).toEqual({ body: false, inViewer: true });
  });
});

test.describe('journey regressions — no JavaScript', () => {
  test.use({ ...phone, javaScriptEnabled: false });
  test('BUG-10 prerendered pages reserve no blank simulator space', async ({ page }) => {
    await page.goto('/lens-lab/'); // the simulator and the Lens Lab live here since Phase 1
    expect((await page.locator('#simulator-host').boundingBox()).height).toBeLessThan(100);
    expect((await page.locator('#lens-lab-host').boundingBox())?.height || 0).toBeLessThan(100);
    for (const f of ['dist/index.html', 'dist/en/index.html', 'dist/lens-lab/index.html', 'dist/en/lens-lab/index.html', 'dist/how-vision-works/index.html']) expect(fs.readFileSync(f, 'utf8')).not.toMatch(/data-reserve/);
  });
});
