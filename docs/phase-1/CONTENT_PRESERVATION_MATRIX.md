# Content preservation matrix

Prepared 2026-11-02 on branch `feat/phase-1-premium-experience` (HEAD `95702cd`).
Audience: the implementation agent. Scope: recover valuable content that was removed, reduced or relocated across the redesigns, and say clearly what must **not** come back.

Rules used for every row:

- "Verified status" uses the registry vocabulary from `content/internal-registry.json` and `docs/implementation/recovery/DOCTOR_CONTENT_RECOVERY.md`: `doctor`, `magrabi`, `taibah`, `owner`, `pending`, `no-permission`, `unsupported`. Education text written in this repository, with no recorded physician review, is `pending`.
- Nothing in this file is edited into source. No source file was changed to produce it.
- Quoted text is in Appendices A to H, extracted mechanically from `git show <commit>:<file>` so it is exact.
- "Do not restore" rows are in section 3. They stay out unless the registry marks the underlying fact confirmed **and** the guard tests are updated by the owner.

## 1. Revisions compared

| Short | Commit | Date | What it is | Size of `main.js` |
|---|---|---|---|---|
| R0 | `93465a6` | 2026-10-22 | Initial commit: data constants `IOL_DATA`, `ARTICLES`, `REVIEWS`, `FAQ_DATA`, `QUESTIONNAIRE` | 1,650 lines |
| R1 | `683cfc6` | 2026-10-22 | Redesign; the constants were inlined into render functions | 1,665 |
| R1b | `b58cb4f`, `9709b99`, `4c3128c`, `4f6bc6c` | 2026-10-22..25 | Simulator overhaul, "reference HTML" alignment, theme toggle | 2,309 / 1,732 / 1,770 / 1,820 |
| R2 | `2fbf261` | 2026-10-25 | **Owner rewrite**: new doctor wording, EDOF "favored" content, acuity curves | 1,858 |
| R3 | `9da524c` | 2026-10-25 | Hero and profile showcases: stats strip (+26, 100%, +15,000), quote card, SCFHS badge, conference gallery | 2,717 |
| R4 | `0a9d4f2`, `cfa38e2`, `1b320ae` | 2026-10-31..11-01 | **Phase 0/1**: `doctor-data.js` created, unsupported claims removed, neutral lens copy | 2,504 / 2,567 |
| R4b | `402bc49` | 2026-11-01 | Merge of PR #1 (same `main.js` as `1b320ae`) | 2,567 |
| R5 | `a255d39` | 2026-11-01 | **PR #2 original redesign**: credentials ledger, bio and conference block, neutral IOL comparison sheet, tech and pathway blocks | 2,083 |
| R5b | `0d167b7` | 2026-11-01 | Doc fix; `main.js` identical to `a255d39` | 2,083 |
| R6 | `3d04518` | 2026-11-02 | **Clinical atlas redesign**: procedure library, homepage shortened | 2,175 |
| HEAD | `95702cd` | 2026-11-02 | Current. `main.js` 1,415 lines | 1,415 |

Current homepage order (`main.js` `renderHome`): hero → procedures gallery → profile ledger and timeline → vision simulator → 3D cataract → education (4 short answers, red flags, 4 assessments, questionnaire) → FAQ → clinic → closing CTA. Procedure content lives in `src/procedures/content.js` (7 procedures, AR and EN, all marked "draft pending review by Dr. Maan").

Documents already record some removals: `INFORMATION_ARCHITECTURE.md` says the "large IOL comparison sheet became the lens-implants page Types", "biography paragraphs and the conference block cut to one line", "four long library articles became short answers", and the "Clinical review: Dr. Maan" byline was removed because no review exists. This audit checks those claims against the old code and finds that the first two are only partly true (rows A1, A2, E1, E14).

## 2. The matrix

Legend. Current status: **present**, **moved** (exists elsewhere), **reduced** (a smaller version exists), **removed**. Destination vocabulary: keep on homepage, dedicated page, restore, redesign, merge, archive.

### A. IOL and lens comparison

| ID | Item | Category | Where it lived (commit, function or section) | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| A1 | Lens comparison table: monofocal, EDOF, trifocal and toric, each with distance, intermediate, near, night glare and a "best for" line (AR and EN) | IOL comparison | R0 `IOL_DATA` + `renderIOLSection` (`#cataracts`, `.iol-table`); kept through R1b (`iol-table` present at `9709b99`) | **Reduced.** `lens-implants` page has a `types` list (4 lens types, one sentence each) and benefits/limitations/risks. The per-distance cells and "best for" lines are gone | pending (in-repo education text; no review record) | **Restore + redesign**: a comparison sheet on `/procedures/lens-implants/` and a 3-row teaser on the homepage "Understand your options" block. Source text: Appendix A (R0) and Appendix B (neutral R5 sheet) |
| A2 | Four-step rating scales (distance, intermediate, near, halos) plus "glasses needed" line, neutral wording, three lenses, legend "filled marks show the level of performance" | IOL comparison | R5 `renderIolGuide` (`.iol-sheet`, `.scale`, `.iol-legend`). Earlier, with "favored" EDOF card: R2/R3 `renderIolGuide` (eye pips) | **Removed** in R6 | pending. Scores are illustrative and unsourced; the simulator now has its own parametric model | **Restore from R5 (neutral)**; label as "general, illustrative"; align the scores with the simulator's `LENS_INFO` so there is one source. Appendix B |
| A3 | "How is the lens chosen?" note (no single lens suits everyone; trade-offs per type; choice based on examination, measurements, priorities) | IOL comparison | R5 `renderIolGuide` `aside.note` | **Reduced.** Idea is in lens-implants `purpose` and `intro` | pending | **Restore** under the sheet. Appendix B |
| A4 | "Who is it for" per lens (`bestFor`) | IOL comparison | R0 `IOL_DATA[].bestFor` | **Removed** | pending. Wording is preference-flavoured ("patients prioritizing…") but neutral enough | **Restore, reworded** as "often discussed when…". Must avoid the words matched by the `PREFERENCE` regex in `tests/phase0-content.spec.js` (prefer, favour, المفضل, يفضل). Appendix A |
| A5 | Lens advantages and disadvantages | IOL comparison | **No literal "pros and cons" list ever existed.** Equivalent content: A1 columns, per-lens simulator notes (A6), and `benefits`/`limitations`/`risks` on the lens-implants page | **Present** (lens-implants) | pending | **Merge**: add a two-column "Strengths / Limits" row per lens to the sheet, drawn from existing `benefits`/`limitations` and `LENS_INFO.tradeoffs`; do not invent new claims |
| A6 | Per-lens notes in the simulator ("intended range" and "trade-offs") | Simulator | R0 `lensInfo`; R2 `LENSES[].noteAr/noteEn`; neutral at R4 (`1b320ae`) | **Moved** to `LENS_INFO` in `src/vision-sim/i18n.js` (monofocal, EDOF, trifocal, toric, cataract) | pending (clinical approval of the simulator is pending, see `CLINICAL_APPROVAL_STATUS.md`) | **Keep** in the simulator; reuse the same strings in the sheet. Appendix C |
| A7 | Defocus (acuity) curve chart with Snellen labels and named distance steps (Distance 6 m+, 1 m, Computer 66 cm, Phone 40 cm, Book 33 cm) | Simulator | R2 `renderDefocusCurveSvg`, `DISTANCE_STEPS`, `LENSES[].va`; removed with the legacy simulator at `7710424` | **Reduced.** A shape-only "Defocus-curve shape (illustrative)" chart exists in the WebGL fallback (`src/vision-sim/fallback.js`) | **unsupported** for the numbers: the cited "BMC Ophthalmology 2019 meta-analysis; ESCRS 2024 abstracts" could not be traced (`CLINICAL_SOURCES.md` line 90) | **Redesign**: keep the idea (a readable curve beside the 3D view) using the new model's output. **Do not restore the `va` tables or the citation.** Named distance steps are worth keeping: Appendix C |
| A8 | Halo and glare rendering | Simulator | R2 canvas `drawHalosAndGlare` | **Moved** (three.js pipeline) | pending | Keep |
| A9 | EDOF "Clinically favored / Favored by Dr. Maan" chip, highlighted card, "Clinical Guidance by Dr. Maan" box | IOL comparison | R2/R3 `renderIolGuide`, `LENSES.edof` | **Removed** in R4 | **no-permission / pending**: registry `medicalPreferences` is empty; D-12 open | **Do not restore** (section 3) |
| A10 | Toric lens description | IOL comparison | R0 `IOL_DATA` | **Present** (lens-implants `types`; simulator `toric`) | pending | Keep |
| A11 | Simulator footnote "mean acuity ≤ 0.2 logMAR counts as functional vision; sources BMC 2019, ESCRS 2024" | Citation | R2 `.vs-note` | **Removed** | **unsupported** | **Do not restore** |

### B. IOL guide questionnaire

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| B1 | Four questions (age, diagnosed conditions, visual priority, previous laser) and their options | Questionnaire | R0 `QUESTIONNAIRE.steps`; R2 `renderQuestionnaire` added a `desc` line to each | **Present** (`renderQuestionnaireCard`). Differences: age bands changed from 45-55 / 56-68 / >68 (R0) to 45-58 / 59-70 / >70 (R2 onward); priority options rewritten | pending | Keep. Keep the `desc` lines |
| B2 | **Answer-driven summary**: up to five result blocks chosen from the answers (night driving, near vision, balanced range, previous laser, existing eye condition) plus a general-advice block | Questionnaire | R0 `QUESTIONNAIRE.results` + `renderQuestionnaireResult` | **Reduced.** Today every user sees the same three fixed items ("Your visual focus", "Corneal imaging", "The final decision"), whatever they answered. The personalisation was lost | pending. Some R0 sentences conflict with guard tests (see B3, section 3) | **Restore, reworded neutrally.** This is the single largest functional regression. Appendix D |
| B3 | R2 result copy: "…EDOF (for driving and screens **with zero halos**) or Trifocal…" | Questionnaire | R2 `renderQuestionnaire` result | **Removed** in R4 | **unsupported** (EDOF reduces halos; it does not eliminate them) | **Do not restore** |
| B4 | R2 priority option "maximum spectacle independence (**95%+**) in all scenarios" | Questionnaire | R2 | **Removed** (now "as little dependence on glasses as possible") | **unsupported** (figure) | **Do not restore** |
| B5 | Result actions: book, prefilled WhatsApp, restart; disclaimer "educational only" | Questionnaire | R0, R2 | **Present** (`q-actions`, `q-safety`) | pending | Keep |
| B6 | R0 line "In glaucoma or macular disease the specialist **usually prefers** monofocal lenses" | Questionnaire | R0 `results.eyeCondition` | **Removed** | pending; trips the `PREFERENCE` regex and states a clinical rule | Restore only as a neutral prompt: "Glaucoma or retinal disease can make some lens designs less suitable; discuss this with the surgeon." |

### C. Educational articles and red flags

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| C1 | Article "What is a cataract and when is surgery indicated?" (three headed sections) | Education | R0 `ARTICLES[0]`; R2 `renderEducation` | **Reduced.** One paragraph on the homepage; the cataract-surgery page covers the same ground in `intro`, `candidates`, `steps` | pending | Keep short on the homepage. **Dedicated page**: restore the headed article text on the procedure page after review, minus the "2.2 mm" figure and the "stitches in most cases" claim. Appendix E |
| C2 | Article "Keratoconus: symptoms, diagnosis, CXL" (what it is; early detection with tomography; riboflavin and UVA) | Education | R0 `ARTICLES[1]` | **Moved** to `/procedures/keratoconus-cxl/` (`intro`, `steps`, `purpose`); short answer on the homepage | pending | Keep; no action beyond adding the "who should be screened (frequent glasses change, eye rubbing)" sentence if missing |
| C3 | Article "Who is a suitable laser candidate? (LASIK, Femto-LASIK, PRK)": criteria list and the Femto-LASIK versus PRK paragraph | Education | R0 `ARTICLES[2]` | **Moved** to `/procedures/laser-vision-correction/` (`candidates`, `types`: LASIK, PRK, SMILE) | pending | Keep; the page is richer than the old article |
| C4 | Article "Patient journey: before, on the day, after cataract surgery" | Education | R0 `ARTICLES[3]` | **Reduced** (homepage short answer; cataract page `steps`/`recovery`) | pending. The "**15 to 20 minutes … zero pain**" wording is a procedure-time and outcome claim | Restore the three-stage structure. State duration only as "usually short" until Dr. Maan confirms a figure. Never "zero pain" |
| C5 | Emergency red-flag card | Education | R0, R2 `emergency-card` | **Present** (`aside.red-flags`) | medical-reference (general) | Keep. Consider an "Eye emergency" shortcut near the booking actions |
| C6 | "Medically supervised / clinical review by Dr. Maan" footer under each article; "peer-reviewed guides" subtitle; "Evidence-based library" label | Education | R2 `renderEducation`; R0 EN `education.desc` | **Removed** (INFORMATION_ARCHITECTURE) | **unsupported**: no review record exists | **Do not restore** until `reviewer`/`reviewedOn` exist (`src/procedures/content.js` `REVIEW`) |
| C7 | Library as four expandable full articles | Education | R0..R5 | **Reduced** to short answers linking to procedure pages | pending | **Dedicated page** option: `/guides/` index for the four guides, reusing procedure-page text, so that full articles are findable without bloating the homepage |

### D. Specialties, diagnostics and devices

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| D1 | Specialty cards (cataract and IOLs; laser; cornea and keratoconus; diagnostics) with tag pills | Services | R0 `specialties.items`; R2 `renderSpecialties` units SURG-01..DIAG-04; R5 `areas` | **Moved** to the 7-procedure gallery | magrabi (units); owner (ICL, transplant, injections, confirmed 2026-11-01) | Keep the gallery |
| D2 | Diagnostics and devices block: corneal tomography (Pentacam), specular microscopy, optical biometry (IOL Master), OCT, eye pressure | Diagnostics | R0 specialty 4; R2 `DIAG-04`; R3 tech cards ("Pentacam HR", "Swept-source biometry", "AI formulas"); R5 neutral `tech` array | **Reduced.** Four generic "core assessments" in `renderEducation` (tomography, biometry, OCT, full exam). "Pentacam" appears once, in the questionnaire result | **unsupported** for named devices at Magrabi: no source confirms the equipment. Generic assessments: medical-reference | **Restore as a "Your examination" strip** using the neutral R5 text (Appendix F). Name a device only after the clinic confirms the list in writing |
| D3 | Four-step "your path": examination and imaging, consultation, procedure, follow-up | Services | R5 `steps` + `.pathway` | **Moved** into each procedure's "What happens" section; the homepage version was removed | pending | **Restore** a compact "Your visit" strip on the homepage and the clinic section. Appendix F |
| D4 | Accreditation line (JCI, CBAHI) | Trust | R0 FAQ and `llms.txt`; R5 `.accreditation` | **Present** (clinic section) | magrabi (as recorded). **Re-check:** Magrabi's pages fetched on 2026-11-02 show badges for **SRC, JCI and CHI** and do not show CBAHI in the fetched text | Keep; re-verify CBAHI against Magrabi before release |
| D5 | "SRC Center of Excellence in Ophthalmology" | Trust | R0 FAQ answer, `llms.txt` | **Removed** (R4) | magrabi (visible on the Magrabi eye page on 2026-11-02: "SRC Network of Excellence") | **Restore with attribution** ("as published by Magrabi Health") once the registry gets a fact id |
| D6 | "Custom Wavefront / بصمة العين", "Specular microscopy", "IOL Master" named | Diagnostics | R2 `DIAG-04`, `SURG-03` tags | **Removed** | **unsupported** | Do not restore |
| D7 | Surgery described as "micro-incision phacoemulsification with premium/smart IOLs" | Services | R0..R3 | **Reduced** to "phacoemulsification" in some copy | promotional ("premium", "العدسات الذكية") | Do not restore the marketing terms |

