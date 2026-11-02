# Information architecture

## Benchmark (structure only)

dramralamin.com was reviewed with WebFetch on 2026-11-01. Only its information architecture was used:
- doctor first,
- services as image cards near the top,
- services grouped into two menus,
- a dedicated page per procedure,
- persistent contact actions.

Nothing else was taken from it. We did not reproduce:
- its statistics counters, which include "successful procedures" (an outcome claim we exclude),
- its testimonials (none are publishable here: `isPublishableTestimonial`),
- its partner logos,
- its long homepage biography.

## Homepage: a patient journey

The homepage is shorter even though it now carries a 7-card gallery. Heights were measured from the full-page captures in `evidence/`:

| Viewport | Arabic, before → after | English, before → after |
|---|---|---|
| 1440 | 13,545 → 10,393 px | 13,906 → 10,654 px |
| 390 | 18,073 → 14,725 px | 18,745 → 15,107 px |

| # | Section (`id`) | Job | Detail moved to |
|---|---|---|---|
| 1 | Header + drawer | Wayfinding: 6 section links, language, theme, Book. The drawer lists all 7 procedures. | — |
| 2 | Doctor introduction (`#home`) | Name (H1), title, booking and call CTAs, WhatsApp note, authentic portrait card (role, academic rank, clinic), 3 facts | — |
| 3 | **Procedures gallery** (`#procedures`) | 7 cards in 3 groups, a filter, a featured cataract card, a "Not sure? Book an examination" tile | `/procedures/<slug>/` |
| 4 | Qualifications & experience (`#profile`, `#qualifications`) | One ledger sheet plus the full appointments timeline (every registry fact) | — |
| 5 | Vision Simulator (`#simulator`) | Section shell, host `[data-vision-host]`, 3 disclaimers, link to the lens-implants page | `/procedures/lens-implants/` |
| 6 | 3D cataract surgery (`#cataract-3d`) | Poster first; the module is lazy-loaded on click | `/procedures/cataract-surgery/` |
| 7 | Patient education (`#education`, `#questionnaire`) | 4 short answers linking to procedure pages, urgent-care signs, 4 core assessments, the 4-question questionnaire | procedure pages |
| 8 | FAQ (`#faq`) | 6 questions, mirrored in FAQPage JSON-LD | — |
| 9 | Clinic (`#clinic`) | Three ways to book, hours, address, map, accreditation | — |
| 10 | Booking CTA and footer | Lagoon band (book, WhatsApp, map). Footer: procedures, contents, contact, disclaimer. Mobile booking bar. | — |

**Removed from the homepage and why:**
- **Long "Expertise" block:** its technology list became "core assessments", its pathway moved into procedure "What happens" sections, and its three area descriptions became the gallery.
- **The large IOL comparison sheet:** became the lens-implants page "Types".
- **Biography paragraphs and the conference block:** cut to one line in the section lede. The roles are all kept in the timeline.
- **Four long library articles:** now short answers that link to the full guides.
- **The "Clinical review: Dr. Maan" byline under each article:** removed. No recorded review exists for that text (see `RELEASE_READINESS` §blockers), and keeping it would claim an approval that has not happened.

No doctor fact was removed. `content-registry.spec.js` still requires every public fact on the page in AR and EN.

## Procedure library: 7 procedures, 14 pages

| Group | Slug | Source |
|---|---|---|
| Cataract & lens surgery | `cataract-surgery` (featured; hosts the 3D simulator) | magrabi |
| Cataract & lens surgery | `lens-implants` | magrabi |
| Vision correction | `laser-vision-correction` | magrabi |
| Vision correction | `icl` | owner (confirmed 2026-11-01) |
| Cornea & retina care | `keratoconus-cxl` | magrabi |
| Cornea & retina care | `corneal-transplant` | owner (confirmed 2026-11-01) |
| Cornea & retina care | `intravitreal-injections` | owner (confirmed 2026-11-01) |

**Page template:** breadcrumb (Home / Procedures / Name) → H1, lede, **draft review status**, Book + WhatsApp → illustration → table of contents → anatomy → purpose → types (where relevant) → candidates → steps → benefits and limitations → risks → recovery → FAQ → sources and review status → [3D, cataract only] → related procedures → booking band.

## URL scheme and routing

The scheme is shared by the app, the build and the prerenderer (`site-routes.js`).

| Path (relative to the site root) | Page |
|---|---|
| `` | AR home |
| `en/` | EN home |
| `procedures/<slug>/` | AR procedure |
| `en/procedures/<slug>/` | EN procedure |

**How routing works:**
- **Site root.** An inline head script pins `<base>` to the absolute site root before anything loads. Prerendered pages ship a relative `<base>` (`./`, `../`, `../../` or `../../../`) for no-JS readers. The same build therefore works at `https://domain/` and at `https://…github.io/dr-maan-albarry-website/`.
- **Route parsing.** The route is the path after the root. Its parser is shared with the build.
- **Navigation.** Internal links carry `data-nav`. One delegated handler:
  - pushes history,
  - re-renders,
  - moves focus to the H1,
  - scrolls to the hash or to the top.
- **Back/forward.** These restore the saved scroll position.
- **Language.** The toggle opens the counterpart URL. Choosing a language saves it, and a saved English choice moves the bare root to `/en/`.
- **Section links.** Hrefs are `#id` (AR) or `en/#id` (EN), so they work from any page.

**SEO per page:**
- `lang` and `dir`,
- `<base>`,
- title,
- description,
- canonical,
- hreflang `ar` / `en` / `x-default`,
- `og:url`, `og:title`, `og:description`, `og:locale`,
- JSON-LD:
  - Homepage: Physician plus FAQPage.
  - Procedure pages: MedicalWebPage + SurgicalProcedure or TherapeuticProcedure + FAQPage. There are no ratings, no reviews and no `reviewedBy`.

The sitemap lists all 16 URLs with their hreflang pairs.
