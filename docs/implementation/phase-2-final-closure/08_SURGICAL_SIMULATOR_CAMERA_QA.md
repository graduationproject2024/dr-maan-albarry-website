# 08 — Surgical simulator camera QA (re-authored cameras) and BUG-SIM-14

Scope: the shared procedure simulators in `src/surgical-sim/` (IOL, ICL, laser vision correction with Femto-LASIK /
PRK / SMILE, keratoconus + CXL, corneal transplant PK / DALK / EK, intravitreal injections). The earlier pass only
audited the cameras (`clinical-profile-expansion-and-ux-refinement/SURGICAL_SIMULATOR_CAMERA_AUDIT.md`). This pass
re-authors them. `src/cataract-sim/` was not changed (see "Out of scope" below).

Anatomy dimensions, surgical steps, stage texts and the Before/After texts are unchanged. Labels stay hidden by
default ("Show details" is unchanged).

## What was wrong (before)

Evidence: `evidence/cameras/before/` (192 viewport screenshots, one per procedure / technique / stage at 1440x900,
390x844 and 844x390, labels off, reduced motion; contact sheets `_sheet-<slug>-<viewport>.jpg`; camera log
`cameras.json`).

1. **Fixed distances.** Each preset was a fixed position. The field of view is vertical (32°), so on a phone held
   upright (canvas ≈ 358x448, aspect 0.8) the horizontal view is much narrower than on desktop (aspect 1.6). Subjects
   that fitted on desktop were cut at the sides on phones: the whole-eye section (IOL stage 1), the capsular bag
   (IOL 3–5), the ICL in the vault view, the front views (cataract lens, ICL anaesthetic, CXL tomography, transplant
   stitches), the posterior segment (injections 1 and 5).
2. **Subjects behind the controls.** The view-tool rail (inline end) and the stage chip + "Show details" (top start)
   lie over the canvas. Targets were centred on the whole canvas, so on phones the subject sat under the rail —
   worst in the laser close-ups and the transplant sections, where the cornea ran along the right edge behind the
   tools.
3. **Off-target close-ups.** The IOL capsular-bag and lens views cut the bag and the haptics top and bottom on
   desktop too; the transplant section was centred 2.7 mm below the axis, so the removed centre and the graft edge
   (the subject of "remove" / "donor") were at or past the top edge; the injection close-up cut the needle and the
   entry point at the bottom.
4. **Camera not deterministic.** Seeking inside the current stage kept whatever view the visitor had left; only a
   stage change moved the camera.
5. **Zoom limits global.** `minR/maxR` were absolute per procedure (8–90 mm, laser 3 mm, CXL / transplant 6 mm), so
   the close-ups could not zoom in at all while whole-eye views could zoom out until the eye was a dot. The elevation
   clamp was 0.12 rad and the azimuth grew without bound.
6. **Landscape phones.** On 844x390 the canvas is ≈ 250 px tall; the chip + details button take a third of it.

## What changed

- **`core/orbit.js`** — presets may declare `fit: [halfWidth, halfHeight]` (mm, the subject box around the target in
  the view plane). `fitDistance()` computes the distance from the canvas size, the vertical field of view and the
  free ("safe") area, so a preset frames the same subject at every size; `pos` gives the viewing direction only.
  Zoom is limited to 0.45–2.6× the fitted distance (absolute 1.5–140 mm); elevation is kept 0.15 rad off the poles;
  the azimuth is wrapped to ±π (no unbounded spin; transitions already take the short way round, so no flips).
  `refit()` re-fits a camera that is still on its preset after a resize / rotation / full screen; a visitor's own
  view keeps its distance, but the zoom limits follow the new fit. Transitions are unchanged (0.85 s eased, interruptible; instant with reduced motion).
