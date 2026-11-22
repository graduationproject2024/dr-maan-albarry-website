# Phase 3 architecture readiness

A new educational module is one definition file. The engine, library, UI, review metadata, tests and page integration are reused as they are.

| Need | Ready in |
|---|---|
| Anatomy | `anatomy/build.js` + `geometry.js`: deformable layered cornea, iris, lens, capsule, ciliary body, retina / choroid / macula / disc / vessels, vitreous, IOL, ICL |
| Rendering | Shared renderer, environment, precompile, section plane without recompiles, adaptive pixel ratio, low-memory cap |
| Timeline | `stage()` helper; `apply()` is a pure function of the timeline position |
| Viewer UI | Shell with technique tabs, camera presets, toggles, options, labels, full screen, Arabic / English, text fallback |
| Review | `getReviewMetadata()` with a content hash; model versions; review-queue format |
| Tests | `tests/surgical-sim.spec.js`: add the slug to `SLUGS` for the full lifecycle checks, plus a probe test. `tests/devices/android-procedure-sims.mjs` takes a slug list. |
| Page | Add the slug to `SIM_SLUGS` and `P3D_COPY` in `main.js` |

## Steps for a new module

1. Write `procedures/<slug>.js` (contract in `SHARED_ENGINE_ARCHITECTURE.md`).
2. Register it in `index.js`.
3. Register it in `main.js`.
4. Add it to the tests.
5. Add it to `MODEL_VERSIONS.md` and `CLINICAL_REVIEW_QUEUE.md`.

No Phase 3 module was built, and no new procedure was added.

## Known follow-ups worth doing before Phase 3

- `iclZ` in `geometry.js`: make the shared ICL shape clear the iris. The ICL module uses its own plate for now.
- Export the iris surface functions from `geometry.js`. The ICL module has a copy.
- `layeredPatch`: return the inner and outer walls.
- A helper for clipped clones of free materials.
