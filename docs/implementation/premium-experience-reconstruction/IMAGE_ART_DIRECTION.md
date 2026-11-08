# Image art direction

This page summarises how the anatomical images are made and how the site uses them. The source of truth for each image is `public/images/procedures/manifest.json`; the full library record is `ANATOMICAL_VISUAL_LIBRARY.md`.

**Medical status: every plate, close-up, caption and pin label is pending physician review.** No physician has reviewed the library. Nothing on this page is a clinical approval.

## Image levels

| Level | Use | Shape | Size on the site |
|---|---|---|---|
| L1 | Card preview in the procedure gallery and "Related procedures" | 4:5 (cropped square on desktop index plates) | Thumbnail on phones (92 px), plate on desktop |
| L2 | Procedure-page hero plate and the home hero porthole | 16:9, room for HTML text on one side | Full width of the content column |
| L3 | Close-up "magnifier" of the structures the procedure acts on | 4:3, full bleed | Beside the anatomy text (Fig. 2 and Fig. 3) |
| L4 | Interactive | The existing cataract 3D simulator only | On the cataract page and `/surgical-education/` |

## Lighting

All images share one camera-space light rig: a warm key from the upper left, a cool fill from the right, a rim light from behind, a warm-grey hemisphere, and a procedural room environment for reflections. Tone mapping is neutral at exposure 1.0, sRGB output. There is no bloom. Glows are limited to the illustrative laser beam, the medication bolus and the UV field.

## Materials and palette

- Tissue is matte (roughness 0.55–0.8), so nothing looks plastic. Only the cornea, the lens implants and the capsule are glossy and translucent.
- Cut faces are painted sections, re-rendered for each frame, so close-ups are real renders and not upscaled crops.
- The vitreous is a translucent gel.
- Palette: ivory sclera, pale blue-grey cornea, warm brown iris, maroon ciliary body and choroid, coral retina, cream lens with an amber nucleus. Accents: teal for implants and donor tissue, violet for invisible light and cross-links, yellow for riboflavin. Colours of invisible light and medication are illustrative, and the captions say so.

## Camera and framing

| Camera | Rule | Used for |
|---|---|---|
| Sagittal cut-away | Square to a meridional cut, anterior to the left, long lens (fov 12–14°) | Lens and capsule, IOL in the bag, ICL vault, pars plana entry, cone and graft sections |
| Frontal | Along the visual axis, up to 25° off-axis | Transplant hero and card, IOL card |
| 3/4 oblique | 35–65° off-axis, raised 15–35°, cut-away facing the camera | Most L1 and L2 images |
| Macro | fov 10–12°, frame height 2–8 mm | Corneal layers, ablation profile, sutured junction, collagen lattice, macula |

Framing: cut-aways that run out of frame end in a soft elliptical fade; free-standing subjects are complete objects with soft contact shadows and are never cropped mid-tissue. Ink outlines stay at 2.1 px per 1600 px at every level and zoom.

Grading: all images use the same pipeline and rig, so they read as one series. Orientation stays the same in Arabic and English (the image is never mirrored); only the labels change language.

## Annotation

No text, numbers or labels are baked into any image. Annotation is HTML and comes from the manifest: each anchor is a normalised x/y position projected from the 3D model, naming a structure in English and Arabic. Anchors outside the frame are dropped at build time.

## How plates, pins and captions are used on the site

- **Plates (PL.01–07).** Each procedure has a plate number that is used on the home gallery, the library, the page eyebrow and the menu sheet. The whole plate is one link.
- **Pins.** Numbered circles sit at the anchors; each has a matching line in the key below the figure. On a phone pins are 20 px, on larger widths 24 px. When two anchors collide on a small screen, a small script moves the pins apart by the minimum needed (at most three quarters of a pin). The manifest anchors are not edited. Pins overlaid on the small cards are off by default; the lead plate shows them.
- **Captions.** The caption line holds the plate/figure label, a one-sentence caption from the manifest, the pin key, and the line "Educational illustration — pending physician review". On very narrow phones the caption runs under both hero images. The pending line stays visible at every width and in both languages.
- **Dark theme.** Plates sit directly on the dark ground, with a short fade at the render's bottom edge so no flat cut is visible. Light tissue reads as a bright rim around the cut-away on dark; that is part of the illustration, not a defect.

## Known limits (for the physician review)

- Pin 6 on the cataract L2 plate (ciliary body) sits in the render's faded edge: correct anchor, hard to read at a glance.
- The questions for Dr. Maan, per image, are listed in `ANATOMICAL_VISUAL_LIBRARY.md`.
