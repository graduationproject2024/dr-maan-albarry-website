// Vision simulator — clinical review mode (doctor workflow): vision-sim-preview.html?review=1 or
// mount(host, { review: true }). Checks that nothing is pre-approved, gates are independent, final approval is
// guarded, version changes are flagged, exports carry no reviewer / signature fields, presets reproduce exact
// parameters, keyboard access, and no horizontal overflow at 390 px.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { PRESETS, PRESET_IDS, RENDER_CALIBRATION, presetHashes, presetViews, VISION_MODEL_VERSION } from '../src/vision-sim/review-presets.js';
import { LENSES, LENS_IDS, SCENARIO_IDS, PUPIL_BY_LIGHTING } from '../src/vision-sim/optics/params.js';

const PAGE = 'vision-sim-preview.html';
const GATES = ['opticalModelReview', 'visualRepresentationReview', 'textReviewAr', 'textReviewEn', 'finalPhysicianApproval'];
const KEY = 'vsim-clinical-review';

let errors;
test.beforeEach(({ page }) => {
  errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
});
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

async function open(page, query = 'lang=en&review=1') {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => window.__vsim && window.__vsim.getState().state === 'ready', null, { timeout: 30_000 });
}
const S = (page) => page.evaluate(() => window.__vsim.getState());
const panel = (page) => page.locator('.vsim-review');
const data = (page) => page.evaluate(() => window.__visionSim.review);
const radio = (page, gate, value) => panel(page).locator(`input[data-gate="${gate}"][value="${value}"]`);
const pick = (page, gate, value) => panel(page).locator(`label[for$="-${gate}-${value}"]`).click();
const allKeys = (o, out = []) => {
  if (Array.isArray(o)) o.forEach((x) => allKeys(x, out));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { out.push(k); allKeys(v, out); }
  return out;
};

test.describe('presets and model inventory (Node)', () => {
  test('presets cover every lens in every everyday situation, are unique and hash deterministically', () => {
    for (const l of LENS_IDS) for (const s of SCENARIO_IDS) expect(PRESET_IDS).toContain(`${l}.${s}`);
    for (const l of LENS_IDS) expect(PRESET_IDS).toContain(`${l}.distance-dusk`);
    expect(new Set(PRESET_IDS).size).toBe(PRESET_IDS.length);
    expect(PRESETS.filter((p) => p.group === 'compare').length).toBeGreaterThanOrEqual(5);
    const a = presetHashes();
    expect(new Set(Object.values(a)).size).toBe(PRESET_IDS.length);
    for (const p of PRESETS) expect(p.label.en && p.label.ar).toBeTruthy();
    expect(VISION_MODEL_VERSION).toMatch(/^vsim-optics-/);
  });
  test('rendering-calibration expressions listed in review mode exist verbatim in pipeline.js', () => {
    const src = fs.readFileSync('src/vision-sim/pipeline.js', 'utf8');
    for (const c of RENDER_CALIBRATION) expect(src, c.id).toContain(c.code);
  });
});

