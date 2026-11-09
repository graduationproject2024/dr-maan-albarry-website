// Journey harness — records every user step of a journey as structured data.
//
//   const j = await startJourney(page, testInfo, { id: 'persona-a', persona: 'A — older Arabic-speaking patient', ... });
//   await j.step('Tap the cataract card', 'The cataract page opens', async () => {
//     await page.locator(...).tap();
//     const h1 = await page.locator('h1').innerText();
//     return { actual: `h1 = "${h1}"`, ok: h1.includes('...') };
//   }, { shot: true });
//   await j.finish();   // writes the log and fails the test if any step failed
//
// Each step stores: number, user action, expected result, actual result MEASURED FROM THE PAGE, status
// (PASS / FAIL / BLOCKED), screenshot path, console errors, page errors and failed requests seen during
// that step. Logs go to test-results/journeys/<id>.json (per run) and are mirrored to
// docs/.../evidence/mobile/journey-logs/<id>.json so the report generator (tests/journeys/report.mjs) can
// build every table from the logs of the last full run.
//
// External destinations are never contacted: a capture-phase click listener (installed before the app)
// cancels the default action of tel:, WhatsApp, booking-portal, Maps and any other cross-origin link and
// records the URL the user tapped in window.__intercepted. Cross-origin network requests other than
// Google Fonts are answered with an empty stub.
import fs from 'node:fs';
import path from 'node:path';
import { devices, expect } from '@playwright/test';

export const EVIDENCE_ROOT = 'docs/implementation/clinical-visual-reconstruction/evidence/mobile';
export const LOG_DIR = 'test-results/journeys';
export const LOG_MIRROR = `${EVIDENCE_ROOT}/journey-logs`;

/** A Playwright device descriptor usable in the Chromium project (its own browser type removed). */
export function device(name, extra = {}) {
  const d = { ...devices[name] };
  delete d.defaultBrowserType;
  return { ...d, ...extra };
}

/** Viewport-only profile (touch phone when width < 768). */
export function viewportProfile(width, height, { touch = width < 768, extra = {} } = {}) {
  return touch
    ? { viewport: { width, height }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, ...extra }
    : { viewport: { width, height }, ...extra };
}

/** Network profiles (Chrome DevTools presets). Throughput in bytes/s. */
export const NETWORK = {
  'slow-3g': { offline: false, latency: 2000, downloadThroughput: (500 * 1024 * 0.8) / 8, uploadThroughput: (500 * 1024 * 0.8) / 8 },
  'fast-3g': { offline: false, latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8 },
};

export async function throttle(page, profile, cpuRate = 1) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  if (profile) await cdp.send('Network.emulateNetworkConditions', NETWORK[profile] || profile);
  if (cpuRate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
  return cdp;
}

const INTERCEPT = () => {
  window.__intercepted = [];
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    let u;
    try { u = new URL(a.href, location.href); } catch { return; }
    const external = !/^https?:$/.test(u.protocol) || u.origin !== location.origin;
    if (!external) return;
    e.preventDefault();
    window.__intercepted.push({ href: a.href, target: a.target || '', rel: a.rel || '', text: (a.textContent || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80) });
  }, true);
};

/** Instrumentation only (no app calls): count WebGL contexts created and canvases alive. */
const GL_PROBE = () => {
  const orig = HTMLCanvasElement.prototype.getContext;
  window.__glProbe = { created: 0, contexts: new Set() };
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const ctx = orig.call(this, type, ...rest);
    if (ctx && /webgl/.test(String(type)) && !window.__glProbe.contexts.has(ctx)) { window.__glProbe.created++; window.__glProbe.contexts.add(ctx); }
    return ctx;
  };
  window.__glLive = () => {
    let live = 0;
    for (const c of window.__glProbe.contexts) if (!c.isContextLost()) live++;
    return { created: window.__glProbe.created, live, canvases: document.querySelectorAll('canvas').length };
  };
};

export async function prepare(page, { theme = null, lang = null, clearStorage = false, glProbe = true } = {}) {
  await page.addInitScript(INTERCEPT);
  if (glProbe) await page.addInitScript(GL_PROBE);
  if (clearStorage || theme || lang) {
    await page.addInitScript(({ theme, lang, clearStorage }) => {
      if (sessionStorage.getItem('__journeyInit')) return; // only on the first document of the journey
      sessionStorage.setItem('__journeyInit', '1');
      try {
        if (clearStorage) localStorage.clear();
        if (theme) localStorage.setItem('theme', theme);
        if (lang) localStorage.setItem('lang', lang);
      } catch { /* ignore */ }
    }, { theme, lang, clearStorage });
  }
  await page.context().route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (route) => {
    const url = route.request().url();
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) return route.continue();
    return route.fulfill({ status: 204, body: '' });
  });
  page.on('popup', (p) => p.close().catch(() => {})); // no popup ever reaches the outside
}

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

