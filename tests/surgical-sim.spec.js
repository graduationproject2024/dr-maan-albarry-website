// Procedure simulators (src/surgical-sim): the shared engine exercised on every procedure page that hosts one.
// Lifecycle, playback, deterministic seeking, stages, techniques, toggles, language, cleanup, WebGL fallback, keyboard,
// phone layout and accessibility — plus procedure-specific checks of what each model must show.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SLUGS = ['lens-implants', 'icl', 'laser-vision-correction', 'keratoconus-cxl', 'corneal-transplant', 'intravitreal-injections'];

async function open(page, slug, { lang = 'en', width = 1366, height = 900, theme = 'light' } = {}) {
  await page.setViewportSize({ width, height });
  await page.addInitScript(([t]) => { try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ } }, [theme]);
  await page.goto(lang === 'en' ? `/en/procedures/${slug}/` : `/procedures/${slug}/`);
  const before = await page.evaluate(() => performance.getEntriesByType('resource').filter((r) => /surgical-sim|procedures\/(iol|icl|laser|keratoconus|corneal|intravitreal)/.test(r.name)).length);
  expect(before, 'nothing 3D downloads before Start').toBe(0);
  await page.locator('#procedure-3d-start').click();
  await expect(page.locator('#procedure-3d')).toHaveAttribute('data-state', 'active', { timeout: 25_000 });
  await expect.poll(() => page.evaluate(() => window.__procedureSim && window.__procedureSim.getState().state), { timeout: 25_000 }).toBe('ready');
}
const S = (page) => page.evaluate(() => window.__procedureSim.getState());
const errorsOf = (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return errors;
};

