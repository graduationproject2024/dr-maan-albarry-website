# Medical references

## Clinical wording

Every stage text comes from the procedure's own page in `src/procedures/content.js`. The owner reports that Dr. Maan reviewed this content without objections. The new animations themselves are **not yet reviewed** (see `CLINICAL_REVIEW_QUEUE.md`).

Each simulator lists its sources in "What this model simplifies → Sources". On 2026-11-22 all 19 links returned HTTP 200. Some redirect to the publisher's newer address.

| Simulator | Sources |
|---|---|
| IOL | AAO "IOL implants" (aao.org/eye-health/diseases/cataracts-iol-implants); NEI "Cataract surgery"; NHS "Cataract surgery" |
| ICL | AAO "Phakic IOL"; NHS "Laser eye surgery and lens surgery"; AAO "Parts of the eye" |
| Laser (LASIK / PRK / SMILE) | AAO "LASIK"; AAO "PRK" (the source of the bandage contact lens in PRK); AAO "Refractive surgery"; NHS "Laser eye surgery and lens surgery"; FDA "LASIK" |
| Keratoconus / CXL | AAO "What is keratoconus?"; AAO "Corneal cross-linking"; AAO "Parts of the eye" |
| Corneal transplant | AAO "About corneal transplantation"; NHS "Cornea transplant"; AAO "Parts of the eye" |
| Intravitreal injections | AAO "Intravitreal injections"; AAO "Eye injections"; NEI "AMD"; NEI "Diabetic retinopathy"; NHS "AMD treatment" |

## Anatomical values

These are the cataract simulator's referenced values (`clinical-visual-reconstruction/CLINICAL_SOURCES.md`): the Navarro, Liou–Brennan and Dubbelman schematic eyes. Values added in this phase:
- epithelium about 50 µm;
- macula about 5.5 mm across;
- optic disc about 1.8 mm across, about 4.3 mm nasal of the fovea;
- illustrative ICL family dimensions and a 0.5 mm vault.

These are listed in `ANATOMICAL_MODEL_LIBRARY.md` as textbook reference values. Their exact primary citations are part of the clinical review.

## What was deliberately not shown

The following appear nowhere in text or as numbers in any simulator:
- laser settings;
- ablation or flap depths;
- UV dose;
- injection depth, angle or volume;
- medicine names or doses;
- trephine sizes;
- suture counts;
- ICL sizes.
