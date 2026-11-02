# Vision simulator rebuild

The rebuild replaces the legacy `VisionSim` in `main.js` (three r128 from a CDN, uniform blur, ×9 exaggeration,
acuity predictions) with a lazy-loaded module at `src/vision-sim/`. The module uses npm `three@0.170.0` and a pure,
tested optics model.

**Status: educational illustration, not clinically validated, pending review by Dr. Maan.**
Model details: [VISION_OPTICAL_MODEL.md](VISION_OPTICAL_MODEL.md).

## Architecture

```
src/vision-sim/
  index.js        mount() / controller, lifecycle, render loop, context loss, debug counters
  optics/
    params.js     frozen parameter tables (bounds, pupils, lens profiles, viewing geometry, reference types)
    model.js      pure equations (no DOM / three): defocus, blur, astigmatism, toric, through-focus, halo, contrast, computeView
    index.js      re-exports (importable from Node)
  scenes.js       three.js depth layers: street + sign (distance), laptop on table (intermediate), phone (near)
  pipeline.js     WebGL2 pipeline: layer render → anisotropic separable Gaussian per focus term (additive, weighted)
                  → model-scaled halo/glare sprites → composite (over, grading, split comparison, sRGB, fixed dither)
  ui.js           DOM: native radio groups, range input, role=slider divider, live region, info cards, meters
  fallback.js     static comparison (SVG defocus-curve shapes + lens descriptions), used without WebGL2
  i18n.js         Arabic / English strings and neutral lens descriptions
  styles.css      tokens self-contained under .vsim, light and dark themes
```

Rendering notes:

- All three layers share **one perspective camera** (34° vertical field). Angular sizes are therefore consistent, and
  blur angles convert to pixels through the same focal length.
- Blur is done in **linear light** using half-float targets when available. Large kernels sample mip levels.
- Each focus term costs two separable passes, with the major and minor axes on the astigmatic meridians. Terms are
  accumulated with additive blending weighted by their light share. Lost light is added as a wide veil.
- Point lights are energy-conserving sprites. For each focus term, a disk of diameter P·|ΔD| is drawn with
  brightness ∝ weight / area. The layer also gets a lost-light Gaussian and a straylight glare skirt. The sprites
  are drawn into the distance layer before compositing, so the laptop and phone occlude them correctly.
- **Rendering is on demand**: blurs are cached per layer and per lens, keyed on their optical inputs. An unchanged
  frame does no work. Moving the distance slider re-blurs only the subject layer.
- **Deterministic**: no time-based animation and a seeded PRNG for textures. The automated test checks that
  rendering the same state twice gives identical pixel statistics.
- **Adaptive quality**: three levels of internal resolution scale and tap count. Coarse-pointer or narrow screens
  start at level 1. Sustained slow re-blur frames (more than 34 ms) step down. The internal resolution never drops
  below about 1 px per CSS px (up to 640 px wide).
- **Fallback**: without WebGL2, or after an initialisation error, or when the context is not restored within 10 s,
  a static explanatory comparison is shown.
- **Context loss**: the loop stops and a note is shown. On restore, textures and layers are re-uploaded and rendering resumes.
- **Disposal**: `destroy()` removes every listener (counted), the observers, the rAF loop, the render targets,
  geometries, materials, textures and the renderer (`forceContextLoss`). Tests mount and destroy 8 times and
  assert that every counter returns to zero.

## API

```js
const { mount } = await import('./src/vision-sim/index.js');
const sim = await mount(hostElement, { lang: 'ar' | 'en', theme: 'light' | 'dark', reducedMotion?: boolean, debug?: boolean,
                                       lens?, lensB?, compare?, distanceM?, lighting?, refraction? });
sim.setLens('monofocal' | 'edof' | 'trifocal' | 'toric' | 'cataract', slot = 'A' | 'B');
sim.setDistance(metres);                 // clamped to 0.33 – 6 m
sim.setLighting('day' | 'dusk' | 'night');
sim.setCompare(true, 'trifocal');        // optional split comparison
sim.setRefraction({ sphereD, cylD, axisDeg });
sim.setSplit(0..1);
sim.setLang('ar' | 'en'); sim.setTheme('light' | 'dark');
sim.getState();  // { state, lens, lensB, compare, split, distanceM, subject, lighting, pupilMm, refraction, lang, theme,
                 //   reducedMotion, webgl, fallbackReason, quality, frames, reblurs, optics: { A, B } }
sim.on('change' | 'langchange' | 'themechange' | 'error' | 'restored' | 'ready', cb) // returns an unsubscribe function
sim.destroy();   // idempotent
```

`mount()` is idempotent per host: mounting again destroys the previous instance. Invalid inputs are ignored or clamped.

## Integration into `main.js` (for the lead engineer)

1. Delete the legacy `VisionSim` IIFE (lines 12–849) and the `window.VisionSim` assignment. Also delete the CDN
   `three r128` `<script>` in `index.html` if nothing else uses it. Remove the `.vs-*` rules from `style.css`.
   Then update `tests/phase1-mobile.spec.js` and `tests/closure.spec.js`, which target the legacy `#vs-*` markup.
2. Keep `<div id="simulator-host">` in `renderSimulator()`. Update the section lede, which mentions dragging against
   an untreated cataract.
3. Mount lazily when the section approaches the viewport, and keep the host outside re-rendered markup (the same
   pattern as `c3d`):

