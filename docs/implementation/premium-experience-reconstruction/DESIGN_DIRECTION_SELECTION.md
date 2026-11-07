# Design direction selection

Date: 2026-11-07.

**Chosen direction: "A — Premium Medical Editorial", with B's labelled anatomical plates as its image system.** The owner chose it in the session on 2026-11-07 from the three rendered directions (option "A + B plates").

## Evidence reviewed
- Hero comparison (desktop AR light and dark, mobile AR, desktop EN): [`directions/comparison-hero.jpg`](directions/comparison-hero.jpg)
- Procedure gallery comparison (desktop 1440, mobile 390): [`directions/comparison-gallery.jpg`](directions/comparison-gallery.jpg)
- Full write-up, 11 screenshots per direction, and scores: [`THREE_DESIGN_DIRECTIONS.md`](THREE_DESIGN_DIRECTIONS.md)

## Lead review of the renders
| | What works | What does not |
|---|---|---|
| A | The calmest and most premium typography (Naskh headings in a confident size; Newsreader for English). Ivory paper, numbered chapters and a credentials ledger. Clearly not a template. | The hero has a lot of empty space. The low-resolution portrait (295×225) is shown large and looks soft. On phones it is the weakest of the three, scoring 3/5. Its procedure rows use small images, so anatomy is not the hero. |
| B | Anatomy is the storytelling device, as brief §8 asks. Labelled plates, a 7-image index under the hero, and a close-up "magnifier". It fits the simulators best. | The doctor is reduced to a small signature (identity 2/5). The Kufi display face is less refined than A's Naskh. |
| C | The best phone experience: a bottom booking bar and a service finder near the top. | It looks closest to a generic template (distinctiveness 2/5), which is what the owner rejected before. |

## How the two are combined into one system
This is not a mix of parts from three kits. **A is the system**: one set of tokens for colour, type, spacing, radius and motion. B contributes only its **way of presenting images** (labelled plates, plate numbers, and the close-up crop), redrawn in A's tokens. Nothing from C's visual style is used. Two functional patterns that every phone booking flow needs are kept, a sticky booking bar and a full-height menu sheet, and both are drawn in A's style.

| Element | Source | Rule |
|---|---|---|
| Typography | A | Noto Naskh Arabic for display, IBM Plex Sans Arabic for body; Newsreader for English display, IBM Plex Sans for English body. Self-hosted in the build. |
| Colour and surfaces | A | Ivory paper with ink, plus one accent. The dark theme follows A's dark render. |
| Hero | A, reworked | Portrait-led, but the portrait is shown at or below the size it can hold sharply (it was enlarged 1.36× before). The emptiness is fixed by pairing it with an L1 anatomical plate, and the credentials ledger sits in the first screen. |
| Procedure gallery | B plates in A's tokens | All 7 procedures shown as labelled plates (PL.01–07) on the homepage and in `/procedures/`. On phones every plate stays visible, with no hidden summaries. |
| Procedure page hero | B | A large L2 plate with HTML labels, plus an L3 close-up "magnifier" with a caption. |
| Chapters and section rhythm | A + research | Numbered chapters; at most two full-bleed image chapters on the homepage, following the Madinah Cultivator rhythm. |
| Mobile booking | Functional pattern in A's style | Sticky bar (book, call, WhatsApp); menu as a full sheet. |

## Risks accepted
- **Portrait:** the hero still depends on a 295×225 source. Asking the owner for a high-resolution original is the single most valuable fix (open item).
- **Label positions:** they must come from the render's projected 3D anchors, not be placed by eye. Every plate remains *Pending physician review*.
