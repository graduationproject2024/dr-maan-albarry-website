# Benchmark research: ophthalmology sites

Prepared 2026-11-02 for the Phase 1 premium-experience work on `feat/phase-1-premium-experience`.
Purpose: guide implementation. Nothing here is to be copied. Section 4 turns the findings into original design rules for an Arabic-first, bilingual, single-physician site.

## 0. How the evidence was gathered (read this first)

- **Page text and structure.** Each page was fetched with WebFetch on 2026-11-02. WebFetch converts the page to text and a small model answers a prompt about it, so section order, wording, links and calls to action are reliable. Colour, layout and photo content are **not** reliable from this route, and the reports say so.
- **Markup facts.** For nine of the sites I also downloaded the raw HTML with `curl` and inspected it directly: `lang`/`dir`, font-family names and font files, the viewport meta tag, image `alt` coverage, `loading="lazy"`, JSON-LD types, skip links. These are real observations of the delivered HTML on 2026-11-02. They say nothing about CSS loaded from external files or about what JavaScript adds later.
- **No screenshots were taken.** Visual identity is therefore described only where the markup or the page text supports it, and marked "not observable" otherwise.
- **Dr. David F. Chang: no personal site found.** `davidfchangmd.com` and `www.davidfchangmd.com` both failed DNS lookup (`getaddrinfo ENOTFOUND`). Two web searches found no practice website, only directory listings (Kerbside, MediFind, ophthalmologyweb). The nearest verified, fetchable page is his **AAO bio page** (section 2.5). I did not guess other URLs.
- **Wellington Eye Clinic.** `www.wellingtoneyeclinic.com` failed with an SSL protocol error. `https://www.wellingtoneyeclinic.ie/` fetched fine and redirected to `https://wellingtoneyeclinic.ie/`.
- **Moorfields Dubai.** The fetched URL is the UAE group site `moorfields.ae` (Dubai and Abu Dhabi). An NHS page at `moorfields.nhs.uk/private/locations/moorfields-dubai` was returned by search but not fetched.
- **Truncation.** `moorfields.ae` returned 164,965 characters of text. Only the first 100,000 were read, so its footer and anything after the articles section is unreviewed.

## 1. Sites studied

| # | Site | URL fetched (HTTP 200 unless noted) | Region | Type |
|---|---|---|---|---|
| 1 | Bascom Palmer Eye Institute | https://www.umiamihealth.org/bascom-palmer-eye-institute | US | Academic hospital institute |
| 2 | Moorfields Eye Hospital (NHS) | https://www.moorfields.nhs.uk/ | UK | NHS foundation trust |
| 3 | Wills Eye Hospital | https://www.willseye.org/ | US | Specialty hospital |
| 4 | David F. Chang, MD | no personal site found; AAO bio https://www.aao.org/education/bio/david-f-chang-md | US | Individual surgeon (bio page only) |
| 5 | AAO EyeSmart, patient education | https://www.aao.org/eye-health | US | Professional body, patient hub |
| 6 | Dr. Amr Al-Amin | https://dramralamin.com/ | Egypt | Arabic personal-physician site |
| 7 | Magrabi Health, eye landing page | https://www.magrabihealth.com/ar/sa/eye | Saudi Arabia | Arabic-first hospital group |
| 8 | Magrabi Health, Dr. Maan's own profile | https://www.magrabihealth.com/ar/sa/eye/our-doctors/dr-maan-abdullah-barry | Saudi Arabia | The profile this site is compared with |
| 9 | Cleveland Clinic, Cole Eye Institute | https://my.clevelandclinic.org/departments/eye | US | Academic hospital institute |
| 10 | Moorfields Eye Hospitals UAE | https://moorfields.ae/ | UAE | Bilingual (EN/AR) hospital group |
| 11 | London Vision Clinic | https://www.londonvisionclinic.com/ | UK | Private refractive clinic led by a named surgeon |
| 12 | Wellington Eye Clinic | https://wellingtoneyeclinic.ie/ | Ireland | Private refractive clinic, two named surgeons |

## 2. Per-site findings

Each entry covers the fields requested. "Not observable" means the fetched text or markup did not show it.

### 2.1 Bascom Palmer Eye Institute (umiamihealth.org)