for (const slug of SLUGS) {
  test.describe(`simulator ${slug}`, () => {
    test('loads on demand, plays, pauses, seeks deterministically and visits every stage', async ({ page }) => {
      const errors = errorsOf(page);
      await open(page, slug);
      await expect(page.locator('#procedure-3d-stage canvas')).toHaveCount(1);
      const st0 = await S(page);
      expect(st0.procedure).toBe(slug);
      expect(st0.stageCount).toBeGreaterThan(2);
      expect(st0.render.triangles).toBeGreaterThan(1000); // a real 3D scene, not a picture

      // play advances, pause freezes
      await page.locator('.ssim-play').click();
      await expect.poll(async () => (await S(page)).elapsed, { timeout: 5000 }).toBeGreaterThan(0.5);
      await page.locator('.ssim-play').click();
      const paused = await S(page);
      expect(paused.playing).toBe(false);
      await page.waitForTimeout(700);
      expect((await S(page)).elapsed).toBe(paused.elapsed);

      // seeking reproduces the same scene state
      const at = async (t) => { await page.evaluate((x) => window.__procedureSim.seek(x), t); return (await S(page)).probe; };
      const a = await at(0.63);
      await at(0.1); await at(0.95);
      expect(await at(0.63)).toEqual(a);

      // every stage, by list and by next/previous, for every technique
      const variants = await page.locator('[data-variant]').evaluateAll((els) => els.map((e) => e.dataset.variant));
      for (const v of variants.length ? variants : [null]) {
        if (v) { await page.locator(`[data-variant="${v}"]`).click(); expect((await S(page)).variant).toBe(v); }
        const n = (await S(page)).stageCount;
        const seen = new Set();
        for (let i = 0; i < n; i++) {
          await page.locator('.ssim-stage').nth(i).click();
          const st = await S(page);
          expect(st.stageIndex).toBe(i);
          seen.add(st.stageId);
          await expect(page.locator('.ssim-now-n')).toContainText(`${i + 1}`);
        }
        expect(seen.size).toBe(n);
        await page.locator('[data-act="prev"]').click();
        expect((await S(page)).stageIndex).toBe(n - 2);
        await page.locator('[data-act="next"]').click();
        expect((await S(page)).stageIndex).toBe(n - 1);
      }
      expect(errors).toEqual([]);
    });

    test('camera, section, toggles, reset and review metadata', async ({ page }) => {
      const errors = errorsOf(page);
      await open(page, slug);
      const cam0 = (await S(page)).camera;
      // drag rotates
      const box = await page.locator('.ssim-canvas-host canvas').boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 30, { steps: 6 }); await page.mouse.up();
      expect((await S(page)).camera.theta).not.toBeCloseTo(cam0.theta, 2);
      // zoom buttons
      const r0 = (await S(page)).camera.r;
      await page.locator('[data-act="zoomIn"]').click();
      expect((await S(page)).camera.r).toBeLessThan(r0);
      // cross-section on / off
      await page.locator('[data-act="section"]').click();
      const sec = (await S(page)).section;
      await page.locator('[data-act="section"]').click();
      expect((await S(page)).section).toBe(!sec);
      // every toggle flips its state
      const toggles = await page.locator('[data-toggle]').evaluateAll((els) => els.map((e) => e.dataset.toggle));
      for (const t of toggles) {
        const before = (await S(page)).toggles[t];
        await page.locator(`[data-toggle="${t}"]`).click();
        expect((await S(page)).toggles[t]).toBe(!before);
      }
      // camera presets
      const cams = await page.locator('[data-cam]').count();
      expect(cams).toBeGreaterThan(1);
      // reset restores the start
      await page.locator('.ssim-stage').last().click();
      await page.locator('[data-act="reset"]').click();
      const r = await S(page);
      expect(r.stageIndex).toBe(0); expect(r.progress).toBe(0); expect(r.playing).toBe(false);
      for (const t of toggles) expect(typeof r.toggles[t]).toBe('boolean');
      // review metadata: versioned, sourced, clinically pending
      const meta = await page.evaluate(() => window.__procedureSim.getReviewMetadata());
      expect(meta.modelId).toMatch(/^ssim-/);
      expect(meta.version).toMatch(/^\d{4}\.\d{2}-r\d+$/);
      expect(meta.clinicalStatus).toBe('pending');
      expect(meta.sources.length).toBeGreaterThan(0);
      expect(meta.simplifications.length).toBeGreaterThan(2);
      for (const s of meta.stages) { expect(s.title.ar).toBeTruthy(); expect(s.title.en).toBeTruthy(); expect(s.text.ar).toBeTruthy(); expect(s.text.en).toBeTruthy(); }
      expect(errors).toEqual([]);
    });

    test('language and theme switch keep the same scene; close and reopen leave one canvas', async ({ page }) => {
      const errors = errorsOf(page);
      await open(page, slug);
      await page.evaluate(() => { document.querySelector('#procedure-3d-stage canvas').dataset.mark = '1'; });
      await page.evaluate(() => window.__procedureSim.setStage(1));
      await page.evaluate(() => window.toggleLang());
      await expect(page.locator('#procedure-3d-stage .ssim')).toHaveAttribute('lang', 'ar');
      await expect(page.locator('#procedure-3d-stage .ssim')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('#procedure-3d-stage canvas[data-mark="1"]')).toHaveCount(1);
      expect((await S(page)).stageIndex).toBe(1);
      await page.evaluate(() => window.toggleTheme && window.toggleTheme());
      await expect(page.locator('#procedure-3d-stage canvas')).toHaveCount(1);
      for (let k = 0; k < 4; k++) {
        await page.locator('.ssim-close').click();
        await expect(page.locator('#procedure-3d')).toHaveAttribute('data-state', 'idle');
        await expect(page.locator('#procedure-3d-stage canvas')).toHaveCount(0);
        await page.locator('#procedure-3d-start').click();
        await expect.poll(() => page.evaluate(() => window.__procedureSim && window.__procedureSim.getState().state), { timeout: 20_000 }).toBe('ready');
        await expect(page.locator('canvas')).toHaveCount(1);
      }
      expect(errors).toEqual([]);
    });
  });
}

