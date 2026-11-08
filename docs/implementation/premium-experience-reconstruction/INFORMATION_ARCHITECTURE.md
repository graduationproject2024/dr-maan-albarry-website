# Information architecture

Thirty prerendered pages: for each of Arabic and English, one home, seven section pages and seven procedure pages. URLs, canonical tags, hreflang, JSON-LD and the sitemap are unchanged.

## Homepage chapters

| # | Chapter | Anchor | Route onward |
|---|---|---|---|
| 01 | The doctor: name, specialty, intro, one booking CTA, one secondary link, portrait with L1 plate, ledger (1998, 15,000+ with scope, FRCS and Saudi Board) | `#home` | Booking portal, `/about/` |
| 02 | Patient pathways: treatments, vision and lenses, the doctor, booking. Navigational, not diagnostic | `#pathways` | `/procedures/`, `/lens-lab/`, `/about/`, `/clinic/` |
| 03 | All seven procedures as plates PL.01–07 | `#procedures` | Each procedure page, `/procedures/` |
| 04 | Credentials summary: qualifications, rank, memberships, all five roles | `#profile` | `/about/` |
| 05 | Vision education: Lens Lab and Light Journey previews (night chapter) | `#discover` | `/lens-lab/`, `/how-vision-works/` |
| 06 | Cataract 3D: poster image, four stages (night chapter; no 3D engine loads) | `#surgery-3d` | `/surgical-education/`, cataract guide |
| 07 | Three patient guides and the emergency link | `#education` | `/education/` and its anchors |
| 08 | General questions (FAQPage JSON-LD mirrors these four exactly) | `#faq` | Procedure pages hold their own questions |
| 09 | Clinic and booking: three verified methods, hours with caveat, address, accreditation | `#clinic` | Booking portal, phone, WhatsApp, Maps, `/clinic/` |
| 10 | Footer: identity, site, procedures, contact and hours, disclaimers | | |

Numbering in the header (01–06) counts pages and is separate from the chapter numbers.

## Where content moved

| Content | From | To |
|---|---|---|
| "Can I stop wearing glasses after cataract surgery?" | Home FAQ | Cataract surgery page FAQ and its JSON-LD |
| "What are the criteria for LASIK?" | Home FAQ | Laser vision correction page FAQ and its JSON-LD |
| Symptom-led "start from what you need" links | Home hero | Replaced by the four navigational pathways |
| Clinic phone and WhatsApp in the hero | Home hero | Booking bar and chapter 09 (two-CTA rule) |
| Source tags on credentials | Home | Remain on `/about/` |

No confirmed doctor information was removed. Pending and unpermitted items remain excluded, as recorded in `HOMEPAGE_CONTENT_MATRIX.md`.

## Page compositions

| Page | Composition |
|---|---|
| `/about/` | Portrait beside name and ledger; profile; three areas with plates; qualifications ledger with "why it matters" beside a numbered appointments list; dated record and teaching |
| `/procedures/` | Atlas index: filter chips that wrap, a large PL.01 with pins and key, then six plates, then an examination prompt |
| Procedure pages | Title across, lede beside the actions; large L2 plate with pins and key; L3 close-ups in the anatomy section; sticky contents with scrollspy (collapsible on phones); procedure-specific questions; sources; related plates |
| `/lens-lab/` | Jump links, comparison module, vision simulator in a night chapter |
| `/how-vision-works/` | Labelled light-path drawing in the hero, then the four-station journey |
| `/surgical-education/` | Night chapter with poster and start button, then the four written stages |
| `/education/` | Sticky contents with scrollspy, four guides, questionnaire band, warning signs beside the question index |
| `/clinic/` | Booking methods beside hours, address and map; visit pathway in four columns; assessments; what to bring |
