# 21st.dev component research: inspiration for the premium experience

**Date:** 2026-11-07
**Scope:** UI patterns on https://21st.dev/community/components that could help the bilingual (Arabic RTL first, English second) ophthalmology site for Dr. Maan Albarry.
**Stack this has to fit:** vanilla JS, Vite 8, plain CSS with logical properties and the existing tokens in `style.css` (ivory and lagoon palette, Noto Naskh / Source Serif display type). Three.js is loaded lazily. No React, no Tailwind, no animation library.
**Status:** research only. No site code, packages or config were changed.

---

## 1. Method

1. **Browser.** Headless Chromium through Playwright, resolved from the repo's `node_modules` with `createRequire`. Scripts and screenshots stayed in the session scratchpad. No third-party screenshots were added to the repo.
2. **Listing and category crawl.** I loaded the components landing page, then 26 category pages under `/community/components/s/<category>`: hero, navigation-menu, card, gallery, grid (Grids & Bento), image, timeline, tabs, accordion, carousel, modal, data-visualization, progress, steps, button, footer, faq, features, testimonials, team, video, map, globe, comparison, scroll-area and stat. After scrolling, each category page gave up to 200 component links. Timeline gave 93, steps 104 and footer 84.
3. **Detail pages.** I opened 71 candidate component pages and recorded, from the rendered page text:
   - title, author and category
   - the "About" description, tags and published date
   - the "License" row, where the page shows one
   - the demo `Usage.tsx` imports
   - any "Dependencies" block, which only one page layout shows (see limitations)

   I also read the page's own embedded metadata (`"license": ...` in the JSON-LD and page data) to check the visible license rows. One URL (`@mynaui/components/accordion/card-based`) returned **404 "Component Not Found"** and is excluded.
4. **Live preview audit.** Each detail page embeds a public preview bundle from `cdn.21st.dev/.../bundle.*.html`. I loaded each of the 70 bundles and measured:
   - total transferred bytes
   - whether framer-motion/Motion, GSAP or Lenis signatures appear in the shipped code (a heuristic text match)
   - number of focusable elements and ARIA roles, plus `aria-expanded` and `aria-selected` counts
   - what receives focus after two Tab presses
   - horizontal overflow at 390 px width
   - a screenshot with `dir="rtl"` forced on `<html>`, which I reviewed visually for a subset

   This was a quick probe, not a full accessibility audit.
5. **Evaluation criteria.** Visual suitability, medical professionalism, RTL compatibility, mobile usability, accessibility, animation behaviour, performance or bundle impact, dependencies, license, and how hard it is to rebuild in vanilla JS and CSS.

## 2. What I could and could not see (limitations)

| Area | Seen | Not seen |
|---|---|---|
| Components landing (`/community/components`) | About 50 featured components, library counts (Components 12K, Templates 371, Themes 971, Apps 138) and category links | After the featured grid, the page says "Keep browsing with a free account". I did not log in or create an account. |
| Category pages | Up to 200 items per category, publicly visible | Anything past what lazy-loaded after 5 scrolls |
| Component detail pages | Title, author, description, tags, category, published date, license row when present, demo usage code, live preview iframe | **The component's own source.** Every page says the source "comes with a free account". I never saw implementation code, only the demo `Usage.tsx`. |
| Dependencies | Shown as a "Dependencies" block only on the alternate page layout used by some library and author pages. Examples: Progressive Carousel lists `motion`. Circular Testimonials page data lists `react-icons` and `framer-motion`. | For most components no dependency list is visible. The dependencies I give come from the description, tags, demo imports and motion-library signatures in the preview bundle, and are labelled "inferred". |
| License | A visible "License" row (e.g. "MIT License", "mpl-2.0") on many pages | Where no row is shown, the embedded metadata says `"no-license"` or is empty. These are recorded as **"not stated on page"**. |
| Boilerplate | Every standard detail page says "Built with React and Tailwind" | This is platform wording, not a per-component audit. |
| Preview bundle sizes | Total bytes moved by the preview page | The preview bundles React, the Tailwind runtime and demo images. Even static components come out at about 255–300 KB. Use the numbers only to compare components, never as the cost of an equivalent vanilla build. |

No component names, authors or licenses in this document were invented. They are copied from the rendered pages or from those pages' own metadata, and the source of each is marked.

## 3. Policy: how we use this research

