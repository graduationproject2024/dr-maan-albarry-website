# Android Chrome results

## OS SIMULATOR — Android Emulator, Chrome 113, Android 14 (script `tests/devices/android-emulator-journeys.mjs`)

| Run | Code | Steps | Result | Evidence |
|---|---|---|---|---|
| High-end (Pixel 7 profile, 4 GB, 412×783) | branch up to `09a5f59` (before P2-07 to P2-10 and the 3D start change) | 24 | 24 pass, 0 console errors | `evidence/android-emulator/pixel7-profile-android14-chrome113/` |
| Mid-range (360×800, 2 GB) — run that found P2-08 | branch at `7442644`+ | 24 | 22 pass (landscape nudge 11 px; one UI-dump hiccup) | `…/midrange-360x800-2gb-android14-chrome113/` |
| **Mid-range, final code** (`b9aada8`) | final | 24 | **24 pass**, 0 console errors | `…/final-midrange-360x800-2gb-android14-chrome113/` |

The high-end profile was not re-run on the final code: the laptop crashed while the emulator ran beside browser tests, and the owner chose "light mode". Its earlier run passed every step; the later changes are covered by local tests.

### Steps (each with OS-level touch through adb)

Lens Lab: open (one canvas, no sideways scroll) · Trifocal · Near · Intermediate · Far · Night (closer view; page moved 0 px) · More settings open / close · Reset (URL cleared) · rotate to landscape · Near in landscape (0 px) · rotate back (state kept).
3D (Arabic): Start (one canvas, controls above the booking bar) · Start walkthrough → Pause shown · Pause · stage 5 · scrubber swipe · one-finger swipe scrolls the page · Explore 3D + drag rotates the eye, page still · Home → back to Chrome (context kept) · landscape with viewer open.
Navigation: in-site link → hardware Back (same reading position) · full navigation → hardware Back (same position; the BUG-P2-01 path).

### Observations

- Low memory: in one mid-range run Android discarded Chrome's background tab after Home; on return the page reloaded at the same address and the viewer started again. The script now accepts and records this.
- Load on the emulator (localhost, not hardware performance): LCP 390–624 ms home, 324–815 ms Lens Lab, CLS 0.
- 3D tap → active, including adb latency: 7.3–8.5 s high-end, 7.3–14.8 s mid-range (emulated CPU; not comparable to phones).
- Console: the manifest icon error on every page (BUG-P2-05) — fixed; 0 errors after.

## CLOUD REAL DEVICE — Pixel 8, Android 14, Chrome (production)

Passed; Arabic Pause wrapped (BUG-P2-03, fixed). See `CLOUD_DEVICE_TESTING.md`.

## NOT TESTED

Physical Android phone in hand; Samsung Internet; Android 10–12; real slow network on device (only lab throttling).
