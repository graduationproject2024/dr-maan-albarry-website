// Persona C — English-speaking mobile user (emulated iPhone 13 viewport/UA in Chromium, touch).
// Arabic home → switch to English → browse cards → open a procedure → launch the 3D simulator → use its controls
// → change theme → return home
import { test } from '@playwright/test';
import { startJourney, prepare, device, rect, swipe, hOverflow, smallTargets } from './harness.js';
import { openUrl, docState, csim, waitCsim, NAME, DOCTOR_NAME } from './site.js';

test.use({ ...device('iPhone 13') });
test.setTimeout(150_000);

test('Persona C — English mobile user', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const j = await startJourney(page, testInfo, {
    id: 'persona-c', persona: 'C — English-speaking mobile user', objective: 'Switch the Arabic site to English, find a procedure, try the 3D simulator, change theme, return home.',
    device: 'iPhone 13 (Playwright descriptor: 390×664, DPR 3, iOS Safari UA) — rendered by Chromium', language: 'ar → en', theme: 'light → dark', startUrl: '/',
  });

  await j.step('Open the Arabic home page', 'Arabic RTL home', async () => {
    const s = await openUrl(page, '/');
    return { actual: `lang=${s.lang} dir=${s.dir}`, ok: s.lang === 'ar' && s.dir === 'rtl' };
  });

  await j.step('Tap the "EN" language button in the header', 'English LTR home at /en/, scrolled to top, English heading', async () => {
    await page.locator('.site-header .lang-switch').tap();
    await page.waitForURL(/\/en\/$/);
    const s = await docState(page);
    return { actual: `${s.path} lang=${s.lang} dir=${s.dir} h1="${s.h1}" y=${s.scrollY}`, ok: s.lang === 'en' && s.dir === 'ltr' && s.h1 === DOCTOR_NAME.en && s.scrollY < 10 };
  }, { shot: true });

  await j.step('Swipe through the procedure cards', 'Seven English cards scroll past; each has a title and a details link ≥44px tall', async () => {
    const cards = page.locator('#procedures .proc-card');
    let cdp = null; const titles = [];
    for (let i = 0; i < 40 && titles.length < 7; i++) {
      cdp = await swipe(page, { x: 195, y: 560, dy: -300, cdp });
      const vis = await cards.evaluateAll((els) => els.filter((e) => { const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }).map((e) => e.querySelector('.proc-card-title').textContent.trim()));
      for (const t of vis) if (!titles.includes(t)) titles.push(t);
    }
    const linkH = await cards.locator('.proc-card-link').evaluateAll((els) => Math.min(...els.map((e) => e.getBoundingClientRect().height)));
    return { actual: `${titles.length} cards seen: ${titles.join(', ')}; smallest link ${Math.round(linkH)}px`, ok: titles.length === 7 && linkH >= 44 };
  }, { shot: true });

  await j.step('Tap "Procedure details" on the cataract card', 'English cataract page', async () => {
    const link = page.locator('#procedures .proc-card-link[href$="procedures/cataract-surgery/"]');
    await link.scrollIntoViewIfNeeded(); await link.tap();
    await page.waitForURL(/\/en\/procedures\/cataract-surgery\/$/);
    await page.locator('#p-anatomy').waitFor();
    const s = await docState(page);
    return { actual: `${s.path} h1="${s.h1}"`, ok: s.h1 === NAME['cataract-surgery'].en };
  });

  await j.step('Look for a way to jump to the 3D walkthrough near the top of the page', 'A visible "3D walkthrough" link within the first two screens', async () => {
    const links = await page.locator('main a[href$="#cataract-3d"]').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { y: Math.round(r.top + scrollY), visible: r.width > 0 && r.height > 0, h: Math.round(r.height) }; }));
    const vh = page.viewportSize().height;
    const usable = links.filter((l) => l.visible && l.y < vh * 2);
    return { actual: `${links.length} in-page links to #cataract-3d; visible within 2 screens: ${JSON.stringify(usable)}`, ok: usable.length > 0 && usable.every((l) => l.h >= 44) };
  }, { critical: false });

  await j.step('Reach the 3D section (shortcut link if present, otherwise swipe) and tap "Start the 3D experience"', 'The 3D viewer mounts in English and is ready', async () => {
    const shortcut = page.locator('main a[href$="#cataract-3d"]').filter({ visible: true }).first();
    let how;
    if (await shortcut.count() && (await rect(shortcut)).y < page.viewportSize().height * 2) {
      await shortcut.scrollIntoViewIfNeeded(); await shortcut.tap(); await page.waitForTimeout(800); how = 'shortcut link';
    } else {
      let cdp = null, n = 0;
      const btn = page.locator('#cataract-3d-start');
      while (n < 80) { const r = await rect(btn); if (r.y > 60 && r.bottom < page.viewportSize().height - 80) break; cdp = await swipe(page, { x: 195, y: 560, dy: -420, cdp }); n++; }
      how = `${n} swipes`;
    }
    await page.locator('#cataract-3d-start').tap();
    const s = await waitCsim(page, ['ready'], 40000);
    const title = await page.locator('#cataract-3d-stage .csim-title').innerText();
    return { actual: `reached via ${how}; state=${s.state}; title="${title}"; stage "${s.stageTitle}"`, ok: s.state === 'ready' && /[A-Za-z]/.test(title) };
  }, { shot: true, timeout: 90000 });

  await j.step('Tap Next twice, then Previous once', 'Stage counter goes 1 → 3 → 2 and the panel text follows', async () => {
    const next = page.locator('#cataract-3d-stage [data-ref="next"]'), prev = page.locator('#cataract-3d-stage [data-ref="prev"]');
    const a = (await csim(page)).stageNum;
    await next.tap(); await page.waitForTimeout(250); await next.tap(); await page.waitForTimeout(250);
    const b = (await csim(page)).stageNum;
    await prev.tap(); await page.waitForTimeout(250);
    const c = await csim(page);
    return { actual: `${a} → ${b} → ${c.stageNum} ("${c.stageTitle}")`, ok: /1 of 7/.test(a) && /3 of 7/.test(b) && /2 of 7/.test(c.stageNum) };
  });

  await j.step('Tap Play, wait, then drag the timeline scrubber to the middle', 'Playback runs; scrubbing jumps to a later stage', async () => {
    await page.locator('#cataract-3d-stage [data-ref="playPause"]').tap();
    await page.waitForTimeout(1200);
    const a = await csim(page);
    const sc = page.locator('#cataract-3d-stage [data-ref="scrubber"]');
    const r = await rect(sc);
    await page.touchscreen.tap(r.x + r.w * 0.6, r.y + r.h / 2);
    await page.waitForTimeout(500);
    const b = await csim(page);
    return { actual: `playing mode=${a.mode} scrubber=${a.scrubber}; after tap at 60% scrubber=${b.scrubber}, ${b.stageNum}`, ok: a.mode === 'pause' && b.scrubber > 450 };
  });

  await j.step('Tap the theme switch in the header', 'Site and 3D viewer switch to dark; choice saved', async () => {
    await page.locator('#theme-toggle-btn').tap();
    await page.waitForTimeout(200);
    const site = await page.evaluate(() => document.documentElement.dataset.theme);
    const sim = await page.locator('#cataract-3d-stage .csim').getAttribute('data-theme');
    const saved = await page.evaluate(() => localStorage.getItem('theme'));
    return { actual: `site=${site}, 3D=${sim}, saved=${saved}`, ok: site === 'dark' && sim === 'dark' && saved === 'dark' };
  }, { shot: true });

  await j.step('Check the 3D controls on this phone', 'Controls ≥44px, nothing overflows', async () => {
    const small = await smallTargets(page, '#cataract-3d-stage .csim');
    const ov = await hOverflow(page);
    return { actual: `${small.length} small targets${small.length ? ': ' + small.slice(0, 4).join('; ') : ''}; overflow ${ov}px`, ok: small.length === 0 && ov <= 0 };
  }, { critical: false });

  await j.step('Scroll up and tap the "Dr. Maan Al Barry" wordmark', 'Back on the English home at the top, still dark; at most one 3D instance alive (the home page also hosts the 3D section, so the open viewer is carried over by design)', async () => {
    await page.mouse.wheel(0, -20000);
    await page.waitForTimeout(300);
    await page.locator('.site-header .wordmark').tap();
    await page.waitForURL(/\/en\/$/);
    const s = await docState(page);
    const gl = await page.evaluate(() => window.__glLive());
    const c = await csim(page);
    return { actual: `${s.path} lang=${s.lang} theme=${s.theme} y=${s.scrollY}; 3D instances=${c.mounted ? c.instances : 0}; live WebGL contexts=${gl.live}`, ok: s.path === '/en/' && s.lang === 'en' && s.theme === 'dark' && (!c.mounted || c.instances === 1) };
  }, { shot: true });

  await j.finish();
});
