# Phase 1 — Final handoff

**Branch:** `feat/phase-1-premium-experience`. It has 20 commits on top of `main` and is **not pushed, not merged and not deployed**; production is unchanged. Excluding docs and images, 73 files changed (+7,776 / −1,473).

## What was delivered
| Area | Result | Detail |
|---|---|---|
| Homepage | Rebuilt as six numbered chapters: physician hero, expertise, three featured specialties, vision discovery and surgical education (a shared dark band), education, and clinic. About **half as long**: 10,746 → 5,363 px (AR desktop) and 14,943 → 8,015 px (AR phone). | `DESIGN_SYSTEM.md`, `INFORMATION_ARCHITECTURE.md` |
| Design system | "Physician's monograph" look: warm ivory and sand, lagoon green for actions, terracotta and gold accents, semantic colours, AA in both themes. Arabic-first type (Noto Naskh Arabic / Source Serif 4 headings; Noto Sans Arabic / Public Sans at 18 px). 1,280 px grid with asymmetric splits. Dedicated phone layouts. Fallback fonts measured to match, so there is no font-swap layout shift. | `DESIGN_SYSTEM.md` |
| New pages (AR + EN, prerendered, SEO) | `/about/`, `/procedures/`, `/lens-lab/`, `/surgical-education/`, `/education/`, `/how-vision-works/`, `/clinic/`. The site now has **30 pages**, each with breadcrumb JSON-LD, canonical, hreflang and a sitemap entry. | `site-routes.js` |
| Physician profile | `/about/`: introduction, expertise, verified credentials with a line on why each matters, a dated timeline, academic and leadership roles, affiliation. No invented quotes, awards or testimonials. Three Magrabi-published facts are recorded as pending and not shown. | `PHYSICIAN_PROFILE_REVIEW.md` |
| Content restored | Answer-driven questionnaire result (neutral wording), 4 guides, "Your visit" pathway, post-operative cataract photo, footer emergency sentence, Arabic typo fix. Items on the do-not-restore list stayed out. | `CONTENT_PRESERVATION_MATRIX.md` |
| Vision & Lens Lab | Comparison of 5 lens categories (monofocal, toric, multifocal, trifocal, EDOF): distance, intermediate, near, glasses, halos and glare, contrast, advantages, limitations, and questions to ask the surgeon. "Compare two" with 5 everyday situations driving a split simulator view. | `IOL_COMPARISON_REVIEW.md` |
| Vision simulator | Situation-first flow; technical controls moved to "Advanced"; a two-focus multifocal lens added; night glare corrected (cataract glare was drawn 6.25× instead of 2.5×); larger viewer on phones. | `VISION_SIMULATOR_AUDIT.md` |
| Illustrations | All 7 rebuilt as distinct compositions on a rebuilt pipeline. Each image is 85 KB or less; no baked-in text; all original. | `ILLUSTRATION_REVIEW.md` |
| Creative experience | "How Vision Works — Light Journey": 9 SVG steps, light and focus toggles, links from each part to the relevant procedure, AR/EN with mirrored RTL, fully keyboard and text accessible. | `src/light-journey/` |
| 3D cataract simulator | Unchanged and still working on `/surgical-education/` and the cataract page. The homepage shows a poster only. | — |
| Tests | **428 passed, 0 failed, 16 skipped.** 217/217 journey steps pass; axe scans pass 60/60. | `TEST_RESULTS.md` |

## Acceptance gate (brief §16)
| Criterion | Status |
|---|---|
| Homepage meaningfully shorter and better organized | **Met.** Measured −46% to −50%. |
| Desktop no longer wastes width | **Met.** 1,280 px grid with asymmetric layouts; see `evidence/after/pairs/`. |
| Dr. Maan's identity and credentials prominent | **Met** on the engineering side: hero, expertise chapter and the `/about/` page. Needs owner acceptance. |
| Useful content preserved or restored | **Met.** Every matrix row has a destination. |
| Lens comparison with advantages, limitations and considerations | **Met.** |
| Interactive compare-two | **Met.** |
| Simulator clearer, assumptions documented | **Met.** Audit doc; not clinically validated. |
| Illustrations substantially improved | **Met** on the engineering side. Remaining weaknesses are listed in `ILLUSTRATION_REVIEW.md`, and the images are pending Dr. Maan. |
| Distinctive identity | Engineering pass done; **owner acceptance pending.** |
| AR and EN polished; light and dark coherent; mobile usable | Met in emulated testing and review. No real device was used. |
| Cataract simulator keeps working | **Met.** Its tests pass. |
| No major accessibility, navigation or scroll regressions | **Met.** axe 60/60; journeys 24/24. |
| Tests pass without weakened assertions | **Met.** |
| New visual evidence reviewed | **Met.** 3 critique passes by the site agent plus a lead review of the merged build. |
| Deployed site unchanged | **Met.** |
| Clinical material labelled pending | **Met.** |

## Known remaining issues
1. **Two vision simulators on `/lens-lab/`** (the Lab's embedded one plus the full section). Both load lazily and draw only when something changes, but two WebGL contexts are a risk on low-end phones, and the page is long (about 9.5k px on desktop, 14.6k px on phones). Removing the second needs about 80 test references moved to the Lab's simulator. **This is Phase 2 cleanup.**
2. **English homepage height** is 5,585 px at 1440 and 8,272 px at 390, slightly above the targets of 5,500 and 8,000 px.
3. **Hero portrait** source is only 295×225 and looks soft on high-density screens. A high-resolution original is needed from the owner.
4. **Photo permissions:** `dr-maan-redsea.jpg` on `/about/` shows event logos and a blurred attendee, so publishing it needs owner confirmation. The faculty group photo was not used.
5. **Illustration weak spots:** bright gel in the dark cataract image; a pale area in the ICL image; an oblique view of the macula; a UV wash in the light CXL image.
6. **No real-device or screen-reader testing,** and performance was not re-measured for the new pages.
7. **21st tools:** the `21st` CLI is not installed, and installing it was blocked. The `21st-ui-review` checklist was applied by hand; `21st-ai` generation was not used.

## Clinical review needed (Dr. Maan)
- **Biography wording** and the "why this credential matters" lines.
- **Lens Lab content**, including questions Q-A to Q-H in `IOL_COMPARISON_REVIEW.md`:
  - trifocal is rated equal to or better than multifocal on every row;
  - EDOF halo wording;
  - night pupil of 5 mm or 4.5 mm;
  - multifocal near add;
  - whether to mention monovision;
  - Arabic terms.
- **Simulator model assumptions** (Q1–Q7 in `VISION_SIMULATOR_AUDIT.md`).
- **The 7 illustrations and the Light Journey text.**
- **Pending facts:** Red Sea scientific council member, former SOS secretary, SRC centre of excellence. Also the CBAHI wording.

## Phase 2 preparation
- Reconstruct the cataract surgery simulation further (its current status is in `docs/implementation/clinical-visual-reconstruction/`).
- Add other surgical animations, one per procedure, built only after clinical review of the illustrations.
- Combine the two simulators on `/lens-lab/` into one and move the tests.
- Profile performance on real phones, and get a real-device CLS check of the Arabic fallback fonts on Android and iOS.
- Do a screen-reader pass (NVDA, VoiceOver, TalkBack).
