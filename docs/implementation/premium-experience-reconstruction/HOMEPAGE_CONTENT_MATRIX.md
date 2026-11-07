# Homepage content matrix — premium experience reconstruction

Baseline: branch `feat/premium-experience-reconstruction` at `9322dd9` (same as `main`, live on GitHub Pages).
Inventory read from `main.js` (render functions), `doctor-data.js`, `src/site/content.js`, `src/procedures/content.js`,
`site-routes.js` and `content/internal-registry.json` (registry `facts[].id` / `status`). Earlier removals are tracked in
`docs/phase-1/CONTENT_PRESERVATION_MATRIX.md` (ids A1…K2, I1…I8); this file refers to them where relevant.

**Rule:** no legitimate doctor information may be deleted. It may only be moved, summarised, linked, or made expandable.
"Exclude" is used only for content that is already excluded for integrity reasons (unsupported, pending, no permission).

## Legend

**Destinations** — Home · About (`/about/`) · Library (`/procedures/`) · Proc (`/procedures/<slug>/`) · Lens Lab (`/lens-lab/`) ·
Light Journey (`/how-vision-works/`) · C3D (`/surgical-education/`) · Edu (`/education/`) · Clinic (`/clinic/`) · Footer.

**Actions** — Full = show in full · Summ = summarise · Link = link to detail page · Exp = expandable (disclosure) ·
Move = move to another page · Excl = exclude (with justification).

**Source** — `doctor` (confirmed by Dr. Maan), `magrabi` / `taibah` (published by the institution), `owner` (supplied by the
site owner), `edu` (general patient education from AAO/NEI/NHS, `REVIEW.status = 'draft'`), `ui` (site copy).

## Target homepage structure

| # | Section | Built from (blocks below) |
|---|---------|---------------------------|
| 1 | Doctor hero: portrait, name, specialty, short intro, booking CTA + one secondary CTA | H1–H7 |
| 2 | Patient pathways: treatments · vision & lenses · the doctor · booking (navigational, **not diagnostic**) | replaces H9 |
| 3 | Procedure gallery: **all 7 procedures** visually (anatomical visual, name, short line, details link) | replaces H13–H16 |
| 4 | Credentials summary → `/about/` | H8, H10–H12 (summarised) |
| 5 | Vision education: Lens Lab + Light Journey previews | H17–H18 |
| 6 | Cataract 3D preview (poster only, no 3D engine on home) | H19–H21 |
| 7 | Curated patient education (a few guides) | H22–H23 |
| 8 | FAQ (general only) | H24 (split) |
| 9 | Clinic & booking (verified methods only) | H25–H29 |
| 10 | Footer | F1–F8 |

---

## 1. Current homepage (`renderHome()` → hero, expertise, specialties, explore, education, clinic)

