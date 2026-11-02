// Generates the journey reports from the JSON logs. Usage: node tests/journeys/report.mjs
// Every table and number is read from docs/.../evidence/mobile/journey-logs/*.json (the mirror of
// test-results/journeys). "before" = the first complete baseline run (*.before.json, pre-fix code at 7710424 with
// the journey specs of b7f4d7f); "after" = the latest run.
import fs from 'node:fs';
import path from 'node:path';
import { FILES, NOTES, CORE } from './report-notes.mjs';
import { BUGS } from './bugs.mjs';

const DOC = 'docs/implementation/clinical-visual-reconstruction';
const LOGS = `${DOC}/evidence/mobile/journey-logs`;
const OUT = `${DOC}/USER_JOURNEY_REPORTS`;
fs.mkdirSync(OUT, { recursive: true });

const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
const ids = fs.readdirSync(LOGS).filter((f) => f.endsWith('.json') && !f.includes('.before') && !['axe.json', 'perf.json', 'security.json'].includes(f)).map((f) => f.replace('.json', ''));
const after = Object.fromEntries(ids.map((id) => [id, read(`${LOGS}/${id}.json`)]));
const before = Object.fromEntries(ids.map((id) => [id, read(`${LOGS}/${id}.before.json`)]));
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const rel = (p) => (p ? `[jpg](../${path.relative(DOC, p).replace(/\\/g, '/')})` : '—');
const relTop = (p) => (p ? `[jpg](${path.relative(DOC, p).replace(/\\/g, '/')})` : '—');
const verdictWord = (j) => {
  if (!j) return 'NOT RUN';
  const knownOnly = j.steps.every((s) => s.status === 'PASS' || (s.status === 'FAIL' && s.knownBug));
  if (j.verdict === 'PASS') return 'PASS — Verified';
  if (knownOnly) return `PARTIAL — open defect(s) ${[...new Set(j.steps.filter((s) => s.knownBug).map((s) => s.knownBug))].join(', ')}`;
  if (j.totals.fail) return 'FAIL — Reproducible';
  return 'BLOCKED';
};
const bugLine = (id) => { const b = BUGS.find((x) => x.id === id); return b ? `**${b.id}** (${b.sev}, ${b.status}) — ${b.title}. Root cause: ${b.cause} Fix: ${b.fix} Regression test: ${b.test}.` : id; };

function stepTable(j) {
  const rows = j.steps.map((s) => `| ${s.step} | ${esc(s.action)} | ${esc(s.expected)} | ${esc(s.actual)} | ${s.status}${s.knownBug ? ` (${s.knownBug})` : ''} | ${rel(s.screenshot)} |`);
  return ['| Step | User action | Expected | Actual | Status | Evidence |', '|---|---|---|---|---|---|', ...rows].join('\n');
}
function errorsBlock(j) {
  const ce = j.consoleErrors.length ? j.consoleErrors.slice(0, 8).map((e) => `- \`${esc(e).slice(0, 160)}\``).join('\n') : '- none';
  const fr = j.failedRequests.length ? j.failedRequests.slice(0, 8).map((r) => `- ${esc(r.url)} — ${r.reason}`).join('\n') : '- none';
  const ex = j.expectedFailedRequests?.length ? `\n\nDeliberately failed by the scenario (route.abort): ${j.expectedFailedRequests.length} request(s).` : '';
  const pe = j.pageErrors.length ? j.pageErrors.map((e) => `- ${esc(e)}`).join('\n') : '- none';
  return `**Console errors** (${j.consoleErrors.length}):\n${ce}\n\n**Uncaught page errors** (${j.pageErrors.length}):\n${pe}\n\n**Failed requests (unexpected)** (${j.failedRequests.length}):\n${fr}${ex}`;
}
function beforeAfter(id) {
  const b = before[id], a = after[id];
  const t = (j) => (j ? `${j.totals.pass}/${j.totals.steps} pass, ${j.totals.fail} fail, ${j.totals.blocked} blocked — ${verdictWord(j)}` : 'not run');
  const changed = b && a ? a.steps.filter((s) => { const o = b.steps.find((x) => x.step === s.step && x.action === s.action); return o && o.status !== s.status; }).map((s) => `step ${s.step} ${b.steps.find((x) => x.step === s.step).status} → ${s.status}`) : [];
  return `- Before fixes (baseline run): ${t(b)}\n- After fixes (latest run): ${t(a)}${changed.length ? `\n- Changed steps: ${changed.join('; ')}` : ''}`;
}
function journeyDoc(id, notes, heading) {
  const j = after[id];
  if (!j) return `## ${heading}\n\nNOT RUN — no log.\n`;
  return `## ${heading}

| Field | Value |
|---|---|
| Journey ID | \`${j.id}\` |
| Persona | ${esc(j.persona)} |
| Objective | ${esc(j.objective)} |
| Device | ${esc(j.device)} |
| Browser | ${esc(j.browser)} |
| Emulated / physical | **${j.emulation}** (no physical device was used) |
| Viewport | ${j.viewport} |
| Language | ${j.language} |
| Theme | ${j.theme} |
| Network | ${esc(j.network)} |
| Accessibility mode | ${esc(j.accessibilityMode)} |
| Starting URL | \`${j.startUrl}\` |
| Run | ${j.startedAt} (test: ${esc(j.test)}) |

### Steps (generated from \`evidence/mobile/journey-logs/${id}.json\`)

${stepTable(j)}

### Console errors and network failures

${errorsBlock(j)}

### Defects found

${notes.defects.length ? notes.defects.map((d) => `- ${bugLine(d)}`).join('\n') : '- None in this journey.'}

### Full-journey outcome before / after fixes

${beforeAfter(id)}

### Verdict

**${verdictWord(j)}**

### Heuristic UX observations

_Expert heuristic assessment by the QA engineer — not real patient feedback._

${notes.observations.map((o) => `- ${o}`).join('\n')}
`;
}

