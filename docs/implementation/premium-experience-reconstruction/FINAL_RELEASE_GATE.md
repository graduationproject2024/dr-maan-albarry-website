# Final release gate

Date: 2026-11-09. Branch: `feat/premium-experience-reconstruction`, built on `main` at `9322dd9`. Merged to `main` and deployed on the owner's instruction of 2026-11-09, to send this version to a customer.

## Summary

| Gate | State | Decided by |
|---|---|---|
| Engineering readiness | **Ready** (one known flaky test, below) | Tests below |
| Visual acceptance | **Pending** | Owner |
| Clinical approval | **Pending. Nothing has been approved.** | Dr. Maan Albarry |
| Production authorization | **Given by the owner on 2026-11-09** | Owner |

The four gates are separate. A pass in one does not count toward another. No test result, screenshot or render is clinical approval. The owner's instruction to deploy is not owner visual acceptance and not physician approval: the site went live with every plate labelled "pending physician review".

## Engineering readiness

| Check | Command or method | Result |
|---|---|---|
| Full browser suite | `PW_PORT=4671 PRERENDER_PORT=4676 npx playwright test` on the code that was deployed | 521 passed, 1 failed, 24 skipped (flag-gated perf and evidence runs). The failure is Persona C step 8, a scrubber tap that lands off the control under full-suite load; it passed 3/3 alone. |
| Earlier full runs | See `FIX_VERIFICATION.md` | Real failures found on the way were fixed. Persona C, the routing subpath test and Persona H have each failed under load and passed alone. The suite can still fail one of these under load. |
| Patient journeys | `tests/journeys/premium-journeys.spec.js` | 38/38, 257/257 steps |
| Defects | `BUG_REGISTER.md` | BUG-19 to BUG-28 Fixed, each with a named regression test. No P0 or P1. |
| Production build | `npm run build` | 30 prerendered pages, 30 sitemap entries |
| Dependencies | `npm audit` | 0 vulnerabilities |
| Accessibility, automated | `tests/journeys/axe.spec.js`, reduced-motion and keyboard specs | Pass. Automated checks only; this is not a full WCAG 2.2 AA audit. |
| Layout shift on a slow first load | 320 and 360 px, Arabic home, Fast 3G + CPU 4x, 3 runs each | CLS 0 in all runs |
| 3D code on the homepage | `tests/journeys/premium-perf.spec.js` | three.js is not requested, even after a full scroll |
| Review tools on the public site | Production build inspected | The harness pages are absent (`dist/` has only the prerendered pages). Review mode needs `review: true`, which only the harness pages pass. A `review-*.js` code chunk is emitted but nothing on the public site loads it. It holds no reviewer data. |
| Secrets in `dist/` | Pattern search for common key formats | None found. Limited to those patterns. |

**LCP (fixed 2026-11-09):** on an emulated phone (390 px, Fast 3G + CPU 4x), home went 4,272 → 2,696 ms and the cataract page 5,796 → 2,660 ms. Both are faster than the earlier design (3,044 and 4,080 ms). Desktop LCP is 124–180 ms. Lab numbers; see `PERFORMANCE_RESULTS.md`.

**Not tested:** physical phones and tablets, a real screen reader, field performance data. Everything above is Chromium or WebKit emulation on one Windows machine. Frame rates depend on its desktop GPU and do not predict phones. Fallback font metrics were measured on Windows only.

## Visual acceptance (owner)

Four engineering review passes are recorded in `VISUAL_ACCEPTANCE.md`. They are not owner acceptance. Trello card #18 stays open until the owner accepts the result.

For the owner to decide:
- A high-resolution portrait. The current file is 295×225 px, and it is the most valuable single fix.
- Lens Lab is still very long at 390 px, and it holds two vision simulators.
- `clinic-exam-room.jpg` and `diagnostics-pentacam.jpg` are marked do-not-restore (`HOMEPAGE_CONTENT_MATRIX.md`, X7).
- Permission for `dr-maan-redsea.jpg`.
- The Arabic clinic hours mix Arabic-Indic and Western digits (`doctor-data.js`).

## Clinical approval (physician)

All pending, tracked on Trello card #22:
- 3D cataract simulator: anatomy, motion and text for all 7 stages, then final approval.
- Vision simulator: optics, picture and text for all 51 presets, then final approval.
- All 27 anatomical images: anatomy, pin labels and captions.
- Open medical questions in `public/images/procedures/manifest.json` and `IOL_COMPARISON_REVIEW.md`.

Plates carry a visible "pending physician review" label on the site. Doctor data decisions D-1 to D-14 stay on Trello card #13.

## Production authorization

Given by the owner in chat on 2026-11-09 ("START DEPLOYING BECAUSE I WANT TO SEND THIS VERGION FOR CUSTOMER"). The deploy workflow runs from `main`, so the branch was merged to `main`.

## Blockers

| Blocker | Blocks | Owner of the decision |
|---|---|---|
| Owner has not formally accepted the visual result | Closing card #18 | Owner |
| Physician review not done | Presenting any plate or simulator as physician-endorsed | Dr. Maan Albarry |
