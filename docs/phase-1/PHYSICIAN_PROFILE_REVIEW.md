# Physician profile review (`/about/`, `/en/about/`)

Every fact on the profile is read from `doctor-data.js`; its provenance is in `content/internal-registry.json`.
Nothing on the page is invented: no quotes, awards, testimonials, outcome figures or undocumented dates.
Owner and doctor acceptance of the wording is **pending**.

## 1. Page structure

1. **Introduction** — breadcrumb, full name as the single `<h1>`, one factual sentence (title, hospital, since
   1998), the conference photograph `dr-maan-redsea.jpg` with a caption.
2. **Profile** — the R5 biography paragraph (units, assessment of lens and cornea, keratoconus, laser and lens
   options) and a second sentence built only from registry roles; Book and Clinic buttons; three facts (1998,
   15,000+ with its confirmed meaning, FRCS).
3. **Areas of expertise** — three fields (R5 `areas` text) with their procedure illustrations and links to the
   seven procedure pages.
4. **Qualifications & appointments** (`#profile`) — the credential ledger (qualifications, academic, leadership,
   memberships) with a source tag per row, and the full appointments timeline. Each item has a plain-language
   "why it matters to you" line.
5. **Professional record** — only dated, documented milestones: 1998 (start of practice, owner-supplied), 2024
   (Saudi Ophthalmology – The Red Sea, documented by the owner-supplied photograph), and "Today" (current role).
   Undated roles are not given years.
6. **Educational contributions** — academic rank, former department chair, conference co-founder, SOS
   representative (all registry roles), plus links to the site's education library, 3D walkthrough and Lens Lab.
7. Social channels, Magrabi and Taibah profile links, closing booking band.

## 2. Facts shown and their sources

| Fact | Source category | Shown as |
|---|---|---|
| Consultant Ophthalmologist (Cornea, Cataract & Refractive Surgery) | magrabi | Title |
| Practice since 1998 | owner | Fact strip, record |
| 15,000+ eye examinations & surgical procedures (career total, combined) | doctor | Fact strip with meaning |
| FRCS (UK) | magrabi | Ledger + why line |
| Saudi Board in Ophthalmology | doctor | Ledger + why line |
| Associate Professor – Taibah University | doctor (published by Taibah) | Ledger + why line |
| Chief of Staff – Magrabi Health Madinah (current) | doctor | Ledger, timeline + why line |
| First President, Saudi Association of Cornea, Cataract & Refractive Surgeons | owner | Ledger, timeline + why line |
| Former Chair, Ophthalmology, Taibah University (10 years) | owner | Ledger, timeline + why line |
| Former SOS representative, Madinah | owner | Timeline + why line |
| Co-founder, Red Sea International Ophthalmology Conference | owner | Timeline + why line |
| Memberships: Saudi Ophthalmological Society, American Academy of Ophthalmology | magrabi | Ledger |
| Hospital, address, hours, phones | magrabi / doctor | Clinic & booking links |

## 3. Pending — NOT shown publicly

Recorded in the registry with `"display": "pending"` (a test checks they do not appear on `/about/`):

| Registry id | Item | Why pending |
|---|---|---|
| `role-redsea-scientific-council` | Scientific Council Member – Red Sea Ophthalmology Conference | Published by Magrabi, dropped by the owner at R2; overlaps "co-founder". Ask Dr. Maan. |
| `role-sos-former-secretary` | Former Secretary – Saudi Ophthalmological Society | Published by Magrabi, dropped at R2. Ask Dr. Maan. |
| `hospital-src-excellence` | SRC Center of Excellence (hospital) | Needs owner-approved attributed wording. |

Also not shown: the hero quote (R3, no author/approval), the "Chief Medical Officer" wording (contradicts the
confirmed Chief of Staff), any fellowship, licence or SCFHS badge, the Taibah e-mail.

## 4. Photographs

| File | Use | Caveat |
|---|---|---|
| `dr-maan-portrait.png` (295×225) | Homepage hero | Authentic studio portrait, but low resolution; it is shown at its natural aspect on a matching studio-grey plate with an edge fade. A higher-resolution original is needed for retina screens. |
| `dr-maan-redsea.jpg` (682×1024) | `/about/` portrait | Owner-supplied; the Saudi Ophthalmology 2024 and SOS logos are visible and one attendee is visible, blurred, in the background (cropped by `object-position`). **The owner should confirm they are content to publish it.** |
| `dr-maan-faculty.jpg` | Not used | Six identifiable colleagues on stage; no documented consent. Skipped. |
| `doctor-portrait.jpg` | Open Graph / JSON-LD only | Unchanged. |

## 5. "Why it matters" lines

Plain-language explanations in `src/site/content.js` (`WHY_IT_MATTERS`). They describe what a credential or role
generally means; they do not add facts about Dr. Maan. Examples: FRCS — "a professional fellowship awarded by the
Royal College of Surgeons after its examinations"; Chief of Staff — "oversees the branch's medical,
administrative and operational affairs" (the doctor-confirmed role description). **Dr. Maan should approve this
wording**, as with the biography.

## 6. Open questions for the owner / Dr. Maan

1. Approve the biography paragraph and the why-it-matters wording (AR and EN).
2. Confirm or drop the two Magrabi-published roles (registry pending entries).
3. Confirm publication of `dr-maan-redsea.jpg` (event branding, background attendee).
4. Supply a high-resolution portrait (≥ 1200 px wide) for the homepage hero.
5. Supply dates for any role that should appear on the dated record.
6. Confirm CBAHI vs CHI accreditation wording (matrix D4).