| ID | Current location (function · selector) | Content summary | Source / registry | Placement decision | Action | Justification |
|----|----|----|----|----|----|----|
| H1 | `renderHero` · `.hero-kicker` | "Consultant ophthalmologist · Madinah" | `magrabi` (identity) | Home §1 | Full | Specialty + city are the hero's first fact |
| H2 | `renderHero` · `h1.hero-title` | Full name `DOCTOR.identity.name` | `magrabi` | Home §1 | Full | Name-first hero (K1 decision kept) |
| H3 | `renderHero` · `.hero-specialty-subtitle` | Full title "(Cornea, Cataract & Refractive Surgery)" | `magrabi` | Home §1 | Full | Specialty line required by target |
| H4 | `renderHero` · `.hero-intro` | Chief of Staff Magrabi Madinah; Associate Professor Taibah; practising since 1998; sees patients at Magrabi Madinah | `role-chief-of-staff` confirmed, `rank-associate-professor` confirmed, `experience-since-1998` published | Home §1 (short intro) | Summ | Keep one sentence; full wording on About |
| H5 | `renderHero` · `#hero-primary-cta`, `#hero-about-cta` | Book (Magrabi portal) + "Discover his expertise" → `/about/` | `magrabi` booking URL | Home §1 | Full | Matches "booking CTA + one secondary CTA" |
| H6 | `renderHero` · `.hero-aside` | Clinic line 055 494 6433 + WhatsApp | `contact-clinic-direct` confirmed | Home §9 + booking bar | Move | Third/fourth CTA in hero dilutes the two-CTA rule; the number stays one tap away in the booking bar and §9 |
| H7 | `renderHero` · `.hero-portrait` | `dr-maan-portrait.png` + caption (short name, Chief of Staff) | owner photo | Home §1 | Full | Portrait required |
| H8 | `renderHero` · `.hero-facts` | 1998 / N years; **15,000+** examinations & procedures (career total); FRCS + Saudi Board | `experience-since-1998`, `cases-15000` confirmed (scope note must stay), `qual-frcs` verified, `qual-saudi-board` confirmed | Home §4 (credentials summary) and About (full) | Summ | Facts belong to the credentials band; keep the 15,000+ scope sub-line wherever the number appears (it is hidden on phones today, see MOBILE_DESIGN) |
| H9 | `renderHero` · `nav.intents` | "Start from what you need": cloudy vision → cataract; less glasses → Lens Lab; prescription changing → keratoconus; appointment → clinic | `ui` | Home §2 replaced by 4 pathways: Treatments → `/procedures/`, Vision & lenses → `/lens-lab/` (+ Light Journey), The doctor → `/about/`, Booking → `/clinic/` | Move (symptom phrasing to Edu / procedure pages) | Target says pathways are **not diagnostic**; symptom-to-procedure mapping reads like self-diagnosis. Symptom wording can live as "Is this for me?" lines on Proc pages |
| H10 | `renderExpertise` · section head + lede | "Clinical and academic experience since 1998"; works in the cataract unit and the cornea & refractive unit; sourcing statement | `magrabi`, `doctor` | Home §4 (one line) + About | Summ | Units sentence is already in About bio |
| H11 | `renderExpertise` · `.ledger-block` qualifications | FRCS (UK), Saudi Board, Associate Professor Taibah, memberships (Saudi Ophthalmological Society, AAO) with source tags | registry ids `qual-*`, `rank-associate-professor`; memberships `magrabi` | Home §4 (FRCS, Saudi Board, Assoc. Prof. as chips) · About (full ledger with "why it matters") | Summ + Link | Memberships and source tags stay on About (already hidden on phones on Home) |
| H12 | `renderExpertise` · `.timeline` | 5 roles: Chief of Staff (current), 1st President Saudi cornea/cataract/refractive association, former Chair Ophthalmology Taibah (10 yrs), former SOS representative Madinah, Red Sea conference co-founder | `role-*` (1 confirmed, 4 published/owner) | Home §4: current role + 2 most significant former roles · About: all 5 with "why it matters" | Summ + Link | Phones already hide roles 4–5 on Home; About keeps all |
| H13 | `renderSpecialties` · `.spec-card.is-lead` | Cataract surgery: illustration (webp, light/dark), group, name, summary, "Read the guide" | `procedure-cataract-surgery` published (magrabi) | Home §3 gallery card | Full (card) | One of 7 equal-weight gallery cards |
| H14 | `renderSpecialties` · `.spec-stack` | Laser vision correction, Keratoconus & CXL: illustration + summary (summary clamped to 3 lines; **hidden on phones**) | `procedure-laser-vision-correction`, `procedure-keratoconus-cxl` published | Home §3 gallery cards | Full (card) | Short line must stay visible on phones |
| H15 | `renderSpecialties` · `.spec-index` "Also" | **Text-only** links: Lens implants, ICL, Corneal transplant, Intravitreal injections | `procedure-lens-implants` published; `procedure-icl`, `procedure-corneal-transplant`, `procedure-intravitreal-injections` confirmed (owner) | Home §3 gallery cards (with their existing illustrations) | Full (card) | **Gap:** 4 of 7 procedures have no visual on Home today although each has a 3D illustration in `public/images/procedures/` |
| H16 | `renderSpecialties` · section head + library button | "What Dr. Maan treats"; "Three fields…"; link to `/procedures/` | `ui` | Home §3 header + Link | Summ | Copy must change from "three fields" to all seven |
| H17 | `renderDiscovery` · `.disc-lab` | Lens Lab preview: SVG (far/intermediate/near), title, description, CTA | `ui` (LENS_SUMMARY-driven art) | Home §5 | Full (preview) | Art + description hidden on phones today: show a compact version |
| H18 | `renderDiscovery` · `.disc-light` | Light Journey preview: SVG eye + rays, title, description, CTA | `ui` | Home §5 | Full (preview) | As H17 |
| H19 | `renderSurgeryPreview` · `.c3d-poster` | Cataract-in-section SVG poster (cornea / lens / retina labels); caption always hidden | `ui` | Home §6 | Full (poster, no engine) | Poster hidden on phones today; target needs it visible |
| H20 | `renderSurgeryPreview` · `.stage-list` | 4 stage titles (incision, capsule, phaco, new lens) | `edu` (SURGERY_STAGES) | Home §6 (titles) · C3D (titles + descriptions) | Summ | Already summary-only on Home |
| H21 | `renderSurgeryPreview` · `.c3d-actions` | "Open the 3D walkthrough" → `/surgical-education/`; "Cataract surgery guide" | `ui` | Home §6 | Link | — |
| H22 | `renderEducationPreview` · `.guide-list` | 3 featured guides (cataract, keratoconus, LASIK candidacy) title + summary (summary hidden on phones) | `edu` (GUIDES, FEATURED_GUIDES) | Home §7 (3 guides, summary visible) · Edu (full) | Summ + Link | — |
| H23 | `renderEducationPreview` · `.guide-foot` | Link to education library + questionnaire; "Eye emergency: when to go now" → `/education/#red-flags` | `ui` / `edu` | Home §7 | Link | Keep the emergency link on Home (safety) |
| H24 | `renderEducationPreview` · `#faq` | 6 FAQ items (mirrored in FAQPage JSON-LD): (a) specialty, (b) clinic location, (c) how to book, (d) does the simulator guarantee results, (e) glasses after cataract, (f) LASIK criteria | `doctor-data.js FAQ` (a–c from verified facts; d–f `edu`) | Home §8: a, b, c (+ d as a general "are the tools predictive?" item) · e → Proc cataract / lens-implants FAQ · f → Proc laser FAQ · d also on Lens Lab | Exp (accordion) + Move | Target FAQ is general only; procedure-specific answers move to their pages (check for duplicates in `src/procedures/content.js` FAQ before moving; keep FAQPage JSON-LD in sync) |
| H25 | `bookingWays()` | 1 Online (Magrabi portal), 2 clinic direct call/WhatsApp 055 494 6433, 3 Magrabi call centre 920018000 / 19505; descriptions **hidden on phones** | `contact-clinic-direct` confirmed, `contact-magrabi-callcenter` verified | Home §9 · Clinic | Full | Verified methods only — all three are verified/confirmed |
| H26 | `visitFacts()` hours | Sat–Thu 9:00–13:00 · 17:00–21:30 + "please confirm" note (note hidden on phones on Home) | `clinic-hours` confirmed | Home §9 · Clinic · Footer | Full | The "confirm through booking" caveat should stay visible |
| H27 | `visitFacts()` hospital | Magrabi Health Eye & ENT Hospital – Madinah, Airport Road, Google Maps link | `magrabi` | Home §9 · Clinic (with map iframe) | Full | — |
| H28 | `visitFacts()` accreditation | JCI + CBAHI "as published by Magrabi Health" (hidden on phones on Home) | `magrabi` | Clinic (full) · Home §9 (one line) | Summ | Institutional claim, attributed |
| H29 | `renderTestimonials` | Publication-gated; renders nothing | `testimonials-magrabi` **pending-permission** | — | Excl | No documented reuse permission (F1) |

