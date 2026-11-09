# Anatomical image clarity

Status: done in the worktree branch, not merged. Browser emulation only (Chromium at 320, 390, 430 and 1440 px). No physician has reviewed anything here, and no real device was used. Every image still shows its "pending physician review" note and every asset stays `reviewStatus: "pending"`.

## The complaint and the approach

The owner said some illustrations are too complicated for ordinary patients. We did not redraw the library. Each of the 27 images was opened and judged at desktop and phone size. Images that really confused were re-rendered through `scripts/illustrations/`. Everything else was kept, and what was too much for a first look was moved one tap away. The atlas style, the ivory and ink palette and plates PL.01 to PL.07 are unchanged.

## Audit of all 27 images (state before this work)

"Labels" gives all labels, with the number now shown by default in brackets. "Structures" counts what the image draws, from the manifest. "Phone" was judged at 358 px wide for L2 and L3 and 170 px wide for L1.

| Asset | Level | Subject | Purpose | Complexity | Structures | Labels | Focal point | Camera | Contrast | Phone | Key concept quickly? | Supports its text? | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| cataract-surgery-l2-hero | L2 | Split before and after, natural lens and implant | Hero: cloudy lens replaced in the same capsule | Medium | 9 | 6 (4) | Split lens, clear | From the front, above | Good | Good; pins crowded with all six shown | Yes | Yes | Good, one defect: pin 6 in the faded edge. Re-rendered with a wider fade only |
| cataract-surgery-l1-card | L1 | Eye with a quarter cut away, cloudy lens | Card: cataract is a cloudy lens | Medium | 7 | 6 (1) | Amber lens, clear | Oblique | Good | Good at 170 px | Yes | Yes | Kept |
| cataract-surgery-l3-lens-capsule | L3 | Section of the cloudy lens in its capsule | Close-up: nucleus, cortex, capsule, fibres | High, 9 labels | 9 | 9 (3) | Amber nucleus | Sagittal | Good | Readable; pins 5 and 6 tight | With the key | Yes | Kept, moved behind More detail |
| cataract-surgery-l3-iol-in-bag | L3 | Section of the implant in the emptied capsule | Close-up: where the implant sits | High | 8 | 7 (3) | Weak: thin sliver of implant, much empty gel | Sagittal | Good | Poor: pins 1 to 4 stacked on the sliver | Slowly | Yes | Confusing. Re-rendered closer |
| lens-implants-l2-hero | L2 | Tilted cut-away with implant | Hero: implant replaces the natural lens | High | 6 | 7 (4) | Diagonal slab competes with the implant | Oblique | Medium | Poor: slab and seven pins | No | Partly | Confusing. Re-rendered as the cataract hero view |
| lens-implants-l1-card | L1 | Implant in the capsule, specimen view | Card: an implant | Medium | 5 | 4 (1) | Heavy maroon ring takes the eye | Near front | Ring too strong | Poor: ring dominates and is hard-cropped | No | Yes | Confusing. Re-rendered: pale ring, closer |
| lens-implants-l3-iol-in-bag | L3 | Implant in the capsule, oblique | Close-up: support arms | Medium | 5 | 5 (3) | Heavy maroon ring takes the eye | Oblique | Ring too strong | Fair | Slowly | Yes | Confusing. Re-rendered: pale ring |
| lens-implants-l3-optic-types | L3 | Four implant types side by side | Close-up: types differ in the optic | Medium | 6 | 6 (4) | Four even lenses | Oblique | Good | Good | Yes | Yes | Kept, moved behind More detail |
| laser-vision-correction-l2-hero | L2 | Corneal slice, flap, beam, tissue removed | Hero: flap lifted, layer reshaped | Medium | 10 | 8 (4) | Beam and flap | Oblique | Good | Image good; eight pins crowded | Yes | Yes | Kept. Labels reduced to four by default |
| laser-vision-correction-l1-card | L1 | Corneal slice, lifted flap, beam | Card: the laser reshapes the cornea | Low | 4 | 4 (2) | Violet beam | Oblique | Good | Good | Yes | Yes | Kept |
| laser-vision-correction-l3-corneal-layers | L3 | Corneal layers at the flap edge | Close-up: five layers | Medium | 7 | 7 (3) | Layered band | Macro | Good | Good | With the key | Yes | Kept, moved behind More detail |
| laser-vision-correction-l3-ablation-profile | L3 | Tissue removed, dashed original curve | Close-up: lens-shaped removal | Medium | 5 | 5 (3) | Violet band | Macro | Good | Good | Yes | Yes | Kept, moved behind More detail |
| icl-l2-hero | L2 | Section, tall subject in a wide frame | Hero: implant arches over the natural lens | Medium | 8 | 7 (4) | Implant, but small on phones | Oblique | Good | Poor: subject fills the middle third, pins 1 and 2 touch | Slowly on phone | Yes | Confusing on phones. Re-rendered with anterior up |
| icl-l1-card | L1 | Close cut-away, implant over natural lens | Card: a lens added, natural lens stays | Medium | 4 | 4 (2) | Blue gap and lens | Oblique | Good | Fair at 170 px | Mostly | Yes | Kept |
| icl-l3-vault-section | L3 | True section along the implant | Close-up: vault and footplate | High, 9 labels | 9 | 9 (4) | Natural lens and implant | Sagittal | Good | Readable; pins 5 and 6 tight | With the key | Yes | Kept, moved behind More detail |
| keratoconus-cxl-l2-hero | L2 | Cone, UV, riboflavin, angled view | Hero: cross-linking | High | 7 | 6 (4) | Weak: yellow wash fills the chamber | Oblique, rolled | Low | Poor: two dashed lines, pins 2 and 3 touch | No | Partly | Confusing. Re-rendered as a profile |
| keratoconus-cxl-l1-card | L1 | Cone seen at an angle, yellow wash | Card: the cornea bulges | Medium | 4 | 4 (2) | Weak: pale yellow on pale | Oblique | Low | Poor at 170 px | No | Partly | Confusing. Re-rendered as a profile |
| keratoconus-cxl-l3-cone-section | L3 | Section of the cone with the iris behind | Close-up: thinner and steeper | Medium | 5 | 5 (3) | Iris competes with the cone | Sagittal | Medium | Fair: pins 2 and 4 touch | Slowly | Yes | Confusing. Re-rendered closer |
| keratoconus-cxl-l3-collagen-crosslinks | L3 | Collagen fibres with violet bridges | Close-up: new bonds | Medium | 4 | 4 (2) | Violet bridges | Macro | Good | Good | Yes | Yes | Kept, moved behind More detail |
| corneal-transplant-l2-hero | L2 | Whole eye with sutured graft | Hero: full-thickness graft | Low | 6 | 6 (3) | Weak: subject is a small ball | Frontal | Good | Poor: six pins inside a 90 px iris | No | Yes | Confusing. Re-rendered closer |
| corneal-transplant-l1-card | L1 | Whole eye with sutured graft | Card: graft held by stitches | Low | 3 | 3 (2) | Weak: small iris on a large ball | Frontal | Good | Poor: stitches barely visible at 170 px | No | Yes | Confusing. Re-rendered closer |
| corneal-transplant-l3-graft-section | L3 | Section at the graft edge | Close-up: wound and stitch tracks | Medium | 6 | 6 (3) | Junction | Sagittal | Good | Good | With the key | Yes | Kept, moved behind More detail |
| corneal-transplant-l3-sutured-junction | L3 | Close view of the graft edge | Close-up: stitches | Medium | 4 | 4 (3) | Stitches | Macro | Good | Good | Yes | Yes | Kept, moved behind More detail |
| intravitreal-injections-l2-hero | L2 | Side view, needle, eye opened at the back | Hero: medicine reaches retina and macula | High, 8 labels | 9 | 8 (4) | Retina; macula at the cut edge | Oblique | Good | Poor: eight pins; pin 3 sits on intact wall where nothing is drawn | No | No: the medicine in the caption is not visible | Confusing. Re-rendered from the front |
| intravitreal-injections-l1-card | L1 | Side view, needle, eye opened at the back | Card: medicine inside the eye | Medium | 5 | 4 (2) | Retina; medicine not visible | Oblique | Good | Good, but the medicine cannot be seen | Partly | Partly | Confusing. Re-rendered: needle tip and medicine visible |
| intravitreal-injections-l3-pars-plana-entry | L3 | Section through the entry point | Close-up: where the needle enters | High, 9 labels | 10 | 9 (3) | Needle | Sagittal | Good | Readable | With the key | Yes | Kept, moved behind More detail |
| intravitreal-injections-l3-macula | L3 | Back of the eye seen from inside | Close-up: macula and optic disc | Medium | 5 | 5 (3) | Macula | Macro | Good | Good | Yes | Yes | Kept, moved behind More detail |

