# Mobile patient journeys (automated personas)

These are scripted browser journeys, **not research with real patients**, and **not real devices**: Chromium with touch emulation (and WebKit for one journey) on Windows with the local GPU. Each journey asserts expected behaviour per step; the logs record action, expected, actual and evidence.

All results are from the full suite on the final code (`REGRESSION_RESULTS.md`): every journey below passed.

| Persona (brief §12) | Device(s), language, theme | Covered by | What is checked | Result |
|---|---|---|---|---|
| A — older Arabic-speaking patient | 320×640 and 360×740 at 125 % and 150 % text; AR; light | `journeys/premium-journeys.spec.js` (E × 4), `persona-a.spec.js`, `hero-portrait.spec.js` | Readable text, no sideways scroll, finds cataract treatment, recognises the doctor first, booking visible | Pass |
| B — lens comparison patient | 320×640 → 844×390 (7 sizes); EN, plus AR at 390×844 | `lens-lab-distance.spec.js` (15-step flow + Arabic), `lens-lab-mobile.spec.js` | Lens, distance (closer view), lighting, lens line, limits, reset, return to site; page never moves; one WebGL context | Pass; action logs in `evidence/lens-lab/` |
| C — impatient user | 390×844; AR/EN; light/dark | `persona-c.spec.js`, `lens-lab-mobile` "rapid repeated changes", `journeys/stress.spec.js`, `cataract-stress.spec.js` | Rapid taps, repeated 3D open/close, fast lens changes, theme and language switches, Back/Forward | Pass |
| D — returning patient | 390×844 and desktop; AR/EN | `returning-visitor.spec.js`, `lens-lab-mobile` "returning visitors" | Saved non-sensitive preferences, deep links, Lens Lab choice and URL, reading position (incl. the new desktop case), preference reset | Pass |
| E — slow network | 390×844; Fast 3G and Slow 3G with CPU throttling | `persona-e.spec.js`, `lens-lab-mobile` "failure and recovery", `cataract-warmup.spec.js`, `returning-visitor` "leaving during loading" | Delayed images and modules, loading states, failure message and Retry, leaving during loading and coming back | Pass |
| F — accessibility user | Desktop and phone; AR/EN | `persona-f.spec.js`, `journeys/axe.spec.js`, `vision-sim` keyboard, `lens-lab-distance` reduced motion | Keyboard order and access, accessible names, reduced motion, enlarged text, non-3D alternatives | Pass |

## New in this milestone

- 15-step Lens Lab flow at 7 sizes with real touches; each step checks that the touched control was already on screen and records which element received the touch (`receivedBy`).
- Short landscape (568×320, 667×331, 844×340) at 100/125/150 % text: every one of the 11 essential options can be brought between the bars and the touch reaches it.

## Bugs found in journeys this milestone

BUG-FS-01 (Back position, persona D on desktop) and BUG-FS-02 (short landscape, persona B) — fixed and retested; see `BUG_FIX_VERIFICATION.md`.