## 2. Global chrome

| ID | Location | Content summary | Source | Placement | Action | Justification |
|----|----|----|----|----|----|----|
| G1 | `renderHeader` | Wordmark (short name + "Consultant Ophthalmologist"), 6-item nav, EN/ع toggle, theme toggle, Book button (≥640px) | `ui` | All pages | Full | — |
| G2 | `renderHeader` · `.mobile-nav` | Drawer: Home, 6 pages + How vision works, all 7 procedures, Maps, theme, socials | `ui` | All pages (mobile) | Full | Only phone path to the procedure list besides `/procedures/` (footer hides it) |
| G3 | `renderBookingBar` (≤1023px) | Book · Call **Magrabi call centre 920018000** · WhatsApp (clinic direct) | verified | All pages (mobile) | Full | Note: "Call" goes to the call centre, while the hero/closing "call" go to the clinic line — decide one primary number |
| F1 | `renderFooter` · brand | Full name, title (hidden on phones), hospital + address, 4 social links | `magrabi`, owner socials | Footer §10 | Full | — |
| F2 | `renderFooter` · site nav | Home + 7 section pages | `ui` | Footer | Full | — |
| F3 | `renderFooter` · `.footer-procs` | 7 procedure links (**hidden ≤719px**) | — | Footer | Full (compact on phones) | See MOBILE_DESIGN |
| F4 | `renderFooter` · contact | Clinic line, call centre, booking portal, Maps, hours (hours **hidden ≤719px**) | verified | Footer | Full | — |
| F5 | `renderFooter` · disclaimers | Medical disclaimer (DISCLAIMER incl. emergency sentence) + educational-content note | `ui` | Footer | Full | Legal/safety |
| F6 | `renderFooter` · bottom | © year + name; Magrabi profile, Taibah profile, Google Maps | `magrabi`, `taibah` | Footer | Full | — |
| F7 | `renderClosing(key)` | Closing band on section pages: Book, Clinic WhatsApp, Hospital location | verified | Section pages (not Home) | Full | Home ends in §9 instead |
| F8 | JSON-LD / `llms.txt` | Physician, MedicalClinic, FAQPage (home FAQ), per-page types | `doctor-data.js` builders | Build | Full | If H24 is split, FAQPage JSON-LD on Home must match the visible FAQ |

