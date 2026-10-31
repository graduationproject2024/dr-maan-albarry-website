# Phase 1 Changelog — Booking & Mobile UX

## Root causes
| Symptom | Root cause | Fix |
|---|---|---|
| Sticky-bar actions off-screen at 360/390px | 4 buttons in a `flex` row, each `.btn` with `white-space: nowrap` and 1.6rem padding, plus the phone number as a label | 3-column CSS grid (`1.35fr 1fr 1fr`, `minmax(0, …)`), dedicated `.booking-action` component, short labels; icon over label at ≤440px so words never break |
| Clinic / hero CTA text wider than button | Global `.btn { white-space: nowrap }` | `.btn-arrow-fill` labels wrap (`white-space: normal`, `text-wrap: balance`, `min-width: 0`); tighter inline padding ≤600px |
| CTA far down on phones | Portrait (380px) rendered before CTA | ≤1024px: `.hero-content` becomes a flex column with `order`: name → specialty → CTA → portrait (300px) → facts → quote → social. DOM and desktop order unchanged. |
| Simulator tags overlapping | Tags auto-width at top corners of a 290px view | ≤600px: tags capped at `50% − 22px` and allowed to wrap; view bleeds to the card edges (290 → 310px at 360, 340px at 390). The 16:9 frame is kept because the renderer's output and the slider mapping depend on it. |

## Sticky booking bar (`renderBookingBar`, `.booking-bar*`, `.booking-action*`)
- Actions: **Book** (portal), **Call** (`tel:920018000`), **WhatsApp** (Magrabi line). **Maps** stays available in the clinic section (map pane + directions button), the CTA banner and the footer.
- `<nav aria-label>`, accessible names with the dialled number, ≥48px targets (52px stacked), focus ring inherited from `a:focus-visible`.
- Safe-area insets (`env(safe-area-inset-*)`); body bottom padding = bar height + inset, so the footer is never covered (tested).
- WhatsApp green `#15803d` (white text 5.0:1, WCAG AA). Call action uses gold on dark in dark theme.
- Duplicate WhatsApp button hidden in the hero ≤768px; the bar provides it.

## Hero
- Facts strip (`.hero-facts`): 3-column grid with logical borders, numbers wrapped in `<bdi>`. This fixes the old "15,000+" mixed-direction rendering.
- Mobile portrait 380 → 300px tall; CTA now on the first screen at 360×800 and 390×844 (tested).

## Clinic
- Booking CTA and WhatsApp buttons full width ≤768px; booking label wraps over two lines at 360px (171px label in a 246px button, was 273px in 246px).
- Contact numbers rendered as `<bdi dir="ltr">` links.

## Content density
- Page height at 390 AR: 24,998 → 22,648px (−9.4%). Removed the duplicated bio paragraph and hidden testimonials; smaller mobile portrait. Medically relevant content was not cut. Further progressive disclosure (career timeline, technology grid) is noted for a later pass.

## Robustness
- `headerScrollShadow()` registered a new window scroll listener on every language switch. It is now guarded (regression test asserts active listeners don't grow).
