# Test Results — 2026-11-01

**Command:** `npx playwright test`. The Playwright config always rebuilds through `npm run build`, which runs tsc, the Vite build and the prerender. It then serves `dist/` with `vite preview` on :4173.

**Environment:**
- Windows 11, Chromium from Playwright 1.64.1.
- WebGL routed to the RTX 2060 through ANGLE/D3D11 (not SwiftShader).

**Result: 139 passed · 0 failed · 0 flaky · 4 skipped** (1.5 min). Raw output: `evidence/playwright-results.json`.

| Spec | Passed | Skipped | What it guarantees |
|---|---|---|---|
| `content-registry.spec.js` (new) | 5 | 0 | Every public registry fact is present in the data **and** visible in AR and EN. Doctor-sourced facts are `confirmed`. 15,000+ keeps its combined meaning. Internal-only facts (e.g. "100%") never reach `dist/`. |
| `phase0-content.spec.js` (updated policy) | 14 | 0 | Contact links come only from data, including the direct line for call and WhatsApp. No 100%, licence-badge, lens-preference or incision claims. Roles match the data. Hours are shown. The JSON-LD mirrors the FAQ, phone, Saudi Board and hours. llms.txt is correct. `dist/` contains no obsolete claims. The testimonial gate holds. |
| `phase1-mobile.spec.js` | 52 | 0 | Booking-bar geometry; hero and clinic CTAs; Vision Simulator tags and controls. One geometry assertion was made frame-atomic, because the view and tag boxes were previously read in two separate calls and could disagree during a reveal transition. Also contrast ≥4.5, overflow, accordions, drawer, scroll-spy and no listener leaks. |
| `closure.spec.js` (extended) | 40 | 0 | Smoke matrix at **7 widths** (360, 390, 430, 768, 1366, 1440, 1920) × AR/EN × light/dark: header and booking visible, no overflow, scroll reaches the footer, no blocking overlay, zero console errors. Also: theme follows `prefers-color-scheme`, the explicit choice persists, the language persists, drawer ARIA and Escape, accordion ARIA, Vision Simulator context-loss fallback, the credential ledger stays intact, the 3D section and nav links in both languages, and three.js is not in the main bundle. |
| `seo.spec.js` (new) | 4 | 0 | `/` and `/en/` return 200 with real prerendered content **with JavaScript disabled** (correct lang/dir, H1, statistic, hours, phone, FAQ). `/en/` boots without errors or broken assets. Canonical, hreflang, sitemap and robots agree and list only routes that exist. |
| `cataract-sim.spec.js` (new) | 19 | 4 | The 3D module on its harness page: mount/destroy with counters back to 0, idempotent remount, every state-machine transition, stage navigation, scrubbing, zoom/reset, drag-rotate, setLang/setTheme with the canvas preserved, WebGL context loss and restore, no-WebGL fallback, reduced motion, keyboard including RTL arrows, ARIA live, mobile layout and touch, non-blank canvas. The 4 skipped are opt-in evidence and performance captures (`CSIM_EVIDENCE=1`, `CSIM_PERF=1`), which were run separately. |
| `cataract-integration.spec.js` (new) | 5 | 0 | The 3D module **inside the real page** at 390/1440 in AR-dark and EN-light: nothing 3D is downloaded before the click; title and body contrast ≥4.5 on the card; the start button and caption are clear of the toolbar; a language toggle keeps one canvas and switches the module; close removes the canvas and restores the poster. Also: a language switch made while the module is still loading is applied once it is ready. |

## Defects found by these tests and fixed in this phase
1. **Unreadable stage title** inside the page. The site's heading colour on the dark band overrode the simulator card's `h3` (contrast 1.17:1). Fixed by giving the simulator self-contained colour tokens and explicit text colours. Now covered by `cataract-integration`.
2. **Toolbar overlapping the start caption** on phones. Fixed with extra bottom padding on the start overlay below 600 px. Covered by `cataract-integration`.
3. **Language change lost while the 3D module was loading.** Fixed by re-applying `setLang` and `setTheme` when mount resolves. Covered by a dedicated test.
4. **Timing-sensitive geometry read** in the Vision Simulator tag test. Fixed by measuring the view and tags in one synchronous snapshot. It then passed 24/24 when repeated alone and in two full runs.

## Other verification
- **Booking geometry evidence:** `node tests/measure.mjs …/evidence/after/booking` covered 20 combinations (5 widths × AR/EN × light/dark). All 20 had no horizontal overflow, 0 of 3 booking actions off-screen, 0 clipped labels and 0 console errors.
- **Section screenshots:** `node tests/capture-sections.mjs …/evidence/after/sections` covered 390 and 1440 × 4 language/theme combinations × 13 sections, with 0 capture failures.
- **In-page 3D screenshots:** `node tests/capture-3d.mjs …/evidence/after/interactions`.
- **Not proven by these tests:** visual quality, clinical accuracy and real-phone performance. Those were reviewed by eye or are listed as open in `RELEASE_READINESS.md`.
