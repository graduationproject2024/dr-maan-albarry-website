# Regression results (local, Windows, GPU through ANGLE/D3D11, production build)

| Run | Result |
|---|---|
| First gate run after the feature work (15 gate files) | 353 passed, **30 failed** |
| Gate + touched suites after the first fixes (25 files) | 612 passed, **40 failed** |
| After moving the Toric switch and enhanced monofocal into More settings, plus test updates | 241/243, then 126/126 on the affected files |
| **Final: gate (15 files) + all touched suites (25 files in total)** | **668 passed, 0 failed, 0 flaky** (12.7 min, 2 workers) |
| New suite `tests/clinical-profile-expansion.spec.js` | 34/34 (part of the final run) |

Files in the final run:
- Gate: content-registry, section-registry, phase0-content, seo, routing, first-render, hero-portrait, phase1-pages, phase1-mobile, plates-clarity, closure, vision-optics, cataract-constraints, journeys/axe, journeys/security.
- Touched suites: clinical-profile-expansion, lens-lab, lens-lab-distance, lens-lab-mobile, vision-sim, returning-visitor, surgical-sim, light-journey, procedures, journey-regressions.

## What the first failures were, and what was done
- **Count-up changed the page text while it animated** (first-render, 6 cases). Fixed in code: the digits are now drawn from `data-n`.
- **Toric switch and a 4-lens row in the simulator's simple controls broke the proven phone and landscape fit** (lens-lab-distance and lens-lab-mobile, about 20 cases). Fixed in code: back to 3 lenses in the simple row, with enhanced monofocal and Toric in More settings.
- **Light Journey speed buttons were 36 px.** Fixed: now 44 px. Manual navigation now pauses autoplay.
- **Owner-requested changes that older tests still expected the old way.** Tests updated, each with a dated comment:
  - removed hero plate
  - 15,000+ changed to 25,000+
  - 66 cm changed to 65 cm
  - Toric is now a switch
  - homepage card markup changed to the image + name gallery
  - lens order
  - Light Journey note text
  - page-height budgets: home at 390 px +850 px (large images); lens lab at 390 px +ocular-surface section

## Not run in this pass
- Remaining journey and persona suites (only selectors were updated; they were not executed): core-journeys, persona-*, premium-journeys, stress, webkit, touch-gestures.
- Cataract-sim, stress and review suites. They are unchanged by this work.
- CI on GitHub: nothing was pushed.
- The nightly CI failure on `main` (BUG-C01) predates this branch.
