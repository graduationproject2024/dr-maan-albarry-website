# Future architecture

What exists, and how to grow it without new machinery. Step-by-step recipes for sections stay in `premium-ux-refinement/FUTURE_SECTIONS_ARCHITECTURE.md`; this file adds what changed in this milestone and the rules for future modules.

## Map

```
section-registry.js      SECTIONS (id, type, route, visibility, nav, features, seo), FEATURES, selectors, validateSections
  └─ site-routes.js      parseRoute / pathFor / pageMeta / breadcrumbs  (unknown → known:false → not-found page)
  └─ vite.config.js      sitemap, llms.txt, PAGE_URLS (published only)
  └─ scripts/prerender.mjs  one HTML per published page (+ inlined CSS, portrait preload) and 404.html
  └─ main.js             renderApp → PAGE_CONTENT[section.content]; header/drawer/footer from the registry
doctor-data.js           DOCTOR, PROCEDURES, PORTRAIT, JSON-LD builders (single source of facts)
src/site/section-patterns.js   reusable page blocks
src/feature-loaders.js   lazy modules with a reserved slot, failure message, static fallback
src/<module>/            vision-sim, lens-lab, light-journey, cataract-sim (each: mount → controller.destroy)
scripts/release-check.mjs  release states; refuses approvals without evidence
.github/workflows/       verify (gate) → deploy; ci (branches); full-regression (weekly / manual)
```

## Added in this milestone

| Piece | Why |
|---|---|
| Not-found page (`renderNotFound`, `route.known === false`) and `dist/404.html` | Unknown and unpublished addresses never show a silent copy of the home page; noindex, no canonical |
| Inlined main stylesheet in prerendered pages | First paint no longer waits for a separate CSS request |
| `PORTRAIT` + `portraitSrcset` in `doctor-data.js`; `scripts/build-portrait.py` | One place to replace the hero photograph |
| `c3dWarm` in `main.js` | The 3D viewer's code is fetched on intent or proximity (never on the home page, never with data saver) |
| Vision simulator framing (`applyFraming`, `frame` in the pipeline) | Presentation-only zoom; optics untouched |
| `scripts/release-check.mjs`, `scripts/ci-summary.mjs`, `scripts/clinical-queue.mjs` | Release states, test reports, generated review queue |

## Rules for future additions

1. Facts about the doctor or clinic only from `doctor-data.js`; never in a template.
2. A new page is a registry entry, `unpublished` until its content is approved.
3. A new interactive module follows the `mount`/`destroy` contract and the standard in `PHASE_3_READINESS.md`.
4. Anything clinical carries a review status and, for models, a version constant.
5. No framework migration: nothing in the known backlog needs one. A server-side feature (booking, chat) would be a separate service with its own hosting, called from the static site.