Confusing and re-rendered: 13. Kept as they were: 14.

## Decisions

**Three levels, in code.**

- L1 cards show only their essential label or labels (one or two). The lead card on the home page now shows one pin, "Cloudy lens (cataract)", in place of six.
- L2 heroes show at most four essential labels by default. The rest are behind "Show all labels (N)", a native `<details>` with a 44 px target. It works from the keyboard and before the script runs, and it re-runs the pin separation when it opens. Pins are numbered essential first, so the numbers stay the same in both states.
- L3 close-ups sit behind "More detail: close-up illustrations (N)". The anatomy text and its list of parts come first, so a patient can understand the page without opening L3. Inside L3 all labels are shown, because the reader asked for detail.

**Nothing clinical was removed.** All labels are still in the page, the pins and the key, and in the prerendered HTML.

**Plain words.** The key shows the patient term followed by the medical term where one is needed, for example "Centre of sharp vision (macula)". The medical terms remain in the manifest as `en` and `ar`. The patient wording is in `labelAnchors[].plain`. Wording was taken from `content.js`, `manifest.json` and `doctor-data.js` or is a plain standard equivalent. Every new or changed term is listed in `CLINICAL_REVIEW_IMPACT.md`.

**Tap to enlarge.** Built as a native `<dialog>` opened by a 44 px button on L2 and L3 figures. It has Escape and a close button, focus moves in and returns to the control, and it works in RTL. On a phone in portrait the image is 1.7 times the screen width and pans with one finger, which is the real gain over the page. Basic understanding never needs it. It keeps the figure's "all labels" state and carries the pending note.

