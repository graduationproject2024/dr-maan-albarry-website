# Performance results (2026-11-25)

Same machine, same scripts, back to back: live `main` (`4e55b40`, worktree `C:\w\main`) vs the closure branch (`90dcb94`).
Lab measurements: Chromium on Windows with the local GPU (ANGLE/D3D11), phones emulated, `vite preview` on localhost. Not field data.

## Page loads — `tests/journeys/premium-perf.spec.js` (`JOURNEY_PERF=1`, 1 worker, median of 3)
| Page | LCP ms main → branch | CLS | INP ms | JS KiB | Total KiB |
|---|---|---|---|---|---|
| home AR 390, Fast 3G + CPU 4× | 2804 → **2372** | 0.0029 → 0.0029 | 56 → 56 | 84 → 86 | 908 → 869 |
| cataract AR 390, Fast 3G + CPU 4× | 2472 → 2580 | 0.0022 → 0.0022 | 64 → 64 | 151 → 153 | 670 → 656 |
| home EN 390, Fast 3G + CPU 4× | 2252 → 2208 | 0 → 0 | 48 → 48 | 84 → 86 | 806 → 768 |
| home AR 1440, unthrottled | 200 → 232 | 0.0026 → 0.003 | 16 → 24 | 118 → 120 | 701 → 688 |
| procedure EN 1440, unthrottled | 152 → 184 | 0.0001 → 0.0001 | 16 → 16 | 355 → 356 | 844 → 830 |

Differences are within run-to-run noise (home AR runs on the branch: 2288 / 2372 / 2936 ms). Initial JS +2 KiB (the new `chunk-recovery` module). Total transfer is lower on every page (smaller ICL images). three.js never loads on the home page (checked after a full scroll).

## Lazy chunks (gzip KiB, main → branch)
- `light-journey`: 13.3 → 16.6 (new drawing and motion)
- `surgical-sim`: 16.8 → 17.8 (camera framing)
- `vision-sim`: 14.4 → 14.8; Lens Lab scenes chunk ~16 → ~38 KiB source (new street scene)
- `three.module`: 167.1 → 167.1 (unchanged); main bundle 74.1 → 75.0
- Images on disk: 15,427 → 14,826 KiB

## Simulators
- Vision simulator, scroll → canvas on `/lens-lab/` at 390 px, 5 runs each (`scratchpad vsimready.mjs`): main median 63 ms (CPU 1×) / 146 ms (CPU 4× + Fast 3G); branch 51 / 147 ms. No regression. (A single-sample reading in the perf spec suggested 1181 → 2411 ms; it did not reproduce.)
- Cataract 3D tap → ready, single samples: localhost 2977 → 1035 ms; Fast 3G + CPU 4× 4999 → 5281 ms (noise range; the cataract simulator code is unchanged).

## Not measured
- Real-phone field data (no analytics, by owner decision D-13).
- Frame pacing of the new Light Journey motion and Lens Lab cross-fade on a low-end phone (needs a device run).
