// Clinical review mode (doctor workflow): ?review=1 on the harness, mount(host, { review: true }).
import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const PAGE = 'cataract-sim-preview.html';
let errors;
test.beforeEach(({ page }) => {
  errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
});
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });
test.use({ viewport: { width: 1440, height: 1000 } });

async function open(page, query = 'lang=en&reduced=1&review=1') {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready', null, { timeout: 30_000 });
}
const S = (page) => page.evaluate(() => window.__csim.getState());
const panel = (page) => page.locator('.csim-review');
const GATES = ['engineeringVerification', 'anatomicalReview', 'motionReview', 'medicalTextReview', 'finalPhysicianApproval'];
const radio = (page, gate, value) => panel(page).locator(`input[data-gate="${gate}"][value="${value}"]`);
const pick = (page, gate, value) => panel(page).locator(`label[for$="-${gate}-${value}"]`).click();
const reviewData = (page) => page.evaluate(() => window.__cataractSim.review);

test('review mode is off by default and contains no approval UI', async ({ page }) => {
  await open(page, 'lang=en&reduced=1');
  await expect(panel(page)).toHaveCount(0);
  expect((await S(page)).review).toBe(false);
});

test('every stage starts as "Pending review" — nothing is pre-approved', async ({ page }) => {
  await open(page);
  await expect(panel(page)).toBeVisible();
  expect((await S(page)).modelVersion).toMatch(/^csim-anatomy-/);
  for (let i = 0; i < 7; i++) {
    await panel(page).locator('[data-r="stage"]').selectOption(String(i));
    await expect.poll(async () => (await S(page)).stageIndex).toBe(i);
    for (const g of GATES) await expect(radio(page, g, 'pending')).toBeChecked();
  }
  const data = await page.evaluate(() => window.__cataractSim.review);
  expect(data.formatVersion).toBe(2);
  expect(Object.keys(data.stages)).toHaveLength(7);
  for (const rec of Object.values(data.stages)) {
    for (const g of GATES) expect(rec.gates[g]).toEqual({ status: 'pending', modelVersion: null, contentHash: null, setAt: null });
    expect(rec.legacy).toBeNull();
  }
  await expect(panel(page).locator('[data-r="notOfficial"]')).toContainText('not an official approval');
  // the public badge still says draft / pending
  await expect(page.locator('.csim-badge')).toContainText('pending physician review');
});

test('slow playback and frame stepping', async ({ page }) => {
  await open(page, 'lang=en&reduced=0&review=1');
  await panel(page).locator('[data-r="speed"]').selectOption('0.25');
  expect((await S(page)).speed).toBe(0.25);
  await page.evaluate(() => window.__csim.play());
  const t0 = await page.evaluate(() => [performance.now(), window.__csim.getState().progress]);
  await page.waitForTimeout(1200);
  const t1 = await page.evaluate(() => [performance.now(), window.__csim.getState().progress]);
  const rate = ((t1[1] - t0[1]) * 68) / ((t1[0] - t0[0]) / 1000); // animation seconds per real second
  expect(rate).toBeGreaterThan(0.1);
  expect(rate).toBeLessThan(0.4);
  await page.evaluate(() => window.__csim.pause());
  await expect.poll(async () => (await S(page)).state).toBe('paused');
  const p0 = (await S(page)).progress;
  await panel(page).locator('[data-r="stepFwd"]').click();
  await panel(page).locator('[data-r="stepFwd"]').click();
  expect((await S(page)).progress - p0).toBeCloseTo(2 / 30 / 68, 6);
  await panel(page).locator('[data-r="stepBack"]').click();
  expect((await S(page)).progress - p0).toBeCloseTo(1 / 30 / 68, 6);
  expect((await S(page)).state).toBe('paused');
});

test('camera presets and anatomical layer toggles', async ({ page }) => {
  await open(page);
  await panel(page).locator('[data-cam="side"]').click();
  await expect.poll(async () => (await S(page)).camera.azimuth).toBeCloseTo(1.45, 1);
  await panel(page).locator('[data-cam="surgeon"]').click();
  await expect.poll(async () => (await S(page)).camera.azimuth).toBeCloseTo(0, 1);
  for (const id of ['cornea', 'iris', 'lens', 'iol', 'instruments', 'rays']) {
    const box = panel(page).locator(`[data-layer="${id}"]`);
    await expect(box).toBeChecked();
    await box.uncheck();
    expect((await S(page)).layers[id]).toBe(false);
  }
  const blank = await page.evaluate(() => window.__cataractSim.sample());
  await panel(page).locator('[data-layer="iris"]').check();
  const withIris = await page.evaluate(() => window.__cataractSim.sample());
  expect([withIris.uniqueColors, withIris.nonBackground]).not.toEqual([blank.uniqueColors, blank.nonBackground]);
});

