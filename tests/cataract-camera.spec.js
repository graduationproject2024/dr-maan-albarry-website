// Cataract simulator — camera pass (2026-11) and Before / After. Runs against the harness page
// /cataract-sim-preview.html ({ debug: true }: window.__csim = controller, window.__cataractSim = live objects).
// See docs/implementation/phase-2-final-closure/08_SURGICAL_SIMULATOR_CAMERA_QA.md (cataract section) and
// 10_BEFORE_AFTER_VERIFICATION.md.
import { test, expect } from '@playwright/test';

const PAGE = 'cataract-sim-preview.html';
const DUR = [9, 8, 8, 10, 12, 12, 9];
const TOTAL = DUR.reduce((a, b) => a + b, 0);
const START = DUR.map((_, i) => DUR.slice(0, i).reduce((a, b) => a + b, 0));
const at = (i, p) => (START[i] + DUR[i] * p) / TOTAL;
const GLOBE = { c: [0, 0, -9.05], r: 11.5 }; // sclera sphere (anatomy.js: scleraR, scleraCenterZ)

let errors;
test.beforeEach(({ page }) => {
  errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
});
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

async function open(page, query) {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready', null, { timeout: 30_000 });
}
const S = (page) => page.evaluate(() => window.__csim.getState());
const cam = async (page) => (await S(page)).camera;
const settled = (page) => expect.poll(async () => { const s = await S(page); return !s.camera.moving && s.state !== 'transitioning'; }, { timeout: 8000 }).toBe(true);
function sameCamera(a, b, msg) {
  expect(a.distance, `${msg}: distance`).toBeCloseTo(b.distance, 3);
  expect(a.azimuth, `${msg}: azimuth`).toBeCloseTo(b.azimuth, 3);
  expect(a.polar, `${msg}: polar`).toBeCloseTo(b.polar, 3);
  a.target.forEach((v, k) => expect(v, `${msg}: target[${k}]`).toBeCloseTo(b.target[k], 3));
}
async function moveView(page) {
  const box = await page.locator('.csim canvas').boundingBox();
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.4, { steps: 8 });
  await page.mouse.up();
  await page.locator('[data-ref="zoomIn"]').click();
  await expect.poll(async () => (await cam(page)).userMoved).toBe(true);
}