- **We adapt interaction and visual PATTERNS, not code.** We do not port React components, Tailwind classes, framer-motion, GSAP, Lenis, Radix, Vaul, Ark UI or Spline into the site. Each pattern is rebuilt in our own vanilla JS module and in `style.css` with our tokens.
- **No copying source, including MIT-licensed source.** We could not see source anyway (account wall). Where a license is stated it is noted for completeness only; we are taking the idea, not the code. Components marked "not stated on page" must never be copied in any form.
- **One design language.** The finished site must not look like unrelated components glued together. Every adopted pattern has to:
  - use the existing palette (`--bg`, `--surface`, `--primary`, `--accent`, `--gold`), type scale and Naskh/Source Serif display faces
  - use the existing radius and spacing tokens, hairlines (`--line`) and focus style
  - avoid each component's own look: glassmorphism, neon glows, purple gradients, oversized SaaS stat numbers, dark "tech" themes and glow-follow cursors are out.
- **Medical professionalism comes before spectacle.** No animated metrics or count-ups of clinical outcomes. No testimonial carousels unless verified and allowed. No before/after imagery of real patients. Simulations must be labelled as simulations.
- **RTL first.** Use logical properties only (`margin-inline`, `inset-inline-start`, `border-inline-start`), mirror direction icons with the existing `[dir="rtl"] .ic-arrow` approach, and reverse arrow-key meaning on horizontal widgets in RTL.
- **Motion budget.** CSS transitions, `IntersectionObserver` and, where supported, CSS scroll-driven animations (`animation-timeline: view()`) as progressive enhancement. Everything must collapse to a static, fully readable state under the existing `@media (prefers-reduced-motion: reduce)` block. No scroll-jacking or smooth-scroll libraries.
- **Accessibility parity.** Every adapted widget follows the WAI-ARIA pattern it imitates (disclosure, tabs, slider, dialog) and is tested with the existing Playwright and axe suite.

## 4. Per-category notes

**Heroes (1.2K).** Most are SaaS or marketing heroes. *Scroll media expansion hero* (MIT, 10.9K saves) and *Container Scroll Animation* (MIT) depend on scroll-jacking or 3D-rotate effects; the first preview was about 5.9 MB. *Zoom Parallax* pulls in `@studio-freight/lenis` (from its demo import) and overflowed by 39 px at 390 px. *Interactive Image Accordion* (license not stated) has a good image-led idea, but its preview had only 1 focusable element and two Tab presses reached nothing. Nothing here beats our current editorial hero. At most we could take the image-accordion idea for a procedure hub, rebuilt with buttons.

**Navigation (509).**
- *Table of Contents* (`@mohammadshehadeh/toc`, MIT): a scrollspy with a moving border marker that respects reduced motion. It maps directly onto our `.proc-toc` and `.edu-toc`.
- *Header 2* (`@efferd`, not stated): scroll-based header styling plus a mobile drawer, which we already have.
- *Scroll Direction: Hide Header* (`@motiondotdev`, MIT): optional, but it must never hide the booking action.
- *Morphing Island Navbar* (MIT): overflowed by 108 px at 390 px, and its glass style does not fit.
- *Bottom Nav Bar*: built for dashboards and finance apps. Rejected.

**Cards (1.3K).**
- *Spotlight Card* (not stated) overflowed by 212 px on mobile, and its pointer-glow effect is not clinical.
- *Display Cards* (MIT) overflowed by 124 px, and its stacked, skewed cards read as a gimmick.
- *Expanding Cards* (`@vaib215`, not stated) is the strongest card idea: one card expands on hover, focus or click, it goes vertical on mobile, and its preview had 7 focusable items. It suits a "conditions we treat" strip.

**Galleries and images (305 / Images).**
- *Thumbnail image viewer* (`@ibrandify`, MIT) has a real `tablist`/`tab`/`tabpanel` structure, `aria-selected`, a visible focus ring, a "01 / 04" counter and no mobile overflow. It is the best fit for clinic and equipment photos.
- *Shared Element Gallery* is about 9.6 MB in preview and uses framer-motion shared layout and drag-to-dismiss.
- *Layout Grid* (MIT) had 0 focusable elements.
- *Image Gallery with hover effect* also had 0 focusable elements.
- *Reveal Image Mask* (not stated) gives a nice editorial image reveal that we can do with CSS `clip-path` and view timelines.

**Grids and bento (Grids & Bento).**
- *Bento Grid* (`@manuarora700`, MIT): a good structure, but all 5 images in the preview lacked `alt`.
- *Feature Section with Bento Grid* (`@tommyjepsen`, MIT): a clean, quiet layout.
- *Stats Bento* (UI Layouts, MIT) and *About Bento* (license not stated): marketing styling ("450%", "IMPACT WITHOUT BOUNDARIES") that is wrong for a doctor.

