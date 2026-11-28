# Doctor content verification (2026-11-24)

Checked in source (`doctor-data.js`, `clinical-profile.js`, `content/internal-registry.json`) and on the live site
(`curl` of `/en/` and `/en/about/` on https://graduationproject2024.github.io/dr-maan-albarry-website/, main `4e55b40`).

| Item (brief §26) | Source | Live `/en/about/` | Status |
|---|---|---|---|
| 25,000+ operations, one-time count-up, reduced-motion fallback | `SURGERY_STAT`; `bindCounters()` (main.js); tests in `clinical-profile-expansion.spec.js`, `first-render.spec.js` | "25,000+" ×2 | DONE; attribution (performed himself?) BLOCKED — EXTERNAL |
| KKESH 2001–2009, consultant / medical staff, teaching | `EMPLOYMENT` | "King Khaled" ×11, "2001" ×9 | DONE |
| ICO 2002–2003, KSU fellowship 2004, KKESH fellowship 2005 | `QUALIFICATIONS` | "ICO" ×4 | DONE |
| Saudi Board, FRCS (previously approved) | `doctor-data.js` | ×7, ×8 | DONE |
| Leadership ("first President") | `doctor-data.js`, registry | shown as previously published | Organisation name BLOCKED — EXTERNAL (SSCRS founded 2021, names no president) |
| Achievements A01–A16 (incl. dropless 2013, uveitis 2013, CXL/ICL/Femto-LASIK 2010, topography-guided, VKC, anti-VEGF 2006, paediatric biologics 2009, voriconazole 2008, referral experience) | `ACHIEVEMENTS` with original wording, display decision, evidence | public ones rendered under "Clinical work" | All preserved internally; "first in Madinah/KSA" shown as "since 2010" without "first" until evidence (BLOCKED — EXTERNAL) |
| EDOF 2010 claim | A06 split; EDOF internal | not shown | Anachronism (first EDOF CE mark 2014) — owner to clarify |
| Publications | 6 PubMed-verified (`PUBLICATIONS`) | linked | DONE; dropless paper not found — citation needed |
| Femto-LASIK terminology | procedures content, laser sim label | ×3 | DONE |
| iTrace, Pentacam AXL Wave | `DEVICES` | ×2, ×1 | Text DONE; photos BLOCKED — EXTERNAL (see 12) |
| Arabic/English consistency | `content-registry.spec.js`, `phase0-content.spec.js` in the gate | gate green on main | DONE |

No clinical fact was added in this pass.
