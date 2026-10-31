# Doctor Data Decisions — Phase 0

All public doctor, clinic and contact facts now come from one module: [`doctor-data.js`](../../../doctor-data.js).
The page (`main.js`), the JSON-LD in `index.html` and `/llms.txt` are all generated from it (see `vite.config.js`).

Sources were checked on **2026-10-31**:

| Key | Source |
|---|---|
| `magrabi` | Official Magrabi Health doctor profile — https://www.magrabihealth.com/ar/sa/eye/our-doctors/dr-maan-abdullah-barry |
| `taibah` | Taibah University faculty profile — https://www.taibahu.edu.sa/the-university/about-taibah-university/faculty-members/1431 |
| `owner` | Wording supplied by the site owner in commit `2fbf261` (2026-10-25). Not independently verifiable; kept because it was a deliberate owner change, and flagged for written clinic confirmation. |

> The audit package referenced in the brief (`docs/project-audit/*`) does **not exist** in this repository, its git history, or anywhere under the user profile. Every roadmap item was therefore re-verified directly against the source code and the official sources above.

## A. Confirmed information (verified against an official source)

| Fact | Value used | Source |
|---|---|---|
| Specialty title | استشاري طب وجراحة العيون — cornea, cataract & refractive surgery (site wording; Magrabi: "استشاري المياه البيضاء وعمليات تصحيح الابصار والقرنية") | magrabi |
| Units | Cataract unit; cornea & refractive surgery unit | magrabi |
| Qualification | FRCS — Royal College of Surgeons, UK | magrabi |
| Memberships | Saudi Ophthalmological Society; American Academy of Ophthalmology | magrabi |
| Academic rank | Associate Professor, ophthalmology — Taibah University (kept in data and llms.txt; not added to the UI) | taibah |
| Practice location | مغربي الصحية للعيون والأذن – المدينة المنورة, Airport Road | magrabi |
| Hospital accreditation | JCI, CBAHI | magrabi |
| Call center | `920018000` (the tel: link on the Magrabi page) and `19505` | magrabi |
| WhatsApp | `966508533309`, the line Magrabi publishes for appointments with Dr. Maan. It was also this site's WhatsApp number from the first commit until 2026-10-25. | magrabi + git history |
| Booking portal | https://ob.magrabi.com.sa/OnlineBooking/ (unchanged destination) | magrabi |

## B. Contact model — one role per number

| Role | Data key | Number | Status | Where it appears |
|---|---|---|---|---|
| Primary call (hospital contact center) | `contact.callCenter` | 920018000 | verified | Sticky bar "Call", clinic section, footer, JSON-LD `telephone`, llms.txt |
| Short call-center number | `contact.callCenterShort` | 19505 | verified | Clinic section, FAQ, llms.txt |
| WhatsApp appointments | `contact.whatsapp` | +966 50 853 3309 | verified | Sticky bar, hero (≥769px), clinic, CTA banner, footer, questionnaire result |
| Booking portal | `contact.bookingUrl` | ob.magrabi.com.sa | verified | All "Book" CTAs |
| Direct clinic mobile | `contact.clinicDirect` | — (`null`) | **pending — not published** | Nowhere |

The previous site showed `0554946433` as the "direct clinic phone", used it for the sticky-bar call **and** for WhatsApp, and showed `19505 / 920018000` elsewhere. That gave three numbers with overlapping roles. Phone numbers now differ only by role, and no number serves two roles unless it is verified for both.

## C. Removed claims

