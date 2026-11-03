# IOL comparison (Vision & Lens Lab): content review

**Medical review status: draft, pending review by Dr. Maan Albarry. Nothing here is physician-approved.**

| | |
|---|---|
| Content file | `src/lens-lab/content.js` (Arabic first, English mirror; single source of truth, also read by `src/vision-sim` for "questions for your doctor") |
| Module | `src/lens-lab/` |
| Model audit | [VISION_SIMULATOR_AUDIT.md](VISION_SIMULATOR_AUDIT.md) |

## 1. What the patient sees

Order on the page, following "key information first":

1. **A header** with the persistent label: *"Educational illustration — not a prediction of your result; your surgeon will advise."* It carries a link, "Model limitations", that jumps to and focuses the limitations section. The same label appears again directly under the picture. The draft review status is also shown.
2. **At a glance.** Five categories: Monofocal, Toric, EDOF, Multifocal (two-focus) and Trifocal.
   - Rows: what it is; distance (driving, signs, TV); intermediate (computer, dashboard); near (phone, reading); glasses after surgery; halos and glare at night; contrast; advantages; limitations; and questions to discuss with your surgeon.
   - Each rated row has a 3-step bar plus words. The words carry the meaning; the bar only summarises them.
   - A fuller bar always means "more favourable for you" in every row. This avoids the legacy guide's flipped "more eyes = more halos" convention.
   - Wide screens show a table with a sticky first column. Narrow screens show one lens card at a time, chosen with chips.
3. **Toric note.** Toric is astigmatism correction, which can be combined with a monofocal, EDOF, multifocal or trifocal design. The toric column describes a monofocal toric.
4. **Compare two.** Pick lens A and lens B, then an everyday situation: night driving, reading a phone, laptop work, reading a book, or distance signs.
   - The picture comes first: the vision-simulator split view, mounted lazily in viewer mode.
   - Then "In this situation", which gives both lenses' wording for the rows that situation depends on.
   - Then **Key differences**, listing only the rows where the two differ, with the situation's rows first.
   - Then side-by-side cards with "Different" / "Similar" flags.
   - Choosing the same type twice swaps the pair rather than comparing a lens with itself.
5. **Advanced details** (`<details>`): the situation's distance, the assumed pupil, the defocus for each lens, a note on how defocus works, and the model's assumptions.
6. **What this comparison cannot tell you** (the limitations), plus general questions for any lens.
7. **Sources** (`<details>`), with research summaries marked "study".

## 2. Integrity decisions

| Rule | How it is applied | Enforced by |
|---|---|---|
| No lens declared universally superior | The lede states that no single lens is best for everyone. Every lens has advantages **and** limitations, and at least one row that is not "favourable". No lens is at least as good as every other lens on every row. | `tests/lens-lab.spec.js` → "no lens is better or equal on every row" |
| No preference wording | No "preferred / favoured / recommended / best lens" (EN) and no "المفضل / يفضل / ننصح" (AR). | Regex in `lens-lab.spec.js` (content and rendered text) |
| No outcome promises | "Usually", "often", "may", "not guaranteed"; spectacle independence is never promised. | Review; regex for "guaranteed result" / "نضمن" |
| No percentages or success rates | No numbers in patient-facing comparison content. A light-share percentage was drafted for "Advanced" and **removed** so that no "%" appears anywhere. | Regex for `%` / `٪` / "success rate" |
| No brands or products | Generic categories only. EyeWiki product names were not used. | Review |
| Patient considerations as questions | Three questions to ask the surgeon per lens, plus four general questions. Every one ends with "?" / "؟". | Test |
| Qualitative levels only | The levels are 1–3 and are never shown as numbers. The 15 c/deg sharpness index is hidden from the main simulator view. | Review, audit A5 |
| Disclosure of what the picture is | Persistent label, "Model limitations" link, "Advanced: model assumptions", and the toric astigmatism assumption stated in words whenever a toric lens is compared. | Tests (label present in both languages; toric note visible) |
| Arabic parity | Same structure and meaning. The keys of `CONTENT.ar` and `CONTENT.en` are compared in a test. | Test |
| Reading order | In Arabic, lens A (first picker, on the right) is drawn on the right of the picture. | Test ("Arabic draws lens A on the right") |

## 3. What was restored from git history

| Commit | Location | Restored and how |
|---|---|---|
| `402bc49` (Phase 0/1 merge) | `main.js` `renderIolGuide()` and `VisionSim.LENSES` notes | EDOF "extends the range of vision from distance to intermediate (screens, dashboard)… reading glasses are often needed for fine print"; monofocal "clear distance vision… glasses for intermediate (computer) and near (reading)"; "no single lens suits every patient… decided with your treating ophthalmologist". Rewritten into the "what it is / levels / limitations" fields. |
| `0d167b7` | `main.js` `renderIolGuide()` (redesigned sheet) | The row set (distance, intermediate "computer", near "reading", night halos, glasses) and the 4-mark scale idea. They became the 3-step favourability bar with words. The guide's closing paragraph is reflected in the lede and the general questions. |
| `402bc49`, `0d167b7` | Questionnaire result | "Discuss the trade-offs… the range you need, the chance of night halos, and expected need for glasses" became general question 1. "Pentacam… irregular astigmatism before premium IOL selection" became the toric limitation (irregular astigmatism) and a toric question. |