## 3. About (`renderAboutPage`)

| ID | Selector | Content summary | Source | Placement | Action | Justification |
|----|----|----|----|----|----|----|
| A1 | `pageHero` | Name, lede (title, Magrabi Madinah, since 1998) | `magrabi`, owner | About | Full | — |
| A2 | `.about-portrait` | `dr-maan-redsea.jpg` + caption "Saudi Ophthalmology 2024 – The Red Sea" | owner photo (I3 restored) | About | Full | Could also feed a Home §4 thumbnail |
| A3 | `.about-bio .prose` | Profile lede (units; lens/cornea assessment; keratoconus; laser; lens implantation) + roles paragraph (chief, assoc. prof., former SSCC president, former Taibah chair) + CTAs | `doctor`, `owner` | About | Full | Source for Home §1 intro sentence |
| A4 | `.about-facts` | 1998 · 15,000+ (career total, examinations and procedures combined) · FRCS | registry confirmed | About · Home §4 | Full / Summ | — |
| A5 | `#expertise .areas` | 3 AREAS (cataract & lens; cornea & keratoconus; vision correction) with illustrations, text and links to all 7 procedures | `edu`/owner (verified scope) | About | Full | Home §3 replaces this as the visual procedure index |
| A6 | `#profile .ledger` | Qualifications, Academic (rank + former Taibah chair), Leadership, Memberships — each with WHY_IT_MATTERS line and source tag | registry; WHY_IT_MATTERS wording **pending Dr. Maan's approval** | About | Full | Canonical credentials page |
| A7 | `#profile .appointments` | All 5 roles with "why it matters" | registry | About | Full | — |
| A8 | `#record .record` | Dated record: 1998 start; 2024 Red Sea conference; today Chief of Staff | owner, doctor | About | Full | Only documented dates |
| A9 | `#record .contrib` | Educational contributions: teaching (assoc. prof.), Taibah chair, Red Sea co-founder, SOS rep, on-site tools | owner | About | Full | — |
| A10 | `.profile-social`, `.profile-links` | Instagram, X, YouTube; Magrabi profile; Taibah profile | owner, magrabi, taibah | About · Footer | Full | — |

## 4. Procedure library (`renderProceduresPage`) and procedure pages (`renderProcedurePage`)

