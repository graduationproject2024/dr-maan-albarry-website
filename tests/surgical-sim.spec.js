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
  await expect.poll(() => page.evaluate(() => window.__procedureSim.getState().procedure), { timeout: 20_000 }).toBe('keratoconus-cxl');
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