- **`core/engine.js`** — measures the safe area (tool rail at the inline end; chip + details as a top band or a
  start-side column, whichever costs less canvas; the hint at the bottom) and shifts the projection centre
  (`camera.setViewOffset`) to the middle of it, so the target is never under the controls (also in Arabic, where the
  rail is on the left). One `goToCamera()` path for stage cameras, visitor-chosen views, Reset view and Before/After.
  The free area is re-measured after every resize, stage change and language change (the stage chip's text, and so
  its size, changes with both) and whenever one of the overlaid controls changes size (a ResizeObserver also watches
  the tool rail, chip, details button and hint — e.g. web fonts arriving after the first frame), and a camera still on
  its preset is re-fitted. While the page layout animates after a rotation, the camera re-fits at each step and ends
  on the same camera a page opened at that size gets (tested).
  **Camera on seek (chosen behaviour):** while paused, a seek or a stage choice always ends on that stage's camera,
  whatever the previous view — so scrubbing the timeline while paused also resets a view the visitor had turned or
  zoomed. While playing, a seek into the same stage keeps the visitor's view; a seek into another stage takes that
  stage's camera (as normal playback does at each stage change).
  `getState().camera` now also reports `preset`, `stagePreset`, `fit`, `minR`, `maxR`, `userMoved`, `safe`, `view`.
  The unused per-procedure `minR` fields were removed.
- **Presets** (`procedures/common.js` and each procedure) — every preset now has a `fit`; several targets moved onto
  the subject (table below).

## Per procedure, per stage

`before` / `after` paths are relative to `evidence/cameras/` and follow `<before|after>/<slug>/<desktop|portrait|landscape>/<file>.jpg`.
"Portrait" = 390x844, "landscape" = 844x390.

### Lens implants (IOL) — `lens-implants/`

| # | Stage (camera) | Subject | Before problem | Change | Evidence file |
|---|---|---|---|---|---|
| 1 | natural (section) | whole eye, natural lens | portrait: lens and retina cut at both sides | target to the globe centre (z −8.5), fit 13×12.6 | `01-natural.jpg` |
| 2 | cataract (front) | cloudy lens through the pupil | portrait: globe cut | fit 9.2 (cornea + limbus) | `02-cataract.jpg` |
| 3 | removed (anteriorSection) | empty capsular bag | bag cut top/bottom on all sizes | fit 4.6×6 around the bag | `03-removed.jpg` |
| 4 | insert (anteriorSection) | folded IOL entering the bag | same | same | `04-insert.jpg` |
| 5 | position (lens) | IOL + haptics in the bag | haptics cut on all sizes | target z −1.4, fit 3.8×6 | `05-position.jpg` |
| 6 | designs (optics) | light path to the retina | portrait: eye and rays cut | fit 14×10.5 | `06-designs.jpg` |

### ICL — `icl/`

| # | Stage (camera) | Subject | Before problem | Change | Evidence file |
|---|---|---|---|---|---|
| 1 | space (closeSection) | space between iris and lens | portrait: lens filled the frame, iris at edge | target z 0.4, fit 3.4×6.2 | `01-space.jpg` |
| 2 | assessment (anteriorSection) | chamber depth marker | portrait: cornea at edge | fit 4.6×6 | `02-assessment.jpg` |
| 3 | anaesthetic (front) | front of the eye | portrait: globe cut | fit 9.2 | `03-anaesthetic.jpg` |
| 4 | insert (anterior) | folded ICL in the chamber | lens filled and cut the frame | fit 6.6 | `04-insert.jpg` |
| 5 | position (closeSection) | ICL behind the iris | portrait: ICL ends cut | as stage 1 | `05-position.jpg` |
| 6 | result (vault) | vault between ICL and lens | too close, ICL cut | target (0, 0.6, 0.4), fit 2.6×4 | `06-result.jpg` |
| 7 | after (full) | whole eye | portrait: globe cut | fit 13.5 | `07-after.jpg` |

### Laser vision correction — `laser-vision-correction/` (files prefixed `lasik-`, `prk-`, `smile-`)

| Technique | Stages (camera) | Subject | Before problem | Change |
|---|---|---|---|---|
| all | anatomy, flap, reshape, result; PRK epithelium, bandage, regrow; SMILE lenticule, result (closeup) | central corneal section, layers, ablation | target in the air in front of the cornea; on phones the cornea ran under the tool rail | target onto the mid-cornea (0, 2.3, 2.85), fit 1.6×3 (apex to beyond the 3 mm zone) |
| Femto-LASIK | lift, replace (lifted) | lifted flap + stromal bed | flap tip past the top-left edge (phone) | target (0, 3.4, 6.2), fit 5.8×4.4 |
| SMILE | remove (wide) | lenticule leaving through the opening | small on desktop, at the edge on phone | target (0, 2.6, 3.4), fit 2.6×3.4 |

Evidence: `lasik-01-anatomy … lasik-06-result`, `prk-01-anatomy … prk-06-result`, `smile-01-anatomy … smile-04-result`.