test('screenshot downloads a PNG of the canvas', async ({ page }) => {
  await open(page);
  const url = await page.evaluate(() => window.__cataractSim.screenshot());
  expect(url.startsWith('data:image/png;base64,')).toBe(true);
  expect(url.length).toBeGreaterThan(20_000);
  const [dl] = await Promise.all([page.waitForEvent('download'), panel(page).locator('[data-r="shot"]').click()]);
  expect(dl.suggestedFilename()).toMatch(/^cataract-sim-stage1-p0\.000\.png$/);
});

test('notes, issues and gates persist, export with the model version and import back', async ({ page }, info) => {
  await open(page);
  await panel(page).locator('[data-r="stage"]').selectOption('3');
  await expect.poll(async () => (await S(page)).stageIndex).toBe(3);
  await panel(page).locator('[data-r="notes"]').fill('Flap fold looks plausible; check tear direction.');
  await panel(page).locator('[data-r="issueText"]').fill('Forceps tip slightly high');
  await panel(page).locator('[data-r="addIssue"]').click();
  await pick(page, 'anatomicalReview', 'approved-with-corrections');
  await page.reload();
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready');
  await panel(page).locator('[data-r="stage"]').selectOption('3');
  await expect(panel(page).locator('[data-r="notes"]')).toHaveValue('Flap fold looks plausible; check tear direction.');
  await expect(panel(page).locator('.csim-review-issues li')).toHaveCount(1);
  await expect(radio(page, 'anatomicalReview', 'approved-with-corrections')).toBeChecked();
  const [dl] = await Promise.all([page.waitForEvent('download'), panel(page).locator('[data-r="export"]').click()]);
  const file = info.outputPath('review.json');
  await dl.saveAs(file);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(json.format).toBe('csim-clinical-review');
  expect(json.modelVersion).toBe((await S(page)).modelVersion);
  expect(json.stages.capsulorhexis.gates.anatomicalReview.status).toBe('approved-with-corrections');
  for (const g of GATES.filter((x) => x !== 'anatomicalReview')) expect(json.stages.capsulorhexis.gates[g].status).toBe('pending');
  expect(Object.entries(json.stages).filter(([k]) => k !== 'capsulorhexis').every(([, v]) => GATES.every((g) => v.gates[g].status === 'pending'))).toBe(true);
  // import a file from another model version (and with an unknown status -> pending, never approved)
  const other = { ...json, modelVersion: 'csim-anatomy-old', stages: { ...json.stages, phaco: { gates: { motionReview: { status: 'super-approved' } }, notes: 'x', issues: [] } } };
  fs.writeFileSync(file, JSON.stringify(other));
  await panel(page).locator('[data-r="importFile"]').setInputFiles(file);
  await expect(panel(page).locator('.csim-review-msg')).toContainText('csim-anatomy-old');
  const data = await page.evaluate(() => window.__cataractSim.review);
  expect(data.stages.phaco.gates.motionReview.status).toBe('pending');
  expect(data.stages.capsulorhexis.gates.anatomicalReview.status).toBe('approved-with-corrections');
  fs.writeFileSync(file, '{"not":"a review"}');
  await panel(page).locator('[data-r="importFile"]').setInputFiles(file);
  await expect(panel(page).locator('.csim-review-msg')).toContainText('Could not import');
});

// ---------- separate review gates, versioning, export, legacy migration, keyboard, 390 px ----------
const allKeys = (o, out = []) => {
  if (Array.isArray(o)) o.forEach((x) => allKeys(x, out));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { out.push(k); allKeys(v, out); }
  return out;
};
const FORBIDDEN_KEY = /reviewer|reviewed(by|on|at)|signature|signed|signer|approvedby|approvedat|approvaldate/i;

