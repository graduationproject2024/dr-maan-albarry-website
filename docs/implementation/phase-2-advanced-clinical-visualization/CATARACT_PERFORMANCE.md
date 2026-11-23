# Cataract 3D startup performance

Lab: Chromium on Windows, ANGLE/D3D11 on the RTX 2060, phone 390×844 DPR 2, median of 5 (`tests/profile-cataract-startup.mjs`). Not field data, not phone hardware.

## Root cause found

A WebGL link trace showed 8 shader programs built one at a time inside the first frame (≈250 ms each unthrottled). In three.js r170, `compile()` does not set up local clipping (only `render()` does), so `compileAsync()` built the 8 cross-section materials without clipping planes and the first render rebuilt them, blocking.

## Changes (`6fe0d38`)

1. `precompileScene()` compiles clipped and unclipped objects in two batches, each after a one-mesh primer render into a 1×1 off-screen target that sets three's clipping state. The canvas is never touched.
2. Own parallel-compile poll with a cancel check, replacing `compileAsync()` (three's timer threw `reading 'isReady'` when the viewer closed mid-compile).
3. After ready, in idle time: light rays (not drawn at the start, ~240 ms of building on the throttled profile) and programs for instruments, IOL and fragments.

Same geometry, materials and model values.

## Tap → ready (ms)

| Condition | Before | After |
|---|---|---|
| Unthrottled | 732 (single cold runs up to 4,200) | 626 |
| Fast 3G + 4× CPU | 2,364 | 2,078 |
| Same, 3D files cached | 1,845 | 1,427 |

Target ~1,500 ms: met on a second visit, not on the throttled first visit (2,078). What remains is main-thread geometry (~1 s throttled: sclera, lens, instruments) and the program source generation; moving geometry to build time or a worker is the next step (backlog P2-02).

## Programs linked in the first frame

Before 8, after 0 (test `cataract-warmup.spec.js`). Closing during or right after start: no error (test fails with three's `compileAsync`).

## Emulator (OS SIMULATOR, not hardware)

Tap → active including adb latency: 7.3–8.5 s (high-end AVD), 7.3–14.8 s (2 GB AVD).

Raw data: `evidence/performance/startup-phase2-*.json`.
