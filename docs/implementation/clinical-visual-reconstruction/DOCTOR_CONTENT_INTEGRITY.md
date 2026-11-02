# Doctor content integrity

**Single source of truth:** `doctor-data.js` (DOCTOR, FAQ, PROCEDURES, PROCEDURE_GROUPS). The page, the JSON-LD, `llms.txt` and the prerendered HTML are all generated from it.

**Governance record:** `content/internal-registry.json`. It holds 22 facts, each with its wording, source, evidence, status, public/internal display flag and history. The app never imports it.

**Guard:** `tests/content-registry.spec.js` fails the build if an approved fact disappears from the rendered page, or if an internal-only fact appears on it.

## Source categories
| Category | Meaning | Examples |
|---|---|---|
| `doctor` | Confirmed by Dr. Maan, as relayed by the owner on 2026-11-01 | Saudi Board, Associate Professor, supervision role, clinic hours, direct line 055 494 6433 (calls + WhatsApp), 15,000+ |
| `magrabi` | Published on the official Magrabi Health profile | Title and specialty wording; cataract, lens implants, laser vision correction, keratoconus/CXL |
| `taibah` | Published by Taibah University | Academic roles |
| `owner` | Supplied by the site owner | Practice since 1998; corneal transplant, intravitreal injections, ICL (2026-11-01) |
| pending / unsupported | Not on the public site | See below |

## Numeric claims
| Claim | Exact meaning | Display |
|---|---|---|
| 15,000+ | Career total of eye examinations **and** surgical procedures combined. It is not a count of surgeries and not a count of patients. | Public, with that label |
| 100% | No measurable definition. It must never be turned into a success rate. | **Internal only.** A forbidden-pattern test keeps it out of the bundle. |
| 1998 / 28 years | Year practice began, as stated by the owner | Public |

## Changes in this reconstruction
- **Added:** 7 `procedure-<slug>` facts, each with its provenance and history.
- **Removed: the homepage "Clinical review: Dr. Maan" byline** on the education articles. No recorded review exists, so showing it would have presented unreviewed material as physician-approved. The reason is also recorded in `INFORMATION_ARCHITECTURE.md`.
- **Unchanged:** every previously published doctor fact, as guarded by `content-registry.spec.js`.
- **All 14 procedure pages** show "Medical review status: draft pending review by Dr. Maan".

## Still open (external)
- A written record of Dr. Maan's confirmations from 2026-11-01, including the procedure scope.
- Testimonials: verbatim text plus written permission (D-10).
- Licence / SCFHS statement (D-9), personal lens statement (D-12), analytics consent (D-13), and production domain (D-14).