### Keratoconus and CXL — `keratoconus-cxl/` (files prefixed `keratoconus-`, `cxl-`)

| Tab | Stage (camera) | Subject | Before problem | Change |
|---|---|---|---|---|
| keratoconus | 1 normal, 2 cone, 5 compare (side) | corneal profile, normal-dome outline | portrait: cone apex at the edge | fit 2.8×6.2 |
| keratoconus | 3 thin (closeSection) | thin, steep lower cornea | portrait: under the rail | target (0, −2, 2.6), fit 1.8×3.4 |
| keratoconus | 4 distortion (optics) | rays not meeting at one point | portrait: rays cut | fit 11×8 |
| cxl | 1 tomography, 2 numbing (front) | colour map / cornea | portrait: map cut | fit 6.6 |
| cxl | 3 riboflavin, 4 uv (closeSection) | stroma soaking / UV | as above | as stage 3 |
| cxl | 5 bandage (oblique) | bandage lens | front of eye cut | target z 1.6, fit 6.6 |
| cxl | 6 goal (side) | cone, cross-linked | as stage 1 | as stage 1 |

### Corneal transplant — `corneal-transplant/` (files prefixed `pk-`, `dalk-`, `ek-`)

| Technique | Stage (camera) | Subject | Before problem | Change |
|---|---|---|---|---|
| all | exam (front) | which layer is cloudy | portrait: globe cut | fit 6.6 (cornea) |
| all | anaesthetic, remove, donor; EK bubble, clear (section) | layers, removed centre, graft edge, air bubble | centred 2.7 mm below the axis: the removed centre and graft edge at / past the top; on phones the cornea under the rail | target (0, −1.9, 2.6) between apex and graft edge, fit 1.9×3.6 |
| PK, DALK | stitches, followup (front) | stitch ring | portrait: ring cut | fit 6.6 |

### Intravitreal injections — `intravitreal-injections/`

| # | Stage (camera) | Subject | Before problem | Change | Evidence file |
|---|---|---|---|---|---|
| 1 | back (posterior) | vitreous, retina, macula | portrait: eye cut | target z −10.5, fit 11×11.6 | `01-back.jpg` |
| 2 | exam (macula) | macula close-up | adequate | fit 4.6 (same look) | `02-exam.jpg` |
| 3 | numbing (drops) | front of the eye | eye off to one side | target z 0.5, fit 7 | `03-numbing.jpg` |
| 4 | injection (entry) | needle through the pars plana | needle and entry cut at the bottom | target (0, −8.6, −3.6), fit 7.2×6.4 | `04-injection.jpg` |
| 5 | spread (posterior) | medicine in the vitreous | as stage 1 | as stage 1 | `05-spread.jpg` |
| 6 | after (macula) | macula | adequate | as stage 2 | `06-after.jpg` |

### Before / After (`procedures/compare.js`)

