# Procedure library

## Scope and provenance
The scope is recorded in `doctor-data.js` as `PROCEDURES` and `PROCEDURE_GROUPS`. That file is the single source of truth for:
- the procedure names and summaries in AR and EN,
- the group each procedure belongs to,
- the alt text for each illustration,
- related procedures,
- the schema type,
- the source and status of each procedure.

The governance copy, including history, is in `content/internal-registry.json` (facts `procedure-<slug>`). `tests/content-registry.spec.js` checks that the two agree, and that every procedure name is visible on the homepage in both languages.

| Slug | AR | EN | Source | Status |
|---|---|---|---|---|
| `cataract-surgery` | جراحة الماء الأبيض (الساد) | Cataract surgery | magrabi | published |
| `lens-implants` | العدسات المزروعة داخل العين | Lens implants (IOLs) | magrabi | published |
| `laser-vision-correction` | تصحيح الإبصار بالليزر | Laser vision correction | magrabi | published |
| `icl` | زراعة العدسة اللاصقة الداخلية (ICL) | Implantable contact lens (ICL) | owner | confirmed 2026-11-01 |
| `keratoconus-cxl` | القرنية المخروطية وتثبيت القرنية (CXL) | Keratoconus & corneal cross-linking (CXL) | magrabi | published |
| `corneal-transplant` | زراعة القرنية | Corneal transplant (keratoplasty) | owner | confirmed 2026-11-01 |
| `intravitreal-injections` | حقن العين (داخل الجسم الزجاجي) | Intravitreal injections | owner | confirmed 2026-11-01 |

**What each source means:**
- **magrabi:** the procedure is listed among Dr. Maan's services on the official Magrabi Health profile.
- **owner:** the site owner confirmed on 2026-11-01 that Dr. Maan personally performs the procedure. The owner should keep the written confirmation, as with the other `doctor` and `owner` facts.

## Pages

There are 14 pages, from 7 procedures in 2 languages:
- `/procedures/<slug>/` (Arabic)
- `/en/procedures/<slug>/` (English)

**How the pages are built:**
- The long text is in `src/procedures/content.js`. It is lazy-loaded, about 18 kB gzipped, and the homepage never downloads it.
- Every page is prerendered, so it reads fully without JavaScript.

### Sections on every page
| Brief requirement | Where it appears |
|---|---|
| Introduction | Hero lede (`intro`) |
| Relevant anatomy | `#p-anatomy`: text plus key structures |
| Illustration | Hero figure: the 3D render when present, otherwise the schematic plate |
| Purpose | `#p-purpose` |
| General candidate considerations | `#p-candidates`, which ends with "General considerations only…" |
| Patient-friendly explanation | `#p-steps`: numbered "What happens" |
| Benefits and limitations | `#p-benefits`: two panes |
| Risks and possible complications | `#p-risks`, plus an urgent-contact note |
| Recovery | `#p-recovery` |
| FAQ | `#p-faq`: an accordion, mirrored in FAQPage JSON-LD |
| Related procedures | 3 cards (`related` in doctor-data) |
| Booking CTA | In the hero (Book, WhatsApp) and in the closing band (Book, call, Maps) |
| Visible review status | Hero badge and the sources panel: "draft pending review by Dr. Maan" |

**Additions:**
- A `#p-types` section on four pages: lens-implants (IOL types), laser-vision-correction (LASIK, PRK, SMILE), corneal-transplant (PK, DALK, DSAEK/DMEK) and intravitreal-injections (wet AMD, DMO, RVO).
- On the cataract page only, the 3D simulator section (`#cataract-3d`). It uses the same lazy `import('./src/cataract-sim/index.js')` and `mount()` pattern as the homepage. No other page has an animation.

### Medical sources
See `CLINICAL_SOURCES.md`.

## Illustrations
The pages expect these files, which are rendered by the 3D-illustration workstream:
- `public/images/procedures/<slug>.webp` (1600×1000, light background)
- `public/images/procedures/<slug>-dark.webp`

**How the files are referenced:**
- `vite.config.js` checks at build time which of these files exist and passes the result to the app as `__PROC_IMAGES__`.
- Pages reference only the files that exist, so a missing render causes no 404.
- When the renders are merged, no code change is needed. A rebuild picks them up.
- If a render fails to load at runtime, `onerror` falls back to the plate.

**Until the renders land:** every card and hero shows the schematic anatomy plate described in `DESIGN_SYSTEM.md` §8. The plate highlights a different structure for each procedure.

## Adding or changing a procedure
1. Add an entry to `PROCEDURES` in `doctor-data.js`, with its slug, group, source, status, names, summary, alt text and related slugs.
2. Add the matching `procedure-<slug>` fact to `content/internal-registry.json`, with evidence and history.
3. Add `CONTENT[slug].ar` and `CONTENT[slug].en`, plus `SOURCES[slug]`, to `src/procedures/content.js`.
4. Add a highlight to `EYE_FOCUS` in `main.js`.

The routes, the sitemap, the prerender, hreflang and the JSON-LD all follow automatically.