test.describe('cataract camera — desktop 1440x900', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('every stage: one deterministic camera after a stage choice, a seek from a moved view and Reset view', async ({ page }) => {
    test.setTimeout(90_000);
    await open(page, 'lang=en&reduced=0');
    expect((await S(page)).labels).toBe(false); // labels stay hidden by default
    for (let i = 0; i < DUR.length; i++) {
      await page.evaluate((k) => window.__csim.goToStage(k), i);
      await settled(page);
      const ref = await cam(page);
      expect(ref.preset).toBe(`stage:${i}`);
      expect(ref.fit, `stage ${i} has a fitted camera`).toHaveLength(2);
      expect(ref.userMoved).toBe(false);
      expect(ref.fov).toBe(32);
      // seek inside the stage from a turned and zoomed view: back on the stage camera
      await moveView(page);
      await page.evaluate((t) => window.__csim.seek(t), at(i, 0.6));
      await settled(page);
      const c1 = await cam(page);
      sameCamera(c1, ref, `stage ${i} after seek`);
      expect(c1.userMoved).toBe(false);
      // Reset view after moving
      await moveView(page);
      await page.locator('[data-ref="resetView"]').click();
      await settled(page);
      sameCamera(await cam(page), ref, `stage ${i} after Reset view`);
      // a seek from another stage lands on the same camera
      await page.evaluate((t) => window.__csim.seek(t), at((i + 3) % DUR.length, 0.5));
      await settled(page);
      await page.evaluate((t) => window.__csim.seek(t), at(i, 0.3));
      await settled(page);
      sameCamera(await cam(page), ref, `stage ${i} after a seek from another stage`);
    }
    // Restart returns to stage 1's camera; a structure focus is left by a seek
    await page.evaluate(() => window.__csim.goToStage(0));
    await settled(page);
    const first = await cam(page);
    await page.evaluate(() => window.__csim.goToStage(4));
    await settled(page);
    await page.locator('[data-ref="restart"]').click();
    await page.evaluate(() => window.__csim.pause());
    await settled(page);
    sameCamera(await cam(page), first, 'after Restart');
    await page.locator('[data-structure="iris"]').click();
    await settled(page);
    expect((await cam(page)).preset).toBe('structure:iris');
    await page.evaluate((t) => window.__csim.seek(t), at(0, 0.5));
    await settled(page);
    sameCamera(await cam(page), first, 'seek after a structure focus');
    expect((await S(page)).focus).toBeNull();
  });

  test('zoom and orbit limits: relative to the fit, never inside the globe, no flips', async ({ page }) => {
    test.setTimeout(60_000);
    await open(page, 'lang=en&reduced=1');
    for (const i of [0, 3, 6]) {
      await page.evaluate((k) => window.__csim.goToStage(k), i);
      const c0 = await cam(page);
      expect(c0.minR).toBeGreaterThanOrEqual(11);
      expect(c0.minR).toBeLessThanOrEqual(c0.base);
      expect(c0.maxR).toBeGreaterThanOrEqual(Math.max(80, c0.base * 1.4));
      for (let k = 0; k < 30; k++) await page.locator('[data-ref="zoomIn"]').click();
      await expect.poll(async () => (await cam(page)).distance).toBeCloseTo(c0.minR, 2);
      // extreme orbit at the closest distance: the camera stays outside the globe and never flips
      const box = await page.locator('.csim canvas').boundingBox();
      const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      for (const [dx, dy] of [[3000, 0], [0, 3000], [-6000, 0], [0, -6000]]) {
        await page.mouse.move(cx, cy); await page.mouse.down();
        await page.mouse.move(cx + dx, cy + dy, { steps: 16 }); await page.mouse.up();
        await page.waitForTimeout(250);
        const r = await page.evaluate(([g]) => {
          const c = window.__cataractSim.camera; c.updateMatrixWorld();
          const e = c.matrixWorld.elements; // column 1 = camera up in world space
          const s = window.__csim.getState().camera;
          return { inGlobe: Math.hypot(c.position.x - g.c[0], c.position.y - g.c[1], c.position.z - g.c[2]) - g.r, upY: e[5], polar: s.polar, az: s.azimuth, d: s.distance, min: s.minR };
        }, [GLOBE]);
        expect(r.inGlobe, `stage ${i}: camera ≥ 1 mm outside the globe`).toBeGreaterThanOrEqual(1);
        expect(r.upY, 'screen-up stays world-up').toBeGreaterThan(0.3);
        expect(r.polar).toBeGreaterThanOrEqual(0.3999);
        expect(r.polar).toBeLessThanOrEqual(Math.PI - 0.3999);
        expect(Math.abs(r.az)).toBeLessThanOrEqual(1.5001);
        expect(r.d).toBeGreaterThanOrEqual(r.min - 0.01);
      }
      for (let k = 0; k < 40; k++) await page.locator('[data-ref="zoomOut"]').click();
      await expect.poll(async () => (await cam(page)).distance).toBeCloseTo((await cam(page)).maxR, 2);
      await page.locator('[data-ref="resetView"]').click();
      sameCamera(await cam(page), { ...c0 }, `stage ${i} reset after limits`);
    }
  });

  test('a resize re-fits a camera still on its preset, keeps a visitor-moved view and moves the zoom limits', async ({ page }) => {
    await open(page, 'lang=en&reduced=1');
    await page.evaluate(() => window.__csim.goToStage(0));
    const wide = await cam(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(async () => (await cam(page)).view[0]).toBeLessThan(400);
    const narrow = await cam(page);
    expect(narrow.distance).toBeGreaterThan(wide.distance * 1.2); // the whole eye still fits the narrow view
    expect(narrow.distance).toBeCloseTo(narrow.base, 3);
    expect(narrow.maxR).toBeGreaterThan(narrow.base);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect.poll(async () => (await cam(page)).view[0]).toBeGreaterThan(600);
    sameCamera(await cam(page), wide, 'back to the desktop size');
    await page.locator('[data-ref="zoomIn"]').click();
    const moved = await cam(page);
    expect(moved.userMoved).toBe(true);
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect.poll(async () => (await cam(page)).base).not.toBeCloseTo(moved.base, 2);
    const kept = await cam(page);
    expect(kept.distance).toBeCloseTo(moved.distance, 3);
    expect(kept.userMoved).toBe(true);
  });
});

