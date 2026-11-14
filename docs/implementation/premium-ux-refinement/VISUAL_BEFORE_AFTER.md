# Visual before and after

Real screenshots from the production build in Chromium. The approved identity (ivory and ink palette, Naskh and Newsreader display type, numbered chapters, atlas plates, light and dark, RTL and LTR) is unchanged.

## Homepage hero

| Before | After |
|---|---|
| `evidence/hero/before-home-ar-390.jpg` | `evidence/hero/after-home-ar-390.jpg` |
| `evidence/hero/before-home-ar-360.jpg` | `evidence/hero/after-home-ar-360.jpg` |
| `evidence/hero/before-home-en-430.jpg` | `evidence/hero/after-home-en-430.jpg` |
| `evidence/hero/before-home-ar-390-dark.jpg` | `evidence/hero/after-home-ar-390-dark.jpg` |
| `evidence/hero/before-home-ar-768.jpg` | `evidence/hero/after-home-ar-768.jpg` |
| `evidence/hero/before-home-en-1440.jpg` | `evidence/hero/after-home-en-1440.jpg` |
| `evidence/hero/before-home-ar-1440.jpg` | `evidence/hero/after-home-ar-1440.jpg` |
| `evidence/hero/before-home-ar-1366-dark.jpg` | `evidence/hero/after-home-ar-1366-dark.jpg` |
| `evidence/hero/before-home-en-1920.jpg` | `evidence/hero/after-home-en-1920.jpg` |

Portrait at 390 px: 174×133 to 350×253, first on the page. Desktop: 230×175 to 378×454, no overlap. Details: `HERO_PORTRAIT_IMPROVEMENT.md`.

## Anatomical images

Seven procedure pages at 390 and 1440 px: `evidence/images/clarity-<procedure>-<width>-before.jpg` and `-after.jpg` (28 files), plus seven state shots (`clarity-state-*.jpg`: all labels shown, close-ups open, enlarge dialog, home cards, dark theme, 320 px). 13 of 27 images were re-rendered; the main plate shows at most 4 labels until "Show all labels" is used. Details: `ANATOMICAL_IMAGE_CLARITY.md`.

## Lens Lab on phones

| Before | After |
|---|---|
| `evidence/lens-lab/before-390x844-1-viewer-in-view.jpg`, `before-390x844-2-controls-in-view.jpg` (two screens: picture, then controls) | `evidence/lens-lab/after-390x844-1-viewer-in-view.jpg`, `-2-trifocal-near.jpg`, `-3-edof-night-far.jpg` (picture and controls in one frame, three different settings) |
| `evidence/lens-lab/before-320x640-*.jpg` | `evidence/lens-lab/after-320x640-*.jpg` |
| none | `evidence/lens-lab/after-844x390-*.jpg` (landscape, side by side), `after-*-4-more-settings-scrolled.jpg` (More settings open, picture pinned) |

## Four visual passes by the lead (rendered pages, read by eye)

| Pass | Checked | Finding | Action |
|---|---|---|---|
| A. Hero | 360, 390, 430, 768, 1100, 1366, 1440, 1920 px; AR/EN; light/dark | Doctor is the first and largest element; name, specialty and booking clear; the photo is soft at this size | Display size capped at twice the source; new photograph requested |
| A. Hero | 390 px | The small lens plate repeated the gallery's first plate directly below and lengthened the page | Hidden on phones |
| B. Images | Seven procedure pages at 390 and 1440 px, home cards | Clear single concepts; four plain-language labels; "pending physician review" visible on each | None beyond the re-renders; flagged items listed for the physician |
| C. Lens Lab | 320, 360, 390, 430 px and landscape, AR/EN, light/dark | Picture and controls on one screen; selected state obvious; notice stays with the picture | Jump landing fixed (UX-04) |
| D. Full site | Live check of 22 pages at 390 and 1440 px after the 2026-11-10 deploy; full suite on the final code | No console errors, broken images or sideways scroll; navigation, FAQ and language switch work | None |

Owner acceptance of these refinements is the owner's to give; nothing here records it.
