# Acceptance Matrix

Legend: ✅ passed with evidence · ⛔ blocked on an external decision (see BLOCKERS.md) · ⚠️ passed with a noted limitation

## Phase 0 completion gate

| Criterion | Status | Evidence |
|---|---|---|
| Central doctor data source implemented | ✅ | `doctor-data.js`; page, JSON-LD and llms.txt generated from it |
| All public contact data reconciled | ✅ | One role per number; test "contact links come only from approved central data" |
| No contradictory phone numbers | ✅ | Same test + dist scan (no `554946433`) |
| Testimonials verified or removed | ✅ removed | Gate + tests; permission decision is D-10 |
| Unsupported statistics removed or documented | ✅ removed | Text test; `credibility.statistics = []` |
| Licence wording verified or removed | ✅ removed | Text + dist tests; SCFHS record is D-9 |
| Unsupported EDOF preference removed everywhere | ✅ | Full-text test (all lens states, questionnaire), dist scan, `EVIDENCE/claim-search.md` |
| Cataract incision wording generalised | ✅ | Text + dist tests |
| JSON-LD synchronised with visible information | ✅ | JSON-LD test; `EVIDENCE/jsonld/` |
| FAQ structured data matches actual FAQ | ✅ | Questions **and** answers equal |
| Working hours consistent | ✅ | None stated anywhere until approved (D-8) |
| Professional role consistent | ⚠️ | Identical across AR/EN/JSON-LD/llms (tested). The wording itself is owner-supplied and differs from Magrabi's profile, so it awaits confirmation (B-7). |
| `llms.txt` synchronised | ✅ | Generated; test |
| No invented medical facts | ✅ | Medical reviewer confirmed; nothing replaced removed claims |
| Automated Phase 0 tests pass | ✅ | 12/12 |
| Independent content & technical review passes | ✅ | Medical review: conditional pass; all in-scope items fixed. Code review: no blockers left. |
| P0-7 booking interaction measurement | ⛔ | B-5: no approved analytics or consent decision. Inert `data-cta` hooks only. |
| Clinic confirmation of the mobile number | ⛔ | B-1 (safe interim behaviour live) |

**Phase 0 gate: NOT closed.** Engineering criteria pass. P0-7 and the external confirmations (B-1, B-7) are blocked on decisions.

## Phase 1 completion gate

| Criterion | Status | Evidence |
|---|---|---|
| Mobile booking bar fixed at 360px | ✅ | 2/4 → 0/3 off-screen; bar tests |
| Mobile booking bar fixed at 390px | ✅ | 1/4 → 0/3 |
| Arabic booking bar passes | ✅ | 8 combos incl. AR light/dark |
| English booking bar passes | ✅ | |
| All primary actions visible | ✅ | Book / Call / WhatsApp; Maps in clinic, banner, footer |
| No horizontal overflow | ✅ | All 5 viewports |
| Hero CTA fixed | ✅ | Label inside button; first screen on 360, 390, 1366, 1440 |
| Clinic booking CTA fixed | ✅ | 273/246 → 171/246 |
| Existing booking destination preserved | ✅ | `href` asserted = `https://ob.magrabi.com.sa/OnlineBooking/` |
| Simulator mobile tags no longer overlap | ✅ | All 4 lenses × 8 combos |
| Mobile simulator remains functional | ✅ | Lens, scene, curve, keyboard slider, disclaimers. GPU-backed; the SwiftShader limitation is documented. |
| Hero mobile composition improved | ✅ | Name → specialty → CTA → portrait; UI review confirmed |
| RTL and LTR verified | ✅ | |
| Light and dark verified | ✅ | Includes contrast tests |
| Existing features still work | ✅ | Regression tests |
| No new console errors | ✅ | |
| No broken images or assets | ✅ | Including lazy images |
| Automated Phase 1 tests pass | ✅ | 52/52 |
| Independent UI/UX & QA review passes | ✅ | Two blockers (WhatsApp contrast) and all should-fixes fixed and retested |
| Before/after screenshots captured | ✅ | `EVIDENCE/before`, `EVIDENCE/after` |
| Content density reduced | ⚠️ | −9.4% page height at 390 AR without cutting medical content. Further progressive disclosure is deferred. |

**Phase 1 gate: all criteria met.** Per §11 of the brief it is not declared complete while Phase 0 remains open.

## Overall
**IN PROGRESS / Not Completed.** The remaining work is clinic decisions, not engineering.