| ID | Selector | Content summary | Source | Placement | Action | Justification |
|----|----|----|----|----|----|----|
| L1 | `pageHero` | "Seven procedures, in plain language" + draft-review note | `ui` | Library | Full | — |
| L2 | `.proc-filter` | Chips: All / Cataract & lens / Vision correction / Cornea & retina | `PROCEDURE_GROUPS` | Library | Full | — |
| L3 | `.proc-grid procCard` ×7 | Illustration, group, name, summary (clamped to 3 lines on phones), 3D badge (cataract), details link | registry `procedure-*` (4 magrabi published, 3 owner confirmed) | Library (full) · Home §3 (name + short line + visual) | Full / Summ | Home gallery reuses `procCard`-like data |
| L4 | `.proc-help` | "Not sure? Start with an examination" + Book | `ui` | Library · Home §2 "Booking" pathway | Full | — |
| L5 | `.library-note` | Links to Lens Lab and Light Journey | `ui` | Library | Full | — |
| P1 | `.proc-hero` | Breadcrumb, group, title, intro (`CONTENT[slug].intro`), **draft review status**, Book + WhatsApp, 3D jump (cataract), hero illustration + figcaption (alt text) | `edu` draft; procedure registry | Proc | Full | — |
| P2 | `.proc-toc` | Contents list (**hidden <1024px**) | `ui` | Proc | Full desktop; compact jump-nav on phones | See MOBILE_DESIGN |
| P3 | `#p-anatomy` | Anatomy text + parts definition list | `edu` | Proc | Full | — |
| P4 | `#p-purpose`, `#p-types` | Purpose; types (cataract, lens-implants, laser, ICL …) + Lens Lab link | `edu` | Proc | Full | — |
| P5 | `#p-candidates`, `#p-steps` | Who may be considered + note; numbered steps | `edu` | Proc | Full | — |
| P6 | `#p-benefits`, `#p-risks`, `#p-recovery` | Benefits/limitations; risks + urgent-contact alert; recovery (+ `surgery-phaco.jpg` on cataract, I8) | `edu` | Proc | Full (long lists may become Exp on phones) | Risks and the alert must stay visible, never collapsed by default |
| P7 | `#p-faq` | Procedure FAQ accordion (also in FAQPage JSON-LD) | `edu` | Proc | Exp | Destination for H24 e/f |
| P8 | `.proc-sources` | Patient-information sources + draft review status | `edu` | Proc | Full | Integrity |
| P9 | `#cataract-3d` (cataract only) | 3D section: kicker, lede, 2 notes, start button, poster, lazy stage | `ui` | Proc cataract · C3D | Full | — |
| P10 | `.proc-related` | 3 related procedure cards (compact on phones) | `PROCEDURES.related` | Proc | Full | — |
| P11 | `.proc-book` | "Discuss <procedure> with Dr. Maan" + Book, clinic tel, Maps | verified | Proc | Full | — |

## 5. Interactive / education pages

| ID | Page · selector | Content summary | Source | Placement | Action | Justification |
|----|----|----|----|----|----|----|
| LL1 | Lens Lab · `pageHero` + on-page links | Title, lede ("does not predict your own result"), jump links | `ui` | Lens Lab | Full | — |
| LL2 | Lens Lab · `#lab .feature` | Lens Lab module (table ≥760px container, **one card at a time** below 760px) + static LENS_SUMMARY (4 lens types) + "no single lens suits everyone" note | `edu` | Lens Lab · Home §5 (preview) | Full | Static summary shows only without JS / while loading |
| LL3 | Lens Lab · `#simulator` | Vision simulator (lazy) + 3 disclaimers + link to lens-implants | `ui` | Lens Lab | Full | Disclaimers must stay visible |
| LJ1 | Light Journey · `pageHero` | "How does the eye see?" + LIGHT_ART | `ui` | Light Journey | Full | — |
| LJ2 | Light Journey · `#journey .feature` | Interactive 4 stations (diagram labels + "illustrative" tag **hidden in containers ≤560px**) + static LIGHT_PATH outline with procedure links | `edu` | Light Journey · Home §5 (preview) | Full | — |
| C1 | C3D · `pageHero` | "Cataract surgery, as it happens inside the eye" | `ui` | C3D | Full | — |
| C2 | C3D · `#cataract-3d` | As P9 + "Cataract surgery guide" link | `ui` | C3D · Home §6 (poster only) | Full | Home must not load the engine |
| C3 | C3D · `#stages` | 4 stages with descriptions + links (cataract page, surgery-journey guide, Lens Lab) | `edu` | C3D | Full | — |
| E1 | Edu · `pageHero` | "Understand your eye before your visit" + draft note | `ui` | Edu | Full | — |
| E2 | Edu · `.edu-toc` | On-page contents (**hidden <1024px**) | `ui` | Edu | Full desktop; compact on phones | — |
| E3 | Edu · `.guide` ×4 | Cataract guide, Keratoconus guide, LASIK candidacy, Surgery journey (full sections) | `edu` | Edu (full) · Home §7 (3 summaries) | Full / Summ | — |
| E4 | Edu · `#questionnaire` | 4-step visual-lifestyle questionnaire + answer-driven summary, print, WhatsApp | `edu` | Edu (+ link from Home §7) | Full | Not on Home (interactive, long) |
| E5 | Edu · `#red-flags` | Urgent-care warning signs + action | `edu` | Edu · linked from Home §7 and Proc risks | Full | Safety: never hidden |
| E6 | Edu · `#more-questions` | Links to Home FAQ and the 7 procedure FAQs | `ui` | Edu | Full | Update the Home-FAQ link if H24 is split |
| K1 | Clinic · `bookingWays()` + `visitFacts({map:true})` | As H25–H28 + Google Maps iframe | verified | Clinic | Full | — |
| K2 | Clinic · `#visit .pathway` | VISIT: examination & imaging → consultation → procedure → follow-up | `edu`/owner | Clinic | Full | — |
| K3 | Clinic · `.assess` | ASSESSMENTS: corneal tomography, optical biometry, OCT, full eye exam (no brands) | `edu` | Clinic | Full | — |
| K4 | Clinic · `.bring` | What to bring | `ui` | Clinic | Full | — |

