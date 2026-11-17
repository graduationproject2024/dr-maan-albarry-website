# Real-device test plan

**Status: NOT RUN.** No physical phone was available to this work. Every mobile result in this folder is browser emulation (Chromium with touch, and WebKit). Emulation does not reproduce iOS Safari's toolbar behaviour, real GPU limits, thermal throttling or real networks.

## Devices

| Platform | Minimum | Browser |
|---|---|---|
| iOS | An iPhone from the last 4 years (e.g. iPhone 12–15), current iOS | Safari |
| Android | A mid-range phone (e.g. Samsung A-series or Pixel a-series), current Android | Chrome |

Record for each run: device model, OS version, browser version, network (Wi-Fi / 4G / throttled), date, tester.

## Checklist (run in Arabic and English, portrait and landscape)

| # | Area | Steps | Pass when |
|---|---|---|---|
| 1 | Home | Open the site; read the hero | Doctor's photo, name and Book button on the first screen; nothing clipped |
| 2 | Booking | Tap Book, Call, WhatsApp (do not complete a booking or send a message) | Each opens the right app/page; the booking bar never covers content you need |
| 3 | Browser chrome | Scroll down and up so Safari's bars collapse and expand | Header and booking bar stay correct; no jump, no gap |
| 4 | Safe area | Landscape on a notched iPhone | No control under the notch or the home indicator |
| 5 | Lens Lab | Run the 15 steps in `LENS_LAB_FINAL_REFINEMENT.md` | Picture and controls stay together; no scroll between steps; Whole scene and Reset work |
| 6 | Lens Lab sideways | Turn the phone sideways at step 5 | Controls reachable; picture visible; nothing under the bars |
| 7 | 3D viewer | Cataract page → Start 3D; play, pause, scrub, next/previous, explore, pinch | Smooth; scrubber never triggers Call; one-finger swipe scrolls the page outside explore mode |
| 8 | 3D cleanup | Open and close the viewer 5 times; switch apps and return | No crash, no "context lost" message that stays |
| 9 | Slow network | Android Chrome, 3G or throttled | Text appears first; loading messages are clear; Retry works after airplane mode on/off |
| 10 | Text size | System text size at largest | No sideways scroll; buttons readable |
| 11 | Back / Forward | Read deep on a page → open another → Back | Same reading position |
| 12 | Unknown address | Type a wrong address under the site | The site's not-found page with links back |

Report defects with screenshots or screen recordings; add them to `REMAINING_DEFECTS.md` and Trello.
