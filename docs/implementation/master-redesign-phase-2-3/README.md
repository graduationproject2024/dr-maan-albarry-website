# Master redesign + Phase 2/3 — evidence package (2026-11-01)

| File | Contents |
|---|---|
| `BASELINE.md` | The starting state: commit, architecture, baseline screenshots and owner feedback |
| `../recovery/DOCTOR_CONTENT_RECOVERY.md` | Content recovery and governance: provenance policy, each restored or retained fact, test changes |
| `CLAUDE_DESIGN_SYSTEM.md` | Design system: tokens, type, grid, motion, RTL/LTR. The design lead is disclosed (no dedicated "Claude Design" tool existed) |
| `VISUAL_REDESIGN.md` | Three critique → fix rounds on real screenshots |
| `BEFORE_AFTER.md` | Before/after screenshot pairs per section |
| `PHASE_2_ENGINEERING.md` | 3D engine: architecture, API, state machine, lifecycle |
| `PHASE_3_SIMULATION.md` | Anatomy, the 7 stages, animation-to-text mapping, simplifications |
| `ASSET_LICENSES.md` | Asset licensing: all procedural, plus three.js (MIT) |
| `CLINICAL_REVIEW.md` | What Dr. Maan must review and sign off |
| `ACCESSIBILITY.md` | WCAG 2.2 AA items with evidence, and what was not verified |
| `PERFORMANCE.md` | 3D frame rates, site load metrics and bundle sizes |
| `TEST_RESULTS.md` | 139/139 passing, per spec, plus the defects the tests caught |
| `TRELLO_CLOSURE.md` | Board changes, verified by re-reading the board |
| `RELEASE_READINESS.md` | Verdict, the §19 acceptance answers and the remaining blockers |

**Evidence** (`evidence/`): `before/` and `after/` section screenshots, booking-bar measurements, in-page 3D screenshots in `after/interactions`, and every simulator stage in `simulator/`. The capture scripts write PNG. The committed copies were converted to JPEG (quality 82, and full-page images at half scale) to keep the repository small.

**Reproduce:**
```bash
npm ci && npx playwright install chromium
npx playwright test
npm run build && node tests/capture-sections.mjs <outDir>
npm run build && node tests/capture-3d.mjs <outDir>
npm run build && node tests/perf-site.mjs
```
