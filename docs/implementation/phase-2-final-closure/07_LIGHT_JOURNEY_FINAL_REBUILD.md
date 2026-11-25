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
  (`.lj-cam`, scale 1.00–1.03, CSS transition 1.8 s) **while the journey plays**. On pause the camera freezes exactly
  where it is (computed transform pinned, transition off): no drift, nothing moves under the pointer. The camera is
  off under reduced motion and on phones. The drawn content spans x ≈ 20–1180 of the 1200-unit plate, so a push-in
  that keeps every part and label inside the frame is at most about 3 %; a test checks every step's camera against
  the measured content box in both languages.
- Only the elements shown on the current step are written each frame; the blurred focus glow breathes through
  `fill-opacity`, not geometry.

### Phone layout (review fix, 2026-11-25)
Below a 560 px container the drawing switches (live, via ResizeObserver; same elements, morphed) to a tighter, taller
crop around the eye (viewBox 790 × 530 instead of 1200 × 600, mirrored in Arabic). The scene is drawn at half size and
closer, with a `//` break mark on the rays to show the distance is shortened; labels move to the top / bottom bands.
Result at 390 px: drawing ≈ 235 px tall (was ≈ 175), the globe fills ≈ 60 % of the width, active label ≈ 16 px (was
8–9 px), targets still work (tested), no horizontal overflow at 320 / 390.
- No new dependency (no GSAP needed); everything is SVG + one rAF loop.

### Homepage promotional preview (`main.js` `LIGHT_ART`, `style.css`)
Redrawn in the same language: globe wall, retina and macula, cornea, iris, lens, optic nerve, a cone of light bent at
the cornea and lens to a focus on the macula, labelled Cornea / Lens / Retina. Light enters from the reading start
(left in English, right in Arabic). Photon pulses move only under `prefers-reduced-motion: no-preference` **and**
while the drawing is on screen in a visible tab (`.is-live`, set by an IntersectionObserver plus `visibilitychange`
in `main.js`). The same drawing is the hero art on `/how-vision-works/`; each place has its own gradient id.

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

### Review fixes (2026-11-25)
Same command after the independent review fixes: **95 passed, 0 failed** — `light-journey.spec.js` 31 (24 existing +
7 new), `first-render.spec.js` 25, `phase1-pages.spec.js` 39. Added:
- `no drawing writes while paused or under reduced motion` — a MutationObserver on the SVG sees attribute writes
  while playing, and none at all while paused or when Play is pressed under reduced motion.
- `the camera keeps every drawn part and label inside the frame on every step` (en, ar) — measures the world and
  label boxes (far and near) and maps them through every step's camera.
- `phone layout at 390 px` (en, ar) — compact crop, drawing > 220 px tall, active label ≥ 12 px and inside the
  drawing, globe ≥ 45 % of the width, break mark present, a tap on the cornea opens its step, wide again at 1024 px.
- The anatomy test now also requires each element to be displayed with an effective opacity > 0.3.
The mobile slot reservation (`style.css`) rose 1250 → 1310 px to match the taller phone drawing (+≈ 60 px).

## Screenshots
`docs/implementation/phase-2-final-closure/evidence/light-journey/before/` and `.../after/` — 48 each (JPEG q70):
for 1440 and 390 px × AR / EN × light / dark: the figure on steps 3 (cornea), 6 (lens), 8 (retina), 9 (brain), the whole
module on step 3, and the homepage preview card. Captured with `node scripts/light-journey-shots.mjs <before|after>`
against `npm run build` + `npx vite preview --port 4681 --strictPort` (Chromium, ANGLE d3d11).

## Limitations (honest)
- Phones get the tighter crop, but the fine anatomy (photoreceptor stipple, zonules) is still small at 390 px; the
  object is drawn closer than in reality there (marked with `//`).
- Still a schematic, not a rendered 3D eye: the depth comes from gradients and layering in SVG.
- The camera push-in is barely perceptible (≤ 3 %), because the plate is already full edge to edge; a stronger
  push-in would crop the scene or the brain.
- Medical review of the module remains "pending Dr. Maan" as before; no medical text or claim was added or changed.
- Screenshots were reviewed by the implementing agent only; the owner has not seen them yet.
