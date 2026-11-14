# Performance results

Measured on 2026-11-14 on one Windows machine (RTX 2060, ANGLE/Direct3D 11) in Chromium through Playwright against `vite preview` on localhost. Phones are **emulated** (device metrics plus CDP throttling: Fast 3G, CPU 4x). These are lab numbers, not field data, and no physical phone was used.

Command: `JOURNEY_PERF=1 PW_PORT=4671 PRERENDER_PORT=4676 npx playwright test tests/journeys/premium-perf.spec.js --workers=1`. Medians of 3 runs for page loads; one run for simulator start-up.

## Same machine, same day: old build against this branch

The spec was also run on the same day on the previous live build (`ea3e44d`), because numbers from 2026-11-09 (home 2,696 ms, cataract page 2,660 ms) were measured under different machine conditions and are not comparable with today's.

| Page | Viewport, throttling | LCP old build | LCP this branch | CLS old / new | INP old / new (two FAQ taps) | Transfer old / new |
|---|---|---|---|---|---|---|
| Home (Arabic) | 390, Fast 3G + CPU 4x | 3,168 ms | **3,012 ms** | 0.0033 / 0.0029 | 56 / 48 ms | 773 / 681 KiB |
| Cataract page (Arabic) | 390, Fast 3G + CPU 4x | 2,976 ms | 3,004 ms | 0.0022 / 0.0022 | 56 / 64 ms | 648 / 597 KiB |
| Home (English) | 390, Fast 3G + CPU 4x | 2,612 ms | 2,712 ms | 0 / 0 | 48 / 64 ms | 672 / 580 KiB |
| Home (Arabic) | 1440, none | 296 ms | 252 ms | 0.0030 / 0.0035 | 16 / 16 ms | 773 / 716 KiB |
| Cataract page (English) | 1440, none | 144 ms | 232 ms | 0.0001 / 0.0001 | 16 / 16 ms | 581 / 568 KiB |

Reading: no material regression. The differences are within about 100 ms either way, which is the spread between runs of the same build (for example the three Arabic home runs on the old build were 4,008, 3,168 and 3,108 ms). Pages transfer less than before. INP here is the slower of two scripted taps, not real interaction data.

## The portrait became the LCP element, and what was done

After the hero change, the largest element of the first screen on home is the portrait. Measured with LCP candidates (5 runs, same throttling): the text painted at 2,748 ms and the photo at 3,084 ms. The photo is now preloaded on the two home pages (`scripts/prerender.mjs`), ahead of the fonts. After that the photo paints with the first paint: Arabic home 2,828 ms median, English 2,560 ms, one candidate only.

## Bundle and assets

| Item | Old build | This branch |
|---|---|---|
| App script (`index`) | 202.8 KiB, 60.2 gzip | 227.1 KiB, 65.6 gzip |
| App styles (`index`) | 82.9 KiB, 16.1 gzip | 86.4 KiB, 16.7 gzip |
| `vision-sim` script / styles | 33.3 KiB / (was in one file) | 38.2 KiB, 12.5 gzip / 19.9 KiB, 4.7 gzip |
| `lens-lab` script | 17.9 KiB | 19.5 KiB, 6.3 gzip |
| `three.module` | 509.6 KiB, 128.3 gzip | unchanged; still not requested on home |
| Images in `dist` | 14,271 KiB library | 15,427 KiB library (re-rendered plates); home requests 332 KiB at 390 px (was 430) |
| Fonts | 244 KiB | unchanged |

The app script grew by 5.4 KiB gzip (section registry, plate disclosure and enlarge, jump holding, reading-position restore, simulator state).

## Simulators

| Measure | Old build today | This branch today |
|---|---|---|
| Vision simulator, scroll to ready, localhost | 718 ms | 485 ms (409 ms in an earlier run) |
| Vision simulator, scroll to ready, Fast 3G + CPU 4x | 3,212 ms | 206 ms (1,127 ms in an earlier run); it is now the first module on the page and starts loading at once |
| 3D cataract viewer, tap to ready, localhost | 5,056 ms | 5,138 ms (4,582 ms earlier) |
| 3D cataract viewer, tap to ready, Fast 3G + CPU 4x | 4,752 ms | 6,665 ms in this run, 4,836 ms in a run two hours earlier on the same viewer code |
| WebGL contexts on `/lens-lab/` on a phone | 2 | 1 |
| Lens, lighting or distance tap to updated picture | not measured before | The change is applied in the same frame the control changes (asserted by pixel comparison within the tests' default wait); no separate latency number was recorded |

The 3D start-up figures are single runs and vary by more than a second between runs of the same code, so they do not show a change either way. WebGL cleanup is covered by the stress journeys: 10 open and close cycles keep one viewer and live contexts do not grow.

## Not measured

Field data from real phones on real networks; frame rates on phone GPUs; iOS Safari.
