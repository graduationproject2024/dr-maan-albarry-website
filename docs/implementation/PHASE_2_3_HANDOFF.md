# Phase 2 / Phase 3 Handoff

**Prepared:** 2026-11-01 · **Base:** branch `feat/phase0-phase1-trust-booking-mobile` (Phase 0 technically complete; Phase 1 verified complete)

## 1. Confirmed scope vs assumptions
No roadmap or simulation-blueprint file exists in the repository or its history. `docs/project-audit/IMPROVEMENT_ROADMAP.md` was referenced earlier but was never present. Scope below is limited to what the project owner has stated in writing.

| Item | Status | Source |
|---|---|---|
| A new **Cataract Surgery 3D** educational experience, separate from the existing vision simulator | **Confirmed** | Owner's Phase 0/1 brief ("future Cataract Surgery 3D experience") and closure brief |
| Real interactive 3D (not video or simple animation): anatomical models, procedural stages, start/pause/resume, zoom/pan/rotate, step-by-step explanations, Arabic + English, responsive controls, realistic visuals, fallback behaviour | **Confirmed capability list** | Closure brief §10 |
| Medical review before clinical approval; no invented facts or surgical steps | **Confirmed constraint** | Closure brief §10 |
| Which items belong to Phase 2 vs Phase 3 | **Not confirmed** | No document defines the split. The proposed split in §5 is an assumption to confirm. |
| SEO/rendering work (pre-rendering, real `/ar` `/en` URLs, domain) | **Assumed** "next phase"; not assigned to 2 or 3 | Findings B-6 |
| Trello card "make animation for procedures and services" | Likely the home for this work. The card has no description, so treat it as an assumption. | Board |

## 2. Architecture readiness
| Area | Current state | Gap for the new simulator |
|---|---|---|
| 3D runtime | three.js **r128** global script from cdnjs (`index.html`), used by `VisionSim` in `main.js` (46 `THREE.` refs) | r128 (2021) has no ES-module loaders. Recommend `three` from npm (current release), imported as a module **only by the new simulator**, lazy-loaded, so VisionSim keeps working. Migrate VisionSim later. |
| Integration point | `renderApp()` re-renders the whole page on language change and re-mounts VisionSim (`mount`/`destroy` pattern) | Follow the same contract: `mount(host, {lang})` / `destroy()`, idempotent. Use the disposal and context-loss handling added in `1b320ae` as the template. |
| WebGL lifecycle | VisionSim now disposes scenes, render targets and textures and handles `webglcontextlost` | Reuse; add `webglcontextrestored` re-init for the new simulator |
| Data / i18n | Bilingual strings inline (`T(ar, en)`); clinic facts in `doctor-data.js` | Put procedure step text in a separate reviewable data file (e.g. `cataract-steps.js`) with `{ar, en, reviewedBy, reviewedAt}`, so medical sign-off is per step |
| 3D assets | **None** in the repo (no .glb/.gltf/.ktx2/.hdr) | Must be sourced. See §3. |
| Performance | VisionSim renders 1280×720 HDR plus post-processing at ≤45 fps, pauses off-screen | Budget for mobile: Draco/meshopt-compressed glTF, KTX2 textures, ≤~150k triangles, pause when hidden, lazy-load on scroll |
| Testing | Playwright (92 tests) against the production build; GPU via ANGLE on Windows; SwiftShader is ~30× slower | Add simulator specs (state machine: stages, pause/resume, keyboard controls, fallback). Snapshot-test non-canvas UI only. CI needs a GPU runner or reduced-render test mode. |
| Fallback | Text fallback when WebGL is unavailable or lost | New simulator needs a full non-3D fallback: illustrated steps with the same reviewed text |
| Accessibility | ARIA patterns in place (slider role, focus rings, aria-expanded) | All controls keyboard-operable; reduced-motion mode; text alternative for every stage |

## 3. Licensing and clinical review (gating)
- **3D anatomy models:** commissioned, or licensed with explicit commercial-web rights (e.g. CC-BY with attribution, or a paid licence). Record the licence per asset. Do not ship unlicensed downloads.
- **Clinical content:** every stage title and explanation needs Dr. Maan's written review before public release. Until then, ship behind a flag or label it "draft — not clinically approved".
- Phase 0 decisions (Trello #13) do not block simulator engineering.

## 4. Trello preparation
| Existing card | Relation | Suggested action (not yet done; needs your OK) |
|---|---|---|
| make animation for procedures and services | Most likely Phase 2/3 umbrella | Add description + checklist from §5 |
| buying domain and server | Blocks SEO/canonical work (B-6) | Dependency for the SEO track |
| MAKE RESERVATION SYSTEM, make bot in website, Make Automatiom, security, update pics | Separate tracks; not simulator scope | Leave as is |
| PENDING EXTERNAL APPROVAL (#13) | Phase 0 carry-over | Keep open; not a dependency for 3D work |

No Phase 2/3 cards were created or changed, to avoid duplicates before you confirm the split.

## 5. Immediate implementation sequence (dependency-aware)
| # | Task | Depends on | Output |
|---|---|---|---|
| 1 | **Confirm scope split and stage list with Dr. Maan** (stages named by him, not invented) | — | Approved stage outline (AR/EN) |
| 2 | Spike: npm `three` + `GLTFLoader`/Draco lazy-loaded module, mounted beside VisionSim with the mount/destroy contract; placeholder primitives | — (can start now) | `simulator/cataract/` skeleton, bundle-size and fps numbers at 360/390 |
| 3 | Stage state machine (start / pause / resume / next / previous / scrub), keyboard + touch controls, OrbitControls with limits | 2 | Engine independent of art |
| 4 | Asset sourcing and licensing | 1 | Licensed or commissioned models |
| 5 | Bilingual step data file with review fields; non-3D fallback renderer | 1 | `cataract-steps.js`, fallback UI |
| 6 | Integrate models; performance pass (compression, LOD, pause off-screen) | 3, 4 | Mobile within budget |
| 7 | Playwright specs + a11y + reduced-motion | 3, 5 | Tests in `npm test` |
| 8 | Clinical review sign-off; release behind a flag until approved | 5, 6 | Approved release |

**Phase 2/3 readiness:** engineering can start now with tasks 2–3 (no external dependency). Content and visuals are blocked on task 1 (stage list approval) and task 4 (licensed models).

**First concrete action:** Task 2. Add `three` as an npm dependency and create a lazy-loaded `cataract-sim` module with the `mount/destroy` contract and placeholder geometry, then measure load size and fps on 360/390 phones.
