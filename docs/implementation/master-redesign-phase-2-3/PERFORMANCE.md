# Performance

## 3D simulator

Measured on 2026-11-01 on this development machine. The page was a production Vite build of `cataract-sim-preview.html`, served by `vite preview`. Chromium came from Playwright 1.64 with `--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist`. Playback was running (stage 1: cross-section, animated scattering rays and highlight, the busiest steady scene) and the window covered 6 s of `requestAnimationFrame` timestamps.

GPU (`WEBGL_debug_renderer_info`): `ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 (0x00001F15) Direct3D11 vs_5_0 ps_5_0, D3D11)`. This is **hardware ANGLE/D3D11**, not SwiftShader, on WebGL2.

| Viewport | DPR used | Avg FPS | p95 frame | Draw calls | Triangles |
|---|---|---|---|---|---|
| 1440×900 desktop | 1 | 59.5 | 16.8 ms | 16 | 235,688 |
| 390×844, emulated mobile (`isMobile`, `hasTouch`, deviceScaleFactor 2) | 2 | 60.0 | 16.8 ms | 16 | 235,688 |

The 390×844 row is **desktop-GPU emulation, not a real phone**. Real mid-range phones will be slower. The adaptive quality controller lowers DPR from min(devicePixelRatio, 2) to 1 and then to 0.75 whenever average FPS stays below 40 over 2 s. No real-device numbers have been collected yet.

Raw data: `evidence/simulator/perf-1440x900.json` and `perf-390x844.json`.

Command (with the harness added to the build inputs and the server on :4173, or the dev server and the config described in `PHASE_2_ENGINEERING.md`):

```bash
CSIM_PERF=1 npx playwright test tests/cataract-sim.spec.js -g "performance" --workers=1
```

Bundle (Vite 8 production build, gzip as reported by Vite):

| Chunk | Size | gzip |
|---|---|---|
| `assets/cataract-sim-*.js` (lazy, three.js + module) | 626.8 kB | 166.3 kB |
| `assets/cataract-sim-*.css` (lazy) | 13.0 kB | 3.4 kB |
| Main `index-*.js` | 118.7 kB | 41.4 kB. Contains no `three` module code, only the `import()` stub added by the host integration in `main.js`. |

Other runtime behaviour:
- No rendering happens off-screen or in a hidden tab (RAF cancelled).
- Idle paused frames skip `render()`.
- Instanced zonules, processes and fragments are one draw call each, and the rays are merged into two meshes.
- Textures are painted once at mount: 2048² iris/sclera canvases and two small ones.

## Website (redesigned page)

All numbers here were measured on 2026-11-01 on the same machine (RTX 2060, hardware ANGLE/D3D11). The page was the production build (`npm run build`, which includes the prerender) served by `vite preview` on localhost, with **no network or CPU throttling**. These are lab numbers for comparing builds, not field data: a real 4G phone will be slower.

Command: `npm run build && node tests/perf-site.mjs`. Each row is the median of 3 loads.

| Viewport | LCP | CLS | DOMContentLoaded | load | Requests on load | 3D chunk loaded on page load? |
|---|---|---|---|---|---|---|
| 390×844 | 1004 ms | 0.003 | 966 ms | 2095 ms | 9 | **no** |
| 1440×900 | 940 ms | 0.002 | 904 ms | 1520 ms | 10 | **no** |

Bundle (gzip, measured with `gzip -c | wc -c`):

| Asset | gzip | Loaded |
|---|---|---|
| `index-*.js` (site, includes the legacy Vision Simulator code) | 40.0 kB | on page load |
| `index-*.css` | 9.8 kB | on page load |
| `cataract-sim-*.js` (three.js 0.170 + simulator) | 164.0 kB | only after "Start the 3D experience" |
| `cataract-sim-*.css` | 3.4 kB | with the 3D chunk |
| three.js r128 (CDN, legacy Vision Simulator) | external | on page load. This is unchanged from the baseline. |

Known cost: once the 3D module loads, two three.js copies exist (r128 global for the legacy Vision Simulator, and 0.170 bundled). This triggers a console *warning*, not an error. Migrating the Vision Simulator to the npm build would remove the CDN script. That is a follow-up and was not done here, so as not to risk the working simulator.

Not measured: real phones (no device lab available), throttled 4G, and long-session memory beyond the simulator's destroy/re-mount tests (`tests/cataract-sim.spec.js` checks that the debug counters for renderers, listeners, observers and RAF loops return to zero).
