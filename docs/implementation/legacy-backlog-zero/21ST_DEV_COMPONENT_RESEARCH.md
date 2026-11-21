# 21st.dev research

Source: https://21st.dev/community/components (categories seen include Heroes, Galleries, Images, Navigation Menus, Timelines, Accordions, Carousels, Dialogs / Modals, Progress, Steppers, Scroll Areas, Spinner Loaders). Components are React (shadcn style) and need a 21st API key to install; each has its own author and licence.

| Component | URL | Original behaviour | Deps | Licence | Project use | Decision |
|---|---|---|---|---|---|---|
| Gallery lightbox (f0rextasy, Bigbull UI) | https://21st.dev/@f0rextasy/components/gallery-lightbox | thumbnail grid → modal viewer, keyboard paging, Escape | not listed | MIT (shown) | the anatomy "enlarge" dialog | **Pattern adapted, then reduced**: the existing native `<dialog>` first opened out of its button (scale); the gate found the scaled close button measuring under 44 px, so it is now a short cross-fade in and out (GSAP); keyboard/Escape/focus return kept. Paging between figures not added (not needed to understand a page) |
| Timeline (Manu Arora, Aceternity UI) | https://21st.dev/@manuarora700/components/timeline | sticky headings + scroll "beam" | framer-motion | MIT (shown) | career record | Rejected: three milestones; motion without information |
| Accordion (Fuma Nama, Fumadocs) | https://21st.dev/@fuma-nama/components/accordion | Radix accordion | radix, lucide | MIT (shown) | FAQ | Rejected: the site's `<details>` FAQ is accessible and has no defect |

No 21st.dev code or React dependency was added. Licences above are as shown on each component page (author-supplied).
