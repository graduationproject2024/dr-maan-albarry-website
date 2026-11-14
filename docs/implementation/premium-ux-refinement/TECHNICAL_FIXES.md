# Technical fixes: flaky tests, returning visitors, loading review

Branch base: `ea3e44d`. All numbers below were measured on this machine (12 logical CPUs, Windows 11, Chromium through Playwright 1.64.1, real GPU through ANGLE/Direct3D 11), with `PW_PORT=4701 PRERENDER_PORT=4706`.

## 1. The three flaky tests

### How they were reproduced

Load was added with busy threads alongside the test run, on the production build:

- Procedure A: 8 busy threads, `--repeat-each=20`, 6 workers. Persona C, persona H and the routing subpath test.
- Procedure B: 16 busy threads, `--repeat-each=30`, 8 workers. Persona H and the routing subpath test.

| Test | Before, procedure A | Before, procedure B | After, procedure A | After, procedure B |
|---|---|---|---|---|
| Persona C step 8 | 3 of 20 failed | not run | 0 of 20 failed | not run |
| Persona H step 1 | 0 of 20 failed | 4 of 30 failed | 0 of 20 failed | not completed (the run was interrupted) |
| Routing subpath | 0 of 20 failed | 1 of 30 failed, plus 6 "route.fetch: Test ended" errors outside any test | 0 of 20 failed | not completed (the run was interrupted) |

A separate instrumented run of the persona C sequence (24 repeats, procedure A load) failed 4 of 24, and its event log gave the cause below.

No retries and no longer sleeps were added. Fixed waits in those steps were replaced by waits on real state.

### Persona C step 8: a product defect, and a test that could not see it

**What the event log showed.** In the failing runs the tap's `pointerdown`, `touchstart` and `click` all went to `A.booking-action-call`, the "Call" link of the fixed booking bar. The scrubber was at y 611 to 655 and the bar began at y 593. In the passing runs the page sat 157 px further down and the same tap reached the scrubber.

**Product defect.** After Start, the viewer was brought in with `scrollIntoView({ block: 'nearest' })` on the whole stage, which ignores the fixed booking bar. Measured after the page settled, the scrubber was under the bar at 320×568, 375×667 and 390×664 (for example 375×667: scrubber 615 to 659, bar from 596). On a phone a tap aimed at the bottom of the timeline could start a phone call.

**Fix.** `revealViewer()` in `main.js` keeps the old placement, then makes sure the playback controls end above the bar. On the shortest phones the top of the 3D view goes under the header, because the viewer is taller than the free space and the controls take priority.

**Test defect.** The step read the rectangle and tapped raw coordinates without checking what was there. It now moves the scrubber into the free band with the existing `revealInFreeArea`, records and asserts what is under the tap point, and waits for real playback progress and the `paused` state. The assertion `scrubber > 450` is unchanged and a new one was added.

Playback and pointer handling were checked and are correct: when the tap reaches the scrubber, `input` fires and the viewer pauses at the tapped position, including while playing.

### Persona H step 1: a product defect

**Measured.** Three failures reported `#simulator top=5102px`, and one was the 40 s `waitVsim` timeout.

**Cause.** The "full vision simulator" link computed its scroll target once. The Lens Lab module sits above the simulator and reserves 1,200 px (1,600 px on phones) but is really about 6,500 px tall (9,500 px on phones). When it arrived after the jump had started, the simulator moved about 5,300 px down, away from where the page was heading. If the module arrived early in the scroll, the simulator never came within 400 px of the screen, so it never started: that is the timeout. Both failures have this one cause, and it reproduces every time when the Lens Lab download is held back (4 of 4 before the fix).

The same defect affected bookmarks such as `/en/lens-lab/#simulator`.

**Fix.** `holdScrollTarget()` in `main.js` keeps a jump's target while the page's height changes, using a `ResizeObserver` on `main`. It lets go as soon as the visitor scrolls, touches, clicks or presses a key, on navigation, or after 20 s. Jumps, bookmarks, Back, Forward and reload all use it.

**Test.** The fixed 900 ms pause became a wait for the smooth scroll to arrive. The assertion is unchanged.

### Routing subpath test: a test defect

**Measured.** "Fetch response has been disposed" from `route.fulfill` and "route.fetch: Test ended" outside any test.

**Cause.** The test's route handler downloaded each file with `route.fetch` and replied with `route.fulfill`. Lazy images were still being requested when the test ended, the context closed, and the handlers in flight failed. Nothing in the site is involved.

**Fix.** The handler now uses `route.continue({ url })`, which rewrites the address without holding a response body. All assertions are unchanged.

### Test isolation

With `--repeat-each`, copies of one journey deleted each other's screenshot folder. `tests/journeys/harness.js` now gives repeats their own folder. Normal runs are unaffected.

## 2. Section registry: was `dist/` changed?

The 30 prerendered pages, `sitemap.xml`, `llms.txt` and `robots.txt` were compared with a snapshot of the build at `ea3e44d`, after normalising bundle file hashes.

