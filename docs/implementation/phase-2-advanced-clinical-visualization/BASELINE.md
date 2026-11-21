# Baseline

Checked on 2026-11-17 before any Phase 2 change.

| Item | Value |
|---|---|
| Live site | https://graduationproject2024.github.io/dr-maan-albarry-website/ |
| Live commit | `9e1773f` (`main`), deployed 2026-11-17 by run 44077997526, gate 379/379 |
| Phase 2 branch | `feat/phase-2`, cut from `6b2dc50` (docs-only commit after `9e1773f`) |
| Historical baselines (not reused as evidence) | full suite 757 passed / 24 opt-in skipped; gate 379/379 |
| Open defect carried over | FS-10 (breadcrumb click under 8-worker load) |
| Clinical items | 31 pending (27 atlas images, 2 text sets, 2 simulator models) |

## Before evidence

Real devices, production site, before any change: `evidence/real-device-cloud/` (iPhone 15 Safari, Pixel 8 Chrome).
3D startup before: `evidence/performance/startup-phase2-baseline.json`.

## What was not changed

Approved design, doctor information, section list, medical content, optical model (`vsim-optics-2026.11-r1`), cataract anatomy model (`csim-anatomy-2026.11-r2`).
