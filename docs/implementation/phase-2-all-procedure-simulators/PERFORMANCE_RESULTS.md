# Performance results (production build, 2026-11-22)

- **Setup:** `vite preview`, Chromium with the GPU through ANGLE/D3D11, 1366×900, on the development laptop.
- **Raw output:** `evidence/performance-run.txt`.
- **Cold:** each procedure is measured in a new browser context with an empty cache. **Warm:** the same context reopened.

| Procedure | Start → ready, cold (ms) | Start → ready, warm (ms) | Downloaded on Start, cold (KB, compressed) | Max triangles (any stage) | Max draw calls | fps while playing (cold / warm) |
|---|---|---|---|---|---|---|
| IOL | 2210 | 1291 | 303 | 211k | 58 | 56 / 59 |
| ICL | 1954 | 1290 | 336 | 119k | 37 | 60 / 60 |
| Laser | 1388 | 1265 | 361 | 173k | 40 | 46 / 54 |
| Keratoconus / CXL | 1252 | 1230 | 310 | 78k | 21 | 59 / 60 |
| Corneal transplant | 1109 | 1191 | 318 | 101k | 44 | 60 / 60 |
| Intravitreal | 1110 | 1021 | 328 | 181k | 68 | 60 / 60 |

**Homepage:** 0 resources of `surgical-sim`, `cataract-sim` or `three.module` after 4 s. No 3D code is loaded.

## Against the budgets (`PERFORMANCE_STRATEGY.md`)

| Budget | Result |
|---|---|
| 0 bytes of 3D code before Start | Met (test + homepage measurement) |
| ≤ 300k triangles | Met (max 211k) |
| ≤ 120 draw calls | Met (max 68) |
| Start → ready ≤ 3 s, warm desktop | Met (1.0–1.3 s) |
| 0 leaked canvases | Met (tests) |

## Phones

- **Android Emulator, Chrome on Android 14:** every simulator reached `ready` and played on both profiles (`ANDROID_RESULTS.md`). Frame rate on the emulator is not representative of a real phone, so it is not reported.
- **Low-memory devices:** devices reporting ≤ 2 GB now start at pixel ratio 1. This AVD reports 4 GB, so that path was not exercised there.

## Before / after for existing pages

The engine is a separate lazy chunk, and the procedure pages gained only a static section. The main bundle grew only by the section markup and the loader code in `main.js`. The full regression suite's first-render and performance tests (`first-render.spec.js`) pass.
