# UX problem register

Every entry was reproduced in a real browser session (Chromium through Playwright, emulated devices). Severity: P1 blocks a main task, P2 makes it hard, P3 is friction, P4 is minor. Engineering defects found by the technical review have their full records (steps, root cause, fix, regression test) in `TECHNICAL_FIXES.md` as D1 to D7.

| ID | Sev | Page | Device, language, theme | Problem (actual) | Expected | Root cause | Fix | Regression test | Status |
|---|---|---|---|---|---|---|---|---|---|
| UX-01 | P2 | Home | All widths, AR/EN, both themes | The portrait was a small card (174×133 at 390 px, 230×175 on desktop) overlapping a much larger anatomy image | The doctor is the first, most recognizable element | Hero composed around the plate | Portrait leads; plate is a small supporting figure, hidden on phones | `tests/hero-portrait.spec.js` | Fixed |
| UX-02 | P1 | `/lens-lab/` | Phones 320–430, AR/EN | Controls and picture spanned 748 px with 708 px available; settings were changed below the picture and the result was above; page 13,062 px tall | Picture and essential controls visible together | Controls listed below a tall viewer; a second simulator far down the page | One workbench: picture, distance, lens, lighting, More settings, Reset; page 5,683 px | `tests/lens-lab-mobile.spec.js` (57), `tests/lens-lab-jump.spec.js` (13) | Fixed |
| UX-03 | P2 | `/lens-lab/` | Phones | Two WebGL contexts and two simulators on one page | One | Lens Lab embedded its own compare view | No embedded simulator below 1024 px | `tests/lens-lab-mobile.spec.js` | Fixed |
| UX-04 | P2 | `/lens-lab/` | Phones and landscape | The "full vision simulator" link landed on the section title, leaving the last control row under the booking bar | Workbench fully between header and bar | Jump target was the section | Jump lands on the workbench on phones | `tests/lens-lab-jump.spec.js` | Fixed |
| UX-05 | P2 | Procedure pages | Phones, AR/EN | Up to 9 pins at once, medical terms only | Few essential labels first, plain words, more on request | All labels shown by default | At most 4 labels by default, "Show all labels", close-ups behind "More detail", patient-friendly term followed by the medical term | `tests/plates-clarity.spec.js` (46) | Fixed; wording pending physician review |
| UX-06 | P2 | 13 atlas images | All | Confusing compositions (for example the injection image hid the medicine; the lens-implant ring dominated) | One clear concept per image | Camera and material choices | 13 images re-rendered as r2 | `tests/plates-clarity.spec.js`, visual inspection | Fixed; all pending re-approval |
| UX-07 | P2 | 3D cataract viewer | Phones up to about 667 px tall | After Start the timeline sat under the booking bar; a tap reached "Call" | Controls clear of the bar | Scroll ignored the fixed bar | `revealViewer()` | `tests/technical-fixes.spec.js` (D1) | Fixed |
| UX-08 | P2 | `/lens-lab/` | All | A jump or bookmark lost its section when a module arrived late | Target stays in place | Target computed once | `holdScrollTarget()` | `tests/technical-fixes.spec.js` (D2) | Fixed |
| UX-09 | P3 | All | All | No way to reset a saved language or theme | A clear reset | Not built | Footer "Reset language and theme", shown only when a choice is saved | `tests/returning-visitor.spec.js` (D3) | Fixed |
| UX-10 | P3 | All | All | Forward, reload and returning from another site lost the reading position | Same place | Position saved only on link clicks | Position kept on the history entry | `tests/returning-visitor.spec.js` (D4) | Fixed |
| UX-11 | P4 | `/education/` | All | Switching language discarded questionnaire answers | Progress kept | Answers reset on toggle | Reset removed | `tests/returning-visitor.spec.js` (D5) | Fixed |
| UX-12 | P3 | 3D viewer, vision simulator | Slow connections | Leaving during a download could leave no working viewer, or leak a WebGL context | One working viewer | Load used a global host after `await` | Each load owns its host | `tests/returning-visitor.spec.js` (D6, D7) | Fixed |
| UX-13 | P3 | Home | Phones, slow network | After the hero change the portrait became the LCP element and painted about 0.3 s after the text | Photo with the first paint | Image competed with fonts for bandwidth | Portrait preloaded on home pages | `PERFORMANCE_RESULTS.md` | Fixed |

## Open, not engineering defects

| Item | Blocked on |
|---|---|
| The portrait is displayed at about twice its source pixels and is soft | A new high-resolution photograph from the owner |
| Near, Intermediate and Far do not change the rendered image itself (the model draws all three distances at once); a frame marks the object instead | Owner and physician decision; the optical model was not to be changed |
| 13 re-rendered images, 35 new patient-friendly terms, changed captions, the choice of essential labels | Physician review |
| Lens Lab reference still reserves less height than it needs on desktop, so the page grows when it arrives (jumps are safe) | Low priority engineering follow-up |
