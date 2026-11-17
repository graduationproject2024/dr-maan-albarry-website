# Performance results

Script: `tests/perf-final.mjs`. Profile: Chromium, phone 390×844 DPR 2, Fast 3G (1.44 Mbps down, 562 ms latency) + 4× CPU, cold cache, 5 runs per page; medians with [min–max]. The live commit (`c7cdbed`) was built in a side worktree and measured in the same session, on the same machine, with the same script. Laboratory numbers, not field data. Raw: `evidence/performance/pages-*.json`.

## Largest Contentful Paint (ms)

| Page | Live `c7cdbed` | This branch, before the CSS change | This branch, final |
|---|---|---|---|
| Home AR | 2,932 [2,884–5,856] | 2,744 [2,664–3,304] | **2,460** [2,008–3,120] |
| Home EN | 2,524 [2,472–2,720] | 2,464 [2,408–2,480] | **1,932** [1,664–2,180] |
| Cataract AR | 2,904 [2,816–3,008] | 2,880 [2,828–2,940] | **2,000** [1,956–2,248] |
| Lens Lab EN | 2,200 [2,120–2,356] | 2,184 [2,080–2,228] | **1,596** [1,496–1,676] |
| Procedures AR | 2,556 [2,532–2,696] | 2,512 [2,476–2,556] | **2,056** [1,932–2,068] |

Target "about 2.5 s or better": met on all five pages in this profile.

## Other metrics (final, median)

| Page | FCP | CLS (max of 5) | TBT | Transfer | Requests |
|---|---|---|---|---|---|
| Home AR | 2,136 | 0.0029 | 315 | 660 KB | 17 |
| Home EN | 1,792 | 0 | 229 | 559 KB | 15 |
| Cataract AR | 2,000 | 0.0022 | 308 | 434 KB | 11 |
| Lens Lab EN | 1,596 | 0.034 | 1,004 | 414 KB | 13 |
| Procedures AR | 2,056 | 0.0024 | 73 | 637 KB | 16 |

## What changed and why

Measured cause: first paint waited for the stylesheet (17 KB compressed) that shared the slow connection with the fonts, the portrait and the script. Blocking the script did not move first paint; blocking the fonts moved it ≈0.2 s; the stylesheet finished at ≈1.65 s and paint followed. **Fix:** the prerender writes the stylesheet into each page (`scripts/prerender.mjs inlineCss`); font URLs are rewritten to the site root. HTML grows by ≈17 KB compressed per first visit; later pages are rendered by the app without another HTML request.

## Not improved / limits

- Lens Lab TBT ≈1 s comes from the vision simulator mounting in the first screen on that page. Unchanged; the simulator is the purpose of the page.
- Lens Lab CLS max 0.034 (one of five runs); median 0.
- Interaction responsiveness (INP) was not measured with a field tool; long-task totals are in the raw files.
- 3D viewer startup: `CATARACT_STARTUP_PERFORMANCE.md`.
- No real-phone or field data exists.