- **Visual identity.** Not observable from text. Markup shows a custom font `din-2014` and frequent hex colours `#005030`/`#00502f` (green) and `#f37321` (orange), which fit the University of Miami green and orange. The only graphics the page text names are a U.S. News "#1 … 25 Times" badge (desktop and mobile versions), small UI icons and social icons.
- **Homepage structure.** Skip link, Medicare notice banner → utility bar (UHealth, Sylvester Cancer Center, English/Español) → main nav (Appointments, Pay a Bill, Referring Physicians, International Patients, Giving, Careers, Search, Patient Login) → mega-menu (Find a Doctor, Specialties, Locations, Patients & Families, Research, Healthcare Professionals) → hero "We Are Here For You." with the ranking badge → four action tiles (Find a Doctor, Make an Appointment, Rapid Virtual Eye Care, Plan Your Visit) → "Do You Need Immediate Eye Care?" block → two feature cards → "#1 Eye Hospital, for the 25th Time" → research teaser → featured news → footer.
- **Physician introduction.** None on this page. It is an institution, with a "Find a Doctor" search instead.
- **Credentials and trust.** U.S. News ranking with the full list of years 1994-2026, ">1,200" staff and faculty, "World Leader for Ophthalmic Education". Trust is institutional and dated.
- **Photography.** Not observable (five `<img>` tags in total, all with alt text; the page text names no photographs).
- **Typography.** `din-2014` (a DIN-style sans) per the markup.
- **Medical illustration.** None on the homepage.
- **Interactive education.** Education is for professionals (learning portal, grand rounds, CME, clinical-trial search). No patient-facing interactive tool on the homepage.
- **Procedure navigation.** A "Specialties" mega-menu with 14 specialties, an A-Z index and "View all Eye Conditions". Some specialties link to condition pages (AMD, cataract, diabetic retinopathy, glaucoma).
- **Appointment conversion.** "Make an Appointment" is the second tile. The page text says its link target is `#`, so it may open a menu or be script-driven; I could not confirm. A toll-free number (800-329-7000) and a same-or-next-day virtual-care booking button are given.
- **Readability.** Not observable.
- **Mobile.** A mobile variant of the ranking badge exists; viewport meta is standard.
- **Accessibility / performance.** A skip link is present. HTML is 213 KB. JSON-LD `MedicalOrganization` is present.
- **Take-away.** Strong, dated, verifiable authority signals; a clear four-tile "what do you want to do" row; but the physician is invisible, which is the opposite of this project's need.

### 2.2 Moorfields Eye Hospital, NHS (moorfields.nhs.uk)

- **Visual identity.** Not observable from text. Markup shows custom `Kabrio` Regular and Bold fonts.
- **Homepage structure.** Header (logo, Moorfields Private, menu, A&E link, search) → hero: building photo + "People's sight matters." → mission line (excellence, equity, kindness) → "For patients" cards (Plan your visit, Our consultants, Our locations) → Eye conditions A-Z → charities → support network (eye clinic liaison officers, counsellors, PALS) → About us (UAE, Private, new Oriel centre) → news → For health professionals → research/careers → footer.
- **Physician introduction.** Via a "Our consultants" directory card. No individual physician on the homepage.
- **Credentials and trust.** NHS Foundation Trust status, CQC link, published waiting times and annual reports, "over 200 years" of care, UCL and Google DeepMind partnerships, 350+ trained volunteers.
- **Photography.** Per the page text: candid and people-focused (staff at a slit lamp, volunteers, a researcher in gloves), plus building exteriors and a CGI render.
- **Typography.** Kabrio (custom humanist sans).
- **Medical illustration.** None on the homepage.
- **Interactive education.** None on the homepage.
- **Procedure navigation.** An A-Z conditions directory plus a list of specialist services.
- **Appointment conversion.** Soft. "Plan your visit" is the main entry. Patients can cancel or change appointments and use the NHS app. Referrers use a "Single Point of Access".
- **Readability.** Not observable. The page shows no text-size, language or contrast controls.
- **Accessibility / performance.** Skip links present. 20 `<img>` tags; my grep found no `alt="..."` attributes in the raw HTML, but WebFetch reported descriptive alt text, so the markup may use a different attribute form. I make no claim either way. HTML is 256 KB.
- **Take-away.** Human, support-led tone; transparency (waiting times, CQC) as trust; an A-Z of conditions. No conversion pressure, which suits a public service but not a private personal practice.

### 2.3 Wills Eye Hospital (willseye.org)

