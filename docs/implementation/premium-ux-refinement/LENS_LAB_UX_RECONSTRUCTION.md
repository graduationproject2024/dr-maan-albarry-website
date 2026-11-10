# Lens Lab: mobile interaction reconstruction

Status: built on the worktree branch, not merged or deployed. Medical status: pending physician review. Testing was done in browser emulation only (Playwright, Chromium with the local GPU); no real phone was used.

## The problem, measured on the code before this work (ea3e44d)

The owner reported that on a phone you scroll down to change a lens setting and scroll back up to see the result.

| Measure at 390x844, Arabic | Before |
|---|---|
| Page height | 13,062 px (14,919 at 320 px, 14,470 in English at 390 px) |
| Where the simulator started | 9,152 px down the page |
| Viewer height | 298 px |
| Gap from the picture to the lens choices | 94 px |
| Gap from the picture to the distance presets | 276 px |
| Picture plus essential controls, top to bottom | 748 px, with 708 px available between header and booking bar |
| WebGL contexts once both simulators were reached | 2 |

At 320x640 the same span was 761 px against 504 px available. Evidence: `evidence/lens-lab/before-*.jpg`.

## What was built

**Page order at every width:** page hero, then the Vision Simulator workbench (`#simulator`), then the Lens Lab reference (`#lab`). The section lede that repeated the hero is gone.

**One workbench, one wrapper** (`.vsim-bench`, same markup at every width):

- The educational notice, attached to the top of the picture and part of the sticky element, so it is always with the picture.
- The viewer, with a caption over it (distance, object, lighting) and the lens tag.
- Near / Intermediate / Far, attached directly under the viewer.
- Three lens types (Monofocal, Extended range with EDOF under it, Trifocal). The other three lens types are in More settings, as the same native radio group; when one is chosen, its name shows on the More settings button.
- Lighting: Day / Dim / Night.
- More settings and Reset.
- Simple mode is the default. More settings holds the other lens types, everyday situations, the compare switch and second lens, the exact distance slider, astigmatism, axis, sphere and the model numbers.

**Below the workbench:** what the picture shows, one plain paragraph for the chosen lens (composed from the existing `LENS_INFO` wording), and the sentence about examination and measurements. Clarity bars, limits, questions and the method are expandable.

**Fitting the screen.** The real heights of the notice, presets and controls are measured with a ResizeObserver. The viewer takes what is left between the measured header and booking bar, with a minimum (30 % of the screen or 220 px, whichever is smaller) and a cap (46 % of the screen, and the 7:6 frame the scene needs). Heights use `dvh` with a `vh` fallback, and the booking bar height includes `env(safe-area-inset-bottom)`.

**Sticky only when needed.** If everything fits there is nothing to stick. With More settings open, or when the controls do not fit (for example 150 % text), the viewer becomes `position: sticky` inside the workbench only, so it lets go when the workbench ends. When the header returns on scroll up, the sticky top moves with it through `:has(.site-header.is-hidden)`; a browser without `:has` keeps the header offset permanently, which is safe but leaves a gap.

**Landscape and desktop:** two columns, with the picture and distance row on one side and the controls on the other.

**No page jump.** A tap focuses the radio, and the root's `scroll-padding-top` could then scroll the page. Scroll margins were tuned so a tap does not move the page, and keyboard focus still stays clear of the bars and the stuck picture.

**Lens Lab reference on phones and tablets** (`simulator: 'auto'`, below 1024 px): no embedded simulator, so one WebGL context; "compare two" and the limits fold behind their titles; each lens card folds its advantages, limits and questions. The limits link opens its fold. Desktop keeps the embedded compare, loaded lazily.

**Returning visitors:** one localStorage key, `lens-lab-choice`, holding `{lens, dist, light}` and nothing else. `?lens=edof&dist=near&light=night` is checked against known values, invalid values are ignored, and the URL beats storage. `history.replaceState` is used, so a control never adds a history entry. A language switch writes the query back and Back restores that entry's view. Reset clears the key and the query. Only the three Simple lens types are stored; the URL accepts all six.

**Loading and failure.** A loading state shows in the viewer while the picture code downloads, and the controls already respond. A failed simulator chunk shows the existing message and retry. A failed picture-code chunk now also offers a retry instead of a dead end.

## One thing the owner should know

**Choosing Near, Intermediate or Far does not change the rendered image.** The model always draws all three objects at their own distances at once, and at the preset distances it computes the identical image; this was already so before this work and optics were not to be touched. Tapping a preset used to give no visible response in the picture.

I added a white frame around the object being looked at (phone, laptop or road sign), and the caption changes. The frame is a page element over the canvas: it does not reach the WebGL buffer, the review screenshots or the model. The tests therefore compare what is on screen, frame included. For lens and lighting changes the WebGL pixels themselves change. If the owner wants the image itself to respond, for example zooming to the object, that is a change to the simulation and needs the physician's view.

## Result, measured after (production build, Lens Lab mounted, disclosures closed)

"Span" is from the top of the notice to the bottom of More settings and Reset, or to the distance row in landscape if that is lower.

