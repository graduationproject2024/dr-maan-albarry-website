# Clinical review package for Dr. Maan (2026-11-25)

One list of everything that needs a physician decision. Nothing here is marked approved; no approval has been recorded.
The owner reports Dr. Maan approved the **previously supplied information**; that approval is respected and not re-asked.
Items below are new or changed medical representations, or long-open questions. Answer per item: **OK / change (how) / remove**.

## A. New in this pass (2026-11-24/25)
| ID | Item | Where to look | Question |
|---|---|---|---|
| N-01 | ICL plate rebuilt (one sagittal section, opaque fluids) | `evidence/icl/after/` (hero, card, close-up, AR/EN) | Is the ~0.5 mm vault the right "ideal" to show? Plate drawn 2× real thickness (0.2 mm) for phones — acceptable? Implant half-length 5.3 mm (simulator uses 5.6 mm sulcus) — acceptable? Footplates in the sulcus, iris resting on the implant — acceptable? |
| N-02 | ICL labels (AR/EN): "Implanted lens (ICL), behind the iris", "Small clear gap above the natural lens (vault)", "Your natural lens, which stays" | same | Wording OK? |
| N-03 | ICL 3D tuck: plate gathered to pass the pupil, sinks, opens out under the iris (BUG-SIM-14 fix) | `evidence/cameras/after/_sheet-icl-*.jpg` | Acceptable simplification of tucking one footplate at a time? |
| N-04 | Femto-LASIK lift: flap hinged superiorly, folded forward | `evidence/cameras/after/_sheet-laser-*` | Hinge position and lift angle OK? |
| N-05 | Corneal transplant section view centred between apex and graft edge (PK/DALK/EK) | `evidence/cameras/after/_sheet-corneal-transplant-*` | Framing shows the graft correctly? |
| N-06 | Injection entry view shows the whole needle path; entry point illustrative pars plana | `evidence/cameras/after/_sheet-intravitreal-*` | Entry point OK? (same as R-09) |
| N-07 | Light Journey drawing rebuilt (cornea ~2/3 of refraction, inverted image on the macula, nerve signal to visual cortex); on phones the object is drawn closer with a `//` break | `evidence/light-journey/after/` | Anatomy and light path OK for patient education? |
| N-09 | Lens Lab 50 cm "Screen" distance button (2026-11-26; wording withheld 2026-11-28): label "Screen 50 cm" / "شاشة ٥٠ سم" beside Near 40 / Intermediate 65 / Far; on narrow rows English "Intermediate" shows as "Mid". **At 50 cm no lens-level wording is shown** — the existing "near" wording describes ~40 cm and the model disagrees at 50 cm (near-layer sharpness, day, 40 cm → 50 cm: **trifocal 0.27 → 0.06, multifocal 0.41 → 0.05**, EDOF 0.00 → 0.01, enhanced 0.00 → 0.00). Instead a neutral caption: "<lens>: the picture shows this lens's modelled sharpness at 50 cm; ask your surgeon what to expect" / "<العدسة>: تُظهر الصورة الوضوح المحسوب لهذه العدسة على ٥٠ سم؛ اسأل جرّاحك عمّا تتوقعه." (same beyond 45 cm on the exact-distance slider). Model unchanged; the closer view frames the phone 0.8× as large, as seen from 50 cm | `evidence/lens-lab/after/`; review harness group "The 50 cm screen distance (each lens)" | Please give approved 50 cm wording per lens: **trifocal**, **multifocal (bifocal)**, **enhanced monofocal** (its near text says "about 40 cm"), **EDOF** (its description says near "to about 50 cm" but its near level says "glasses often needed for small print"), and standard monofocal / toric. Is the neutral caption acceptable meanwhile? Are "Screen" / "شاشة" and "Mid" acceptable? |
| N-08 | Lens Lab street scene (day/dim/night, palm boulevard, laptop, phone in hand); optics model unchanged | `evidence/lens-lab/after/` | Does any scene make a lens look better or worse than the model says? |
| N-10 | Cataract 3D simulator: new Before / After. Before = clouded natural lens with the illustrative scattered light path; After = clear IOL in the capsular bag with the illustrative focused light path; same camera; wording AR/EN in `10_BEFORE_AFTER_VERIFICATION.md` | `evidence/cataract/after/*/*/ba-before.jpg`, `ba-after.jpg` | Wording OK? Is showing the focused light path in "After" acceptable (captioned "not a vision test"), or should "After" show the lens only? |
| N-11 | Cataract 3D simulator camera pass: stage 1 and 7 now frame the whole globe in section (target 4 mm in front of the globe centre); close-ups unchanged on desktop, centred clear of the controls on phones; no anatomy or step changed | `evidence/cataract/before/` vs `after/` contact sheets | Framing suits the explanations? |

## B. Earlier open items (still pending)
| ID | Model | Question |
|---|---|---|
| R-01 | `ssim-iol` | Two-stage summary of cataract removal; EDOF / multifocal ring drawings as illustration |
| R-02 | `ssim-icl` | Insertion and positioning sequence; 0.5 mm vault (see N-01/N-03) |
| R-03 | `ssim-laser` LASIK | Hinge position and flap reflection angle (see N-04) |
| R-04 | `ssim-laser` PRK | Wording of the regrowth stage |
| R-05 | `ssim-laser` SMILE | Position of the opening (superior) |
| R-06 | `ssim-cxl` keratoconus | Exaggerated inferior cone with a note — acceptable? |
| R-07 | `ssim-cxl` CXL | Show epithelium-off or epithelium-on? (clinic decision) |
| R-08 | `ssim-kpl` PK / DALK / EK | Show the EK air bubble absorbing? Stitch ring with no stated count? |
| R-09 | `ssim-ivt` | Injection site drawn; "affected area" wording |
| C-* | Cataract 3D simulator stages, vision simulator 51 presets, anatomical plates | Review tools: `cataract-sim-preview.html?review=1`, `vision-sim-preview.html?review=1` (harness build). Card #22. |

## C. Content facts awaiting confirmation (card #32)
EDOF year 2010 (first EDOF CE mark 2014); dropless-surgery paper citation; 25,000+ = operations he performed himself?; name of the association he first presided; evidence for each "first in Madinah / KSA" claim (shown as "since 2010" until then); new dry-eye guidance text.

## How to record a decision
Reply per ID (e.g. "N-01 OK; N-04 hinge nasal"). Decisions are recorded with date and reviewer in the review tools / `release-status.json`; the site never shows "physician-approved" without that record.