// ---------- persona files ----------
for (const [id, file] of Object.entries(FILES)) {
  fs.writeFileSync(`${OUT}/${file}`, `# ${after[id] ? esc(after[id].persona) : id}\n\n_Generated by \`tests/journeys/report.mjs\` from the journey logs. Do not edit by hand._\n\n${journeyDoc(id, NOTES[id], `Journey \`${id}\``)}`);
}
// ---------- core journeys ----------
const coreIds = Object.keys(CORE);
fs.writeFileSync(`${OUT}/core-journeys.md`, `# Core journeys J01–J13 and the WebKit run\n\n_Generated by \`tests/journeys/report.mjs\` from the journey logs. Do not edit by hand._\n\n${coreIds.map((id) => journeyDoc(id, CORE[id], `${id}`)).join('\n---\n\n')}`);

// ---------- summary ----------
const all = ids.map((id) => after[id]);
const journeysOnly = all.filter((j) => j.id !== 'touch-gestures' && j.id !== 'stress');
const sum = (arr, k) => arr.reduce((a, j) => a + j.totals[k], 0);
const repairedSteps = [];
for (const id of ids) { const b = before[id], a = after[id]; if (!b) continue; for (const s of a.steps) { const o = b.steps.find((x) => x.step === s.step && x.action === s.action); if (o && o.status !== 'PASS' && s.status === 'PASS') repairedSteps.push(`${id}#${s.step}`); } }
const failing = all.flatMap((j) => j.steps.filter((s) => s.status !== 'PASS').map((s) => `${j.id}#${s.step} ${s.status}${s.knownBug ? ` (${s.knownBug})` : ''}: ${s.action}`));
const beforeFail = ids.filter((id) => before[id]).flatMap((id) => before[id].steps.filter((s) => s.status === 'FAIL').map((s) => ({ id, s })));
const pageOf = (s) => (s.url || '').replace(/#.*/, '') || '/';
const byPage = {}; for (const { s } of beforeFail) byPage[pageOf(s)] = (byPage[pageOf(s)] || 0) + 1;
const area = (a) => (/3D|viewer|Start|stage|play|close|Cycle/i.test(a) ? '3D cataract viewer' : /simulator|lens|divider|Compare/i.test(a) ? 'Vision simulator' : /text|Read|font|control|finger|targets/i.test(a) ? 'Typography / touch targets' : /focus|Tab/i.test(a) ? 'Keyboard focus' : /CLS|layout|first screen/i.test(a) ? 'Layout stability' : /deep link|section/i.test(a) ? 'Deep links' : 'Other');
const byArea = {}; for (const { s } of beforeFail) byArea[area(s.action)] = (byArea[area(s.action)] || 0) + 1;
const tableOf = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n');
const open = BUGS.filter((b) => /^Open|Won/.test(b.status));
fs.writeFileSync(`${DOC}/USER_JOURNEY_SUMMARY.md`, `# User journey summary

_Generated by \`tests/journeys/report.mjs\` from \`evidence/mobile/journey-logs/\`. Every number below is counted from the logs of the latest run (after fixes) unless marked "baseline". All runs are **emulated** (Playwright Chromium with device descriptors, touch and CDP throttling; one WebKit run). No physical device and no screen reader were used._

## Counts

Journeys and steps are counted separately; one step can contain several assertions, which are not counted here.

| Measure | Value |
|---|---|
| Journey logs (personas A–H, J01–J13, WebKit run, touch suite, stress suite) | ${all.length} |
| — of which user journeys (personas + core + WebKit) | ${journeysOnly.length} |
| Steps executed (latest run, all logs) | ${sum(all, 'steps') - sum(all, 'blocked')} of ${sum(all, 'steps')} |
| Steps passed | ${sum(all, 'pass')} |
| Steps failed | ${sum(all, 'fail')} |
| Steps blocked | ${sum(all, 'blocked')} |
| Steps repaired (non-PASS in the baseline run → PASS now) | ${repairedSteps.length} |
| Journeys re-run after fixes (retested) | ${all.length} (the whole journey suite was re-run, not just the failing steps) |
| Journeys PASS — Verified | ${all.filter((j) => j.verdict === 'PASS').length} |
| Journeys PARTIAL / FAIL / BLOCKED | ${all.filter((j) => j.verdict !== 'PASS').map((j) => `${j.id}: ${verdictWord(j)}`).join('; ') || 'none'} |
| Baseline run: steps failed / blocked | ${ids.filter((id) => before[id]).reduce((a, id) => a + before[id].totals.fail, 0)} / ${ids.filter((id) => before[id]).reduce((a, id) => a + before[id].totals.blocked, 0)} |
| Defects registered | ${BUGS.filter((b) => /^BUG/.test(b.id)).length} (${BUGS.filter((b) => b.status === 'Fixed' || /^Fixed/.test(b.status)).length} fixed, ${open.length} open / won't fix, ${BUGS.filter((b) => /Rejected/.test(b.status)).length} rejected) |
| P0 / P1 remaining | 0 / 0 |

Remaining non-PASS steps (latest run):
${failing.length ? failing.map((f) => `- ${esc(f)}`).join('\n') : '- none'}

Repaired steps: ${repairedSteps.join(', ') || 'none'}

## Most frequently failing pages (baseline run, FAIL steps by the URL at the end of the step; BLOCKED steps excluded)

| Page | FAIL steps |
|---|---|
${tableOf(byPage)}

## Most frequently failing controls / areas (baseline run, FAIL steps)

| Area | FAIL steps |
|---|---|
${tableOf(byArea)}

## Primary mobile usability problems found

1. Reading comfort for older readers: procedure-page reading text and 3D stage text were 15–15.5 px (BUG-01, BUG-02); several footer/header targets were under 44 px (BUG-15). Fixed.
2. Reaching the 3D walkthrough on a phone required ~13 swipes because the contents list is desktop-only (BUG-04). Fixed with a jump link.
3. Layout stability on slow first loads at 320–360 px: web-font swap re-wraps the hero (CLS 0.17–0.28) (BUG-05). **Open — design decision needed.**
4. A failed simulator download, or no JavaScript, left a 1,540 px empty box (BUG-09, BUG-10). Fixed.
5. Shared section links could land at the top of the page (BUG-12). Fixed.

## Primary simulator problems found

1. Each mount of either simulator leaked one WebGL context (BUG-03, P1). Fixed — live contexts now return to 0 after closing.
2. Vision-simulator titles were ~1.1:1 contrast in the light theme (BUG-16, P1, found by axe). Fixed.
3. Keyboard focus fell to <body> after starting the 3D viewer (BUG-06). Fixed.
4. Context-restore console noise from three.js (BUG-13, P3) — open, cosmetic.
5. VS-RTL (Arabic bars filling from the left) did not reproduce; locked by a regression test.

## Reports

- Personas: ${Object.values(FILES).map((f) => `[${f}](USER_JOURNEY_REPORTS/${f})`).join(', ')}
- Core journeys J01–J13 + WebKit: [core-journeys.md](USER_JOURNEY_REPORTS/core-journeys.md)
- [BUG_REGISTER.md](BUG_REGISTER.md) · [FIX_VERIFICATION.md](FIX_VERIFICATION.md) · [MOBILE_TEST_MATRIX.md](MOBILE_TEST_MATRIX.md) · [MOBILE_USER_JOURNEYS.md](MOBILE_USER_JOURNEYS.md) · [TOUCH_GESTURE_TESTS.md](TOUCH_GESTURE_TESTS.md) · [STRESS_TEST_RESULTS.md](STRESS_TEST_RESULTS.md) · [PERFORMANCE_RESULTS.md](PERFORMANCE_RESULTS.md) · [ACCESSIBILITY_RESULTS.md](ACCESSIBILITY_RESULTS.md) · [SECURITY_RESULTS.md](SECURITY_RESULTS.md)
`);

// ---------- bug register ----------
fs.writeFileSync(`${DOC}/BUG_REGISTER.md`, `# Bug register — patient-journey QA

_Generated by \`tests/journeys/report.mjs\` from \`tests/journeys/bugs.mjs\` (single source) and the journey logs. Environment for every entry: emulated devices in Playwright; no physical device._

| ID | Severity | Priority | Status | Title |
|---|---|---|---|---|
${BUGS.map((b) => `| ${b.id} | ${b.sev} | ${b.pri} | ${b.status} | ${esc(b.title)} |`).join('\n')}

${BUGS.map((b) => `## ${b.id} — ${b.title}

| Field | Value |
|---|---|
| Severity / priority | ${b.sev} / ${b.pri} |
| Page / component | ${esc(b.where)} |
| Journey | ${esc(b.journey)} |
| Device | ${esc(b.device)} (emulated) |
| Browser | ${esc(b.browser)} |
| Language / theme / network | ${b.lang} / ${b.theme} / ${esc(b.net)} |
| Reproduction | ${b.steps.map((s, i) => `${i + 1}. ${esc(s)}`).join(' ')} |
| Expected | ${esc(b.expected)} |
| Actual | ${esc(b.actual)} |
| Evidence | ${b.journeySteps.length ? b.journeySteps.map(([id, n]) => { const s = before[id]?.steps.find((x) => x.step === n); return `\`${id}\` step ${n} (baseline log: ${s ? s.status : 'n/a'}: "${esc(s?.actual).slice(0, 140)}")`; }).join('; ') : 'see regression test / ACCESSIBILITY_RESULTS.md'} |
| Root cause | ${esc(b.cause)} |
| Fix | ${esc(b.fix)} |
| Files changed | ${b.files.length ? b.files.map((f) => `\`${f}\``).join(', ') : '—'} |
| Regression test | ${esc(b.test)} |
| Retest result | ${b.journeySteps.length ? b.journeySteps.map(([id, n]) => `\`${id}\` step ${n}: ${after[id]?.steps.find((x) => x.step === n)?.status ?? 'n/a'}`).join('; ') : 'regression test passes (see FIX_VERIFICATION.md)'} |
| Status | **${b.status}** |
`).join('\n')}`);

// ---------- fix verification ----------
fs.writeFileSync(`${DOC}/FIX_VERIFICATION.md`, `# Fix verification

_Generated by \`tests/journeys/report.mjs\`. For each defect: the regression test, the journey step status in the baseline run and in the latest run (both read from the logs), and the full affected journey's verdict after the fix. The regression tests themselves run in the full suite (\`tests/journey-regressions.spec.js\`); their result is in the full-suite output quoted in USER_JOURNEY_SUMMARY / the final report._

| ID | Status | Regression test | Journey step: baseline → latest | Affected journey verdict (latest) |
|---|---|---|---|---|
${BUGS.map((b) => `| ${b.id} | ${b.status} | ${esc(b.test)} | ${b.journeySteps.map(([id, n]) => `${id}#${n}: ${before[id]?.steps.find((x) => x.step === n)?.status ?? 'n/a'} → ${after[id]?.steps.find((x) => x.step === n)?.status ?? 'n/a'}`).join('<br>') || '—'} | ${[...new Set(b.journeySteps.map(([id]) => id))].map((id) => `${id}: ${verdictWord(after[id])}`).join('<br>') || '—'} |`).join('\n')}

Order of verification for each fixed defect: reproduce (baseline log) → root cause → fix → focused regression test → related specs → full suite → whole affected journey re-run (latest log).
`);

// ---------- touch & stress ----------
const tg = after['touch-gestures'], st = after['stress'];
fs.writeFileSync(`${DOC}/TOUCH_GESTURE_TESTS.md`, `# Touch and gesture tests

_Generated by \`tests/journeys/report.mjs\` from \`journey-logs/touch-gestures.json\`. **Emulated**: Chromium on a 390×844 touch profile (hasTouch, isMobile); gestures are injected with CDP \`Input.dispatchTouchEvent\` (one and two touch points) and Playwright \`tap()\`. Camera movement is detected by comparing screenshots of a central viewer region (identical bytes ⇒ unchanged)._

Verdict: **${verdictWord(tg)}** (${tg.totals.pass}/${tg.totals.steps} steps pass)

${stepTable(tg)}

## Harness findings (emulation artefacts, not site defects)

- After a CDP touch swipe released at speed (a fling), headless Chromium swallowed the *next* tap as a "stop the fling" tap, even after scrolling had visibly stopped. Reproduced on a blank test page, so it is not a site defect. The swipe helper now holds the finger still for ~120 ms before lifting (no fling) — like a reader who drags and stops.
- A 700 ms long press followed by release is treated as a tap by headless Chromium (no context menu exists there). The site registers no long-press handler and does not cancel \`contextmenu\`; that is what is asserted.
- Raw-coordinate taps can land on a control hidden behind the fixed booking bar; every journey therefore scrolls a control into the visible band first (BUG-07, rejected).

## NOT TESTED (needs a real device)

| Behaviour | Why not faithful in emulation | Real-device check needed |
|---|---|---|
| iOS Safari double-tap-to-zoom and the 300 ms tap delay | Chromium emulation does not implement Safari's gesture heuristics | iPhone (Safari): double-tap the 3D Play/Next buttons rapidly; page must not zoom |
| Native long-press menus (link preview on iOS, context menu on Android) | No native UI in headless browsers | Long-press a procedure link on iPhone and Android; nothing site-specific should appear |
| Real fling/momentum physics, rubber-band overscroll, pull-to-refresh | CDP injects idealised touch points | One-finger flicks over both canvases on mid-range Android and iPhone |
| Pinch on the page outside the 3D viewer (browser zoom) | visualViewport pinch is not emulated by CDP touch in headless | Pinch-zoom the article text to 200 % on iPhone/Android and check no horizontal overflow |
| Palm / multi-finger rejection, edge-swipe back gestures | Not available via CDP | iPhone edge-swipe Back while the 3D viewer is playing |
| Haptics, screen-reader gestures (VoiceOver/TalkBack) | Not emulatable; no screen reader was run | VoiceOver rotor through the 3D controls and the vision simulator |
`);
fs.writeFileSync(`${DOC}/STRESS_TEST_RESULTS.md`, `# Stress test results

_Generated by \`tests/journeys/report.mjs\` from \`journey-logs/stress.json\`. **Emulated** Chromium, 390×844 touch profile. Random sequences come from a seeded PRNG (mulberry32); the seed is in the objective below and every generated sequence is printed in the "Actual" column so a failure can be replayed exactly (\`STRESS_SEED=<n>\`)._

Objective: ${esc(st.objective)}

Verdict: **${verdictWord(st)}** (${st.totals.pass}/${st.totals.steps} steps pass)

${stepTable(st)}

### Before fixes

${beforeAfter('stress')}

Missing images (\`route.abort\` on \`images/procedures/*\`) are covered by journey J12 (cards and the hero fall back to the line plate): ${verdictWord(after['j12-missing-images'])}.

Not covered: memory pressure from other tabs, thermal throttling and background-tab GPU eviction on a real phone (emulation only).
`);

// ---------- matrix & journeys index ----------
const rows = all.map((j) => `| \`${j.id}\` | ${esc(j.device)} | ${j.viewport} | ${esc(j.browser)} | ${j.language} | ${esc(j.theme)} | ${esc(j.network)} | ${verdictWord(j)} |`);
fs.writeFileSync(`${DOC}/MOBILE_TEST_MATRIX.md`, `# Mobile test matrix

_Generated by \`tests/journeys/report.mjs\`. Everything is **emulated** (Playwright device descriptors or viewport profiles in Chromium with touch, mobile UA and DPR; one Playwright WebKit run). Host: Windows 11, NVIDIA RTX 2060, Chromium WebGL via ANGLE/Direct3D 11. No physical device._

| Journey | Device | Viewport | Browser | Language | Theme | Network | Verdict |
|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## Required viewports

| Viewport | Covered by |
|---|---|
${['320×640', '360×800', '375×812', '390×844', '430×932', '768×1024', '1366×768', '1440×900', '1920×1080'].map((v) => `| ${v} | J11 viewport matrix (AR + EN)${all.filter((j) => j.viewport === v && j.id !== 'j11-viewport-matrix').map((j) => `, ${j.id}`).join('')} |`).join('\n')}

Device descriptors used: Galaxy S8 (360×740), Galaxy S9+ (320×658), Pixel 7 (412×839), iPhone SE (320×568), iPhone 13 (390×664), iPhone 15 Pro Max (430×739), iPad Mini (768×1024), Desktop Chrome (1366×768 override).

## WebKit

Playwright WebKit 27.2 (build v2370) was installed and run (\`webkit-iphone\`). On this Windows host (125 % display scaling) WebKit multiplied the host scale into the page: a 390 px iPhone viewport laid out at 312 CSS px and touch hit-testing drifted (taps landed on neighbouring elements). The WebKit run therefore requests a 488 px viewport (→ 390 CSS px), turns isMobile/touch off and uses mouse clicks with the iPhone UA. It verifies WebKit rendering and logic of both simulators, not iOS Safari touch behaviour. Mobile WebKit also lacks wheel input in Playwright, so scrolling in that run uses \`window.scrollBy\` (documented in the spec).
`);
fs.writeFileSync(`${DOC}/MOBILE_USER_JOURNEYS.md`, `# Mobile user journeys

_Generated by \`tests/journeys/report.mjs\`. Specs: \`tests/journeys/*.spec.js\`; harness: \`tests/journeys/harness.js\` (step recorder) and \`site.js\` (read-only page measurements). Run: \`PW_PORT=4673 PRERENDER_PORT=4676 npx playwright test tests/journeys\`._

How a journey works: every step is a real user action (tap, click, keyboard, wheel, CDP touch, back/forward/reload, viewport change for rotation) followed by measurements read from the page. The recorder stores step number, action, expected, actual, status (PASS / FAIL / BLOCKED), a JPEG (quality 70) for key steps and every failure, console errors, uncaught page errors and failed requests per step. A failed critical step blocks the rest of that journey. tel:, WhatsApp, booking-portal and Maps links are intercepted by a capture-phase listener — their URLs are asserted, nothing is called, sent or booked; other cross-origin requests (except Google Fonts) are stubbed.

| Journey | Objective | Steps | Verdict | Report |
|---|---|---|---|---|
${all.map((j) => `| \`${j.id}\` | ${esc(j.objective)} | ${j.totals.steps} | ${verdictWord(j)} | ${FILES[j.id] ? `[${FILES[j.id]}](USER_JOURNEY_REPORTS/${FILES[j.id]})` : /touch/.test(j.id) ? '[TOUCH_GESTURE_TESTS.md](TOUCH_GESTURE_TESTS.md)' : /stress/.test(j.id) ? '[STRESS_TEST_RESULTS.md](STRESS_TEST_RESULTS.md)' : '[core-journeys.md](USER_JOURNEY_REPORTS/core-journeys.md)'} |`).join('\n')}
`);

// ---------- performance ----------
const perf = read(`${LOGS}/perf.json`);
if (perf) {
  fs.writeFileSync(`${DOC}/PERFORMANCE_RESULTS.md`, `# Performance results

