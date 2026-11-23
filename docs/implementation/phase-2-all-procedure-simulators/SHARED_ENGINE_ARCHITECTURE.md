# Shared simulation engine

One engine (`src/surgical-sim/`) runs the simulators for six procedure pages. Each procedure is described by a definition file, not by its own engine.

The cataract simulator (`src/cataract-sim/`) keeps its own controller and review mode, which already work and are tested. The new engine reuses its core modules instead of copying them:

| Reused from `src/cataract-sim/` | Used for |
|---|---|
| `scene.js` | renderer, lights, room environment, `hasWebGL()`, shader precompilation (`precompileScene`) |
| `timeline.js` | stage durations, global progress 0–1, exact seeking |
| `state.js` | playback state machine (idle → loading → ready / playing / paused / completed / error / fallback) |
| `perf.js` | adaptive pixel ratio, pausing rendering when off-screen or the tab is hidden |
| `lathe.js` | rotational solids and their cross-section caps |
| `anatomy.js` | `EYE` constants and the profiles for the cornea, lens, capsule, sclera and IOL optic |
| `materials.js` | iris and sclera textures |

## Files

```text
src/surgical-sim/
  index.js                    public entry: mount(), PROCEDURES (lazy import per slug), allReviewMetadata()
  core/engine.js              mountEngine(): lifecycle, timeline, state, rendering loop, labels, controller
  core/orbit.js               camera: rotate / zoom / presets, interruptible eased transitions, touch rules
  anatomy/geometry.js         pure maths (Node-testable): corneal layers and deformations, iris, ICL, posterior pole
  anatomy/build.js            three.js builders: layeredPatch, buildCornea, sclera, iris, lens, capsule, ciliary,
                              posterior (retina, choroid, macula, fovea, disc, vessels, vitreous), IOL, ICL, injector,
                              beam, needle, rays
  anatomy/materials.js        shared materials (all anatomy uses the shared section plane)
  ui/shell.js, ui/styles.css  the shared interface (same tokens as the cataract simulator)
  procedures/common.js        standardEye(), camera presets, label anchors, stage() helper, shared wording
  procedures/<procedure>.js   one definition per procedure page
```

## Coordinates

- Units are millimetres.
- **+Z** is the optical axis, pointing out of the eye towards the viewer. **+X** is temporal, **+Y** is superior.
- The iris root is near z = 0. The cornea apex is at z ≈ 3.5. The posterior pole is at z ≈ −19.75.
- The cross-section always cuts along the plane **x = 0**. The shared `THREE.Plane` keeps x ≤ 0, and the camera presets for sections look from +X.
- When the section is off, the plane is moved far away. Every shader keeps the same clipping setup, so turning the section on or off never recompiles anything.
- Section caps (the cut faces) live in groups named `caps`. The engine shows them only while the section is on.

## A procedure definition

```js
export default {
  id, slug, modelId, version,                  // version changes whenever the stages or the geometry change
  title: { ar, en }, note: { ar, en },
  objectives: [{ ar, en }], sources: [[label, url]], simplifications: [{ ar, en }],
  variants: [{ id, label: { ar, en } }] | undefined,                  // technique tabs (LASIK | PRK | SMILE …)
  options:  [{ id, label, choices: [{ id, label }], default }],       // e.g. IOL type
  toggles:  [{ id, label, parts?: [partName], default? }],            // show / hide structures
  cameras:  { key: { pos, target, label? } },                          // presets with a label appear as buttons
  stages(variant) => [stage(id, seconds, cameraKey, title, text, { section? })],
  extra?({ variant, options, index, stage }) => { ar, en } | null,     // more text under the current stage
  build({ THREE, lib, geo, mats, scene }) => model
}
model = {
  root, parts: { name: Object3D },
  labels: [{ id, part?, at: [x, y, z], text: { ar, en }, inner?, when?(s) }],
  apply({ stage, index, p, variant, options, toggles, section, lang }),  // PURE: scene state from these inputs only
  probe?() => object,                                                  // numbers for automated tests
  dispose?()
}
```

### Rules every definition follows

1. **`apply()` is a pure function of its inputs.** It sets every property it controls on every call, and keeps nothing from the previous frame. This is what makes these things correct:
   - pause freezes the picture;
   - seeking rebuilds any moment exactly;
   - reset returns the starting picture;
   - a stage chosen from the list shows its end state, which matches its text.
2. **Clinical content comes only from the procedure page** (`src/procedures/content.js`) and the listed sources. No depths, energies, volumes, angles, sizes, suture counts or surgeon-specific steps are invented. Where the model needs a size, it is labelled illustrative in `simplifications`.
3. **Stage counts follow the content.** Procedures have different numbers of stages.
4. **GSAP never drives the model.** Only the engine's timeline does.
5. **A toggle that is off always hides its parts.** The engine applies this after `apply()`.

## Lifecycle

| Call | Behaviour |
|---|---|
| `mount(host, { procedure, lang, theme, reducedMotion, variant?, autoplay? })` | Builds the shell first. If WebGL is missing, or the scene throws while building, the shell becomes the text-only fallback, with all stages explained. Otherwise it builds the scene, precompiles the shaders behind the loading overlay, then reaches `ready`. |
| `play` / `pause` / `resume` | Advance or freeze the timeline. Play from the end restarts. |
| `seek(0–1)` | Sets the timeline position and re-applies. |
| `setStage(id or index)`, `nextStage`, `previousStage` | Jump to the end state of that stage. If it is playing, jump to its start. |
| `setVariant(id)` | Rebuilds the stage list and timeline for the technique. Scene objects are reused. |
| `reset()` | Timeline to 0, default options and toggles, section off, first camera. |
| `setLang` / `setTheme` | Updates text and colours only. The scene is never rebuilt. |
| `setQuality('low' \| 'high' \| 'auto')` | Sets the pixel ratio. `auto` steps down after two slow 2-second windows. |
| `setCameraMode(key)`, `setSection(on)`, `setOption(id, value)`, `showAnatomy(id)` / `hideAnatomy(id)` | Same as the on-screen controls. |
| `getState()` | Playback, stage, options, toggles, camera, pixel ratio, renderer counters and the model probe. |
| `getReviewMetadata()` | Model ID and version, library and engine versions, stages, sources, simplifications, clinical status (`pending`) and a content hash. |
| `on('close' \| 'stage' \| 'state' \| 'complete' \| 'variant', fn)` | Events. |
| `destroy()` | Cancels the frame loop and observers, disposes geometries, materials and textures, forces the WebGL context to be lost, and removes the DOM. It is idempotent. |

Rendering happens on demand. A frame is drawn only while the procedure is playing, while the camera moves, or after a change. Nothing renders while the viewer is off-screen or the tab is hidden.

## Page integration

- `main.js` has `renderProcedure3D(p)` for the six slugs in `SIM_SLUGS`. It renders a section with a Start button.
- `src/surgical-sim/index.js` is downloaded only on Start, or when the visitor reaches for the button.
- Leaving the page, or moving to another procedure, destroys the viewer.

## Adding a procedure later (Phase 3)

1. Write `procedures/<slug>.js` following the contract above. Reuse `standardEye()` and the library builders.
2. Add the slug to `PROCEDURES` in `index.js` and to `SIM_SLUGS` and `P3D_COPY` in `main.js`.
3. Add tests to `tests/surgical-sim.spec.js` (the parametrised suite covers lifecycle, stages, language and cleanup), and an entry in `MODEL_VERSIONS.md` and `CLINICAL_REVIEW_QUEUE.md`.
