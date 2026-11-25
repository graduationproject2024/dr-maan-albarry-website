// Lens Lab / vision simulator: every way the picture can fail ends in a clear, recoverable state — a retry, or the
// static non-WebGL comparison with the educational content — never a stuck "Loading" or a blank area.
// Failure paths F1–F7 and their exact conditions: docs/implementation/phase-2-final-closure/06_LENS_LAB_FINAL_RECOVERY.md
// Also: each of the five lens categories changes the rendered pixels (canvas readback).
import { test, expect } from '@playwright/test';
import { STRINGS } from '../src/vision-sim/i18n.js';

const H = '#simulator-host';
const HARNESS = 'vision-sim-preview.html';
const VS_CHUNK = /\/assets\/vision-sim-[^/]*\.js$/;
const PICTURE = /\/assets\/(pipeline|scenes)-[^/]*\.js$/;
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 };

function watchConsole(page) {
  const errors = [];
  // a 404 / aborted request is the condition under test; anything else logged as an error fails the test
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_|Failed to fetch dynamically/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
let errors;
test.beforeEach(({ page }) => { errors = watchConsole(page); });
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

const S = (page) => page.evaluate(() => window.__vsim.getState());
const C = (page) => page.evaluate(() => ({ ...window.__visionSimCounters }));
async function openHarness(page, query = 'lang=en') {
  await page.goto(`${HARNESS}?${query}`);
  await page.waitForFunction(() => window.__vsim && ['ready', 'fallback'].includes(window.__vsim.getState().state), null, { timeout: 30_000 });
}
/** Remount the harness simulator with test-only timings (options of the public mount API). */
const remount = (page, o) => page.evaluate(async (opts) => { window.__vsim.destroy(); window.__vsim = await window.__vsimMount(opts); return window.__vsim.getState().state; }, o);

test.describe('F1 · stale page after a deploy (old chunk names 404)', () => {
  test.use(phone);

  test('the tab reloads once to the current build; if that still fails, the retry message stays', async ({ page }) => {
    let navigations = 0;
    page.on('domcontentloaded', () => { navigations++; }); // full document loads only (not history.replaceState)
    await page.route(VS_CHUNK, (r) => r.fulfill({ status: 404, body: 'gone' }));
    // the server now sends HTML that points at a newer entry script (what a deploy does)
    await page.route(/\/en\/lens-lab\/(\?.*)?$/, async (r) => {
      if (r.request().resourceType() !== 'fetch') return r.continue();
      const res = await r.fetch();
      const body = (await res.text()).replace(/\/assets\/index-[\w-]+\.js/g, '/assets/index-NEWBUILD.js');
      return r.fulfill({ response: res, body });
    });
    await page.goto('/en/lens-lab/');
    await page.locator(H).scrollIntoViewIfNeeded().catch(() => {}); // the reload may already be under way
    await expect.poll(() => navigations, { timeout: 30_000 }).toBe(2); // one reload, then …
    await page.locator('main h1').waitFor();
    await page.locator(H).scrollIntoViewIfNeeded();
    const err = page.locator(`${H} .vsim-load-error`);
    await expect(err).toBeVisible({ timeout: 30_000 }); // … the guard stops a loop and the retry message is shown
    await expect(err.locator('button')).toBeVisible();
    await page.waitForTimeout(1500);
    expect(navigations).toBe(2);
    expect(await page.evaluate(() => sessionStorage.getItem('stale-build-reload'))).toBe('/assets/index-NEWBUILD.js');
  });

  test('a 404 on the current build does not reload: message and a working retry', async ({ page }) => {
    let navigations = 0;
    page.on('domcontentloaded', () => { navigations++; }); // full document loads only (not history.replaceState)
    await page.route(VS_CHUNK, (r) => r.fulfill({ status: 404, body: 'gone' }));
    await page.goto('/en/lens-lab/');
    await page.locator(H).scrollIntoViewIfNeeded();
    const err = page.locator(`${H} .vsim-load-error`);
    await expect(err).toBeVisible({ timeout: 30_000 });
    expect(navigations).toBe(1);
    await page.unroute(VS_CHUNK);
    await err.locator('button').tap();
    await page.waitForFunction((h) => document.querySelector(`${h} canvas`) && !document.querySelector(`${h} .vsim-loading:not([hidden])`), H, { timeout: 30_000 });
    await expect(err).toHaveCount(0);
  });
});

test.describe('F1b · Lens Lab comparison picture (desktop) chunk fails', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('the comparison slot explains and offers a retry that works', async ({ page }) => {
    await page.route(VS_CHUNK, (r) => r.abort('connectionfailed'));
    await page.goto('/en/lens-lab/');
    await page.locator('#lab').scrollIntoViewIfNeeded();
    await page.locator('#lens-lab-host [data-lens-lab-sim]').scrollIntoViewIfNeeded();
    const retry = page.locator('#lens-lab-host .llab-retry');
    await expect(retry).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#lens-lab-host .llab-sim-status')).toContainText('could not load');
    await expect(page.locator('#lens-lab-host .llab-table')).toBeVisible(); // the written comparison stays
    await page.unroute(VS_CHUNK);
    await retry.click();
    await expect(page.locator('#lens-lab-host .llab canvas')).toHaveCount(1, { timeout: 30_000 });
    await expect(page.locator('#lens-lab-host .llab')).toHaveAttribute('data-sim', 'ready');
  });
});

