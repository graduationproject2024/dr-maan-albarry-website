# Cloud real-device testing (CLOUD REAL DEVICE)

Provider: BrowserStack through the connected MCP account, Free plan, no purchase. Target: production (`9e1773f`).

| Device | OS | Browser | Session | Result |
|---|---|---|---|---|
| iPhone 15 | iOS 26.6 | Safari | `5a5de0497c…` | Passed with findings |
| Google Pixel 8 | Android 14 | Chrome | `6c22a2e2be…` | Passed with finding |

## iPhone 15 (Safari)

Home (Arabic) rendered with portrait and booking bar · Lens Lab (English): Near gave the closer view and the "view only moved" note; Trifocal + Far + Night correct with disclaimer · 3D page: Start → viewer loaded, WebGL fine, stage 4 jump moved the scrubber.

Findings: stage button 7 cut off (BUG-P2-02); Back to a page left by a full navigation landed at the top (BUG-P2-01); after Start the viewer was below the screen (BUG-P2-04 — withdrawn: the screenshot was taken while loading; the viewer scrolls in when ready).

## Pixel 8 (Chrome)

Lens Lab (Arabic): EDOF + Intermediate correct, RTL captions · 3D: loaded and scrolled into view, Play ran with light rays · Back restored the position (891 px) and the settings.

Finding: Arabic "Pause" label wrapped onto two lines (BUG-P2-03).

## Limits of the connector

Only page-level commands (navigate, find, click, scroll, screenshot). No pinch, no drag, no script execution, no rotation, no performance numbers. Those were covered on the Android Emulator.

Evidence: `evidence/real-device-cloud/iphone15-ios26.6-safari/` (10), `evidence/real-device-cloud/pixel8-android14-chrome/` (3).