### E. Physician biography, roles, credentials

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| E1 | Biography: lede and body paragraphs (clinical units, evaluation of lens, keratoconus diagnosis, laser and lens options) | Biography | R0 `profile.bio1/bio2`; R5 `.bio-lede`, `.bio-body` (uses only verified facts); R3 longer version | **Removed** in R6. Cut to one lede line in the profile heading | doctor, magrabi (facts). The R5 text stays inside verified facts | **Restore** the R5 two-paragraph bio on the homepage "Meet Dr. Maan" block and as `/about/`. Needs Dr. Maan's approval of the final wording. Appendix G |
| E2 | Hero quote card: "طب العيون أمانة علمية وإنسانية…" / "Ophthalmology is a sacred clinical trust…" | Biography | R3 `.hero-quote-card` | **Removed** at R5 | **pending**: no recorded author or approval; not in the registry | Archive until Dr. Maan approves and attributes it. If approved, use on the About page. Appendix G |
| E3 | Appointments timeline: Chief of Staff, first president of the Saudi cornea association, Taibah chair (former, 10 years), SOS representative (former), Red Sea conference co-founder | Roles | R2 `DOCTOR.roles` | **Present** (all five roles, every registry fact) | doctor / owner per registry | Keep |
| E4 | Roles published on Magrabi that the site no longer shows: **"عضو المجلس العلمي لمؤتمر البحر الأحمر" (scientific council member)** and **"أمين سر الجمعية السعودية لطب العيون سابقاً" (former secretary, Saudi Ophthalmological Society)** | Roles | R0 `DOCTOR.roles`, `llms.txt`; dropped when the owner replaced the list at R2 | **Removed** | magrabi (published). The Red Sea item overlaps the owner's "co-founder" | **Ask Dr. Maan, then add to the registry.** Do not drop silently; they are magrabi-sourced and strengthen the conference block |
| E5 | "Chief Medical Officer" / "Executive Medical Director" (المدير الطبي التنفيذي) | Roles | R0..R2 | **Replaced** by Chief of Staff | **contradictory** (B-7, D-2): Magrabi's page still reads "المدير الطبي التنفيذي" today | Do not restore. Dr. Maan confirmed "Chief of Staff"; the guard test forbids the other wording. Raise with the clinic |
| E6 | Taibah chair in the present tense | Roles | R0 | **Replaced** by "former chair, 10 years" (owner) | **contradictory** (D-3): Magrabi's page today still says present tense; Taibah lists only "Associate Professor" | No change. Ask the doctor |
| E7 | Qualifications FRCS and Saudi Board; Associate Professor | Credentials | R0 (FRCS), R3 (Saudi Board), Taibah | **Present** | magrabi / doctor | Keep |
| E8 | "Subspecialty fellowship in corneal disease / Cornea Fellowship" | Credentials | R3 `renderQualifications` | **Removed** | **unsupported** | Do not restore |
| E9 | Hero stat "since 1998" (28 years) | Credentials | R2 | **Present** (computed years) | owner | Keep |
| E10 | Hero stat 15,000+ | Credentials | R3 | **Present** with the meaning "examinations and surgical procedures combined" | doctor (confirmed) | Keep. Keep the label |
| E11 | Hero stat "100% adherence to diagnostic protocols" | Credentials | R3 | **Internal only** | unsupported (registry `stat-100-percent`) | Do not restore |
| E12 | Hero stats "+200 verified reviews" and "+70 years of Magrabi care" | Credentials | R0 `hero.stat1/stat3` | **Removed** | "+200 reviews": **unsupported**. "70 years": an institutional claim (Magrabi publishes "founded 1955") not about Dr. Maan | Do not restore as doctor stats. Optionally state "Magrabi Health, founded 1955" in the clinic section with attribution |
| E13 | Floating "Board-certified consultant, Saudi Commission for Health Specialties" badge | Credentials | R3 hero image badge | **Removed** | **unsupported**: no licence record (D-9) | Do not restore |
| E14 | Scientific-participation block: Red Sea 2024 photograph, faculty-session photograph, captions | Biography | R0 gallery; R3 `.sci-grid`; R5 `.conferences` | **Removed** in R6 (images unused) | Owner-supplied photographs. Caption wording must not outrun the registry (council member is magrabi, co-founder is owner) | **Restore** one conference block on the About block with a neutral caption ("Saudi Ophthalmology 2024, The Red Sea"). Confirm consent of the other people visible in the faculty photo |
| E15 | Social links (Instagram, X, YouTube) | Contact | R3 | **Present** | owner | Keep |
| E16 | Taibah email `mbarry@taibahu.edu.sa` | Contact | R0 `DOCTOR.email` (data only, never rendered in R0 to R3) | **Removed** | **no-permission** (institutional address; no consent to publish) | Do not publish |

### F. Testimonials

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| F1 | Three five-star reviews with names (Rakan Al-Abri, Maya Ahmed, Bushra Al-Sharahili), reworded from the Magrabi profile | Testimonials | R0 `REVIEWS`; R3 inline `.review-card`; hidden at R4 | **Removed** (publication gate `isPublishableTestimonial` in place; `credibility.testimonials` is empty) | **no-permission** (registry `testimonials-magrabi`) | Do not restore. Optional: a single link "Patient reviews on the Magrabi profile" (a link, not a copy) once the owner agrees. Appendix H records the old text for traceability only |
| F2 | "Verified patient experiences" label, star glyphs, "+200 reviews" | Testimonials | R0 | **Removed** | **unsupported** | Do not restore |

### G. FAQ

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| G1 | Six site-level questions (specialty; location; booking; simulator guarantee; stopping glasses; laser criteria) | FAQ | R0 `FAQ_DATA`; R3 `renderFaq` | **Present** (`FAQ` in `doctor-data.js`), wording revised: no "100% guarantee", no JCI/SRC claim in the location answer, booking answer lists three routes | doctor / magrabi / pending | Keep |
| G2 | Procedure-level FAQ (3 per page) and `FAQPage` JSON-LD | FAQ | R6 | **Present** (new) | pending | Keep |
| G3 | Old location answer: "accredited by JCI and the American SRC as an ophthalmology centre of excellence" | FAQ | R0 | **Removed** | magrabi (SRC, see D5) | Fold into D5 when restored |

### H. Contact, clinic and hours

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| H1 | Direct clinic line 055 494 6433 (calls and WhatsApp) | Contact | R3 | **Present** | doctor (confirmed 2026-11-01) | Keep |
| H2 | Magrabi WhatsApp 966508533309 | Contact | R0..R2 | **Retired** by the owner | magrabi (verified earlier) but replaced | Do not restore (guard test forbids `508533309`) |
| H3 | Magrabi call centre 920018000 and 19505, booking portal, map link | Contact | R0 | **Present** | magrabi | Keep |
| H4 | Clinic hours "Sat to Thu 9:00 to 9:00" (R0) | Contact | R0 | **Replaced** | **contradictory** with the later confirmed hours | Do not restore |
| H5 | Hours: Saturday to Thursday 9:00 AM to 1:00 PM and 5:00 PM to 9:30 PM | Contact | R2 | **Present**; also in JSON-LD `openingHoursSpecification` | doctor (confirmed) | Keep |
| H6 | JSON-LD `geo`, `priceRange "$$"`, fragment-URL breadcrumbs, `memberOf` that listed roles | SEO | R0 `index.html` | **Removed** | unsupported | Do not restore |
| H7 | Long medical disclaimer incl. "never delay seeking care… in an eye emergency go to the nearest emergency centre" | Safety | R0 `footer.disclaimerText` | **Reduced.** The footer has a one-sentence disclaimer; the red-flag card covers emergencies | medical-reference | **Merge**: add the emergency sentence to the footer disclaimer |

### I. Images in `public/images/` and older references

All files exist in both `public/images/` and the repository-root `images/`, plus byte-identical copies `uploaded_1.png` = `dr-maan-portrait.png`, `uploaded_2.jpg` = `dr-maan-redsea.jpg`, `uploaded_3.jpg` = `dr-maan-faculty.jpg` (same sizes). Only `dr-maan-portrait.png` is referenced by the current `main.js`; `doctor-portrait.jpg` is used for Open Graph and JSON-LD.

| ID | File | What it shows (viewed 2026-11-02) | Last used | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| I1 | `dr-maan-portrait.png` (= `uploaded_1.png`, 295×225) | Doctor portrait | Current hero card | **Present** | owner | Keep; low resolution, so see I3 |
| I2 | `doctor-portrait.jpg` (200×200) | Small grey-background portrait | OG image, JSON-LD | **Present** (metadata only) | owner | Replace with a higher-resolution portrait when the owner supplies one |
| I3 | `dr-maan-redsea.jpg` (= `uploaded_2.jpg`, 682×1024) | Doctor at "Saudi Ophthalmology 2024, The Red Sea" (Saudi Ophthalmological Society branding visible) | R5 hero and conference | **Removed** from the page | owner-supplied | **Restore** as the About portrait or hero candidate. The event logos are visible in the photo, so confirm the owner is content to show them |
| I4 | `dr-maan-faculty.jpg` (= `uploaded_3.jpg`, 1024×768) | Doctor with six colleagues on stage, a screen reading "Don't Miss Day Two", dated 2024 | R5 conference | **Removed** | owner-supplied; **identifiable third parties** | **Restore** in the conference block only after consent is confirmed. Otherwise archive |
| I5 | `clinic-exam-room.jpg` (512×279) | A surgical scene with a wall screen showing corneal maps headed with the doctor's name in Arabic | R5 expertise figure ("corneal imaging is part of every pre-surgical assessment") | **Removed** | **unsupported provenance**: it looks staged or composited | Do not use until the owner confirms it is an authentic Magrabi photograph. Otherwise archive |
| I6 | `cornea-cxl.jpg` (286×512) | A phone mock-up showing an Arabic article and Pentacam maps | R2 specialty card | **Removed** | not a clinical photograph | Archive |
| I7 | `diagnostics-pentacam.jpg` (512×279) | A laboratory bench with an overlay "Comparative IOL Bench Testing – EDOF vs Trifocal" | R2 diagnostics card | **Removed** | **unsupported / fabricated context**: not a Pentacam and not evidence of any test | **Do not restore** |
| I8 | `surgery-phaco.jpg` (512×279) | Post-operative eye drops, protective glasses and a leaflet on a sterile drape | R5 cataract intro figure | **Removed** | plausible authentic; origin unconfirmed | Restore on the cataract-surgery page "After surgery" if the owner confirms the origin |
| I9 | `sim-driving-clear.jpg`, `sim-driving-cataract.jpg` | Night road scenes, clear and cataract | Legacy simulator poster | **Unused** | illustrative | Keep as a non-WebGL poster, or archive |
| I10 | `procedures/*-800.webp`, `*-dark.webp` (28 files) | In-house procedural illustrations for the 7 procedures | R6 | **Present** | in-house | Keep |
| I11 | `src/assets/hero.png`, `typescript.svg`, `vite.svg`, `src/counter.ts`, `src/main.ts` | Vite template leftovers | n/a | Unreferenced | n/a | Archive (housekeeping) |

### J. Medical citations and sources

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| J1 | "BMC Ophthalmology 2019 meta-analysis; ESCRS 2024" for acuity tables | Citation | R2 code comment and `.vs-note` | **Removed** | **unsupported** (not traceable) | Do not restore |
| J2 | Per-procedure sources: AAO EyeSmart, NEI, NHS, FDA links at the foot of each page | Citation | R6 `SOURCES` in `src/procedures/content.js` | **Present** (checked to resolve on 2026-11-01) | medical-reference | Keep |
| J3 | Simulator reference list and approval table (docs only) | Citation | `CLINICAL_SOURCES.md`, `CLINICAL_APPROVAL_STATUS.md` | **Present** in docs; not shown in the UI | medical-reference; bibliographic details not re-checked online | Surface a short "How this model works and its limits" link next to the simulator |

### K. Marketing and positioning copy

| ID | Item | Category | Where it lived | Current status | Verified status | Recommended destination |
|---|---|---|---|---|---|---|
| K1 | Original hero line "رعاية متخصصة لصحة العين: جراحة المياه البيضاء وتصحيح الإبصار" / "Specialized Eye Care, Cataract Surgery & Vision Correction" | Copy | R0 `hero.h1` | **Removed** (hero is name-first) | owner-authored, moderate | Candidate tagline under the name. Copy review needed |
| K2 | "State-of-the-art", "international clinical quality benchmarks", "ensures highest safety and precision", "premium / smart IOLs", "AI formulas for supreme refractive accuracy" | Copy | R0..R3 | **Removed** | unsupported or promotional | Do not restore |

## 3. Do not restore (integrity register)

None of these returns unless the registry marks the underlying fact `confirmed` and the owner updates the guard tests (`tests/phase0-content.spec.js`, `tests/content-registry.spec.js`).

