# Doctor Content Recovery — 2026-11-01

## Why this was done
Phase 0 (commit `0a9d4f2`) removed several facts because no public web page confirmed them. The site owner pointed out that direct confirmation from Dr. Maan is a legitimate primary source. On 2026-11-01 the owner answered specific questions on Dr. Maan's behalf, and this document records those answers and what changed as a result.

## Source-of-truth policy (now in force)
Each fact in `doctor-data.js` has a `source`, and these categories are kept separate:

| Category | Meaning |
|---|---|
| `doctor` | Personally confirmed by Dr. Maan and relayed by the site owner (2026-11-01). |
| `magrabi` / `taibah` | Published officially by the institution. |
| `owner` | Supplied by the site owner and not confirmed separately. It stays published unless contradicted. |
| `pending` / `no-permission` | Not rendered. |

A fact the owner supplied is **not** automatically treated as physician approval, and it is **not** automatically deleted either. The full registry is in `content/internal-registry.json`. Each fact has an id, AR/EN wording, source, evidence, status, display flag and change history. The app never imports that file, so records marked internal-only never ship. `tests/content-registry.spec.js` checks that this holds.

## Decisions (owner answers, 2026-11-01)
| Fact | Original wording and provenance | Decision | Public wording now |
|---|---|---|---|
| +15,000 | Added in `9da524c` (owner). Arabic said "فحص وإجراء جراحي دقيق"; English said "Specialized Ophthalmic Procedures", so the two meanings differed. | **Restored.** The meaning is confirmed as a combined career total of eye examinations **and** surgical procedures. It is not a count of surgeries alone, and not a count of patients. The promotional word "دقيق" was dropped. | AR "+15,000 فحص وإجراء جراحي في طب العيون" / EN "15,000+ eye examinations & surgical procedures" |
| 100% | `9da524c`: "100% التزام طبي وفق بروتوكولات الفحص الدقيق / Adherence to Diagnostic Protocols" | **Internal only.** There is no measure, period or audit behind it, and it reads as an outcome guarantee. | Not published. Kept in the registry, and a test ensures it never appears in `dist/`. |
| Chief of Staff and supervision scope | Owner wording since `2fbf261`. The earlier English "Chief Medical Officer" was replaced by the owner. | **Confirmed by Dr. Maan.** Source upgraded from owner to doctor. | "كبير موظفي مركز مغربي المدينة المنورة (المشرف العام على الشؤون الطبية والإدارية والتشغيلية بالفرع)" / "Chief of Staff – Magrabi Health Madinah (General Supervisor of Medical, Administrative & Operational Affairs)" |
| Saudi Board | `9da524c` "Royal College Fellowship & Saudi Board", removed in Phase 0. | **Restored (confirmed).** | "البورد السعودي في طب وجراحة العيون" / "Saudi Board in Ophthalmology" |
| Associate Professor | Taibah faculty profile. | **Confirmed.** | "أستاذ مشارك – جامعة طيبة" / "Associate Professor – Taibah University" |
| 0554946433 | Added in `9da524c` with no source, and it replaced Magrabi's WhatsApp line 966508533309. Removed in Phase 0. | **Approved for public use for calls and WhatsApp.** The Magrabi WhatsApp line is retired from the site. | Direct line `055 494 6433` (tel `+966554946433`), plus WhatsApp `wa.me/966554946433` |
| Clinic hours | `2fbf261`: "Saturday to Thursday: 9:00 AM – 1:00 PM \| 5:00 PM – 9:30 PM" | **Restored (confirmed).** Also published as `openingHoursSpecification` in the JSON-LD. | AR "السبت إلى الخميس: ٩:٠٠ ص – ١:٠٠ م · ٥:٠٠ م – ٩:٣٠ م" / EN "Saturday to Thursday: 9:00 AM – 1:00 PM · 5:00 PM – 9:30 PM" |

## Retained without change (already published, source `owner` or official)
- Experience since 1998.
- FRCS (UK).
- First President of the Saudi Association of Cornea, Cataract & Refractive Surgeons.
- Former Chair of Ophthalmology at Taibah University (10 years).
- Former Saudi Ophthalmological Society representative in Madinah.
- Co-founder of the Red Sea International Ophthalmology Conference.
- Memberships: the Saudi Ophthalmological Society and the AAO.
- Magrabi call center numbers 920018000 and 19505, the booking portal, and the map link.

## Still not published (deliberately)
- **"100%" statistic:** it has no definition (see the decisions table).
- **Testimonials:** reuse permission is undocumented, and the earlier site text was reworded rather than verbatim. Publishing needs the verbatim text, attribution and written permission. The publication gate in `isPublishableTestimonial()` is unchanged.
- **Licence / SCFHS classification statement:** the Saudi Board is published as a qualification, but no licence number or classification was supplied, so there is no "licensed by SCFHS" badge.
- **Doctor lens preference:** the EDOF content stays neutral, because a personal preference must not read as a universal recommendation.

## Where the data flows
`doctor-data.js` feeds every place the facts appear:
- the rendered page (`main.js`), including the hero statistic, credentials, the clinic contact section and the booking bar's WhatsApp link
- the JSON-LD (`buildJsonLd`): Saudi Board credential, opening hours, appointments contact point
- `/llms.txt` (`buildLlmsTxt`)
- the FAQ booking answer

## Tests changed
These tests were changed because the policy changed, not to make them pass more easily:
- `tests/phase0-content.spec.js` now **requires**:
  - the direct line in the tel links and the JSON-LD
  - the hours in the clinic section
  - the 15,000+ wording in llms.txt
  - Saudi Board in the JSON-LD

  It still forbids:
  - the 100% wording
  - a licence badge
  - "preferred/favoured" lens claims
  - the retired Magrabi WhatsApp number
  - fabricated reviewer names
- `tests/content-registry.spec.js` is new. Every public registry fact must be present in the data **and** visible on the page in AR and in EN. Doctor-sourced facts must be `confirmed`. The 15,000+ label must keep its combined meaning. Internal-only facts must be absent from `dist/`.

## Open external items
- **Written record:** the owner should keep a written or messaged confirmation from Dr. Maan for each `doctor` fact above. This document records the owner's statement of those confirmations, not the original message.
- **Testimonials:** permission is needed (see above).
