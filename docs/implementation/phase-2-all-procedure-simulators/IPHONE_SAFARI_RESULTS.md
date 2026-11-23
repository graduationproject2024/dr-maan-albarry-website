# iPhone / Safari results

| Environment | Available? | Result |
|---|---|---|
| Xcode iOS Simulator | **No.** There is no Mac. | Not run |
| Real iPhone (device cloud) | Paid access was not authorised. The earlier BrowserStack checks were on **production**, and this branch is not deployed. | Not run |
| Playwright WebKit 27.2 (Windows build) with the iPhone 13 user agent and pixel ratio | Yes | `tests/surgical-sim-webkit.spec.js`: **6/6**. Every simulator reaches `ready` with WebGL, plays, pauses (time frozen), goes to the next stage, switches language without a new canvas, and closes with no canvas left. |

**What WebKit on Windows does not prove:**
- iOS Safari's memory limits;
- iOS touch and gesture behaviour;
- safe areas;
- Safari's WebGL quirks.

The design accounts for iPhone without proof on a device:
- full screen is CSS-only, with `env(safe-area-inset-*)` and `100dvh`, because iPhone has no element full-screen API;
- touch uses `touch-action: pan-y` or `none` with the explore mode.

**Verdict: PARTIAL.**

To finish this check after the owner deploys: open each procedure page on a real iPhone and run the six steps in `ANDROID_RESULTS.md`. That is card #29's existing plan (`IOS_SAFARI_TEST_SETUP.md`).
