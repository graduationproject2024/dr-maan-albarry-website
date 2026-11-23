# Android results

## Environment

- **Emulator:** Android Emulator on this laptop, Android 14, Chrome 113 (the image's own copy), WebGL through the host GPU (`-gpu host`).
- **High-end profile:** `phase2_highend` (Pixel-class).
- **Mid-range profile:** `phase2_midrange` (720×1600, configured for 2 GB of RAM; Chrome reports `deviceMemory` 4).
- **Input:** real OS-level input through adb: `input tap` and `input swipe`, rotation through `user_rotation`, and the hardware Back key. Page state is read over Chrome's DevTools socket.
- **Script:** `tests/devices/android-procedure-sims.mjs`.
- **Logs and screenshots:** `evidence/android/<run>/`.

**Not tested:**
- **Real Android phones.** No paid device cloud was authorised.
- **Pinch.** adb input has one pointer only. Pinch is covered in desktop Chromium with two simulated pointers, and on real devices it remains for card #29.

## Steps per simulator (all six)

1. Open the page and tap Start: ready, one canvas.
2. Tap Play, then Pause: time advances, then freezes.
3. Swipe sideways on the model: the model turns and the page does not scroll.
4. Tap Next: the stage advances.
5. Rotate to landscape: the same stage is kept, there is no horizontal overflow, and the model is visible.
6. Full screen, then close: full screen fills the screen, and close leaves no canvas.

At the end, the hardware Back key returns to the previous procedure page.

## Runs

| Run | Result | Notes |
|---|---|---|
| high-end | 37/37 | A 140 px swipe turned the model about 3.3 rad, which is far too sensitive. Logged as **BUG-SIM-03** and fixed. |
| high-end after fix (laser) | 7/7 | 140 px now turns the model 1.27 rad |
| mid-range, first run | **failed at rotation (lens-implants)** | The tab was restarted by Chrome (navigation type "reload"; the renderer process was replaced). Logged as **BUG-SIM-04**. |
| mid-range, second run (all six) | 37/37 | |
| mid-range repeats ×3 (IOL, laser, intravitreal) | 19/19 each | |

## BUG-SIM-04 status

Status: **mitigated, not proven fixed.**
- After the one restart, there were 94 consecutive passing steps on the same profile.
- Devices that report ≤ 2 GB now start at pixel ratio 1, which halves the canvas memory.
- This AVD reports 4 GB, so the mitigation was not exercised by these runs.
- It should be rechecked on a real low-memory phone.

**Verdict: PARTIAL.** Emulator only; no physical Android phone.