Unchanged rule: both moments from the same camera (the first stage's, or `compare.camera`). It now goes through the
same fitted path, so the two images match at every viewport (test "Before / After use one fitted camera").

## BUG-SIM-14 — ICL plate passing through the iris (fixed)

- Cause: in stage "position" the plate was lowered (dz 1.05 → 0) and lengthened (0.72 → 1) in one move while the iris
  lifted later; the footplates crossed the iris by up to **0.12 mm** around p ≈ 0.4.
- Fix (`procedures/icl.js`): a pure `iclPoseAt(stage, p)` now drives the model. The flexible plate is first gathered
  (`TUCK_POSE` sx 0.5, sy 0.72: every point inside the 7 mm dilated pupil), sinks through the pupil while the iris
  lifts to its resting height, then opens out under the iris, sinking faster than it opens ((1 − c)² ) so the
  footplates also clear the natural lens. Final pose, vault (0.5 mm) and the iris resting height are unchanged.
- Timing changes in stage "position" (local progress p): plate gathered p 0.05–0.30 (new); sinks p 0.30–0.55
  (was one combined lower-and-lengthen move over 0.10–0.85); opens out p 0.55–0.90; iris lift **0.35–0.90 → 0.30–0.55**;
  `placed` (section cut face shown, probe) **0.85 → 0.90**. Stages "insert" and "result" are unchanged.
- `iclIrisOverlap(pose, pupil, marginZ)` samples the whole plate against the iris back and front surfaces
  (`irisBackAt`, `irisFrontAt`). Worst value over stages 3–5 at 400 samples: −0.046 mm (clear); stage 4 before the
  fix: +0.120 mm. The probe reports `irisOverlap` for the rendered model. `iclLensOverlap(pose)` checks the plate's
  back (footplates included) against the front of the natural lens: clear at every sample of stages 3–5 (worst
  −0.039 mm, in the opening-out phase).
- Duplicate removed: `icl.js` carried its own copy of the iris thickness formula to compute the iris front surface;
  `irisFrontAt` is now exported from `anatomy/geometry.js` next to `irisBackAt` and the copy is gone.
- Register: BUG-SIM-14 → Fixed (this document).

## Tests

Added to `tests/surgical-sim.spec.js`:

- `camera <slug>: seeking lands on the same stage camera from any view; Reset view restores it` (×6) — every
  technique and stage: camera after a seek from the start equals the camera after a seek from the end with the view
  turned and zoomed; Reset view restores it and clears `userMoved`; Start again returns to stage 1's camera.
- `camera: zoom and orbit limits hold` — 40× zoom in stops at the relative minimum, 60× zoom out at the maximum,
  elevation stays 0.15 rad off both poles under the keyboard and under eight full-height drags in both directions,
  the camera's screen-up stays world-up (no flip) and the azimuth stays wrapped.
- `camera <lang> <size>: every stage keeps its target and its whole subject box clear of the controls` (×5: en
  390x844, 844x390, 1440x900; ar 390x844, 844x390 with the rail on the other side) — independent of the engine's
  numbers: the reported free area must not overlap the real DOM boxes of the tool rail, stage chip, details button
  and hint, must keep ≥ 40 % of each dimension, the target projects to its middle and the four corners of the subject
  box project inside it.
- `camera: a resize re-fits a camera still on its preset, keeps a visitor-moved view, and moves the zoom limits`.
- `camera: seek while playing keeps the visitor's view inside the stage and takes the stage camera in a new stage`.
- `camera <size>: Before / After show two different moments from one fitted camera` (390x844 and 1440x900; IOL,
  ICL, transplant).
- `ICL: the plate never intersects the iris or the natural lens at any of 200 time samples per stage (pure model)` and
  `ICL: no plate/iris intersection while playing through the insertion and tuck (rendered model, 200 samples)`.

Run: `PW_PORT=4711 PRERENDER_PORT=4716 npx playwright test tests/surgical-sim.spec.js tests/procedures.spec.js --workers 2`
→ **62 passed** at c43f637. After the review fixes, with `tests/clinical-profile-expansion.spec.js` added to the run: **102 passed** (3.5 min, 2 workers, Windows GPU); the camera + ICL subset (28 tests) passed in 2 further repeat runs.

Evidence capture: `node scripts/camera-shots.mjs http://localhost:4701 <out-dir>` against `npm run build` +
`npx vite preview --port 4701 --strictPort` (GPU via ANGLE on Windows).

## Gaps and notes

- **Landscape phones (844x390):** the canvas is ≈ 250 px tall, so section views are small (height-limited). The site's
  fixed header (65 px) and booking bar (69 px) leave 256 px, so the viewer is fully visible only when scrolled to sit
  under the header (the capture script does this); the page-level bar is outside the simulator and was not changed.
  Full screen remains the better option on a phone held sideways.
- The laser close-up keeps the iris and lens behind the cornea as context; "Rest of the eye" hides them.
- Out of scope, recorded only: `src/cataract-sim/` has its own camera code (fixed presets, no aspect fitting); no
  framing defect was seen in this pass, so it was not touched.

## Physician-review items (no change made)

- ICL: the tuck is drawn as one smooth movement with the plate gathered to pass the pupil (already listed in the
  model's simplifications); the real manoeuvre tucks one footplate at a time with an instrument.
- Femto-LASIK "lift": the lifted flap is shown hinged at the top and folded forward over the eye; please confirm the
  hinge position and lift angle are acceptable for patient education.
- Corneal transplant section: the camera now centres between the apex and the graft edge; please confirm the graft
  margin position matches what Dr. Maan wants to emphasise for PK / DALK / EK.
- Intravitreal injection: the entry camera now shows the whole needle path; the entry point remains the illustrative
  pars-plana position already pending review.
