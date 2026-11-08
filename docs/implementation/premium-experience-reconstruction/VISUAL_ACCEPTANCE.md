# Visual acceptance — four review passes

**Owner acceptance: pending.** Nothing here is owner or physician acceptance. Every anatomical image and simulator stage remains pending physician review.

Method: real screenshots of the production build, read by eye, at 320, 360, 390, 430, 768 and 1440 px, Arabic and English, light and dark, compared with the Direction A renders in `directions/a/shots/` and `DESIGN_DIRECTION_SELECTION.md`. Findings are grouped by pass with what was changed. Screenshots: `evidence/journeys/` and `evidence/after/`. Browser emulation only.

## Pass 1 — Information architecture

Question: are patients guided, are all seven procedures discoverable, is it concise?

| Finding | Severity | Change |
|---|---|---|
| All seven procedures are reachable from the home gallery (PL.01–07 with image and summary), `/procedures/`, the menu sheet and the footer | Good | None |
| The four pathway tiles and the first-screen booking action give a clear start | Good | None |
| Phone homepage was long: 9,846 px (Arabic), 10,614 px (English) at 390 | Owner decision 2026-11-08 ("Trim, new limit") | Trimmed to 9,153 / 9,943 px with nothing hidden: chapter rhythm, credentials rows, guides, FAQ, clinic, footer |
| Lens Lab at 390 px remains very long (Arabic ~13,000 px) | Open, not a defect | Not changed; a shorter phone layout would be a design decision |
| Menu sheet showed two close buttons | P3 (BUG-27) | One close control |

## Pass 2 — Typography and composition

Question: cohesive, Arabic as polished as English, intentional spacing?

| Finding | Severity | Change |
|---|---|---|
| The hero, chapter heads and ledgers match Direction A (Naskh in Arabic, Newsreader in English, ivory and ink) | Good | None |
| Narrow phones: plate caption wrapped to three lines beside the image and pushed the name down | P3 | The caption runs under both images on phones up to 400 px |
| Footer on phones: a long one-column list, and contact links with awkward breaks | P3 | Link groups flow across the width; the number stays on one line |
| Separator dots starting a line on `/surgical-education/` | P3 | Non-breaking separators |
| Arabic and English spacing and type scale match across chapters | Good | None |
| Booking bar label spills at 150% text (BUG-23); footer overflow at 150% (BUG-22) | P2 | Fixed |

## Pass 3 — Anatomical images and interactive experiences

Question: educational value, close-ups composed well, simulator surroundings match the design, review modes work?

| Finding | Severity | Change |
|---|---|---|
| Plate hierarchy is clear: L2 hero, L3 close-ups, pinned key below | Good | None |
| Numbered pins overlapped at phone size, hiding numbers (keratoconus and others) | P2 (BUG-25) | Smaller pins on phones and minimal separation; anchors unchanged |
| Flat bottom cut on the dark plate | P3 (BUG-24) | Short image fade in the dark theme |
| The 3D section heading was repeated right above the viewer on phones | P3 (BUG-28) | Hidden visually while the viewer runs; kept for screen readers |
| Simulator chrome (buttons, chips, cards) uses the same ivory-and-ink tokens as the site in light and dark | Good | None |
| Cataract pin 6 sits in the plate's faded edge | Physician review | Recorded in `IMAGE_ART_DIRECTION.md` |
| Review modes: `cataract-sim-preview.html?review=1` and `vision-sim-preview.html?review=1` load with no console errors at 1280 and 390 px; the review behaviour is covered by `cataract-review` and `vision-review` specs | Checked | None |
| Plate labels and anatomy text are not physician-reviewed | Blocked (clinical) | Status shown on every plate |

## Pass 4 — Mobile and final polish

Question: touch, scrolling, booking.

| Finding | Severity | Change |
|---|---|---|
| Tap targets at least 44 px on home and the cataract page (inline text links excepted) | Good after fix | Footer links keep 44 px rows and a 44 px minimum width in the new flow layout |
| The header stayed on screen after any tap on a header button | P3 (BUG-19) | Only keyboard focus keeps it shown |
| Scrollspy lagged at section boundaries and the phone list did not show the current section | P3 (BUG-20, BUG-21) | Fixed |
| Menu sheet, FAQ, plate tap targets, Back position restored after a procedure | Good | None |
| Booking bar never covers the last footer content; labels fit at 320 px and 150% text after the fix | Good after fix | Booking column keeps its label width |
| Hero booking button on the first screen at 360×800 and 390×844 (test in `phase1-mobile.spec.js`) | Fixed in this pass | Narrow-phone hero spacing |
| Large text (125%, 150%) at 320 and 360 px: no sideways scroll, nothing clipped | Good after fix | BUG-22 and BUG-23 |

## Remaining for the owner and physician

- Owner acceptance of the visual design: pending.
- Physician review of all plates, pins, captions and simulators: pending.
- High-resolution portrait: open.
