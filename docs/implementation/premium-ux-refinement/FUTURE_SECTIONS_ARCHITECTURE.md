# Preparing the site for future sections

This describes what exists to add new sections later, and how to use it. No new public section, page or text was
added: the sitemap and the pages are the same 30 URLs as before (`TECHNICAL_FIXES.md` has the before/after comparison).

## The pieces

| File | What it holds |
|---|---|
| `section-registry.js` | The list of sections (`SECTIONS`), the interactive modules (`FEATURES`), the selectors that read the list, and `validateSections()`. |
| `site-routes.js` | `createRouting(sections)`: everything derived from that list. Its exports (`SECTION_PAGES`, `PAGES`, `pathFor`, `pageMeta`, `breadcrumbFor`, `parseRoute`, `splitPath`, `ROUTE_PATTERN`) keep their old names and shapes. |
| `src/site/section-patterns.js` | Reusable render helpers for the markup the pages share. |
| `main.js` | `PAGE_CONTENT` (renderer of each section), and the menus, read from the registry. |

## One entry in the registry

| Field | Meaning |
|---|---|
| `id` | Stable key. Also `main[data-page]` and the menu's `data-section`. |
| `type` | `home`, `profile`, `collection`, `tool`, `education` or `contact`. |
| `title` | `{ ar, en }`, the page's name: breadcrumb and footer label. |
| `content` | Name of the renderer in `PAGE_CONTENT` (`main.js`). |
| `route` | URL part below the site root, for example `lens-lab`. May differ from `id`. |
| `visibility` | `published` or `unpublished`. |
| `order` | Display order: sitemap, footer, `llms.txt`. |
| `nav` | `{ label: { ar, en }, header: n, drawer: n, footer: true }`. `header` and `drawer` are the position in that menu. Leave one out to keep the section out of that menu. |
| `features` | The interactive modules this section may start (keys of `FEATURES`). Remove a key to switch that module off on that page: it is not downloaded and the written summary shows instead. |
| `seo` | `title`, `description` (`{ ar, en }`), `schema` (JSON-LD page type), `ogType`, `llms` (its line in `/llms.txt`). |

## What the registry drives

- Routes: `parseRoute`, `splitPath`, `ROUTE_PATTERN`.
- The inline `<base>` script in `index.html`. The source holds the placeholder `__ROUTE_PATTERN__`; `vite.config.js` writes `ROUTE_PATTERN` into it at build time (and in the dev server), so it cannot drift. `tests/phase1-pages.spec.js` checks it in all 30 built pages.
- Breadcrumbs (visible and JSON-LD), page titles, descriptions, Open Graph type, JSON-LD page type.
- `sitemap.xml`, the prerender list (`PAGES`), the `/llms.txt` page list.
- Header, mobile menu and footer. Numbers in the menus are computed, and nothing assumes a count of links.
- Which elements are module hosts (`FEATURE_HOST_SELECTOR`), used by the prerenderer and by the first-load adoption.

Procedure pages are not registry entries: they are generated from `PROCEDURES` in `doctor-data.js`, under the `procedures` section.

`vite.config.js` runs `validateSections()`, so a duplicate id or route, a reserved route (`en`, `assets`, `fonts`, `images`, `procedures/...`), an unknown feature or a published entry without bilingual SEO text stops the build. A published section whose `content` has no renderer throws while rendering, which fails the prerender.

## Unpublished sections

An entry with `visibility: 'unpublished'`:

- is left out by `publishedSections()`, the one function every public list goes through, so it is absent from the menus, footer, sitemap, prerender list, `llms.txt` and `ROUTE_PATTERN`;
- behaves like any unknown URL;
- cannot produce a dead link: `pathFor` resolves a key that is not published to the home page;
- contributes no module, and so downloads nothing.

Limit: the entry's own text (title, labels) is part of the JavaScript bundle, because the registry is. Do not put confidential wording in an unpublished entry. Its page content should stay out of the entry.

