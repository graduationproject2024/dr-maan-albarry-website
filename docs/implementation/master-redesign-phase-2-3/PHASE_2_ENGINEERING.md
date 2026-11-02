# Phase 2: Cataract surgery 3D simulator, engineering

Module: `src/cataract-sim/` (ES modules, `three@0.170.0` from npm, pinned exactly). It is independent of the legacy "Vision Simulator" in `main.js`, which uses the CDN r128 `window.THREE` global. The new module never reads `window.THREE`, so the two can run on the same page.

## Files

| File | Responsibility |
|---|---|
| `index.js` | Public `mount()`, the `Simulator` orchestrator (lifecycle, the single RAF loop, camera flights, playback, keyboard, context loss, debug handle) |
| `state.js` | Explicit state machine and transition table |
| `timeline.js` | Per-stage playback durations, global progress 0..1, `locate()`, exact `seek()` |
| `stages.js` | 7 stages (bilingual text, focus, camera preset, `animate(p, params)`, highlight, `review` metadata), anatomy structures, `paramsAt(stage, p)` |
| `anatomy.js` | Anatomical constants (mm) and profile maths (pure, no three.js) |
| `lathe.js` | Lathe around the optical axis with profile normals, rewritable in place (iris dilation), cut-away caps |
| `eye-model.js` | Procedural eye, IOL, rays, fragments, highlight easing, label anchors; `apply(params)` |
| `instruments.js` | Keratome, capsulorhexis forceps, phaco handpiece, IOL injector; fulcrum posing through the incision |
| `materials.js` | Materials and canvas-painted procedural textures; Fresnel shell shader patch; ray shader |
| `scene.js` | Renderer (ACES, sRGB, DPR cap 2, MSAA), camera, lights, RoomEnvironment via PMREM, disposal |
| `perf.js` | FPS sampling and adaptive DPR; IntersectionObserver + `visibilitychange` suspension |
| `ui.js` | DOM, ARIA, i18n (`ar`/`en`), hotspots, live region |
| `fallback.js` | Non-WebGL fallback: one inline SVG cross-section diagram per stage |
| `styles.css` | All rules scoped under `.csim`. Colour tokens are self-contained (not inherited from the site's `:root`), so host CSS cannot drop text contrast. Imported by `index.js`, so it ships in the lazy chunk |

## Public API

```js
const { mount } = await import('./src/cataract-sim/index.js'); // lazy chunk
const ctrl = await mount(hostEl, { lang: 'ar'|'en', theme: 'light'|'dark', reducedMotion?: boolean, autoplay?: false, debug?: false });
ctrl.play(); ctrl.pause(); ctrl.restart(); ctrl.goToStage(i); ctrl.next(); ctrl.prev();
ctrl.seek(t01);          // pauses (or completes at 1) and sets exact global progress
ctrl.resetView(); ctrl.setLang(l); ctrl.setTheme(t); ctrl.getState(); ctrl.destroy();
const off = ctrl.on('statechange' | 'stagechange' | 'close' | 'complete' | 'langchange' | 'themechange' | 'error', cb);
```

- `mount` is idempotent per host. A second `mount` on the same host destroys the first, including one that is still loading.
- `destroy()` is idempotent. It cancels the RAF loop and timers, removes every listener it registered, disconnects ResizeObserver and IntersectionObserver, disposes OrbitControls, geometries, materials, textures, the PMREM render target and the renderer, calls `forceContextLoss()`, and removes all DOM it created.
- The close button emits the controller `close` event. It also dispatches a bubbling DOM `CustomEvent('cataract-sim:close')` on the host.
- `window.__cataractSim` and `window.__cataractSimCounters` exist only when `options.debug === true`. The counters are `live`, `listeners`, `observers`, `rafLoops`, `renderers`, `mounts` and `destroys`.
- `getState()` returns `{ state, playing, stageIndex, stageId, stageCount, stageProgress, progress, lang, theme, reducedMotion, webgl, fallbackReason, labels, cutaway, focus, dpr, fps, camera:{distance, azimuth, polar, target} }`.

## State machine

| From | Allowed to |
|---|---|
| idle | loading |
| loading | ready, fallback, error |
| ready | playing, paused, transitioning, completed, error |
| playing | paused, transitioning, completed, error |
| paused | playing, transitioning, completed, error |
| transitioning | playing, paused, transitioning (retarget), completed, error |
| completed | playing, paused, transitioning, error |
| error (context lost, restoring) | ready, playing, paused, completed (previous state), fallback |
| fallback | none (terminal) |

The machine ignores invalid transitions and logs them with `console.debug` only when debug is on. `transitioning` covers explicit stage navigation while the camera flies. The timeline holds at the stage start, then returns to the previous play state. Repeated clicks only retarget the flight, and the counters show exactly one RAF loop.

Scene state is deterministic: `paramsAt(stage, p)` applies every earlier stage at p=1, then the current stage at p. Seeking, scrubbing and replaying therefore always produce the same picture.

## Lifecycle

- **Resize:** a ResizeObserver on the viewport sets the renderer size and camera aspect. On portrait screens the vertical FOV widens so the horizontal framing holds.
- **Language:** `setLang` rewrites all text, `lang` and `dir` in place. The canvas, stage and playback state are kept (tested).
- **Theme:** `setTheme` switches the `.csim[data-theme]` tokens and the scene background colour.
- **Context lost:** the handler calls `preventDefault()`, stops the loop and moves to `error`. The current stage's SVG diagram is shown with the note "Restoring…". On `webglcontextrestored` the PMREM environment is rebuilt, materials and textures are flagged for re-upload, and the previous state resumes. If no restore arrives within 10 s, the simulator moves to `fallback`.
- **No WebGL at mount:** the simulator enters `fallback`. 3D-only controls are removed. Stage navigation, the timeline segments and the text keep working.
- **Hidden or off-screen:** the IntersectionObserver or `document.visibilityState` cancels the RAF loop entirely, so playback time does not advance.
- **Idle frames:** when nothing changes (paused, no damping, no animated highlight or rays), frames skip rendering.
- **Reduced motion** (`prefers-reduced-motion` or the option): no autoplay, camera changes jump-cut, rays and highlight pulses are static, and playback runs at 0.6× speed only when the user starts it.

## Controls

The playback bar has: Start overlay, Play/Pause/Replay, Previous, Next, Replay stage and Restart. Below it are 7 proportional timeline segments (`aria-current="step"`) and a range scrubber (`aria-valuetext`). Scrubbing pauses.

The viewport toolbar has: Zoom in/out (consecutive clicks accumulate), Reset view, Anatomy labels (DOM hotspots with collision avoidance), Cross-section toggle, and "Explore 3D" (touch devices only).

Pointer input:
- **Mouse:** OrbitControls drag to rotate, wheel to zoom, right-drag to pan.
- **Limits:** distance 11–80 mm, polar 0.4–(π−0.4), azimuth ±1.5 rad, damping on, pan target clamped to a box around the eye.

Keyboard, with focus anywhere inside the simulator:
- Space toggles playback, except on buttons, links and fields, which keep their native behaviour.
- ←/→ change stage. In RTL they are mirrored: ← moves to the next stage.

**Touch policy (chosen and documented):** the canvas has `touch-action: pan-y`, and touch pointers are stopped before they reach OrbitControls. A one-finger swipe over the model therefore scrolls the page. Tapping "Explore 3D" switches the canvas to `touch-action: none`: one finger rotates, two fingers pinch and pan. Tapping the button again exits this mode. Both behaviours are tested with real CDP touch events.

## Accessibility

- The viewport is a focusable labelled group, and every control has a localised `aria-label` (tested for both languages).
- A polite live region announces each stage change, play/pause, completion and restore.
- The loading overlay uses `role=status`.
- Focus rings are visible, and focus order follows the DOM: header, viewport, tools, transport, timeline, panel.
- On mobile, every control is at least 44 px (tested).
- The disclaimer is always visible.

## How to run

```bash
npm install                     # three@0.170.0 is a dependency
npx vite --port 5179            # then open http://localhost:5179/cataract-sim-preview.html?lang=en&theme=light&reduced=0
```

Harness query parameters: `lang=ar|en`, `theme=light|dark`, `reduced=0|1` (omit it to follow the OS setting), `autoplay=1`.

To run the spec under the main `playwright.config.js` (which builds and serves `dist`), add the harness page as a build input in `vite.config.js`:

```js
rollupOptions: {
  input: {
    index: resolve(import.meta.dirname, 'index.html'),
    cataractSimPreview: resolve(import.meta.dirname, 'cataract-sim-preview.html')
  }
}
```

No `playwright.config.js` change is needed. The spec opens the relative URL `cataract-sim-preview.html` against `baseURL`. The harness includes the `<!-- @doctor-json-ld -->` slot, because `doctorDataPublisher.transformIndexHtml` throws on any HTML entry that lacks it. The harness is `noindex`. If it must not ship to production, gate that input behind an env var (for example `CSIM_PREVIEW=1`) used by the test command.

Opt-in extras:
- `CSIM_EVIDENCE=1 npx playwright test tests/cataract-sim.spec.js -g "stage screenshots"` writes `evidence/simulator/{1440,390}/*.jpg`.
- `CSIM_PERF=1 ... -g "performance"` writes `evidence/simulator/perf-*.json`.