test.describe('F2 · WebGL 2 unavailable', () => {
  test.use(phone);
  test('the public page shows the static comparison with the educational content, no retry, no spinner', async ({ page }) => {
    await page.addInitScript(() => {
      const o = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (t, ...r) { return /webgl/i.test(t) ? null : o.call(this, t, ...r); };
    });
    await page.goto('/en/lens-lab/');
    await page.locator(H).scrollIntoViewIfNeeded();
    const fb = page.locator(`${H} .vsim-fallback`);
    await expect(fb).toBeVisible({ timeout: 30_000 });
    await expect(fb.locator('svg[role="img"]')).toBeVisible();
    await expect(fb).toContainText('Trifocal');
    await expect(fb).toContainText(STRINGS.en.lenses.edof.name);
    await expect(fb.locator('[data-vsim-reload]')).toHaveCount(0); // a retry cannot help here
    await expect(page.locator(`${H} .vsim-loading`)).toBeHidden();
    await expect(page.locator(`${H} .vsim-disclaimer`)).toBeVisible();
    await expect(page.locator(`${H} canvas`)).toHaveCount(0);
  });
});

test.describe('F3 · shader compile / link failure', () => {
  test('the GPU rejects a shader: static comparison instead of a blank picture, no console error', async ({ page }) => {
    await page.addInitScript(() => {
      const o = WebGL2RenderingContext.prototype.getProgramParameter;
      WebGL2RenderingContext.prototype.getProgramParameter = function (p, pname) { return pname === this.LINK_STATUS ? false : o.call(this, p, pname); };
    });
    await openHarness(page);
    expect(await S(page)).toMatchObject({ state: 'fallback', webgl: false, fallbackReason: 'shader-error' });
    await expect(page.locator('.vsim-fallback svg[role="img"]')).toBeVisible();
    await expect(page.locator('.vsim-fallback [data-vsim-reload]')).toHaveCount(0);
    await expect(page.locator('.vsim-loading')).toBeHidden();
    expect(await C(page)).toMatchObject({ renderers: 0, rafLoops: 0, renderTargets: 0 });
  });
});

test.describe('F4 · WebGL context lost', () => {
  test('not restored in time: static comparison with a retry; the retry brings the picture back without leaks', async ({ page }) => {
    await openHarness(page);
    expect(await remount(page, { restoreTimeoutMs: 1500 })).toBe('ready');
    const before = await C(page);
    await page.evaluate(() => window.__visionSim.renderer.getContext().getExtension('WEBGL_lose_context').loseContext());
    await expect.poll(async () => (await S(page)).state).toBe('error');
    await expect(page.locator('.vsim-note')).toBeVisible();
    await expect.poll(async () => (await S(page)).state, { timeout: 10_000 }).toBe('fallback');
    expect((await S(page)).fallbackReason).toBe('context-not-restored');
    const again = page.locator('.vsim-fallback [data-vsim-reload]');
    await expect(again).toBeVisible();
    await again.click();
    await expect.poll(async () => (await S(page)).state, { timeout: 15_000 }).toBe('ready');
    await expect(page.locator('.vsim--fallback')).toHaveCount(0);
    const px = await page.evaluate(() => window.__visionSim.sample());
    expect(px.uniqueColors).toBeGreaterThan(150);
    await page.evaluate(() => window.scrollTo(0, 0)); // the tall fallback had scrolled the picture away; its loop pauses off screen
    await expect.poll(async () => (await C(page)).rafLoops).toBe(before.rafLoops);
    const after = await C(page);
    expect(after).toMatchObject({ renderers: before.renderers, rafLoops: before.rafLoops, observers: before.observers, live: 1 });
  });
});