test.describe('vision review mode — desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('is off by default (public use) and on only with review=1', async ({ page }) => {
    await open(page, 'lang=en');
    await expect(panel(page)).toHaveCount(0);
    expect((await S(page)).review).toBe(false);
    await open(page);
    await expect(panel(page)).toBeVisible();
    expect((await S(page)).review).toBe(true);
  });

  test('every preset starts with every gate "Pending review" — nothing is pre-approved', async ({ page }) => {
    await open(page);
    const d = await data(page);
    expect(Object.keys(d.presets).sort()).toEqual([...PRESET_IDS].sort());
    for (const rec of Object.values(d.presets)) {
      for (const g of GATES) expect(rec.gates[g]).toEqual({ status: 'pending', modelVersion: null, contentHash: null, setAt: null });
    }
    for (const g of GATES) await expect(radio(page, g, 'pending')).toBeChecked();
    await expect(panel(page).locator('[data-r="notOfficial"]')).toContainText('not an official approval');
    await expect(panel(page).locator('[data-r="modelVersion"]')).toHaveText(VISION_MODEL_VERSION);
    // the summary table lists every preset, every gate pending
    const statuses = await panel(page).locator('[data-preset-row] td').evaluateAll((tds) => tds.map((td) => td.dataset.status));
    expect(statuses.length).toBe(PRESET_IDS.length * GATES.length);
    expect(new Set(statuses)).toEqual(new Set(['pending']));
  });

  test('applying a preset reproduces its exact parameters (all presets) and the model output', async ({ page }) => {
    await open(page);
    for (const p of PRESETS) {
      await page.evaluate((id) => window.__visionSim.reviewPanel.select(id), p.id);
      const s = await S(page);
      const exp = p.params;
      expect({ lens: s.lens, compare: s.compare, distanceM: s.distanceM, lighting: s.lighting, split: s.split }, p.id)
        .toEqual({ lens: exp.lens, compare: exp.compare, distanceM: exp.distanceM, lighting: exp.lighting, split: exp.split });
      if (exp.compare) expect(s.lensB, p.id).toBe(exp.lensB);
      for (const k of ['sphereD', 'cylD', 'axisDeg']) expect(s.refraction[k], `${p.id} ${k}`).toBeCloseTo(exp.refraction[k], 12);
      expect(s.pupilMm).toBe(PUPIL_BY_LIGHTING[exp.lighting]);
      const v = presetViews(exp);
      for (const band of ['distance', 'intermediate', 'near']) {
        expect(s.optics.A.layers[band].defocusD, `${p.id} ${band}`).toBeCloseTo(v.A.layers[band].defocusD, 9);
        expect(s.optics.A.layers[band].sharpness, `${p.id} ${band}`).toBeCloseTo(v.A.layers[band].sharpness, 9);
      }
      await expect(panel(page).locator('[data-r="match"]')).toHaveAttribute('data-match', 'yes');
    }
  });

  test('preset picker, parameter table, divergence notice and re-apply', async ({ page }) => {
    await open(page);
    await panel(page).locator('[data-r="preset"]').selectOption('toric.cyl-1.5x180.signs');
    await expect.poll(async () => (await S(page)).lens).toBe('toric');
    await expect(panel(page).locator('[data-param="cyl"] td').first()).toHaveText('-1.5');
    await expect(panel(page).locator('[data-param="axis"] td').first()).toHaveText('180');
    // the reviewer changes the lens with the public controls → the view no longer matches the preset
    await page.locator('.vsim:not(.vsim-review)').getByRole('group', { name: 'Lens', exact: true }).getByText('Trifocal', { exact: true }).click();
    await expect(panel(page).locator('[data-r="match"]')).toHaveAttribute('data-match', 'no');
    await panel(page).locator('[data-r="apply"]').click();
    await expect(panel(page).locator('[data-r="match"]')).toHaveAttribute('data-match', 'yes');
    expect((await S(page)).lens).toBe('toric');
    // reference sections show values read from the code
    const ref = panel(page).locator('details[data-sec="conditions"]');
    await ref.locator('summary').click();
    await expect(ref).toContainText('0 D × 0.45 · 1.5 D × 0.18 · 2.5 D × 0.27');
    await expect(ref).toContainText(String(LENSES.cataract.straylight));
    await panel(page).locator('details[data-sec="texts"] summary').click();
    await expect(panel(page).locator('details[data-sec="texts"] [lang="ar"]').first()).toContainText('رسم توضيحي تثقيفي');
  });

  test('gates are independent and final approval is guarded until all four are approved for this version', async ({ page }) => {
    await open(page);
    await expect(radio(page, 'finalPhysicianApproval', 'approved')).toBeDisabled();
    await expect(radio(page, 'finalPhysicianApproval', 'approved-with-corrections')).toBeDisabled();
    await expect(radio(page, 'finalPhysicianApproval', 'rejected')).toBeEnabled();
    await expect(panel(page).locator('[data-r="finalWhy"] li')).toHaveCount(4);
    await pick(page, 'opticalModelReview', 'approved');
    let d = await data(page);
    const id = d.selected;
    expect(d.presets[id].gates.opticalModelReview.status).toBe('approved');
    expect(d.presets[id].gates.opticalModelReview.modelVersion).toBe(VISION_MODEL_VERSION);
    expect(d.presets[id].gates.opticalModelReview.contentHash).toBe(presetHashes()[id]);
    for (const g of GATES.slice(1)) expect(d.presets[id].gates[g].status).toBe('pending');
    // other presets untouched
    expect(Object.entries(d.presets).filter(([k]) => k !== id).every(([, r]) => GATES.every((g) => r.gates[g].status === 'pending'))).toBe(true);
    await pick(page, 'visualRepresentationReview', 'rejected');
    await pick(page, 'textReviewAr', 'approved-with-corrections');
    await pick(page, 'textReviewEn', 'approved');
    await expect(panel(page).locator('[data-r="finalWhy"]')).toContainText('Visual representation review is rejected');
    await expect(radio(page, 'finalPhysicianApproval', 'approved')).toBeDisabled();
    // forcing the blocked option is refused by the code, not only by the disabled attribute
    await radio(page, 'finalPhysicianApproval', 'approved').evaluate((r) => { r.disabled = false; r.click(); });
    await expect(panel(page).locator('[data-r="msg"]')).toContainText('blocked');
    expect((await data(page)).presets[id].gates.finalPhysicianApproval.status).toBe('pending');
    await pick(page, 'visualRepresentationReview', 'approved');
    await expect(radio(page, 'finalPhysicianApproval', 'approved')).toBeEnabled();
    await pick(page, 'finalPhysicianApproval', 'approved');
    d = await data(page);
    expect(d.presets[id].gates.finalPhysicianApproval.status).toBe('approved');
    // a clinical gate later rejected does NOT silently change the final gate: it is flagged instead
    await pick(page, 'textReviewEn', 'rejected');
    await expect(panel(page).locator('[data-r="finalInconsistent"]')).toBeVisible();
    expect((await data(page)).presets[id].gates.finalPhysicianApproval.status).toBe('approved');
    // the history keeps the superseded records
    expect((await data(page)).presets[id].history.map((h) => [h.gate, h.status])).toEqual([['visualRepresentationReview', 'rejected'], ['textReviewEn', 'approved']]);
  });

  test('a gate recorded for another model version is flagged "needs re-review" and its evidence kept', async ({ page }) => {
    await open(page);
    const id = PRESET_IDS[0];
    await page.evaluate(([key, id]) => {
      const gate = (status) => ({ status, modelVersion: 'vsim-optics-2026.10-r0', contentHash: 'vp-00000000', setAt: '2026-10-01T10:00:00.000Z' });
      localStorage.setItem(key, JSON.stringify({ format: 'vsim-clinical-review', formatVersion: 1, modelVersion: 'vsim-optics-2026.10-r0', selected: id,
        presets: { [id]: { gates: { opticalModelReview: gate('approved'), textReviewEn: gate('approved') }, notes: 'old note', issues: [], screenshots: [] } } }));
    }, [KEY, id]);
    await page.reload();
    await page.waitForFunction(() => window.__vsim && window.__vsim.getState().state === 'ready');
    await expect(panel(page).locator('[data-r="rereview"]')).toContainText('Needs re-review (changed since vsim-optics-2026.10-r0)');
    await expect(radio(page, 'opticalModelReview', 'approved')).toBeChecked(); // old evidence still shown
    await expect(panel(page).locator('[data-r="finalWhy"]')).toContainText('earlier version (vsim-optics-2026.10-r0)');
    await expect(panel(page).locator('[data-r="notes"]')).toHaveValue('old note');
    // re-recording for the current version clears that gate's flag; the old record stays in history
    await pick(page, 'opticalModelReview', 'approved-with-corrections');
    const d = await data(page);
    expect(d.presets[id].history[0]).toMatchObject({ gate: 'opticalModelReview', status: 'approved', modelVersion: 'vsim-optics-2026.10-r0' });
    expect(d.presets[id].gates.opticalModelReview.modelVersion).toBe(VISION_MODEL_VERSION);
    await expect(panel(page).locator('[data-r="rereview"]')).toContainText('English text review');
    await expect(panel(page).locator('[data-r="rereview"]')).not.toContainText('Optical model review');
    // the same status can be re-confirmed for the current version with an explicit button
    await panel(page).locator('[data-reconfirm="textReviewEn"]').click();
    await expect(panel(page).locator('[data-r="rereview"]')).toHaveCount(0);
    const d2 = await data(page);
    expect(d2.presets[id].gates.textReviewEn).toMatchObject({ status: 'approved', modelVersion: VISION_MODEL_VERSION, contentHash: presetHashes()[id] });
    expect(d2.presets[id].history.map((h) => h.gate)).toEqual(['opticalModelReview', 'textReviewEn']);
  });

  test('issues, screenshot reference and export: disclaimer, versions, parameters, no reviewer fields', async ({ page }, info) => {
    await open(page);
    await panel(page).locator('[data-r="preset"]').selectOption('compare.monofocal-vs-trifocal.night-driving');
    await expect.poll(async () => (await S(page)).compare).toBe(true);
    await panel(page).locator('[data-r="notes"]').fill('Halo size plausible; check glare skirt.');
    await panel(page).locator('[data-r="issueText"]').fill('Trifocal halo ring looks too bright');
    await panel(page).locator('[data-r="addIssue"]').click();
    await expect(panel(page).locator('[data-r="issues"] li')).toHaveCount(1);
    const [shot] = await Promise.all([page.waitForEvent('download'), panel(page).locator('[data-r="shot"]').click()]);
    expect(shot.suggestedFilename()).toBe('vision-sim-compare.monofocal-vs-trifocal.night-driving-monofocal-vs-trifocal-6m-night.png');
    const png = info.outputPath('shot.png');
    await shot.saveAs(png);
    expect(fs.readFileSync(png).subarray(1, 4).toString()).toBe('PNG');
    expect(fs.statSync(png).size).toBeGreaterThan(20_000);
    const before = new Date().toISOString();
    const [dl] = await Promise.all([page.waitForEvent('download'), panel(page).locator('[data-r="export"]').click()]);
    expect(dl.suggestedFilename()).toBe(`vision-sim-review-${VISION_MODEL_VERSION}.json`);
    const file = info.outputPath('vreview.json');
    await dl.saveAs(file);
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(json).toMatchObject({ format: 'vsim-clinical-review', formatVersion: 1, simulator: 'vision-sim', modelVersion: VISION_MODEL_VERSION });
    expect(json.notOfficialApproval).toContain('NOT an official clinical approval');
    expect(json.notOfficialApprovalAr).toContain('ليس اعتمادًا سريريًا رسميًا');
    expect(json.exportedAt >= before).toBe(true);
    expect(json.modelParametersAtExport.lenses).toEqual(JSON.parse(JSON.stringify(LENSES)));
    const rec = json.presets['compare.monofocal-vs-trifocal.night-driving'];
    expect(rec.notes).toBe('Halo size plausible; check glare skirt.');
    expect(rec.parameters).toMatchObject({ lens: 'monofocal', lensB: 'trifocal', compare: true, distanceM: 6, lighting: 'night' });
    expect(rec.issues[0]).toMatchObject({ text: 'Trifocal halo ring looks too bright', presetId: 'compare.monofocal-vs-trifocal.night-driving', matchesPreset: true, modelVersion: VISION_MODEL_VERSION });
    expect(rec.issues[0].params).toMatchObject({ lens: 'monofocal', lensB: 'trifocal', compare: true, distanceM: 6, lighting: 'night', pupilMm: 5 });
    expect(rec.screenshots[0].file).toBe(shot.suggestedFilename());
    expect(rec.currentContentHash).toBe(presetHashes()['compare.monofocal-vs-trifocal.night-driving']);
    expect(Object.values(json.presets).every((p) => Object.values(p.gates).every((g) => g.status === 'pending'))).toBe(true);
    // no reviewer identity, signature or approval date field anywhere
    const keys = allKeys(json);
    expect(keys.filter((k) => /reviewer|reviewed(by|on|at)|signature|signed|signer|approvedby|approvedat|approvaldate/i.test(k))).toEqual([]);
    // import: a cataract file is refused; a vision file with a retired preset keeps that preset's evidence
    fs.writeFileSync(file, JSON.stringify({ format: 'csim-clinical-review', stages: {} }));
    await panel(page).locator('[data-r="importFile"]').setInputFiles(file);
    await expect(panel(page).locator('[data-r="msg"]')).toContainText('Could not import');
    const old = { ...json, modelVersion: 'vsim-optics-2026.10-r0', presets: { ...json.presets, 'old.preset': { gates: { textReviewEn: { status: 'super-approved' } }, notes: 'kept', issues: [] } } };
    fs.writeFileSync(file, JSON.stringify(old));
    await panel(page).locator('[data-r="importFile"]').setInputFiles(file);
    await expect(panel(page).locator('[data-r="msg"]')).toContainText('vsim-optics-2026.10-r0');
    const d = await data(page);
    expect(d.presets['old.preset'].notes).toBe('kept');
    expect(d.presets['old.preset'].gates.textReviewEn.status).toBe('pending'); // unknown status → pending, never approved
  });

  test('keyboard: preset navigation, gate radios with arrows, focus is kept, all targets ≥ 44 px', async ({ page }) => {
    await open(page);
    await panel(page).locator('[data-r="next"]').focus();
    await page.keyboard.press('Enter');
    await expect.poll(async () => (await data(page)).selected).toBe(PRESET_IDS[1]);
    await expect(panel(page).locator('[data-r="next"]')).toBeFocused();
    const first = radio(page, 'textReviewAr', 'pending');
    await first.focus();
    await page.keyboard.press('ArrowDown');
    await expect(radio(page, 'textReviewAr', 'approved')).toBeChecked();
    await expect(radio(page, 'textReviewAr', 'approved')).toBeFocused();
    expect((await data(page)).presets[PRESET_IDS[1]].gates.textReviewAr.status).toBe('approved');
    // arrows skip the blocked final-approval options
    await radio(page, 'finalPhysicianApproval', 'pending').focus();
    await page.keyboard.press('ArrowDown');
    await expect(radio(page, 'finalPhysicianApproval', 'rejected')).toBeChecked();
    // Tab moves on from the gate group to the next control
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => document.activeElement.dataset.gate || document.activeElement.tagName);
    expect(active).not.toBe('finalPhysicianApproval');
    const small = await panel(page).locator('.srv-btn, .srv-opt, select, summary, input[type="text"]').evaluateAll((els) =>
      els.filter((e) => e.offsetParent !== null).map((e) => [e.textContent.trim().slice(0, 30), e.getBoundingClientRect().height]).filter(([, h]) => h < 43.5));
    expect(small).toEqual([]);
  });
});

for (const lang of ['en', 'ar']) {
  test.describe(`vision review mode — 390 px (${lang})`, () => {
    test.use({ viewport: { width: 390, height: 844 } });
    test('no horizontal page overflow, panel stays inside the viewport', async ({ page }) => {
      await open(page, `lang=${lang}&review=1`);
      await panel(page).locator('details').evaluateAll((ds) => ds.forEach((d) => { d.open = true; }));
      await panel(page).locator('[data-r="preset"]').selectOption('compare.monofocal-vs-toric.signs.cyl1.5');
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      expect(w[0]).toBeLessThanOrEqual(w[1]);
      const box = await panel(page).boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(390.5);
      await expect(panel(page)).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    });
  });
}
