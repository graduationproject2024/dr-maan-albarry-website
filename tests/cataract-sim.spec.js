// Cataract surgery 3D simulator (src/cataract-sim) — runs against the isolated harness page
// /cataract-sim-preview.html, which mounts the lazy module with { debug: true }.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const PAGE = 'cataract-sim-preview.html';
const EVIDENCE = 'docs/implementation/master-redesign-phase-2-3/evidence/simulator';

function watchConsole(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

async function open(page, query = 'lang=en&reduced=0') {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => window.__csim && ['ready', 'fallback'].includes(window.__csim.getState().state), null, { timeout: 30_000 });
}
const S = (page) => page.evaluate(() => window.__csim.getState());
const waitState = (page, state, timeout = 8000) =>
  expect.poll(async () => (await S(page)).state, { timeout }).toBe(state);

let errors;
test.beforeEach(({ page }) => { errors = watchConsole(page); });
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

test.describe('cataract simulator — desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('mounts lazily, renders a non-blank canvas and shows the start overlay', async ({ page }) => {
    await open(page);
    await expect(page.locator('.csim canvas')).toHaveCount(1);
    await expect(page.locator('.csim-overlay--start')).toBeVisible();
    await expect(page.locator('.csim-disclaimer')).toBeVisible();
    const s = await S(page);
    expect(s).toMatchObject({ state: 'ready', stageIndex: 0, webgl: true, lang: 'en', playing: false });
    const px = await page.evaluate(() => window.__cataractSim.sample());
    expect(px.uniqueColors).toBeGreaterThan(80);
    expect(px.nonBackground).toBeGreaterThan(0.15);
    const counters = await page.evaluate(() => ({ ...window.__cataractSimCounters }));
    expect(counters).toMatchObject({ live: 1, rafLoops: 1, renderers: 1 });
  });

  test('destroy() disposes everything and is idempotent', async ({ page }) => {
    await open(page);
    const after = await page.evaluate(() => {
      const before = { ...window.__cataractSimCounters };
      window.__csim.destroy();
      window.__csim.destroy();
      return { before, after: { ...window.__cataractSimCounters }, children: window.__csimHost.children.length, canvases: document.querySelectorAll('canvas').length, handle: 'controller' in (window.__cataractSim || {}) };
    });
    expect(after.before.listeners).toBeGreaterThan(10);
    expect(after.after).toMatchObject({ live: 0, listeners: 0, observers: 0, rafLoops: 0, renderers: 0 });
    expect(after.children).toBe(0);
    expect(after.canvases).toBe(0);
    expect(after.handle).toBe(false);
  });

  test('mount is idempotent per host (sequential and concurrent)', async ({ page }) => {
    await open(page);
    await page.evaluate(async () => { window.__csim = await window.__csimMount(); });
    await page.evaluate(async () => { const [, b] = await Promise.all([window.__csimMount(), window.__csimMount()]); window.__csim = b; });
    await waitState(page, 'ready');
    const r = await page.evaluate(() => ({ roots: window.__csimHost.querySelectorAll('.csim').length, canvases: window.__csimHost.querySelectorAll('canvas').length, c: { ...window.__cataractSimCounters } }));
    expect(r.roots).toBe(1);
    expect(r.canvases).toBe(1);
    expect(r.c).toMatchObject({ live: 1, rafLoops: 1, renderers: 1 });
  });

  test('state machine: start, pause, resume, restart, completed; invalid transitions ignored', async ({ page }) => {
    await open(page);
    await page.evaluate(() => window.__csim.pause()); // nothing is playing: no-op
    expect((await S(page)).state).toBe('ready');
    expect(await page.evaluate(() => window.__cataractSim.transition('fallback'))).toBe(false); // not in the table
    expect(await page.evaluate(() => window.__cataractSim.transition('idle'))).toBe(false);
    expect((await S(page)).state).toBe('ready');
    await page.locator('.csim-start').click();
    await waitState(page, 'playing');
    await expect(page.locator('.csim-overlay--start')).toBeHidden();
    await page.waitForTimeout(600);
    const p1 = (await S(page)).progress;
    expect(p1).toBeGreaterThan(0);
    await page.locator('[data-ref="playPause"]').click();
    await waitState(page, 'paused');
    const p2 = (await S(page)).progress;
    await page.waitForTimeout(400);
    expect((await S(page)).progress).toBe(p2);
    await page.locator('[data-ref="playPause"]').click();
    await waitState(page, 'playing');
    await page.evaluate(() => window.__csim.goToStage(4));
    await expect.poll(async () => (await S(page)).stageIndex).toBe(4);
    await page.locator('[data-ref="restart"]').click();
    await waitState(page, 'playing');
    const r = await S(page);
    expect(r.stageIndex).toBe(0);
    expect(r.progress).toBeLessThan(0.05);
    await page.evaluate(() => { window.__csim.seek(0.994); window.__csim.play(); });
    await waitState(page, 'completed', 6000);
    await expect(page.locator('[data-ref="playPause"]')).toHaveAttribute('data-mode', 'replay');
    const events = await page.evaluate(() => window.__csimEvents.filter((e) => e.ev === 'statechange').map((e) => e.p.state));
    expect(events).toEqual(expect.arrayContaining(['playing', 'paused', 'transitioning', 'completed']));
    await page.locator('[data-ref="playPause"]').click(); // Replay from the start
    await waitState(page, 'playing');
    expect((await S(page)).stageIndex).toBe(0);
  });

  test('next / prev / goToStage / timeline segments', async ({ page }) => {
    await open(page);
    await expect(page.locator('[data-ref="prev"]')).toBeDisabled();
    await page.locator('[data-ref="next"]').click();
    expect((await S(page)).state).toBe('transitioning');
    await waitState(page, 'paused');
    expect((await S(page)).stageIndex).toBe(1);
    await page.locator('[data-ref="prev"]').click();
    await expect.poll(async () => (await S(page)).stageIndex).toBe(0);
    await page.evaluate(() => window.__csim.goToStage(5));
    await waitState(page, 'paused');
    const s = await S(page);
    expect(s.stageIndex).toBe(5);
    expect(s.stageProgress).toBe(0);
    await page.locator('.csim-seg[data-seg="6"]').click();
    await expect.poll(async () => (await S(page)).stageIndex).toBe(6);
    await expect(page.locator('[data-ref="next"]')).toBeDisabled();
    await expect(page.locator('.csim-seg[data-seg="6"]')).toHaveAttribute('aria-current', 'step');
    // rapid clicks only retarget; one RAF loop survives
    await page.evaluate(() => { for (let i = 0; i < 12; i++) window.__csim.prev(); });
    await waitState(page, 'paused');
    expect((await S(page)).stageIndex).toBe(0);
    expect(await page.evaluate(() => window.__cataractSimCounters.rafLoops)).toBe(1);
  });

  test('timeline scrubber pauses and sets the exact progress', async ({ page }) => {
    await open(page);
    await page.evaluate(() => window.__csim.play());
    await waitState(page, 'playing');
    await page.locator('.csim-scrubber').fill('500');
    await waitState(page, 'paused');
    const s = await S(page);
    expect(s.progress).toBeCloseTo(0.5, 3);
    expect(s.stageIndex).toBe(3); // 34 s of 68 s falls in stage 4
    await page.evaluate(() => window.__csim.seek(0.25));
    expect((await S(page)).progress).toBeCloseTo(0.25, 5);
    await page.locator('.csim-scrubber').focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => (await S(page)).progress).toBeCloseTo(0.251, 3);
  });

  test('zoom buttons change and reset view restores the camera distance', async ({ page }) => {
    await open(page);
    const d0 = (await S(page)).camera.distance;
    await page.locator('[data-ref="zoomIn"]').click();
    await expect.poll(async () => (await S(page)).camera.distance).toBeCloseTo(d0 * 0.8, 1);
    await page.locator('[data-ref="zoomOut"]').click();
    await page.locator('[data-ref="zoomOut"]').click();
    await expect.poll(async () => (await S(page)).camera.distance).toBeCloseTo(d0 * 0.8 * 1.25 * 1.25, 1);
    await page.locator('[data-ref="resetView"]').click();
    await expect.poll(async () => (await S(page)).camera.distance).toBeCloseTo(d0, 1);
  });

  test('mouse drag rotates (azimuth changes) and wheel zooms within limits', async ({ page }) => {
    await open(page);
    await page.evaluate(() => window.__csim.goToStage(1));
    await waitState(page, 'paused');
    const a0 = (await S(page)).camera.azimuth;
    const box = await page.locator('.csim canvas').boundingBox();
    await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5, { steps: 12 });
    await page.mouse.up();
    await expect.poll(async () => Math.abs((await S(page)).camera.azimuth - a0)).toBeGreaterThan(0.15);
    for (let i = 0; i < 30; i++) await page.mouse.wheel(0, 400);
    await page.waitForTimeout(500);
    const s = await S(page);
    expect(s.camera.distance).toBeLessThanOrEqual(80.01);
    expect(Math.abs(s.camera.azimuth)).toBeLessThanOrEqual(1.5001);
  });

  test('setLang keeps the stage and playback, flips dir and text', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { window.__csim.goToStage(3); window.__csim.play(); });
    await waitState(page, 'playing');
    const title = page.locator('.csim-stage-title');
    await expect(title).toHaveText('Opening the front of the lens capsule');
    await page.evaluate(() => { document.querySelector('.csim canvas').dataset.marker = 'same'; });
    await page.evaluate(() => window.__csim.setLang('ar'));
    const s = await S(page);
    expect(s).toMatchObject({ lang: 'ar', stageIndex: 3, state: 'playing' });
    await expect(page.locator('.csim')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('.csim')).toHaveAttribute('lang', 'ar');
    await expect(title).toHaveText('فتح الجزء الأمامي من محفظة العدسة');
    await expect(page.locator('[data-ref="next"]')).toHaveAttribute('aria-label', 'المرحلة التالية');
    expect(await page.evaluate(() => document.querySelector('.csim canvas').dataset.marker)).toBe('same');
    await page.evaluate(() => window.__csim.setLang('en'));
    await expect(page.locator('.csim')).toHaveAttribute('dir', 'ltr');
    expect((await S(page)).stageIndex).toBe(3);
  });

  test('setTheme switches UI tokens and the 3D background', async ({ page }) => {
    await open(page);
    const light = await page.evaluate(() => window.__cataractSim.sample().corner);
    await page.evaluate(() => window.__csim.setTheme('dark'));
    await expect(page.locator('.csim')).toHaveAttribute('data-theme', 'dark');
    const dark = await page.evaluate(() => window.__cataractSim.sample().corner);
    expect(light[0] + light[1] + light[2]).toBeGreaterThan(500);
    expect(dark[0] + dark[1] + dark[2]).toBeLessThan(150);
    expect((await S(page)).theme).toBe('dark');
  });

  test('WebGL context loss shows the restoring note and restore resumes the previous state', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { window.__csim.goToStage(2); });
    await waitState(page, 'paused');
    await page.evaluate(() => { window.__csimLose = window.__cataractSim.renderer.getContext().getExtension('WEBGL_lose_context'); window.__csimLose.loseContext(); });
    await waitState(page, 'error');
    await expect(page.locator('.csim-note')).toBeVisible();
    await expect(page.locator('.csim-note')).toContainText('Restoring');
    await expect(page.locator('.csim-fallback svg')).toBeVisible();
    expect(await page.evaluate(() => window.__cataractSimCounters.rafLoops)).toBe(0);
    await page.evaluate(() => window.__csimLose.restoreContext());
    await waitState(page, 'paused');
    await expect(page.locator('.csim-note')).toBeHidden();
    const s = await S(page);
    expect(s.stageIndex).toBe(2);
    expect(await page.evaluate(() => window.__cataractSimCounters.rafLoops)).toBe(1);
    const px = await page.evaluate(() => window.__cataractSim.sample());
    expect(px.uniqueColors).toBeGreaterThan(80);
    await page.evaluate(() => window.__csim.play());
    await waitState(page, 'playing');
  });

  test('keyboard: Space toggles playback, arrows change stage (mirrored in RTL)', async ({ page }) => {
    await open(page);
    await page.locator('.csim-viewport').focus();
    await page.keyboard.press('Space');
    await waitState(page, 'playing');
    await page.keyboard.press('Space');
    await waitState(page, 'paused');
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => (await S(page)).stageIndex).toBe(1);
    await page.keyboard.press('ArrowLeft');
    await expect.poll(async () => (await S(page)).stageIndex).toBe(0);
    await page.evaluate(() => window.__csim.setLang('ar'));
    await page.locator('.csim-viewport').focus();
    await page.keyboard.press('ArrowLeft'); // RTL: left = forward
    await expect.poll(async () => (await S(page)).stageIndex).toBe(1);
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => (await S(page)).stageIndex).toBe(0);
    // Tab order reaches the transport controls (no keyboard trap)
    await page.locator('.csim-viewport').focus();
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('.csim') || document.activeElement === document.body)).toBe(true);
  });

  test('aria-live announces stage changes; controls have labels in both languages', async ({ page }) => {
    await open(page);
    await page.locator('[data-ref="next"]').click();
    await expect(page.locator('.csim-sr')).toHaveText('Stage 2 of 7: Preparing and viewing the front of the eye');
    await expect(page.locator('.csim-sr')).toHaveAttribute('aria-live', 'polite');
    for (const lang of ['en', 'ar']) {
      await page.evaluate((l) => window.__csim.setLang(l), lang);
      const unlabeled = await page.evaluate(() => [...document.querySelectorAll('.csim button, .csim input')]
        .filter((b) => !b.hidden && b.offsetParent !== null)
        .filter((b) => !(b.getAttribute('aria-label') || b.textContent.trim())).length);
      expect(unlabeled).toBe(0);
    }
  });

  test('anatomy: labels toggle shows hotspots; choosing a structure focuses the camera and explains it', async ({ page }) => {
    await open(page);
    await page.locator('[data-ref="labels"]').click();
    await expect(page.locator('[data-ref="labels"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.csim-hotspot:not([hidden])').first()).toBeVisible();
    const t0 = (await S(page)).camera.target;
    await page.locator('[data-structure="zonules"]').click();
    await expect(page.locator('.csim-anatomy-info')).toContainText('Zonules');
    await expect.poll(async () => (await S(page)).camera.target[2]).toBeCloseTo(-1.3, 1);
    expect((await S(page)).focus).toBe('zonules');
    expect(t0[2]).not.toBeCloseTo(-1.3, 1);
    await page.locator('.csim-hotspot:not([hidden])').first().click();
    expect((await S(page)).focus).not.toBeNull();
    await page.locator('[data-ref="cutaway"]').click();
    expect((await S(page)).cutaway).toBe(false); // stage 1 default is cut-away; the toggle overrides it
    await page.locator('[data-ref="close"]').click();
    await expect(page.locator('body')).toHaveAttribute('data-closed', '1');
    expect(await page.evaluate(() => window.__csimEvents.some((e) => e.ev === 'close'))).toBe(true);
  });
});

