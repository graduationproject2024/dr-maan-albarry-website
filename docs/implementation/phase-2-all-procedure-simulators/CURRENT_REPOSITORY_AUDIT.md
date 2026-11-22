# Repository audit at the start of Phase 2 (2026-11-22)

## Git state

- `origin/main` is at 9e1773f. This is the live site, deployed on 2026-11-17.
- `feat/legacy-zero` was pushed on 2026-11-22. A pull request to `main` was prepared and is waiting for the owner. It contains:
  - `feat/phase-2` (device fixes P2-01…P2-10 and the 3D start-up work);
  - the desktop motion layer;
  - the CSP and referrer meta tags;
  - the legacy-backlog docs.
  Final run on it: 752 passed, 0 failed.
- This milestone's work is on `feat/phase-2-simulators`, branched from `feat/legacy-zero` at 3c2da42. It is local and not pushed.
- Uncommitted files from earlier milestones were left alone and are not part of these commits:
  - evidence images that test runs regenerated;
  - `.claude/`;
  - `graphify-out/`.

## What existed

| Area | State | Kept as |
|---|---|---|
| Cataract simulator (`src/cataract-sim/`, about 250 KB of source) | 7 stages; pause, seek and review mode; constraints validator; versioned anatomy (`csim-anatomy-2026.11-r2`); WebGL fallback; tests (sim, stress, integration, constraints, review, warm-up) | The quality benchmark. Its core modules are reused by the new engine. |
| Lens Lab (`src/lens-lab/`) | Lens-type comparison with its own optics | Unchanged. The IOL simulator links to it and does not duplicate it. |
| Vision simulator (`src/vision-sim/`) | Image-based vision previews | Unchanged |
| Light journey (`src/light-journey/`) | 2D diagram | Unchanged |
| Procedure pages (`main.js` `renderProcedurePage`) | 7 pages. Only cataract had a 3D section (`p.simulator`). | A 3D section was added for the other six. |
| Procedure content (`src/procedures/content.js`) | Anatomy, types, steps and sources for every page | Single source of the simulators' clinical wording |
| Motion layer (`src/motion/`) | GSAP and Lenis, desktop only, never drives 3D | Unchanged. The simulators do not use GSAP. |

## Gaps this phase closes

1. Six of the seven procedure pages had no interactive 3D.
2. Each page that needed 3D would otherwise have needed its own engine. The cataract simulator's controller is tied to its own stages.
3. The cataract viewer captured the plain mouse wheel. Scrolling the page over the viewer zoomed the model instead.
4. The cataract viewer had no full-screen mode for phones.
