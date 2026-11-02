// Persona E — keyboard-only user with reduced motion (Desktop Chrome descriptor, 1366×768, English, then Arabic).
// keyboard path → headings & accessible names (accessibility snapshot) → procedure page → non-3D text →
// simulator stages via keyboard → back to booking. Checks focus order, focus visibility, no traps, reduced motion.
// NOT a screen-reader test: no assistive technology was run; names/roles come from the browser's accessibility tree.
import { test } from '@playwright/test';
import { startJourney, prepare, device, intercepted } from './harness.js';
import { openUrl, docState, csim, waitCsim, BOOKING } from './site.js';

test.use({ ...device('Desktop Chrome'), viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
test.setTimeout(180_000);

// Two animation frames let :focus / :focus-visible styles apply before measuring (headless pages may get
// window focus a frame late; measuring synchronously after the key event can read pre-focus styles).
const focused = (page) => page.evaluate(async () => {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const el = document.activeElement;
  if (!el || el === document.body) return { tag: 'body' };
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const has = (st) => (st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) >= 1) || (st.boxShadow && st.boxShadow !== 'none');
  // a ring may be drawn on the element, or on its ::after (stretched card links draw it around the card)
  const ring = has(cs) || has(getComputedStyle(el, '::after')) || has(getComputedStyle(el, '::before'));
  const name = (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  return { tag: el.tagName.toLowerCase(), id: el.id, ref: el.dataset ? el.dataset.ref : undefined, cls: String(el.className).split(' ')[0], name, ring, inView: r.bottom > 0 && r.top < innerHeight && r.width > 0, href: el.getAttribute('href') };
});

async function tabUntil(page, pred, max = 120, key = 'Tab') {
  const trail = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key);
    const f = await focused(page);
    trail.push(f);
    if (pred(f)) return { found: f, trail };
  }
  return { found: null, trail };
}

