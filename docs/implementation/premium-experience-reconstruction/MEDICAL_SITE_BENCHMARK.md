# Medical information-architecture benchmark: dramralamin.com

Reference: https://dramralamin.com/ (the Arabic-language site of an ophthalmologist in Cairo).
Studied on 2026-11-07 with Playwright 1.64.1 and headless Chromium, at 1440x900 desktop and 390x844 mobile (`isMobile`, `hasTouch`). Every page returned HTTP 200 and nothing blocked automation.

> **Scope warning.** This site is used **only** as a reference for structure and presentation. Its procedure list, claims and statistics describe a different doctor in a different country. They say **nothing** about Dr. Maan Albarry's services and must not be used to infer his scope. Dr. Maan's service list must come from Dr. Maan.
>
> **Copyright.** Nothing from this site is copied into the repo. Screenshots and JSON are kept outside the repo at
> `C:\Users\sam20\AppData\Local\Temp\claude\f2087d8af4436a92\57913716-dded-44b8-8dcd-991689f3201b\scratchpad\research\` (`out\amr-*`, `film\amr-*`).

**Pages opened:** the homepage (desktop and mobile), the doctor profile page, three procedure/condition pages (LASIK, keratoconus, lens implantation), and the "medical articles" category listing.
**Not done, deliberately:** no form was submitted, and no call or WhatsApp link was clicked. The homepage has **0 `<form>` elements**.

**Platform:** WordPress 7.1.4 with Elementor, a Kadence-style header and drawer, and a Swiper carousel. It is Arabic only (`lang="ar"`, `dir="rtl"`); no English version was found. Fonts are **Tajawal** for body text (17 px / 27.2 px = 1.6), **Cairo** for the nav (18 px), and **Roboto** for the counters (69 px).

---

## 1. Homepage structure (desktop 4,783 px; mobile 8,582 px)

| # | Block | What it does | Measured presentation |
|---|---|---|---|
| 1 | Header | Brand, IA, contact | Black bar 79 px, `position: relative` (**not sticky**), logo on the right, 6 items in Cairo 18 px, blue "Contact us" button (98x43, radius 3) linking to the WhatsApp API |
| 2 | Doctor intro (first screen) | Who the doctor is | Two columns of 550 px each inside a 1,140 px container: the name as an **H3, 24 px** (not H1), then **7 credential lines** (consultant titles, a Royal College fellowship, two international society memberships) at 17 px. Beside it, a photo of the doctor at a desk, 550x367 (1.5). **No headline value proposition and no in-hero CTA** |
| 3 | "Some clinic services" | Service categorization | Gold h2 28 px `rgb(205,161,52)` on black, then **6 tiles in a 3x2 grid**, each a 360x240 (1.5) 3D eye-anatomy render with a label. **The tiles are not links** (no `<a>` inside), so they dead-end |
| 4 | "Partners in success" | Device or industry credibility | White strip, 5 manufacturer logos at about 102x57 each |
| 5 | Bio | Credentials narrative | H1 (32 px) **placed here, about 1,300 px down the page**. A 550x550 square carousel of 4 conference and award photos, plus a paragraph about conferences and honours |
| 6 | Social row | Channels | 7 icon buttons (Facebook, YouTube, TikTok, Instagram, X, WhatsApp, phone); **repeated twice** on the page |
| 7 | Testimonials | Social proof | Gold h2, a 5-star graphic, **6 text quotes in 3 columns** with first names only and no dates or sources |
| 8 | Counters | Quantified authority | 3 stats (certificates, years of experience, approximate number of operations) at Roboto **69 px**. They count up from 0 when they scroll into view |
| 9 | Featured procedure | Deeper promo for one service line | Split layout: text (H3 24 px plus a paragraph) and a 550x367 carousel of clinic photos |
| 10 | Video library | Education | 3 YouTube thumbnails at 360x202 (16:9) with large burned-in Arabic titles, plus a "More videos" button to a YouTube playlist on a black-to-gold gradient band |
| 11 | Contact | Location, phone | Phone number in large type, the full street address as an H3 (19 px), a Google Maps embed, social icons |
| 12 | Floating | Persistent contact | Desktop: a fixed "WhatsApp us" button, 157x43, bottom right. Mobile: the same button plus a **round 55x55 call button** at the bottom left |

**Mobile homepage.** Columns stack (photo, then name, then credentials, then 6 service tiles in one column). The page grows to 8,582 px (10.2 viewports). The header is not sticky. The hamburger (37x31) opens a **full-width dark drawer (390x844)** with 5 top-level items at 14 px and 50 px rows; the submenus are accordions.

## 2. Information architecture and patient navigation

Top navigation, in RTL order:

1. Home
2. Doctor profile
3. **Eye conditions** (dropdown with 5 conditions)
4. **Vision-correction procedures** (dropdown with 6 procedures)
5. Medical articles (dropdown with 15 SEO-titled articles, mostly about cost, price and "best doctor")
6. Contact (a WhatsApp link)

- **The strongest mechanic is the split between *conditions* (what the patient has) and *procedures* (what can be done).** Patients usually arrive with one of these two mental models.
- On desktop, the dropdowns open on hover as black panels with 62 px rows (see `out\amr-desktop-dropdown.png`). On mobile they are accordion sub-toggles in the drawer.
- There are no breadcrumbs and no "related procedures" block. Cross-links exist only as inline text links inside the article body (for example, a link to the keratoconus page from the LASIK eligibility list).
- **The homepage does not route into the IA.** The service tiles are not clickable, so a patient has to go back to the nav.

## 3. Credentials presentation

| Where | Form | Notes |
|---|---|---|
| First screen | A plain stacked list of 7 titles and memberships (17 px) | The most credible element on the site, and the plainest |
| Bio block | Conference photos plus a narrative paragraph | Photos show a branded industry podium. That signals activity, but the context is not explained |
| Partners strip | Manufacturer logos | Can read as an endorsement claim. Avoid this for Dr. Maan unless there is a formal relationship and it is permitted |
| Counters | 3 round numbers (one is "approximately …") | Unsourced and animated from 0, which reads as marketing rather than evidence |
| Procedure page sidebar | Photo (228x300) plus the same credential list | Credentials repeat on every procedure page, which is a good pattern |
| Profile page | Photo 300x450 plus the same 7-line list plus one CTA to a procedure | Thin. No training timeline, hospital affiliation, licence number or languages |

## 4. Procedure and condition pages (dedicated pages opened)

| Page | Template | H1 | Body outline | Media | Length (desktop / mobile) |
|---|---|---|---|---|---|
| LASIK | Blog-post template: title band plus "by … · Jan 2021" meta; 2 columns (**sidebar 338 px + content 845 px**, gap about 107 px) | yes (32 px) | **15 H3 sections (24 px)** in a patient-question order: what it is → eligibility → pre-op tests → pre-op instructions → during → after → aftercare tips → suitable age → contraindicating condition → 2-week recovery → success rate → blurry-vision causes → can it be repeated → after other surgery → driving | 4 stock images at 450x300 (1.5), some with English stock text; one embedded YouTube video; share icons at the end | 8,530 / 13,600 px |
| Keratoconus | the same | yes | about 15 H3s: definition → symptoms → diagnosis → treatment → surgical options → then an FAQ run (permanence, seriousness, headaches, blindness risk, complications, pain, how patients see, pregnancy) | 4 images at 450x300 plus 4 related-post thumbnails at 150x150 | 7,783 px |
| Lens implantation | **A different template**: no title band, **no H1** (the first heading is an H2, 28 px), no sidebar, text runs edge to edge | **missing** | about 12 H3s: how it's done → after → tips → risks → candidates → success rate → pain → recovery time → removal | none | 1,984 px |

**Common features across the procedure pages:**

- Questions are written in plain language as H3s, and bulleted lists hold the instructions. This is the right *content* shape for patients.
- Content text is 17 px / 1.6 at 781 px wide (desktop), which is about 90+ Arabic characters per line, too long a measure. On mobile it is 326 px wide.
- There is **no in-body booking CTA**, no "when to see a doctor urgently" callout box, no "medically reviewed / last updated" date (only the 2021 post date), and no references.
- The sidebar carries irrelevant blog widgets (search, a **calendar**, a "patient satisfaction" stock graphic).

## 5. Service imagery

- Homepage service tiles use 3D anatomical eye renders on transparent backgrounds. They are consistent with each other but generic, and they show pathology (a cataract-clouded lens, red vessels), which can be off-putting.
- Procedure pages use mixed stock photos (450x300) with inconsistent style and some English stock typography inside them.
- The doctor is photographed in 3 settings (office desk, clinical white coat, conference podium). These are the most trust-building images on the site.
- Video thumbnails are YouTube-style, with large burned-in text and the doctor's face.

## 6. Booking flow

- There is no booking form, no appointment page and no calendar booking. **Every conversion path goes to WhatsApp (`api.whatsapp.com/send`, `wa.me`) or `tel:`**. These are the header button, the floating WhatsApp button, the floating call button (mobile), the contact block and the social row.
- No clinic hours, no price policy and no "what to bring" information appear on the pages studied.
- None of these links were clicked.

---

## 7. "General premium site" versus "medically credible patient-information site"

| Dimension | General premium site (Madinah Cultivator) | Medically credible patient site (target for Dr. Maan) | What dramralamin shows |
|---|---|---|---|
| First screen goal | Mood and identity: a cinematic image, a 96 px name, no CTA | Identity **plus** reassurance: the doctor's name and specialty as H1, 1–2 verifiable credentials, location, and one clear way to book | Credentials are present, but the H1 is missing at the top and there is no booking CTA in the hero |
| Navigation model | In-page anchors on one long scroll | Task routes: conditions, treatments, the doctor, a patient guide, booking | Conditions and procedures are split correctly |
| Depth | Everything on the homepage; internal pages are only forms | Homepage = summary and routing; **each condition/treatment gets its own page** with a consistent outline | Dedicated pages exist, but the templates are inconsistent |
| Proof | Media coverage, partner logos, numbered process | Qualifications, affiliations, licence, a review date and plain-language risk information | Unsourced counters, anonymous testimonials, manufacturer logos |
| Imagery | Atmospheric illustration, full-bleed | Real people and real places (the doctor, the clinic), neutral anatomy diagrams; no graphic pathology on the homepage | Graphic 3D pathology renders and stock |
| Motion | Scroll-scrubbed sequences, pinned chapters | Restrained; must not delay reading; honour `prefers-reduced-motion` | Counter animation, carousels |
| Conversion | A form on a dedicated page with preselected intent | Booking or contact with expectations set (hours, what happens next), plus a quick channel | WhatsApp and call only, floating |
| Tone | Aspirational | Calm, factual, no superlatives or guarantees | SEO "best doctor" and price titles |

**Bottom line.** Combine the *architecture* (conditions / procedures / doctor / education / contact) and the *procedure-page question outline* from dramralamin with the *presentation discipline* of Madinah Cultivator (type scale, spacing rhythm, card system, progressive disclosure, bilingual line-height tuning). Do not adopt either site's content, claims or brand look.
