# 07 — Light Journey: final visual rebuild

Date: 2026-11-24 · Branch: `wt/lj` (from `feat/phase-2-final-closure`) · Route unchanged: `/how-vision-works/`, `/en/how-vision-works/`

## What the owner asked for
The journey already played by itself (Play / Pause / Replay, scrub bar, 0.75× / 1× / 1.5×, captions, reduced-motion and
off-screen / hidden-tab pausing). The drawing was still a set of flat primitives. The ask: make it feel like watching a
professional medical explanation, not a slideshow of diagrams.

## What changed
### Drawing (`src/light-journey/diagram.js`)
Same schematic-eye geometry as before (20 units per mm; corneal radius 7.8 mm, axial length 23.5 mm, lens 4 × 9.5 mm),
now drawn as an anatomical-atlas plate:
- **Globe wall**: sclera with tubular radial shading and a hairline edge; choroid; retina with a photoreceptor layer
  (fine stipple) and an inner limiting membrane line; the retina and choroid **stop at the optic disc**.
- **Macula / fovea**: pigment glow plus the foveal curve at the posterior pole, where the focus lands.
- **Optic nerve**: dural sheath, nerve with fibre bundles and the central retinal vessel, joined to the globe at the
  disc; **brain** with gyri, cerebellum and a visual-cortex patch at the back that lights up on the last step.
- **Anterior segment**: cornea with gradient, epithelium and endothelium lines and a specular glint; tear film;
  aqueous in the anterior chamber; iris with stromal folds and a dark posterior pigment epithelium; ciliary body
  with processes; zonules; lens with a radial gradient, capsule and a dashed nucleus (the nucleus follows
  accommodation, like the lens outline).
- **Vitreous**: gradient with edge shading for depth, faint fibrils.
- **Scene**: sun with a glow (moon and stars in dim light), layered tree canopy with ground shadow, book for near.
- **Plate**: hairline inner frame; labels numbered like an atlas (`03 Cornea`), numerals in the display face.

### Light
- A **beam** (the cone between the outermost rays) is revealed stage by stage under the individual rays.
- Rays are finer; rays outside the pupil stop on the iris with a small absorption mark.
- **Refraction highlights**: the anterior corneal surface glows on the cornea step, both lens surfaces on the lens step.
- Optics are unchanged (standard textbook): the cornea contributes about two-thirds of the convergence, the lens the
  rest; all rays meet at one point on the macula, inverted (object above the axis, image below). Pupil size (light
  level) and lens shape (accommodation) still morph smoothly.

### Motion (`src/light-journey/index.js`, `styles.css`)
- **Continuous motion while playing**: the existing playback `requestAnimationFrame` loop now also advances photon
  pulses along every revealed ray (`.lj-flow` stroke-dashoffset, real-length dashes continuous across segments,
  staggered per ray), signal pulses along three nerve strands to the visual cortex, and a gently pulsing focus glow.
  Paused, hidden tab, off screen or reduced motion → the drawing holds still. The old infinite CSS dash animation
  was removed (so `document.getAnimations()` holds no infinite loops for this module).
- **Smooth stage changes**: ray segments draw in, the beam and labels fade in, and a gentle camera push-in per step
  (`.lj-cam`, scale 1.00–1.06, CSS transition 1.8 s) **while the journey plays**. When the visitor pauses or picks a
  step, the plate eases back to the full view and holds still (so click targets never move under the pointer; the
  first test run caught exactly that race). The camera is also off under reduced motion and in containers narrower
  than 560 px (phones).
- No new dependency (no GSAP needed); everything is SVG + one rAF loop.

### Homepage promotional preview (`main.js` `LIGHT_ART`, `style.css`)
Redrawn in the same language: globe wall, retina and macula, cornea, iris, lens, optic nerve, a cone of light bent at
the cornea and lens to a focus on the macula, labelled Cornea / Lens / Retina. Light enters from the reading start
(left in English, right in Arabic). Photon pulses move only under `prefers-reduced-motion: no-preference`. The same
drawing is the hero art on `/how-vision-works/`.

### Accessibility and layout (kept)
Single `role="img"` SVG with title and full text description; the `aria-live` caption region; ≥ 44 px targets; no
horizontal overflow at 320 / 390 / 768 / 1440 px; RTL mirrored drawing with unmirrored labels; reduced motion → no
autoplay, no transitions, no photon pulses, a clear static frame per step.

## Files
- `src/light-journey/diagram.js` — atlas drawing, beam, flows, refraction highlights, camera table.
- `src/light-journey/index.js` — motion frame in the playback loop, motion cache, camera per step.
- `src/light-journey/styles.css` — atlas tokens (light and dark), diagram styles, camera and reduced-motion rules.
- `main.js`, `style.css` — homepage / hero preview drawing.
- `tests/light-journey.spec.js` — two new tests (below).
- `scripts/light-journey-shots.mjs` — the before / after screenshot script.

## Tests
Command: `PW_PORT=4691 PRERENDER_PORT=4696 npx playwright test tests/light-journey.spec.js tests/first-render.spec.js tests/phase1-pages.spec.js --workers 2`

**90 passed, 0 failed** (3.0 min): `light-journey.spec.js` 26 (24 existing + 2 new), `first-render.spec.js` 25,
`phase1-pages.spec.js` 39.

History, for honesty: run 1 had 1 failure in the new motion test (it measured the halo layer, opacity 0.5, instead of the
core pulse; test selector fixed). Run 2 had 1 failure in the existing hit-target test: the camera push-in moved the
thin cornea target between reading its box and clicking. That was a real UX defect (targets moving under the pointer),
fixed in the product by running the camera only while playing; run 3 was green. No existing test was changed.

Also run: `tests/clinical-profile-expansion.spec.js -g "light journey"` (autoplay, pause, scrub, speed, reduced
motion never autostarts): **2 passed**.

New tests (no existing test changed):
- `rays move continuously while playing and hold still while paused` — reads the stroke-dashoffset of every revealed
  photon pulse and the nerve signal across animation frames: different while playing, identical while paused; the
  pulses are visible; the nerve signal moves on the last step.
- `each step renders and highlights its anatomy` — for each of the 9 steps: the part and its label are active and its
  anatomy elements render with a non-zero box (e.g. retina: retina, photoreceptor layer, macula, fovea, optic disc,
  choroid, focus, inset; nerve: nerve, sheath, brain, cortex, signal); the refraction highlight appears only on the
  cornea and lens steps; by the vitreous step all 5 beam segments and 25 ray segments are on.

## Screenshots
`docs/implementation/phase-2-final-closure/evidence/light-journey/before/` and `.../after/` — 48 each (JPEG q70):
for 1440 and 390 px × AR / EN × light / dark: the figure on steps 3 (cornea), 6 (lens), 8 (retina), 9 (brain), the whole
module on step 3, and the homepage preview card. Captured with `node scripts/light-journey-shots.mjs <before|after>`
against `npm run build` + `npx vite preview --port 4681 --strictPort` (Chromium, ANGLE d3d11).

## Limitations (honest)
- On phones (390 px) the 2:1 drawing is still small (~175 px tall); labels are enlarged but the detail is best on
  tablet / desktop. A portrait crop for phones would need a second layout of the drawing.
- Still a schematic, not a rendered 3D eye: the depth comes from gradients and layering in SVG.
- The camera push-in is deliberately gentle (≤ 1.06) so no part or label leaves the frame at 768 px.
- Medical review of the module remains "pending Dr. Maan" as before; no medical text or claim was added or changed.
- Screenshots were reviewed by the implementing agent only; the owner has not seen them yet.
