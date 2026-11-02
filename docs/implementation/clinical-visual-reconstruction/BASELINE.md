# Baseline — clinical & visual reconstruction (2026-11-01)

## Repository state at start
| Item | Value |
|---|---|
| Starting branch | `feat/master-redesign-phase-2-3` at `0d167b7`. PR #2 is open against `main` and not merged. |
| `main` | `402bc49`, live on GitHub Pages (Phase 0/1) |
| New branch | `feat/clinical-visual-reconstruction`, created from `0d167b7` |
| First commit | `5423751`: `PW_PORT` and `PRERENDER_PORT` were made configurable so parallel worktrees could build and test side by side |
| Untracked, left alone | `.claude/`, `graphify-out/`, `docs/implementation/master-redesign-phase-2-3.zip` |
| Tests at baseline | 139 passed, 4 skipped (Playwright) |

The previously reported implementation is present on this branch, because the branch was cut from PR #2's head.

## What the owner rejected
1. **Visual design.** The navy, gold and ivory "editorial" redesign from PR #2 was rejected: typography, content layout and procedure presentation were judged below expectations.
2. **Information architecture.** There was no procedure-discovery structure: no gallery and no dedicated procedure pages. The owner wanted a content distribution similar to dramralamin.com, used as an information-architecture reference only.
3. **Cataract 3D simulator.** Dr. Maan reported anatomical inaccuracies and physically implausible movement.
4. **Vision simulator.** Dr. Maan reported problems with its optical assumptions and its user experience.

## Simulator behaviour at baseline (recorded before any change)
- **Cataract 3D** (`docs/implementation/clinical-visual-reconstruction/evidence/surgery/before/`, 28 frames):
  - The posterior cornea was an offset of the anterior surface.
  - The capsulorhexis was a scale transform.
  - The lens "shrank and vanished".
  - The IOL floated in an inflated, empty bag.
  - The cross-section clipped only the sclera and ciliary body.
  - The rays were hand-placed lines.
  - Details are in `CATARACT_ANATOMY_REVIEW.md` and `CATARACT_MOTION_REVIEW.md`.
- **Vision simulator** (`evidence/vision/before/`, 9 frames). It was the legacy `VisionSim` in `main.js`, built on three r128 loaded from a CDN.
  - The blur was the acuity letter size × 9, an undisclosed exaggeration.
  - One blur value applied to the whole scene.
  - Night vision was forced into perfect focus.
  - Labels such as "Expected acuity 20/xx" and "functional without glasses" were shown as predictions.
  - The comparison defaulted to EDOF against an untreated cataract.
  - The full classification is in `VISION_OPTICAL_MODEL.md`.
- **Site.** Baseline screenshots are in `evidence/baseline/` (12 images).

## Procedure scope decision (owner, 2026-11-01)
Asked which procedures beyond Magrabi's published scope Dr. Maan personally performs, the owner answered: **corneal transplant, intravitreal injections, ICL / phakic lens**. Together with the Magrabi-published scope (cataract, lens implants, laser vision correction, keratoconus/CXL), this gives 7 procedures. The record is in `content/internal-registry.json` (`procedure-*`).