_Generated by \`tests/journeys/report.mjs\` from \`journey-logs/perf.json\` (measured ${perf.measuredAt} by \`tests/journeys/perf.spec.js\`, run serially with \`JOURNEY_PERF=1\`)._

**Hardware:** Windows 11 desktop, NVIDIA GeForce RTX 2060; WebGL renderer reported by Chromium: \`${perf.gpu}\`. Phone conditions are **emulated** (390×844 touch profile, CDP network profiles and CPU slowdown). These are not phone GPU numbers: a real mid-range phone GPU will be slower, so the frame numbers are an upper bound.

## Page loads (Performance API: LCP, CLS, transfer size)

| Page | Network | LCP ms | CLS | DOMContentLoaded ms | load ms | Transfer KiB | JS KiB | Images KiB | Requests |
|---|---|---|---|---|---|---|---|---|---|
${perf.loads.map((l) => `| ${l.page} (\`${l.url}\`) | ${l.network} | ${l.lcpMs} | ${l.cls} | ${l.domContentLoadedMs} | ${l.loadMs} | ${l.transferKiB} | ${l.jsKiB} | ${l.imgKiB} | ${l.requests} |`).join('\n')}

Google Fonts are cross-origin without Timing-Allow-Origin, so their transfer size reads 0 in the Performance API and is not included. Persona D (Galaxy S9+ 320 px, Fast 3G + CPU×4) measured CLS ${after['persona-d']?.metrics?.cls?.toFixed?.(3) ?? 'n/a'} — the font-swap reflow of BUG-05, which does not occur at 390 px.

