# Clinical review queue: new Phase 2 models

**Status of every item: PENDING.**
- No physician has reviewed these animations.
- No approval, signature or date is recorded.
- The owner's general approval of the site's existing information does not cover them.
- The simulators say "awaiting medical review by Dr. Maan Al Barry".

For each item, Dr. Maan would confirm, correct or reject:
1. the stages;
2. their wording in Arabic and English;
3. the simplifications;
4. whether the visual is acceptable for patients.

| # | Model | What to review | Specific questions for the reviewer |
|---|---|---|---|
| R-01 | `ssim-iol` 2026.11-r1 | 6 stages; the 4 lens-type descriptions; the light-path drawings | Is the two-stage summary of cataract removal acceptable? Are the EDOF and multifocal ring drawings acceptable as "illustrative"? Is the 30° toric axis acceptable as an example? |
| R-02 | `ssim-icl` 2026.11-r1 | 7 stages; insertion from the temporal side; ends tucked behind the iris; vault | Is the insertion and positioning sequence acceptable? Is the vault drawn (0.5 mm) acceptable? |
| R-03 | `ssim-laser` LASIK | 6 stages: flap on a superior hinge, lift, reshape, replace | Hinge position and flap reflection angle (illustrative) |
| R-04 | `ssim-laser` PRK | 6 stages, including the bandage lens (from AAO) and epithelial regrowth | Wording of the regrowth stage |
| R-05 | `ssim-laser` SMILE | 4 stages: lenticule and small opening | Position of the opening (superior) |
| R-06 | `ssim-cxl` keratoconus | 5 stages, inferior cone, light rays failing to meet | The cone is exaggerated: is that acceptable with the note? |
| R-07 | `ssim-cxl` CXL | 6 stages; epithelium handling is **not shown** | Should epithelium-off or epithelium-on be shown? (clinic decision) |
| R-08 | `ssim-kpl` PK / DALK / EK | 6 stages each; air bubble shown faintly at the end of EK | Should the bubble be shown absorbing? Is a stitch ring with no stated count acceptable? |
| R-09 | `ssim-ivt` | 6 stages; generic "affected area"; inferior injection site in the section | Is the injection site drawn acceptable? Is the "affected area" wording acceptable? |
| R-10 | Cataract simulator | Only the UI changed (wheel, full screen). No clinical change. | None |

Until review, the engineering is ready but publication is the owner's decision: the models carry the "pending review" note.