| # | Claim or asset | Source commit | Why it must stay out | Guard |
|---|---|---|---|---|
| 1 | "100% adherence to diagnostic protocols" | R3 `9da524c` | No definition, period or audit; reads as a guarantee. Registry `stat-100-percent`, internal | `UNSUPPORTED_STATS`, `forbiddenPattern` |
| 2 | "+200 verified reviews" hero stat | R0 `93465a6` | Unsupported | none; keep out |
| 3 | "+26 years" derived stat | R3 | Stale arithmetic; the page now computes years from 1998 | test forbids "26+ years" |
| 4 | Three named five-star testimonials and "verified patient experiences" | R0, R3 | Reuse permission undocumented; text was reworded, not quoted; registry `testimonials-magrabi`, `no-permission` | `TESTIMONIAL_PLACEHOLDER`, `isPublishableTestimonial` |
| 5 | "2.2 mm" incision (articles, tech card) | R0, R2, R3 | A technique-specific number presented as universal | `INCISION` |
| 6 | "Zero pain" and an exact "15 to 20 minutes" for surgery | R0 article | Outcome and duration claims with no physician source | none; keep out |
| 7 | EDOF "currently favored by Dr. Maan", "clinically preferred", highlighted card, guidance box | R2, R3 | A personal preference reads as a medical recommendation; D-12 open; `medicalPreferences` empty | `PREFERENCE` |
| 8 | "Zero halos" for EDOF; "95%+ spectacle independence" | R2 | Inaccurate or unsupported figure | none; keep out |
| 9 | "Board-certified consultant, Saudi Commission for Health Specialties" badge; "Board Certified in Ophthalmology" | R3 | No licence or SCFHS record (D-9). Saudi Board **is** confirmed and may be shown as "Saudi Board in Ophthalmology" only | `LICENCE` |
| 10 | "Cornea fellowship / subspecialty fellowship in corneal disease" | R3 | Unverified fellowship | none |
| 11 | "Senior Consultant" (EN) | R3 | Every source says "Consultant" | test forbids |
| 12 | "Chief Medical Officer" / "المدير الطبي التنفيذي" as Dr. Maan's title | R0, R2 | Contradicts the doctor-confirmed "Chief of Staff" (B-7) | test forbids |
| 13 | Magrabi WhatsApp line 966508533309 | R0..R2 | Retired by the owner | test forbids `508533309` |
| 14 | Clinic hours "9:00 to 21:00" | R0 | Conflicted with the confirmed split sessions | none |
| 15 | "Medically supervised by Dr. Maan", "peer-reviewed", "doctor-reviewed" labels on articles | R0 EN, R2 | No review record exists | `REVIEW` is draft; keep |
| 16 | "BMC Ophthalmology 2019 / ESCRS 2024" citation and the `va` acuity tables | R2 | Untraceable (`CLINICAL_SOURCES.md`) | none |
| 17 | JSON-LD `geo`, `priceRange`, fragment breadcrumbs, `memberOf` roles | R0 `index.html` | Unverified or wrongly modelled | `phase0-content.spec.js` |
| 18 | `diagnostics-pentacam.jpg` | R2 | An overlay labels a bench lab "Comparative IOL Bench Testing – EDOF vs Trifocal". It is not a Pentacam and not evidence | n/a |
| 19 | Named devices (Pentacam HR, Swept-source, IOL Master, specular microscopy, "AI formulas") as available at Magrabi | R2, R3 | No source for the equipment | none |
| 20 | Taibah email `mbarry@taibahu.edu.sa` | R0 data | No consent to publish | n/a |
| 21 | Promotional claims ("premium", "smart", "state-of-the-art", "highest safety") | R0..R3 | Marketing language in a medical context | none |
| 22 | "Hero quote card" text as an unattributed quote | R3 | No recorded author or approval. Archive until Dr. Maan approves | none |

## 4. Top restore-worthy items

Ranked by patient value and by how much was lost. Source commits in brackets.

1. **Lens comparison sheet** with per-distance scales and the neutral "how is the lens chosen" note [R0 `93465a6` `IOL_DATA`; best neutral source R5 `a255d39` `renderIolGuide`].
2. **Answer-driven questionnaire summary** (five variants plus general advice) [R0 `93465a6` `QUESTIONNAIRE.results`]. Today's summary ignores the answers.
3. **"Best for" lines per lens**, reworded as "often discussed when…" [R0 `93465a6` `IOL_DATA.bestFor`].
4. **Doctor biography** (two paragraphs, verified facts only) and the About page [R5 `a255d39` `.bio-lede/.bio-body`; R0 `93465a6` `profile.bio1/bio2`].
5. **Scientific-participation block** with the two real conference photographs [R3 `9da524c` `.sci-grid`; R5 `a255d39` `.conferences`; images `dr-maan-redsea.jpg`, `dr-maan-faculty.jpg`].
6. **Four headed guides** (cataract, keratoconus, laser candidacy, patient journey) on dedicated pages, minus "2.2 mm", "zero pain" and the review byline [R0 `93465a6` `ARTICLES`; R2 `2fbf261` `renderEducation`].
7. **"Your visit" four-step pathway** and a generic "your examination" strip [R5 `a255d39` `steps`, `tech`].
8. **Roles published by Magrabi that were dropped**: Red Sea conference scientific council member, former SOS secretary, and "SRC Center of Excellence" for the hospital (all with attribution, after confirmation) [R0 `93465a6` `DOCTOR.roles`, FAQ, `llms.txt`].
9. **Defocus-curve chart concept** rebuilt on the new model, plus the named reading distances (6 m, 1 m, computer 66 cm, phone 40 cm, book 33 cm) [R2 `2fbf261` `renderDefocusCurveSvg`, `DISTANCE_STEPS`].
10. **Post-operative photograph** for the cataract page [R5 `a255d39`, `surgery-phaco.jpg`], and the **footer emergency sentence** [R0 `93465a6` `footer.disclaimerText`].

## 5. Incidental defects found while auditing

- `src/procedures/content.js` line 139 (laser-vision-correction, Arabic `limitations`): "قصو البصر الشيخوخي" has a typo; it should read "قصر البصر الشيخوخي". Not edited, as instructed.
- The root `images/` directory duplicates `public/images/` (same files, same dates). Only `public/` ships.
- Magrabi's own doctor page (fetched 2026-11-02) still lists "المدير الطبي التنفيذي" and the Taibah chair in the present tense. This is the known B-7 conflict. It means the public record and this site disagree until the clinic updates its page.
- `docs/implementation/phase-0-phase-1/DOCTOR_DATA_DECISIONS.md` still describes states that were later superseded (for example "0554946433 not published"). `DOCTOR_CONTENT_RECOVERY.md` and `doctor-data.js` are current; treat the Phase 0 file as history.

---

# Appendices: exact recoverable text

Each block is extracted from `git show <commit>:<file>` and shows line numbers of that revision. Arabic and English are as they existed. Text marked **DO NOT RESTORE** is included only so the implementation agent can recognise it and keep it out.

## Appendix A. Lens comparison, original (R0)

Use for the content of the per-lens columns and the "best for" lines. Reword "bestFor" before use (see A4).

### A.1 `IOL_DATA`, Arabic and English

Source: `git show 93465a6:main.js`, lines 304 to 374 (commit `93465a6`). Columns: type, distance, intermediate, near, glare, bestFor.

```js
// --- IOL COMPARISON DATA ---
const IOL_DATA = {
  ar: [
    {
      type: 'أحادية البؤرة (Monofocal)',
      distance: 'ممتازة وحادة للرؤية البعيدة',
      intermediate: 'قد تحتاج نظارة خفيفة لشاشات الكمبيوتر',
      near: 'تتطلب استخدام نظارة للقراءة القريبة',
      glare: 'أقل احتمالية للهالات والوهج ليلاً',
      bestFor: 'المرضى الذين يفضلون أعلى جودة تباين للقيادة ليلاً ولا يمانعون ارتداء نظارة قراءة.'
    },
    {
      type: 'ممتدة العمق (EDOF)',
      distance: 'ممتازة للرؤية البعيدة',
      intermediate: 'واضحة جداً للمسافات المتوسطة (لوحة القيادة والكمبيوتر)',
      near: 'جيدة للقراءة المتوسطة، قد تلزم نظارة للنصوص الدقيقة',
      glare: 'احتمالية منخفضة إلى معتدلة للهالات',
      bestFor: 'المرضى الراغبين في نطاق رؤية مستمر من البعيد إلى شاشات الكمبيوتر مع تقليل الاعتماد على النظارة.'
    },
    {
      type: 'متعددة/ثلاثية البؤرة (Trifocal)',
      distance: 'جيدة جداً للمسافات البعيدة',
      intermediate: 'جيدة للمسافة المتوسطة (أجهزة التابلت والكمبيوتر)',
      near: 'جيدة للقراءة القريبة والهاتف دون نظارة في معظم الأوقات',
      glare: 'احتمالية أعلى للهالات حول الأضواء ليلاً (تتكيف معها العين عادةً)',
      bestFor: 'المرضى الباحثين عن أقصى درجات الاستغناء عن النظارة في معظم المهام اليومية، مع سلامة القرنية والشبكية.'
    },
    {
      type: 'عدسات توريك (Toric) لتصحيح الاستجماتيزم',
      distance: 'تصحح اللابؤرية الناتجة عن شكل القرنية البيضاوي',
      intermediate: 'تتوفر بتصاميم أحادية أو ممتدة أو ثلاثية',
      near: 'حسب التصميم البؤري المختار',
      glare: 'يعتمد على التصميم البؤري المصاحب',
      bestFor: 'المرضى الذين يعانون من درجات ملحوظة من الاستجماتيزم (اللابؤرية) قبل العملية.'
    }
  ],
  en: [
    {
      type: 'Monofocal IOL',
      distance: 'Sharp, high-contrast distance vision',
      intermediate: 'May need light glasses for computer screens',
      near: 'Requires reading glasses for close tasks',
      glare: 'Lowest incidence of halos and glare at night',
      bestFor: 'Patients prioritizing maximum contrast for night driving who are comfortable using reading glasses.'
    },
    {
      type: 'Extended Depth of Focus (EDOF)',
      distance: 'Excellent distance vision',
      intermediate: 'Very clear intermediate vision (dashboard & screens)',
      near: 'Functional for casual reading; small print may need glasses',
      glare: 'Low to moderate halo profile',
      bestFor: 'Patients seeking continuous vision across distance and intermediate with reduced reliance on glasses.'
    },
    {
      type: 'Trifocal / Multifocal IOL',
      distance: 'Good distance vision',
      intermediate: 'Clear intermediate vision for tablets & laptops',
      near: 'Good near vision for books & smartphones without glasses',
      glare: 'Higher chance of starbursts/halos at night (typically diminishes with neuroadaptation)',
      bestFor: 'Patients desiring maximum spectacle independence for daily tasks, provided ocular surface and retina are healthy.'
    },
    {
      type: 'Toric IOL (Astigmatism Correction)',
      distance: 'Neutralizes pre-existing corneal astigmatism',
      intermediate: 'Available in monofocal, EDOF, or trifocal optics',
      near: 'Depends on optical platform selected',
      glare: 'Depends on accompanying optic design',
      bestFor: 'Patients with significant pre-existing corneal astigmatism seeking sharper uncorrected vision.'
    }
  ]
};
```

### A.2 `renderIOLSection`: column labels and disclaimer

Source: `git show 93465a6:main.js`, lines 965 to 1006 (commit `93465a6`). Column headings are in the `thLabels` array; the educational disclaimer is at the end.

```js
function renderIOLSection(T) {
  const iolData = IOL_DATA[currentLang];
  const rows = iolData.map(l => `
    <tr>
      <td><strong style="color:var(--burgundy);">${l.type}</strong></td>
      <td>${l.distance}</td>
      <td>${l.intermediate}</td>
      <td>${l.near}</td>
      <td>${l.glare}</td>
      <td style="font-size:0.8rem;color:var(--charcoal);">${l.bestFor}</td>
    </tr>
  `).join('');

  const thLabels = currentLang === 'ar'
    ? ['نوع العدسة', 'الرؤية البعيدة', 'الرؤية المتوسطة (كمبيوتر)', 'الرؤية القريبة (قراءة)', 'الهالات والوهج الليلي', 'الفئة الأنسب للمناقشة']
    : ['Lens Type', 'Distance Vision', 'Intermediate (Screens)', 'Near Vision (Reading)', 'Night Halos / Glare', 'Clinical Profile'];

  return `
  <section class="section section-alt" id="cataracts">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${T.iolSection.label}</div>
        <h2>${T.iolSection.title}</h2>
        <p>${T.iolSection.desc}</p>
      </div>
      <div class="fade-in" style="overflow-x:auto;">
        <table class="iol-table">
          <thead>
            <tr>${thLabels.map(l => `<th>${l}</th>`).join('')}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="medical-disclaimer">
        <strong>${currentLang === 'ar' ? 'تنبيه سريري هام:' : 'Important Clinical Notice:'}</strong>
        ${currentLang === 'ar'
          ? 'هذا الجدول تعليمي وتثقيفي ولا يُغني عن استشارة طبيب العيون. لا توجد عدسة واحدة مثالية لكل مريض؛ فاختيار العدسة يعتمد على تضاريس القرنية، صحة الشبكية والعصب البصري، ونتائج القياسات الضوئية الدقيقة (Biometry).'
          : 'This table is educational and does not replace in-person ophthalmic consultation. No lens is universally superior; lens suitability depends on optical biometry, corneal astigmatism, retinal integrity, and lifestyle.'}
      </div>
    </div>
  </section>`;
}
```

## Appendix B. Neutral comparison sheet (R5): best restore source

This is the Phase 0 neutral wording used in the PR #2 redesign. It contains no "favored" claim. The 1-to-4 scores are illustrative and unsourced: keep the "illustrative" legend and align them with the simulator's model.

### B.1 `renderIolGuide` (neutral, R5)

Source: `git show a255d39:main.js`, lines 1291 to 1363 (commit `a255d39`). Includes the three lenses, the four rows, the legend and the "How is the lens chosen?" note.

