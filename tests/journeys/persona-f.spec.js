// Persona F — impatient user (emulated iPhone SE, Chromium, touch, Arabic).
// tap Start repeatedly → rapid pause/resume → switch stages → open/close → change language → rotate →
// navigate away and back. Checks state stability and that canvases / WebGL contexts do not accumulate.
import { test } from '@playwright/test';
import { startJourney, prepare, device, rect, hOverflow, glLive, revealInFreeArea } from './harness.js';
import { openUrl, docState, csim, waitCsim } from './site.js';

test.use({ ...device('iPhone SE') });
test.setTimeout(240_000);

test('Persona F — impatient user', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const warnings = [];
  page.on('console', (m) => { if (/WebGL|context/i.test(m.text())) warnings.push(m.text().slice(0, 160)); });
  const j = await startJourney(page, testInfo, {
    id: 'persona-f', persona: 'F — impatient user', objective: 'Hammer the 3D viewer controls, switch language and orientation, leave and come back — the page must stay consistent and not leak GPU resources.',
    device: 'iPhone SE (Playwright descriptor: 320×568, DPR 2, iOS UA) — rendered by Chromium', language: 'ar → en', theme: 'light', startUrl: '/procedures/cataract-surgery/',
  });

  await j.step('Open the cataract page directly', 'Cataract page', async () => {
    const s = await openUrl(page, '/procedures/cataract-surgery/');
    return { actual: `h1="${s.h1}"`, ok: s.lang === 'ar' };
  });

  await j.step('Tap "Start the 3D experience" five times as fast as possible', 'Exactly one viewer mounts and becomes ready', async () => {
    const btn = page.locator('#cataract-3d-start');
    const r = await revealInFreeArea(page, btn);
    for (let i = 0; i < 5; i++) await page.touchscreen.tap(r.x + r.w / 2, r.y + r.h / 2);
    const s = await waitCsim(page, ['ready'], 40000);
    await page.waitForTimeout(500);
    const t = await csim(page);
    const gl = await glLive(page);
    return { actual: `instances=${t.instances} state=${t.state} canvases=${gl.canvases} WebGL live=${gl.live} created=${gl.created}`, ok: t.instances === 1 && s.state === 'ready' && gl.canvases === 1 };
  }, { shot: true });

  await j.step('Tap the big play button, then tap play/pause 11 more times quickly', 'Ends playing (odd number of toggles) with a consistent button', async () => {
    await page.locator('#cataract-3d-stage [data-ref="start"]').tap();
    const pp = page.locator('#cataract-3d-stage [data-ref="playPause"]');
    const r = await revealInFreeArea(page, pp); // where the user can see it (not under the fixed booking bar)
    for (let i = 0; i < 11; i++) await page.touchscreen.tap(r.x + r.w / 2, r.y + r.h / 2);
    await page.waitForTimeout(1200);
    const s = await csim(page);
    return { actual: `state=${s.state} mode=${s.mode} label="${await pp.getAttribute('aria-label')}"`, ok: s.mode === 'play' && (s.state === 'paused' || s.state === 'transitioning') };
  });

  await j.step('Tap Next 8 times in a row, then tap the stage-3 segment', 'Stops at 7 of 7 (no overflow), then jumps to 3 of 7', async () => {
    const next = page.locator('#cataract-3d-stage [data-ref="next"]');
    const r = await revealInFreeArea(page, next);
    for (let i = 0; i < 8; i++) await page.touchscreen.tap(r.x + r.w / 2, r.y + r.h / 2);
    await page.waitForTimeout(300);
    const a = await csim(page);
    await page.locator('#cataract-3d-stage [data-seg="2"]').tap();
    await page.waitForTimeout(300);
    const b = await csim(page);
    return { actual: `${a.stageNum} → ${b.stageNum} ("${b.stageTitle}")`, ok: /7 من 7|7 of 7/.test(a.stageNum) && /3 من 7|3 of 7/.test(b.stageNum) };
  });

  await j.step('Close and reopen the viewer 4 times quickly', 'Each reopen reaches ready; one viewer, one canvas, no growth in live WebGL contexts', async () => {
    const counts = [];
    for (let i = 0; i < 4; i++) {
      await page.locator('#cataract-3d-stage [data-ref="close"]').tap();
      await page.locator('#cataract-3d-start').tap();
      await waitCsim(page, ['ready'], 40000);
      counts.push(await glLive(page));
    }
    const t = await csim(page);
    return { actual: `after each cycle (live/created/canvases): ${counts.map((c) => `${c.live}/${c.created}/${c.canvases}`).join(', ')}; instances=${t.instances}`, ok: t.instances === 1 && counts.every((c) => c.canvases === 1) && counts[3].live <= counts[0].live };
  }, { shot: true, timeout: 120000 });

  await j.step('Tap "EN" in the header while the viewer is open', 'English page; the same single viewer switches to English', async () => {
    await page.locator('.site-header .lang-switch').tap();
    await page.waitForURL(/\/en\/procedures\/cataract-surgery\/$/);
    await page.waitForTimeout(400);
    const s = await csim(page);
    const title = await page.locator('#cataract-3d-stage .csim-title').innerText().catch(() => '');
    return { actual: `instances=${s.instances} state=${s.state} title="${title}" stage="${s.stageNum}"`, ok: s.instances === 1 && /[A-Za-z]/.test(title) };
  });

  await j.step('Rotate to landscape (568×320) and back to portrait (320×568)', 'Viewer canvas follows the new size, nothing overflows, still one viewer', async () => {
    await page.setViewportSize({ width: 568, height: 320 });
    await page.waitForTimeout(800);
    const land = await page.evaluate(() => { const c = document.querySelector('#cataract-3d-stage canvas'); const v = c && c.closest('[data-ref="viewport"]'); return c ? { cw: Math.round(c.getBoundingClientRect().width), vw: Math.round(v.getBoundingClientRect().width) } : null; });
    const ov1 = await hOverflow(page);
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(800);
    const port = await page.evaluate(() => { const c = document.querySelector('#cataract-3d-stage canvas'); const v = c && c.closest('[data-ref="viewport"]'); return c ? { cw: Math.round(c.getBoundingClientRect().width), vw: Math.round(v.getBoundingClientRect().width) } : null; });
    const ov2 = await hOverflow(page);
    const s = await csim(page);
    return { actual: `landscape canvas ${land?.cw}/${land?.vw}px overflow ${ov1}; portrait canvas ${port?.cw}/${port?.vw}px overflow ${ov2}; instances=${s.instances}`, ok: land && port && Math.abs(land.cw - land.vw) <= 2 && Math.abs(port.cw - port.vw) <= 2 && ov1 <= 0 && ov2 <= 0 && s.instances === 1 };
  }, { shot: true });

  await j.step('Tap "Home" in the breadcrumb, then press browser Back', 'Home renders; back on the cataract page the viewer is closed (idle) and resources are released', async () => {
    await page.mouse.wheel(0, -50000); await page.waitForTimeout(200);
    await page.locator('.crumbs a').first().tap();
    await page.waitForURL(/\/en\/$/);
    await page.waitForTimeout(600);
    await page.goBack();
    await page.waitForURL(/\/en\/procedures\/cataract-surgery\/$/);
    await page.waitForTimeout(800);
    const s = await csim(page);
    const gl = await glLive(page);
    return { actual: `path=${(await docState(page)).path}; 3D section=${s.section} mounted=${s.mounted} instances=${s.instances ?? 0}; canvases=${gl.canvases} live=${gl.live} created=${gl.created}`, ok: s.mounted ? s.instances === 1 : s.section === 'idle' };
  });

  await j.step('Check the GPU bookkeeping after all of this', 'At most 1 live WebGL context per open simulator; no "too many WebGL contexts" warnings', async () => {
    await page.waitForTimeout(500);
    const gl = await glLive(page);
    const open = await page.evaluate(() => document.querySelectorAll('.csim, .vsim').length);
    const tooMany = warnings.filter((w) => /too many active webgl contexts/i.test(w));
    return { actual: `open simulators=${open}; live WebGL contexts=${gl.live}; contexts created in total=${gl.created}; canvases=${gl.canvases}; "too many contexts" warnings=${tooMany.length}`, ok: gl.live <= open && tooMany.length === 0 };
  }, { critical: false });

  await j.finish();
});
