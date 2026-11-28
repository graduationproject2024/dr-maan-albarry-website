// Robustness, touch and lifecycle stress tests for the 3D cataract simulator (harness page, debug counters).
import { test, expect } from '@playwright/test';

const PAGE = 'cataract-sim-preview.html';
let errors;
test.beforeEach(({ page }) => {
  errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
});
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

async function open(page, query = 'lang=en&reduced=0') {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready', null, { timeout: 30_000 });
}
const S = (page) => page.evaluate(() => window.__csim.getState());
const counters = (page) => page.evaluate(() => ({ ...window.__cataractSimCounters }));
const settle = (page, state) => expect.poll(async () => (await S(page)).state, { timeout: 8000 }).toBe(state);

test.describe('cataract simulator — stress (desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('20 rapid play/pause toggles leave one consistent state and one render loop', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { for (let i = 0; i < 20; i++) { if (i % 2 === 0) window.__csim.play(); else window.__csim.pause(); } });
    await settle(page, 'paused');
    for (let i = 0; i < 20; i++) await page.locator('[data-ref="playPause"]').click();
    await settle(page, 'paused'); // even number of clicks from paused
    const c = await counters(page);
    expect(c).toMatchObject({ live: 1, rafLoops: 1, renderers: 1 });
    const p = (await S(page)).progress;
    await page.waitForTimeout(300);
    expect((await S(page)).progress).toBe(p);
  });

  test('20 rapid stage changes end on the last requested stage', async ({ page }) => {
    await open(page);
    const seq = [3, 1, 6, 0, 5, 2, 4, 6, 1, 3, 0, 2, 5, 4, 6, 1, 0, 3, 2, 5];
    await page.evaluate((s) => { for (const i of s) window.__csim.goToStage(i); }, seq);
    await settle(page, 'paused');
    const st = await S(page);
    expect(st.stageIndex).toBe(5);
    expect(st.stageProgress).toBe(0);
    expect((await counters(page)).rafLoops).toBe(1);
    await expect(page.locator('.csim-seg[data-seg="5"]')).toHaveAttribute('aria-current', 'step');
  });

  test('rapid scrubbing tracks the last position exactly', async ({ page }) => {
    await open(page);
    await page.evaluate(() => window.__csim.play());
    const values = Array.from({ length: 40 }, (_, k) => (k * 137) % 1000);
    await page.evaluate((vals) => {
      const el = document.querySelector('.csim-scrubber');
      for (const v of vals) { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }
    }, values);
    await settle(page, 'paused');
    expect((await S(page)).progress).toBeCloseTo(values[values.length - 1] / 1000, 5);
    expect((await counters(page)).rafLoops).toBe(1);
  });

  test('invalid stage indices and out-of-range seeks are clamped', async ({ page }) => {
    await open(page, 'lang=en&reduced=1');
    const idx = await page.evaluate(() => [-5, 99, NaN, 'abc', 2.6, null, undefined, Infinity].map((v) => { window.__csim.goToStage(v); return window.__csim.getState().stageIndex; }));
    expect(idx).toEqual([0, 6, 0, 0, 3, 0, 0, 6]);
    const seeks = await page.evaluate(() => [-1, 5, NaN, 0.5].map((v) => { window.__csim.seek(v); const s = window.__csim.getState(); return [s.progress, s.state]; }));
    expect(seeks[0]).toEqual([0, 'paused']);
    expect(seeks[1]).toEqual([1, 'completed']);
    expect(seeks[2]).toEqual([0, 'paused']);
    expect(seeks[3][0]).toBeCloseTo(0.5, 6);
  });

  test('camera limits hold under extreme wheel and drag input', async ({ page }) => {
    test.setTimeout(90_000);
    await open(page);
    // Zoom limits are relative to the stage camera's fitted distance (`base`, cataract camera pass 2026-11):
    // minR = max(11, 0.2 × base), maxR = min(160, max(80, 1.45 × base)) — checked at several canvas sizes, then pushed
    // to both ends with Ctrl + wheel (Phase 2 wheel policy).
    const ctrlWheel = async (dy, n) => {
      const b = await page.locator('.csim canvas').boundingBox();
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
      await page.keyboard.down('Control');
      for (let i = 0; i < n; i++) await page.mouse.wheel(0, dy);
      await page.keyboard.up('Control');
    };
    for (const [w, h] of [[1440, 900], [390, 844], [1024, 700], [1280, 800]]) {
      await page.setViewportSize({ width: w, height: h });
      await expect.poll(() => page.evaluate(() => window.__csim.getState().camera.view[0] === document.querySelector('.csim-viewport').clientWidth), { timeout: 4000 }).toBe(true);
      await page.locator('[data-ref="resetView"]').click();
      await expect.poll(async () => (await S(page)).camera.moving).toBe(false);
      const c0 = (await S(page)).camera;
      expect(c0.distance, `${w}x${h}: on the fitted distance`).toBeCloseTo(c0.base, 2);
      expect(c0.minR, `${w}x${h}: minR`).toBeCloseTo(Math.max(11, 0.2 * c0.base), 6);
      expect(c0.maxR, `${w}x${h}: maxR`).toBeCloseTo(Math.min(160, Math.max(80, 1.45 * c0.base)), 6);
      expect(c0.minR / c0.base).toBeLessThanOrEqual(0.5);
      expect(c0.maxR / c0.base).toBeGreaterThanOrEqual(1.45 - 1e-9);
      await ctrlWheel(-600, 40);
      await expect.poll(async () => (await S(page)).camera.distance, { timeout: 4000 }).toBeLessThan(c0.minR + 0.3);
      expect((await S(page)).camera.distance, `${w}x${h}: never below minR`).toBeGreaterThanOrEqual(c0.minR - 0.01);
      await ctrlWheel(800, 40);
      await expect.poll(async () => (await S(page)).camera.distance, { timeout: 4000 }).toBeGreaterThan(c0.maxR - 0.5);
      expect((await S(page)).camera.distance, `${w}x${h}: never above maxR`).toBeLessThanOrEqual(c0.maxR + 0.01);
    }
    const box = await page.locator('.csim canvas').boundingBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 2000, cy + 2000, { steps: 20 });
    await page.mouse.up();
    await page.mouse.down();
    await page.mouse.move(cx - 4000, cy - 4000, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const c = (await S(page)).camera;
    expect(Math.abs(c.azimuth)).toBeLessThanOrEqual(1.5001);
    expect(c.polar).toBeGreaterThanOrEqual(0.3999);
    expect(c.polar).toBeLessThanOrEqual(Math.PI - 0.3999);
    for (const [k, lo, hi] of [[0, -6, 6], [1, -6, 6], [2, -10, 5]]) { expect(c.target[k]).toBeGreaterThanOrEqual(lo); expect(c.target[k]).toBeLessThanOrEqual(hi); }
  });

  test('mount/destroy ×8 leaves no leaked listeners, observers, loops or renderers', async ({ page }) => {
    await open(page);
    const base = await counters(page);
    const after = await page.evaluate(async () => {
      for (let i = 0; i < 8; i++) {
        const c = await window.__csimMount();
        c.play();
        c.destroy();
      }
      return { ...window.__cataractSimCounters };
    });
    expect(after).toMatchObject({ live: 0, listeners: 0, observers: 0, rafLoops: 0, renderers: 0 });
    expect(after.mounts).toBe(base.mounts + 8);
    expect(await page.locator('.csim canvas').count()).toBe(0);
    await page.evaluate(async () => { window.__csim = await window.__csimMount(); });
    await expect.poll(async () => (await S(page)).state).toBe('ready');
    expect(await counters(page)).toMatchObject({ live: 1, rafLoops: 1, renderers: 1 });
    const px = await page.evaluate(() => window.__cataractSim.sample());
    expect(px.uniqueColors).toBeGreaterThan(80);
  });

  test('WebGL context loss/restore three times while playing', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { window.__csim.goToStage(4); window.__csim.play(); });
    for (let k = 0; k < 3; k++) {
      await settle(page, 'playing');
      await page.evaluate(() => { window.__lose = window.__cataractSim.renderer.getContext().getExtension('WEBGL_lose_context'); window.__lose.loseContext(); });
      await settle(page, 'error');
      expect((await counters(page)).rafLoops).toBe(0);
      await page.evaluate(() => window.__lose.restoreContext());
      await settle(page, 'playing');
      expect((await counters(page)).rafLoops).toBe(1);
    }
    await page.evaluate(() => window.__csim.pause());
    const px = await page.evaluate(() => window.__cataractSim.sample());
    expect(px.uniqueColors).toBeGreaterThan(80);
  });

  test('resizing while rendering keeps the canvas matched to the viewport', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { window.__csim.goToStage(5); window.__csim.play(); });
    for (const [w, h] of [[900, 700], [1440, 900], [500, 900], [1280, 800], [700, 500]]) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(250);
      const m = await page.evaluate(() => {
        const c = document.querySelector('.csim canvas'), vp = document.querySelector('.csim-viewport');
        const dpr = window.__cataractSim.renderer.getPixelRatio();
        return { cw: c.width, expect: Math.floor(vp.clientWidth * dpr), aspect: window.__cataractSim.camera.aspect, ratio: vp.clientWidth / vp.clientHeight };
      });
      expect(Math.abs(m.cw - m.expect)).toBeLessThanOrEqual(1);
      expect(m.aspect).toBeCloseTo(m.ratio, 2);
    }
    expect((await counters(page)).rafLoops).toBe(1);
    const px = await page.evaluate(() => window.__cataractSim.sample());
    expect(px.nonBackground).toBeGreaterThan(0.1);
  });
});