```js
const vsim = { host: null, ctrl: null, loading: false };
function mountVisionSim() {
  const slot = document.getElementById('simulator-host');
  if (!slot) return;
  if (!vsim.host) { vsim.host = document.createElement('div'); }
  if (vsim.host.parentNode !== slot) slot.appendChild(vsim.host);   // survive renderApp() re-renders
  if (vsim.ctrl || vsim.loading) return;
  const io = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect(); vsim.loading = true;
    try {
      const mod = await import('./src/vision-sim/index.js');        // static specifier → own chunk
      vsim.ctrl = await mod.mount(vsim.host, { lang: currentLang, theme: resolvedTheme(),
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });
      vsim.ctrl.setLang(currentLang); vsim.ctrl.setTheme(resolvedTheme()); // in case they changed while loading
    } finally { vsim.loading = false; }
  }, { rootMargin: '400px 0px' });
  io.observe(slot);
}
// in renderApp(): replace `VisionSim.mount(simHost, …)` with mountVisionSim();
// on language change: vsim.ctrl?.setLang(currentLang); on theme change: vsim.ctrl?.setTheme(resolvedTheme());
```

The module shares the `three.module` chunk with the cataract simulator, so Vite emits three only once. The module
itself is about 36 kB (13 kB gzip) plus 10 kB each for the scenes and pipeline chunks.

## UX decisions

- **Large viewer first.** It has a 16:10 aspect ratio, or 4:3 below 640 px. The persistent disclaimer sits directly
  under it in both languages: *"Educational illustration — not a prediction of your vision; your surgeon will advise."*
- **One composite scene shows all three distances at once.** It contains the street and road sign (6 m+), the laptop
  (66 cm) and the phone (40 cm). Patients see the trade-off of a lens across distances in one glance. The distance
  presets and slider move the *subject* object to the chosen distance and highlight its meter.
- **Segmented controls** use native radio inputs. Arrow keys, screen-reader semantics and RTL arrow mirroring come for free.
  Labels are at least 44 px tall.
- **Comparison is opt-in**: a "Compare two lenses" switch opens a second lens group and a draggable / keyboard
  `role="slider"` divider. No lens is pre-selected as the comparison target, and the default lens is monofocal.
- **Neutral copy**: every lens has the same two lines, "Designed for" and "Trade-offs", with no superlatives and no outcome claims.
- **Numbers are secondary**: there are per-layer sharpness bars (relative index with a caveat). A collapsed "Model
  values (approximate)" panel shows pupil, defocus, blur angle, halo and contrast indices. "How does this simulation
  work?" explains the method and limitations, with the defocus-curve chart.
- **Accessibility**: the live region announces lens, distance, band and lighting (debounced while the slider is dragged).
  The range input has an `aria-valuetext` such as "40 cm — phone". The viewer is `role="img"` with a descriptive label.
  Focus is preserved across language changes. Reduced motion is honoured (there is no motion, and CSS transitions are
  disabled).
- **Tokens are self-contained** under `.vsim` and `.vsim[data-theme="dark"]`, so host colours do not leak in (this is tested).

## Before / after

Evidence is in `evidence/vision/before/` (the legacy build of `main`) and `evidence/vision/after/`.

| | Legacy | Rebuild |
|---|---|---|
| Blur | One amount for the whole frame, ×9 exaggeration | Per depth layer, with physical angle → px through one camera |
| Lens model | Acuity tables shown as "expected acuity" | Simultaneous-focus profiles; relative index only |
| Astigmatism / toric | Absent | Elliptical blur; toric correction and misalignment |
| Halo | Fixed intensities, ×9 size | Disk size P·ΔD, energy = light share |
| Comparison | Always against untreated cataract, default EDOF | Opt-in, any pair, default monofocal |
| Disclaimer | Long note at the bottom | Persistent one-liner directly under the viewer |
| three.js | r128 CDN global | npm three@0.170.0, lazy chunk shared with the cataract module |
| Fallback | A text line | A static defocus-curve comparison with lens descriptions |
| Determinism | Animated traffic, sway, grain | Static and deterministic |

## Measured performance (one machine, not a benchmark)

These figures were measured on 2026-11-02 with headless Chromium, ANGLE/D3D11 and an NVIDIA RTX 2060, with a 1280×900
viewport and an internal 1186×741 half-float target. Timings are `renderNow()` plus `gl.finish()`:

| Interaction | Median | p95 |
|---|---|---|
| Distance slider step (subject layer re-blur), EDOF vs trifocal comparison, night | 0.7 ms | 1.5 ms |
| Distance slider step, single EDOF, night | 0.8 ms | 1.3 ms |
| Lighting change (rebuilds the scenes and canvas textures, then all layers) | 72–454 ms (one-off) | — |

An unchanged view costs nothing, because rendering is on demand. A lighting change causes one noticeable hitch,
because the scenes are rebuilt. Mobile GPUs were **not** measured. Adaptive quality exists, but it has not been
profiled on real phones.

## Tests

`PW_PORT=4473 PRERENDER_PORT=4476 npx playwright test tests/vision-*.spec.js`

- `tests/vision-optics.spec.js`: 20 Node-only model tests.
- `tests/vision-sim.spec.js`: 15 browser tests against `vision-sim-preview.html`. They cover mount/destroy ×8,
  idempotent mount, controls → model → pixels, the comparison divider, rapid switching, language/theme, context loss and
  restore, determinism, the no-WebGL fallback, reduced motion, keyboard, touch at 390 px, and 320 px overflow/overlap in AR and EN.