```js
function renderIolGuide() {
  const lenses = [
    {
      n: tr('ممتدة المدى', 'Extended depth of focus'), code: 'EDOF',
      sub: tr('نطاق رؤية ممتد من البعيد إلى المتوسط، وهالات ليلية أقل عادةً من العدسات متعددة البؤر.', 'An extended range from distance to intermediate, usually with fewer night halos than multifocal designs.'),
      d: [4, tr('ممتازة', 'Excellent')], m: [4, tr('جيدة جداً (الشاشات ولوحة القيادة)', 'Very good (screens & dashboard)')],
      nr: [2, tr('جيدة للأنشطة اليومية، ونظارة خفيفة للخط الدقيق', 'Functional for daily tasks; light glasses for fine print')],
      h: [2, tr('منخفضة عادةً', 'Usually low')], g: tr('غالباً نظارة للقراءة الدقيقة', 'Often needed for fine print')
    },
    {
      n: tr('ثلاثية البؤرة', 'Trifocal'), code: 'Trifocal',
      sub: tr('لتقليل الحاجة للنظارة مع احتمال هالات ليلية.', 'Less need for glasses, with a chance of night halos.'),
      d: [4, tr('ممتازة', 'Excellent')], m: [4, tr('جيدة جداً', 'Very good')],
      nr: [4, tr('جيدة للقراءة دون نظارة غالباً', 'Good; glasses rarely needed')],
      h: [4, tr('أكثر شيوعاً (هالات حلقية ووهج حول الأضواء)', 'More frequent (rings and glare around lights)')], g: tr('استغناء كبير، ويختلف بحسب الإضاءة والتكيف', 'High independence; depends on lighting & adaptation')
    },
    {
      n: tr('أحادية البؤرة', 'Monofocal'), code: 'Monofocal',
      sub: tr('لأعلى نقاء للبعيد مع نظارة للقريب والمتوسط.', 'The sharpest distance vision, with glasses for near and intermediate.'),
      d: [4, tr('ممتازة ونقية', 'Excellent & crisp')], m: [2, tr('تحتاج نظارة غالباً', 'Glasses usually needed')],
      nr: [1, tr('تحتاج نظارة قراءة', 'Reading glasses needed')],
      h: [1, tr('الأقل بين العدسات', 'Lowest of the three')], g: tr('للقراءة والكمبيوتر', 'For reading and computer')
    }
  ];
  const scale = ([score, note], kind) => `<span class="scale scale-${kind}" role="img" aria-label="${score} / 4">${[1, 2, 3, 4].map(k => `<i class="${k <= score ? 'on' : ''}"></i>`).join('')}</span><span class="scale-note">${note}</span>`;
  const rows = [
    ['d', tr('الرؤية البعيدة', 'Distance'), 'good'],
    ['m', tr('المتوسطة (الكمبيوتر)', 'Intermediate (computer)'), 'good'],
    ['nr', tr('القريبة (القراءة)', 'Near (reading)'), 'good'],
    ['h', tr('الهالات الليلية', 'Night halos'), 'halo']
  ];
  return `
  <section class="section section-sand" id="cataracts">
    <div class="container">
      ${sectionHead('04', tr('الماء الأبيض والعدسات', 'Cataract & lens guide'), tr('ماذا يعني الماء الأبيض، وكيف تُختار العدسة؟', 'What a cataract is, and how a lens is chosen'))}

      <div class="cataract-intro">
        <div class="cataract-text fade-in">
          <p class="lede-serif">${tr('الماء الأبيض ليس غشاءً فوق العين، بل عتامة تدريجية في العدسة الطبيعية خلف البؤبؤ، تسبب ضبابية الرؤية وبهتان الألوان والوهج ليلاً.', 'A cataract is not a film over the eye but a gradual clouding of the natural lens behind the pupil — blurring vision, dulling colours and adding glare at night.')}</p>
          <p>${tr('المعيار الأساسي لتوقيت الجراحة هو تأثير ضعف النظر على أنشطتك اليومية. تُستبدل العدسة المعتمة بعدسة صناعية، ويُختار نوعها بعد الفحص والقياسات ومناقشة أولوياتك.', 'The main criterion for timing surgery is how reduced vision affects your daily life. The clouded lens is replaced by an artificial one, whose type is chosen after examination, measurements and a conversation about your priorities.')}</p>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;" class="text-link">${tr('شاهد الفرق في محاكي الرؤية', 'See the difference in the vision simulator')}${icon('arrow', 16)}</a>
        </div>
        <figure class="cataract-figure fade-in">
          <img src="./images/surgery-phaco.jpg" width="512" height="279" alt="${tr('قطرات ونظارة واقية تُستخدم بعد عملية الماء الأبيض', 'Eye drops and protective glasses used after cataract surgery')}" loading="lazy" decoding="async">
          <figcaption>${tr('بعد العملية: قطرات ونظارة واقية وتعليمات متابعة.', 'After surgery: drops, protective glasses and follow-up instructions.')}</figcaption>
        </figure>
      </div>

      <div class="iol-sheet fade-in" role="group" aria-label="${tr('مقارنة العدسات داخل العين', 'Intraocular lens comparison')}">
        ${lenses.map(l => `
        <article class="iol-col">
          <header class="iol-head">
            <p class="iol-code"><bdi dir="ltr">${l.code}</bdi></p>
            <h3>${l.n}</h3>
            <p>${l.sub}</p>
          </header>
          <dl class="iol-rows">
            ${rows.map(([k, label, kind]) => `<div class="iol-row"><dt>${label}</dt><dd>${scale(l[k], kind)}</dd></div>`).join('')}
            <div class="iol-row iol-row-glasses"><dt>${tr('الحاجة للنظارة', 'Glasses')}</dt><dd>${l.g}</dd></div>
          </dl>
        </article>`).join('')}
      </div>
      <p class="iol-legend fade-in"><span class="scale scale-good" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span>${tr('عدد الخانات الممتلئة يعبّر عن مستوى الأداء، أو عن تكرار الهالات في صف الهالات.', 'Filled marks show the level of performance — or, for halos, how often they occur.')}</p>

      <aside class="note fade-in">
        <h3>${tr('كيف يُحدَّد نوع العدسة؟', 'How is the lens chosen?')}</h3>
        <p>${tr(
          'لا توجد عدسة واحدة تناسب جميع المرضى. لكل نوع مزايا وحدود: أحادية البؤرة تعطي رؤية بعيدة نقية مع الحاجة لنظارة للقريب، وممتدة المدى توسّع نطاق الرؤية للمسافات المتوسطة، وثلاثية البؤرة تقلل الحاجة لنظارة القراءة مع احتمال أكبر للهالات. يُبنى الاختيار على الفحص السريري وقياسات العين وعلى أولوياتك اليومية، بالتشاور مع طبيب العيون المعالج.',
          'No single lens suits every patient. Each type has trade-offs: monofocal lenses give clear distance vision but need glasses for near; EDOF lenses extend the range into intermediate distances; trifocal lenses reduce the need for reading glasses with a higher chance of halos. The choice depends on your examination, eye measurements and daily priorities, decided with your treating ophthalmologist.')}</p>
      </aside>
    </div>
  </section>`;
}
```

## Appendix C. Per-lens notes and distance steps

C.1 is the original simulator wording; C.2 is the neutral Phase 0 wording; C.3 is the current in-app wording that should stay the single source. C.4 is the old named-distance list worth reusing. C.5 is the old curve chart code, for design reference only (do not reuse its numbers).

### C.1 Original per-lens notes (R0)

Source: `git show 93465a6:main.js`, lines 1021 to 1038 (commit `93465a6`). 

```js
  const lensInfo = {
    cataract: {
      ar: 'محاكاة تأثير المياه البيضاء: ضبابية في الرؤية، انخفاض شديد في التباين، وتشتت الضوء حول المصابيح ليلاً.',
      en: 'Cataract Simulation: progressive blurriness, reduced contrast sensitivity, and scattering of light around headlights.'
    },
    monofocal: {
      ar: 'عدسة أحادية البؤرة: رؤية بعيدة نقية وحادة جداً مع تباين ممتاز، بينما قد تبدو شاشات الهاتف والكتب غير واضحة بدون نظارة قراءة.',
      en: 'Monofocal IOL: crisp high-contrast distance clarity, with near and smartphone tasks requiring reading glasses.'
    },
    edof: {
      ar: 'عدسة ممتدة العمق: امتداد في وضوح الرؤية من المسافة البعيدة وحتى المسافات المتوسطة (لوحة القيادة والشاشات) مع احتمالية منخفضة للهالات.',
      en: 'EDOF IOL: extended range from distance to intermediate tasks (screens, dashboard) with minimal dysphotopsia.'
    },
    trifocal: {
      ar: 'عدسة ثلاثية البؤرة: توفير رؤية وظيفية متزامنة للبعيد والمتوسط والقريب مع تقليل الحاجة للنظارة، مصحوبة بهالات دائرية خفيفة حول الأضواء تتكيف معها العين عادة.',
      en: 'Trifocal IOL: simultaneous functional vision across near, intermediate, and far tasks, accompanied by subtle night halos that adapt over time.'
    },
  };
```

### C.2 Neutral lens notes after Phase 0 (R4)

Source: `git show 1b320ae:main.js`, lines 16 to 49 (commit `1b320ae`). The `va` arrays are the untraceable acuity tables: **do not reuse them**. Only the `noteAr/noteEn` strings are recoverable.

```js
  const LENSES = {
    edof: {
      ar: 'ممتدة المدى (EDOF)',
      en: 'Extended Depth of Focus (EDOF)',
      va: [0, .03, .08, .13, .18, .23, .36, .5],
      halo: .16,
      noteAr: 'مصممة لتمديد نطاق الرؤية من البعيد إلى المسافات المتوسطة (الشاشات ولوحة القيادة)، وتكون الهالات الليلية فيها عادةً أقل من العدسات متعددة البؤر. غالباً ما تلزم نظارة للقراءة الدقيقة. يحدد الطبيب مدى ملاءمتها بعد الفحص.',
      noteEn: 'Designed to extend the range of vision from distance to intermediate (screens, dashboard), usually with fewer night halos than multifocal designs. Reading glasses are often needed for fine print. Suitability is decided after examination.'
    },
    trifocal: {
      ar: 'ثلاثية البؤرة (Trifocal)',
      en: 'Trifocal',
      va: [0, .08, .12, .1, .08, .1, .17, .32],
      halo: .78,
      noteAr: 'استقلالية أكبر عن نظارة القراءة للمسافات القريبة، ولكن نظراً لانقسام الضوء بين 3 بؤر فقد تنخفض حساسية التباين وتزداد الهالات الحلقية والوهج ليلاً مقارنة بعدسات EDOF، وتتطلب وقتاً للتكيف العصبي.',
      noteEn: 'Provides high near spectacle independence; however, light division can reduce contrast and generate concentric night halos/glare compared to EDOF, requiring neuroadaptation.'
    },
    monofocal: {
      ar: 'أحادية البؤرة (Monofocal)',
      en: 'Monofocal',
      va: [0, .1, .18, .32, .42, .5, .58, .66],
      halo: .08,
      noteAr: 'أعلى نقاء وتباين للمسافات البعيدة وأقل هالات ليلية؛ تتطلب غالباً نظارة للمسافات المتوسطة (الكمبيوتر) والقريبة (القراءة).',
      noteEn: 'Purest distance acuity and lowest halos; usually requires glasses for intermediate (computer) and near (reading).'
    },
    cataract: {
      ar: 'ساد غير معالج (عتامة العدسة)',
      en: 'Untreated Cataract',
      va: [.5, .5, .52, .52, .55, .55, .58, .6],
      halo: 0,
      noteAr: 'عتامة متوسطة تشوش الرؤية وتسبب تشتت الضوء والوهج وانخفاض التباين، ولا يمكن تصحيحها بالنظارات.',
      noteEn: 'Moderate lens opacity causing blur, severe glare scatter, and loss of contrast, not correctable by glasses.'
    }
  };
```

### C.4 Named reading distances (R2)

Source: `git show 2fbf261:main.js`, lines 94 to 100 (commit `2fbf261`). 

```js
const DISTANCE_STEPS = [
  [0, 'بعيد (٦م+)', 'Distance (6m+)'],
  [-1, '١ متر', '1 m'],
  [-1.5, 'كمبيوتر ٦٦سم', 'Computer 66cm'],
  [-2.5, 'جوال ٤٠سم', 'Phone 40cm'],
  [-3, 'كتاب ٣٣سم', 'Book 33cm']
];
```

### C.5 Old defocus-curve chart, design reference only (R2)

Source: `git show 2fbf261:main.js`, lines 384 to 416 (commit `2fbf261`). **Do not restore the numbers or the BMC/ESCRS citation.**

```js
function renderDefocusCurveSvg() {
  const mapX = d => 70 + (-d / 3.5) * 600;
  const mapY = logmar => 26 + (logmar / 0.8) * 230;

  let svg = `<svg viewBox="0 0 720 300" class="vs-svg" role="img" aria-label="defocus curve">`;
  svg += `<rect x="70" y="${mapY(0)}" width="600" height="${mapY(0.2) - mapY(0)}" fill="var(--vs-band)"/>`;

  [[0, '20/20'], [0.1, '20/25'], [0.2, '20/32'], [0.3, '20/40'], [0.5, '20/63'], [0.7, '20/100']].forEach(([lm, sn]) => {
    svg += `<line x1="70" x2="670" y1="${mapY(lm)}" y2="${mapY(lm)}" stroke="var(--vs-grid)"/>`;
    svg += `<text x="62" y="${mapY(lm) + 4}" text-anchor="end" class="vs-t">${sn}</text>`;
  });

  DISTANCE_STEPS.forEach(([d, ar, en]) => {
    svg += `<line x1="${mapX(d)}" x2="${mapX(d)}" y1="26" y2="256" stroke="var(--vs-grid)" stroke-dasharray="3 4"/>`;
    svg += `<text x="${mapX(d)}" y="274" text-anchor="middle" class="vs-t">\u200E${d.toFixed(1).replace('-', '−')} D</text>`;
    svg += `<text x="${mapX(d)}" y="290" text-anchor="middle" class="vs-t2">${tText(ar, en)}</text>`;
  });

  const colors = { monofocal: '#5b7f95', edof: '#3f8f87', trifocal: '#8a6a3d', cataract: '#a35a52' };
  Object.keys(LENSES).forEach(k => {
    const isActive = (k === simState.lens);
    const pts = DEFOCUS_STEPS.map((step, idx) => `${mapX(step)},${mapY(LENSES[k].va[idx])}`).join(' ');
    svg += `<polyline points="${pts}" fill="none" stroke="${colors[k]}" stroke-width="${isActive ? 3.2 : 1.4}" opacity="${isActive ? 1 : 0.35}" ${k === 'cataract' ? 'stroke-dasharray="5 4"' : ''}/>`;
  });

  const curX = mapX(simState.D);
  const curY = mapY(getAcuity(simState.lens, simState.D));
  svg += `<line x1="${curX}" x2="${curX}" y1="26" y2="256" stroke="var(--vs-ink)" opacity=".5"/>`;
  svg += `<circle cx="${curX}" cy="${curY}" r="6" fill="var(--vs-surface)" stroke="var(--vs-ink)" stroke-width="2.5"/>`;
  svg += `</svg>`;

  return svg;
}
```

### C.3 Current wording in the working tree

Source: `src/vision-sim/i18n.js`, lines 113 to 135 (HEAD).

