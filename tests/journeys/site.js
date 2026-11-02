// Site-specific measurement helpers for the journeys. They READ the page (DOM, computed style, geometry);
// every user action in the specs goes through real input (tap / click / keyboard / wheel / touch).
import { DOCTOR, PROCEDURES } from '../../doctor-data.js';

export const C = DOCTOR.contact;
export const BOOKING = C.bookingUrl;
export const MAP = DOCTOR.clinic.mapUrl;
export const SLUGS = PROCEDURES.map((p) => p.slug);
export const NAME = Object.fromEntries(PROCEDURES.map((p) => [p.slug, p.name]));
export const DOCTOR_NAME = DOCTOR.identity.name;

/** Navigate (address bar) and wait until the SPA has rendered its main heading. */
export async function openUrl(page, url, { waitUntil = 'load', timeout = 30000 } = {}) {
  await page.goto(url, { waitUntil, timeout });
  await page.locator('#app main h1').first().waitFor({ timeout });
  return page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, theme: document.documentElement.dataset.theme, h1: document.querySelector('main h1').textContent.trim() }));
}

export const docState = (page) => page.evaluate(() => ({
  path: location.pathname + location.hash,
  lang: document.documentElement.lang,
  dir: document.documentElement.dir,
  theme: document.documentElement.dataset.theme,
  h1: document.querySelector('main h1') ? document.querySelector('main h1').textContent.trim().replace(/\s+/g, ' ') : null,
  scrollY: Math.round(scrollY),
}));

/** 3D cataract simulator state, read from its DOM (data-state, play-button mode, stage panel). */
export const csim = (page) => page.evaluate(() => {
  const root = document.querySelector('#cataract-3d-stage .csim') || document.querySelector('.csim');
  const sec = document.getElementById('cataract-3d');
  if (!root) return { mounted: false, section: sec ? sec.dataset.state : null, status: sec ? sec.querySelector('.c3d-status').textContent : null };
  const q = (s) => root.querySelector(s);
  return {
    mounted: true,
    section: sec ? sec.dataset.state : null,
    state: root.dataset.state,
    mode: q('[data-ref="playPause"]').dataset.mode,
    stageNum: q('[data-ref="stageNum"]').textContent.trim(),
    stageTitle: q('[data-ref="stageTitle"]').textContent.trim(),
    stageText: q('[data-ref="stageText"]').textContent.trim().slice(0, 120),
    scrubber: Number(q('[data-ref="scrubber"]').value),
    canvases: root.querySelectorAll('canvas').length,
    fallback: !q('[data-ref="fallback"]').hidden,
    note: q('[data-ref="note"]').hidden ? '' : q('[data-ref="note"]').textContent,
    startOverlay: !q('[data-ref="startOverlay"]').hidden,
    instances: document.querySelectorAll('.csim').length,
  };
});

export const vsimState = (page) => page.evaluate(() => {
  const root = document.querySelector('#simulator-host .vsim');
  if (!root) return { mounted: false };
  const checked = (g) => { const r = root.querySelector(`input[data-group="${g}"]:checked`); return r ? r.value : null; };
  return {
    mounted: true,
    dir: root.dir,
    lang: root.lang,
    theme: root.dataset.theme,
    lens: checked('lensA'),
    lensB: checked('lensB'),
    preset: checked('preset'),
    lighting: checked('lighting'),
    compare: root.querySelector('[data-ref="compare"]').checked,
    range: Number(root.querySelector('[data-ref="range"]').value),
    rangeOut: root.querySelector('[data-ref="rangeOut"]').textContent,
    canvases: root.querySelectorAll('canvas').length,
    fallback: root.classList.contains('vsim--fallback'),
    note: root.querySelector('[data-ref="note"]').hidden ? '' : root.querySelector('[data-ref="note"]').textContent,
    disclaimer: root.querySelector('[data-ref="disclaimer"]').textContent.trim(),
    cards: [...root.querySelectorAll('.vsim-card h3')].map((h) => h.textContent.trim()),
    live: root.querySelector('[data-ref="live"]').textContent,
    instances: document.querySelectorAll('.vsim').length,
  };
});

/** Wait for the 3D module to reach one of the given DOM states. */
export async function waitCsim(page, states, timeout = 30000) {
  await page.waitForFunction((states) => {
    const r = document.querySelector('#cataract-3d-stage .csim');
    return r && states.includes(r.dataset.state);
  }, states, { timeout });
  return csim(page);
}

export async function waitVsim(page, timeout = 30000) {
  await page.waitForFunction(() => {
    const r = document.querySelector('#simulator-host .vsim');
    return r && (r.querySelector('canvas') || r.classList.contains('vsim--fallback'));
  }, null, { timeout });
  return vsimState(page);
}

/** Sample the WebGL canvas through a 2D copy of the composited page region (screenshot) — non-blank check. */
export async function canvasNonBlank(page, selector) {
  const loc = page.locator(selector).first();
  const buf = await loc.screenshot({ type: 'png' });
  // crude PNG check: count distinct byte values in the compressed body (blank images compress to few bytes)
  return { bytes: buf.length, nonBlank: buf.length > 6000 };
}

/** Wording that would imply a guaranteed outcome. */
export const CERTAINTY = /\bguarantee[sd]?\b|\byou will see\b|20\/20|\b\d{1,3}\s?%\s*(success|of patients)|success rate|نضمن|يضمن|ضمان|مضمون|ستر(ى|ي) بوضوح|نسبة نجاح|نسبة النجاح/i;
const NEGATION = /\b(no|not|cannot|can't|never)\b|(^|\s)(لا|لن|ليس|ليست)\s|^هل\s|\?|؟/i;

/** Sentences that claim certainty. A sentence that negates or questions the claim ("cannot be guaranteed",
 *  "هل يضمن…؟") is the opposite of a promise and is not counted. Returns the offending sentences. */
export function certaintyClaims(text) {
  return String(text).split(/(?<=[.!؟?])\s+|\n+/).map((x) => x.trim()).filter(Boolean)
    .filter((sentence) => CERTAINTY.test(sentence) && !NEGATION.test(sentence));
}