test('gates are independent per stage and per gate', async ({ page }) => {
  await open(page);
  await pick(page, 'engineeringVerification', 'verified');
  await pick(page, 'motionReview', 'rejected');
  let d = await reviewData(page);
  const st = d.stages['cloudy-lens'].gates;
  expect(GATES.map((g) => st[g].status)).toEqual(['verified', 'pending', 'rejected', 'pending', 'pending']);
  expect(st.motionReview.modelVersion).toBe((await S(page)).modelVersion);
  expect(st.motionReview.contentHash).toMatch(/^stg-[0-9a-f]{8}$/);
  await expect(panel(page).locator('[data-r="stageHash"]')).toHaveText(st.motionReview.contentHash);
  // engineering uses its own states only
  await expect(radio(page, 'engineeringVerification', 'approved')).toHaveCount(0);
  // other stages are untouched; each stage has its own content version
  await panel(page).locator('[data-r="stage"]').selectOption('1');
  await expect.poll(async () => (await S(page)).stageIndex).toBe(1);
  for (const g of GATES) await expect(radio(page, g, 'pending')).toBeChecked();
  await expect(panel(page).locator('[data-r="stageHash"]')).not.toHaveText(st.motionReview.contentHash);
  d = await reviewData(page);
  expect(Object.entries(d.stages).filter(([k]) => k !== 'cloudy-lens').every(([, v]) => GATES.every((g) => v.gates[g].status === 'pending'))).toBe(true);
});

test('final physician approval is blocked until anatomical, motion and text are approved — with reasons', async ({ page }) => {
  await open(page);
  await expect(radio(page, 'finalPhysicianApproval', 'approved')).toBeDisabled();
  await expect(radio(page, 'finalPhysicianApproval', 'approved-with-corrections')).toBeDisabled();
  await expect(radio(page, 'finalPhysicianApproval', 'rejected')).toBeEnabled();
  const why = panel(page).locator('[data-r="finalWhy"]');
  await expect(why.locator('li')).toHaveText(['Anatomical review is still pending', 'Motion review is still pending', 'Medical text review (AR + EN) is still pending']);
  await pick(page, 'anatomicalReview', 'approved');
  await pick(page, 'motionReview', 'rejected');
  await expect(why.locator('li')).toHaveText(['Motion review is rejected', 'Medical text review (AR + EN) is still pending']);
  // the code refuses a forced attempt too (not only the disabled attribute)
  await radio(page, 'finalPhysicianApproval', 'approved').evaluate((r) => { r.disabled = false; r.click(); });
  await expect(panel(page).locator('.csim-review-msg')).toContainText('blocked');
  expect((await reviewData(page)).stages['cloudy-lens'].gates.finalPhysicianApproval.status).toBe('pending');
  await pick(page, 'motionReview', 'approved-with-corrections');
  await pick(page, 'medicalTextReview', 'approved');
  await expect(why).toHaveCount(0);
  await pick(page, 'finalPhysicianApproval', 'approved');
  expect((await reviewData(page)).stages['cloudy-lens'].gates.finalPhysicianApproval.status).toBe('approved');
  // a later rejection never silently changes the final gate; it is flagged instead
  await pick(page, 'anatomicalReview', 'rejected');
  await expect(panel(page).locator('[data-r="finalInconsistent"]')).toBeVisible();
  const d = await reviewData(page);
  expect(d.stages['cloudy-lens'].gates.finalPhysicianApproval.status).toBe('approved');
  expect(d.stages['cloudy-lens'].history.map((h) => [h.gate, h.status])).toEqual([['motionReview', 'rejected'], ['anatomicalReview', 'approved']]);
});

test('a gate set for another model version / stage content is flagged "needs re-review"; evidence is kept', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    const gate = (status) => ({ status, modelVersion: 'csim-anatomy-2026.10-r1', contentHash: 'stg-00000000', setAt: '2026-10-20T09:00:00.000Z' });
    localStorage.setItem('csim-clinical-review', JSON.stringify({ format: 'csim-clinical-review', formatVersion: 2, modelVersion: 'csim-anatomy-2026.10-r1',
      stages: { incision: { gates: { anatomicalReview: gate('approved'), motionReview: gate('approved'), medicalTextReview: gate('approved') }, notes: 'earlier note',
        issues: [{ text: 'old issue', p: 0.5, frame: 120, timeS: 4, camera: { target: [0, 0, 0], distance: 30, azimuth: 0, polar: 1.5 }, modelVersion: 'csim-anatomy-2026.10-r1' }] } } }));
  });
  await page.reload();
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready');
  await expect(panel(page).locator('[data-r="rereview"]')).toHaveCount(0); // stage 1 has no stale record
  await panel(page).locator('[data-r="stage"]').selectOption('2');
  await expect.poll(async () => (await S(page)).stageIndex).toBe(2);
  await expect(panel(page).locator('[data-r="rereview"]')).toContainText('Needs re-review (changed since csim-anatomy-2026.10-r1)');
  await expect(panel(page).locator('[data-flag="stale"]')).toHaveCount(3);
  await expect(radio(page, 'anatomicalReview', 'approved')).toBeChecked(); // the old evidence is still shown
  await expect(radio(page, 'finalPhysicianApproval', 'approved')).toBeDisabled();
  await expect(panel(page).locator('[data-r="finalWhy"]')).toContainText('earlier version (csim-anatomy-2026.10-r1)');
  await expect(panel(page).locator('[data-r="notes"]')).toHaveValue('earlier note');
  await expect(panel(page).locator('.csim-review-issues li')).toContainText('frame 120');
  // re-selecting the already-checked option changes nothing; the reviewer re-confirms explicitly
  await pick(page, 'anatomicalReview', 'approved');
  expect((await reviewData(page)).stages.incision.history).toEqual([]);
  await panel(page).locator('[data-reconfirm="anatomicalReview"]').click();
  await expect(radio(page, 'anatomicalReview', 'approved')).toBeFocused();
  const d = await reviewData(page);
  expect(d.stages.incision.history[0]).toMatchObject({ gate: 'anatomicalReview', status: 'approved', modelVersion: 'csim-anatomy-2026.10-r1', contentHash: 'stg-00000000' });
  expect(d.stages.incision.gates.anatomicalReview.modelVersion).toBe((await S(page)).modelVersion);
  await expect(panel(page).locator('[data-flag="stale"]')).toHaveCount(2);
});