| Result | Files |
|---|---|
| Byte-identical | 15 |
| Differ only in whitespace between tags | 18 |
| Any other difference | 0 |

The whitespace comes from the shared helpers: the FAQ, gallery and timeline markup is now produced by one helper instead of two differently indented templates. It has no effect on rendering, because it sits between block or grid elements.

The architecture and how-to guide are in `FUTURE_SECTIONS_ARCHITECTURE.md`.

## 3. Returning visitors

| Area | Finding | Action |
|---|---|---|
| Language persistence | Saved on switching; a bare root visit honours it; the URL decides every other page | Correct, no change |
| Theme persistence | Saved on switching; applied before first paint | Correct, no change |
| Reset | There was no way back to following the device (D3) | Fixed |
| Storage | Only `lang` and `theme` in `localStorage`; nothing in `sessionStorage`; no cookies; questionnaire answers stay in memory | Correct, now tested. The two internal review harness keys exist only on the test-only preview pages |
| Direct links and bookmarks | All 30 pages load directly; section anchors work, except when a module arrived late (D2) | Fixed |
| Breadcrumbs | Match the JSON-LD and navigate correctly | Correct, already tested |
| Back to a gallery | Returns to the same card; the library filter is kept | Correct, now tested |
| Forward, reload, return from another site | The position was lost (D4) | Fixed |
| Scroll jumps | A theme change does not move the page. A language switch goes to the top of the other language's page, by design and asserted by persona C | No change |
| Modals | None opens by itself; the 3D viewer starts only from its button | Correct, now tested |
| Lost state | A language switch discarded the questionnaire (D5) | Fixed |

## 4. Rendering and loading review

| Area | What was checked | Result |
|---|---|---|
| Image loading | On `/`, `/en/`, `/en/about/`, a procedure page, `/en/lens-lab/` and `/clinic/` at 390 px: every image in `main` has width and height; no image far below the first screen is eager; none near the top is lazy | No defect |
| Heavy modules | Home, about, procedure and clinic pages request no Three.js, simulator or Lens Lab chunk on load; `/en/lens-lab/` requests only the Lens Lab chunk until the simulator comes near | No defect |
| Font loading | Self-hosted, `font-display: swap`, metric-matched fallbacks, two first-screen faces preloaded and swapped for English pages | No defect |
| First-load layout | The adoption path (`canAdoptPrerender`, `adoptPrerender`, `finishFirstLoad`, `html.first-load`) was kept, and only the host selector now comes from the registry. `tests/first-render.spec.js` passes | No defect |
| 3D viewer startup | Poster first; starts only from its button; spinner while loading | D1 and D6 fixed |
| Skeleton states | Reserved, shimmering slots for modules; dropped without JavaScript and on failure | Lens Lab reservation is too small, see open items |
| WebGL cleanup | Both simulators dispose their resources and force context loss on destroy; 10 close and reopen cycles keep one viewer and do not grow live contexts (`tests/journeys/stress.spec.js`) | D7 fixed for the one gap found |
| Simulator reopen | Reopen after close, and leaving during loading | D6 and D7 fixed |

## 5. Defects

Unless noted, the browser is Chromium through Playwright, and language and theme do not matter (both were checked where the test states them).

### D1. 3D viewer controls left under the booking bar

- **Severity:** P2. **Page:** `/surgical-education/`, `/procedures/cataract-surgery/` in both languages. **Device:** phones up to about 667 px tall (320×568, 375×667, 390×664 measured).
- **Steps:** open the page on such a phone, press Start, try to use the timeline.
- **Expected:** the controls are clear of the fixed bars. **Actual:** the scrubber is under the bar, and a tap reaches "Call".
- **Root cause:** the scroll ignored the fixed bar. **Fix:** `revealViewer()` in `main.js`.
- **Regression test:** `tests/technical-fixes.spec.js`, "The 3D viewer controls are not left under the booking bar" (10 sizes and pages, and a real tap). **Retest:** before, all of the sizes checked failed; after, pass.

### D2. A jump or bookmark loses its section when a module arrives late

- **Severity:** P2. **Page:** `/lens-lab/`, `/en/lens-lab/`. **Device:** all widths (768 and 1280 tested), worst on a slow device.
- **Steps:** open the page and press "The full vision simulator" before the Lens Lab has loaded, or open `/en/lens-lab/#simulator`.
- **Expected:** the simulator ends up at the top of the screen. **Actual:** it ends about 5,000 px below, and on a slow device never loads.
- **Root cause:** the target was computed once. **Fix:** `holdScrollTarget()` in `main.js`.
- **Regression test:** `tests/technical-fixes.spec.js`, "A jump keeps its target when a module arrives late", and `tests/returning-visitor.spec.js` bookmarks. **Retest:** before, 4 of 4 failed; after, pass. A further test proves the hold releases when the visitor scrolls.

### D3. No way to reset saved language and theme