```js
};

/** Neutral, non-promotional lens descriptions: intended range and trade-offs. */
export const LENS_INFO = {
  ar: {
    monofocal: { intended: 'رؤية واضحة لمسافة واحدة، غالباً البعيد.', tradeoffs: 'أقل هالات ليلية وأعلى تباين، لكن غالباً تلزم نظارة للقراءة والشاشات.' },
    edof: { intended: 'مدى ممتد من البعيد إلى المسافات المتوسطة (الشاشات ولوحة القيادة).', tradeoffs: 'قد تلزم نظارة للقراءة الدقيقة؛ تباين أقل قليلاً وهالات خفيفة لدى بعض التصاميم.' },
    trifocal: { intended: 'ثلاث بؤر: بعيد ومتوسط وقريب، لتقليل الحاجة إلى النظارة.', tradeoffs: 'انقسام الضوء يقلل التباين وقد يسبب هالات ووهجاً ليلاً، ويحتاج تكيّفاً.' },
    toric: { intended: 'تصحيح استجماتيزم القرنية مع البؤرة المختارة (هنا: أحادية البؤرة).', tradeoffs: 'تعتمد الفائدة على دقة محور العدسة وثباته؛ الدوران يقلل التصحيح.' },
    cataract: { intended: 'للمقارنة فقط: عدسة طبيعية معتمة قبل الجراحة.', tradeoffs: 'تشتت الضوء يسبب ضبابية ووهجاً واصفراراً للألوان، ولا تصححه النظارات بالكامل.' },
  },
  en: {
    monofocal: { intended: 'Clear vision at one distance, usually far.', tradeoffs: 'Fewest night halos and highest contrast; glasses are usually needed for reading and screens.' },
    edof: { intended: 'An extended range from distance to intermediate (screens, dashboard).', tradeoffs: 'Reading glasses may be needed for fine print; slightly lower contrast and mild halos with some designs.' },
    trifocal: { intended: 'Three foci — distance, intermediate and near — to reduce reliance on glasses.', tradeoffs: 'Splitting light lowers contrast and can cause halos and glare at night; adaptation takes time.' },
    toric: { intended: 'Corrects corneal astigmatism with the chosen focus (shown here: monofocal).', tradeoffs: 'The benefit depends on accurate, stable lens alignment; rotation reduces the correction.' },
    cataract: { intended: 'For comparison only: a cloudy natural lens before surgery.', tradeoffs: 'Light scatter causes haze, glare and faded colours; glasses cannot fully correct it.' },
  },
};

export function fmt(lang, n, digits = 0) {
  try {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
```

## Appendix D. Questionnaire

D.1 is the original answer-driven result logic and copy (R0). Restore the **structure** (a result chosen from the answers). Reword anything that says a lens is "preferred" or "usually" the clinical choice, and keep the educational disclaimer. D.2 is the R2 copy that must not return. D.3 is the current questionnaire (working tree).

### D.1 Original questions, options and result variants (R0)

Source: `git show 93465a6:main.js`, lines 594 to 710 (commit `93465a6`). The result selection logic is in `renderQuestionnaireResult` (R0 lines 1291 to 1323): night driving, near vision or balanced; previous laser adds a block; an eye condition adds a block; general advice always closes.

```js
// --- QUESTIONNAIRE DATA ---
const QUESTIONNAIRE = {
  ar: {
    steps: [
      {
        question: 'ما هي الفئة العمرية التقريبية للمريض؟',
        options: ['أقل من 45 سنة', '45 إلى 55 سنة', '56 إلى 68 سنة', 'أكثر من 68 سنة', 'لست متأكداً']
      },
      {
        question: 'هل تم تشخيصك سابقاً بأي من الحالات العينية التالية؟',
        options: [
          'لا توجد حالات مشخصة معروفة',
          'جلوكوما (ارتفاع ضغط العين)',
          'اعتلال الشبكية السكري أو أمراض قاع العين',
          'قرنية مخروطية أو جفاف شديد مزمن',
          'لست متأكداً تماماً'
        ]
      },
      {
        question: 'ما هي أولويتك البصرية الأساسية التي ترغب بمناقشتها مع الطبيب؟',
        options: [
          'القيادة الليلية وأعلى جودة تباين للمسافات البعيدة',
          'القراءة المريحة واستخدام الهاتف الذكي دون نظارة',
          'رؤية متوازنة عبر مختلف المسافات (الكمبيوتر والأنشطة اليومية)',
          'لست متأكداً بعد'
        ]
      },
      {
        question: 'هل خضعت في السابق لأي جراحة تصحيح نظر بالليزر (ليزك، ليزر سطحي)؟',
        options: ['نعم، أجريت عملية تصحيح نظر سابقة', 'لا، لم أجرِ أي عملية سابقة', 'لست متأكداً']
      }
    ],
    results: {
      nightDriving: {
        title: 'أولوية القيادة الليلية وجودة التباين',
        text: 'تعد جودة الرؤية الليلية وانخفاض احتمالية الهالات حول مصابيح السيارات من أهم النقاط التي تناقشها مع الطبيب. العدسات أحادية البؤرة أو بعض عدسات EDOF توفر نقاءً عالياً للتباين ليلاً، مع الحاجة لنظارة للقراءة القريبة.'
      },
      nearVision: {
        title: 'أولوية القراءة واستخدام الهاتف الذكي',
        text: 'إذا كان تقليل الاعتماد على نظارة القراءة في مقدمة أهدافك، فناقش مع الطبيب ملاءمة عينك لعدسات الترايفوكل (Trifocal) التي تتيح تركيزاً قريباً، مع التأكد من سلامة سطح القرنية والشبكية.'
      },
      balanced: {
        title: 'رؤية ممتدة ومتوازنة لنمط الحياة العصري',
        text: 'قد تكون العدسات ممتدة عمق التركيز (EDOF) خياراً متوازناً لتغطية المسافة البعيدة والمتوسطة (شاشات الكمبيوتر ولوحة السيارة) مع احتمالية أقل لظواهر الوهج الليلي مقارنة بالعدسات المتعددة التقليدية.'
      },
      previousLasik: {
        title: 'أهمية الإفصاح عن جراحات الليزك السابقة',
        text: 'تؤثر عمليات الليزك السابقة على انحناء القرنية السطحي، وتتطلب معادلات حسابية خاصة (Post-refractive IOL formulas) لحساب قوة العدسة بدقة لتفادي أي انحراف بعد العملية.'
      },
      eyeCondition: {
        title: 'التأثير المتبادل للحالات العينية المصاحبة',
        text: 'في حال وجود جلوكوما أو اعتلال بالشبكية، يُفضل استشاري العيون عادةً العدسات أحادية البؤرة فائقة التباين لحماية حساسية الضوء وعدم إجهاد العصب البصري.'
      },
      generalAdvice: {
        title: 'الخطوة التالية الموصى بها',
        text: 'هذه الإرشادات تثقيفية تهدف لترتيب أولوياتك. القرار العلاجي الحاسم يُتخذ داخل العيادة بعد الفحص المجهري وتصوير تضاريس القرنية وقياسات بيومترية متطورة مع د. معن البري.'
      }
    }
  },
  en: {
    steps: [
      {
        question: 'What is your approximate age group?',
        options: ['Under 45 years', '45 to 55 years', '56 to 68 years', 'Over 68 years', 'Not certain']
      },
      {
        question: 'Do you have any previously diagnosed eye conditions?',
        options: [
          'No known diagnosed eye conditions',
          'Glaucoma (elevated eye pressure)',
          'Diabetic retinopathy or macular condition',
          'Keratoconus or severe chronic dry eye',
          'Not completely certain'
        ]
      },
      {
        question: 'What is your primary visual priority to discuss with the surgeon?',
        options: [
          'Night driving clarity & high contrast for distance',
          'Smartphone use & reading without reading glasses',
          'Balanced continuous vision (computer screens & daily tasks)',
          'Not certain yet'
        ]
      },
      {
        question: 'Have you had prior laser vision correction (LASIK, PRK)?',
        options: ['Yes, prior refractive surgery', 'No prior eye surgery', 'Not certain']
      }
    ],
    results: {
      nightDriving: {
        title: 'Priority: Night Driving & Contrast Sensitivity',
        text: 'Preserving high contrast sensitivity and minimizing dysphotopsias (halos/starbursts) is paramount. Monofocal or specific EDOF optics generally offer superior nighttime optical purity with reading glasses retained for fine print.'
      },
      nearVision: {
        title: 'Priority: Near Vision & Spectacle Independence',
        text: 'If near tasks without glasses are your goal, discuss trifocal IOL designs with your surgeon, provided your macula and corneal optical surface demonstrate excellent baseline health.'
      },
      balanced: {
        title: 'Priority: Extended Intermediate & Modern Lifestyle',
        text: 'Extended Depth of Focus (EDOF) lenses provide a balanced optical continuum across distance and intermediate (dashboard, laptops) with an easier neuroadaptation profile than classic multifocals.'
      },
      previousLasik: {
        title: 'Clinical Value of Prior LASIK Disclosure',
        text: 'Previous corneal refractive surgery alters standard keratometry. Specialized post-refractive biometric formulas must be utilized to calculate target intraocular lens power accurately.'
      },
      eyeCondition: {
        title: 'Ocular Co-morbidities & Lens Selection',
        text: 'In the presence of optic nerve compromise (glaucoma) or macular pathology, monofocal platforms are often clinically preferred to safeguard contrast sensitivity.'
      },
      generalAdvice: {
        title: 'Next Clinical Step',
        text: 'These guidelines serve as educational discussion points. Final surgical candidacy and lens selection are determined during comprehensive clinical evaluation and advanced biometry with Dr. Maan Al Barry.'
      }
    }
  }
};
```

### D.1b Original result selection function (R0)

Source: `git show 93465a6:main.js`, lines 1291 to 1323 (commit `93465a6`). 

```js
function renderQuestionnaireResult(T) {
  const R = QUESTIONNAIRE[currentLang].results;
  const items = [];

  const priorityAnswer = qAnswers[2];
  if (priorityAnswer === 0) items.push(R.nightDriving);
  else if (priorityAnswer === 1) items.push(R.nearVision);
  else items.push(R.balanced);

  if (qAnswers[3] === 0) items.push(R.previousLasik);
  if (qAnswers[1] !== 0 && qAnswers[1] !== 4 && qAnswers[1] !== undefined) items.push(R.eyeCondition);
  items.push(R.generalAdvice);

  return `
  <div class="q-result">
    <h3>${currentLang === 'ar' ? 'ملخص النقاط التثقيفية المقترحة لمناقشتها مع الطبيب' : 'Suggested Discussion Points for Your Doctor Visit'}</h3>
    <p style="color:var(--gray-600);font-size:0.95rem;margin-bottom:var(--space-6);">${currentLang === 'ar' ? 'بناءً على أولوياتك، هذه بعض النقاط العلمية التي يُنصح بطرحها أثناء الفحص الإكلينيكي في مغربي:' : 'Based on your selected priorities, here are key clinical topics to explore during your consultation at Magrabi:'}</p>
    <div class="q-result-items">
      ${items.map(item => `
        <div class="q-result-item">
          <h4>${item.title}</h4>
          <p>${item.text}</p>
        </div>
      `).join('')}
    </div>
    <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-8);">
      <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener" class="btn btn-primary">${T.bookNow}</a>
      <a href="${whatsappUrl('مرحباً، أود الاستفسار عن استشارة حول عمليات المياه البيضاء وخيارات العدسات مع د. معن البري.')}" target="_blank" rel="noopener" class="btn btn-whatsapp">${currentLang === 'ar' ? 'استفسر عبر واتساب' : 'Inquire via WhatsApp'}</a>
      <button class="btn btn-outline" onclick="restartQ()">${currentLang === 'ar' ? 'إعادة الإجابة' : 'Restart Questionnaire'}</button>
    </div>
    <div class="medical-disclaimer" style="margin-top:var(--space-6);text-align:start;">${T.qDisclaimer}</div>
  </div>`;
}
```

### D.2 R2 result block and 95% option: DO NOT RESTORE

Source: `git show 2fbf261:main.js`, lines 1237 to 1275 (commit `2fbf261`). Contains "zero halos" and the 95% option context. Shown only for recognition.

```js
  if (qCompleted) {
    return `
    <section class="section" id="questionnaire">
      <div class="container">
        <div class="section-header fade-in">
          <div class="section-label">${currentLang === 'ar' ? 'تقرير نمط الحياة البصري الاسترشادي' : 'Visual Lifestyle Report'}</div>
          <h2>${currentLang === 'ar' ? 'النقاط المقترحة لمناقشتها مع الدكتور معن بن عبدالله البري' : 'Discussion Points for Your Ophthalmic Consultation'}</h2>
        </div>
        <div class="questionnaire fade-in">
          <div class="q-result">
            <h3 style="color:var(--secondary-burgundy);margin-bottom:var(--space-3);">
              ${currentLang === 'ar' ? 'تم تجهيز ملخص أولوياتك البصرية' : 'Your Discussion Summary is Ready'}
            </h3>
            <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:var(--space-6);">
              ${currentLang === 'ar' ? 'بناءً على إجاباتك الأربع، هذه المحاور العلمية التي يوصى بطرحها ومناقشتها خلال جلستك في عيادة مغربي بالمدينة المنورة:' : 'Based on your selected priorities, here are key clinical topics to explore during your consultation at Magrabi:'}
            </p>

            <div class="q-result-item">
              <h4>${currentLang === 'ar' ? 'الأولوية الوظيفية المستهدفة' : 'Target Visual Focus'}</h4>
              <p>${currentLang === 'ar' ? 'مناقشة موازنة الرؤية بين عدسات EDOF (للقيادة والشاشات مع انعدام الهالات) أو عدسات Trifocal (للقراءة بدون نظارات مع فترة تكيف عصبي).' : 'Evaluate EDOF for pure night contrast vs Trifocals for complete spectacle independence with neuroadaptation.'}</p>
            </div>

            <div class="q-result-item">
              <h4>${currentLang === 'ar' ? 'الفحوصات الطبوغرافية الموصى بها' : 'Required Diagnostic Profiling'}</h4>
              <p>${currentLang === 'ar' ? 'إجراء فحص البنتاكام (Pentacam) لاستبعاد الاستجماتيزم غير المنتظم والتأكد من ملاءمة العدسات متعددة البؤرة لسطح قرنيتك.' : 'Perform Pentacam Scheimpflug tomography to evaluate regular vs irregular astigmatism before premium IOL selection.'}</p>
            </div>

            <div class="q-result-item">
              <h4>${currentLang === 'ar' ? 'تحديد الخيار الجراحي النهائي' : 'Final Surgical Confirmation'}</h4>
              <p>${currentLang === 'ar' ? 'يتم اتخاذ القرار النهائي بناءً على قياسات طول العين بالموجات الضوئية (IOL Master) وفحص قاع العين المباشر مع الدكتور.' : 'Target lens power is calculated using optical biometry paired with thorough clinical examination by Dr. Maan.'}</p>
            </div>

            <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-8);">
              <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                ${currentLang === 'ar' ? 'حجز موعد فحص القرنية والعدسات' : 'Book Exam Appointment'}
              </a>
              <a href="${getWhatsAppUrl('مرحباً، أجريت استبيان نمط الحياة البصري على الموقع وأرغب بالاستفسار عن حجز موعد مع د. معن البري.')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                ${currentLang === 'ar' ? 'تنسيق الموعد عبر واتساب' : 'Inquire via WhatsApp'}
              </a>