export async function startJourney(page, testInfo, meta) {
  const j = new Journey(page, testInfo, meta);
  await j.init();
  return j;
}

export class Journey {
  constructor(page, testInfo, meta) {
    this.page = page;
    this.testInfo = testInfo;
    this.meta = {
      emulation: 'emulated',
      browser: `${testInfo.project.use.browserName || 'chromium'} (Playwright ${testInfo.config.version})`,
      accessibilityMode: 'none',
      network: 'unthrottled (localhost)',
      ...meta,
    };
    this.steps = [];
    this.console = [];
    this.warnings = [];
    this.pageErrors = [];
    this.failedRequests = [];
    this.expectedFailures = [];
    this.blocked = false;
    // A journey may keep its evidence elsewhere (premium journeys: docs/.../premium-experience-reconstruction/evidence/journeys).
    // `--repeat-each` runs one journey several times at once; each copy keeps its own screenshots so one cannot delete another's.
    this.shotDir = path.join(meta.evidenceRoot || EVIDENCE_ROOT, testInfo.repeatEachIndex ? `${meta.id}-repeat-${testInfo.repeatEachIndex}` : meta.id);
    this.logDirs = meta.evidenceRoot ? [LOG_DIR, path.join(meta.evidenceRoot, 'logs')] : [LOG_DIR, LOG_MIRROR];
    this.startedAt = new Date().toISOString();
  }

  async init() {
    fs.rmSync(this.shotDir, { recursive: true, force: true });
    fs.mkdirSync(this.shotDir, { recursive: true });
    this.attach(this.page);
  }

  /** Follow a new tab/page (e.g. a returning visitor opening the site again). */
  attach(p) {
    this.page = p;
    p.on('console', (m) => {
      if (m.type() === 'error') this.console.push(m.text().slice(0, 300));
      else if (m.type() === 'warning') this.warnings.push(m.text().slice(0, 300));
    });
    p.on('pageerror', (e) => this.pageErrors.push(String(e).slice(0, 300)));
    p.on('requestfailed', (r) => {
      const url = r.url();
      const reason = r.failure() ? r.failure().errorText : 'failed';
      this.failedRequests.push({ url: url.slice(0, 200), reason, expected: this.expectedFailures.some((re) => re.test(url)) });
    });
    p.on('response', (r) => {
      if (r.status() >= 400) this.failedRequests.push({ url: r.url().slice(0, 200), reason: `HTTP ${r.status()}`, expected: this.expectedFailures.some((re) => re.test(r.url())) });
    });
  }

  /** Requests matching `re` are deliberately failed by the scenario (route.abort) and are logged as expected. */
  expectFailure(re) { this.expectedFailures.push(re); }

  get viewportLabel() { const v = this.page.viewportSize(); return v ? `${v.width}×${v.height}` : 'n/a'; }