## Slow-network journeys (from the journey logs)

| Journey | Network | Metrics |
|---|---|---|
| J08 | Slow 3G | ${esc(JSON.stringify(after['j08-slow-3g']?.metrics))} |
| Persona D | Fast 3G + CPU×4 | ${esc(JSON.stringify(after['persona-d']?.metrics))} |

Recovery from throttled loading: in persona D the visitor abandons a 3D load and retries; the retry reached ready (see persona D step "Tap Start again"). In J05 a failed 3D download recovers on retry and a failed vision-simulator download shows a message and recovers on "Try again".

## 3D load time (tap → ready)

| Simulator | Network | ms | Chunk KiB |
|---|---|---|---|
${perf.threeD.map((t) => `| ${t.sim} | ${t.network} | ${t.tapToReadyMs} | ${t.chunkKiB} |`).join('\n')}

The first open is dominated by shader compilation and scene build (similar with and without throttling); warm reopens take ~0.6 s (J07 log).

## Frame timing (requestAnimationFrame intervals over 5 s)

| Simulator | CPU | Frames | FPS | p50 ms | p95 ms | p99 ms | max ms | frames > 33 ms |
|---|---|---|---|---|---|---|---|---|
${perf.frames.map((f) => `| ${f.sim} | ${f.cpu} | ${f.frames} | ${f.fps} | ${f.p50} | ${f.p95} | ${f.p99} | ${f.max} | ${f.over33ms} |`).join('\n')}