Our takeaway: an image-led bento built from our own illustrations, with no stat tiles.

**Timelines (93).**
- *Scroll animated timeline* (`@ibrandify`, MIT): draws a progress line and reveals cards on scroll. Strong fit for the patient journey.
- *Timeline Rail* (not stated): has a `role=list` and buttons, but overflowed by 4 px on mobile.
- *Timeline* (`@preetsuthar17`, not stated): status variants and orientations.
- *Radial Orbital Timeline* (MIT): decorative and hard to read. Rejected.
- *How It Works* (`@chamaac`, not stated): pinned, connected cards. The idea is fine, but pinning is risky on mobile.

**Tabs (Tabs).**
- *Tabs* with roving focus (`@haassiib/tabs-roving-focus`, MIT): a textbook roving-tabindex tablist.
- *Feature Tab Switcher* (`@mohammadshehadeh/feature-11`, MIT): a vertical tab list beside a preview panel, where arrow keys move the panel. In the forced-RTL screenshot the heading text re-aligned, but the tab and panel columns did not swap and the active-tab bar stayed on the physical left. Our rebuild must use grid order that follows `dir` and `border-inline-start`.
- *Expandable Tabs* (MIT): collapses to icons only, which hides Arabic labels. Rejected.
- *Vertical tabs with icons* (`@anubra266`): uses `@ark-ui/react/tabs` (from its import).

**Accordions and FAQs (Accordions, FAQs).**
- *Editorial service list* (`@ibrandify`, MIT): numbered rows, `aria-expanded` on 3 buttons and `role=region` panels. In forced RTL, the "01" numeral collided with the title and the chevron was not mirrored. Good pattern, but RTL needs care.
- *Accordion with icons* (author shown as `@mui`, not stated): a correct disclosure pattern with a 3 px focus ring.
- *Feature 197 / accordion-feature-section* (`@shadcnblockscom`, not stated): an accordion that swaps an image beside it. Useful on procedure pages.
- *FAQ tabs* (not stated): categories in tabs above an accordion. Its preview had no `aria-expanded`.

Our existing `.faq-question` already uses `aria-expanded` and `aria-controls`. We need visual refinement, not a new widget.

**Carousels (Carousels).**
- *Feature Carousel* (`@0xUrvish`, MIT) and *Thumbnail Carousel* (not stated): about 1.8–1.9 MB previews with motion signatures.
- *Progressive Carousel* (UI Layouts): lists `motion` as a dependency and uses `role=progressbar` per slide.

Autoplaying carousels hide content and hurt accessibility. If we use one at all, it should be manual and show its progress. The thumbnail viewer covers this need better.

**Dialogs and modals (Dialogs / Modals).**
- *Hero Video Dialog* (`@dillionverma`, MIT): a poster plus a modal video. Useful for a possible doctor-introduction video.
- *Morphing Dialog* (`@patrick-xin`, MIT): needs framer-motion shared layout.
- *Drawer* (`@efferd`, not stated): built on Vaul per its description.
- *Responsive Modal* (not stated).

We should use native `<dialog>` with `showModal()`, a focus return, and a CSS open/close transition.

**Progress and steppers (Steppers, Progress).**
- *Stepper*, vertical with inline titles and descriptions (`@originui`, MIT): a clean vertical list of numbered steps.
- *Steps* (`@anubra266/icon-steps`, not stated): uses `@ark-ui/react/steps`, a tablist model.
- *Stepper* (`@nyxbui`, MIT).
- *Process Pillars* (not stated): overflowed by 21 px on mobile and has SaaS styling. Rejected.

These are relevant to our questionnaire (`.q-progress`) and "before your surgery" checklists.

**Interactive visualisation and comparison.**
- *Before after comparison* (`@ibrandify`, MIT): `role=slider` with keyboard support, "Drag or use arrow keys", and toggle buttons for After / Split / Before. Strong fit for vision simulations, alongside our cataract and vision sims.
- *Image Compare* (`@kuratlielia`, MIT) and *Image Comparison* (`@ibelick`, MIT) are similar. The second exposed no slider role in its preview.
- *Stats cards with circular progress* (not stated): uses `recharts`. Rejected.
- *Count Up* (`@unlumen`, MIT): rejected on policy grounds (no animated clinical numbers).

**3D.** *Spline Scene* (`@serafimcloud/splite`, MIT) embeds the Spline runtime. Its preview was about 7.6 MB with one canvas. We already have lazy Three.js modules (Lens Lab, Light Journey, cataract 3D), so this is rejected. Nothing else in 3D was relevant.

