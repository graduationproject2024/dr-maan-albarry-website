# Mobile interaction results

Real browser interactions through Playwright (taps, touches, scrolling, back and forward), on emulated devices: Chromium for all, WebKit for one iPhone journey. **No physical phone was used.** Journey logs and screenshots: `docs/implementation/premium-experience-reconstruction/evidence/journeys/` and `docs/implementation/clinical-visual-reconstruction/evidence/mobile/`; Lens Lab shots: `evidence/lens-lab/`.

## Device matrix covered by the suite

320×640, 360×800, 375×812, 390×844, 430×932, 768×1024, 1366×768, 1440×900, 1920×1080, plus landscape 844×390 and 667×375. Arabic RTL and English LTR, light and dark, touch, Slow and Fast 3G with CPU throttling, reduced motion, 125% and 150% text.

## Patient personas

| Persona in the brief | Where it is executed | Result on the final code |
|---|---|---|
| Older Arabic-speaking patient | `premium-journeys` E (320 and 360 px at 125% and 150% text), `persona-a`, `hero-portrait` | Pass. Portrait is first on the page and at least 190 px tall at every phone size; booking button on the first screen. |
| Patient comparing lens types | `lens-lab-mobile` acceptance test, `lens-lab-jump`, `premium-journeys` D, `persona-h`, `core-journeys` J03 | Pass. See the Lens Lab table below. |
| First-time visitor | `premium-journeys` A and B, `persona-b`, `core-journeys` J01, J02, J10 | Pass |
| Returning visitor | `returning-visitor` (18 tests), `core-journeys` J04 | Pass. Language and theme persist with a reset; bookmarks, Back, Forward and reload return to the same place; simulator choice persists and can be shared by URL. |
| Impatient mobile user | `premium-journeys` F, `journeys/stress`, `touch-gestures`, `cataract-stress`, `lens-lab-mobile` rapid changes | Pass. Rapid lens switching ends in a consistent state; 10 open and close cycles keep one WebGL context. |
| Slow-network user | `premium-journeys` G (Slow and Fast 3G, simulator failure and retry), `core-journeys` J05 and J08, `lens-lab-mobile` chunk failure and retry | Pass |

Premium journeys: 38 of 38. Core journeys: 13 of 13. Personas A to H: 8 of 8.

## Lens Lab on phones (the owner's main complaint)

Measured on the final build by the lead with real touches, after arriving through the "full vision simulator" link:

| Size, language | Page height | Picture (top–bottom) | Workbench (top–bottom) | Booking bar top | Page movement on lens / lighting / distance tap | WebGL contexts |
|---|---|---|---|---|---|---|
| 320×640 EN, dark | 6,152 px | 108–324 | 64–567 | 569 | 0 / 0 / 0 px | 1 |
| 360×800 AR | 5,749 px | 108–416 | 64–706 | 729 | 0 / 0 / 0 px | 1 |
| 390×844 AR | 5,683 px (was 13,062) | 118–453 | 74–743 | 773 | 0 / 0 / 0 px | 1 (was 2) |
| 430×932 EN | 5,796 px | 118–487 | 74–769 | 861 | 0 / 0 / 0 px | 1 |
| 844×390 EN, landscape | 4,613 px | 84–267 | 63–318 | 321 | 0 / 0 / 0 px | 1 |

The picture changed after every lens and lighting tap, and Reset returned the defaults and cleared the saved choice. `tests/lens-lab-jump.spec.js` asserts this at six sizes in both languages with a limit of 1 px of page movement per touch.

**The 10-step acceptance test** (`tests/lens-lab-mobile.spec.js`, 390×844, real taps): open Lens Lab; the notice and caption say what the picture is; choose another lens and the canvas pixels change while the canvas stays between header and booking bar; the same for distance and lighting; Reset; read the explanation; `scrollY` never has to change between taps. Pass.

## What the lead found and fixed during this check

- The link landed on the section title, which left the last control row under the booking bar (UX-04). Fixed: the jump lands on the workbench.
- On short landscape screens a focus margin nudged the page. Fixed.
- A 21 px page movement seen in an early version of the test came from the test tool scrolling its target, not from the site: with raw touches the page did not move. The test uses raw touches.

## Limits

- Emulation only: iOS Safari's handling of `dvh`, sticky positioning and safe areas was not checked on a device.
- Landscape at 390 px height fits with about 3 px to spare, so it depends on the header and booking bar keeping their heights.
- Near, Intermediate and Far move a frame and change the caption; the rendered image itself is the same, because the model draws all three distances at once (unchanged behaviour, see `CLINICAL_REVIEW_IMPACT.md`).
