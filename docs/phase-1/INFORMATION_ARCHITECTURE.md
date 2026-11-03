# Phase 1 information architecture

Branch `worktree-agent-ac561dca2cb068972` (from `feat/phase-1-premium-experience`). Supersedes
`docs/implementation/clinical-visual-reconstruction/INFORMATION_ARCHITECTURE.md` for the page structure; that
document still describes the procedure-page template, which is unchanged.

## 1. Routes

`site-routes.js` is the single route table (app, build, prerender, tests). Paths are relative to the site root,
so every page works at a domain root and under the GitHub Pages subpath (`/dr-maan-albarry-website/`).

| Page | Arabic | English | `<h1>` | JSON-LD (besides BreadcrumbList) |
|---|---|---|---|---|
| Home | `/` | `/en/` | Doctor's full name | Physician + FAQPage (unchanged; no breadcrumb on home) |
| About Dr. Maan | `/about/` | `/en/about/` | Doctor's full name | ProfilePage → Physician |
| Procedure library | `/procedures/` | `/en/procedures/` | "Seven procedures, in plain language" | CollectionPage + ItemList of the 7 procedure URLs |
| Vision & Lens Lab | `/lens-lab/` | `/en/lens-lab/` | "Compare lens implants, distance by distance" | MedicalWebPage (patient audience) |
| 3D cataract surgery | `/surgical-education/` | `/en/surgical-education/` | "Cataract surgery, as it happens inside the eye" | MedicalWebPage |
| Education library | `/education/` | `/en/education/` | "Understand your eye before your visit" | MedicalWebPage |
| Light Journey | `/how-vision-works/` | `/en/how-vision-works/` | "How does the eye see?" | MedicalWebPage |
| Clinic & booking | `/clinic/` | `/en/clinic/` | "Your appointment with Dr. Maan Al Barry" | ContactPage + MedicalClinic (doctor-confirmed hours and direct line; parent Hospital as published by Magrabi) |
| Procedure pages (7) | `/procedures/<slug>/` | `/en/procedures/<slug>/` | Procedure name | MedicalWebPage + Surgical/TherapeuticProcedure + FAQPage + **BreadcrumbList (new)** |

30 prerendered pages (15 per language). Each has its own title, description, canonical, hreflang (ar, en,
x-default = Arabic), Open Graph/Twitter tags, one JSON-LD block, a visible breadcrumb that mirrors the
BreadcrumbList, and a sitemap entry with its hreflang pair. `llms.txt` lists the pages.
The inline `<base>` script in `index.html` uses the same route pattern as `ROUTE_PATTERN` (a test checks this).

Navigation: the header links to About, Procedures, Lens Lab, 3D surgery, Education, Clinic & booking (the current
page carries `aria-current="page"`). The drawer adds Home and "How vision works", plus every procedure. The
footer lists every page and procedure (procedures are omitted from the footer on phones; the drawer and library
carry them).

## 2. Homepage narrative (before → after)

Before (HEAD `95702cd`): hero → 7-card gallery → ledger → full vision simulator → 3D cataract → education
(4 answers, red flags, 4 assessments, questionnaire) → FAQ → clinic → closing CTA.
About 10,700 px at 1440 and 15,000 px at 390.

After: a numbered editorial journey; every section ends with a link to its dedicated page.

| # | Section | What is shown on the homepage | Detail moved to |
|---|---|---|---|
| — | Physician hero | Portrait, full name, title, one factual intro (Chief of Staff, Associate Professor, since 1998, hospital), Book + "Discover his expertise", clinic line + WhatsApp, 3-fact strip (1998, 15,000+ with its meaning, FRCS + Saudi Board), 4 intent shortcuts | `/about/`, procedure pages, `/lens-lab/`, `/clinic/` |
| 01 | Professional expertise | Qualifications and academic rank with source tags; the 5 roles (short names, current first) | `/about/` (full role wording, why-it-matters lines, dated record) |
| 02 | Core specialties | Cataract surgery (lead, large artwork), laser vision correction, keratoconus & CXL; the other four procedures as an index; library button | `/procedures/` |
| 03 | Vision discovery | Lens Lab preview and Light Journey preview (static art, no module) | `/lens-lab/`, `/how-vision-works/` |
| 04 | Surgical education | Poster, the four stages, "Open the 3D walkthrough" (no simulator on the homepage) | `/surgical-education/`, cataract page |
| 05 | Medical education | 3 guides (titles + summaries) + the 6-question FAQ (mirrored by FAQPage JSON-LD) + eye-emergency link | `/education/` |
| 06 | Clinic & booking | Three booking routes, hours, hospital and address, directions, accreditation | `/clinic/` (map, visit pathway, assessments, what to bring) |
| — | Footer | Name, title, hospital, social; site pages; procedures; contact + hours; medical disclaimer with the emergency sentence; educational-content notice | — |