test('export record: format, versions, disclaimer, gates, issues with frame/time/camera, screenshots, no reviewer fields', async ({ page }, info) => {
  await open(page);
  await panel(page).locator('[data-r="stage"]').selectOption('4');
  await expect.poll(async () => (await S(page)).stageIndex).toBe(4);
  for (let i = 0; i < 3; i++) await panel(page).locator('[data-r="stepFwd"]').click();
  await panel(page).locator('[data-cam="side"]').click();
  await panel(page).locator('[data-r="issueText"]').fill('Fragment path near the iris');
  await panel(page).locator('[data-r="addIssue"]').click();
  const [shot] = await Promise.all([page.waitForEvent('download'), panel(page).locator('[data-r="shot"]').click()]);
  await expect(panel(page).locator('[data-r="shots"] li')).toHaveCount(1);
  await pick(page, 'medicalTextReview', 'approved-with-corrections');
  const before = new Date().toISOString();
  const [dl] = await Promise.all([page.waitForEvent('download'), panel(page).locator('[data-r="export"]').click()]);
  const file = info.outputPath('export.json');
  await dl.saveAs(file);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const st = await S(page);
  expect(json).toMatchObject({ format: 'csim-clinical-review', formatVersion: 2, simulator: 'cataract-sim', modelVersion: st.modelVersion });
  expect(json.exportedAt >= before).toBe(true);
  expect(json.notOfficialApproval).toContain('NOT an official clinical approval');
  expect(json.notOfficialApprovalAr).toContain('ليس اعتمادًا سريريًا رسميًا');
  const phaco = json.stages.phaco;
  expect(phaco.title.en).toBe('Removing the cloudy lens');
  expect(Object.keys(phaco.gates)).toEqual(GATES);
  expect(phaco.gates.medicalTextReview).toMatchObject({ status: 'approved-with-corrections', modelVersion: st.modelVersion, contentHash: phaco.currentContentHash });
  expect(phaco).toMatchObject({ needsReReview: false, finalApprovalAllowedNow: false, finalApprovalInconsistent: false, legacy: null });
  expect(phaco.finalApprovalBlockedBy.map((r) => r.gate)).toEqual(['anatomicalReview', 'motionReview']);
  const issue = phaco.issues[0];
  expect(issue.text).toBe('Fragment path near the iris');
  expect(issue.p).toBeGreaterThan(0);
  expect(issue.frame).toBe(Math.round(issue.p * 12 * 30));
  expect(issue.timeS).toBeCloseTo(issue.p * 12, 3);
  expect(issue.camera.target).toHaveLength(3);
  expect(Number.isFinite(issue.camera.azimuth)).toBe(true);
  expect(issue).toMatchObject({ modelVersion: st.modelVersion, contentHash: phaco.currentContentHash });
  expect(phaco.screenshots[0]).toMatchObject({ file: shot.suggestedFilename(), frame: issue.frame, modelVersion: st.modelVersion });
  expect(allKeys(json).filter((k) => FORBIDDEN_KEY.test(k))).toEqual([]);
  expect(Object.entries(json.stages).filter(([k]) => k !== 'phaco').every(([, v]) => GATES.every((g) => v.gates[g].status === 'pending'))).toBe(true);
});

