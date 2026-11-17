# Next Phase 3 — readiness (PROVISIONAL)

**Provisional.** The owner has not defined the next Phase 3. This file uses the brief's suggested focus, "scalable medical education and new site capabilities", as a planning frame. No public content was added and none should be until its scope and text are approved.

## Expansion architecture (exists today)

| Need | Already supported by | Gap |
|---|---|---|
| New bilingual section | One entry in `section-registry.js` (`SECTIONS`) drives route, breadcrumbs, sitemap, prerender, metadata, JSON-LD type, header/drawer/footer menus, llms.txt | A page renderer in `main.js PAGE_CONTENT` |
| Unpublished work in progress | `visibility: 'unpublished'` keeps it out of every public list; its URL behaves like any unknown URL (now: the not-found page) | None (tested in `section-registry.spec.js`) |
| New procedure page | `PROCEDURES` in `doctor-data.js` + `src/procedures/content.js` + atlas images | Content and images need review |
| New FAQ | `faqList` pattern; procedure FAQs feed FAQPage JSON-LD | None |
| New educational module / interactive tool | `FEATURES` in the registry + `src/feature-loaders.js createFeatureMount` (lazy, reserved slot, failure message, static fallback) | The module itself |
| New anatomical images | Manifest + `atlasIllus` + pins/keys + review fields | Rendering pipeline is project code; each image needs review |
| Structured data | `buildSectionJsonLd` by `schema` type | New schema types need adding to `SCHEMA_TYPES` |
| Feature flags | `features` per section; `enabled` callback in `createFeatureMount` | None |

Details: `premium-ux-refinement/FUTURE_SECTIONS_ARCHITECTURE.md` (how to add a section) and `FUTURE_ARCHITECTURE.md` here.

## Reusable page patterns (in `src/site/section-patterns.js`)

`editorialIntro` (page intro, also the new not-found page), `imageTextSplit`, `procedureGallery`, `educationalGuide`, `faqList`, `appointmentsTimeline`, `toolPreview`, `contactCta`. Booking links come from one place (`C.bookingUrl`). Doctor credentials come from `doctor-data.js` only.

A general CMS is not recommended: the content volume is small, every medical sentence needs physician review, and the registry already gives one place per kind of content.

## Standard for any future 3D or interactive experience

| Topic | Requirement |
|---|---|
| Loading | Dynamic import from `src/feature-loaders.js` or a start button; never on the home page by itself; code may be fetched on intent (see the cataract early download) |
| Lifecycle | `mount(host, opts)` returns a controller with `destroy()`; idempotent per host; all listeners, observers, timers and GL resources released; context loss handled |
| Assets | Procedural or licensed with a recorded commercial web licence; sources in the repo |
| Review status | A model version constant; a review mode; changed content marked for re-approval |
| Accessibility | Keyboard, 44 px targets, reduced motion, a non-3D alternative with the same reviewed text |
| Localisation | Arabic first, English mirror, RTL tested |
| Input | No scroll trap; one-finger swipe scrolls the page unless an explore mode is on |
| Source traceability | Each clinical statement links to a reference key |
| Performance budget | Throttled phone profile: tap-to-ready ≤ 3 s; no long task over 1 s after ready; one WebGL context per viewer |
| Release | CI gate green, `release:check` clean, owner deploy instruction |

## Proposed capabilities (only as candidates for the owner)

From the board: booking system (#8), chat assistant (#9), automation (#7), real data (#5), domain and hosting (#3), new photographs (#4), animations for other procedures (#10). Each needs an owner decision and, for clinical content, physician review. See `PHASE_2_3_BACKLOG.md`.

## Content workflow (for doctor-supplied information)

1. Intake: the doctor's text or document, kept unchanged in `docs/content-intake/<date>-<topic>/`.
2. Source classification: doctor-confirmed fact / published clinic fact / general medical education / illustration.
3. Arabic draft (first) and 4. English draft, in the content file with `REVIEW.status: 'draft'`.
5. Medical review by Dr. Maan: name and date recorded in the file (`release:check` enforces both).
6. Publication status: section `visibility` stays `unpublished` until 5 is done.
7. Design integration with the existing patterns only.
8. Regression tests: content registry, registry validation, routes, SEO, axe.
9. Approved release: owner instruction, then merge to `main` (CI gate runs before publishing).

## Readiness verdict: CONDITIONAL

The site can take new sections and modules without new architecture. Starting needs the owner's scope, the domain/hosting decision for anything server-side (booking, chat), and approved content.
