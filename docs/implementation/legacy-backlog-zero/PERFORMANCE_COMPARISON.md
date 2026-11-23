# Performance comparison

Lab numbers on this laptop, not field data. Phone profile: `tests/perf-final.mjs` (390×844, DPR 2, Fast 3G + 4× CPU), median of 3 cold loads.

## Phone, throttled

| Page | Before milestone LCP / TBT | Motion on all devices (first version) LCP / TBT | Same build, motion disabled LCP / TBT | **Final (motion desktop-only)** LCP / TBT / requests |
|---|---|---|---|---|
| home AR | 2832 / 467 | 2960 / 685 | 2756 / 509 | **3036 / 576 / 17** |
| home EN | 1992 / 292 | 2156 / 331 | 2404 / 324 | **2172 / 320 / 15** |
| cataract AR | 2192 / 343 | 2504 / 739 | 2408 / 534 | **2400 / 547 / 11** |
| Lens Lab EN | 1660 / 1033 | 1820 / 1573 | 1944 / 1561 | **1780 / 1310 / 13** |
| procedures AR | 2172 / 82 | 2236 / 151 | 2140 / 104 | **2216 / 122 / 16** |

CLS: unchanged on every page (0 – 0.0029).

Reading:
- "Before" was measured earlier in the day; the three right-hand columns were measured back to back. The machine had just run long test suites, so the whole set is slower than "before" — including the build with motion disabled. Compare the right-hand columns with each other.
- With the motion layer on phones, blocking time rose 50–200 ms on three pages (GSAP parse/exec on a 4× slowed CPU) and it added one request (~28 KB). LCP differences were inside the run-to-run range.
- Decision: the layer is not loaded on phones at all. The final phone build requests exactly the same files as the motion-disabled build (17 / 15 / 11 / 13 / 16 requests, same bytes). Remaining LCP/TBT differences are run-to-run noise.

## Desktop (1440×900, no throttling, median of 3)

| Page | LCP | CLS | TBT | motion code fetched at (ms) > page load end (ms) |
|---|---|---|---|---|
| home EN | 216 | 0.0001 | 47 | 378 > 284, 260 > 182, 288 > 184 |
| home AR | 264 | 0.0038 | 28 | 346 > 343, 386 > 385, 378 > 375 |
| cataract AR | 264 | 0.0017 | 100 | 322 > 274, 364 > 318, 378 > 322 |
| Lens Lab EN | 156 | 0.0001 | 2520 | 206 > 158 … (TBT is the WebGL simulator start, unchanged by this milestone) |

The motion code is always requested after the page's `load` event, so it cannot delay LCP.

## Bundle

| Chunk | Size | gzip | Loaded |
|---|---|---|---|
| `motion-*.js` (GSAP core + site motion) | 72.1 KB | 27.9 KB | desktop pointer, after load + idle |
| `lenis-*.js` | 18.2 KB | 5.2 KB | desktop pointer, after motion |
| main `index-*.js` | 234.1 KB | 68.1 KB | every page (gains only the small boot and scroll helpers) |

ScrollTrigger was removed (first version 45.9 KB gzip).