Measured homepage heights after Phase 1 are in `DESIGN_SYSTEM.md` §9 and the final report.

## 3. Content map — every matrix row has a destination

Row IDs refer to `CONTENT_PRESERVATION_MATRIX.md`. "Lens Lab agent" = content owned by the Lens Lab module
(`src/lens-lab/`, merged from `feat/phase-1-premium-experience`).

| Row | Item | Destination now | Status |
|---|---|---|---|
| A1, A2, A3, A5 | Lens comparison sheet, scales, "how is the lens chosen" | `/lens-lab/` (Lens Lab module); static summary of the four lens types on the same page without JS; `/procedures/lens-implants/#p-types` links to the Lab | Lens Lab agent + linked here |
| A4 | "Often discussed when…" lines | Lens Lab module content | Lens Lab agent; this page links to `/lens-lab/` |
| A6, A8, A10 | Simulator per-lens notes, halos, toric | `/lens-lab/` (Lab's embedded simulator and the full simulator section `#simulator`) | Kept |
| A7 | Defocus chart concept | Vision simulator fallback; Lens Lab | Unchanged (numbers not restored) |
| A9, A11 | "Favoured by Dr. Maan", logMAR footnote | — | Do not restore (respected) |
| B1 | Four questions | `/education/#questionnaire` | Kept |
| B2 | Answer-driven summary | `/education/#questionnaire` — `questionnaireResult()` in `src/site/content.js` picks 1 priority block + history/condition blocks + next step, as R0 did | **Restored, neutral** (PREFERENCE regex passes; tested) |
| B3, B4 | "Zero halos", "95%+" | — | Do not restore (respected) |
| B5 | Book / WhatsApp / restart; disclaimer | Questionnaire result (+ print button) | Kept |
| B6 | Glaucoma/retina line | Neutral "Existing eye conditions" block | Restored as neutral prompt |
| C1–C4 | Four headed guides | `/education/#cataract-guide`, `#keratoconus-guide`, `#lasik-candidacy`, `#surgery-journey`; 3 featured on the homepage | **Restored** without 2.2 mm, "no stitches", "zero pain", "15–20 min", "Pentacam" |
| C5 | Red-flag card | `/education/#red-flags`; homepage "Eye emergency" link | Kept |
| C6 | "Medically supervised" bylines | — | Do not restore (respected); "pending review" notice kept |
| C7 | Library of full articles | `/education/` | Restored as a page |
| D1 | Specialty cards | Homepage §02 + `/about/#expertise` (R5 `areas` text) | Restored on /about/ |
| D2 | Diagnostics strip | `/clinic/#visit` "core assessments" (generic, no brands) | Kept, moved |
| D3 | "Your visit" pathway | `/clinic/#visit` (4 steps) | **Restored** |
| D4 | Accreditation line | Homepage clinic section, `/clinic/` ("as published by Magrabi Health") | Kept; CBAHI re-check still open |
| D5 | SRC Center of Excellence | Registry `hospital-src-excellence` (pending) | Pending — not shown |
| D6, D7 | Named devices, "premium" | — | Do not restore (respected) |
| E1 | Biography paragraphs | `/about/` (R5 lede + body, facts from `doctor-data.js`) | **Restored**; wording needs Dr. Maan's approval |
| E2 | Hero quote | — | Archived (no approval) |
| E3, E7, E9, E10 | Roles, qualifications, since 1998, 15,000+ | Homepage §01 + hero strip; `/about/` | Kept |
| E4 | Red Sea scientific council member; former SOS secretary | Registry `role-redsea-scientific-council`, `role-sos-former-secretary` (`display: pending`) | **Pending** — not shown publicly (tested) |
| E5, E6, E8, E11–E13 | CMO title, present-tense chair, fellowship, 100%, +200, SCFHS badge | — | Do not restore (respected) |
| E14 | Conference block | `/about/` uses `dr-maan-redsea.jpg` + dated 2024 record line; faculty group photo **not used** (third parties, no consent) | Partly restored |
| E15 | Social links | Footer, drawer, `/about/` | Kept |
| E16 | Taibah email | — | Not published |
| F1, F2 | Testimonials | Publication gate unchanged | Not shown |
| G1–G3 | FAQ | Homepage `#faq` (FAQPage JSON-LD); `/education/#more-questions` links to it and to every procedure FAQ | Kept |
| H1, H3, H5 | Phones, booking, hours | Homepage §06, `/clinic/`, footer, booking bar | Kept |
| H2, H4, H6 | Retired WhatsApp, old hours, geo/priceRange | — | Do not restore (respected) |
| H7 | Emergency sentence in disclaimer | Footer on every page (`DISCLAIMER` in `src/site/content.js`) | **Restored** |
| I1 | `dr-maan-portrait.png` | Homepage hero | Kept (low resolution: 295×225; see gaps) |
| I2 | `doctor-portrait.jpg` | OG / JSON-LD image | Kept |
| I3 | `dr-maan-redsea.jpg` | `/about/` portrait with caption | Restored (event branding visible — owner to confirm) |
| I4 | `dr-maan-faculty.jpg` | — | **Skipped**: identifiable third parties, no documented consent |
| I5, I6, I7 | Exam room, phone mock-up, bench photo | — | Not used |
| I8 | `surgery-phaco.jpg` | `/procedures/cataract-surgery/#p-recovery` with neutral caption | Restored (origin to be confirmed by the owner) |
| I9 | Simulator posters | Unchanged | — |
| I10 | Procedure illustrations | Homepage §02, `/about/` areas, library, procedure pages (with 800 px `srcset`) | Kept |
| J1 | Untraceable citation | — | Do not restore |
| J2 | Per-procedure sources | Procedure pages | Kept |
| K1 | Original tagline | Not used; the hero intro states facts instead | Copy review |
| K2 | Promotional claims | — | Do not restore |
| §5 | Typo "قصو" in `src/procedures/content.js` | Fixed to "قصر" | Done (tested) |

## 4. Integration with other workstreams

`src/feature-loaders.js` resolves optional modules with `import.meta.glob(['./lens-lab/index.js',
'./light-journey/index.js'])`, so a missing file never breaks the build.

- **Lens Lab** (present after merging `feat/phase-1-premium-experience`, `1ec0663`): mounted lazily on
  `/lens-lab/` into `#lens-lab-host` (`data-lens-lab-host`) when it nears the viewport. The host lives outside the
  re-rendered markup; `setLang`/`setTheme` are forwarded; it is destroyed when the visitor leaves the page.
  While a mount is expected the slot reserves 1,200 px (1,600 px on phones) and the static summary is hidden;
  after mounting the reservation is released. On failure the reservation is released, a status message and
  retry button appear, and the static summary shows again. Prerendered/no-JS pages show the static summary.
- **Light Journey** (`src/light-journey/index.js`): not present in this branch. `/how-vision-works/` shows a
  "the interactive version is being prepared" note with the written four-station outline (each linked to its
  procedure). When the module lands it mounts with `linkFor(slug)` → `procedures/<slug>/` (or `en/…`).
- **Vision simulator** (`src/vision-sim`): mounted only where its host exists — the full simulator section
  `#simulator` on `/lens-lab/`. The homepage no longer embeds it (a compact entry links to the Lab).
  Reservation measured after mounting: 1,560 px ≥1024, 1,440 px 768–1023, 1,930 px <768; released once mounted.
- **3D cataract** (`src/cataract-sim`): unchanged on-demand mount on `/surgical-education/` and on the cataract
  procedure page (`#cataract-3d`). The homepage shows a poster and links there.