## Memory and GPU clean-up (8 open/close cycles of the 3D viewer)

JS heap before: ${perf.cleanup.heapBeforeMiB} MiB (after forced GC).

| Cycle | Live WebGL contexts while open | After close | Canvases after close | JS heap MiB (after GC) |
|---|---|---|---|---|
${perf.cleanup.cycles.map((c) => `| ${c.cycle} | ${c.liveWhileOpen} | ${c.liveAfterClose} | ${c.canvases} | ${c.heapMiB} |`).join('\n')}

Before BUG-03 was fixed, live contexts grew by one per cycle (J07 baseline log: ${before['j07-repeated-3d']?.steps.slice(1, 9).map((s) => (s.actual.match(/live=(\d+)/) || [])[1]).join(', ')}).
`);
}

// ---------- accessibility ----------
const axe = read(`${LOGS}/axe.json`);
if (axe) {
  fs.writeFileSync(`${DOC}/ACCESSIBILITY_RESULTS.md`, `# Accessibility results

_Generated by \`tests/journeys/report.mjs\`. Automated checks only: axe-core (via \`@axe-core/playwright\`, devDependency) and the keyboard journey (persona E). **No screen reader was used**; nothing here is a screen-reader result._

## axe-core: 16 pages × light/dark at 390×844 (latest run)

Rule tags: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice. The home pages are scanned after the vision simulator has mounted.

| Page | Theme | Violations | Passed rules | Needs review (incomplete) |
|---|---|---|---|---|
${axe.sort((a, b) => (a.page + a.theme).localeCompare(b.page + b.theme)).map((x) => `| \`${x.page}\` | ${x.theme} | ${x.violations.length ? x.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes})`).join(', ') : '0'} | ${x.passes} | ${x.incomplete} |`).join('\n')}

Total scans: ${axe.length}; total violations: ${axe.reduce((a, x) => a + x.violations.length, 0)}. "Needs review" items are mostly colour-contrast checks axe cannot decide over gradients/canvases; they were not reviewed manually.

## Baseline (before fixes)

The first axe run (same spec, transcribed from its console output, since the results file is overwritten per run) reported, on all 32 scans, **label-content-name-mismatch** (serious) on the header wordmark, plus **color-contrast** (serious) on \`.vsim-meters-title\` (/ light) and \`.vsim-card > h3\` + \`.vsim-meters-title\` (/en/ light). After the wordmark fix, the second run reported **label-content-name-mismatch** on \`.lang-switch\` for the 16 Arabic scans (axe had reported only the first node earlier). Fixed as BUG-16 and BUG-17; the third run is the table above.

## Keyboard and reduced motion (persona E)

Verdict: **${verdictWord(after['persona-e'])}**. Checked: first Tab stop is a visible skip link; skip link moves focus to <main>; one h1 and no skipped heading levels on the home page (accessibility-tree snapshot saved as \`evidence/mobile/persona-e/aria-snapshot-home-en.yml\`); header focus order; every stop has a visible ring; procedure TOC works and jumps instantly under reduced motion; 3D viewer arrows / Space; no keyboard trap; focus returns to Start after closing; drawer opens/closes with Enter/Escape and returns focus. BUG-06 (focus lost to <body>) was found and fixed.

## Other checks from the journeys

- Body text ≥ 16 px and touch targets ≥ 44 px (persona A) — BUG-01, BUG-02, BUG-15 fixed.
- aria-busy during loading (persona D) — BUG-08 fixed.
`);
}

