# Full regression results

## Layer 1 — real rendering (local, GPU) — the release evidence
Windows 11, Chromium via ANGLE/Direct3D 11 on an RTX 2060, production build, `npx playwright test --workers 2` (every spec file).

| Run | Code | Result |
|---|---|---|
| 1 | `c359a71` (all four rebuilds merged) | 910 passed, **4 failed**, 24 skipped (20.0 min) |
| 2 | `90dcb94` (fixes below) | **914 passed, 0 failed, 0 flaky**, 24 skipped (19.2 min) |

Run 1 failures and what was done:
| Test | Cause | Fix |
|---|---|---|
| returning-visitor › Lens Lab closing → home → Back (0 ms, 1500 ms) | Real regression (BUG-FS-01 again): with the eye-surface section between the comparison and the closing band, the comparison never neared the clamped viewport, so the short page never grew and Back landed ~5,000 px high | `holdScrollTarget` loads pending modules when a restored position is out of reach (`mountNow()` in `src/feature-loaders.js`) |
| technical-fixes › focus never hidden, 390×844 `/en/` ("03 Laser vision correction") | Real (intermittent): focus inside a still-rising `.fade-in` block was scrolled to its +16 px position and finished under the booking bar | `.fade-in:focus-within` shows at once (WCAG 2.4.11) |
| core-journeys › J06 | Environment: Windows refused the write of the journey log file (`UNKNOWN: unknown error, open …j06-360-full-scroll.json`) | none needed; passed in run 2 |

The 24 skipped tests are performance and evidence captures that run only with `JOURNEY_PERF=1`, `CSIM_PERF=1` or `CSIM_EVIDENCE=1` (serial, idle machine). They are measurement scripts, not checks.

Earlier in this pass (before the merges), the journey suites exposed test drift from PR #4 (home gallery markup) and one real bug (a `#lab` bookmark never loaded the Lens Lab simulator); both fixed in `ffed997`.

## Layer 2 — GitHub-hosted runners (no GPU)
| Run | Setup | Result |
|---|---|---|
| 45169661762 (main, before this pass) | 1 job, 2 workers | 52 failed, 3 flaky, 788 passed — near the 2 h cap |
| 45402597982 | 4 shards × Linux/Windows, 2 workers | all 8 jobs failed; 3D suites time out on both OSes |
| 45434609356, 45620955723 | 6 Linux shards, 1 worker | non-3D suites green after `ffed997`; remaining failures are WebGL suites (cataract, surgical, vision, Lens Lab distance) plus Light Journey `lj-label` width at 320/390 px on Linux fonts |
| 45635244805 | same, on `90dcb94` | running |

Root cause (BUG-C01): hosted runners have no GPU on any OS; WebGL falls back to a software renderer, so 3D interactions take seconds and the tests' 5 s frame predicates time out. Not a product defect; the same tests pass on real GPUs (layer 1) and on real devices.

Options for making layer 2 cover rendering (owner decision):
1. A self-hosted GitHub runner on a machine with a GPU (free; needs someone to register it).
2. GitHub GPU-hosted runners (paid).
3. Keep layer 1 as the rendering gate before each release (current practice) and run the non-GPU suites on GitHub.
