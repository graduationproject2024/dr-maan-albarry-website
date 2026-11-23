# Performance comparison

| Measure | Class | Before | After |
|---|---|---|---|
| 3D tap → ready, unthrottled | lab (Chromium, desktop GPU) | 732 ms | 626 ms |
| 3D tap → ready, Fast 3G + 4× CPU | lab | 2,364 ms | 2,078 ms |
| same, files cached | lab | 1,845 ms | 1,427 ms |
| Shader programs linked inside the first frame | lab | 8 | 0 |
| Longest task on start, throttled | lab | 920 ms | 959 ms (geometry; unchanged work, the rays moved out) |
| Home LCP | OS sim (AVD, localhost) | — | 468–624 ms high-end, 390–609 ms mid-range |
| Lens Lab LCP | OS sim | — | 484–815 ms high-end, 324–688 ms mid-range |
| CLS | OS sim | — | 0 |

Emulator numbers come from emulated hardware on a desktop and do not predict phone performance. No GPU, memory or energy number is reported for real devices: the cloud connector exposes none.

Leaks: mount/destroy ×8 stress (no leaked listeners, observers, loops or renderers) passed 4 repeats; one canvas at most after repeated start/close.