- **Severity:** P3. **Page:** all. **Device:** all.
- **Steps:** switch theme, then look for a way to follow the device again. **Expected:** a clear way back. **Actual:** none; once saved the choice was permanent.
- **Fix:** the footer shows "Reset language and theme" only when a choice is saved, so it is absent from the prerendered pages. It clears both keys, follows the device again and keeps the current page.
- **Regression test:** `tests/returning-visitor.spec.js`, "Saved preferences". **Retest:** before, failed; after, pass.

### D4. Forward, reload and returning from another site lost the reading position

- **Severity:** P3. **Page:** all. **Device:** all.
- **Steps:** read part of a page, reload (or go Back then Forward). **Expected:** same place. **Actual:** Forward went to the top; reload went to the top or to the URL's anchor.
- **Root cause:** `scrollRestoration` is `manual`, the position was saved only when following a link, and boot ignored it.
- **Fix:** the position is stored on the history entry when scrolling stops and on `pagehide`, and restored at boot on reload or back/forward only. Nothing goes into storage.
- **Regression test:** `tests/returning-visitor.spec.js`, "Back, Forward and reload". **Retest:** before, failed; after, pass.

### D5. Switching language discarded the questionnaire

- **Severity:** P4. **Page:** `/education/`. **Device:** all.
- **Steps:** answer a question, switch language. **Expected:** progress kept. **Actual:** back to step 1.
- **Root cause:** `toggleLang` reset the answers, though they are indexes that do not depend on language. The "before" here comes from reading the code: the first version of this test was blocked by the hidden header, so it did not measure the old behaviour.
- **Fix:** the reset was removed. Answers remain in memory only.
- **Regression test:** `tests/returning-visitor.spec.js`, "a language toggle keeps questionnaire answers". **Retest:** pass.

### D6. 3D viewer: leaving during the download could leave no working viewer

- **Severity:** P3. **Page:** `/surgical-education/`, cataract procedure page. **Device:** all, on a slow connection.
- **Steps:** press Start, leave before it finishes, return, press Start. **Expected:** one working viewer. **Actual:** the first load mounted into the second host, and the two destroyed each other.
- **Root cause:** the load read the global host after its `await`. **Fix:** each start owns its host and stops if the host has changed.
- **Regression test:** `tests/returning-visitor.spec.js`, "3D viewer: leaving and coming back". **Retest:** before, failed; after, pass.

### D7. Vision simulator: leaving during its mount leaked it and left a blank slot on return

- **Severity:** P3. **Page:** `/lens-lab/`. **Device:** all, on a slow connection.
- **Steps:** let the simulator begin loading, leave, return while it is still loading. **Expected:** a working simulator. **Actual:** the mount finished on the removed host, so its WebGL context outlived the page and the slot on return stayed empty.
- **Root cause:** the result was stored without checking the host was still the current one. **Fix:** the same ownership check as D6, and the load restarts on the current host.
- **Regression test:** `tests/returning-visitor.spec.js`, "vision simulator: leaving during its mount". **Retest:** before, failed; after, pass.

## 6. Files changed

- Product: `main.js`, `style.css` (the reset control only), `index.html` (one line: the route placeholder), `site-routes.js`, `section-registry.js` (new), `src/site/section-patterns.js` (new), `src/feature-loaders.js`, `doctor-data.js`, `vite.config.js`, `scripts/prerender.mjs`.
- Tests, new: `tests/section-registry.spec.js`, `tests/returning-visitor.spec.js`, `tests/technical-fixes.spec.js`.
- Tests, changed: `tests/journeys/persona-c.spec.js` (step 8), `tests/journeys/persona-h.spec.js` (step 1), `tests/routing.spec.js` (route handler), `tests/journeys/harness.js` (repeat folders), `tests/phase1-pages.spec.js` (the route pattern is generated at build, so the built pages are checked, all 30 instead of the source file).

## 7. Open items

- **Lens Lab reservation.** It reserves 1,200 to 1,600 px for a module about 6,500 to 9,500 px tall. Jumps are now safe, but the page still grows when the module arrives. Left alone because the Lens Lab UI is being changed by another workstream; the number should be set once that settles.
- **Unknown URLs on hosts with an SPA fallback.** At a URL such as `/some-unknown/`, the `<base>` script cannot tell the site root, so scripts 404 and the static Arabic home shows without its app. Seen on `vite preview`. GitHub Pages serves its own 404 instead, so production is not affected while it deploys there. This behaviour predates this work.
- **Unpublished entries** are in the JavaScript bundle (see the architecture guide).
- **Merged.** This work was merged into `feat/premium-ux-refinement` together with the hero, image and Lens Lab work. The Lens Lab now sits below the simulator, so the jump tests in `tests/technical-fixes.spec.js` were moved to the new order (same assertions, target `#lab`), and on phones a jump to the simulator lands on the workbench (`JUMP_TARGET` in `main.js`, `tests/lens-lab-jump.spec.js`).

## 8. Full suite

On the merged branch `feat/premium-ux-refinement`, final code (`c13c474`): **713 passed, 0 failed, 24 skipped** (flag-gated performance and evidence runs). The runs before it and what each failure was are in `REGRESSION_RESULTS.md`.