test('legacy (format 1, single status) storage and files migrate to a "legacy" note — never to a gate approval', async ({ page }, info) => {
  const legacy = {
    format: 'csim-clinical-review', modelVersion: 'csim-anatomy-2026.11-r1', exportedAt: '2026-11-02T10:00:00.000Z',
    stages: {
      phaco: { status: 'approved', notes: 'old notes', issues: [{ text: 'old issue', p: 0.5, camera: [0, 0, -1, 24, 0.38, 1.12], createdAt: '2026-11-02T09:00:00.000Z' }] },
      iol: { status: 'rejected', notes: '', issues: [] },
      completion: { status: 'weird', notes: '', issues: [] }
    }
  };
  // 1) old localStorage format
  await open(page);
  await page.evaluate((v) => localStorage.setItem('csim-clinical-review', JSON.stringify(v)), legacy);
  await page.reload();
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready');
  let d = await reviewData(page);
  expect(d.stages.phaco.legacy).toEqual({ status: 'approved', formatVersion: 1, modelVersion: 'csim-anatomy-2026.11-r1' });
  expect(d.stages.iol.legacy.status).toBe('rejected');
  expect(d.stages.completion.legacy.status).toBe('unrecognised');
  for (const rec of Object.values(d.stages)) for (const g of GATES) expect(rec.gates[g].status).toBe('pending');
  expect(d.stages.phaco.issues[0]).toMatchObject({ text: 'old issue', p: 0.5, frame: 180, timeS: 6, camera: { target: [0, 0, -1], distance: 24, azimuth: 0.38, polar: 1.12 } });
  expect(d.stages.phaco.notes).toBe('old notes');
  // 2) old export file imported into a fresh review
  await page.evaluate(() => localStorage.removeItem('csim-clinical-review'));
  await page.reload();
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready');
  const file = info.outputPath('legacy.json');
  fs.writeFileSync(file, JSON.stringify(legacy));
  await panel(page).locator('[data-r="importFile"]').setInputFiles(file);
  await expect(panel(page).locator('.csim-review-msg')).toContainText('old-format review');
  d = await reviewData(page);
  expect(d.formatVersion).toBe(2);
  expect(d.stages.phaco.legacy.status).toBe('approved');
  for (const rec of Object.values(d.stages)) for (const g of GATES) expect(rec.gates[g].status).toBe('pending');
  await panel(page).locator('[data-r="stage"]').selectOption('4');
  await expect(panel(page).locator('[data-r="legacy"]')).toContainText('Earlier single status from an old review file (format 1): Approved');
  await expect(radio(page, 'finalPhysicianApproval', 'approved')).toBeDisabled();
});

test('keyboard: gate radios work with arrows, focus is kept, blocked options are skipped; targets ≥ 44 px', async ({ page }) => {
  await open(page);
  await radio(page, 'anatomicalReview', 'pending').focus();
  await page.keyboard.press('ArrowDown');
  await expect(radio(page, 'anatomicalReview', 'approved')).toBeChecked();
  await expect(radio(page, 'anatomicalReview', 'approved')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(radio(page, 'anatomicalReview', 'approved-with-corrections')).toBeFocused();
  expect((await reviewData(page)).stages['cloudy-lens'].gates.anatomicalReview.status).toBe('approved-with-corrections');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement.dataset.gate)).toBe('motionReview');
  await radio(page, 'finalPhysicianApproval', 'pending').focus();
  await page.keyboard.press('ArrowDown');
  await expect(radio(page, 'finalPhysicianApproval', 'rejected')).toBeChecked();
  const importBtn = panel(page).locator('[data-r="importBtn"]');
  await importBtn.focus();
  await expect(importBtn).toBeFocused(); // a re-render after the radio change can move focus; press Enter only once the button holds it
  const chooserEvent = page.waitForEvent('filechooser'); // starts the browser's file-chooser interception, which takes a moment to become active
  await page.waitForTimeout(150); // pressing Enter sooner races that setup and the chooser opens unintercepted
  await page.keyboard.press('Enter');
  const chooser = await chooserEvent;
  expect(chooser).toBeTruthy();
  const small = await panel(page).locator('.csim-rbtn, .srv-opt, select, input[type="text"], .csim-review-layers label').evaluateAll((els) =>
    els.filter((e) => e.offsetParent !== null).map((e) => [e.textContent.trim().slice(0, 30), e.getBoundingClientRect().height]).filter(([, h]) => h < 43.5));
  expect(small).toEqual([]);
});

for (const lang of ['en', 'ar']) {
  test(`review panel has no horizontal overflow at 390 px (${lang})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, `lang=${lang}&reduced=1&review=1`);
    await pick(page, 'motionReview', 'rejected');
    await expect(panel(page).locator('[data-r="finalWhy"]')).toBeVisible();
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(w[0]).toBeLessThanOrEqual(w[1]);
    const box = await panel(page).boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390.5);
  });
}