test('without WebGL every simulator falls back to the full written stage list', async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/.test(type) ? null : orig.call(this, type, ...rest); };
  });
  for (const slug of SLUGS) {
    await page.goto(`/en/procedures/${slug}/`);
    await page.locator('#procedure-3d-start').click();
    await expect(page.locator('.ssim-fallback')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('.ssim-canvas-host canvas')).toHaveCount(0);
    const n = await page.locator('.ssim-stage').count();
    expect(n).toBeGreaterThan(2);
    await expect(page.locator('.ssim-stage-d').first()).toBeVisible();
    await page.locator('.ssim-stage').nth(n - 1).click();
    await expect(page.locator('.ssim-now-n')).toContainText(String(n));
  }
});

test('leaving the page destroys the viewer; another procedure gets a fresh one', async ({ page }) => {
  await open(page, 'icl');
  await page.goto('/en/procedures/keratoconus-cxl/');
  await expect(page.locator('#procedure-3d')).toHaveAttribute('data-state', 'idle');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.locator('#procedure-3d-start').click();
  await expect.poll(() => page.evaluate(() => window.__procedureSim && window.__procedureSim.getState().state === 'ready' ? window.__procedureSim.getState().procedure : null), { timeout: 20_000 }).toBe('keratoconus-cxl');
});

test('reduced motion: stage changes move the camera without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, 'lens-implants');
  await page.evaluate(() => window.__procedureSim.setStage(4));
  expect((await S(page)).camera.moving).toBe(false);
});

test('keyboard: start, play from the keyboard, step through stages', async ({ page }) => {
  await open(page, 'icl');
  await page.locator('.ssim-play').focus();
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await S(page)).playing).toBe(true);
  await page.keyboard.press('Enter');
  await page.locator('[data-act="next"]').focus();
  await page.keyboard.press('Enter');
  expect((await S(page)).stageIndex).toBe(1);
  await page.locator('.ssim-canvas-host canvas').focus();
  const t0 = (await S(page)).camera.theta;
  await page.keyboard.press('ArrowLeft');
  expect((await S(page)).camera.theta).not.toBe(t0);
});

