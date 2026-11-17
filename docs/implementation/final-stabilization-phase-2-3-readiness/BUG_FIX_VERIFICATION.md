# Bug fix verification

Each fix was proved with a test that fails without it where that was possible. Register: `REMAINING_DEFECTS.md`.

| ID | Proof before | Proof after |
|---|---|---|
| FS-01 Back position | New test run with `main.js` stashed: both cases failed (restored at 3,294 px, expected > 8,165 px) | Both pass; whole `returning-visitor`, `technical-fixes`, `lens-lab-jump`, `journey-regressions` suites pass (67/67) |
| FS-02 Short landscape | `evidence/mobile/landscape-before.json`: 568×320 did not fit at 100 %; at 150 % a lens button could not be brought between the bars; labels broken mid-word (screenshot `landscape-before-568x320-100.jpg`) | `landscape-after.json`; new tests 9/9; screenshot `landscape-after-568x320-100-near.jpg` |
| FS-03 Unknown address | Live site: GitHub's page (`curl` → 404 with "Page not found · GitHub Pages"); `journey-regressions` BUG-11 confirmed the home page was shown | 8 new routing tests pass (static-host 404.html with status 404, SPA fallback, language switch, way back, head restored) |
| FS-04 Pins / key | First audit: 4 overlapping figures, key 13 px | Re-audit: 0 / 15 px; plate and procedure suites 131 pass |
| FS-05 Light-journey reserve | 640/900 px reserved vs 1,195–1,290 px mounted | 1,200/1,250 px; no shift measured |
| FS-06, FS-07 first-render races | Failed 1 in 5 runs and once in the gate run | 75/75 with `--repeat-each=3` |
| FS-08 Subpath test crash | Reproduced under load on this branch and on the live commit | Crash gone; abandoned requests recorded |
| FS-09 Touch drag test | 1 of 3 loaded runs | 4 of 4 loaded runs |
| FS-10 Breadcrumb under load | 3 of 12 loaded repeats | **Not fixed** (open) |

Lens Lab distance experience (not a bug; a UX change): proved by `lens-lab-distance.spec.js` — model values identical per lens and lighting, pixels scale with the zoom, 15-step flow at 7 sizes.