test.describe('cataract simulator — touch policy (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });

  test('playback controls never move the camera', async ({ page }) => {
    await open(page, 'lang=en&reduced=0');
    const cam0 = (await S(page)).camera;
    await page.locator('.csim-start').tap();
    await settle(page, 'playing');
    await page.locator('[data-ref="playPause"]').tap();
    await settle(page, 'paused');
    await page.locator('[data-ref="playPause"]').tap();
    await settle(page, 'playing');
    await page.locator('[data-ref="playPause"]').tap();
    await settle(page, 'paused');
    const cam1 = (await S(page)).camera;
    expect(cam1.azimuth).toBeCloseTo(cam0.azimuth, 6);
    expect(cam1.polar).toBeCloseTo(cam0.polar, 6);
    expect(cam1.distance).toBeCloseTo(cam0.distance, 6);
  });

  test('overlays do not intercept touches meant for the canvas', async ({ page }) => {
    await open(page, 'lang=en&reduced=0');
    const res = await page.evaluate(() => {
      const pe = ['.csim-overlay--start', '.csim-vignette', '.csim-hotspots', '.csim-chip', '.csim-raynote'].map((s) => getComputedStyle(document.querySelector(s)).pointerEvents);
      const vp = document.querySelector('.csim-viewport').getBoundingClientRect();
      const avoid = ['.csim-viewtools', '.csim-start', '.csim-chip'].map((s) => document.querySelector(s).getBoundingClientRect());
      const hits = [];
      for (const fx of [0.15, 0.35, 0.5]) for (const fy of [0.25, 0.45]) {
        const x = vp.left + vp.width * fx, y = vp.top + vp.height * fy;
        if (avoid.some((b) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom)) continue;
        hits.push(document.elementFromPoint(x, y).tagName);
      }
      return { pe, hits };
    });
    expect(res.pe).toEqual(['none', 'none', 'none', 'none', 'none']);
    expect(res.hits.length).toBeGreaterThan(3);
    expect(new Set(res.hits)).toEqual(new Set(['CANVAS']));
  });

  test('Explore 3D: pinch zooms; Reset View restores the stage camera; leaving restores page scroll', async ({ page }) => {
    await open(page, 'lang=en&reduced=0');
    const preset = (await S(page)).camera;
    await page.locator('[data-ref="touch"]').tap();
    await expect(page.locator('[data-ref="touch"]')).toHaveAttribute('aria-pressed', 'true');
    const vp = await page.locator('.csim-viewport').boundingBox();
    const cx = Math.round(vp.x + vp.width / 2), cy = Math.round(vp.y + vp.height * 0.45);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx - 20, y: cy, id: 1 }, { x: cx + 20, y: cy, id: 2 }] });
    for (let k = 1; k <= 12; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx - 20 - 8 * k, y: cy, id: 1 }, { x: cx + 20 + 8 * k, y: cy, id: 2 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(async () => (await S(page)).camera.distance).toBeLessThan(preset.distance * 0.9);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page.locator('[data-ref="resetView"]').tap();
    await expect.poll(async () => (await S(page)).camera.distance).toBeCloseTo(preset.distance, 1);
    expect((await S(page)).camera.azimuth).toBeCloseTo(preset.azimuth, 2);
    await page.locator('[data-ref="touch"]').tap();
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.csim canvas')).touchAction)).toBe('pan-y');
    const az = (await S(page)).camera.azimuth;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] });
    for (let k = 1; k <= 12; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx, y: cy - 25 * k }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
    expect((await S(page)).camera.azimuth).toBeCloseTo(az, 5);
  });
});