for (const [w, h] of [[390, 844], [844, 390]]) {
  test(`phone ${w}x${h}: the model and its playback controls fit on one screen, no horizontal overflow`, async ({ page }) => {
    await open(page, 'laser-vision-correction', { width: w, height: h });
    await page.waitForTimeout(900);
    const geo = await page.evaluate(() => {
      const v = document.querySelector('.ssim-viewport').getBoundingClientRect();
      const p = document.querySelector('.ssim-play').getBoundingClientRect();
      return { vTop: v.top, vH: v.height, pBottom: p.bottom, ih: innerHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    expect(geo.sw).toBeLessThanOrEqual(geo.cw);
    expect(geo.vH).toBeGreaterThan(200);
    expect(geo.pBottom - geo.vTop).toBeLessThanOrEqual(geo.ih);
  });
}

test('accessibility: the open simulator has no axe violations (en and ar)', async ({ page }) => {
  for (const lang of ['en', 'ar']) {
    await open(page, 'corneal-transplant', { lang });
    const r = await new AxeBuilder({ page }).include('#procedure-3d').analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  }
});

// ---------- procedure-specific checks: what each model must show at the end of its key stages ----------
const probeAt = async (page, stageId, variant) => page.evaluate(([id, v]) => {
  const c = window.__procedureSim;
  if (v) c.setVariant(v);
  c.setStage(id);
  return c.getState().probe;
}, [stageId, variant]);

test('IOL: the natural lens is gone and the implant sits in the bag at the capsule equator', async ({ page }) => {
  await open(page, 'lens-implants');
  const start = await probeAt(page, 'natural');
  expect(start.lensVisible).toBe(true); expect(start.iolVisible).toBe(false);
  const p = await probeAt(page, 'position');
  expect(p.lensVisible).toBe(false); expect(p.iolVisible).toBe(true);
  expect(p.iolZ).toBeCloseTo(-1.5, 2); // EYE.lensEqZ: inside the capsular bag
  expect(p.collapse).toBe(1);
});

test('ICL: the natural lens stays, the ICL sits in front of it with a clearance, the iris rests on the ICL', async ({ page }) => {
  await open(page, 'icl');
  const p = await probeAt(page, 'result');
  expect(p.lensVisible).toBe(true);
  expect(p.iclApexZ).toBeGreaterThan(p.lensApexZ);
  expect(p.vault).toBeGreaterThan(0.2);
  expect(p.irisAboveIcl).toBe(true);
});

test('laser: LASIK, PRK and SMILE each thin the centre; flap only in LASIK; SMILE lenticule leaves through the opening', async ({ page }) => {
  await open(page, 'laser-vision-correction');
  for (const v of ['lasik', 'prk', 'smile']) {
    const end = await probeAt(page, 'result', v);
    expect(end.variant).toBe(v);
    expect(end.centralThickness).toBeLessThan(end.centralThicknessStart - 0.05);
    expect(end.flapAngle).toBe(0);
    if (v !== 'lasik') expect(end.flapVisible).toBe(false);
  }
  expect((await probeAt(page, 'lift', 'lasik')).flapAngle).toBeGreaterThan(1);
  expect((await probeAt(page, 'epithelium', 'prk')).epiAmount).toBe(1);
  expect((await probeAt(page, 'regrow', 'prk')).epiAmount).toBe(0);
  const rm = await probeAt(page, 'remove', 'smile');
  expect(rm.lenticuleOutside).toBe(true);
});

test('intravitreal: posterior anatomy; the needle enters behind the limbus into the vitreous; medicine appears only after it', async ({ page }) => {
  await open(page, 'intravitreal-injections');
  const back = await probeAt(page, 'back');
  expect(back.maculaPresent).toBe(true); expect(back.needleVisible).toBe(false); expect(back.medicineOpacity).toBe(0);
  const inj = await probeAt(page, 'injection');
  expect(inj.entryBehindLimbus).toBe(true);
  expect(inj.tipInsideGlobe).toBe(true);
  const spread = await probeAt(page, 'spread');
  expect(spread.medicineOpacity).toBeGreaterThan(0);
  expect((await probeAt(page, 'after')).needleVisible).toBe(false);
});

test('GPU context lost and restored: a notice while lost, then the viewer recovers and still works', async ({ page }) => {
  const errors = errorsOf(page);
  await open(page, 'corneal-transplant');
  for (let k = 0; k < 2; k++) {
    await page.evaluate(() => { const gl = document.querySelector('#procedure-3d-stage canvas').getContext('webgl2'); window.__lose = gl.getExtension('WEBGL_lose_context'); window.__lose.loseContext(); });
    await expect(page.locator('.ssim-notice')).toBeVisible();
    expect((await S(page)).state).toBe('error');
    await page.evaluate(() => window.__lose.restoreContext());
    await expect(page.locator('.ssim-notice')).toBeHidden({ timeout: 10_000 });
    await expect.poll(async () => (await S(page)).state).not.toBe('error');
  }
  await page.locator('.ssim-stage').nth(4).click();
  expect((await S(page)).stageIndex).toBe(4);
  await page.locator('.ssim-play').click();
  await expect.poll(async () => (await S(page)).playing).toBe(true);
  expect(errors.filter((e) => !/CONTEXT_LOST|context lost/i.test(e))).toEqual([]);
});

// ---------------- Cameras (2026-11 camera pass, 08_SURGICAL_SIMULATOR_CAMERA_QA.md) ----------------
// Every stage camera is a preset with a subject box (`fit`); the distance is fitted to the canvas and the overlaid
// controls. These checks run with reduced motion so each camera move lands at once.
const VARIANTS = { 'laser-vision-correction': ['lasik', 'prk', 'smile'], 'keratoconus-cxl': ['keratoconus', 'cxl'], 'corneal-transplant': ['pk', 'dalk', 'ek'] };
const camOf = (page) => page.evaluate(() => window.__procedureSim.getState().camera);
const settled = (page) => expect.poll(async () => (await camOf(page)).moving, { timeout: 5000 }).toBe(false);
const near = (a, b, msg) => {
  expect(a.r, msg).toBeCloseTo(b.r, 4); expect(a.theta, msg).toBeCloseTo(b.theta, 4); expect(a.phi, msg).toBeCloseTo(b.phi, 4);
  a.target.forEach((v, k) => expect(v, msg).toBeCloseTo(b.target[k], 4));
};

for (const slug of SLUGS) {
  test(`camera ${slug}: seeking lands on the same stage camera from any view; Reset view restores it`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, slug);
    for (const v of VARIANTS[slug] || [null]) {
      if (v) await page.evaluate((id) => window.__procedureSim.setVariant(id), v);
      const n = (await S(page)).stageCount;
      for (let i = 0; i < n; i++) {
        // path 1: from the start
        await page.evaluate(() => window.__procedureSim.seek(0));
        await page.evaluate((k) => window.__procedureSim.setStage(k), i);
        await settled(page);
        const a = await camOf(page);
        const prog = (await S(page)).progress;
        expect(a.preset, `${v} ${i}`).toBe(a.stagePreset);
        expect(a.fit, `${v} ${i}: every stage camera frames a subject`).toBeTruthy();
        // path 2: from the end, after the visitor turned and zoomed the view, then a seek into the same stage
        await page.evaluate(() => window.__procedureSim.seek(1));
        await page.locator('.ssim-canvas-host canvas').focus();
        await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowUp'); await page.keyboard.press('+');
        await page.evaluate((t) => window.__procedureSim.seek(t), prog);
        await settled(page);
        near(await camOf(page), a, `${slug} ${v} stage ${i} after seek`);
        // the visitor moves the view, then Reset view
        await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('-');
        expect((await camOf(page)).userMoved).toBe(true);
        await page.locator('[data-act="resetView"]').click();
        await settled(page);
        const b = await camOf(page);
        near(b, a, `${slug} ${v} stage ${i} reset view`);
        expect(b.userMoved).toBe(false);
      }
    }
    // Start again: the first stage's camera
    await page.locator('[data-act="reset"]').click();
    await settled(page);
    expect((await camOf(page)).preset).toBe((await camOf(page)).stagePreset);
  });
}

test('camera: zoom and orbit limits hold (no flip over the poles, no zooming into or far away from the subject)', async ({ page }) => {
  await open(page, 'icl');
  await page.evaluate(() => window.__procedureSim.setStage(4));
  await settled(page);
  const c0 = await camOf(page);
  await page.locator('.ssim-canvas-host canvas').focus();
  for (let k = 0; k < 40; k++) await page.keyboard.press('+');
  const zin = await camOf(page);
  expect(zin.r).toBeGreaterThanOrEqual(zin.minR - 1e-6);
  expect(zin.r).toBeCloseTo(zin.minR, 4);
  expect(zin.minR).toBeGreaterThan(c0.r * 0.4);
  for (let k = 0; k < 60; k++) await page.locator('[data-act="zoomOut"]').click();
  const zout = await camOf(page);
  expect(zout.r).toBeLessThanOrEqual(zout.maxR + 1e-6);
  expect(zout.maxR).toBeLessThan(c0.r * 3);
  await page.locator('.ssim-canvas-host canvas').focus();
  for (let k = 0; k < 40; k++) await page.keyboard.press('ArrowUp');
  expect((await camOf(page)).phi).toBeGreaterThanOrEqual(0.15 - 1e-6);
  for (let k = 0; k < 60; k++) await page.keyboard.press('ArrowDown');
  expect((await camOf(page)).phi).toBeLessThanOrEqual(Math.PI - 0.15 + 1e-6);
  // repeated full-height drags (mouse: vertical turning allowed) in both directions: the elevation stops at the limit,
  // the camera's up vector never turns over (no flip) and the azimuth stays wrapped
  const box = await page.locator('.ssim-canvas-host canvas').boundingBox();
  const cx = box.x + box.width / 2;
  for (const dir of [1, 1, 1, -1, -1, -1, -1, 1]) {
    const y0 = dir > 0 ? box.y + 10 : box.y + box.height - 10, y1 = dir > 0 ? box.y + box.height - 10 : box.y + 10;
    await page.mouse.move(cx - 150 * dir, y0); await page.mouse.down();
    await page.mouse.move(cx + 150 * dir, y1, { steps: 10 }); await page.mouse.up();
    const c = await camOf(page);
    expect(c.phi).toBeGreaterThanOrEqual(0.15 - 1e-6);
    expect(c.phi).toBeLessThanOrEqual(Math.PI - 0.15 + 1e-6);
    expect(Math.abs(c.theta)).toBeLessThanOrEqual(Math.PI + 1e-6);
    const upY = await page.evaluate(() => { const cam = window.__procedureSim._three.camera; cam.updateMatrixWorld(); return cam.matrixWorld.elements[5]; });
    expect(upY, 'screen up stays world up (no flip)').toBeGreaterThan(0);
  }
});

/**
 * Framing check for every procedure / technique / stage at one viewport and language. Independent of the engine's own
 * numbers: the free area it reports must not overlap the real DOM boxes of the tool rail, the stage chip, the details
 * button or the hint; the target must project to the middle of it; the four corners of the stage's subject box must
 * project inside it.
 */
async function checkFraming(page, { width, height, lang = 'en' }) {
  for (const slug of SLUGS) {
    await open(page, slug, { width, height, lang });
    for (const v of VARIANTS[slug] || [null]) {
      if (v) await page.evaluate((id) => window.__procedureSim.setVariant(id), v);
      const n = (await S(page)).stageCount;
      for (let i = 0; i < n; i++) {
        const res = await page.evaluate((k) => {
          const c = window.__procedureSim; c.setStage(k);
          const st = c.getState().camera, { camera } = c._three;
          camera.updateMatrixWorld();
          const V = camera.position.constructor;
          const right = new V().setFromMatrixColumn(camera.matrixWorld, 0), up = new V().setFromMatrixColumn(camera.matrixWorld, 1);
          const [hw, hh] = Array.isArray(st.fit) ? st.fit : [st.fit, st.fit];
          const [W, H] = st.view, s = st.safe;
          const px = (p) => { const q = p.clone().project(camera); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H]; };
          const t = new V(...st.target);
          const pts = [[0, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]].map(([a, b]) => px(t.clone().addScaledVector(right, a * hw).addScaledVector(up, b * hh)));
          const box = document.querySelector('.ssim-canvas-host').getBoundingClientRect();
          const ctrls = ['.ssim-viewtools', '.ssim-chip', '.ssim-details', '.ssim-hint'].map((sel) => {
            const el = document.querySelector(sel); const r = el && !el.hidden ? el.getBoundingClientRect() : null;
            return r && r.width && r.height ? { sel, l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top } : null;
          }).filter(Boolean);
          return { pts, s, W, H, ctrls, moving: st.moving, cw: box.width, ch: box.height };
        }, i);
        const tag = `${lang} ${width}x${height} ${slug} ${v} ${i}`;
        expect(res.moving, tag).toBe(false);
        expect(Math.abs(res.W - res.cw), `${tag} view size`).toBeLessThan(1.5);
        expect(Math.abs(res.H - res.ch), `${tag} view size`).toBeLessThan(1.5);
        const free = { l: res.s.l, r: res.W - res.s.r, t: res.s.t, b: res.H - res.s.b };
        expect(free.r - free.l, `${tag} free width`).toBeGreaterThan(res.W * 0.4);
        expect(free.b - free.t, `${tag} free height`).toBeGreaterThan(res.H * 0.4);
        for (const c of res.ctrls) {
          const ox = Math.min(free.r, c.r) - Math.max(free.l, c.l), oy = Math.min(free.b, c.b) - Math.max(free.t, c.t);
          expect(ox <= 1 || oy <= 1, `${tag}: free area overlaps ${c.sel}`).toBe(true);
        }
        const [cx, cy] = res.pts[0];
        expect(Math.abs(cx - (free.l + free.r) / 2), `${tag} target x`).toBeLessThan(2);
        expect(Math.abs(cy - (free.t + free.b) / 2), `${tag} target y`).toBeLessThan(2);
        for (const [x, y] of res.pts.slice(1)) {
          expect(x, `${tag} subject x`).toBeGreaterThanOrEqual(free.l - 2);
          expect(x, `${tag} subject x`).toBeLessThanOrEqual(free.r + 2);
          expect(y, `${tag} subject y`).toBeGreaterThanOrEqual(free.t - 2);
          expect(y, `${tag} subject y`).toBeLessThanOrEqual(free.b + 2);
        }
      }
    }
  }
}
for (const [w, h, lang] of [[390, 844, 'en'], [844, 390, 'en'], [1440, 900, 'en'], [390, 844, 'ar'], [844, 390, 'ar']]) {
  test(`camera ${lang} ${w}x${h}: every stage keeps its target and its whole subject box clear of the controls`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await checkFraming(page, { width: w, height: h, lang });
  });
}