**Scroll interactions (Scroll Areas).**
- *Sticky Content Wrapper* (`@hyperiux`, MIT; tags: Scroll, GSAP, ScrollTrigger, Sticky, Split Screen): copy steps through headings on one side while the paired image swaps on the other. At 390 px it **falls back to a plain stack**, which I verified in the mobile screenshot. This is the reference for our sticky-split pattern, minus GSAP.
- *Stacking Cards* (`@danielpetho`, MIT, Motion) and *Parallax Image* (`@pulkitxm`, MIT): optional at most.
- *Scroll word reveal* (`@motiondotdev`, MIT): splitting text word by word harms Arabic shaping and screen readers. Rejected.
- *Parallax Scrolling* (`@osmosupply`): GSAP plus Lenis signatures. Rejected.

**Buttons (1.7K).** *Interactive Hover Button* (MIT) and *Liquid Glass/Metal Button* look playful or "tech". Our `.btn` system is enough. Rejected.

**Footers (84).**
- *Large Name Footer* (`@arihantcodes_1f7b8c4d`, MIT): a large wordmark. Could be adapted as a Naskh wordmark band, but this is optional.
- *Motion Footer* (`@jahed`, not stated): a GSAP ScrollTrigger "curtain reveal".
- *Sticky Footer* (`@efferd`, not stated): imports `@studio-freight/lenis`.

Our footer is already structured, so nothing here needs adopting.

**Testimonials (121).** *Animated Testimonials* (`@bankkroll`, license **mpl-2.0**), *Circular Testimonials* (MIT in page metadata; its page also points to a vanilla CodePen version, which I did not open) and *Editorial Testimonial* (not stated). Patient testimonials raise regulatory and consent questions, so none are recommended unless the clinic supplies verified, permitted reviews.

## 5. Shortlist

"Compatibility" is how cleanly the pattern rebuilds in vanilla JS and CSS under RTL: High = CSS plus about 50 lines of JS; Medium = needs care; Low = depends on a library or on scroll-jacking. License is as stated on the page, or "not stated on page".