test('Persona E — keyboard and reduced motion', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const j = await startJourney(page, testInfo, {
    id: 'persona-e', persona: 'E — keyboard-only user, reduced motion', objective: 'Reach a procedure, read it, step through the 3D stages and reach booking using only the keyboard.',
    device: 'Desktop Chrome descriptor (1366×768, mouse never used)', language: 'en', theme: 'light', accessibilityMode: 'keyboard only + prefers-reduced-motion: reduce (no screen reader)', startUrl: '/en/',
  });

  await j.step('Open /en/ and press Tab once', 'The first stop is a visible "Skip to content" link with a focus ring', async () => {
    await openUrl(page, '/en/');
    await page.keyboard.press('Tab');
    const f = await focused(page);
    return { actual: `focus: ${f.tag}.${f.cls} "${f.name}" ring=${f.ring} inView=${f.inView}`, ok: f.cls === 'skip-link' && f.ring && f.inView };
  }, { shot: true });

  await j.step('Press Enter on the skip link', 'Focus moves to the main content', async () => {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    const f = await focused(page);
    return { actual: `focus: ${f.tag}#${f.id}`, ok: f.id === 'main' };
  });

  await j.step('Read headings and names from the accessibility tree', 'One h1; heading levels never skip; every button/link has a name', async () => {
    const snap = await page.locator('body').ariaSnapshot();
    const fs = await import('node:fs');
    fs.writeFileSync(`${j.shotDir}/aria-snapshot-home-en.yml`, snap);
    const levels = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3, main h4')].filter((h) => h.getClientRects().length).map((h) => Number(h.tagName[1])));
    let skips = 0; for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips++;
    const unnamedButtons = (snap.match(/- button(\s*\[[^\]]*\])?:?\s*$/gm) || []).length + (snap.match(/- link(\s*\[[^\]]*\])?:?\s*$/gm) || []).length;
    const h1 = levels.filter((l) => l === 1).length;
    return { actual: `h1 count=${h1}; ${levels.length} headings; level skips=${skips}; unnamed buttons/links in snapshot=${unnamedButtons}; snapshot saved (${snap.length} chars)`, ok: h1 === 1 && skips === 0 && unnamedButtons === 0 };
  }, { critical: false });

  let order = [];
  await j.step('Tab through the header', 'Focus visits wordmark → nav links → language → theme → Book, each with a visible ring, in visual order', async () => {
    await page.keyboard.press('Shift+Tab'); // back from main to the skip link area
    await openUrl(page, '/en/');
    const { trail } = await tabUntil(page, (f) => f.cls === 'btn', 14);
    order = trail.map((f) => `${f.cls || f.tag}:${f.name}`);
    const noRing = trail.filter((f) => !f.ring || !f.inView);
    return { actual: `${order.join(' → ')}; without visible ring: ${noRing.length}`, ok: noRing.length === 0 && trail.length >= 8 };
  }, { shot: true });

  await j.step('Keep tabbing to the cataract card\'s "Procedure details" link and press Enter', 'Cataract page opens; focus lands on the main heading area', async () => {
    const { found, trail } = await tabUntil(page, (f) => /procedures\/cataract-surgery\/$/.test(f.href || '') && f.cls === 'proc-card-link', 80);
    if (!found) return { actual: `not reached in ${trail.length} tabs`, ok: false };
    const noRing = trail.filter((f) => !f.ring);
    await page.keyboard.press('Enter');
    await page.waitForURL(/en\/procedures\/cataract-surgery\/$/);
    await page.locator('#p-anatomy').waitFor();
    await page.waitForTimeout(200);
    const f = await focused(page);
    const s = await docState(page);
    return { actual: `reached after ${trail.length} tabs (${noRing.length} stops without ring: ${noRing.slice(0, 3).map((x) => x.cls + ':' + x.name).join(', ')}); now ${s.path} h1="${s.h1}", focus ${f.tag}#${f.id}`, ok: noRing.length === 0 && s.h1 === 'Cataract surgery' && (f.id === 'main' || f.tag === 'h1') };
  });

  await j.step('Tab to "Risks and possible complications" in the page contents and press Enter', 'Jumps instantly (reduced motion) to the risks section; text readable without the 3D', async () => {
    const { found, trail } = await tabUntil(page, (f) => /#p-risks$/.test(f.href || ''), 40);
    if (!found) return { actual: `TOC link not reached in ${trail.length} tabs`, ok: false };
    await page.keyboard.press('Enter');
    await page.waitForTimeout(60);
    const top = await page.locator('#p-risks').evaluate((el) => Math.round(el.getBoundingClientRect().top));
    const items = await page.locator('#p-risks li').count();
    return { actual: `#p-risks top ${top}px after 60 ms (instant scroll); ${items} risk items`, ok: top >= 0 && top < 200 && items > 2 };
  }, { shot: true });

  await j.step('Tab to "Start the 3D experience" and press Enter', 'The 3D viewer loads and keyboard focus stays in a sensible place', async () => {
    const { found } = await tabUntil(page, (f) => f.id === 'cataract-3d-start', 80);
    if (!found) return { actual: 'start button not reached', ok: false };
    await page.keyboard.press('Enter');
    const s = await waitCsim(page, ['ready'], 40000);
    return { actual: `state=${s.state}`, ok: s.state === 'ready' };
  }, { shot: true });

  await j.step('Check where keyboard focus is after the viewer opened', 'Focus is kept (start button) or moved into the viewer — never dropped to <body>', async () => {
    const f = await focused(page);
    return { actual: `focus: ${f.tag}${f.id ? '#' + f.id : ''}.${f.cls || ''} "${f.name || ''}"`, ok: f.tag !== 'body' };
  }, { critical: false });

  await j.step('Tab into the 3D viewer and use the arrow keys to change stage', 'ArrowRight → stage 2, ArrowRight → stage 3, ArrowLeft → stage 2; announced in the live region', async () => {
    const { found } = await tabUntil(page, (f) => f.cls === 'csim-viewport', 30);
    if (!found) return { actual: 'viewport not focusable', ok: false };
    const seq = [];
    for (const k of ['ArrowRight', 'ArrowRight', 'ArrowLeft']) { await page.keyboard.press(k); await page.waitForTimeout(150); seq.push((await csim(page)).stageNum); }
    const live = await page.locator('#cataract-3d-stage [data-ref="live"]').innerText();
    return { actual: `${seq.join(' → ')}; live region: "${live}"`, ok: /2 of 7/.test(seq[0]) && /3 of 7/.test(seq[1]) && /2 of 7/.test(seq[2]) && live.length > 0 };
  });

  await j.step('Press Space on the viewer to play, then Space to pause', 'Play/pause toggles from the keyboard', async () => {
    await page.keyboard.press('Space'); await page.waitForTimeout(600);
    const a = await csim(page);
    await page.keyboard.press('Space'); await page.waitForTimeout(200);
    const b = await csim(page);
    return { actual: `after 1st Space mode=${a.mode}, after 2nd mode=${b.mode}`, ok: a.mode === 'pause' && b.mode === 'play' };
  });

  await j.step('Tab through every control in the viewer and out the other side', 'No keyboard trap: focus leaves the viewer; every stop has a visible ring', async () => {
    const { found, trail } = await tabUntil(page, (f) => !['csim'].some((c) => (f.cls || '').startsWith(c)) && f.tag !== 'input' && f.tag !== 'summary', 60);
    const inside = trail.slice(0, -1);
    const noRing = inside.filter((f) => !f.ring);
    return { actual: `${inside.length} stops inside the viewer, then left to ${found ? found.cls + ':' + found.name : 'NOWHERE'}; stops without ring: ${noRing.map((f) => f.cls + ':' + f.name).slice(0, 4).join(', ') || 'none'}`, ok: !!found && noRing.length === 0 };
  });

  await j.step('Shift+Tab back to "Back to site" (close) and press Enter', 'Viewer closes and focus returns to the Start button', async () => {
    let f; const back = [];
    for (let i = 0; i < 60; i++) { await page.keyboard.press('Shift+Tab'); f = await focused(page); back.push(`${f.cls}:${f.name}`); if (f.ref === 'close') break; }
    if (f.ref !== 'close') return { actual: `close button not reached; Shift+Tab trail: ${[...new Set(back)].slice(-14).join(' ← ')}`, ok: false };
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    const g = await focused(page);
    const s = await csim(page);
    return { actual: `mounted=${s.mounted}; focus ${g.tag}#${g.id}`, ok: !s.mounted && g.id === 'cataract-3d-start' };
  });

  await j.step('Keep tabbing to "Book appointment" in the closing band and press Enter', 'Targets the booking portal (intercepted)', async () => {
    const { found } = await tabUntil(page, (f) => f.href === BOOKING && f.cls === 'btn', 60);
    if (!found) return { actual: 'not reached', ok: false };
    await page.keyboard.press('Enter');
    const hits = await intercepted(page);
    return { actual: `→ ${hits.length ? hits[hits.length - 1].href : 'nothing'}`, ok: hits.length > 0 && hits[hits.length - 1].href === BOOKING };
  }, { shot: true });

  await j.step('Switch to Arabic with the keyboard and check the skip link + drawer at 390 px', 'Arabic page; at phone width the menu opens/closes with Enter/Escape and returns focus', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openUrl(page, '/en/');
    const { found } = await tabUntil(page, (f) => f.cls === 'icon-btn' && /العربية/.test(f.name), 10);
    if (!found) return { actual: 'language button not reached', ok: false };
    await page.keyboard.press('Enter'); await page.waitForURL(/localhost:\d+\/$/);
    const { found: menu } = await tabUntil(page, (f) => f.cls === 'icon-btn' && /القائمة/.test(f.name), 10, 'Shift+Tab'); // focus is on <main> after the switch
    if (!menu) return { actual: 'menu button not reached', ok: false };
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    const open = await page.locator('#mobile-nav').evaluate((n) => n.classList.contains('open'));
    await page.keyboard.press('Tab');
    const inDrawer = await page.evaluate(() => !!document.activeElement.closest('#mobile-nav'));
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    const closed = await page.locator('#mobile-nav').evaluate((n) => !n.classList.contains('open'));
    const f = await focused(page);
    return { actual: `lang=${(await docState(page)).lang}; drawer open=${open}; next Tab inside drawer=${inDrawer}; Escape closed=${closed}; focus back on ${f.cls}:${f.name}`, ok: open && inDrawer && closed && /القائمة/.test(f.name) };
  }, { shot: true });

  await j.finish();
});