```

### D.3 Current questionnaire (working tree)

Source: `main.js`, lines 648 to 687 (HEAD). The result block is fixed and ignores the answers.

```js
  const content = {
    ar: {
      steps: [
        { question: 'ما هي فئتك العمرية التقريبية؟', desc: 'تساعد لمعرفة درجة التكيف العصبي الطبيعي وجفاف العين الفسيولوجي.', options: ['أقل من 45 سنة', '45 إلى 58 سنة', '59 إلى 70 سنة', 'أكثر من 70 سنة', 'لست متأكداً'] },
        { question: 'هل تم تشخيصك سابقاً بأي من حالات العين التالية؟', desc: 'بعض حالات الشبكية وارتفاع ضغط العين تتطلب اختيار عدسات تحافظ على أعلى حساسية للتباين.', options: ['لا توجد حالات سابقة معتمدة (سليمة)', 'ارتفاع ضغط العين أو ماء أزرق (Glaucoma)', 'اعتلال بمركز الإبصار أو السكري بالشبكية', 'قرنية مخروطية أو جفاف عين مزمن', 'لست متأكداً تماماً (أرغب بفحص شامل)'] },
        { question: 'ما هي الأولوية البصرية الأهم في نمط حياتك اليومي؟', desc: 'تساعد على تحديد النطاق البصري الأكثر استخداماً خلال يومك.', options: ['القيادة الليلية ووضوح الرؤية البعيدة مع أقل قدر من الهالات', 'العمل المكتبي، شاشات الحاسوب، ولوحة قيادة السيارة (مسافة ممتدة)', 'قراءة المصحف الشريف والهاتف الذكي دون نظارة', 'أقل اعتماد ممكن على النظارات'] },
        { question: 'هل سبق لك إجراء عملية ليزك أو تصحيح نظر سابق؟', desc: 'العيون التي خضعت لعمليات سابقة تحتاج معادلات حسابية خاصة (Barrett True-K).', options: ['لم أجرِ أي عملية سابقة (قرنية طبيعية)', 'نعم، أجريت فيمتو ليزك أو ليزر سطحي PRK', 'نعم، خضعت لتثبيت قرنية مخروطية CXL', 'لست متأكداً من التاريخ الجراحي الدقيق'] }
      ]
    },
    en: {
      steps: [
        { question: 'What is your approximate age group?', desc: 'Guides expectations regarding neuroadaptation and ocular surface status.', options: ['Under 45 years', '45 to 58 years', '59 to 70 years', 'Over 70 years', 'Not certain'] },
        { question: 'Do you have any previously diagnosed eye conditions?', desc: 'Conditions such as glaucoma or maculopathy influence which lens designs are suitable.', options: ['No diagnosed conditions (healthy eyes)', 'Glaucoma or elevated eye pressure', 'Diabetic retinopathy or macular condition', 'Keratoconus or severe chronic dry eye', 'Not certain (I would like a complete exam)'] },
        { question: 'What is your main visual priority day to day?', desc: 'Defines the viewing distance you rely on most.', options: ['Night driving and sharp distance vision with as few halos as possible', 'Computer work, laptops and the dashboard (intermediate range)', 'Smartphone use and book reading without reading glasses', 'As little dependence on glasses as possible'] },
        { question: 'Have you had previous laser vision correction (LASIK / PRK)?', desc: 'Eyes with previous refractive surgery need specialised lens calculations (e.g., Barrett True-K).', options: ['No previous surgery', 'Yes, prior Femto-LASIK or PRK', 'Yes, prior corneal cross-linking (CXL)', 'Not certain of my surgical history'] }
      ]
    }
  }[currentLang];

  if (qCompleted) {
    return `
      <div class="questionnaire">
        <div class="q-result" role="status">
          <p class="q-step-label">${tr('الملخص', 'Summary')}</p>
          <h3>${tr('ملخص أولوياتك البصرية جاهز', 'Your discussion summary is ready')}</h3>
          <p class="q-desc">${tr('بناءً على إجاباتك، هذه محاور يُستحسن مناقشتها خلال الاستشارة:', 'Based on your answers, these are topics worth raising in your consultation:')}</p>
          <ol class="q-result-list">
            <li class="q-result-item"><h4>${tr('الأولوية الوظيفية المستهدفة', 'Your visual focus')}</h4><p>${tr('الموازنة بين أنواع العدسات بحسب أولوياتك: نطاق الرؤية المطلوب، واحتمال الهالات الليلية، والحاجة المتوقعة للنظارة.', 'The trade-offs between lens types for your priorities: the range you need, the chance of night halos, and expected need for glasses.')}</p></li>
            <li class="q-result-item"><h4>${tr('فحص القرنية', 'Corneal imaging')}</h4><p>${tr('فحص البنتاكام (Pentacam) لاستبعاد الاستجماتيزم غير المنتظم والتأكد من ملاءمة العدسات متعددة البؤرة لسطح قرنيتك.', 'Pentacam tomography to check for irregular astigmatism before considering multifocal lens designs.')}</p></li>
            <li class="q-result-item"><h4>${tr('القرار النهائي', 'The final decision')}</h4><p>${tr('يُتخذ القرار بناءً على قياسات العين الحيوية وفحص قاع العين مع الطبيب.', 'Lens power is calculated from optical biometry together with a full clinical examination.')}</p></li>
          </ol>
          <div class="q-actions">
            <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary" data-cta="book"><span class="btn-label">${tr('احجز موعد الفحص', 'Book an examination')}</span></a>
            <a href="${getWhatsAppUrl('مرحباً، أجريت استبيان نمط الحياة البصري على الموقع وأرغب بالاستفسار عن حجز موعد مع د. معن البري.')}" ${EXT} class="btn btn-whatsapp" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('واتساب', 'WhatsApp')}</span></a>
            <button type="button" class="btn btn-quiet" onclick="restartQ()">${tr('إعادة الاستبيان', 'Restart')}</button>
          </div>
          <p class="q-safety"><strong>${tr('تنبيه:', 'Note:')}</strong> ${tr('هذا الملخص تثقيفي فقط ولا يمثل تشخيصاً أو وصفة لنوع عدسة. القرار الطبي يتخذه الاستشاري بعد الفحص المباشر.', 'This summary is educational only and is not a diagnosis or a lens prescription. Treatment decisions follow an in-person examination.')}</p>
        </div>
      </div>`;
  }
```

## Appendix E. Educational articles

E.1 is the full article text, Arabic and English, as first written (R0; identical in R2 apart from the footer). Before restoring: delete the "2.2" mm figure (cataract article, both languages), the "no stitches in most cases" claim, "zero pain" and the exact "15 to 20 minutes" (patient journey article), and the word "Pentacam" unless the clinic confirms the device. Titles and headings are safe to reuse. All text is `pending` physician review.

### E.1 `ARTICLES` (R0)

Source: `git show 93465a6:main.js`, lines 376 to 492 (commit `93465a6`). 

```js
// --- MEDICAL EDUCATION LIBRARY ARTICLES ---
const ARTICLES = {
  ar: [
    {
      id: 'cataract-guide',
      title: 'ما هي المياه البيضاء (الساد) ومتى تصبح الجراحة ضرورية؟',
      summary: 'إعتام طبيعي يصيب عدسة العين مع التقدم في العمر، ولا تعالج بالأدوية بل بالجراحة الدقيقة عند تأثيرها على الحياة اليومية.',
      content: `
        <h4>ما هو إعتام عدسة العين؟</h4>
        <p>المياه البيضاء ليست غشاءً ينمو فوق سطح العين، بل هي عتامة تدريجية في العدسة الطبيعية الشفافة الموجودة داخل العين خلف بؤبؤ العين. تؤدي هذه العتامة إلى تشتت الضوء الداخل إلى الشبكية، مما يسبب ضبابية الرؤية، بهتان الألوان، وصعوبة القيادة ليلاً بسبب الوهج.</p>
        <h4>متى ينبغي إجراء العملية؟</h4>
        <p>لا تتطلب المياه البيضاء الجراحة فور اكتشافها إلا إذا كانت تسبب مضاعفات نادرة كارتفاع ضغط العين. المعيار الأساسي هو مدى تأثير ضعف النظر على أنشطتك اليومية مثل القراءة، قيادة السيارة، أو التعرف على وجوه الأشخاص.</p>
        <h4>كيف تُجرى الجراحة الحديثة؟</h4>
        <p>تُجرى عملية الفاكو (Phacoemulsification) عبر فتحة ميكروسكوبية لا تتجاوز 2.2 ملم، حيث يتم تفتيت العدسة المعتمة بالموجات فوق الصوتية وشفطها، ثم زراعة عدسة صناعية قابلة للطي مكانها تحت تخدير موضعي بقطرات ودون الحاجة لغرز جراحية في الغالبية العظمى من الحالات.</p>
      `
    },
    {
      id: 'keratoconus-guide',
      title: 'القرنية المخروطية: الأعراض، التشخيص، وخيارات التثبيت (CXL)',
      summary: 'حالة يرق فيها نسيج القرنية وتتحول إلى شكل مخروطي، ويعد التثبيت الضوئي للقرنية حجر الأساس لوقف تدهورها.',
      content: `
        <h4>ما هي القرنية المخروطية؟</h4>
        <p>القرنية هي النافذة الشفافة الأمامية للعين. في القرنية المخروطية، يضعف النسيج الضام وتبرز القرنية تدريجياً لتأخذ شكلاً مخروطياً، مما يؤدي إلى استجماتيزم غير منتظم وتدهور سريع في قياسات النظارة خاصة لدى فئة الشباب والمراهقين.</p>
        <h4>أهمية التشخيص المبكر وتصوير تضاريس القرنية (Pentacam)</h4>
        <p>يساعد التصوير الطبقي للقرنية في اكتشاف المرض قبل ظهور أي علامات واضحة بالفحص العادي. يُنصح كل من يلاحظ تغيراً متكرراً في مقاس النظارة أو فركاً مزمناً في العين بإجراء هذا الفحص.</p>
        <h4>عملية تثبيت القرنية بالكولاجين (CXL)</h4>
        <p>إجراء علاجي يهدف إلى تقوية الروابط بين ألياف القرنية باستخدام قطرات فيتامين ب2 (الريبوفلافين) مع الأشعة فوق البنفسجية UVA. الهدف الأساسي هو إيقاف تقدم المرض وحماية النظر من التدهور المستقبلي.</p>
      `
    },
    {
      id: 'lasik-candidacy',
      title: 'من هو المرشح المناسب لعمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك)؟',
      summary: 'شروط الأمان والمعايير الطبية الدقيقة التي تحدد الإجراء الأمثل لتصحيح قصر أو طول النظر والاستجماتيزم.',
      content: `
        <h4>المعايير الأساسية للأمان:</h4>
        <ul>
          <li><strong>العمر:</strong> ألا يقل عن 18 عاماً لضمان استقرار نمو العين.</li>
          <li><strong>استقرار النظر:</strong> ثبات قياسات النظارة لمدة عام على الأقل.</li>
          <li><strong>سماكة القرنية وشكلها:</strong> خلو القرنية تماماً من أي علامات للقرنية المخروطية أو الترقق غير الطبيعي.</li>
          <li><strong>صحة سطح العين:</strong> علاج أي جفاف حاد قبل اتخاذ قرار الليزك.</li>
        </ul>
        <h4>ما الفرق بين الفيمتو ليزك والليزر السطحي (PRK)؟</h4>
        <p>في الفيمتو ليزك يتم رفع قشرة رقيقة من القرنية بواسطة ليزر الفيمتوثانية ثم تصحيح النظر، مما يوفر تعافياً سريعاً جداً. أما الليزر السطحي فيتم دون رفع أي قشرة، ويعد الخيار الأنسب لأصحاب القرنيات الرقيقة أو من يمارسون رياضات عنيفة.</p>
      `
    },
    {
      id: 'surgery-journey',
      title: 'رحلة المريض: ماذا تتوقع قبل وأثناء وبعد جراحة المياه البيضاء؟',
      summary: 'دليل تفصيلي لمراحل التحضير، تجربة يوم العملية، وإرشادات التعافي القطرات بعد الجراحة.',
      content: `
        <h4>قبل العملية (التحضير والقياسات):</h4>
        <p>يخضع المريض لقياسات بصرية فائقة الدقة (Optical Biometry) لحساب قوة العدسة المناسبة، مع مناقشة نوع العدسة الأنسب لاحتياجاته.</p>
        <h4>يوم العملية:</h4>
        <p>إجراء يومي لا يستدعي المبيت. تستغرق الجراحة نحو 15 إلى 20 دقيقة تحت تخدير موضعي بالقطرات، مع شعور المريض بضغط خفيف أو أضواء دون ألم حقيقي.</p>
        <h4>بعد العملية:</h4>
        <p>يغادر المريض بعد وقت وجيز مرتدياً غطاءً واقياً. من الضروري الالتزام بجدول القطرات المضادة للالتهاب والمضادات الحيوية، وتجنب فرك العين أو وصول الماء المباشر إليها خلال الأيام الأولى.</p>
      `
    }
  ],
  en: [
    {
      id: 'cataract-guide',
      title: 'What is a Cataract and When is Surgery Indicated?',
      summary: 'A natural age-related clouding of the ocular lens, treatable safely and effectively via modern micro-incision surgery.',
      content: `
        <h4>Understanding Cataracts</h4>
        <p>A cataract is not a film over the eye, but rather a gradual clouding of the natural crystalline lens inside the eye. This clouding scatters light entering the retina, producing blurred vision, washed-out colors, and glare around light sources at night.</p>
        <h4>When Should Surgery Be Performed?</h4>
        <p>Cataract surgery is rarely urgent. The guiding criterion is whether reduced visual acuity interferes with your regular daily activities, such as driving, reading, working on screens, or personal safety.</p>
        <h4>Modern Phacoemulsification</h4>
        <p>Surgery is performed through a micro-incision (~2.2 mm). Ultrasound gently breaks up the clouded lens, which is aspirated, and an artificial intraocular lens (IOL) is implanted under topical drop anesthesia with no stitches required in most cases.</p>
      `
    },
    {
      id: 'keratoconus-guide',
      title: 'Keratoconus: Diagnosis, Progression, and Corneal Cross-Linking (CXL)',
      summary: 'A condition causing corneal thinning and steepening, managed effectively with collagen cross-linking.',
      content: `
        <h4>What is Keratoconus?</h4>
        <p>Keratoconus is a progressive condition where the cornea thins and bulges into an irregular conical shape. This produces progressive irregular astigmatism, frequently requiring frequent eyeglass prescription changes in adolescents and young adults.</p>
        <h4>Early Diagnosis with Corneal Tomography</h4>
        <p>High-resolution Scheimpflug tomography (Pentacam) detects subclinical keratoconus before overt signs appear on basic slit-lamp examination. Anyone with rapidly changing astigmatism or habitual eye rubbing should be screened.</p>
        <h4>Corneal Collagen Cross-Linking (CXL)</h4>
        <p>CXL strengthens corneal stromal collagen bonds using riboflavin (vitamin B2) drops activated by precise UVA light, arresting disease progression and preserving visual acuity.</p>
      `
    },
    {
      id: 'lasik-candidacy',
      title: 'Who is an Ideal Candidate for Laser Vision Correction (LASIK / PRK)?',
      summary: 'Safety criteria, stability requirements, and anatomical guidelines governing refractive procedures.',
      content: `
        <h4>Essential Safety Criteria:</h4>
        <ul>
          <li><strong>Age:</strong> At least 18 years to ensure ocular maturity.</li>
          <li><strong>Refractive Stability:</strong> Stable eyeglass prescription for at least 12 months.</li>
          <li><strong>Corneal Thickness & Shape:</strong> Adequate corneal pachymetry with no topographic evidence of ectasia or forme fruste keratoconus.</li>
          <li><strong>Ocular Surface:</strong> Absence of severe untreated dry eye disease.</li>
        </ul>
        <h4>Femto-LASIK vs. Surface Ablation (PRK)</h4>
        <p>Femto-LASIK utilizes a femtosecond laser to create a precise flap for swift visual recovery. PRK reshapes the corneal surface without flap creation, making it preferable for patients with thinner corneas or active contact sports involvement.</p>
      `
    },
    {
      id: 'surgery-journey',
      title: 'The Patient Journey: What to Expect Before, During, and After Cataract Surgery',
      summary: 'A step-by-step roadmap from pre-op optical biometry to post-op drops and visual recovery.',
      content: `
        <h4>Pre-Operative Preparation:</h4>
        <p>Precise optical biometry is performed to calculate target IOL power, paired with a detailed lifestyle discussion regarding distance, intermediate, and near visual needs.</p>
        <h4>Day of Surgery:</h4>
        <p>Performed as an outpatient day procedure under topical anesthetic eye drops. The surgical procedure typically lasts 15–20 minutes with zero pain and immediate discharge.</p>
        <h4>Post-Operative Care:</h4>
        <p>Patients follow a structured regimen of anti-inflammatory and antibiotic eye drops, avoiding eye rubbing or direct tap water exposure during the initial healing window.</p>
      `
    }
  ]
};
```

### E.2 R2 footer and subtitle that claimed supervision: DO NOT RESTORE

Source: `git show 2fbf261:main.js`, lines 1436 and 1449.

```js
        <p>${currentLang === 'ar' ? 'مقالات وأدلة سريرية محكمة أعدت بإشراف الدكتور معن بن عبدالله البري لتزويدك بالحقائق الطبية الدقيقة.' : 'Peer-reviewed guides developed under Dr. Maan Al Barry’s clinical oversight.'}</p>
                ${currentLang === 'ar' ? 'إشراف ومراجعة سريرية: د. معن بن عبدالله البري — استشاري طب وجراحة العيون' : 'Medically supervised by Dr. Maan Al Barry — Consultant Ophthalmologist'}