| # | Component (author) | Source URL | Intended use on our site | Benefits | Adaptation needed for vanilla JS/CSS + RTL | Compatibility | License | Decision |
|---|---|---|---|---|---|---|---|---|
| 1 | Sticky Content Wrapper (@hyperiux) | https://21st.dev/@hyperiux/components/sticky-content-wrapper | Procedure pages: "what happens, step by step", with the illustration plate swapping beside the text | Calm editorial storytelling; stacks on mobile | Replace GSAP with `position: sticky` and an `IntersectionObserver` per step; crossfade plates; use grid, so columns follow `dir` automatically; static stack under reduced motion | High | MIT License | **Adapt.** Best fit for our long-form procedure content. |
| 2 | Scroll animated timeline (@ibrandify) | https://21st.dev/@ibrandify/components/scroll-timeline | Patient journey: consultation → tests → surgery → follow-up | The progress line gives orientation; content stays in normal flow | Line on `border-inline-start`; draw with `animation-timeline: view()` where supported, falling back to IO plus `scaleY`; semantic `<ol>` | High | MIT License | **Adapt.** Clear, honest sequence visual. |
| 3 | Timeline Rail (@nayan_radadiya6) | https://21st.dev/@nayan_radadiya6/components/timeline-rail | Reference for the rail markup | Has `role=list` | Fix the 4 px mobile overflow; logical props | Medium | not stated on page | **Reject.** Covered by #2; license unclear. |
| 4 | Table of Contents (@mohammadshehadeh) | https://21st.dev/@mohammadshehadeh/components/toc | Upgrade `.proc-toc` / `.edu-toc` to a scrollspy | Active-section marker; respects reduced motion | IO on the section headings; `aria-current="true"`; marker on `border-inline-start`; sticky on desktop, collapsible `<details>` on mobile | High | MIT License | **Adapt.** Small change, big gain in orientation. |
| 5 | Editorial service list (@ibrandify) | https://21st.dev/@ibrandify/components/editorial-service-list | Procedures / services index and FAQ styling | Numbered editorial rows; disclosure semantics | Keep our `.faq-question` button-in-heading; animate `grid-template-rows: 0fr→1fr`; numerals on `--gold`; use `gap`, not physical margins (the RTL collision I saw); mirror the chevron | High | MIT License | **Adapt.** Refines our existing accordion visually. |
| 6 | Accordion with icons (author shown: @mui) | https://21st.dev/@olivier_1b6cd5bc/components/accordion-1/accordion-with-icons | Reference for icon plus disclosure | Correct `aria-expanded`/`region`; 3 px focus ring | We already have this pattern | High | not stated on page | **Reject.** Nothing new over our `.faq-*`. |
| 7 | Feature 197 / accordion-feature-section (@shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/accordion-feature-section | Procedure overview: accordion on one side, matching illustration on the other | Links text and figure; 5 working disclosures | Only one item open at a time, each swapping the figure; on mobile the figure goes inside the open panel | High | not stated on page | **Adapt (pattern only).** Merge into #5 or #1; never copy. |
| 8 | Feature Tab Switcher (@mohammadshehadeh/feature-11) | https://21st.dev/@mohammadshehadeh/components/feature-11 | "Lens options" or "conditions": vertical tabs plus preview panel | Arrow-key tabs; quiet styling | WAI-ARIA tabs with roving tabindex (Up/Down for a vertical list, so no RTL key flip); active bar on `border-inline-start` (in the original, the columns and bar did not flip in RTL); becomes an accordion below 768 px | High | MIT License | **Adapt.** Good for comparing options without a long page. |
| 9 | Tabs with roving focus (@haassiib) | https://21st.dev/@haassiib/components/tabs-roving-focus | Reference behaviour for any horizontal tabs (e.g. Arabic/English sources, lens types) | Textbook roving tabindex | In RTL, ArrowRight moves to the *previous* tab; underline via `inset-inline` | High | MIT License | **Adapt.** Behaviour reference for #8. |
| 10 | Expandable Tabs (@victorwelander) | https://21st.dev/@victorwelander/components/expandable-tabs | — | Compact | Labels hidden as icons only; motion library | Low | MIT License | **Reject.** Hides Arabic labels; poor clarity. |
| 11 | Thumbnail image viewer (@ibrandify) | https://21st.dev/@ibrandify/components/thumbnail-image-viewer | Clinic, equipment and operating-room photos; illustration sets | Real tablist; `aria-selected`; counter; no mobile overflow | Thumbnails as `role=tab` buttons; main `<figure>` with `<figcaption>`; prev/next mirrored in RTL; native lazy `<img loading>` with explicit sizes | High | MIT License | **Adapt.** Accessible, image-led, calm. |
| 12 | Shared Element Gallery (@jahed) | https://21st.dev/@jahed/components/shared-element-gallery | — | Polished open transition | framer-motion shared layout, drag-to-dismiss; ~9.6 MB preview | Low | not stated on page | **Reject.** Heavy; drag gestures; license unclear. |
| 13 | Layout Grid (@manuarora700) | https://21st.dev/@manuarora700/components/layout-grid | — | Expanding grid tiles | 0 focusable elements in preview; framer layout | Low | MIT License | **Reject.** Not keyboard-operable as shipped. |
| 14 | Expanding Cards (@vaib215) | https://21st.dev/@vaib215/components/expanding-cards | "Conditions we treat" strip (cataract, keratoconus, retina …) with an illustration per card | Opens on hover, focus or click; vertical on mobile | Buttons with `aria-expanded`; `flex-grow` transition; becomes a stacked list on mobile; no hover-only content | Medium | not stated on page | **Adapt (pattern only).** Image-led but accessible; never copy. |
| 15 | Interactive Image Accordion (@minhxthanh) | https://21st.dev/@minhxthanh/components/interactive-image-accordion | Same need as #14 | Visual | 1 focusable element in preview; hover-driven | Low | not stated on page | **Reject.** #14 covers it accessibly. |
| 16 | Bento Grid (@manuarora700) | https://21st.dev/@manuarora700/components/bento-grid | Image-led procedure bento on the procedures hub | Varied tile sizes add rhythm | CSS grid with `grid-template-areas`; one large illustration tile per row; each tile a single link with real `alt` (the preview's 5 images had none); one column on mobile | High | MIT License | **Adapt.** Structure only; our illustrations and tokens. |
| 17 | Feature Section with Bento Grid (@tommyjepsen) | https://21st.dev/@tommyjepsen/components/feature-section-with-bento-grid | Same as #16 | Quiet layout | Merge with #16 | High | MIT License | **Adapt.** Merged into the bento pattern. |
| 18 | Stats Bento / About Bento (UI Layouts) | https://21st.dev/@uilayout.contact/components/stats-bento | — | — | Marketing stat tiles and slogans | High | Stats Bento: MIT License; About Bento: not stated on page | **Reject.** Promotional tone is unsuitable for medicine. |
| 19 | Before after comparison (@ibrandify) | https://21st.dev/@ibrandify/components/before-after-comparison | Vision simulations: clear vs. cataract or blurred vision (simulated, labelled) | `role=slider`, keyboard support, Split/Before/After toggles | Native `<input type=range>` or `role=slider` with `aria-valuetext`; clip with `clip-path: inset()`; images stay unmirrored in RTL but labels sit at inline start/end; a "simulation" caption is required | High | MIT License | **Adapt.** Pairs with our vision and cataract sims. Never real patient photos. |
| 20 | Image Compare (@kuratlielia) | https://21st.dev/@kuratlielia/components/image-compare | Same as #19 | Simple slider | Motion signatures in preview | Medium | MIT License | **Reject.** #19 is more complete. |
| 21 | Reveal Image Mask (@daiwiikharihar) | https://21st.dev/@daiwiikharihar/components/reveal-image-mask | Gentle reveal of large illustration plates | Editorial feel | `clip-path` plus `animation-timeline: view()`; no JS; off under reduced motion | High | not stated on page | **Adapt (pattern only).** Optional polish; idea only. |
| 22 | Stepper, vertical with inline titles and descriptions (@originui) | https://21st.dev/@originui/components/stepper/vertical-with-inline-titles-and-descriptions | "Before your surgery" checklist; questionnaire progress | Clear numbered steps | `<ol>` with `aria-current="step"`; connector on `border-inline-start`; Arabic-Indic numerals optional | High | MIT License | **Adapt.** Fits `.q-progress` and pre-op guidance. |
| 23 | Steps (@anubra266/icon-steps) | https://21st.dev/@anubra266/components/steps/icon-steps | — | Icon steps | Built on `@ark-ui/react/steps` | Medium | not stated on page | **Reject.** Covered by #22. |
| 24 | Process Pillars (@ankitsharma2615) | https://21st.dev/@ankitsharma2615/components/process-pillars | — | — | 21 px mobile overflow; SaaS styling | Medium | not stated on page | **Reject.** Not clinical in tone. |
| 25 | Hero Video Dialog (@dillionverma) | https://21st.dev/@dillionverma/components/hero-video-dialog | Optional doctor-introduction video | Poster first, video loads on demand | Native `<dialog>`; video `src` set on open (no preload); captions in both languages; focus return | High | MIT License | **Adapt** (only if a video exists). |
| 26 | Morphing Dialog (@patrick-xin) | https://21st.dev/@patrick-xin/components/morphing-dialog | — | Smooth card-to-modal morph | framer-motion shared layout | Low | MIT License | **Reject.** Use native `<dialog>` with a simple transition. |
| 27 | Scroll Direction: Hide Header (@motiondotdev) | https://21st.dev/@motiondotdev/components/motion-scroll-hide-header | Optional: hide the header on scroll-down on mobile | More reading room | rAF-throttled scroll delta; never hide while focus is inside; the booking bar stays visible | Medium | MIT License | **Adapt (optional).** Only if booking access is unaffected. |
| 28 | Morphing Island Navbar (@abushaidislam7) | https://21st.dev/@abushaidislam7/components/morphing-island-navbar | — | — | 108 px mobile overflow; glassmorphism | Low | MIT License | **Reject.** Off-brand, broken on mobile. |
| 29 | Spline Scene (@serafimcloud/splite) | https://21st.dev/@serafimcloud/components/splite | — | 3D hero | Spline runtime; ~7.6 MB preview | Low | MIT License | **Reject.** We already have lazy Three.js. |
| 30 | Container Scroll Animation / Scroll media expansion hero | https://21st.dev/@manuarora700/components/container-scroll-animation | — | Showy | Scroll-jacking or 3D rotate; ~5.9 MB preview for the expansion hero | Low | MIT License (both) | **Reject.** Spectacle over content. |
| 31 | Zoom Parallax / Parallax Scrolling | https://21st.dev/@efferd/components/zoom-parallax | — | Cinematic | Lenis (and GSAP for Parallax Scrolling); 39 px mobile overflow | Low | not stated on page (both) | **Reject.** Smooth-scroll libraries; motion risk. |
| 32 | Spotlight Card / Display Cards | https://21st.dev/@jahed/components/spotlight-card | — | — | 212 px / 124 px mobile overflow; glow and skew effects | Low | Spotlight: not stated on page; Display Cards: MIT License | **Reject.** Gimmicky, not medical. |
| 33 | Count Up (@unlumen) | https://21st.dev/@unlumen/components/count-up | — | — | Animated numbers | High | MIT License | **Reject.** Policy: no animated clinical figures. |
| 34 | Animated Testimonials (@bankkroll) | https://21st.dev/@bankkroll/components/animated-testimonials/animated-testimonials | — | — | Motion; autoplay | Low | mpl-2.0 | **Reject.** Testimonial and consent concerns; copyleft license. |
| 35 | Large Name Footer (@arihantcodes_1f7b8c4d) | https://21st.dev/@arihantcodes_1f7b8c4d/components/large-name-footer | Optional Naskh wordmark band above the footer | Brand presence | Pure CSS; `aria-hidden` on the decorative wordmark | High | MIT License | **Adapt (optional, low priority).** |
| 36 | Motion Footer / Sticky Footer | https://21st.dev/@jahed/components/motion-footer | — | — | GSAP curtain reveal / Lenis | Low | not stated on page (both) | **Reject.** Libraries; no user benefit. |

## 6. Recommended patterns to adapt (in priority order)

These are rebuilt from scratch in our stack. The 21st items cited were inspiration only.

### P1. Sticky-split procedure narrative (from #1, #7)
- **Where:** procedure pages (`.proc-sec`), the "Light Journey" explanation, "what happens on surgery day".
- **Structure:** a `<section>` with a two-column grid. The text column is an `<ol>` of steps, each an `<article>` with an `h3`. The figure column holds a `position: sticky` `<figure>` with all plates stacked.
- **Behaviour:** one `IntersectionObserver` (`rootMargin: "-45% 0px -45% 0px"`) sets `data-active` on the figure, and CSS crossfades the plates. No scroll-jacking, no pinning past the section.
- **RTL:** grid columns follow `dir` automatically. Write no `left` or `right` anywhere.
- **Mobile (< 900 px):** a single column, with each plate placed inline above its step. No sticky.
- **Reduced motion:** plates switch without a crossfade.
- **Accessibility:** decorative plates get `alt=""`; meaningful ones carry a caption.

### P2. Scroll-drawn patient-journey timeline (from #2, #22)
- **Where:** the home page or the "Your visit" page.
- **Content:** consultation → diagnostics → decision → surgery → follow-up.
- **Structure:** a semantic `<ol class="journey">`. The rail is a pseudo-element on `inset-inline-start`.
- **Progress line:** `@supports (animation-timeline: view())` fills it with `scaleY`. Otherwise one IO toggles `.is-reached` per step.
- **Content visibility:** all content is visible without JS. Only the line animates, so nothing appears late.
- **Numerals:** step numbers in `--gold`, matching our `.kicker-num` and `.path-num`.

### P3. Editorial numbered accordion (from #5, #6)
- **Where:** procedure FAQ, services index, education library.
- **Semantics:** keep the current semantics (`h3 > button.faq-question[aria-expanded][aria-controls]`).
- **Visuals:**
  - a large Naskh/Serif title
  - a `--gold` index numeral
  - `--line` hairline separators
  - the answer animates with `grid-template-rows: 0fr → 1fr`
- **RTL:** lay the row out with `display: grid; grid-template-columns: auto 1fr auto; gap: …`. This prevents the numeral collision seen in the original's RTL render. Mirror the chevron with the `.ic-arrow` rule.

### P4. Vertical tab switcher with preview panel (from #8, #9)
- **Where:** "lens options" (monofocal / EDOF / multifocal / toric) and "conditions we treat".
- **Desktop:** WAI-ARIA tabs with roving tabindex. The vertical tablist uses ArrowUp, ArrowDown, Home and End; any horizontal variant flips Left/Right in RTL. The panel shows an illustration plus a summary and a "Read more" link.
- **Mobile:** below 768 px it becomes the P3 accordion, built from the same markup and rendered from the same data in `src/procedures/content.js`.
- **Active state:** `border-inline-start: 3px solid var(--accent)`.

### P5. Image-led procedure bento (from #16, #17)
- **Where:** the procedures hub (`.proc-grid`) and the home "explore" section.
- **Layout:** `grid-template-areas`, with one feature tile spanning 2×2 that carries the main illustration plate, and the remaining tiles 1×1.
- **Tiles:** each tile is one link, with the image `alt` and a visible title.
- **Ruled out:** stat tiles, gradients and glow.
- **Mobile:** a single column in content order.
- **Performance:** illustrations are SVG or `<img loading="lazy" decoding="async">` with explicit width and height to avoid CLS.

### P6. Accessible thumbnail viewer (from #11)
- **Where:** the clinic page (rooms, equipment) and illustration series inside procedures.
- **Structure:** a main `<figure>` with `<figcaption>`. Thumbnails are a `role=tablist` of `role=tab` buttons with `aria-selected`. A counter reads "01 / 04" in English and "٠١ / ٠٤" in Arabic.
- **Controls:** prev/next buttons are mirrored in RTL, and arrow-key direction follows `dir`.
- **No autoplay.** Only the active and adjacent images load eagerly.

### P7. Vision comparison slider (from #19)
- **Where:** next to the vision and cataract simulators, e.g. "clear lens vs. cataract (simulation)".
- **Control:** a native `<input type="range">` overlaid on the images. This gives keyboard support and screen-reader behaviour for free. `aria-valuetext` says e.g. "40% cataract view".
- **Toggles:** Before / Split / After are buttons in a `role=group`.
- **RTL:** the images are not mirrored. Only the UI labels move to inline start/end.
- **Labelling:** a mandatory caption, "Simulated view — not a patient result".

### P8. Scrollspy "On this page" (from #4)
- **Where:** `.proc-toc` and `.edu-toc`.
- **Behaviour:** an IO on the section `h2`s sets `aria-current="true"` on the matching link, and a marker bar slides along `border-inline-start`. Smooth scroll applies only when motion is not reduced.
- **Mobile:** a `<details>` disclosure at the top of the article.

Not in the top 8 but acceptable later: a native `<dialog>` video modal (#25), a hide-on-scroll header (#27, only if the booking bar stays reachable), and a CSS-only image reveal (#21).

## 7. Keeping it one design system

- Build every pattern from the same primitives: `--surface` panels, `--line` hairlines, `--gold` numerals, `--accent` active markers, Naskh/Serif headings, and the existing `.kicker` and `.lede` styles.
- Use one motion vocabulary: 200–320 ms ease-out fades and translates. No springs, bounces, glows or 3D tilts outside the existing Three.js features.
- Use one interaction vocabulary: buttons with visible focus (`--focus`), `aria-expanded` for disclosure, `aria-selected` for tabs, `aria-current` for position.
- Before shipping any adapted pattern:
  - Playwright and axe tests pass
  - a 390 px overflow check passes
  - an RTL screenshot review is done
  - a reduced-motion run passes, consistent with the existing test suite

## Appendix: preview probe measurements (selected)

The preview total includes the React and Tailwind runtime and demo media (a static baseline of about 255–300 KB). "Motion lib" is a heuristic text match on the preview bundle, not the author's dependency list. "Tab x2" is the element focused after pressing Tab twice from page load.

| Component | Preview total | Motion lib detected | Focusable | ARIA seen | Tab x2 | Overflow at 390 px |
|---|---|---|---|---|---|---|
| Sticky Content Wrapper | 448 KB | GSAP | 4 | — | body | 0 |
| Scroll animated timeline | 258 KB | none | 0 | — | body | 0 |
| Table of Contents | 282 KB | none | 6 | — | A (outline) | 0 |
| Editorial service list | 259 KB | none | 3 | region, aria-expanded ×3 | BUTTON | 0 |
| Feature Tab Switcher | 332 KB | none | 7 | tablist/tab/tabpanel | DIV | 0 |
| Tabs (roving focus) | 281 KB | none | 4 | tablist/tab/tabpanel | body | 0 |
| Thumbnail image viewer | 269 KB | none | 6 | tablist/tab/tabpanel | BUTTON (3 px outline) | 0 |
| Before after comparison | 264 KB | none | 4 | slider, group | BUTTON | 0 |
| Bento Grid | 372 KB | none | 5 | — (5 imgs without alt) | A (2 px outline) | 0 |
| Expanding Cards | 2,034 KB | none | 7 | — | LI | 0 |
| Stepper (originui) | 360 KB | none | 3 | region | BUTTON | 0 |
| Hero Video Dialog | 865 KB | framer/Motion | 1 | aria-expanded | body | 0 |
| Interactive Image Accordion | 3,766 KB | none | 1 | — | body | 0 |
| Shared Element Gallery | 9,603 KB | framer/Motion | 12 | — | DIV | 0 |
| Spline Scene | 7,577 KB | framer/Motion | 0 | — (1 canvas) | body | 0 |
| Morphing Island Navbar | 399 KB | framer/Motion | 5 | — | BUTTON | **108 px** |
| Spotlight Card | 255 KB | none | 1 | — | body | **212 px** |
| Display Cards | 360 KB | none | 0 | — | body | **124 px** |
| Zoom Parallax | 1,464 KB | framer/Motion + Lenis | 0 | — | body | **39 px** |
| Process Pillars | 375 KB | framer/Motion | 0 | — | body | **21 px** |
