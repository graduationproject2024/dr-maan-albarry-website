# Evidence index

| Path | Content |
|---|---|
| `before/<viewport>/` | Baseline (`main` @ 9da524c) screenshots: `<lang>-<theme>-top.png`. At ≤768px also `-clinic.png` and `-simulator.png`. Dark-theme captures at ≤390px only. |
| `before/measurements.json`, `before/summary.txt` | Bounding boxes of bar actions, hero/clinic CTAs and their labels, simulator tags; page height; console/network errors, for 5 viewports × AR/EN × light/dark |
| `after/…` | Same captures and measurements on the final branch build |
| `playwright/final-run.txt`, `playwright/results.json` | Final Playwright run (64 passed) and JSON report |
| `jsonld/dist-jsonld.json`, `jsonld/validation.txt` | Generated JSON-LD and its validation |
| `jsonld/main-branch-jsonld.json` | Previous hand-written JSON-LD, for comparison |
| `claim-search.md` | Repository-wide search for obsolete claims |
| `REVIEWER_FINDINGS.md` | Independent reviewer findings and how each was handled |

Viewports: 360×800, 390×844, 768×1024, 1366×768, 1440×900. Capture script: `tests/measure.mjs`.
Older visual QA from earlier work remains in `/artifacts/ui-review` (untouched).