```

### E.3 Current short answers (working tree)

Source: `main.js`, lines 709 to 740 (HEAD).

```js
  const articles = [
    {
      id: 'cataract-guide', slug: 'cataract-surgery',
      t: tr('ما هي المياه البيضاء، ومتى تصبح الجراحة مناسبة؟', 'What is a cataract, and when is surgery considered?'),
      c: tr('المياه البيضاء ليست غشاءً فوق العين، بل عتامة تدريجية في العدسة الطبيعية خلف البؤبؤ تسبب الضبابية وبهتان الألوان والوهج ليلاً. لا تحتاج الجراحة فور اكتشافها؛ المعيار هو تأثير ضعف الرؤية على أنشطتك اليومية.',
        'A cataract is not a film over the eye but a gradual clouding of the natural lens behind the pupil, causing blur, faded colours and glare at night. Surgery is rarely urgent; the guide is how much reduced vision affects your daily activities.')
    },
    {
      id: 'keratoconus-guide', slug: 'keratoconus-cxl',
      t: tr('تغيّر مقاس النظارة باستمرار؟ اعرف عن القرنية المخروطية', 'Glasses keep changing? Learn about keratoconus'),
      c: tr('في القرنية المخروطية تترقق القرنية وتتحدب تدريجياً، وتظهر غالباً لدى الشباب. يساعد التصوير الطبقي للقرنية على اكتشافها مبكراً، ويُنصح بتجنب فرك العين.',
        'In keratoconus the cornea thins and bulges gradually, often in young people. Corneal tomography helps detect it early, and avoiding eye rubbing is advised.')
    },
    {
      id: 'lasik-candidacy', slug: 'laser-vision-correction',
      t: tr('هل يناسبني تصحيح الإبصار بالليزر؟', 'Is laser vision correction right for me?'),
      c: tr('من المعايير الشائعة: عمر 18 عاماً فأكثر، وثبات درجة النظر، وسماكة قرنية كافية، وسطح عين صحي. يُحسم القرار بعد تصوير القرنية والفحص الشامل.',
        'Common criteria include age 18 or over, a stable prescription, enough corneal thickness and a healthy eye surface. The decision follows corneal imaging and a full examination.')
    },
    {
      id: 'surgery-journey', slug: 'cataract-surgery',
      t: tr('ماذا تتوقع قبل الجراحة وفي يومها وبعدها؟', 'What to expect before, on the day and after surgery'),
      c: tr('قبل الجراحة: قياسات للعين ومناقشة الخيارات. يوم الجراحة: إجراء خارجي غالباً تحت تخدير موضعي. بعدها: قطرات حسب الجدول، وتجنب فرك العين، ومواعيد متابعة.',
        'Before: eye measurements and a discussion of options. On the day: usually an outpatient procedure under local anaesthetic. After: drops on schedule, no eye rubbing, and follow-up visits.')
    }
  ];
  const assess = [
    [tr('تصوير القرنية الطبقي', 'Corneal tomography'), tr('خريطة لشكل القرنية وسماكتها، أساسية قبل الليزر ولتشخيص القرنية المخروطية.', 'Maps corneal shape and thickness — essential before laser and for diagnosing keratoconus.')],
    [tr('القياسات البصرية الحيوية', 'Optical biometry'), tr('قياس طول العين وانحناء القرنية لحساب قوة العدسة المزروعة.', 'Measures the eye’s length and corneal curve to calculate an implant’s power.')],
    [tr('التصوير المقطعي للشبكية (OCT)', 'Retinal imaging (OCT)'), tr('صور مقطعية للبقعة والشبكية لتشخيص الحالات ومتابعة العلاج بالحقن.', 'Cross-sectional images of the macula and retina for diagnosis and to guide injections.')],
    [tr('فحص شامل للعين', 'Full eye examination'), tr('قياس النظر وضغط العين وفحص المصباح الشقي وقاع العين قبل أي قرار.', 'Vision, eye pressure, slit-lamp and retina checks before any decision.')]
  ];
```

## Appendix F. "Your visit": pathway and assessments (neutral, R5)

Restore as a compact homepage strip. The `tech` entries name "Pentacam" and "Optical biometry" as generic assessments; keep the brand name out until the clinic confirms the device.

### F.1 `areas`, `tech`, `steps` (R5)

Source: `git show a255d39:main.js`, lines 1203 to 1240 (commit `a255d39`). Also contains the three specialty descriptions that became the gallery.

```js
  const areas = [
    {
      titleAr: 'جراحة الماء الأبيض (الساد) وزراعة العدسات', titleEn: 'Cataract surgery & lens implantation',
      descAr: 'استبدال العدسة المعتمة بتقنية الفاكو وزراعة عدسة داخل العين — أحادية البؤرة أو ممتدة المدى (EDOF) أو ثلاثية البؤرة — بحسب الفحص والقياسات واحتياجات المريض.',
      descEn: 'Phacoemulsification to replace the clouded lens with an intraocular lens — monofocal, extended depth of focus (EDOF) or trifocal — chosen from the examination, measurements and the patient’s needs.',
      tagsAr: ['إزالة الساد بالفاكو', 'العدسات التوريكية للاستجماتيزم', 'عدسات EDOF وثلاثية البؤرة'],
      tagsEn: ['Phacoemulsification', 'Toric lenses for astigmatism', 'EDOF & trifocal lenses'],
      more: 'cataracts', moreAr: 'دليل العدسات', moreEn: 'Lens guide'
    },
    {
      titleAr: 'أمراض القرنية والقرنية المخروطية', titleEn: 'Cornea & keratoconus',
      descAr: 'التشخيص المبكر للقرنية المخروطية بالتصوير الطبقي، وتثبيت القرنية بالريبوفلافين والأشعة فوق البنفسجية (CXL) بهدف إبطاء تطور المرض، مع خطط متابعة.',
      descEn: 'Early keratoconus detection with corneal tomography, and corneal cross-linking (CXL) with riboflavin and UVA aimed at slowing progression, with structured follow-up.',
      tagsAr: ['تثبيت القرنية CXL', 'التصوير الطبقي للقرنية', 'أمراض سطح العين'],
      tagsEn: ['Corneal cross-linking (CXL)', 'Corneal tomography', 'Ocular surface disease'],
      more: 'education', moreAr: 'اقرأ عن القرنية المخروطية', moreEn: 'Read about keratoconus'
    },
    {
      titleAr: 'تصحيح الإبصار بالليزر', titleEn: 'Laser vision correction',
      descAr: 'تقييم شامل لملاءمة الفيمتو ليزك والليزر السطحي (PRK): سماكة القرنية وشكلها وثبات النظر وصحة سطح العين، قبل اتخاذ أي قرار.',
      descEn: 'A full suitability assessment for Femto-LASIK and surface laser (PRK): corneal thickness and shape, prescription stability and ocular-surface health, before any decision.',
      tagsAr: ['الفيمتو ليزك', 'الليزر السطحي PRK', 'فحص سماكة القرنية'],
      tagsEn: ['Femto-LASIK', 'Surface laser (PRK)', 'Corneal thickness check'],
      more: 'faq', moreAr: 'معايير الترشيح', moreEn: 'Candidacy criteria'
    }
  ];
  const tech = [
    [tr('تصوير القرنية الطبقي (Pentacam)', 'Corneal tomography (Pentacam)'), tr('قياس تضاريس وسماكة القرنية لتشخيص القرنية المخروطية المبكرة وتحديد ملاءمة تصحيح النظر.', 'Maps corneal shape and thickness to detect early keratoconus and assess refractive-surgery suitability.')],
    [tr('جراحة الفاكو (Phacoemulsification)', 'Phacoemulsification'), tr('إزالة الساد عبر شق صغير وزراعة عدسة قابلة للطي، غالباً تحت تخدير موضعي بالقطرات.', 'Small-incision cataract removal with a foldable lens, usually under anaesthetic eye drops.')],
    [tr('القياسات البصرية الحيوية (Optical Biometry)', 'Optical biometry'), tr('حساب قوة العدسة المزروعة بالقياس البصري ومعادلات حسابية حديثة.', 'Calculates the implant power with optical measurement and modern formulas.')],
    [tr('تثبيت القرنية (Cross-Linking)', 'Corneal cross-linking (CXL)'), tr('الريبوفلافين والأشعة فوق البنفسجية بهدف إبطاء تطور القرنية المخروطية أو إيقافه.', 'Riboflavin and UVA light that aim to slow or stop keratoconus progression.')]
  ];
  const steps = [
    [tr('الفحص والتصوير', 'Examination & imaging'), tr('تصوير القرنية وقياس العين لبناء خطة موضوعية.', 'Corneal imaging and eye measurements build an objective plan.')],
    [tr('الاستشارة', 'Consultation'), tr('شرح النتائج ومناقشة الخيارات والتوقعات الواقعية مع د. معن.', 'Results, options and realistic expectations, discussed with Dr. Maan.')],
    [tr('الإجراء', 'Procedure'), tr('في غرف عمليات مستشفى مغربي، غالباً تحت تخدير موضعي.', 'In Magrabi’s operating theatres, usually under local anaesthetic.')],
    [tr('المتابعة', 'Follow-up'), tr('زيارات مجدولة لمتابعة التعافي واستقرار الرؤية.', 'Scheduled visits to follow healing and visual stability.')]
  ];
```

## Appendix G. Biography, quote, roles and conference block

G.1 and G.2 are the R5 bio and conference markup (verified facts only). G.3 is the R3 hero quote (pending: needs Dr. Maan's approval and attribution). G.4 is the R3 stats strip: **only +15,000 and "since 1998" are publishable**. G.5 is the R0 role list, showing the Magrabi-published roles.

### G.1 Biography paragraphs (R5)

Source: `git show a255d39:main.js`, lines 1140 to 1146 (commit `a255d39`). 

```js
          <p class="bio-lede">${isAr
            ? `د. معن بن عبدالله البري استشاري طب وجراحة العيون في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، بخبرة سريرية وأكاديمية وجراحية ممتدة منذ عام <bdi>${D.professional.experienceSince}</bdi>.`
            : `Dr. Maan bin Abdullah Al Barry is a Consultant Ophthalmologist at Magrabi Health Eye & ENT Hospital in Madinah, with clinical, academic and surgical experience since <bdi>${D.professional.experienceSince}</bdi>.`}</p>
          <p class="bio-body">${isAr
            ? 'يعمل ضمن وحدة جراحة الماء الأبيض ووحدة جراحة القرنية وتصحيح النظر، ويساعد المرضى في تقييم الحالات التي تتطلب دقة في فحص عدسة العين، وتشخيص القرنية المخروطية، وتحديد خيارات تصحيح الإبصار بالليزر أو زراعة العدسات.'
            : 'He works within the cataract unit and the cornea & refractive surgery unit, helping patients whose care depends on careful assessment of the lens and cornea — from keratoconus diagnosis to laser vision correction and lens implantation.'}</p>