`tests/section-registry.spec.js` proves this with a temporary entry that exists only in the test: through the pure functions, and in a real client build where a test-only Vite plugin injects the entry. A control test shows the same entry, when published, does reach every list.

## Patterns

Each helper returns the markup that page already used. Styling stays in `style.css`.

| Helper | Pattern | Used by |
|---|---|---|
| `editorialIntro` | Editorial introduction | The seven section pages, through `pageHero` |
| `imageTextSplit` | Image and text split | Fields of expertise on `/about/` |
| `procedureGallery` | Procedure gallery | Home atlas, `/procedures/`, related procedures |
| `educationalGuide` | Educational content | Guides on `/education/` |
| `faqList` | FAQ | Home and every procedure page |
| `appointmentsTimeline` | Doctor profile information | Home credentials and `/about/` |
| `toolPreview` | Interactive tool preview | The two tool cards on the home page |
| `contactCta` | Contact call to action | Closing band of section pages and procedure pages |

## How to

### Add a section

1. Add an entry to `SECTIONS` in `section-registry.js`, with `visibility: 'unpublished'` while it is being built.
2. Write a renderer in `main.js`, from the patterns above, and add it to `PAGE_CONTENT` under the entry's `content` name. End it with `renderClosing('<id>')`. The prerenderer expects one `h1` inside `main`, which `pageHero` provides.
3. When the content is approved, set `visibility: 'published'`. Nothing else changes: routes, breadcrumbs, sitemap, prerender and menus follow.
4. Update the page total in `tests/seo.spec.js` and `tests/section-registry.spec.js` (each published section adds two pages). These two numbers are deliberate: they make an added page a visible decision.

### Add a route that differs from the section's id

Set `route`, for example `id: 'guides', route: 'patient-guides'`. Links go through `pathFor` and `P('guides')`, never a written path.

### Add bilingual content

Keep every string as `{ ar, en }` and read it with `L(pair)`, or use `tr(ar, en)` in a renderer. Long text belongs in `src/site/content.js`. Medical text must be marked as pending physician review, as the existing pages are. Arabic is the default at the site root and English is under `/en/`.

### Add a procedure

1. Add it to `PROCEDURES` in `doctor-data.js` (`slug`, `group`, `source`, `status`, `kind`, `name`, `summary`, `alt`, `related`).
2. Add `CONTENT[slug]` (both languages) and `SOURCES[slug]` in `src/procedures/content.js`.
3. Pages, sitemap, menus and JSON-LD follow. The wording "seven procedures" in the page copy is written text and needs updating by hand.

### Add illustrations

Files in `public/images/procedures/` are used only if they exist at build time. Without one, the page shows its built-in line drawing. The atlas (`manifest.json` and `atlas/`) is generated by `scripts/illustrations/`. Every clinical image keeps the "pending physician review" note, and labels come only from the manifest's anchors.

### Add a navigation item

Set `nav.header` and/or `nav.drawer` in the entry to the position wanted, and `nav.footer: true` for the footer. Fractional positions are fine. The desktop header was designed for six links: after adding a seventh, check the "No horizontal overflow" test at 1024 and 1366 px and adjust the header spacing if needed.

### Link to a section that may be unpublished

Use `P('id')`. While the section is unpublished it resolves to the home page, so check with `sectionPage('id')` and leave the link out until it is published.

### Add an interactive module

Add it to `FEATURES` (with `hostAttr` if it mounts into a slot), list its key under the section's `features`, add its path in `src/feature-loaders.js`, and render it with `featureBlock`. It loads only when its slot nears the viewport.

### Add automated tests

- A published section is covered automatically by the loops in `tests/phase1-pages.spec.js` (real content, metadata, breadcrumbs, no overflow), `tests/journeys/axe.spec.js` and `tests/journeys/security.spec.js`.
- Add a spec for what is specific to the new section. Wait on real state with `expect` or `waitForFunction`, not on elapsed time.
- Keep test-only entries inside the spec, as `tests/section-registry.spec.js` does.