| Size | Page height AR / EN | Viewer | Span | Available | Fits on one screen |
|---|---|---|---|---|---|
| 320x640 | 6,057 / 6,558 | 320x230 (AR), 320x216 (EN) | 497 | 504 | Yes |
| 360x800 | 5,752 / 6,258 | 360x309 | 635 / 625 | 664 | Yes |
| 375x812 | 5,605 / 6,171 | 375x321 | 647 / 638 | 676 | Yes |
| 390x844 | 5,547 / 6,048 | 390x334 | 660 / 651 | 708 | Yes |
| 430x932 | 5,381 / 5,699 | 430x369 | 678 / 687 | 796 | Yes |
| 844x390 | 4,637 / 4,820 | 491x183 | 255 | 256 | Yes, side by side |
| 667x375 | 4,699 / 4,990 | 385x168 (AR), 385x152 (EN) | 240 | 241 | Yes, side by side |

The picture and the distance row are attached (gap 0). At 390 px in Arabic the page went from 13,062 to 5,547 px. On phones there is one WebGL context. Evidence: `evidence/lens-lab/after-*.jpg`, including More settings scrolled with the viewer pinned.

Landscape fits with 1 px to spare, so it depends on the bars keeping their current height.

150 % text was tested at 320x640, 390x844 and 844x390. Where the controls no longer fit, the viewer sticks. The picture stays under 60 % of the screen in portrait and under 75 % in landscape, nothing overflows sideways, every target stays at least 44 px, and each essential control can be reached and used with the picture still on screen.

## Files changed

- `src/vision-sim/ui.js`, `index.js`, `styles.css`, `i18n.js`
- `src/lens-lab/index.js`, `styles.css`
- `main.js`: `renderSimulator`, `renderLensLabPage`, the vision-sim mount code, and one option on the Lens Lab mount
- `style.css`: simulator and Lens Lab rules only
- `tests/lens-lab-mobile.spec.js` (new, 57 tests), `tests/capture-lens-lab-mobile.mjs` (new, evidence tool)

`src/vision-sim/optics/` and `VISION_MODEL_VERSION` were not changed. `canAdoptPrerender`, `adoptPrerender`, `finishFirstLoad` and `html.first-load` were not changed.

## Tests

All runs were against one production build (`npm run build` with `CSIM_HARNESS=1`) using `PW_REUSE=1` on port 4681, because the Playwright web server's 120-second start limit is shorter than the build takes on this loaded machine.

Run on the final build, 4 workers, 18 spec files (`lens-lab-mobile`, `vision-sim`, `vision-review`, `cataract-review`, `lens-lab`, `journey-regressions`, `phase1-pages`, `phase1-mobile`, `phase0-content`, `first-render`, `closure`, `premium-regressions`, and journeys `persona-h`, `core-journeys`, `premium-journeys`, `touch-gestures`, `stress`, `axe`):

- 424 passed, 14 failed. Twelve of the 14 were 60-second timeouts while other agents loaded the machine; one was a premium touch journey; one was the stress journey.
- The 14 rerun with 2 workers: 13 passed.
- The remaining one, the stress journey, failed because of a test assumption (see below). The test was corrected and rerun: see the final report for its result.

Not run: `webkit`, `perf`, `premium-perf` (their tests that touch these controls were updated to open More settings first), and the rest of the full suite.

### Existing tests changed

| Test | Change | Why |
|---|---|---|
| `vision-sim`: controls, comparison, rapid switching, multifocal, keyboard, mobile, 320 px | Open More settings first; "Distance" to "Far", "Dusk" to "Dim" | Controls moved; labels the owner asked for |
| `vision-sim`: everyday situations | Now checks that technical controls are hidden before More settings is opened, the new reading order, controls beside the picture on desktop, explanation below the workbench | The old test asserted the previous layout order |
| `journey-regressions` VS-RTL, BUG-16 | Open the clarity section and More settings; BUG-16 checks the clarity summary instead of the removed title | Moved into disclosures |
| `persona-h`, `core-journeys`, `touch-gestures`, `webkit`, `perf`, `phase0-content`, `phase1-mobile` | Open More settings or clarity first | Moved |
| `stress` | Opens More settings; each tap uses Playwright's `tap()` instead of raw coordinates | Five lens types are now in two groups with the sticky picture between them, so raw coordinates could land on the picture. 30 taps and the assertion are unchanged, but the taps are slower |
| `premium-journeys`, `premium-regressions` | Scroll to the Lens Lab before waiting for it; open the compare fold on phones | It is now lazy and below the simulator, and folded on phones |

No assertion was dropped. The two that described the old layout (the top-to-bottom order in `vision-sim`, and the removed meters title in BUG-16) were replaced by equivalents for the new layout, as listed above.

## Patient-facing wording that needs physician review

New labels:

- More settings / إعدادات إضافية
- Reset / إعادة الضبط
- Other lens types / أنواع أخرى من العدسات
- Extended range (English label for EDOF; the Arabic ممتدة المدى already existed)
- Dim / خافتة, replacing Dusk / غروب for the same model condition
- Far, replacing Distance in English
- Loading the picture… , Loading the simulator… / جارٍ تحميل المحاكي… , Try again

Reused wording in a new place, worth a look:

- The lens paragraph joins the existing "intended" and "trade-offs" texts for each lens, without their labels.
- "The lens type is chosen after examination, measurements and a conversation about your priorities." moved from the page into the result (existing text).

No new medical claim was written.

## Limits

- Browser emulation only. iOS Safari behaviour of `dvh`, sticky and safe areas was not tested on a device.
- The WebKit journey was not run.
- The target frame finds its object by its position in the scene's list in `scenes.js`; if that file changes order the frame would be misplaced (the tests would catch it).
- The hero is still about 575 px tall on phones, so a visitor scrolls once to reach the workbench. The hero is owned by other work.