  async step(action, expected, fn, { shot = false, critical = true, timeout = 45000, knownBug = null } = {}) {
    const n = this.steps.length + 1;
    const rec = { step: n, action, expected, actual: '', status: 'PASS', knownBug, screenshot: null, consoleErrors: [], pageErrors: [], failedRequests: [], ms: 0, url: '' };
    this.steps.push(rec);
    if (this.blocked) { rec.status = 'BLOCKED'; rec.actual = 'Not executed: an earlier critical step failed.'; return rec; }
    const c0 = this.console.length, e0 = this.pageErrors.length, r0 = this.failedRequests.length;
    const t0 = Date.now();
    let ok = true;
    try {
      let timer;
      const res = await Promise.race([fn(), new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`step timed out after ${timeout} ms`)), timeout); })])
        .finally(() => clearTimeout(timer));
      if (res && typeof res === 'object' && 'actual' in res) { rec.actual = String(res.actual); ok = res.ok !== false; }
      else rec.actual = res === undefined ? 'done' : String(res);
    } catch (err) {
      ok = false;
      rec.actual = `ERROR: ${String(err && err.message ? err.message : err).split('\n')[0].slice(0, 300)}`;
    }
    rec.ms = Date.now() - t0;
    try { rec.url = this.page.url().replace(/^https?:\/\/localhost:\d+/, ''); } catch { /* ignore */ }
    rec.consoleErrors = this.console.slice(c0);
    rec.pageErrors = this.pageErrors.slice(e0);
    rec.failedRequests = this.failedRequests.slice(r0).filter((r) => !r.expected);
    if (rec.pageErrors.length) { ok = false; rec.actual += ` | uncaught page error: ${rec.pageErrors[0]}`; }
    rec.status = ok ? 'PASS' : 'FAIL';
    if (shot || !ok) {
      const file = path.join(this.shotDir, `${String(n).padStart(2, '0')}-${slug(action)}.jpg`);
      try { await this.page.screenshot({ path: file, type: 'jpeg', quality: 70, timeout: 15000 }); rec.screenshot = file.replace(/\\/g, '/'); } catch { /* page may be gone */ }
    }
    if (!ok && critical) this.blocked = true;
    return rec;
  }

  /** Writes the log; fails the test when any step failed or was blocked. */
  async finish({ extra = {} } = {}) {
    const steps = this.steps;
    const log = {
      ...this.meta,
      viewport: this.meta.viewport || this.viewportLabel,
      test: this.testInfo.titlePath.join(' › '),
      startedAt: this.startedAt,
      finishedAt: new Date().toISOString(),
      totals: {
        steps: steps.length,
        pass: steps.filter((s) => s.status === 'PASS').length,
        fail: steps.filter((s) => s.status === 'FAIL').length,
        blocked: steps.filter((s) => s.status === 'BLOCKED').length,
      },
      verdict: steps.every((s) => s.status === 'PASS') ? 'PASS' : (steps.some((s) => s.status === 'FAIL') ? 'FAIL' : 'BLOCKED'),
      consoleErrors: this.console,
      consoleWarnings: this.warnings,
      pageErrors: this.pageErrors,
      failedRequests: this.failedRequests.filter((r) => !r.expected),
      expectedFailedRequests: this.failedRequests.filter((r) => r.expected),
      ...extra,
      steps,
    };
    const json = JSON.stringify(log, null, 2);
    for (const dir of this.logDirs) {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${this.meta.id}.json`), json);
    }
    // A step tagged with an OPEN bug-register ID keeps its real assertion and is logged and reported as FAIL,
    // but does not turn the suite red (the defect is tracked in BUG_REGISTER.md). Any other failure does.
    const bad = steps.filter((s) => s.status !== 'PASS' && !(s.status === 'FAIL' && s.knownBug)).map((s) => `#${s.step} ${s.status}: ${s.action} → ${s.actual}`);
    expect(bad, `journey ${this.meta.id} steps`).toEqual([]);
    return log;
  }
}

// ---------- shared measurement helpers (read the page; never drive the app) ----------
export const intercepted = (page) => page.evaluate(() => window.__intercepted.slice());
export const clearIntercepted = (page) => page.evaluate(() => { window.__intercepted.length = 0; });
export const glLive = (page) => page.evaluate(() => window.__glLive ? window.__glLive() : null);

export async function rect(locator) {
  return locator.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom }; });
}

/** Scroll the page by one-finger-like wheel steps until `locator` is in the viewport (real wheel input). */
export async function wheelTo(page, locator, { max = 60, delta = 500 } = {}) {
  for (let i = 0; i < max; i++) {
    const r = await rect(locator);
    const vh = page.viewportSize().height;
    if (r.y >= 0 && r.y < vh * 0.6) return r;
    await page.mouse.wheel(0, r.y < 0 ? -Math.min(delta, -r.y + 80) : Math.min(delta, r.y - 80));
    await page.waitForTimeout(60);
  }
  return rect(locator);
}

/**
 * Real touch swipe via CDP Input.dispatchTouchEvent (one finger).
 * `release: 'still'` (default) holds the finger still for ~120 ms before lifting it, like a reader who drags
 * and stops — no fling. (Emulation note: after a fling-release, headless Chromium swallows the next tap as a
 * "stop the fling" tap even once scrolling has visibly stopped; verified on a blank test page, so it is a
 * harness artefact and not a site defect. `release: 'fling'` keeps the fast release for scroll tests.)
 */