test.describe('cataract simulator — reduced motion & fallback', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('prefers-reduced-motion: no autoplay, stage changes jump-cut', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${PAGE}?lang=en&autoplay=1`);
    await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready');
    await page.waitForTimeout(1200);
    const s = await S(page);
    expect(s).toMatchObject({ state: 'ready', reducedMotion: true, progress: 0 });
    await page.evaluate(() => window.__csim.goToStage(3));
    const s2 = await S(page); // synchronous: no 'transitioning' camera flight
    expect(s2.state).toBe('paused');
    expect(s2.camera.target).toEqual([0, 0, 0.2]);
    await page.evaluate(() => window.__csim.play());
    await waitState(page, 'playing');
  });

  test('autoplay starts without reduced motion when requested', async ({ page }) => {
    await page.goto(`${PAGE}?lang=en&reduced=0&autoplay=1`);
    await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'playing');
  });

  test('WebGL unavailable: structured fallback with working stage navigation', async ({ page }) => {
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        if (/webgl/i.test(String(type))) return null;
        return orig.call(this, type, ...rest);
      };
    });
    await open(page, 'lang=ar&reduced=0');
    const s = await S(page);
    expect(s).toMatchObject({ state: 'fallback', webgl: false, fallbackReason: 'no-webgl' });
    await expect(page.locator('.csim canvas')).toHaveCount(0);
    await expect(page.locator('.csim-fallback svg[role="img"]')).toBeVisible();
    await expect(page.locator('.csim-fallback-note')).toContainText('غير متاح');
    await expect(page.locator('[data-ref="playPause"]')).toBeHidden();
    await expect(page.locator('.csim-viewtools')).toBeHidden();
    await page.locator('[data-ref="next"]').click();
    expect((await S(page)).stageIndex).toBe(1);
    await expect(page.locator('.csim-stage-title')).toHaveText('التحضير والنظر إلى مقدّمة العين');
    await page.locator('.csim-seg[data-seg="6"]').click();
    expect((await S(page)).stageIndex).toBe(6);
    await page.locator('[data-ref="restart"]').click();
    expect((await S(page)).stageIndex).toBe(0);
    await expect(page.locator('.csim-disclaimer')).toBeVisible();
  });
});

test.describe('cataract simulator — mobile 390x844', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });

  test('no horizontal overflow, ≥44px touch targets, page still scrolls over the canvas', async ({ page }) => {
    await open(page, 'lang=ar&reduced=0');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const small = await page.evaluate(() => [...document.querySelectorAll('.csim button, .csim input, .csim summary')]
      .filter((el) => el.offsetParent !== null && !el.closest('[hidden]'))
      .map((el) => { const r = el.getBoundingClientRect(); return { k: el.dataset.ref || el.className, w: Math.round(r.width), h: Math.round(r.height) }; })
      .filter((r) => r.w < 44 || r.h < 44));
    expect(small).toEqual([]);
    const vp = await page.locator('.csim-viewport').boundingBox();
    expect(vp.height).toBeLessThanOrEqual(844 * 0.62 + 1);
    expect(vp.width).toBeGreaterThan(330);
    // one-finger swipe on the canvas scrolls the page (touch-action: pan-y; 3D needs "Explore 3D")
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.csim canvas')).touchAction)).toBe('pan-y');
    const cdp = await page.context().newCDPSession(page);
    const swipe = async (x, y, dx, dy) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let k = 1; k <= 12; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (dx * k) / 12, y: y + (dy * k) / 12 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    const cx = Math.round(vp.x + vp.width / 2), cy = Math.round(vp.y + vp.height * 0.6);
    const a0 = (await S(page)).camera.azimuth;
    await swipe(cx, cy, 0, -300);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
    expect((await S(page)).camera.azimuth).toBeCloseTo(a0, 5); // the swipe scrolled the page, not the model
    // "Explore 3D" mode: the canvas captures touch, one finger rotates and the page no longer scrolls
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('[data-ref="touch"]')).toBeVisible();
    await page.locator('[data-ref="touch"]').click();
    await expect(page.locator('[data-ref="touch"]')).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.csim canvas')).touchAction)).toBe('none');
    const vp2 = await page.locator('.csim-viewport').boundingBox();
    await swipe(Math.round(vp2.x + vp2.width * 0.3), Math.round(vp2.y + vp2.height * 0.4), 150, 0);
    await expect.poll(async () => Math.abs((await S(page)).camera.azimuth - a0)).toBeGreaterThan(0.1);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('mobile playback works and the stage text sits below the viewport', async ({ page }) => {
    await open(page, 'lang=en&reduced=0');
    await page.locator('.csim-start').click();
    await waitState(page, 'playing');
    const vp = await page.locator('.csim-viewport').boundingBox();
    const panel = await page.locator('.csim-panel').boundingBox();
    expect(panel.y).toBeGreaterThan(vp.y + vp.height);
    const px = await page.evaluate(() => window.__cataractSim.sample());
    expect(px.uniqueColors).toBeGreaterThan(60);
  });
});

// ---- Evidence + performance (opt-in: CSIM_EVIDENCE=1 / CSIM_PERF=1) ----
const STAGE_P = 0.55;
async function seekStage(page, i, p = STAGE_P) {
  await page.evaluate(([i, p]) => {
    const c = window.__csim;
    c.goToStage(i);
    const d = [9, 8, 8, 10, 12, 12, 9];
    const tot = d.reduce((a, b) => a + b, 0);
    const start = d.slice(0, i).reduce((a, b) => a + b, 0);
    c.seek((start + d[i] * p) / tot);
  }, [i, p]);
  await page.waitForTimeout(700);
}

for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
  test.describe(`evidence ${w}x${h}`, () => {
    test.use({ viewport: { width: w, height: h }, ...(mobile ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}) });
    test('stage screenshots', async ({ page }) => {
      test.skip(!process.env.CSIM_EVIDENCE, 'set CSIM_EVIDENCE=1 to capture evidence');
      test.setTimeout(120_000);
      const dir = path.join(EVIDENCE, String(w));
      fs.mkdirSync(dir, { recursive: true });
      for (const [lang, theme] of [['en', 'light'], ['ar', 'dark']]) {
        await open(page, `lang=${lang}&theme=${theme}&reduced=1`);
        for (let i = 0; i < 7; i++) {
          await seekStage(page, i);
          await page.locator('.csim-viewport').screenshot({ path: path.join(dir, `stage${i + 1}-${lang}-${theme}.png`) });
        }
        await page.locator('.csim').screenshot({ path: path.join(dir, `ui-${lang}-${theme}.png`) });
      }
      await page.evaluate(() => { window.__csim.setLang('en'); window.__csim.setTheme('light'); });
      await page.locator('[data-ref="labels"]').click();
      await seekStage(page, 0, 0.6);
      await page.locator('.csim-viewport').screenshot({ path: path.join(dir, 'labels-en.png') });
    });

    test('performance sample', async ({ page }) => {
      test.skip(!process.env.CSIM_PERF, 'set CSIM_PERF=1 to measure');
      test.setTimeout(90_000);
      await open(page, 'lang=en&reduced=0');
      await page.evaluate(() => window.__csim.play());
      const fps = await page.evaluate(() => new Promise((res) => {
        const t = []; const start = performance.now();
        const f = (now) => { t.push(now); if (now - start < 6000) requestAnimationFrame(f); else res(t); };
        requestAnimationFrame(f);
      }));
      const deltas = fps.slice(1).map((v, i) => v - fps[i]).sort((a, b) => a - b);
      const out = {
        viewport: `${w}x${h}`, emulatedMobile: mobile,
        avgFps: Math.round(((fps.length - 1) * 1000 / (fps[fps.length - 1] - fps[0])) * 10) / 10,
        p95FrameMs: Math.round(deltas[Math.floor(deltas.length * 0.95)] * 10) / 10,
        gpu: await page.evaluate(() => window.__cataractSim.gpu()),
        render: await page.evaluate(() => window.__cataractSim.info()),
        state: await S(page)
      };
      fs.mkdirSync(EVIDENCE, { recursive: true });
      fs.writeFileSync(path.join(EVIDENCE, `perf-${w}x${h}.json`), JSON.stringify(out, null, 2));
      console.log(JSON.stringify(out));
    });
  });
}
