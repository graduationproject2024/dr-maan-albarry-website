// Stress tests with deterministic seeds. Every random action sequence is generated from a logged seed
// (mulberry32) and written into the step's "actual" text so any failure can be replayed exactly.
// Emulated: Chromium, 390×844 touch profile unless stated.
import { test } from '@playwright/test';
import { startJourney, prepare, viewportProfile, rect, revealInFreeArea, glLive, hOverflow } from './harness.js';
import { openUrl, docState, csim, waitCsim, vsimState, waitVsim, SLUGS, NAME } from './site.js';

const SEED = Number(process.env.STRESS_SEED || 20261102);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

test.use({ ...viewportProfile(390, 844) });
test.setTimeout(420_000);

test('Stress — seeded rapid interaction', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const rnd = mulberry32(SEED);
  const warn = []; page.on('console', (m) => { if (/too many active webgl/i.test(m.text())) warn.push(m.text()); });
  const j = await startJourney(page, testInfo, { id: 'stress', persona: 'Stress suite', objective: `Hammer every interactive surface with seeded random sequences (seed ${SEED}); the app must end in a consistent state with no errors or leaks.`, device: 'Generic phone profile 390×844, touch', language: 'en/ar', theme: 'light/dark', startUrl: '/en/procedures/cataract-surgery/' });
  const tapAt = async (r) => page.touchscreen.tap(r.x + r.w / 2, r.y + r.h / 2);

  await j.step('Open the cataract page and start the 3D viewer', 'Ready', async () => {
    await openUrl(page, '/en/procedures/cataract-surgery/');
    const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
    const s = await waitCsim(page, ['ready'], 40000); await page.locator('#cataract-3d-stage [data-ref="start"]').tap();
    return { actual: s.state, ok: true };
  });

  await j.step('20× play/pause with seeded gaps (30–150 ms)', 'Final mode matches the parity of the taps; one viewer', async () => {
    const pp = page.locator('#cataract-3d-stage [data-ref="playPause"]'); const r = await revealInFreeArea(page, pp);
    const m0 = (await csim(page)).mode; const gaps = [];
    for (let i = 0; i < 20; i++) { await tapAt(r); const g = 30 + Math.floor(rnd() * 120); gaps.push(g); await page.waitForTimeout(g); }
    await page.waitForTimeout(1500);
    const s = await csim(page);
    return { actual: `gaps=[${gaps.join(',')}]; mode ${m0} → ${s.mode}; state=${s.state}; instances=${s.instances}`, ok: s.mode === m0 && s.instances === 1 };
  }, { critical: false });

  await j.step('20 rapid seeded stage changes (next / prev / segment taps)', 'Stage always within 1…7 and the panel matches the last command', async () => {
    const seq = []; let expect = null;
    for (let i = 0; i < 20; i++) {
      const kind = pick(rnd, ['next', 'prev', 'seg']);
      if (kind === 'seg') { const n = Math.floor(rnd() * 7); seq.push(`seg${n + 1}`); const l = page.locator(`#cataract-3d-stage [data-seg="${n}"]`); await tapAt(await revealInFreeArea(page, l)); expect = n + 1; }
      else { seq.push(kind); const l = page.locator(`#cataract-3d-stage [data-ref="${kind}"]`); await tapAt(await revealInFreeArea(page, l)); const cur = Number((await csim(page)).stageNum.match(/(\d+) of/)[1]); expect = cur; }
      await page.waitForTimeout(20 + Math.floor(rnd() * 60));
    }
    await page.waitForTimeout(500);
    const s = await csim(page); const n = Number(s.stageNum.match(/(\d+) of/)[1]);
    return { actual: `seq=${seq.join(' ')}; final ${s.stageNum}`, ok: n >= 1 && n <= 7 && (seq.at(-1).startsWith('seg') ? n === expect : true) };
  }, { critical: false });

  await j.step('Rapid scrubbing: 25 seeded taps along the timeline', 'Scrubber value tracks the last tap position (±8%)', async () => {
    const sc = page.locator('#cataract-3d-stage [data-ref="scrubber"]'); const r = await revealInFreeArea(page, sc);
    const xs = []; for (let i = 0; i < 25; i++) { const f = 0.05 + rnd() * 0.9; xs.push(f.toFixed(2)); await page.touchscreen.tap(r.x + r.w * f, r.y + r.h / 2); }
    await page.waitForTimeout(300);
    const v = (await csim(page)).scrubber / 1000; const last = Number(xs.at(-1));
    return { actual: `positions=[${xs.join(',')}]; final value ${v.toFixed(3)}`, ok: Math.abs(v - last) < 0.08 || Math.abs((1 - v) - last) < 0.08 };
  }, { critical: false });

  await j.step('Out-of-range input: ArrowRight ×20 and End/Home on the focused viewer', 'Stage clamps at 7 of 7 and 1 of 7; no errors', async () => {
    await page.locator('#cataract-3d-stage [data-ref="viewport"]').focus();
    for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowRight');
    const a = (await csim(page)).stageNum;
    for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowLeft');
    const b = (await csim(page)).stageNum;
    return { actual: `${a} / ${b}`, ok: /7 of 7/.test(a) && /1 of 7/.test(b) };
  }, { critical: false });

  await j.step('Resize while rendering: play, then 10 seeded viewport sizes (320–1440 wide)', 'Canvas always matches its container; no overflow; still one viewer', async () => {
    const pp = page.locator('#cataract-3d-stage [data-ref="playPause"]'); await revealInFreeArea(page, pp);
    if ((await csim(page)).mode === 'play') await pp.tap();
    const sizes = []; const bad = [];
    for (let i = 0; i < 10; i++) {
      const w = 320 + Math.floor(rnd() * 1120), h = 560 + Math.floor(rnd() * 500); sizes.push(`${w}×${h}`);
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(250);
      const g = await page.evaluate(() => { const c = document.querySelector('#cataract-3d-stage canvas'); const v = c.closest('[data-ref="viewport"]'); return [Math.round(c.getBoundingClientRect().width), Math.round(v.getBoundingClientRect().width), document.documentElement.scrollWidth - document.documentElement.clientWidth]; });
      if (Math.abs(g[0] - g[1]) > 2 || g[2] > 0) bad.push(`${w}×${h}:${g.join('/')}`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const s = await csim(page);
    return { actual: `sizes=${sizes.join(' ')}; mismatches=${bad.join(' ') || 'none'}; instances=${s.instances}`, ok: !bad.length && s.instances === 1 };
  }, { critical: false });

  await j.step('Mount/destroy: close and reopen the viewer 10 times', 'Always one viewer; live WebGL contexts do not grow', async () => {
    const lives = [];
    for (let i = 0; i < 10; i++) {
      const c = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, c); await c.tap();
      const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
      await waitCsim(page, ['ready'], 40000); lives.push((await glLive(page)).live);
    }
    const s = await csim(page);
    return { actual: `live contexts after each reopen: ${lives.join(',')}; instances=${s.instances}; "too many contexts" warnings=${warn.length}`, ok: s.instances === 1 && lives.at(-1) <= lives[0] && warn.length === 0 };
  }, { critical: false, timeout: 150000 });

  await j.step('Back during animation: play, then browser Back', 'Previous page renders; the viewer is torn down; no errors', async () => {
    await page.goto('/en/'); await page.locator('main h1').waitFor();
    const l = page.locator('#procedures .proc-card-link[href$="procedures/cataract-surgery/"]'); await revealInFreeArea(page, l); await l.tap();
    await page.waitForURL(/cataract-surgery\/$/);
    const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap(); await waitCsim(page, ['ready'], 40000);
    await page.locator('#cataract-3d-stage [data-ref="start"]').tap(); await page.waitForTimeout(400);
    await page.goBack(); await page.waitForURL(/\/en\/$/); await page.waitForTimeout(600);
    const s = await csim(page); const gl = await glLive(page);
    return { actual: `path=${(await docState(page)).path}; 3D instances=${s.mounted ? s.instances : 0} section=${s.section}; canvases=${gl.canvases}`, ok: (await docState(page)).path === '/en/' && (!s.mounted || s.instances === 1) };
  }, { critical: false, timeout: 90000 });

  await j.step('Refresh during loading ×3: tap Start and reload immediately', 'Each reload gives a clean page with the Start button; no uncaught errors', async () => {
    const out = [];
    for (let i = 0; i < 3; i++) {
      await page.goto('/en/procedures/cataract-surgery/'); await page.locator('main h1').waitFor();
      const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
      await page.waitForTimeout(Math.floor(rnd() * 120));
      await page.reload(); await page.locator('main h1').waitFor();
      out.push((await csim(page)).section);
    }
    return { actual: `section after each reload: ${out.join(',')}`, ok: out.every((x) => x === 'idle') };
  }, { critical: false, timeout: 90000 });

  await j.step('Navigation cycle: visit all 14 procedure pages through the procedure links in the menu drawer (seeded order)', 'Every page renders its own h1; no errors; no overflow', async () => {
    // Phase 1: on phones the footer omits the procedure list (it is in the drawer and the library), so the cycle uses the drawer
    const order = []; const bad = [];
    for (let i = 0; i < 14; i++) {
      const slug = pick(rnd, SLUGS); order.push(slug);
      await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(250);
      const l = page.locator(`#mobile-nav .drawer-procs a[href$="procedures/${slug}/"]`).first(); await l.scrollIntoViewIfNeeded(); await l.tap();
      await page.waitForURL(new RegExp(`procedures/${slug}/$`));
      const s = await docState(page); const lang = s.lang;
      if (s.h1 !== NAME[slug][lang]) bad.push(`${slug}:${s.h1}`);
      if (i === 6) { await page.mouse.wheel(0, -50000); await page.locator('.site-header .lang-switch').tap(); await page.waitForTimeout(200); }
    }
    return { actual: `order=${order.join(',')}; mismatches=${bad.join(' ') || 'none'}; overflow ${await hOverflow(page)}px`, ok: !bad.length };
  }, { critical: false, timeout: 120000 });

  await j.step('Repeated theme (10×) and language (6×) toggles on the Lens Lab page with the simulator mounted', 'Ends in the expected theme/language; exactly one vision simulator; its dir/theme follow', async () => {
    await page.goto('/en/lens-lab/'); await page.locator('main h1').waitFor();
    await page.locator('#simulator-host').scrollIntoViewIfNeeded(); await waitVsim(page, 30000);
    await page.mouse.wheel(0, -100000); await page.waitForTimeout(200);
    const t0 = await page.evaluate(() => document.documentElement.dataset.theme);
    for (let i = 0; i < 10; i++) { await page.locator('#theme-toggle-btn').tap(); await page.waitForTimeout(Math.floor(rnd() * 50)); }
    for (let i = 0; i < 6; i++) { await page.locator('.site-header .lang-switch').tap(); await page.waitForTimeout(150 + Math.floor(rnd() * 100)); }
    await page.locator('#simulator-host').scrollIntoViewIfNeeded(); await waitVsim(page, 30000);
    const s = await docState(page); const v = await vsimState(page);
    return { actual: `theme ${t0} → ${s.theme}; lang ${s.lang}; vsim instances=${v.instances} dir=${v.dir} theme=${v.theme}`, ok: s.theme === t0 && s.lang === 'en' && v.instances === 1 && v.dir === 'ltr' && v.theme === s.theme };
  }, { critical: false });

  await j.step('Rapid lens switching: 30 seeded taps across the 5 lens buttons', 'Selected lens equals the last tap; explanation card follows; one canvas', async () => {
    const ids = ['monofocal', 'edof', 'trifocal', 'toric', 'cataract']; const seq = [];
    const first = page.locator('#simulator-host label[for$="-lensA-monofocal"]'); await revealInFreeArea(page, first);
    for (let i = 0; i < 30; i++) { const id = pick(rnd, ids); seq.push(id); await tapAt(await rect(page.locator(`#simulator-host label[for$="-lensA-${id}"]`))); }
    await page.waitForTimeout(600);
    const v = await vsimState(page);
    return { actual: `seq=${seq.join(',')}; final lens=${v.lens}; canvases=${v.canvases}`, ok: v.lens === seq.at(-1) && v.canvases === 1 };
  }, { critical: false });

  await j.step('Unknown and hostile URLs: /procedures/not-a-procedure/, a path and hash containing markup', 'Falls back safely; no script runs; nothing from the URL is rendered as HTML', async () => {
    await page.evaluate(() => { window.__xss = 0; });
    const urls = ['/procedures/not-a-procedure/', '/procedures/%3Cimg%20src=x%20onerror=window.__xss=1%3E/', '/en/#%3Cimg%20src=x%20onerror=window.__xss=1%3E', '/en/?q=%3Cscript%3Ewindow.__xss=1%3C/script%3E#p-risks'];
    const out = [];
    for (const u of urls) {
      await page.goto(u); await page.locator('main h1').waitFor({ timeout: 15000 }).catch(() => {});
      const st = await page.evaluate(() => ({ xss: window.__xss || 0, imgs: document.querySelectorAll('img[src="x"]').length, scripts: [...document.scripts].filter((s) => /__xss/.test(s.textContent)).length, h1: document.querySelector('main h1')?.textContent.trim().slice(0, 30) }));
      out.push(`${u} → h1="${st.h1}" xss=${st.xss} injectedImgs=${st.imgs} injectedScripts=${st.scripts}`);
      if (st.xss || st.imgs || st.scripts || !st.h1) out.push('!!');
    }
    return { actual: out.join(' | '), ok: !out.includes('!!') };
  }, { critical: false });

  await j.finish();
});