- **Visual identity.** Not observable from text. Markup shows frequent hex colours `#e41d39` (red) and `#1890d7` (blue). The page text mentions a red-toned seal image.
- **Homepage structure.** Hiring banner → global nav (About, Careers, Newsroom, Contact, Giving, Pay Your Bill; menus for Locations, Find an Eye Doctor, Patients & Visitors, Medical Services, Medical Education, Research) → hero line "The Top Ophthalmologists in America Practice at Wills Eye" with three images → H1 and history paragraph → "Best Ophthalmology Hospital in the U.S." → featured news (three press releases) → awards & honors slider → footer (About, Physicians, Leadership, newsletter).
- **Physician introduction.** Only through "Search by Name or Subspecialty" and an awards slider naming three honorees.
- **Credentials and trust.** "Care since 1832", "more than 350,000 patients a year", U.S. News ranking claimed "every year since the survey began", Top Doctors listing, named AAO awards.
- **Photography.** Per the page text: a physician with a patient, a podium speaker, a ribbon cutting, headshots. Style not observable.
- **Typography.** Markup loads Rubik, Roboto, Work Sans, Libre Franklin and Libre Baskerville. That is five families, which is a lot.
- **Medical illustration.** None on the homepage.
- **Interactive education.** Professional education links (CME portal, Chiefs Rounds). Patient side is a link list.
- **Procedure navigation.** "Diseases and Conditions", "Treatments & Procedures" and "Eye Health" (anatomy, eye exam, injuries, children's vision) under Patients & Visitors; subspecialty list under Medical Services.
- **Appointment conversion.** "Request an Appointment" and "Eye Emergency" in the header and hero; physician search tools.
- **Readability.** Not observable.
- **Accessibility / performance.** Only 4 of 13 `<img>` tags have non-empty alt text and 9 have `alt=""` (an observed gap, since several of those images are content, not decoration). HTML 210 KB. JSON-LD `Hospital`.
- **Take-away.** A content-heavy institutional model. Its useful lesson for us is the explicit **"Eye Emergency" shortcut** next to "Request an Appointment".

### 2.4 David F. Chang, MD

- **URL verification.** `davidfchangmd.com` and `www.davidfchangmd.com`: DNS failure. No practice site found by search. **No homepage could be studied.**
- **What was verified instead: AAO bio page** (https://www.aao.org/education/bio/david-f-chang-md, HTTP 200). It presents him as a cataract surgeon and educator: Harvard College (summa cum laude), Harvard Medical School, UCSF residency and clinical professorship, AAO and ASCRS committee roles, editorial roles, authored textbooks (*Phaco Chop*, 2004; *Curbside Consultation in Cataract Surgery*, 2007), scientific advisory roles for device companies, and one FDA-monitored trial role. It lists **no practice location and no personal site**.
- **Directory listings (not fetched, from search snippets only).** Private practice in Los Altos, CA, "since 1984". I treat this as unverified.
- **Take-away.** The credential pattern is worth noting: a surgeon-educator's authority is shown by **named, checkable roles** (committees, textbooks, trials), each one a verifiable fact, rather than superlatives. Everything else in the requested fields is not observable.

### 2.5 AAO patient education (aao.org/eye-health)

- **Visual identity.** Not observable from text. Markup shows the Gotham SSm webfont with an Arial fallback; hex colours seen include `#990000` and `#5663eb`.
- **Homepage structure (hub).** Skip link → utility bar (My Dashboard, Find an Ophthalmologist, Log in) → main nav → patient menu (Eye Health A-Z, Symptoms, Glasses & Contacts, Tips & Prevention, News, Ask an Ophthalmologist, Patient Stories, No-Cost Eye Exams, Spanish) → breadcrumb → five feature tiles → about 20 common-topic links → "More Eye Health Topics" → Find an Ophthalmologist search → news list (578 results, paginated) → newsletter → footer with Medical Disclaimer and AI statement.
- **Physician introduction.** Not applicable; it links to a physician finder.
- **Credentials and trust.** "ophthalmologist-reviewed information". No reviewer names or dates appear on the hub itself.
- **Photography / illustration.** Thumbnails on tiles and news. Video appears as embeddable resources for professionals. Illustration quality is not observable.
- **Interactive education.** "Ask an Ophthalmologist" Q&A, Eye Health A-Z, symptom browsing, newsletter. No simulator on this page.
- **Procedure navigation.** A flat list of common topics plus an A-Z; paths grouped as diseases, symptoms, tips, drugs, anatomy.
- **Appointment conversion.** None, by design (it refers to a finder).
- **Readability.** The hub states no reading level.
- **Accessibility / performance.** Skip link present. **The viewport meta tag contains `maximum-scale=1`, which blocks pinch-zoom on mobile.** That is a WCAG 1.4.4 risk and a pattern to avoid. 27 images, 19 with alt, 3 empty; no `loading="lazy"` found.
- **Take-away.** The "A-Z + symptoms + tips" taxonomy and the "ask a doctor" pattern are useful. The unnamed "ophthalmologist-reviewed" label shows the weak version of review labelling.

### 2.6 dramralamin.com (Arabic IA reference)

- **Language.** `<html dir="rtl" lang="ar">`. Social labels and "Call Now Button" are in English.
- **Visual identity.** Stylised Arabic wordmark with the doctor's name (page text). Colours not observable; the HTML contains almost only default WordPress palette values.
- **Homepage structure.** Skip link, logo, menu → doctor introduction (headshot, name, credential list) → "some clinic services" tiles (LASIK, corneal transplant, cataract, keratoconus, lens implantation, eye injection) → partner logo strip (ZEISS, Al-Kon (as spelled in the fetched text), device brands, J&J, EVO Visian, Physiol) → longer biography with four conference photos → social row → patient testimonials (five named reviewers) → statistics counters → social row again → LASIK overview → video library link → contact block (phone, Nasr City address) → footer with floating WhatsApp and call buttons.
- **Top navigation.** Home · Dr. Amr Al-Amin · Eye diseases (dropdown of five) · Refractive surgery (dropdown of six) · Medical articles (about 15 posts, including pricing posts) · Contact us (WhatsApp).
- **Physician introduction.** First thing on the page: headshot, name and credentials. Credentials listed include Fellow of the Royal College of Ophthalmologists (Edinburgh), AAO membership and ESCRS membership. The bio leans on attending conferences and honours from "medical bodies and companies".
- **Credentials and trust.** Fellowship and memberships, conference photos, partner logos, named testimonials in colloquial Egyptian Arabic, counters. **Anti-pattern observed:** the counters (certifications, years, "approximate successful surgeries") rendered as "0" in the static capture, so a no-JS or slow reader sees a row of zeros; "successful surgeries" is also an outcome claim.
- **Photography.** Professional headshot, event photos, product and procedure photos. All 20 `<img>` tags have alt text (Arabic and English per the page text).
- **Typography.** Tajawal and Cairo (self-hosted woff2 under `/wp-content/fonts/`).
- **Medical illustration / interactive education.** None. Education is articles plus a YouTube playlist.
- **Procedure navigation.** Three routes to each procedure page: the two dropdown menus, the homepage tiles and the LASIK overview; articles give a second route.
- **Appointment conversion.** WhatsApp in the social row, footer and a floating button; a floating "Call now"; a phone number in the contact block. **No online booking form.**
- **Readability / mobile.** Not directly observable. Viewport is standard (`width=device-width, initial-scale=1, minimum-scale=1`). 11 of 20 images are lazy-loaded. A skip link is present.
- **Take-away.** The IA is right for a personal physician: doctor first, services as tiles, a page per procedure, a persistent WhatsApp/call button. The statistics, partner logos and testimonials are what this project already declined to copy (see `INFORMATION_ARCHITECTURE.md`).

### 2.7 Magrabi Health, eye landing page and Dr. Maan's profile (Middle East, Arabic-first)

**Landing page `/ar/sa/eye`**

- **Language.** `<html lang="ar" dir="rtl">`, with an English toggle and a country selector (Saudi Arabia, Egypt, Qatar, UAE) and Eye/Dental/ENT tabs.
- **Visual identity.** Not observable. Markup references the Arabic font **Almarai**; frequent hex values include navy `#000080`, turquoise `#40e0d0` and a blue `#1155cc` (low confidence, because the markup is a Next.js bundle with many inline values).
- **Structure.** Top bar (call centre 19505, language, country) → header buttons "Find a doctor" and "Book an appointment" → hero carousel of **seven slides** (accreditation news, an instalment-payment promotion, cosmetics, patient care, eye, dental, ENT) → about + statistics → three eye service cards → "why choose us" → doctors carousel → app download → news → branches with open/closed status → footer with insurance, accreditation logos, newsletter.
- **Trust.** Founded 1955 ("70 years"), SRC, JCI and CHI accreditation logos, a published list of volume statistics.
- **Navigation.** Doctors via a directory plus search by specialty and branch; services as cards.
- **Conversion.** "Book now" repeated in the header, hero and about block; an instalment promotion.
- **Accessibility / performance.** 98 `<img>` tags, 90 with alt, 8 empty; 100 lazy-loaded. No skip link found. HTML 515 KB.

**Dr. Maan's profile page** (observed 2026-11-02, relevant because it is the source this site cites)

- Order: header → breadcrumb and name → specialty title and two units (Cataract Unit, Keratoconus Treatment Unit) → hospital card (address, "closed now, opens tomorrow at 09:00") → biography → quick facts → why choose → conditions and services (cataract, vision correction, corneal problems, pre-procedure tests, follow-up) → credentials and "where to visit" → a **five-step WhatsApp booking** explainer → related services → booking CTA → **three five-star patient reviews in a carousel** → empty "related videos" → FAQ → app links → footer with SRC, JCI, CHI badges.
- Introduction: "consultant in cataracts, refractive surgery and corneal care", framed around a case evaluation **after the medical examination**.
- Credentials listed on the page today include the roles "المدير الطبي التنفيذي – مغربي المدينة المنورة" and "رئيس قسم طب وجراحة العيون بجامعة طيبة" in the present tense, plus FRCS (UK), AAO and SOS membership. This is the known conflict recorded as B-7 / D-2 / D-3 (owner and doctor wording differs from Magrabi's page).
- Reviews carry names and initial-letter avatars (no photos).
- **Observation for the registry:** the page's footer badges name SRC, JCI and CHI. This site's clinic section names **JCI and CBAHI**. I could not confirm CBAHI from the fetched text. Re-check before the next release.
- Booking CTAs: many WhatsApp buttons with prefilled messages, 19505, an online form, a chatbot prompt. No doctor headshot is visible in the page text.

### 2.8 Cleveland Clinic, Cole Eye Institute

- **Visual identity.** White background, card layout, blue accent icons (page text); fonts per markup: Lato, News Cycle, Roboto Condensed and Roboto loaded from Google Fonts.
- **Structure.** Closures banner → utility bar (phone, MyChart) → breadcrumb → hero with intro, appointment number and an expansion rendering → "Why Choose the Cole Eye Institute?" with **counted figures** (380,000+ outpatient visits, 20,300 surgeries, 60+ trials, 8 operating rooms, 60 exam rooms) → Doctors & Departments cards → Online Virtual Visits → **five downloadable Treatment Guides** → optical shops → patient stories → "Outcomes Now Online" → news.
- **Physician introduction.** A provider search card only.
- **Trust.** No rankings or badges on the page. Trust comes from specific, countable figures, clinical-trial count, published outcomes data and dated patient stories.
- **Interactive education.** Downloadable guides (AMD, cataract surgery, diabetic retinopathy, laser vision correction, retinal diseases).
- **Conversion.** The phone number appears in the hero and footer ("216.444.2020"), plus "Request an Appointment".
- **Accessibility / performance.** 16 images, all with alt; no skip link found by grep; no JSON-LD in the fetched HTML; HTML only 50 KB (most content loads later).
- **Take-away.** Counted, concrete facts beat slogans; a downloadable guide is a low-effort, high-trust education format.

### 2.9 Moorfields Eye Hospitals UAE (moorfields.ae), Arabic and English

- **Language.** `lang="en-US"` with an `العربية` link to a separate `/ar/` version.
- **Visual identity.** Markup loads Poppins from Google Fonts plus custom `Kabrio` and the Arabic face **`GE SS Unique`**; hex values seen include `#fbb800`, `#0095d9`, `#06465c` and `#0e7c8c` (yellow, blue, deep teal). A signature brush font (`Rocklist Brush`) is also loaded.
- **Structure.** Header (two phone numbers, social, "Request an Appointment", "Book") → hero "Specialist Eye Hospital in Dubai & Abu Dhabi" with **three buttons** (Book a Visit, Find a Doctor, Conditions we Treat) → **booking form** (location, name, phone, email, specialty, doctor) → introduction → fact counters (200+ years, 15+ years in UAE, 400,000+ patients, 50+ specialists) → about video → **condition search with suggested terms** → 18 service cards → **doctor cards with filters** → Google rating 4.6/5 from 1,583 reviews → articles with category filters.
- **Physician introduction.** Doctor cards: studio-style headshot, title, short introduction, expertise, qualifications, memberships, research, "View Profile".
- **Trust.** JCI and ACHSI accreditation, a "Centre of Excellence" recognition, heritage, counts, a **third-party review score with count and a link to the source** (rather than copied review text).
- **Interactive education.** Condition search with suggestions, FAQ, an educational hub, specialist-bylined articles by category.
- **Accessibility / performance.** 290 `<img>` tags: 203 with non-empty alt and 6 empty alt; **only one `loading="lazy"` attribute**. HTML 652 KB. Skip links present. JSON-LD is rich: `Hospital`, `MedicalCondition`, `MedicalTherapy`, `EducationalOccupationalCredential`.
- **Take-away.** The best model found for "conversion without clutter" (three intent buttons plus a short form), for doctor cards, and for citing a review score instead of reproducing reviews. Its weight (290 images, almost none lazy) is a cautionary tale.

### 2.10 London Vision Clinic

- **Visual identity.** Not observable. Markup: WordPress with Elementor, font Oxygen plus a system stack.
- **Structure.** Hero "Laser Eye Surgery. You Deserve The Best From London!" with three buttons (Book Now, Suitability, Price Guide) → finance banner → product promotions (PRESBYOND, higher prescriptions) → treatment overview with **starting price** → free 30-minute consultation → education blocks (best laser surgery, what is laser eye surgery, SMILE Pro vs LASIK vs PRK) → "Five Reasons to Choose us" → testimonials with a callback prompt → procedure spotlights → patient videos → callback form.
- **Physician introduction.** The founding surgeon appears inside the SMILE Pro section with a link to a profile page. No qualifications or registration numbers are listed on the homepage.
- **Trust.** Unquantified: "over two decades", "tens of thousands of surgeries", "thousands of surgeons trained", Trustpilot link, TV appearances. **These are the kind of vague claims this project rejects.**
- **Procedure navigation.** Buttons and "Find Out More" links; comparison articles as the main education.
- **Interactive education.** None visible. Forms and videos only.
- **Conversion.** Heavy: Book Now repeated, free consultation, callback popup and form, interest-free finance. 
- **Accessibility / performance.** 17 images all with alt; 3 lazy; skip link present; JSON-LD `MedicalClinic` with `OpeningHoursSpecification` (a good pattern: hours in structured data).
- **Take-away.** The "Suitability" button and the comparison articles ("X vs Y vs Z") answer the question a patient actually asks. Its price-first and promotional hero do not suit a physician site and are not recommended.

### 2.11 Wellington Eye Clinic

- **Visual identity.** Not observable. Page text names a "LifestyleVisionDesign" wordmark and "Own your vision".
- **Structure.** Nav (Treatments, Pricing, The Team, Get in Touch, **Book Appointment**) → hero + "Book a Consultation" → **self-test** ("Take the Self Test") → Lifestyle Vision Design → three statistics (values not in the fetched text) → Google and Trustpilot reviews with "read more" → accreditation by a refractive-surgery college → two clinics (Dublin, Cork) → blog → videos → memberships (AAO, ASCRS, ESCRS and others) → footer.
- **Physician introduction.** **Absent from the homepage.** Surgeons are named only inside patient reviews; "meet the team" is a separate page.
- **Trust.** Accreditation and membership logos, and reviews.
- **Interactive education.** A self-test questionnaire, the only interactive tool linked.
- **Accessibility / performance.** The raw HTML contains no `<img>` tags (the site is likely script-rendered), the viewport is `width=device-width` only, JSON-LD `MedicalClinic`. HTML 660 KB.
- **Take-away.** A self-test as a primary call to action is the closest existing analogue of this site's questionnaire. The missing physician introduction is a negative example.

## 3. Cross-site observations

| Topic | What the sites do | Note for this project |
|---|---|---|
| First screen | Institutions lead with a ranking or a promise; the personal-physician site (6) leads with the doctor | A single-physician site should show the person and the action together |
| Intent tiles | Bascom (4 tiles), Moorfields UAE (3 buttons), Wills (appointment + emergency), LVC (3 buttons) | Convergent pattern: 3 to 4 verbs, always including "book" |
| Condition discovery | A-Z (Moorfields NHS, AAO, Bascom), search with suggestions (Moorfields UAE), grouped menus (dramralamin) | Combine a short grouped gallery with symptom-led entry |
| Trust signals | Dated rankings (Bascom), counted figures (Cole), accreditation and third-party review score (Moorfields UAE) vs unquantified claims (LVC) and zero-rendering counters (dramralamin) | Specific and verifiable beats big and vague |
| Physician page | Card with expertise, qualifications, memberships (Moorfields UAE); credential list (dramralamin); quick facts (Magrabi) | A credential ledger with sources already fits |
| Education | Guides (Cole), A-Z (AAO), articles by category (Moorfields UAE), self-test (Wellington) | Interactive plus printable guide |
| Arabic type | Tajawal/Cairo (6), Almarai (7), GE SS Unique (10) | This site uses Noto Sans Arabic and Readex Pro, a reasonable choice |
| Accessibility defects seen | `maximum-scale=1` (AAO), empty alt on content images (Wills), no skip link (Magrabi, Cole), 290 images with one lazy attribute (Moorfields UAE) | Easy to beat |

## 4. Synthesis: nine adoptable principles

Each one says what to adapt and how to make it original. Do not reproduce any layout, wording or imagery from the sites above.

1. **Put the person and the action on the first screen, with intent buttons beneath.**
   Evidence: dramralamin leads with the doctor; Moorfields UAE and Bascom use three or four verbs near the top.
   Adapt: hero = name, title, one-line positioning, **Book** (primary), **Call / WhatsApp** (secondary), then a row of three Arabic-first intent buttons in patient language ("أشعر أن نظري ضعيف", "أفكر في الاستغناء عن النظارة", "أريد موعداً"), each linking to an existing procedure page or the booking section. Use logical properties so the row mirrors correctly in English.

2. **Show authority as verifiable, dated, specific facts, each with its provenance.**
   Evidence: Bascom lists ranking years; Cole counts visits and trials; Chang's bio lists named committees and textbooks.
   Adapt: a credential ledger that draws only from `doctor-data.js` facts whose registry status is public. Keep the "meaning" next to "15,000+" (examinations and procedures combined). Add a small "as published by Magrabi / confirmed by Dr. Maan" tag per row and a "last verified" date in the footer. Never add outcome rates, "100%", ratings or counters that depend on JavaScript to show a value.

3. **Make condition discovery symptom-led, not only procedure-led.**
   Evidence: Moorfields UAE's condition search with suggested terms; AAO's symptoms index; Moorfields NHS A-Z.
   Adapt: a compact finder (chips, not free text) mapping concerns such as "blurred or cloudy vision", "glasses dependence", "changing prescription", "corneal thinning" to the seven procedure pages and to the questionnaire. Copy it in plain Arabic, then English. State "this is not a diagnosis" once and visibly.

4. **Give each procedure the same page template and cross-link by decision, not by category.**
   Evidence: dramralamin's page-per-procedure; LVC's "X vs Y vs Z" comparison pieces; Moorfields UAE's 18 service cards.
   Adapt: keep the existing 9-section template. Add a "compare with" block that links LASIK/PRK/SMILE/ICL and monofocal/EDOF/trifocal pages to each other with a neutral two-column "differences" table. Use the existing related-procedures list as the engine.

5. **Make the interactive tools honest about what they are, and offer a printable take-away.**
   Evidence: Wellington's self-test; Cole's downloadable guides; AAO's "ask an ophthalmologist".
   Adapt: keep the vision simulator and questionnaire, and restore the questionnaire's answer-driven summary in neutral wording (see the Content Preservation Matrix). Add a one-page printable "questions to bring to your visit" generated from the answers, saved locally only. Label every tool with scope and limits in the same place, in the same wording.

6. **Convert with one consistent set of three actions, plus a "what happens next" explainer.**
   Evidence: Magrabi's five-step WhatsApp booking explainer on the doctor profile; Moorfields UAE's short booking form; dramralamin's floating call and WhatsApp.
   Adapt: keep the existing sticky bar (Book, Call, WhatsApp). Add a three-step "How booking works" strip on the clinic section (choose a route, confirm by the clinic, bring your records). WhatsApp messages are prefilled with the page's procedure name. Add an "Eye emergency" shortcut that links to the red-flag card, as Wills does, but with wording that sends the reader to the nearest emergency department, not to the clinic.

7. **Label review status truthfully; cite third-party ratings instead of reproducing reviews.**
   Evidence: AAO says "ophthalmologist-reviewed" without names; Moorfields UAE shows a Google score and count linked to the source; Magrabi's own profile reproduces reviews.
   Adapt: show "Reviewed by Dr. Maan on <date>" only when a signed review record exists; otherwise keep "draft pending review". For patient feedback, link out to the Magrabi profile reviews (a link, not a copy) after the owner agrees, until verbatim text and permission are documented. Never render star ratings.

8. **Use authentic, human photography and original medical illustration, and keep weight low.**
   Evidence: Moorfields NHS uses candid staff photos; dramralamin uses conference photos; Moorfields UAE shows the cost of 290 images.
   Adapt: use only real photographs of Dr. Maan and the clinic that the owner confirms. Keep the in-house procedure illustrations (WebP, light and dark). Give every content image meaningful alt text in the page language, lazy-load below the fold, and never block pinch-zoom in the viewport meta.

9. **Treat Arabic as the primary typographic case.**
   Evidence: Magrabi and dramralamin default to RTL with Arabic webfonts; Moorfields UAE needs a separate `/ar/` path.
   Adapt: size and set Arabic first (larger body size, line-height near 1.8, no letter-spacing on Arabic), then derive the English. Use `dir` and logical CSS properties throughout, format numerals consistently (`<bdi>` for phone numbers, which the site already does) and keep a visible language switch on every page.

## 5. Recommended homepage section order

Current order: hero → procedures → profile → simulator → 3D cataract → education (+ questionnaire) → FAQ → clinic → closing CTA.

Recommended order, with reasons:

| # | Section | Reason (evidence) |
|---|---|---|
| 1 | Header with Book and language switch | Persistent action; every benchmark has it |
| 2 | **Hero**: name, specialty, Book + Call/WhatsApp, three-fact trust strip (FRCS, Saudi Board, since 1998, 15,000+ with its meaning) | Doctor and action together (dramralamin, Moorfields UAE) |
| 3 | **"What brings you here?"** intent and symptom chips → procedure pages | Convergent tile pattern; answers the visitor's first question |
| 4 | **Procedures gallery** (3 groups, 7 cards) | Moves up before the biography: patients ask "can he treat this?" before "who is he?" (Moorfields UAE: services before doctors) |
| 5 | **Meet Dr. Maan**: a short approved bio paragraph, real photograph, credentials ledger, appointments timeline, one conference photo with caption | The current page drops the bio paragraph; restores warmth and proof. Needs approved wording (see Matrix) |
| 6 | **Your visit**: four-step path (examination, consultation, procedure, follow-up) and the core assessments | Reduces anxiety; mirrors Magrabi's booking explainer; content exists in earlier revisions |
| 7 | **Understand your options**: lens comparison sheet, then the vision simulator | Interactive education with the comparison as the readable fallback |
| 8 | **3D cataract surgery** (poster first, lazy-loaded) | Differentiator; stays below the fold for performance |
| 9 | **Education**: short answers, red-flag card, questionnaire with answer-driven summary, printable questions | Interactive plus printable (Cole, Wellington) |
| 10 | **FAQ** (6 questions, mirrored in JSON-LD) | Unchanged |
| 11 | **Clinic and booking**: three ways to book, how it works, hours, map, accreditation | Conversion close; keep the hours as confirmed |
| 12 | Closing CTA and footer with disclaimer | Unchanged |

Testimonials stay hidden until the publication gate passes. If the owner agrees, add a single "Read patient reviews on Magrabi" link in section 11, not copied text.

## 6. Limitations of this research

1. **Not visual.** WebFetch returns text through a summarising model. No page was rendered or screenshotted, so colour palettes, layout quality, photographic style and medical-illustration quality could not be judged for most sites. Where markup gave a hint (fonts, hex values) it is reported with its confidence.
2. **Hex colours are counts of strings in the HTML,** not computed brand palettes. They indicate, they do not prove.
3. **Script-rendered content is missing.** Several pages (Cole, Wellington, Moorfields UAE) load content after the first HTML. Counts of images and alt attributes describe the delivered HTML only.
4. **No mobile or performance measurement.** Only the viewport meta tag, lazy-loading attributes and HTML weight were checked. No Lighthouse, no real-device test, no screen-reader pass.
5. **No personal site for David F. Chang** could be verified, so one requested benchmark is replaced by his AAO bio page. Practice details from search snippets are unverified.
6. **Moorfields UAE was read in part** (first 100,000 of about 165,000 characters).
7. **Sample.** Twelve pages (eleven sites plus one doctor profile), one fetch each on one day. Pages change; the dated facts (rankings, counts, review scores) are as of 2026-11-02.
8. **Middle East coverage is thin.** Two Arabic-first sites (dramralamin, Magrabi) and one bilingual group site (Moorfields UAE). No Gulf personal-physician site beyond Magrabi's profile page was found and verified.
9. **Statements about other sites' claims are not endorsements.** Counts, rankings and accreditations were reported as shown, not independently verified, and several (for example Magrabi's CBAHI/SRC difference) are flagged for re-checking.
10. **No user research.** Everything here is analysis. Patient interviews or a five-user Arabic usability test would give stronger evidence for the intent-button and symptom-chip proposals.