// The free area the camera frames into, checked against the real DOM boxes of the overlaid controls (independent of
// the simulator's own numbers): no overlap, ≥ 40 % of each dimension left, the target at its middle and the four corners
// of every stage's subject box inside it. Light-ray stages are checked with the caption showing.
for (const [lang, w, h] of [['en', 390, 844], ['ar', 390, 844], ['en', 844, 390], ['ar', 844, 390], ['en', 1440, 900], ['ar', 1440, 900]]) {
  test.describe(`cataract camera framing ${lang} ${w}x${h}`, () => {
    const phone = w < 1000;
    test.use({ viewport: { width: w, height: h }, ...(phone ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}) });
    test('every stage keeps its target and its whole subject box clear of the controls', async ({ page }) => {
      test.setTimeout(60_000);
      await open(page, `lang=${lang}&reduced=1`);
      if (phone) await expect(page.locator('[data-ref="touch"]')).toBeVisible();
      for (let i = 0; i < DUR.length; i++) {
        await page.evaluate(([k, t]) => { window.__csim.goToStage(k); window.__csim.seek(t); }, [i, at(i, 0.9)]);
        await page.waitForTimeout(120);
        const r = await page.evaluate(() => {
          const st = window.__csim.getState();
          const c = window.__cataractSim.camera;
          c.updateMatrixWorld();
          const host = document.querySelector('.csim-canvas-host').getBoundingClientRect();
          const T = new c.position.constructor(...st.camera.target);
          const e = c.matrixWorld.elements;
          const right = new c.position.constructor(e[0], e[1], e[2]), up = new c.position.constructor(e[4], e[5], e[6]);
          const proj = (v) => { const p = v.clone().project(c); return [(p.x + 1) / 2 * host.width, (1 - p.y) / 2 * host.height]; };
          const [hw, hh] = st.camera.fit;
          const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([a, b]) => proj(T.clone().addScaledVector(right, a * hw).addScaledVector(up, b * hh)));
          const box = (sel) => { const el = document.querySelector(sel); if (!el || el.hidden || !el.offsetParent) return null; const q = el.getBoundingClientRect(); return { l: q.left - host.left, t: q.top - host.top, r: q.right - host.left, b: q.bottom - host.top }; };
          return { s: st.camera.safe, view: st.camera.view, centre: proj(T), corners, controls: { tools: box('.csim-viewtools'), chip: box('.csim-chip'), rayNote: box('.csim-raynote') }, rays: !document.querySelector('.csim-raynote').hidden, dir: document.querySelector('.csim').dir };
        });
        const [vw, vh] = r.view;
        const fr = { l: r.s.l, t: r.s.t, r: vw - r.s.r, b: vh - r.s.b };
        const msg = `${lang} ${w}x${h} stage ${i + 1}`;
        expect(r.dir).toBe(lang === 'ar' ? 'rtl' : 'ltr');
        expect(fr.r - fr.l, `${msg}: free width`).toBeGreaterThanOrEqual(vw * 0.4);
        expect(fr.b - fr.t, `${msg}: free height`).toBeGreaterThanOrEqual(vh * 0.4);
        if (i === 0 || i === 6) expect(r.rays, `${msg}: light-path caption shown`).toBe(true);
        for (const [k, c] of Object.entries(r.controls)) {
          if (!c) continue;
          const overlap = c.l < fr.r - 0.5 && fr.l < c.r - 0.5 && c.t < fr.b - 0.5 && fr.t < c.b - 0.5;
          expect(overlap, `${msg}: free area overlaps ${k} ${JSON.stringify(c)} vs ${JSON.stringify(fr)}`).toBe(false);
          expect(c.l >= -0.5 && c.t >= -0.5 && c.r <= vw + 0.5 && c.b <= vh + 0.5, `${msg}: ${k} inside the viewer ${JSON.stringify(c)}`).toBe(true);
        }
        expect(r.centre[0], `${msg}: target x centred`).toBeCloseTo((fr.l + fr.r) / 2, 0);
        expect(r.centre[1], `${msg}: target y centred`).toBeCloseTo((fr.t + fr.b) / 2, 0);
        for (const [x, y] of r.corners) {
          expect(x >= fr.l - 1.5 && x <= fr.r + 1.5 && y >= fr.t - 1.5 && y <= fr.b + 1.5, `${msg}: subject corner ${x.toFixed(1)},${y.toFixed(1)} in ${JSON.stringify(fr)}`).toBe(true);
        }
      }
    });
  });
}