**Re-render notes.** Details of each image are in `CLINICAL_REVIEW_IMPACT.md`. The main ideas:

- Lens implants: the maroon ciliary ring became a pale ring, and the hero uses the same view as the cataract hero.
- Keratoconus: a straight profile through the cone, yellow on the cut tissue only, one dashed normal curve.
- Transplant: closer, so the graft and stitches read.
- Injection: the eye is opened from front to back and seen from the front, so the needle tip, the medicine and the macula are all in view. Before, the medicine was hidden behind the wall of the eye and the caption described something the image did not show.
- ICL hero: turned so the section runs across the wide frame.
- Cataract hero: the fade was widened, so the pin at the ciliary body sits on visible tissue. The composition is otherwise unchanged. This image is also used in the hero area.

**File sizes.** The budgets in `atlas.mjs` hold: L2 1600 px up to 142 KB, L1 at 1200 px up to 120 KB, L3 up to 144 KB.

## What was kept and why

The 14 images not re-rendered were clear at their level, or their only problem was too many labels, which the disclosures solve: cataract-surgery-l1-card, cataract-surgery-l3-lens-capsule, lens-implants-l3-optic-types, laser-vision-correction-l2-hero, laser-vision-correction-l1-card, laser-vision-correction-l3-corneal-layers, laser-vision-correction-l3-ablation-profile, icl-l1-card, icl-l3-vault-section, keratoconus-cxl-l3-collagen-crosslinks, corneal-transplant-l3-graft-section, corneal-transplant-l3-sutured-junction, intravitreal-injections-l3-pars-plana-entry, intravitreal-injections-l3-macula.

## Phone check, 320 to 430 px

Checked in browser emulation: crop, focal point, subject size, label overlap, caption length and image-to-text balance. `tests/plates-clarity.spec.js` confirms no pin hides another at 320, 390 and 430 px, in the essential state and with all labels open, on all seven heroes. It also confirms captions stay within five lines, the enlarge button covers no pin, and there is no horizontal overflow.

## Evidence (`evidence/images/`)

- `clarity-<procedure>-<390|1440>-<before|after>.jpg`: the hero figure and caption of all seven procedure pages, 28 files. The before set was built from commit ea3e44d.
- `clarity-state-*.jpg`: all labels open in Arabic, L3 open, the dialog on a phone, dark theme on two pages, Arabic at 320 px, and the home page cards.

## Open items

- The transplant images still show only a full-thickness graft. The layer boundaries for partial-thickness grafts need the physician (the question is already in the manifest), so we did not draw them. The hero caption now says other graft types exist.
- The choice of essential labels and all plain wording are proposals awaiting Dr. Maan's review.
- The ICL hero and keratoconus images now read anterior up, while the section close-ups stay anterior left. This was chosen for the wide frame and is listed for review.
- The cataract L3 implant image was only reframed. The implant is thin in a true section, so it stays a slim shape.

## Test results (Chromium emulation; the machine was heavily loaded by other work during these runs)

- Full related run (`plates-clarity`, `procedures`, `seo`, `premium-regressions`, `phase1-pages`, `first-render`, `core-journeys`, `premium-journeys`): 192 passed, 4 failed. The four failures were J03, one premium journey E at 360 px and 125% text, `/lens-lab/` (ar) in `phase1-pages` and the FAQ accordion in `procedures`.
- Those four tests plus `plates-clarity`, re-run with two workers and a 240 s test timeout: 66 of 66 passed. The failures changed from run to run (and at the default 60 s some were plain test timeouts), so they are load-related, not defects of this work.
- No existing test was changed. `tests/plates-clarity.spec.js` is new (46 tests).
