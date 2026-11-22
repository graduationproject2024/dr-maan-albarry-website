# Phase 2 scope: interactive 3D for all seven procedure categories

The owner authorised this work on 2026-11-22. The brief is "Phase 2 master execution prompt".

## In scope

| # | Website category (slug) | Experience | Engine |
|---|---|---|---|
| 1 | Cataract surgery (`cataract-surgery`) | Existing 7-stage simulator, refined | `src/cataract-sim` (kept) |
| 2 | Lens implants (`lens-implants`) | IOL position and lens types | shared engine |
| 3 | ICL (`icl`) | Phakic lens in front of the natural lens | shared engine |
| 4 | Laser vision correction (`laser-vision-correction`) | LASIK, PRK and SMILE as three variants | shared engine |
| 5 | Keratoconus / CXL (`keratoconus-cxl`) | Understanding keratoconus; cross-linking | shared engine |
| 6 | Corneal transplant (`corneal-transplant`) | PK, DALK and EK (DSAEK/DMEK) variants | shared engine |
| 7 | Intravitreal injections (`intravitreal-injections`) | Posterior-segment education | shared engine |

The site's own pages already list these types, so they are not new services:
- LASIK, PRK and SMILE are listed in `content.js` under laser vision correction;
- PK, DALK and DSAEK/DMEK are listed in `content.js` under corneal transplant.

## Constraints kept

- **No redesign.** The simulators use the cataract simulator's tokens, which are the site palette.
- **No React and no new runtime dependency.** It is three.js 0.170, as before.
- **Clinical content comes only from the site's procedure pages and their listed sources.** Nothing invented: no depths, energies, volumes, angles, sizes or surgeon-specific steps.
- **New models are marked "pending medical review"** everywhere. No approval is claimed.
- **Nothing is pushed, merged or deployed** without separate authorisation.

## Out of scope

- Phase 3 modules.
- New procedures.
- Booking or chat systems.
- Paid device clouds.
- Clinical sign-off: only Dr. Maan can give it.