export async function swipe(page, { x, y, dx = 0, dy = 0, steps = 8, holdMs = 0, cdp = null, release = 'still' }) {
  const s = cdp || await page.context().newCDPSession(page);
  const pt = (px, py) => [{ x: Math.round(px), y: Math.round(py), id: 1, radiusX: 4, radiusY: 4, force: 1 }];
  await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(x, y) });
  if (holdMs) await page.waitForTimeout(holdMs);
  for (let i = 1; i <= steps; i++) {
    await s.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(x + (dx * i) / steps, y + (dy * i) / steps) });
    await page.waitForTimeout(16);
  }
  if (release === 'still') {
    for (let i = 0; i < 6; i++) { await s.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(x + dx, y + dy) }); await page.waitForTimeout(20); }
  }
  await s.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await settleScroll(page);
  return s;
}

/** Wait until a fling / smooth scroll has come to rest (scrollY unchanged for 250 ms). */
export async function settleScroll(page, timeout = 4000) {
  const t0 = Date.now();
  let last = await page.evaluate(() => scrollY), still = 0;
  while (Date.now() - t0 < timeout && still < 250) {
    await page.waitForTimeout(50);
    const y = await page.evaluate(() => scrollY);
    still = y === last ? still + 50 : 0;
    last = y;
  }
  return last;
}

/** Elements whose computed font-size is below `min` px among the given selector (visible text only). */
export async function smallText(page, selector, min = 16) {
  return page.locator(selector).evaluateAll((els, min) => els.filter((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || !el.textContent.trim()) return false;
    return parseFloat(getComputedStyle(el).fontSize) < min - 0.01;
  }).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ${getComputedStyle(el).fontSize}`), min);
}

/** Interactive elements under `scope` smaller than `min` px in either dimension (visible only). */
export async function smallTargets(page, scope, min = 44, { ignoreInline = true } = {}) {
  return page.locator(scope).evaluate((root, { min, ignoreInline }) => {
    const out = [];
    for (const el of root.querySelectorAll('a[href], button, input, summary, [role="slider"], [tabindex="0"]')) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || el.closest('[hidden]')) continue;
      if (el.type === 'radio' || el.type === 'checkbox') continue; // their <label> is the target
      // WCAG 2.5.8 exception: links inside a sentence/paragraph of text
      if (ignoreInline && el.tagName === 'A' && cs.display === 'inline' && el.parentElement && /^(P|LI|SPAN|DD)$/.test(el.parentElement.tagName)) continue;
      if (r.width < min - 0.5 || r.height < min - 0.5) out.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className).split(' ')[0]} "${(el.getAttribute('aria-label') || el.textContent).trim().replace(/\s+/g, ' ').slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    for (const lab of root.querySelectorAll('label')) {
      const r = lab.getBoundingClientRect();
      if (!r.width || lab.closest('[hidden]')) continue;
      if (r.height < min - 0.5) out.push(`label "${lab.textContent.trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  }, { min, ignoreInline });
}

export const hOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/**
 * Wheel-scroll until `locator` sits fully in the free band between the sticky header and the fixed bottom
 * booking bar — i.e. where a user can actually see and tap it. Returns its rect.
 */
export async function revealInFreeArea(page, locator, { max = 30 } = {}) {
  for (let i = 0; i < max; i++) {
    const g = await locator.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const hdr = document.getElementById('site-header');
      const bar = document.getElementById('booking-bar');
      const top = hdr ? hdr.getBoundingClientRect().bottom : 0;
      const barR = bar ? bar.getBoundingClientRect() : null;
      const bottom = barR && barR.height && getComputedStyle(bar).display !== 'none' && barR.top < innerHeight ? barR.top : innerHeight;
      return { y: r.top, b: r.bottom, top, bottom };
    });
    if (g.y >= g.top + 4 && g.b <= g.bottom - 4) break;
    const mid = (g.top + g.bottom) / 2;
    await scrollBy(page, Math.round((g.y + g.b) / 2 - mid));
    await page.waitForTimeout(120);
  }
  return rect(locator);
}

/** Real wheel scroll; mobile WebKit has no wheel input in Playwright, so there it falls back to a scripted
 *  window.scrollBy (documented as a WebKit-run limitation — not a user gesture). */
export async function scrollBy(page, dy) {
  try { await page.mouse.wheel(0, dy); }
  catch (e) { if (!/not supported/i.test(e.message)) throw e; await page.evaluate((d) => window.scrollBy(0, d), dy); }
}