| Claim (before) | Why removed | Replacement |
|---|---|---|
| Hero stat "+15,000 procedures/examinations" | No source anywhere in the repo, the Magrabi or Taibah pages | Removed. No number replaces it. The hero now shows three verified facts: practice since 1998 · FRCS · Magrabi Madinah. |
| Hero stat "100% adherence to diagnostic protocols" | Unmeasurable, unsourced | Removed |
| Hero stat "+26 years" | Owner-supplied "since 1998" is kept; the derived "+26" was already stale (it is 28 in 2026) | Shown as the year "1998" |
| Badge "الترخيص الاستشاري المعتمد — الهيئة السعودية للتخصصات الصحية" / "Board-Certified Consultant — SCFHS" | No SCFHS record was supplied, and Magrabi does not state it | Badge now shows the verified FRCS (UK) |
| "Saudi Board" / "Board Certified in Ophthalmology" (qualifications card) and "Board-Certified Care" (CTA banner) | Unverified | FRCS card now lists only FRCS and verified memberships; banner says "Specialist Care Since 1998" |
| "Subspecialty fellowship in corneal disease" | Unverified fellowship | Reworded to his verified unit membership (cornea & refractive surgery unit) |
| "Senior Consultant" (EN hero subtitle and bio) | Every source says "Consultant" | "Consultant" |
| EDOF "الخيار المفضل حالياً سريرياً" / "Clinically Favored" (simulator chip and canvas tag), "Currently favored by Dr. Maan…" (simulator note), simulator disclaimer, IOL-guide badge "Favored by Dr. Maan" and highlighted card, "Clinical Guidance by Dr. Maan … favors EDOF" box, llms.txt lens paragraph | A personal clinical preference reads as a medical recommendation, and no approved statement exists | Neutral, educational trade-off copy in AR and EN. Lens choice is described as depending on examination, eye measurements and patient priorities. All three lens comparisons are preserved. |
| Questionnaire summary "EDOF … مع انعدام الهالات" (zero halos) | Inaccurate: EDOF lenses reduce halos, they do not eliminate them | Neutral discussion prompt about range, halo likelihood and need for glasses |
| "~2.2 mm" incision (profile technology card and education article, AR and EN) | Technique-specific number presented as universal | "Small incision" — no new number invented |
| Three patient testimonials with 5-star ratings and the note "pending final administrative confirmation" | The reviews do exist on the Magrabi profile page, but (1) reuse permission is undocumented, and (2) the site versions were reworded and embellished, not quoted | Section hidden. `credibility.testimonials` is empty, and a publication gate (`isPublishableTestimonial`) requires a source URL, documented permission, attribution and approved text before anything renders. Patient names were also removed from the public bundle. |
| Clinic hours "Sat–Thu 9:00–1:00 · 5:00–9:30" (UI) vs `09:00–21:00` (JSON-LD) | The two contradicted each other and neither is confirmed | UI: "schedule varies — confirm via contact center or booking portal". JSON-LD: no `openingHoursSpecification`. |
| JSON-LD FAQ "يشغل منصب المدير الطبي التنفيذي … ورئيس قسم … جامعة طيبة" | Contradicted the visible page ("former chair", "Chief of Staff") | FAQPage is generated from the same FAQ array the page renders |
| JSON-LD `BreadcrumbList` with `https://drmaanalbarry.com/ar/#…` URLs | Fragment URLs on a domain that does not resolve; not real pages | Removed |
| JSON-LD `geo` (24.4920, 39.6350) and `priceRange "$$"` | Unverified | Removed |
| JSON-LD `memberOf` entries that were really roles ("أول رئيس…", "أحد مؤسسي…") | Wrong modelling (roles are not organisations) | `memberOf` lists only the verified societies |
| English role "Chief Medical Officer" | The Arabic says "كبير موظفي" (Chief of Staff), and the old llms.txt said "Chief of Staff" | "Chief of Staff – Magrabi Health Madinah", consistent across AR/EN/JSON-LD/llms |

## D. Owner-supplied information kept (unverified — needs written confirmation)

| Item | Current wording | Conflict / note |
|---|---|---|
| D-2 Current Magrabi role | كبير موظفي مركز مغربي المدينة المنورة (المشرف العام…) / Chief of Staff | Magrabi publishes **"المدير الطبي التنفيذي – مغربي المدينة المنورة"** (Executive Medical Director). The owner replaced that wording on 2026-10-25. |
| D-3 Taibah role | رئيس قسم … جامعة طيبة **سابقاً لمدة 10 سنوات** | Magrabi publishes it in the present tense. The Taibah page lists only "Associate Professor". |
| D-4 First President, Saudi Association of Cornea, Cataract & Refractive Surgeons | kept | Not on Magrabi or Taibah |
| D-5 Co-founder, Red Sea International Ophthalmology Conference | kept | Magrabi says "scientific council member" of the conference |
| D-6 Former SOS representative in Madinah | kept | Magrabi says "representative" (present tense) and "former secretary" |
| D-7 Practice since 1998 | kept | No external source |

## E. Decisions still required from the clinic

| ID | Decision | Safe behaviour until then |
|---|---|---|
| D-1 | Is `0554946433` an official number? Who answers it, and for which role (calls, WhatsApp, both)? Should it replace or sit alongside Magrabi's WhatsApp `966508533309`? | Not published. The verified Magrabi numbers are used. To enable it: set `contact.clinicDirect` in `doctor-data.js` and render it in the clinic section. |
| D-2 … D-7 | Confirm or correct each owner-supplied role in section D, in writing | Kept as owner-supplied, identical everywhere |
| D-8 | Approved clinic hours for Dr. Maan | No hours published |
| D-9 | SCFHS classification/licence wording, if the doctor wants it shown (supply the official record) | No licence badge |
| D-10 | Testimonials: written reuse permission plus approved verbatim text per review (the originals are on the Magrabi page) | Section hidden |
| D-11 | Any statistic (e.g. procedure volume) with its source and exact meaning | No statistics |
| D-12 | Whether the doctor wants a personal lens-selection statement, and its approved text | Neutral educational copy only |
| D-13 | Booking-interaction analytics: provider and consent approach (see BLOCKERS B-5) | No tracking added; only inert `data-cta` attributes |
| D-14 | Production domain (`drmaanalbarry.com` does not resolve; see BLOCKERS B-6) | `SITE.url` is a single constant in `doctor-data.js` |