// ---- Before / After ----
const CMP = {
  en: { before: 'the natural lens has become clouded', after: 'glasses may still be needed for some distances', group: 'Before and after' },
  ar: { before: 'أصبحت العدسة الطبيعية معتمة', after: 'وقد تبقى الحاجة إلى النظارة لبعض المسافات', group: 'قبل وبعد' }
};
for (const [w, h] of [[1440, 900], [390, 844]]) {
  test.describe(`cataract Before / After ${w}x${h}`, () => {
    const phone = w < 1000;
    test.use({ viewport: { width: w, height: h }, ...(phone ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}) });
    for (const lang of ['en', 'ar']) {
      test(`${lang}: toggles two moments from one identical camera, with the wording, and leaves cleanly`, async ({ page }) => {
        await open(page, `lang=${lang}&reduced=0`);
        const before = page.locator('.csim-ba-btn[data-value="before"]'), after = page.locator('.csim-ba-btn[data-value="after"]');
        await expect(page.locator('.csim-ba')).toHaveAttribute('aria-label', CMP[lang].group);
        await expect(page.locator('.csim-ba-text')).toBeHidden();
        for (const b of [before, after]) {
          const bb = await b.boundingBox();
          expect(bb.height).toBeGreaterThanOrEqual(44);
          expect(bb.width).toBeGreaterThanOrEqual(44);
        }
        await before.click();
        await settled(page);
        let s = await S(page);
        expect(s).toMatchObject({ compare: 'before', stageIndex: 0, state: 'paused', playing: false });
        expect(s.camera.preset).toBe('compare');
        const pB = await page.evaluate(() => { const P = window.__cataractSim.params; return { cataract: P.cataract, iol: !!P.iol, scatter: P.scatterRays, focus: P.focusRays, highlight: P.highlight }; });
        expect(pB).toEqual({ cataract: 1, iol: false, scatter: 1, focus: 0, highlight: [] });
        await expect(before).toHaveAttribute('aria-pressed', 'true');
        await expect(after).toHaveAttribute('aria-pressed', 'false');
        await expect(page.locator('.csim-ba-text')).toContainText(CMP[lang].before);
        await expect(page.locator('.csim-overlay--start')).toBeHidden();
        const camB = s.camera;
        // keyboard: Tab-reachable native button, Enter activates
        await after.focus();
        await page.keyboard.press('Enter');
        await settled(page);
        s = await S(page);
        expect(s).toMatchObject({ compare: 'after', stageIndex: 6, state: 'paused' });
        const pA = await page.evaluate(() => { const P = window.__cataractSim.params; return { iol: !!P.iol, fold: P.iol && P.iol.fold, focus: P.focusRays, scatter: P.scatterRays, highlight: P.highlight }; });
        expect(pA).toMatchObject({ iol: true, focus: 1, scatter: 0, highlight: [] });
        expect(pA.fold).toBeLessThan(1e-3);
        sameCamera(s.camera, camB, 'After uses the Before camera');
        expect(s.camera.safe).toEqual(camB.safe);
        await expect(after).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.csim-ba-text')).toContainText(CMP[lang].after);
        // both views equal the first stage's own camera
        await page.evaluate(() => window.__csim.goToStage(0));
        await settled(page);
        s = await S(page);
        expect(s.compare).toBeNull();
        await expect(page.locator('.csim-ba-text')).toBeHidden();
        sameCamera(s.camera, camB, 'stage 1 camera = comparison camera');
        // a moved view is restored by Reset view inside the comparison; language switch keeps it and translates
        await before.click();
        await settled(page);
        await page.locator('[data-ref="zoomIn"]').click();
        await page.locator('[data-ref="resetView"]').click();
        await settled(page);
        sameCamera(await cam(page), camB, 'Reset view in the comparison');
        const other = lang === 'en' ? 'ar' : 'en';
        await page.evaluate((l) => window.__csim.setLang(l), other);
        await expect(page.locator('.csim-ba-text')).toContainText(CMP[other].before);
        expect((await S(page)).compare).toBe('before');
        // Play leaves the comparison
        await page.locator('[data-ref="playPause"]').click();
        await expect.poll(async () => (await S(page)).compare).toBeNull();
        await expect(before).toHaveAttribute('aria-pressed', 'false');
        await page.evaluate(() => window.__csim.pause());
        // a seek leaves it too and lands on that stage's camera
        await after.click();
        await settled(page);
        await page.evaluate((t) => window.__csim.seek(t), at(6, 0.5));
        await settled(page);
        s = await S(page);
        expect(s.compare).toBeNull();
        expect(s.camera.preset).toBe('stage:6');
        expect(await page.evaluate(() => window.__cataractSimCounters.rafLoops)).toBe(1);
      });
    }
  });
}