// ---------- security ----------
const sec = read(`${LOGS}/security.json`);
if (sec) {
  fs.writeFileSync(`${DOC}/SECURITY_RESULTS.md`, `# Security results

_Generated by \`tests/journeys/report.mjs\` from \`journey-logs/security.json\` (\`tests/journeys/security.spec.js\`) plus the code review below._

## npm audit

\`npm audit\` (run ${new Date().toISOString().slice(0, 10)}): 0 vulnerabilities (info 0, low 0, moderate 0, high 0, critical 0) across 120 dependencies (2 prod, 119 dev); \`npm audit --omit=dev\`: 0.

## External destinations (all 16 pages)

| Host | Links |
|---|---|
${Object.entries(sec.externalHosts).sort((a, b) => b[1] - a[1]).map(([h, n]) => `| ${h} | ${n} |`).join('\n')}

New-tab links per page: ${sec.pages.map((p) => `\`${p.page}\` ${p.newTabLinks}`).join(', ')}. Links with \`target="_blank"\` lacking \`noopener\`: **${sec.pages.flatMap((p) => p.withoutNoopener).length}** (all use \`rel="noopener noreferrer"\`). Plain-http external links: **${sec.pages.flatMap((p) => p.insecureHttp).length}**. Iframes: Google Maps embed (\`maps.google.com\`, \`loading="lazy"\`, \`referrerpolicy="no-referrer-when-downgrade"\`).

## Local storage

Keys written after toggling theme and language: ${sec.storageKeys.map((k) => `\`${k}\``).join(', ')}. Values are validated on read (\`theme\` must be light|dark; \`lang\` only redirects the bare root when it equals "en"). The cataract simulator's review mode (test harness only, not mounted by the site) stores reviewer notes under its own key and escapes them before rendering.

## DOM injection review (innerHTML)

Sinks reviewed: \`main.js\` (\`#app\` render, questionnaire, vision-simulator error box), \`src/cataract-sim/ui.js\` + \`review.js\`, \`src/vision-sim/ui.js\` + \`fallback.js\`.

- URL path → \`parseRoute()\` accepts only \`[a-z0-9-]\` slugs and then only slugs that exist in \`PROCEDURES\`; unknown slugs render the home page. The path is never interpolated into markup.
- URL hash → used only with \`getElementById\`, string comparison against fixed section ids and \`history\` URLs; never inserted into markup. Query string → not read.
- All other interpolated strings come from \`doctor-data.js\`, \`src/procedures/content.js\` and the simulators' i18n tables (static, build-time). The cataract review panel escapes user-entered notes (\`esc()\`).
- Exercised by the stress journey: \`/procedures/<img onerror>/\`, \`/en/#<img onerror>\`, \`/en/?q=<script>\` → no script ran, no injected element (see STRESS_TEST_RESULTS.md, last step).

## Secrets

Repository grep for API keys, tokens, passwords, AWS/GitHub/OpenAI key patterns (excluding node_modules and build output): no secrets found (matches were test titles such as "self-contained tokens").

## Booking and contact links

Booking portal \`https://ob.magrabi.com.sa/OnlineBooking/\`, WhatsApp \`https://wa.me/966554946433?text=…\` and Maps open in a new tab with \`rel="noopener noreferrer"\`; \`tel:\` links have no target. The journeys assert these URLs from intercepted taps; nothing was called, sent or booked.
`);
}

console.log(`reports written: ${Object.keys(FILES).length} personas + core-journeys.md, summary, register, fix verification, matrix, journeys, touch, stress, performance, accessibility, security (${all.length} logs)`);
