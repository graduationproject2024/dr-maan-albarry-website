# Cataract 3D viewer — startup

Script: `tests/profile-cataract-startup.mjs` (5 runs per condition; times from the tap). Raw data: `evidence/cataract/startup-before.json`, `startup-after.json`. Chromium on Windows with the local GPU, phone emulated at 390×844 DPR 2, served by `vite preview`. Laboratory numbers, not field data.

## Where the time goes (before)

| Phase (median, ms) | Unthrottled | Fast 3G + 4× CPU | Second visit, Fast 3G + 4× CPU |
|---|---|---|---|
| Loading message shown | 60 | 1,735 | 55 |
| Download of the 3D code (175 KB compressed, 660 KB decoded) | 34 | **1,593** | 0 |
| Create renderer | 81 | 427 | 232 |
| Materials (generated textures) | 60 | 349 | 367 |
| Geometry (eye, instruments, rays) | 251 | **992** | 779 |
| Shader compilation | 378 | 516 | 517 |
| **Tap → ready** | **891** | **4,142** (3,819–4,397) | **1,961** |
| Longest main-thread task | 288 | 952 | 738 |
| JS heap | 21 MB | 22 MB | 21 MB |

A CPU profile of the set-up (dev build, 4× CPU) adds: shader program linking and log checks ≈0.6 s of native time, `irisTexture` 240 ms, `buildRays` 257 ms (27 tube meshes), `buildEye` 697 ms in total.

**True bottleneck:** on a slow connection the download (≈40 %), then geometry. One canvas exists after start; none before.

## Changes

1. **Code fetched just before the tap** (`main.js c3dWarm`): when the 3D section is about one screen away (idle time) on pages that host the viewer, or when the visitor reaches for the button (pointer over, finger down, keyboard focus). Never on the home page by itself; never with data saver or 2G. Only code: no WebGL context, no canvas, no scene. A failed early fetch is silent; the tap shows the normal error and retry.
2. Tried and **reverted**: turning off three.js shader error checks in production. It did not change the median, so it was not kept.

## After

| Median (ms) | Unthrottled | Fast 3G + 4× CPU | Second visit |
|---|---|---|---|
| Loading message shown | 23 | 96 | 48 |
| Download after the tap | 0 | 0 | 0 |
| **Tap → ready** | **885** | **2,496** (2,321–2,898) | **2,042** |

So on the throttled profile the wait after the tap fell from 4.1 s to 2.5 s, because the download now happens while the visitor reads. The set-up itself (≈2.5 s at 4× CPU) is unchanged and is backlog item P2-02.

## Loading experience (checked)

| Requirement | State | Test |
|---|---|---|
| Clear loading state | Percentage only where it is a real step (5/25/55/75/100 % = UI, renderer, materials, geometry, shaders) | existing `cataract-sim.spec.js` |
| Safe cancellation, return during loading | Leaving during the download or the mount leaves exactly one working viewer | `returning-visitor.spec.js` "3D viewer: leaving and coming back during the download" |
| Retry and fallback | Failed download: message and retry; no WebGL: illustrated fallback | `cataract-warmup.spec.js`, `journey-regressions` |
| No duplicate renderers, no leaked contexts | 8 open/close cycles leave nothing | `cataract-stress.spec.js` |
| Early fetch rules | Not on home, not with data saver, code only, no second download | `cataract-warmup.spec.js` (5 tests) |

Anatomical detail was not reduced.

## Scrubber fix preserved

The earlier fix (scrubber under the booking bar on short phones) is still covered: `technical-fixes.spec.js` and `journeys/touch-gestures.spec.js` hit-test the element at the touch point at short heights. Both pass in the full suite and under load (`REGRESSION_RESULTS.md`).