test('Before / After is hidden when the 3D view is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) { if (/webgl/i.test(String(type))) return null; return orig.call(this, type, ...rest); };
  });
  await page.goto(`${PAGE}?lang=en`);
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'fallback', null, { timeout: 30_000 });
  await expect(page.locator('.csim-ba')).toBeHidden();
  await page.evaluate(() => window.__csim.compare('after'));
  expect((await S(page)).compare).toBeNull();
});

test.describe('cataract camera — desktop 1440x900 (input and redraw)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('panning the target towards the globe centre never lets the camera within 1 mm of the globe', async ({ page }) => {
    await open(page, 'lang=en&reduced=1');
    for (const i of [0, 6, 3]) {
      await page.evaluate((k) => window.__csim.goToStage(k), i);
      for (let k = 0; k < 30; k++) await page.locator('[data-ref="zoomIn"]').click();
      const box = await page.locator('.csim canvas').boundingBox();
      const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      // right-button drag pans (OrbitControls); then orbit hard to the side at the closest distance
      for (const [dx, dy] of [[600, 0], [0, 500], [-1200, -900]]) {
        await page.mouse.move(cx, cy); await page.mouse.down({ button: 'right' });
        await page.mouse.move(cx + dx, cy + dy, { steps: 12 }); await page.mouse.up({ button: 'right' });
        await page.mouse.move(cx, cy); await page.mouse.down();
        await page.mouse.move(cx + 2500, cy - dy, { steps: 12 }); await page.mouse.up();
        await page.waitForTimeout(300);
        const gap = await page.evaluate(([g]) => { const c = window.__cataractSim.camera.position; return Math.hypot(c.x - g.c[0], c.y - g.c[1], c.z - g.c[2]) - g.r; }, [GLOBE]);
        expect(gap, `stage ${i + 1} after pan ${dx},${dy}`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test('a plain click on the canvas does not count as a moved view; a drag does', async ({ page }) => {
    await open(page, 'lang=en&reduced=1');
    await page.evaluate(() => window.__csim.goToStage(2));
    const box = await page.locator('.csim canvas').boundingBox();
    await page.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.5);
    await page.waitForTimeout(300);
    expect((await cam(page)).userMoved).toBe(false);
    // a re-fit after the click still re-fits (the view is not the visitor's)
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect.poll(async () => (await cam(page)).view[0]).toBeLessThan(860);
    const c = await cam(page);
    expect(c.userMoved).toBe(false);
    expect(c.distance).toBeCloseTo(c.base, 3);
    await moveView(page);
    expect((await cam(page)).userMoved).toBe(true);
  });

  // Regression (camera pass 2026-11): a paused seek inside the same stage, and a review frame step, changed the scene
  // state without asking for a new frame, so the canvas kept showing the previous moment (IOL / injector missing).
  test('a paused seek and a review frame step each draw a new frame', async ({ page }) => {
    await open(page, 'lang=en&reduced=1&review=1');
    await page.evaluate((t) => window.__csim.seek(t), at(5, 0.1));
    const idle = async () => {
      let prev = -1;
      await expect.poll(async () => { const f = await page.evaluate(() => window.__cataractSim.frames); const same = f === prev; prev = f; return same; }, { timeout: 10_000, intervals: [400] }).toBe(true);
      return prev;
    };
    const f0 = await idle();
    await page.evaluate((t) => window.__csim.seek(t), at(5, 0.55));
    await expect.poll(() => page.evaluate(() => window.__cataractSim.frames)).toBeGreaterThan(f0);
    const shown = await page.evaluate(() => ({ iol: !!window.__cataractSim.params.iol, calls: window.__cataractSim.info().calls }));
    expect(shown.iol).toBe(true);
    const f1 = await idle();
    expect(await page.evaluate(() => window.__cataractSim.info().calls)).toBe(shown.calls); // the drawn frame is the new moment
    await page.evaluate(() => window.__cataractSim.step(15));
    await expect.poll(() => page.evaluate(() => window.__cataractSim.frames)).toBeGreaterThan(f1);
    const f2 = await idle();
    await page.locator('.csim-review [data-r="stepFwd"]').click();
    await expect.poll(() => page.evaluate(() => window.__cataractSim.frames)).toBeGreaterThan(f2);
  });

  test('Before / After under reduced motion: instant, identical camera, one announcement; a structure leaves it', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, 'lang=en');
    expect((await S(page)).reducedMotion).toBe(true);
    const live = page.locator('.csim-sr');
    const said = [];
    await page.exposeFunction('__said', (t) => said.push(t));
    await page.evaluate(() => new MutationObserver(() => { const t = document.querySelector('.csim-sr').textContent; if (t) window.__said(t); }).observe(document.querySelector('.csim-sr'), { childList: true, characterData: true, subtree: true }));
    await page.evaluate(() => window.__csim.compare('before'));
    let s = await S(page);
    expect(s.camera.moving).toBe(false); // no flight with reduced motion
    expect(s).toMatchObject({ compare: 'before', stageIndex: 0, state: 'paused' });
    const camB = s.camera;
    await page.locator('.csim-ba-btn[data-value="after"]').click();
    s = await S(page);
    expect(s.camera.moving).toBe(false);
    expect(s).toMatchObject({ compare: 'after', stageIndex: 6, state: 'paused' });
    sameCamera(s.camera, camB, 'reduced-motion After = Before camera');
    await expect(live).toHaveText(/glasses may still be needed/);
    await page.waitForTimeout(300);
    // the stage change to 7/7 is not announced on top of the comparison caption
    expect(said.filter((t) => /^Stage \d of 7/.test(t))).toEqual([]);
    expect(said.filter((t) => /^After:/.test(t))).toHaveLength(1);
    // choosing a structure leaves the comparison
    await page.locator('[data-structure="iol"]').click();
    s = await S(page);
    expect(s.compare).toBeNull();
    expect(s.camera.preset).toBe('structure:iol');
    await expect(page.locator('.csim-ba-btn[data-value="after"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.csim-ba-text')).toBeHidden();
  });
});