test.describe('F5 · navigation interrupts the start', () => {
  test.use(phone);
  test('leaving while the picture code loads, then coming back: one WebGL context, a working picture', async ({ page }) => {
    await page.addInitScript(() => {
      const o = HTMLCanvasElement.prototype.getContext; const live = new Set(); window.__gl = live;
      HTMLCanvasElement.prototype.getContext = function (t, ...r) { const c = o.call(this, t, ...r); if (c && /webgl/i.test(t) && this.isConnected !== undefined) { live.add(c); this.addEventListener('webglcontextlost', () => live.delete(c)); } return c; };
    });
    let release; const gate = new Promise((r) => { release = r; });
    await page.route(PICTURE, async (r) => { await gate; await r.continue(); });
    await page.goto('/en/lens-lab/');
    await page.locator(H).scrollIntoViewIfNeeded();
    await expect(page.locator(`${H} .vsim-loading`)).toBeVisible({ timeout: 30_000 });
    await page.evaluate(() => document.querySelector('a[data-nav][href$="about/"]').click()); // client-side navigation
    await page.waitForURL(/\/en\/about\/$/);
    release();
    await page.waitForTimeout(800);
    await page.goBack();
    await page.waitForURL(/\/en\/lens-lab\//);
    await page.locator(H).scrollIntoViewIfNeeded();
    await page.waitForFunction((h) => document.querySelector(`${h} canvas`) && !document.querySelector(`${h} .vsim-loading:not([hidden])`), H, { timeout: 30_000 });
    // only live contexts count: the probe canvas of hasWebGL2() and the abandoned start are released
    await expect.poll(() => page.evaluate(() => [...window.__gl].filter((c) => !c.isContextLost()).length)).toBeLessThanOrEqual(1);
  });
});

test.describe('F6 · slow or stalled network', () => {
  test('picture code that never arrives ends in the static comparison with a retry, which works once it arrives', async ({ page }) => {
    // the harness's own first mount waits on the same stalled download; ours replaces it on the same host
    let release; const gate = new Promise((r) => { release = r; });
    await page.route(PICTURE, async (r) => { await gate; await r.continue(); });
    await page.goto(`${HARNESS}?lang=en`);
    await page.waitForFunction(() => window.__vsimModule && window.__vsimHost);
    const st = await page.evaluate(async () => { window.__mine = await window.__vsimModule.mount(window.__vsimHost, { lang: 'en', debug: true, loadTimeoutMs: 1500 }); return window.__mine.getState(); });
    expect(st).toMatchObject({ state: 'fallback', fallbackReason: 'load-timeout' });
    await expect(page.locator('.vsim-loading')).toBeHidden();
    const again = page.locator('.vsim-fallback [data-vsim-reload]');
    await expect(again).toBeVisible();
    await expect(page.locator('.vsim-fallback svg[role="img"]')).toBeVisible();
    release();
    await again.click();
    await expect.poll(() => page.evaluate(() => window.__mine.getState().state), { timeout: 30_000 }).toBe('ready');
    await expect(page.locator('.vsim canvas')).toHaveCount(1);
  });
});

test.describe('lens categories change the rendered picture', () => {
  test('all five categories render differently; toric corrects the astigmatism the others keep', async ({ page }) => {
    await openHarness(page, 'lang=en&cyl=1.5&axis=90&d=0.65');
    const stats = {};
    for (const lens of ['monofocal', 'enhanced', 'edof', 'trifocal', 'toric']) {
      await page.evaluate((l) => window.__vsim.setLens(l), lens);
      stats[lens] = await page.evaluate(() => window.__visionSim.sample());
    }
    const keys = Object.values(stats).map((s) => `${s.mean.toFixed(2)}|${s.edgeEnergy.toFixed(3)}`);
    expect(new Set(keys).size, JSON.stringify(stats)).toBe(5);
    // far, with 1.5 D of corneal astigmatism (axis 90: blur across vertical edges, which the readback's horizontal
    // gradient measures): the toric version is sharper than the same design without it
    await page.evaluate(() => window.__vsim.setDistance(6));
    const edge = {};
    for (const lens of ['monofocal', 'toric', 'edof', 'edof-toric']) {
      await page.evaluate((l) => window.__vsim.setLens(l), lens);
      edge[lens] = (await page.evaluate(() => window.__visionSim.sample({ x: 0.3, y: 0.55, w: 0.6, h: 0.4 }))).edgeEnergy;
    }
    expect(edge.toric).toBeGreaterThan(edge.monofocal * 1.05);
    expect(edge['edof-toric']).toBeGreaterThan(edge.edof * 1.05);
  });

  test('a lens change cross-fades on screen but the finished frame is deterministic', async ({ page }) => {
    await openHarness(page, 'lang=en&d=0.4');
    const a = await page.evaluate(() => window.__visionSim.sample());
    await page.evaluate(() => window.__vsim.setLens('trifocal'));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.__vsim.setLens('monofocal'));
    const b = await page.evaluate(() => window.__visionSim.sample());
    expect(b).toEqual(a);
  });
});