test('camera: a resize re-fits a camera still on its preset, keeps a visitor-moved view, and moves the zoom limits', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, 'lens-implants', { width: 1440, height: 900 });
  await page.evaluate(() => window.__procedureSim.setStage('removed'));
  const d = await camOf(page);
  // reference: the camera a page opened directly at the phone size gets
  const fresh = await page.context().newPage();
  await fresh.emulateMedia({ reducedMotion: 'reduce' });
  await open(fresh, 'lens-implants', { width: 390, height: 844 });
  await fresh.evaluate(() => window.__procedureSim.setStage('removed'));
  const f = await camOf(fresh);
  await fresh.close();
  await page.setViewportSize({ width: 390, height: 844 });
  // the page layout animates to its phone form over a few frames; each step re-fits, ending on the reference camera
  await expect.poll(async () => { const c = await camOf(page); return c.view.join('x') === f.view.join('x') && Math.abs(c.r - f.r) < 0.01; }, { timeout: 8000 }).toBe(true);
  const p = await camOf(page);
  expect(p.userMoved).toBe(false);
  expect(Math.abs(p.r - d.r), 'the distance changed with the view').toBeGreaterThan(0.2);
  // the visitor zooms; a resize keeps their distance but the limits follow the new fit
  await page.locator('.ssim-canvas-host canvas').focus();
  await page.keyboard.press('+');
  const m = await camOf(page);
  expect(m.userMoved).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect.poll(async () => (await camOf(page)).view.join('x'), { timeout: 8000 }).toBe(d.view.join('x'));
  const back = await camOf(page);
  expect(back.r).toBeCloseTo(m.r, 4);
  expect(back.userMoved).toBe(true);
  expect(back.maxR).toBeLessThan(m.maxR); // the desktop fit is closer, so the limits shrank with it
  // Reset view: the desktop fit again
  await page.locator('[data-act="resetView"]').click();
  expect((await camOf(page)).r).toBeCloseTo(d.r, 3);
});

