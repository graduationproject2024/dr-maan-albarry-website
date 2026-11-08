# Performance results

Measured on 2026-11-08 on this Windows machine (NVIDIA RTX 2060, ANGLE/Direct3D 11) in Chromium through Playwright, against `vite preview` on localhost. Phones are **emulated** with Playwright device metrics plus CDP throttling (Fast 3G: 562 ms latency, 1.44 Mbit/s down; CPU 4x). No physical phone was used, and these are lab numbers, not field data.

Commands: `JOURNEY_PERF=1 PW_REUSE=1 PW_PORT=4671 PRERENDER_PORT=4676 npx playwright test tests/journeys/premium-perf.spec.js --workers=1` (raw results: `evidence/journeys/logs/premium-perf.json`) and the existing `tests/journeys/perf.spec.js` with the same flags. Medians of 3 runs unless stated. Sizes of transferred files come from the Resource Timing API.

## Core Web Vitals (3 runs, median)

| Page | Viewport | Throttling | LCP | CLS | INP (FAQ taps) | Transfer |
|---|---|---|---|---|---|---|
| Home (Arabic) | 390 | Fast 3G + CPU 4x | 4,272 ms | 0.0033 | 48 ms | 773 KiB |
| Home (English) | 390 | Fast 3G + CPU 4x | 3,588 ms | 0.0000 | 40 ms | 671 KiB |
| Cataract page (Arabic) | 390 | Fast 3G + CPU 4x | 5,796 ms | 0.0022 | 56 ms | 648 KiB |
| Home (Arabic) | 1440 | none | 264 ms | 0.0030 | 16 ms | 773 KiB |
| Cataract page (English) | 1440 | none | 248 ms | 0.0001 | 16 ms | 580 KiB |

INP here is the slowest of two scripted FAQ taps (`PerformanceEventTiming`), not a full interaction history. Real INP needs field data.

**What the LCP numbers mean.** On the throttled phone runs the LCP element is text (`.hero-intro`, `.proc-lede`). The prerendered text first paints at about 3.2 s; LCP then fires again at 3.9–5.7 s when the app replaces the prerendered markup with its own render and the fonts have arrived. The patient sees the content from the first paint, but the metric records the later candidate. The earlier design measured 3,044 ms (home) and 4,080 ms (cataract page) in the same setup (2026-11-02), before the self-hosted web fonts and larger plates. This is a real increase in the metric and is the main open performance item: avoiding the DOM replacement on first render would close most of it. It was not changed in this pass because it touches the routing and re-render path of every page.

## The 3D code does not load on the homepage

Network log of the home page after a full scroll to the bottom at 390 px: `index-*.js`, `modulepreload-polyfill-*.js`, `preload-helper-*.js`. `three.module`, `cataract-sim` and `vision-sim` are not requested. Asserted by `tests/journeys/premium-perf.spec.js`.

## Bundle sizes by chunk (`dist/assets`, built with `CSIM_HARNESS=1`)

| Chunk | Raw KiB | Gzip KiB | Loaded on |
|---|---|---|---|
| `three.module` | 509.6 | 128.3 | Tapping 3D Start, or the vision simulator scrolling into view |
| `index` (app) | 201.7 | 59.9 | Every page |
| `cataract-sim` | 136.3 | 45.1 | Tapping 3D Start |
| `index` CSS | 82.7 | 16.0 | Every page |
| `content` (procedures) | 56.1 | 17.8 | Procedure pages |
| `review` (review mode) | 38.1 | 13.7 | Review mode only |
| `vision-sim` | 33.3 | 11.1 | Lens Lab |
| `light-journey` | 31.1 | 11.9 | How vision works |
| `content` (site) | 29.3 | 9.6 | Section pages |
| `lens-lab` | 17.9 | 5.9 | Lens Lab |

## Fonts and images

| | Files | Size | Note |
|---|---|---|---|
| Fonts | 7 WOFF2 in `dist/fonts` | 244 KiB total | Arabic pages transfer 246 KiB (all seven are requested by the Latin and Arabic text on the page), English pages 145 KiB |
| Images | 251 in `dist/images` | 14,271 KiB total | Page weight is what the browser requests (table below), not the total library |

| Page, viewport | Images KiB | Fonts KiB | JS KiB | CSS KiB | Requests |
|---|---|---|---|---|---|
| Home AR 390 | 430 | 246 | 62 | 16 | 22 |
| Cataract AR 390 | 288 | 246 | 80 | 16 | 21 |
| Home EN 390 | 430 | 145 | 62 | 16 | 20 |

## Simulators

| Measure | Result |
|---|---|
| 3D cataract viewer: tap to "ready", localhost, CPU 1x | 3,858 ms (premium-perf); 4,187 ms (existing perf spec) |
| 3D cataract viewer: tap to "ready", Fast 3G + CPU 4x | 4,630 ms (premium-perf); 4,843 ms (existing perf spec) |
| Vision simulator: scroll to mount, localhost | 452 ms |
| Vision simulator: scroll to mount, Fast 3G + CPU 4x | 3,114 ms |
| 3D cataract viewer playing: frames over 5 s | 60 fps at CPU 1x (p95 16.7 ms); 59 fps at CPU 4x (p95 16.8 ms, p99 33.3 ms) |
| Vision simulator while the distance changes every ~80 ms | 60 fps at CPU 1x and CPU 4x (p95 16.7–16.8 ms) |
| WebGL cleanup over 8 open/close cycles of the 3D viewer | 1 live context while open, 0 after closing, no canvases left, heap 9.5 MiB at every cycle (start 9.5) |

Frame rates depend on this desktop GPU and do not predict frame rates on phones.

## Measurements from the existing perf spec on this build

`tests/journeys/perf.spec.js`, one run each (for comparison with the earlier design):

| Page | Network | LCP | CLS | JS KiB | Images KiB |
|---|---|---|---|---|---|
| Home AR | localhost | 700 ms | 0 | 62 | 409 |
| Home EN | localhost | 184 ms | 0 | 62 | 409 |
| Cataract AR | localhost | 316 ms | 0 | 80 | 131 |
| Home AR | Fast 3G + CPU 4x | 3,884 ms | 0.003 | 62 | 409 |
| Cataract AR | Fast 3G + CPU 4x | 5,652 ms | 0.002 | 80 | 131 |

The spec's vision-frames step had to be repointed from `/en/` to `/en/lens-lab/`, because the vision simulator left the homepage in Phase 1. Its result file is not committed from this run.

## Open items

- Throttled LCP as described above (first-render DOM replacement).
- Field data: none. Numbers from real phones on real networks are still needed.
