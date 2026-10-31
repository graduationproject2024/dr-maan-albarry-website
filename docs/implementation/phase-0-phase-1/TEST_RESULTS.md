# Test Results

## Commands
```bash
npm run build            # tsc && vite build (JSON-LD + llms.txt generated)
npm test                 # playwright test — always rebuilds, serves dist/ with vite preview :4173
npx playwright test --repeat-each=2   # stability
npm run test:evidence    # screenshots + bounding boxes → EVIDENCE/after (needs a running preview)
npm audit
```

Environment: Windows 11, Node 24.18.1, `@playwright/test` 1.64.1 (Chromium). On Windows, WebGL runs on the real GPU through ANGLE/Direct3D 11 (`--use-angle=d3d11`). Headless Chromium otherwise uses SwiftShader, where one simulator click measured **9,253 ms** versus **310 ms** on the GPU. That matches the audit's note that SwiftShader caused the simulator timeouts, not simulator logic.

## Final results (2026-10-31, after all review fixes)

| Run | Passed | Failed | Skipped | Flaky | Blocked |
|---|---|---|---|---|---|
| `npm test` — final run ([log](EVIDENCE/playwright/final-run.txt)) | **66** | 0 | 0 | 0 | 0 |
| `--repeat-each=2` stability (64-test suite, before the follow-up commit) | **128** | 0 | 0 | 0 | 0 |
| `npm run build` | ✔ | | | | |
| `npm audit` | 0 vulnerabilities | | | | |

Breakdown: `tests/phase0-content.spec.js` 14 tests · `tests/phase1-mobile.spec.js` 52 tests.

### Phase 0 tests (14)
- Contact links (tel / WhatsApp / booking) only from approved central data — AR, EN
- No unsupported stats, licence, testimonial placeholder, lens preference or 2.2 mm in the full text, including every simulator lens note and the questionnaire result — AR, EN
- Professional roles render exactly as the data states; no "Chief Medical Officer / Senior / المدير الطبي التنفيذي" — AR, EN
- No clinic hours stated — AR, EN
- JSON-LD: one block, parses; no Review / AggregateRating / BreadcrumbList / openingHours / priceRange; telephone = rendered tel link; jobTitle = visible subtitle; FAQ questions **and** answers identical to the visible FAQ
- llms.txt generated, contains roles and verified contacts, no removed claims
- Every generated file in `dist/` is free of preference wording, licence claims, the unverified number, 2.2 mm, and patient names
- Testimonial publication gate (unit)
- Testimonial rendering: records injected into the built bundle via request interception. A valid record renders with its source link and no stars; records missing permission or source render nothing.

### Phase 1 tests (52)
- 8 combinations (360/390 × AR/EN × light/dark) × 5 tests:
  - sticky bar: 3 actions inside the viewport, ≥44px, no overlap, labels unclipped on one line, correct destinations
  - no horizontal overflow; footer not hidden by the bar
  - hero CTA label inside its button; above the bar on the first screen; booking URL
  - clinic CTA label fits; real portal URL, `target=_blank`
  - simulator: tags don't overlap and stay in frame for all 4 lenses; width; 16:9; keyboard slider Home/End; scene switch; curve tab; disclaimer visible
- 768px bar visible and fits; 1366/1440 × AR/EN: bar hidden, hero CTA intact **and on the first screen**, facts strip present, no overflow
- WCAG AA text contrast ≥4.5:1 for every booking/WhatsApp/call action and the hero/clinic CTAs — light, dark
- Regression: no console errors, page errors or failed same-origin requests; language and theme toggles; no broken images (incl. lazy after scroll); mobile drawer + nav + scroll-spy active state; FAQ, education accordion, questionnaire full flow and restart; active scroll listeners don't accumulate across re-renders

### Test validity checks (mutation)
- Forcing the bar to 3×200px columns and making CTA labels `nowrap` → **16/16** targeted tests failed (then reverted).
- Restoring the old WhatsApp green `#25d366` → contrast tests failed in both themes (then reverted).

## Bounding-box evidence — before vs after
Full data: `EVIDENCE/before/measurements.json`, `EVIDENCE/after/measurements.json`, summaries in each `summary.txt`.

| Viewport | Bar actions off-screen | Clipped buttons | Clinic CTA label / button | Page height (AR) |
|---|---|---|---|---|
| 360 AR | **2/4 → 0/3** | 1 → 0 | **273/246 → 171/246** (wraps to 2 lines) | 25,846 → 23,362 |
| 360 EN | **2/4 → 0/3** | 1 → 0 | 236/246 → 171/246 | 26,099 → 23,809 (EN) |
| 390 AR | **1/4 → 0/3** | 1 → 0 | 273/276 → 201/276 | 24,998 → 22,660 |
| 390 EN | **1/4 → 0/3** | 1 → 0 | 236/276 → 201/276 | 25,019 → 22,886 (EN) |
| 768 | 0/4 → 0/3 | 0 → 0 | 273/654 | 18,626 → 17,040 |
| 1366 / 1440 | bar hidden | 0 → 0 | 273/425 | 14,181 → 13,294 |

Note: the hero CTA label measured 206/312px at 360 on this baseline, so it was not clipped in the current `main`, unlike the older audit figures. It is now also protected by wrapping and covered by tests.

## Console / network
- Same-origin requests: no failures, no 4xx/5xx, no page errors, no console errors (regression test).
- The capture script once logged an aborted cross-origin `google.com/maps/embed` iframe request. The lazy map iframe was cancelled when the capture context closed; it is not a site error.

## Known testing gaps
- Real-device checks (iOS Safari safe-area, Android Chrome) were not run; only Chromium emulation.
- Not run on Linux/macOS. There, WebGL would fall back to SwiftShader and the simulator tests would likely time out unless a GPU is configured. Not verified.