test('camera: seek while playing keeps the visitor\'s view inside the stage and takes the stage camera in a new stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, 'icl');
  // stage range of "position" (index 4) and "result" (index 5) on the timeline
  const [a4, a5] = await page.evaluate(() => { const c = window.__procedureSim; c.setStage(4); const x = c.getState().progress; c.setStage(5); const y = c.getState().progress; return [x, y]; });
  await page.evaluate((t) => { const c = window.__procedureSim; c.seek(t); c.play(); }, a4 - 0.04);
  await page.locator('.ssim-canvas-host canvas').focus();
  await page.keyboard.press('ArrowLeft');
  const moved = await camOf(page);
  expect(moved.userMoved).toBe(true);
  await page.evaluate((t) => window.__procedureSim.seek(t), a4 - 0.02); // same stage, still playing
  const same = await camOf(page);
  expect((await S(page)).playing).toBe(true);
  expect(same.userMoved).toBe(true);
  expect(same.theta).toBeCloseTo(moved.theta, 2);
  await page.evaluate((t) => window.__procedureSim.seek(t), (a4 + a5) / 2 + 0.01); // into another stage
  const other = await camOf(page);
  expect(other.userMoved).toBe(false);
  expect(other.preset).toBe(other.stagePreset);
  await page.evaluate(() => window.__procedureSim.pause());
});