```

### G.2 Conference block (R5)

Source: `git show a255d39:main.js`, lines 1159 to 1172 (commit `a255d39`). Images: `images/dr-maan-faculty.jpg`. Confirm consent for the people visible in it.

```js
      <div class="conferences" id="conferences">
        <figure class="conf-figure fade-in">
          <img src="./images/dr-maan-faculty.jpg" width="1024" height="768" alt="${tr('د. معن البري مع نخبة من أطباء العيون في الجلسات العلمية لمؤتمر البحر الأحمر 2024', 'Dr. Maan Al Barry with fellow faculty at the scientific sessions, Saudi Ophthalmology 2024')}" loading="lazy" decoding="async">
        </figure>
        <div class="conf-text fade-in">
          <p class="eyebrow"><span>${tr('المشاركات العلمية', 'Scientific participation')}</span></p>
          <h3>${tr('المشاركات العلمية والمؤتمرات الدولية', 'Scientific meetings & conferences')}</h3>
          <p>${tr('حضور وتمثيل علمي في مؤتمرات طب وجراحة العيون الإقليمية والدولية.', 'Representing ophthalmology at national and international meetings.')}</p>
          <dl class="conf-list">
            <div><dt>${tr('مؤتمر البحر الأحمر لطب وجراحة العيون 2024', 'Saudi Ophthalmology 2024 — The Red Sea')}</dt><dd>${tr('عضو المجلس العلمي للمؤتمر', 'Scientific Council Member')}</dd></div>
            <div><dt>${tr('الجلسات العلمية الدولية', 'International scientific sessions')}</dt><dd>${tr('مع نخبة من أطباء وجراحي العيون', 'With ophthalmic surgeons and faculty')}</dd></div>
          </dl>
        </div>
      </div>
```

### G.3 Hero quote card (R3): PENDING approval

Source: `git show 9da524c:main.js`, lines 1197 to 1204 (commit `9da524c`). 

```js
          <div class="hero-quote-card">
            <div class="quote-mark">“</div>
            <p class="quote-text">
              ${isAr
                ? 'طب العيون أمانة علمية وإنسانية دقيقة؛ هدفنا الأول هو الحفاظ على نعمة الإبصار وتقديم العلاج الأنسب لكل عين وفق أعلى المعايير الطبية العالمية دون إفراط أو تسويق غير مبرر.'
                : 'Ophthalmology is a sacred clinical trust. Our core objective is preserving sight and delivering personalized, evidence-based care adhering to the highest international medical standards.'}
            </p>
          </div>
```

### G.4 Hero stats strip (R3): 100% and +26 are DO NOT RESTORE

Source: `git show 9da524c:main.js`, lines 1206 to 1221 (commit `9da524c`). 

```js
          <div class="hero-stats-strip">
            <div class="stat-box">
              <strong class="stat-number">+26</strong>
              <span class="stat-label">${isAr ? 'عاماً خبرة سريرية وأكاديمية (منذ 1998)' : 'Years of Clinical Excellence (Since 1998)'}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-box">
              <strong class="stat-number">100%</strong>
              <span class="stat-label">${isAr ? 'التزام طبي وفق بروتوكولات الفحص الدقيق' : 'Adherence to Diagnostic Protocols'}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-box">
              <strong class="stat-number">+15,000</strong>
              <span class="stat-label">${isAr ? 'فحص وإجراء جراحي دقيق في طب العيون' : 'Specialized Ophthalmic Procedures'}</span>
            </div>
          </div>
```

### G.5 Original role list incl. Magrabi-published roles (R0)

Source: `git show 93465a6:main.js`, lines 30 to 51 (commit `93465a6`). Roles 4 and 5 (scientific council member of the Red Sea conference; former secretary of the Saudi Ophthalmological Society) are the ones absent today. Role 1 (Chief Medical Officer / Executive Medical Director) is contradicted by the doctor-confirmed Chief of Staff.

```js
  roles: {
    ar: [
      'المدير الطبي التنفيذي – مغربي المدينة المنورة',
      'رئيس قسم طب وجراحة العيون – جامعة طيبة',
      'ممثل الجمعية السعودية لطب وجراحة العيون – المدينة المنورة',
      'عضو المجلس العلمي لمؤتمر البحر الأحمر لطب وجراحة العيون',
      'أمين سر الجمعية السعودية لطب العيون سابقاً',
      'زميل كلية الجراحين الملكية – بريطانيا (FRCS)',
      'عضو الجمعية الأمريكية لطب وجراحة العيون (AAO)',
      'عضو الجمعية السعودية لطب وجراحة العيون (SOS)',
    ],
    en: [
      'Chief Medical Officer – Magrabi Madinah',
      'Chairman, Department of Ophthalmology – Taibah University',
      'Saudi Ophthalmological Society Representative – Madinah',
      'Scientific Council Member – Red Sea Ophthalmology Conference',
      'Former Secretary General – Saudi Ophthalmological Society',
      'Fellow of the Royal College of Surgeons – UK (FRCS)',
      'Member – American Academy of Ophthalmology (AAO)',
      'Member – Saudi Ophthalmological Society (SOS)',
    ]
  }
```

### G.6 Original biography paragraphs (R0)

Source: `git show 93465a6:main.js`, lines 87 to 88 (commit `93465a6`). Arabic. English at lines 210 and 211.

```js
      bio1: 'د. معن عبدالله البري استشاري طب وجراحة العيون في مغربي الصحية للعيون والأذن بالمدينة المنورة. يعمل ضمن وحدة المياه البيضاء ووحدة جراحة القرنية وتصحيح النظر، ويساعد المرضى في تقييم الحالات التي تتطلب دقة متناهية في فحص العدسة، فحص تضاريس القرنية، وملاءمة الإجراءات العلاجية والجراحية.',
      bio2: 'تتكامل خبرته السريرية مع أدوار قيادية وأكاديمية بارزة؛ حيث يشغل منصب المدير الطبي التنفيذي لمغربي المدينة المنورة، ورئيس قسم طب وجراحة العيون في جامعة طيبة، وممثل الجمعية السعودية لطب وجراحة العيون في منطقة المدينة المنورة، إلى جانب عضويته في المجلس العلمي لمؤتمر البحر الأحمر لطب وجراحة العيون.',
```

### G.7 Original biography paragraphs, English (R0)

Source: `git show 93465a6:main.js`, lines 210 to 211 (commit `93465a6`). 

```js
      bio1: 'Dr. Maan Abdullah Al Barry is a consultant ophthalmic surgeon practicing at Magrabi Health Eye & ENT in Madinah, Saudi Arabia. He serves within the Cataract Unit and Cornea & Refractive Surgery Unit, providing meticulous evaluation for patients requiring cataract removal, intraocular lens selection, corneal pathology care, and refractive surgery.',
      bio2: 'His clinical practice is reinforced by significant leadership and academic appointments: he is Executive Medical Director / Chief Medical Officer of Magrabi Madinah, Chairman of the Department of Ophthalmology at Taibah University, Madinah Representative of the Saudi Ophthalmological Society, and Scientific Council Member of the Red Sea Ophthalmology Conference.',
```

## Appendix H. Testimonials, hero stats, FAQ and disclaimer (R0)

**H.1 and H.2 are for traceability. DO NOT RESTORE** (registry `testimonials-magrabi`, no permission; `+200 reviews` unsupported). H.3 is the original FAQ, all of which survives in revised form. H.4 is the long medical disclaimer whose emergency sentence should be merged into the footer.

### H.1 `REVIEWS`: DO NOT RESTORE

Source: `git show 93465a6:main.js`, lines 494 to 536 (commit `93465a6`). 

```js
// --- VERIFIED PATIENT REVIEWS ---
const REVIEWS = {
  ar: [
    {
      author: 'راكان العبري',
      date: 'مريض تم علاجه بمغربي المدينة المنورة',
      text: 'كانت تجربة ممتازة بكل المقاييس. استغرق موعدي قرابة ساعة، أجريت خلالها الفحوصات الدقيقة ثم قابلت الدكتور معن البري، الذي شرح لي تفاصيل الإجراء وأي مضاعفات محتملة بكل أمانة ووضوح ومهنية عالية.',
      stars: 5,
    },
    {
      author: 'مايا أحمد',
      date: 'مراجعة عيادة العيون والقرنية',
      text: 'أود أن أشكر فريق د. معن البري على حسن الاستقبال والتعامل الراقي والمعاملة المريحة، والاهتمام الفائق بتنظيم المواعيد والإجابة عن كافة التساؤلات بابتسامة وترحاب.',
      stars: 5,
    },
    {
      author: 'بشرى الشراحيلي',
      date: 'مريضة جراحة عيون',
      text: 'أعرب عن خالص امتناني للدكتور معن البري على مهنيته الاستثنائية، وخبرته الواسعة، وتوجيهه اللطيف والمهدئ طوال مراحل العملية، والاهتمام الدقيق بالمتابعة بعد الإجراء.',
      stars: 5,
    }
  ],
  en: [
    {
      author: 'Rakan Al-Abri',
      date: 'Patient at Magrabi Madinah',
      text: 'An outstanding experience by all measures. I completed thorough diagnostics before meeting Dr. Maan Al Barry, who explained the procedure and potential nuances with utmost clarity, honesty, and professional integrity.',
      stars: 5,
    },
    {
      author: 'Maya Ahmed',
      date: 'Cornea & Vision Correction Patient',
      text: 'I would like to extend heartfelt thanks to Dr. Maan Al Barry and his dedicated clinical team for their wonderful hospitality, comfortable care, and seamless appointment coordination.',
      stars: 5,
    },
    {
      author: 'Bushra Al-Sharahili',
      date: 'Ophthalmic Surgery Patient',
      text: 'My deepest gratitude to Dr. Maan for his exceptional surgical precision, vast expertise, and gentle guidance throughout the entire procedure and post-op follow-up.',
      stars: 5,
    }
  ]
};
```

### H.2 Original hero stats, Arabic and English: DO NOT RESTORE +200 reviews

Source: `git show 93465a6:main.js`, lines 80 to 82 (commit `93465a6`). English at lines 202 to 204.

```js
      stat2: 'مستشفى معتمد JCI وCBAHI',
      stat3: '+70 عاماً خبرة مغربي',
    },
```

### H.3 `FAQ_DATA` (R0)

Source: `git show 93465a6:main.js`, lines 538 to 592 (commit `93465a6`). Current FAQ: `doctor-data.js` lines 282 to 325.

```js
// --- FAQ DATA ---
const FAQ_DATA = {
  ar: [
    {
      q: 'ما هو التخصص الدقيق للدكتور معن عبدالله البري؟',
      a: 'استشاري طب وجراحة العيون، متخصص في جراحة المياه البيضاء (الساد) وزراعة العدسات بمختلف أنواعها، عمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك والسطحي)، وأمراض القرنية والقرنية المخروطية وتثبيت القرنية.'
    },
    {
      q: 'أين تقع عيادة الدكتور معن البري وكيف يمكن الوصول إليها؟',
      a: 'يستقبل د. معن البري مراجعيه في مستشفى مغربي الصحية للعيون والأذن بالمدينة المنورة، الواقع على طريق المطار. الفرع معتمد من اللجنة الدولية المشتركة JCI والمؤسسة الأمريكية SRC كمركز تميز لطب العيون.'
    },
    {
      q: 'كيف يمكنني حجز موعد مؤكد مع الطبيب؟',
      a: 'يمكنك الحجز مباشرة عبر بوابة الحجز الإلكتروني الرسمية لمغربي (ob.magrabi.com.sa)، أو عبر الاتصال بالرقم الموحد 19505، أو الاستفسار السريع وتنسيق الموعد عبر رابط واتساب المتوفر في الموقع.'
    },
    {
      q: 'هل يضمن محاكي الرؤية النتيجة الفعلية للعملية الجراحية؟',
      a: 'كلا، محاكي الرؤية هو أداة تعليمية وتوضيحية عامة لشرح الفروقات المفاهيمية بين العدسات. النتيجة الفعلية تعتمد على فحص تضاريس القرنية، صحة الشبكية، وقياسات العين الدقيقة التي يجريها الاستشاري.'
    },
    {
      q: 'هل يمكن الاستغناء التام عن النظارات بعد عملية المياه البيضاء؟',
      a: 'توفر العدسات الحديثة مثل العدسات ثلاثية البؤرة (Trifocal) والعدسات ممتدة العمق (EDOF) استقلالية عالية عن النظارات لمعظم الأنشطة كالقراءة وقيادة السيارة، ولكن لا يمكن تقديم ضمان طبي بنسبة 100% لعدم الحاجة لنظارة في بعض الظروف الخاصة.'
    },
    {
      q: 'ما هي معايير ترشيح المريض لعمليات تصحيح النظر بالليزك؟',
      a: 'يشترط ألا يقل العمر عن 18 عاماً، وثبات النظر لمدة عام، وسماكة قرنية كافية، وخلو العين التام من القرنية المخروطية أو الجفاف الشديد غير المعالج، ويتم حسم القرار بعد تصوير القرنية الطبقي.'
    }
  ],
  en: [
    {
      q: 'What are Dr. Maan Al Barry\'s medical subspecialties?',
      a: 'He is a Consultant Ophthalmologist specializing in cataract surgery and advanced IOL implantation, laser refractive surgery (LASIK, Femto-LASIK, PRK), and corneal diseases including keratoconus and corneal cross-linking (CXL).'
    },
    {
      q: 'Where does Dr. Maan see patients in Madinah?',
      a: 'At Magrabi Health Eye & ENT – Madinah, located on Airport Road. The hospital holds JCI accreditation and SRC Center of Excellence designation in Ophthalmology.'
    },
    {
      q: 'How can I book an appointment?',
      a: 'You can book through the official Magrabi Online Booking portal (ob.magrabi.com.sa), via call center at 19505, or through the direct WhatsApp consultation inquiry button on this website.'
    },
    {
      q: 'Does the Vision Simulator predict actual surgical vision?',
      a: 'No. The simulator is strictly an educational tool demonstrating optic principles. Real-world postoperative visual acuity is determined by clinical biometry, corneal morphology, and individualized healing.'
    },
    {
      q: 'Can cataract surgery guarantee complete spectacle independence?',
      a: 'While modern premium IOLs (Trifocals & EDOFs) significantly decrease dependence on glasses for distance, intermediate, and near tasks, complete 100% independence cannot be guaranteed for every clinical case.'
    },
    {
      q: 'What are the main criteria for laser vision correction (LASIK)?',
      a: 'Candidates must be at least 18 years old, possess stable refraction for 12 months, have adequate corneal thickness, and demonstrate normal corneal topography with no evidence of keratoconus.'
    }
  ]
};
```

### H.4 Original medical disclaimer (R0)

Source: `git show 93465a6:main.js`, lines 163 to 165 (commit `93465a6`). English at lines 286 and 287.

```js
      disclaimer: 'إخلاء مسؤولية طبية',
      disclaimerText: 'المحتوى المنشور في هذا الموقع ذو طبيعة تثقيفية وتوعوية عامة، ولا يُغني بأي حال عن الاستشارة الطبية والفحص السريري من قبل طبيب العيون المختص. لا يجوز استخدام هذه المعلومات لتشخيص أو علاج أي مرض. في حالات الطوارئ العينية، يرجى مراجعة أقرب مركز طوارئ فوراً.',
      rights: 'جميع الحقوق محفوظة ©',
```
