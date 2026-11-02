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
    await expect(panel(page).locator('[data-r="status"]')).toHaveValue('pending');
  }
  const data = await page.evaluate(() => window.__cataractSim.review);
  expect(Object.values(data.stages).map((s) => s.status)).toEqual(Array(7).fill('pending'));
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

test('notes, issues and status persist, export with the model version and import back', async ({ page }, info) => {
  await open(page);
  await panel(page).locator('[data-r="stage"]').selectOption('3');
  await expect.poll(async () => (await S(page)).stageIndex).toBe(3);
  await panel(page).locator('[data-r="notes"]').fill('Flap fold looks plausible; check tear direction.');
  await panel(page).locator('[data-r="issueText"]').fill('Forceps tip slightly high');
  await panel(page).locator('[data-r="addIssue"]').click();
  await panel(page).locator('[data-r="status"]').selectOption('approved-with-corrections');
  await page.reload();
  await page.waitForFunction(() => window.__csim && window.__csim.getState().state === 'ready');
  await panel(page).locator('[data-r="stage"]').selectOption('3');
  await expect(panel(page).locator('[data-r="notes"]')).toHaveValue('Flap fold looks plausible; check tear direction.');
  await expect(panel(page).locator('.csim-review-issues li')).toHaveCount(1);
  await expect(panel(page).locator('[data-r="status"]')).toHaveValue('approved-with-corrections');
  const [dl] = await Promise.all([page.waitForEvent('download'), panel(page).locator('[data-r="export"]').click()]);
  const file = info.outputPath('review.json');
  await dl.saveAs(file);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(json.format).toBe('csim-clinical-review');
  expect(json.modelVersion).toBe((await S(page)).modelVersion);
  expect(json.stages.capsulorhexis.status).toBe('approved-with-corrections');
  expect(Object.entries(json.stages).filter(([k]) => k !== 'capsulorhexis').every(([, v]) => v.status === 'pending')).toBe(true);
  // import a file from another model version (and with an unknown status -> pending, never approved)
  const other = { ...json, modelVersion: 'csim-anatomy-old', stages: { ...json.stages, phaco: { status: 'super-approved', notes: 'x', issues: [] } } };
  fs.writeFileSync(file, JSON.stringify(other));
  await panel(page).locator('[data-r="importFile"]').setInputFiles(file);
  await expect(panel(page).locator('.csim-review-msg')).toContainText('csim-anatomy-old');
  const data = await page.evaluate(() => window.__cataractSim.review);
  expect(data.stages.phaco.status).toBe('pending');
  fs.writeFileSync(file, '{"not":"a review"}');
  await panel(page).locator('[data-r="importFile"]').setInputFiles(file);
  await expect(panel(page).locator('.csim-review-msg')).toContainText('Could not import');
});
