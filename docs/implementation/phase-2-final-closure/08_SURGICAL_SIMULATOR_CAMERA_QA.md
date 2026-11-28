# 08 — Surgical simulator camera QA (re-authored cameras) and BUG-SIM-14

Scope: the shared procedure simulators in `src/surgical-sim/` (IOL, ICL, laser vision correction with Femto-LASIK /
PRK / SMILE, keratoconus + CXL, corneal transplant PK / DALK / EK, intravitreal injections). The earlier pass only
audited the cameras (`clinical-profile-expansion-and-ux-refinement/SURGICAL_SIMULATOR_CAMERA_AUDIT.md`). This pass
re-authors them. `src/cataract-sim/` was re-authored in a follow-up pass with the same approach (section "Cataract simulator" at the end).

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
- `src/cataract-sim/` was out of scope for this pass; it was re-authored afterwards with the same approach (see "Cataract
  simulator" below).

## Physician-review items (no change made)

- ICL: the tuck is drawn as one smooth movement with the plate gathered to pass the pupil (already listed in the
  model's simplifications); the real manoeuvre tucks one footplate at a time with an instrument.
- Femto-LASIK "lift": the lifted flap is shown hinged at the top and folded forward over the eye; please confirm the
  hinge position and lift angle are acceptable for patient education.
- Corneal transplant section: the camera now centres between the apex and the graft edge; please confirm the graft
  margin position matches what Dr. Maan wants to emphasise for PK / DALK / EK.
- Intravitreal injection: the entry camera now shows the whole needle path; the entry point remains the illustrative
  pars-plana position already pending review.

## Cataract simulator (`src/cataract-sim/`) — follow-up camera pass (2026-11-28)

The dedicated cataract simulator (cataract procedure page and `/surgical-education/`, `#cataract-3d-start`) keeps its
own renderer and OrbitControls. It now frames its stages the same way as the shared engine. Anatomy dimensions,
surgical steps, stage texts and the constraint validator are unchanged (`cataract-constraints.spec.js`: 0 violations).

Evidence: `evidence/cataract/before/` and `evidence/cataract/after/` (`<en|ar>/<desktop|portrait|landscape>/NN-stage.jpg`;
each stage at 55 % of its playback with the instruments in view, labels off, reduced motion; the after set adds
`ba-before.jpg` and `ba-after.jpg`; contact sheets `_sheet-<lang>-<viewport>.jpg`; overlay boxes in `cameras.json`).
Capture: `node scripts/cataract-camera-shots.mjs http://localhost:4801 <out-dir>` against `npm run build` +
`npx vite preview --port 4801 --strictPort` (GPU via ANGLE on Windows), on the real page `/[en/]procedures/cataract-surgery/`.

### What was wrong (before)

1. **Fixed distances; the lens widened on phones instead.** On a narrow canvas the field of view grew so the
   horizontal view stayed constant. The camera itself did not change, so the whole-eye stages did not fit. In stage 1 the globe was cut at the
   top on desktop (1440x900) and on a phone held sideways (844x390), and at the right on a phone held upright
   (390x844). The phone fit for stage 7 (≈ 88 mm at a 32° lens) was above the fixed 80 mm zoom maximum, so it could not be
   reached.
2. **Target centred on the whole canvas.** The view tools (inline-end column on desktop, bottom row on phones), the
   stage chip (top start) and the light-path caption (bottom start on the ray stages) were ignored. On phones the caption
   covered the lower part of the eye in stages 1 and 7.
3. **Controls outside the viewer.** 844x390: the seven-button tool column (356 px) was taller than the 300 px viewer,
   so **Full screen and Explore 3D were cut off**. 390x844: the tool row (326 px) ran 2 px past the 332 px viewer.
4. **Camera not deterministic on seek.** A seek inside the current stage kept whatever view the visitor had left
   (turned, zoomed, or a focused structure).
5. **Global zoom limits** 11–80 mm whatever the stage or screen.
6. **Stale frame after a paused seek (found while capturing).** `seek()` and review frame stepping moved the scene state
   but did not ask for a redraw. While nothing else was animating, the canvas kept showing the previous moment: for example
   the IOL and injector were missing in stage 6 at 55 % on phones.
7. **Camera could enter the globe.** The stage 7 target (z −7) was 2 mm in front of the globe centre. At the 11 mm
   minimum zoom, turned fully to the side, the camera came to ≈ 11.3 mm from the centre, inside the 11.5 mm sclera.

### What changed

- **`index.js`** reuses `fitDistance()` from `src/surgical-sim/core/orbit.js`. Every preset (`stages.js`: stages and
  anatomy structures; review views) has a `fit` (half width × half height of its subject, mm). One fixed 32° vertical
  field of view at every size.
  - **Free area:** `measureSafe()` reads the real boxes of the view tools (column at the inline end, or a bottom
    row), the chip (top band) and, on stages that draw light rays (1 and 7), the caption (bottom band). On those stages
    the caption is measured even before it appears, so the camera does not move mid-stage. `applySafe()` shifts the
    projection centre into that area (`camera.setViewOffset`), so the free area is RTL-aware automatically.
  - **When the free area is re-measured:** on every resize, stage change and when a control changes size (a
    ResizeObserver watches the viewer, the tool rail and the chip). A camera still on its preset is re-fitted; a visitor's
    own view keeps its distance, and its zoom limits follow the new fit.
- **One camera path:** `goCamera()` handles the stage camera, anatomy structure, review view, Before / After and
  Reset view.
  - **Deterministic camera:** a seek (which always pauses here) ends on the camera of the stage it lands in, whatever
    the previous view was: turned, zoomed, a focused structure (the focus is cleared) or Before / After. Playback
    controls do not move the camera.
  - **Damping:** OrbitControls' leftover damping is dropped before a preset is reached, so the preset is reached exactly.
- **Zoom limits:** `max(11, 0.2 × fit)` to `min(160, max(80, 1.45 × fit))` mm. On desktop this is exactly the former 11–80
  mm range. On phones the far limit grows with the fit, so the fit itself is always reachable. While flying, the limits
  cover both ends of the flight. Orbit limits are unchanged: polar 0.4 to π − 0.4 and azimuth ±1.5, so there are no
  flips.
- **Stage 1 and 7 targets** moved to z −5 (4 mm in front of the globe centre), so at the 11 mm minimum the camera
  stays outside the globe at any allowed orbit (tested: > 0.2 mm clearance).
- **Close-up fits** (stages 2–6, structures) equal `[0.314, 0.257] × the former distance`, so the 1440x900 framing is
  the same as before and phones keep the former visible width, now centred in the free area.
- **`styles.css`:** tool row padding 2 px and gap 1 px on phones (318 px, inside a 332 px viewer). Below 388 px screens
  the row wraps 4 + 3, and the ray caption moves above it. On short screens (viewer under ≈ 380 px, e.g. 844x390) the
  tools form two columns of four.
- **Stale frame:** `seek()` and `stepFrames()` now mark the frame dirty.
- **`getState().camera`** also reports `preset`, `stagePreset`, `fit`, `base`, `userMoved`, `moving`, `fov`, `minR`,
  `maxR`, `safe` and `view`.

| # | Stage | Subject | Before problem | Change | Evidence |
|---|---|---|---|---|---|
| 1 | cloudy-lens (section) | whole globe, lens, scattered light | globe cut top (desktop, landscape) / right (portrait); caption over the eye on phones | target (0, 0, −3.5) → (0, 0, −5); fit 15.4 × 12.6 (front side wider for the incoming light); caption reserved | `01-stage.jpg` |
| 2 | preparation (front) | pupil, iris, limbus | desktop OK; portrait: the iris about half the width | fit 8.8 (limbus with a ring of sclera) | `02-stage.jpg` |
| 3 | incision | limbal tunnel, keratome | none on desktop | fit 6.9 × 5.6 (same framing), centred in the free area | `03-stage.jpg` |
| 4 | capsulorhexis | anterior capsule, forceps | none (instrument shafts leave the frame by design, also under the rail) | fit 7.8 × 6.4 | `04-stage.jpg` |
| 5 | phaco | nucleus in the bag, probe | none on desktop | fit 7.5 × 6.2 | `05-stage.jpg` |
| 6 | iol | IOL unfolding in the bag | stale frame after a paused seek (IOL / injector missing) | fit 7.8 × 6.4; redraw fix | `06-stage.jpg` |
| 7 | completion (section) | whole globe, focused light | the camera could enter the globe at minimum zoom; caption over the eye on phones; phone fit above the 80 mm maximum | target (0, 0, −7) → (0, 0, −5); fit 16.5 × 13; caption reserved | `07-stage.jpg` |

Anatomy structures (cornea, iris, pupil, lens, capsule, zonules, IOL) keep their targets and directions. Their fits are
equivalent to the former distances. Review views: surgeon fit 9.4 × 7.7 and side fit 10.7 × 8.7.

Content hashes: stage content versions (`review.js stageContentHash`) include the camera preset. All seven stage hashes
therefore change with this pass. No review decision was recorded against the old hashes.

### Kept behaviour (protected by the existing tests, all passing)

These still work as before:

- a plain wheel scrolls the page and Ctrl / ⌘ + wheel zooms (in full screen the plain wheel zooms);
- Explore 3D touch policy (one finger scrolls the page unless Explore 3D is on; pinch zooms in Explore 3D);
- full screen with Escape;
- reduced motion (jump cuts);
- WebGL context loss and restore;
- review mode (stage, speed, frame step, camera views, layers);
- labels hidden by default;
- the 11–80 mm desktop zoom range;
- one render loop and no leaks.

### Tests (`tests/cataract-camera.spec.js`, GPU layer)

- `every stage: one deterministic camera …` (1440x900, with motion): for each of the 7 stages, the camera after the
  stage choice equals the camera after a seek from a turned and zoomed view, after Reset view, and after a seek from
  another stage. Restart returns to stage 1's camera, and a seek after a structure focus returns to the stage camera.
- `zoom and orbit limits …` (stages 1, 4, 7): the zoom stops at the reported minimum and maximum. Minimum ≥ 11 mm and
  maximum ≥ max(80, 1.4 × fit). At the minimum distance, under four extreme drags, the camera stays outside the globe,
  screen-up stays world-up, polar stays within 0.4 to π − 0.4 and |azimuth| ≤ 1.5. Reset view restores the stage camera.
- `a resize re-fits …`: a camera on its preset is re-fitted for 390 px and returns exactly to the desktop camera. A
  visitor-moved view keeps its distance while the fit and limits move.
- `framing <en|ar> <390x844|844x390|1440x900>` (×6) checks every stage against the real DOM boxes of the tool rail, chip and
  light-path caption (shown):
  - the free area does not overlap them and keeps ≥ 40 % of each dimension;
  - every control lies inside the viewer;
  - the target projects to the middle of the free area;
  - the four corners of the stage's subject box project inside it.
- Before / After tests: see `10_BEFORE_AFTER_VERIFICATION.md`.

### Gaps and notes

- **844x390 on the real page:** the site's fixed header and booking bar leave ≈ 256 px of a 300 px viewer visible.
  The capture scrolls the viewer under the header, so the bar still covers its lower ≈ 45 px. This is page-level and
  unchanged; it is the same gap as the procedure simulators above. Full screen is the better option on a phone held
  sideways.
- With the whole eye fitted, the stage 1 eye on desktop is ≈ 15 % smaller than before (it is now whole).

### Physician-review items (cataract camera; no anatomy or step changed)

- Stage 1 and stage 7 views now show the whole globe in section, centred slightly in front of the globe centre. Please
  confirm this framing suits the "cloudy lens" and "clear path for light" explanations.
