# Anatomical image review (usability, not medical correctness)

## Method

`tests/audit-atlas.mjs` visits every place an atlas image appears — library cards (L1), the main figure on each procedure page (L2, default and "Show all labels"), and the close-ups behind "More detail" (L3) — on a phone (390×844, DPR 2) and a desktop (1440×900), in English and Arabic: 136 measurements of all 27 images. For each it records the rendered size, whether the file is sharp enough for the screen, visible pins, pin overlap, pins outside the frame, key entries and their text size, caption length, alt text and the pending-review note. Then each figure was looked at by eye on the phone (`evidence/after/atlas/contact-L2.jpg`, `contact-L3.jpg`, and one file per figure).

This is a usability review. It says nothing about whether the anatomy is right; that is Dr. Maan's decision (`CLINICAL_APPROVAL_QUEUE.md`).

## Findings and changes

| Check | Before | After |
|---|---|---|
| Images seen in page context | 27 / 27 | 27 / 27 |
| Failed to load / no alt text | 0 / 0 | 0 / 0 |
| File sharp enough for the screen | all (first audit reported 66 by mistake: it read the density-corrected width; corrected to the file's real width) | all |
| Pins overlapping | **4 figures** (keratoconus L2, injection L2 with all labels, injection L3 pars plana, keratoconus L3 cone) | **0** |
| Pins outside the frame | 0 | 0 |
| More than 4 default pins on L2 / 2 on L1 | 0 / 0 | 0 / 0 |
| Label key text | **13 px** | **15 px** |
| Pins | 20 px (phone), 24–28 px (desktop) | unchanged |
| Pending-review note on every figure | yes | yes |

Overlap fix: two pins closer than 7 % of the picture's width are drawn apart along the line between them, each by at most 1.3 % of the width (`spreadPins` in `main.js`). The anchors in the manifest — what the physician reviews — are unchanged, and the pins still sit on their structures.

## Visual observations (by eye, for the review)

- **Recognizability and focal point:** each L2 figure has one clear subject (cloudy lens, implant, flap, ICL, cone, graft, needle and macula). L3 close-ups are denser by design and stay behind "More detail".
- **Hierarchy:** default keys have 3–4 entries; "Show all labels" holds the rest.
- **Captions:** L2 captions are 428–478 characters (English) including the key. Readable on a phone, but long for a card; no change was made because the caption text is clinical wording pending review.
- **Points for the review** (not changed): the cataract L2 pin 6 sits in the faded edge; the ICL and keratoconus heroes are drawn anterior-up while the close-ups are anterior-left; the CXL close-up is schematic; the corneal graft is shown full-thickness only. These are already questions in the manifest.

No image was simplified or re-rendered in this milestone, so no new re-approval is needed for the pictures themselves. The 13 images changed earlier still need re-approval.