## 6. Known doctor content that is not on any page today

| ID | Content | Registry / matrix status | Decision | Action | Justification |
|----|----|----|----|----|----|
| X1 | "Member of the Red Sea conference scientific council" | `role-redsea-scientific-council` **pending** | About (when confirmed) | Excl (until confirmed) | Not confirmed by Dr. Maan; overlaps co-founder role |
| X2 | "Former Secretary, Saudi Ophthalmological Society" | `role-sos-former-secretary` **pending** | About (when confirmed) | Excl (until confirmed) | Pending confirmation |
| X3 | Magrabi "SRC Network of Excellence" | `hospital-src-excellence` **pending** (D5) | Clinic accreditation line, attributed | Excl (until wording confirmed) | Owner must confirm wording |
| X4 | Patient testimonials (3 Magrabi reviews) | `testimonials-magrabi` **pending-permission** (F1) | Home §9 / About when permission documented | Excl | No reuse permission |
| X5 | "100% adherence to diagnostic protocols" | `stat-100-percent` **no-measurable-definition** | — | Excl | Never publish (integrity register) |
| X6 | `dr-maan-faculty.jpg` (faculty session, 2024) | I4: owner photo, **identifiable third parties** | About record (2024 entry) | Excl (until consent) | Consent for third parties not confirmed |
| X7 | `clinic-exam-room.jpg`, `cornea-cxl.jpg`, `diagnostics-pentacam.jpg` | I5–I7: unsupported / fabricated context | — | Excl | Do-not-restore list |
| X8 | Lens "best for" lines, "how is the lens chosen" (A3/A4) | Restore-worthy, reworded neutrally | Lens Lab | Move (restore later) | Educational, must avoid preference wording |

## 7. Homepage gaps vs the target structure

1. **Procedure gallery:** only 3 of 7 procedures are shown visually (cataract, laser, keratoconus). **Lens implants, ICL, corneal
   transplant and intravitreal injections** appear only as text links under "Also", although all four have light/dark 3D
   illustrations. On phones the two stacked cards also lose their summary line, so only cataract has a visible short line.
2. **Patient pathways:** the current "Start from what you need" block is symptom-driven (diagnostic phrasing) and has no "the
   doctor" pathway; it must become 4 navigational pathways (treatments, vision & lenses, the doctor, booking).
3. **Hero:** carries 3 CTAs + 2 contact links + the facts row; the target allows booking + one secondary CTA. Facts move to §4.
4. **Credentials:** currently a full ledger (qualifications, memberships, all 5 roles) — larger than a "summary → /about/".
5. **Vision education / Cataract 3D:** present, but on phones the Lens Lab and Light Journey art, both descriptions and the
   cataract poster are hidden, so §5–§6 are text-and-button only on mobile.
6. **FAQ:** mixes general items with procedure-specific ones (glasses after cataract, LASIK criteria, simulator guarantee).
7. **Clinic:** content matches the target (verified methods only); on phones the method descriptions, the "confirm your
   appointment" caveat and the accreditation line are hidden.
8. **Footer:** procedures column and hours are hidden on phones.
