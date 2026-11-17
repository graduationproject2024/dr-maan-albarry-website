# Next Phase 2 — readiness (PROVISIONAL)

**Provisional.** The owner has not defined the next Phase 2. This file uses the brief's suggested focus, "advanced clinical visualization and educational reliability", as a planning frame only. Nothing here is approved scope, and nothing here should be built until the owner confirms it (`PHASE_HISTORY_RECONCILIATION.md`).

## A. Simulator architecture (what exists)

| Part | Cataract 3D (`src/cataract-sim/`) | Vision simulator (`src/vision-sim/`) |
|---|---|---|
| Entry and lifecycle | `mount(host, opts)` → controller with `destroy`, `setLang`, `setTheme`, `on`. Idempotent per host. Started by a button (`window.startCataract3D` in `main.js`) | `mount(host, opts)` → controller with `destroy`, `setLang`, `setTheme`, `setLens`, `setDistance`, `setLighting`, `setScenario`, `reset`, `on`. Mounted lazily on scroll |
| State | `state.js` state machine: idle → loading → ready → playing / paused / transitioning; fallback; error | Plain state object (lens, lensB, compare, distanceM, lighting, refraction, split) plus closer-view framing (presentation only) |
| Timeline | `timeline.js` + `stages.js` (7 stages, each with camera, timing, text) | None (not animated) |
| Rendering | three.js scene (`scene.js`), procedural geometry (`anatomy.js`, `eye-model.js`, `lathe.js`), materials (`materials.js`), instruments (`instruments.js`, `surgery.js`) | Three depth layers rendered once each, per-focus anisotropic Gaussian blur, light sprites, composite (`pipeline.js`) |
| Model | `anatomy.js` MODEL_VERSION `csim-anatomy-2026.11-r2`; `constraints.js` validator; `optics.js` Snell-traced rays | `optics/model.js` + `params.js`, VISION_MODEL_VERSION `vsim-optics-2026.11-r1`; pure functions, unit-tested |
| Input | OrbitControls with limits, touch explore mode, keyboard, scrubber | Native radios and range, divider slider, keyboard |
| Resource ownership | Each mount owns its renderer, listeners, observers, timers; `destroy` releases all (counters in debug) | Same pattern |
| Cleanup | Tested: 8 open/close cycles leave no listeners, observers, loops or renderers | Tested: mount/destroy ×8 leaves no listeners, observers, loops, renderers, render targets |
| Test interfaces | `window.__cataractSim` in debug; review mode `?review=1` | `window.__visionSim` in debug (`sample()` pixel stats); review mode with 51 presets |

## B. Clinical accuracy backlog (known items, classified)

| Item | Kind | Source |
|---|---|---|
| Phaco without grooving or chopping; no I/A, hydrodissection or side-port | Intentional simplification | `PHASE_3_SIMULATION.md` |
| IOL descends straight into the bag; bag does not deform | Intentional simplification | same |
| Posterior corneal radius ≈7.2 mm (anatomical ≈6.5 mm) | Approximation, could be corrected | same |
| No collision detection; scripted instrument paths | Rendering limitation | same |
| Cornea, iris and lens not cut by the cross-section | Rendering limitation | same |
| Hotspot labels not occlusion-tested | Rendering limitation | same |
| Vision simulator: three fixed depth layers; no neural adaptation; generic defocus-curve shapes, not products | Intentional simplification | `VISION_OPTICAL_MODEL.md`, simulator text |
| Halo/glare: sprite model scaled by a straylight parameter | Approximation | same |
| 27 atlas images: per-image simplifications | Intentional simplification | manifest `knownSimplifications` |
| Every stage text, every image, every term | Missing physician decision | `CLINICAL_APPROVAL_QUEUE.md` |
| No true defect is known in either simulator | — | this milestone's full suite and review harness tests |

## C. Asset readiness

| Asset | Origin | Licence | Format | Budget / size | Source files | Approval |
|---|---|---|---|---|---|---|
| Cataract 3D anatomy and instruments | Original procedural code | Project's own | Generated at runtime (no files) | Geometry build ≈1.0 s on the throttled phone profile; 22–28 MB JS heap | The code is the source | Pending |
| three.js 0.170.0 | npm | MIT | JS module | 129 KB compressed | npm | n/a |
| Atlas images (27) | Rendered from project code (`scripts/illustrations`) | Project's own | WebP 480/800/1200 + JPEG | listed in the manifest | Generator scripts in the repo | Pending (13 re-approval) |
| Doctor portrait | Clinic-supplied photograph | Owner-supplied; written web-use permission not on file | WebP 374×450 (from 295×225) | 17 KB | Higher-resolution original missing | n/a |
| Licensed external 3D assets | None | — | — | — | — | — |

No asset was bought or downloaded. Any future external model needs a recorded commercial web licence first.

## D. Technical spike candidates (not to be built now)

| Spike | Feasibility note |
|---|---|
| Faster cataract set-up | Geometry (≈1.0 s) and materials (≈0.35 s) dominate after the download (`CATARACT_STARTUP_PERFORMANCE.md`). Precomputed geometry or textures generated off the main thread could halve it |
| Stage-specific camera and clipping | The engine already has per-stage cameras and clipping planes; extending is low risk |
| Controlled animation paths with collision checks | Needs a constraint model per instrument; the validator (`constraints.js`) is the base |
| Optical visualization (e.g. per-pixel depth blur) | Needs a model change, a new model version and clinical review |
| Low-end devices | Adaptive pixel ratio exists; needs real-phone data first |

## E. Acceptance criteria for future work (template)

- Anatomy consistency: dimensions within stated reference ranges; constraint validator 0 violations over the full timeline.
- Motion consistency: every stage's text matches what is drawn (review harness screenshot per stage).
- Scene state: state machine transitions covered by tests; Back, language and theme changes keep state.
- Interaction: keyboard, touch, reduced motion; 44 px targets; no page jump.
- Device compatibility: Chromium and WebKit emulation, then real iPhone and Android (`MOBILE_DEVICE_TEST_PLAN.md`).
- Performance: tap-to-ready median on the throttled profile not worse than today (2.5 s cold-code-cached, 2.0 s second visit); no leaked contexts.
- Clinical traceability: new MODEL_VERSION; changed items marked for re-approval; `release:check` clean.

## Readiness verdict: CONDITIONAL

Engineering foundations are in place and tested. The phase cannot start until (1) the owner defines it and (2) the owner decides whether the pending clinical review of existing material comes first.