// The phone tool row wraps 4 + 3 below 388 px screens (a single row of seven 44 px tools does not fit the viewer).
for (const [w, h, lang] of [[360, 740, 'ar'], [375, 812, 'en']]) {
  test(`${w}×${h} ${lang}: the view tools wrap 4 + 3 inside the viewer, every tool reachable and ≥ 44 px`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(lang === 'en' ? '/en/surgical-education/' : '/surgical-education/');
    await page.locator('#cataract-3d-start').click();
    await expect(page.locator('#cataract-3d-stage .csim[data-state="ready"]')).toHaveCount(1, { timeout: 30_000 });
    // the viewer just under the fixed site header (the booking bar at the bottom must not cover the tools)
    await page.evaluate(() => { const hd = document.getElementById('site-header'); const v = document.querySelector('#cataract-3d-stage .csim-viewport'); scrollBy(0, v.getBoundingClientRect().top - (hd ? hd.getBoundingClientRect().bottom : 0) - 4); });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const vp = document.querySelector('#cataract-3d-stage .csim-viewport').getBoundingClientRect();
      const tools = [...document.querySelectorAll('#cataract-3d-stage .csim-viewtools .csim-tool')].filter((b) => b.offsetParent);
      return {
        overflowX: document.documentElement.scrollWidth - innerWidth,
        n: tools.length,
        rows: new Set(tools.map((b) => Math.round(b.getBoundingClientRect().top))).size,
        tools: tools.map((b) => { const q = b.getBoundingClientRect(); const hit = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { w: q.width, h: q.height, inside: q.left >= vp.left - 0.5 && q.right <= vp.right + 0.5 && q.top >= vp.top - 0.5 && q.bottom <= vp.bottom + 0.5, hit: !!hit && (hit === b || b.contains(hit)) }; })
      };
    });
    expect(r.overflowX).toBeLessThanOrEqual(0);
    expect(r.n).toBe(7); // zoom in / out, reset, labels, cross-section, full screen, Explore 3D
    expect(r.rows).toBe(2);
    for (const [k, t] of r.tools.entries()) {
      expect(t.w, `tool ${k} width`).toBeGreaterThanOrEqual(44);
      expect(t.h, `tool ${k} height`).toBeGreaterThanOrEqual(44);
      expect(t.inside, `tool ${k} inside the viewer`).toBe(true);
      expect(t.hit, `tool ${k} reachable (not covered)`).toBe(true);
    }
    // the framing leaves the wrapped tools out of the free area, and Explore 3D still works from the second row
    const s = await page.evaluate(() => { const vp = document.querySelector('#cataract-3d-stage .csim-viewport'); const t = vp.querySelector('.csim-viewtools').getBoundingClientRect(); return { top: t.top - vp.getBoundingClientRect().top, h: vp.clientHeight }; });
    expect(s.top).toBeGreaterThan(s.h / 2);
    await page.locator('#cataract-3d-stage [data-ref="touch"]').tap();
    await expect(page.locator('#cataract-3d-stage [data-ref="touch"]')).toHaveAttribute('aria-pressed', 'true');
    await ctx.close();
  });
}