for (const [w, h] of [[390, 844], [1440, 900]]) {
  test(`camera ${w}x${h}: Before / After show two different moments from one fitted camera`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const slug of ['lens-implants', 'icl', 'corneal-transplant']) {
      await open(page, slug, { width: w, height: h });
      await page.evaluate(() => window.__procedureSim.compare('before'));
      const a = await camOf(page), sa = await S(page);
      await page.evaluate(() => window.__procedureSim.compare('after'));
      const b = await camOf(page), sb = await S(page);
      expect(sa.compare).toBe('before'); expect(sb.compare).toBe('after');
      expect(sa.stageIndex).toBe(0); expect(sb.stageIndex).toBe(sb.stageCount - 1);
      expect(sb.progress - sa.progress, 'two different moments').toBeGreaterThan(0.9);
      if (sa.probe) expect(JSON.stringify(sa.probe)).not.toBe(JSON.stringify(sb.probe));
      near(b, a, `${slug} before vs after`);
      expect(a.fit).toBeTruthy();
    }
  });
}

// BUG-SIM-14: the ICL plate must never cross the iris while it is unfolded and tucked behind it.
test('ICL: the plate never intersects the iris or the natural lens at any of 200 time samples per stage (pure model)', async () => {
  const { iclPoseAt, iclIrisOverlap, iclLensOverlap } = await import('../src/surgical-sim/procedures/icl.js');
  for (const i of [3, 4, 5]) {
    let worst = -Infinity, lens = -Infinity;
    for (let k = 0; k <= 200; k++) {
      const s = iclPoseAt(i, k / 200);
      if (!s.on) continue;
      worst = Math.max(worst, iclIrisOverlap(s.pose, s.pupil, s.marginZ));
      lens = Math.max(lens, iclLensOverlap(s.pose));
    }
    expect(worst, `stage ${i}: plate vs iris`).toBeLessThan(0);
    expect(lens, `stage ${i}: footplates vs natural lens`).toBeLessThan(0);
  }
  const end = iclPoseAt(5, 1);
  expect(iclLensOverlap(end.pose)).toBeLessThan(0);
  expect(end.pose).toEqual({ sx: 1, sy: 1, sz: 1, px: 0, dz: 0 }); // final resting position (and vault) unchanged
});

test('ICL: no plate/iris intersection while playing through the insertion and tuck (rendered model, 200 samples)', async ({ page }) => {
  await open(page, 'icl');
  const res = await page.evaluate(() => {
    const c = window.__procedureSim, out = [];
    c.setStage('insert'); const a = c.getState().progress;
    c.setStage('result'); const b = c.getState().progress;
    for (let k = 0; k <= 200; k++) { c.seek(a - 0.02 + (b - a + 0.02) * k / 200); const st = c.getState(); out.push({ id: st.stageId, o: st.probe.irisOverlap }); }
    return out;
  });
  const sampled = res.filter((r) => r.o !== null);
  expect(sampled.length).toBeGreaterThan(100);
  expect(sampled.filter((r) => r.id === 'position').length).toBeGreaterThan(40);
  for (const r of sampled) expect(r.o, r.id).toBeLessThan(0);
});
