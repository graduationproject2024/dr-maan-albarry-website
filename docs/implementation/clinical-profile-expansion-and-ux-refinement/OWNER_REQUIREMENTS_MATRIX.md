# Owner requirements matrix

| § | Requirement | Status | Where | Evidence |
|---|---|---|---|---|
| 4 | Remove the hero eye illustration and rebalance the hero | Done | `main.js` renderHero; `style.css` §7 | test "hero: no decorative eye plate" |
| 5 | Procedure gallery: image and name only | Done | `main.js` galleryItem / renderSpecialties | test "procedure gallery" |
| 6 | Clearer anatomical images (ICL first) | Partial | ICL 3D: details off by default, plus Before/After. Static plates unchanged. | `ANATOMY_ANNOTATION_VISIBILITY.md` |
| 7 | Ocular-surface guidance | Done, pending review | `src/site/content.js` OCULAR_SURFACE; `/lens-lab/#ocular-surface`; notes on the cataract and lens-implant pages | tests |
| 8 | Five IOL categories in the doctor's wording | Done, pending review | lens-lab content, procedure content, LENS_SUMMARY, simulator | tests |
| 9 | Lens data model, 40/50/65 cm distances, toric as a correction | Done | `IOL_TAXONOMY.md`; optics `enhanced` and `<design>-toric` | optics unit test |
| 10 | Lens Lab recovery | Partial | Not reproduced in production. Taxonomy and toric switch added. | `LENS_LAB_RECOVERY.md` |
| 11 | Light Journey autoplay | Done | `src/light-journey/index.js` | test "plays by itself" |
| 12 | Simulator cameras; details hidden by default | Partial | Details off by default. Cameras audited, not re-authored. | `SURGICAL_SIMULATOR_CAMERA_AUDIT.md` |
| 13 | Before / After | Done for the six simulators (cataract case covered by lens implants) | `src/surgical-sim/procedures/compare.js` | tests |
| 14 | 3D discoverability | Done | 3D badge on every gallery item, plus a note linking to /surgical-education/ | test |
| 15 | 25,000+ counter | Done (attribution to confirm) | `SURGERY_STAT`, count-up | tests |
| 16 | KKESH 2001-2009 employment and teaching | Done | EMPLOYMENT, roles, timeline | test |
| 17 | ICO 2002-2003, KSU 2004, KKESH 2005 | Done | QUALIFICATIONS, then doctor-data and JSON-LD | test |
| 18 | Leadership wording | Kept; evidence still open | role `sscc-president`; registry L01 | `FIRST_IN_REGION_CLAIMS.md` |
| 19-20 | 16 achievements and the verification workflow | Done | ACHIEVEMENTS; display policy | registry tests |
| 21 | iTrace with an authentic photo | Section done; **photo missing** | DEVICES; About #diagnostics | `ITRACE_ASSET_AND_CLAIM.md` |
| 22 | Pentacam AXL Wave with an authentic photo | Section done; **photo missing** | same | `PENTACAM_AXL_WAVE_ASSET_AND_CLAIM.md` |
| 23 | Diagnostic innovation section | Done on About; no homepage teaser without photos | About #diagnostics | test |
| 24-26 | Photo gallery | Architecture done; **no photos supplied**, so the route is unpublished | `src/gallery/`; registry entry `gallery` | harness test |
| 27 | Femto-LASIK terminology | Done | procedure content, simulator tab, summary | test |
| 28 | Professional timeline | Done | About #record | test |
| 29 | Homepage hierarchy | Partial | No diagnostics or photo teaser yet (no photos) | - |
| 31-36 | MCPs, libraries, skills, model routing | Documented | `MCP_TOOL_AUDIT.md` etc. | - |
| 37 | Mobile and real-device QA | Partial | `MOBILE_TEST_RESULTS.md` | - |
| 38 | Trello | Comment added; nothing closed | `TRELLO_RECONCILIATION.md` | - |
