# Performance strategy

## Loading

- **The homepage and every page load no simulator code until Start.**
  - The procedure pages render a static section.
  - `src/surgical-sim/index.js` is imported dynamically on Start.
  - It is also imported when the visitor reaches for the button (pointer enter, touch start or focus), except on Save-Data or 2G.
  - Test: `surgical-sim.spec.js` checks there are 0 `surgical-sim` or procedure resources before Start.
- **Built HTML:** the built procedure pages contain no `modulepreload` of the simulator. Only the polyfill and the preload helper are preloaded (checked in `dist/en/procedures/icl/index.html`).
- **One small chunk per procedure.** Only the open procedure's definition is downloaded. The engine chunk (`surgical-sim-*.js`, about 46 KB raw) and three.js are shared with the cataract simulator. A visitor who opened one 3D viewer already has three.js cached.

## Rendering

- **One WebGL context per open viewer.** It is destroyed with `forceContextLoss()` on close, on leaving the page, and on moving to another procedure. Test: close and reopen 4 times leaves one canvas.
- **Rendering is on demand.**
  - The frame loop runs only while playing, while the camera moves, or after a change.
  - Nothing renders when the viewer is off-screen (IntersectionObserver) or the tab is hidden (`visibilitychange`), reusing `cataract-sim/perf.js`.
- **Shaders are precompiled behind the loading overlay** (`precompileScene` from the cataract simulator), so the first visible frame does not stall.
- **The section view never recompiles shaders.** Every material keeps the same clipping plane; the plane is only moved.
- **Adaptive pixel ratio.** It starts at min(DPR, 2) and steps down to 1, then 0.75, after two slow 2-second windows. `setQuality('low' | 'high' | 'auto')` is also available.
- **Resources are freed on destroy:** geometries, materials (including the canvas textures) and the environment map.

## Budgets (set from the measured IOL baseline, `PERFORMANCE_RESULTS.md`)

| Metric | Budget |
|---|---|
| Downloads before Start | 0 bytes of 3D code |
| Triangles in any stage | ≤ 300k (IOL measured 217k) |
| Draw calls | ≤ 120 |
| Start → ready (desktop, warm cache) | ≤ 3 s |
| Leaked canvases after close / reopen ×4 | 0 |