Not restored, deliberately:

- **"Purest distance acuity", "Excellent & pure", "Great, rarely need glasses", "High independence".** These are promotional or predictive.
- **"usually with fewer night halos than multifocal designs" (EDOF), as an unqualified claim.** Two meta-analyses (Liu 2019; Karam 2023) found no significant difference in halos or glare between EDOF and trifocal. It now reads: *"Possible; often described as milder than multifocal designs, though studies differ"* (Q-B).
- **The 4-point scores themselves** (for example trifocal near 4/4, monofocal halos 1/4). They were replaced by 3 qualitative levels with words.
- **The "open eyes / closed eyes" legend.** It flipped meaning between rows.
- **Clinic-specific wording** (Magrabi, booking). This belongs to the host page.

## 4. Content sources

All sources are listed in `content.js` → `SOURCES` and rendered under "Sources". They were checked on 2026-11-02.

| Source | Used for |
|---|---|
| AAO EyeSmart: IOL implants (https://www.aao.org/eye-health/diseases/cataracts-iol-implants) | Definitions of the categories |
| EyeWiki: Presbyopia-correcting IOLs (https://eyewiki.org/Presbyopia-Correcting_IOLs) | Bifocal vs trifocal, weaker intermediate with bifocal designs, halos and glare, contrast |
| EyeWiki: Extended depth of focus IOLs (https://eyewiki.org/Extended_Depth_of_Focus_IOLs) | How EDOF differs from multifocal; design variety; photic phenomena possible with both |
| EyeWiki: Toric IOLs (https://eyewiki.org/Toric_IOLs) | Regular vs irregular astigmatism, toric versions of other designs, rotation |
| Cochrane CD003169 (2016) | Distance similar; near better and fewer glasses with multifocal; more halos and glare (low certainty) |
| Liu 2019, BMC Ophthalmol (PMC6719364) | Rows for EDOF |
| Karam 2023, Am J Ophthalmol (doi 10.1016/j.ajo.2023.01.024) | Trifocal near vs EDOF intermediate; no significant difference in halos |
| NHS: Cataract surgery | Glasses may still be needed |

## 5. Level table (for review)

Levels are favourability: 3 = usually favourable, 2 = moderate or varies, 1 = usually limited.

| | Distance | Intermediate | Near | Glasses | Halos | Contrast |
|---|---|---|---|---|---|---|
| Monofocal | 3 | 1 | 1 | 1 | 3 | 3 |
| Toric (monofocal) | 3 | 1 | 1 | 1 | 3 | 3 |
| EDOF | 3 | 3 | 2 | 2 | 2 | 2 |
| Multifocal (two-focus) | 3 | 2 | 3 | 2 | 1 | 1 |
| Trifocal | 3 | 3 | 3 | 3 | 1 | 1 |

## 6. Open clinical questions for Dr. Maan

- **Q-A. Trifocal vs two-focus multifocal.** In this table the trifocal is at least as good as the two-focus multifocal on every row, although each still has limitations against monofocal and EDOF. Is that the message you want? Should a two-focus advantage be stated, such as more light at reading distance or a choice of add powers?
- **Q-B. EDOF halos.** Should EDOF halos be level 2 ("possible; often milder") or level 1 like the multifocals, given meta-analyses that found no significant difference against trifocal?
- **Q-C. Multifocal intermediate.** Should multifocal intermediate be 2 ("varies by design") or 1? Low-add and high-add bifocals differ.
- **Q-D. Monovision.** Is it acceptable to mention monovision as an option under monofocal?
- **Q-E. Toric rotation.** Is the toric limitation wording ("may need repositioning") appropriate? Should a "usually ≥ 1 D of regular astigmatism" threshold be mentioned? It was left out to avoid numbers.
- **Q-F. Other categories.** Should "enhanced monofocal" and small-aperture designs be named, or stay as "designs differ a lot" under EDOF?
- **Q-G. Contraindications.** Which conditions should be named as making split-light lenses "less suitable"? Currently retina, cornea, dry eye and glaucoma are mentioned only inside questions.
- **Q-H. Arabic terms.** Please review the Arabic terminology: ممتدة المدى, متعددة البؤر (ثنائية البؤرة), ثلاثية البؤرة, توريك, الاستجماتيزم.

## 7. Integration (for the `main.js` owner)

- **Host pages:**
  - `procedures/lens-implants/` and `en/procedures/lens-implants/`: primary, after the "Types and options" section.
  - `procedures/cataract-surgery/` and `en/procedures/cataract-surgery/`: optional, near the end.
  - The home page keeps the stand-alone vision simulator.
- **Host element:** `<div data-lens-lab-host></div>`, kept outside re-rendered markup (the same pattern as `#simulator-host`).
- **Loading:** mount lazily near the viewport with `import('./src/lens-lab/index.js')`. The module itself loads the simulator chunk only when the "Compare two" picture approaches the viewport.
- **API calls:**

  ```js
  const lab = await mount(host, { lang, theme, reducedMotion });
  ```

  On language change call `lab.setLang(currentLang)`; on theme change call `lab.setTheme(resolvedTheme())`; when leaving the page call `lab.destroy()`.
