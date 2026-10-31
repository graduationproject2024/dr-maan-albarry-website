# Independent Reviewer Findings & Dispositions

Three read-only reviewer agents ran on 2026-10-31 against the branch build. Each finding below was triaged, and every in-scope blocker or should-fix was fixed and retested.

## 1. Medical content & trust review — verdict: CONDITIONAL PASS (no blockers)
Outcomes 1–8 (lens preference, stats, licence, testimonials, contacts, hours, JSON-LD) confirmed met.

| Finding | Severity | Disposition |
|---|---|---|
| Hero facts labelled "Verified professional facts" although "since 1998" is owner-supplied | should-fix (introduced) | **Fixed** → "Professional facts" |
| Qualifications intro credited Magrabi for owner-supplied roles | should-fix (introduced) | **Fixed** → "Qualifications as listed by Magrabi; roles as provided by the doctor's office" |
| Questionnaire options "zero halos" / "95%+ independence" | should-fix | **Fixed** (achievable preferences) |
| Trifocal subtitle "Maximum spectacle independence" contradicts FAQ | should-fix | **Fixed** → "Less need for glasses, with a chance of night halos" |
| EDOF halo pips equal to monofocal ("lowest") | nit | **Fixed** (2 pips) |
| Monofocal "always/definitely" needs glasses | nit | **Fixed** → "usually" |
| Public note "need the surgeon's review before publishing" | nit | **Fixed** → "approximate values for illustration" |
| "zero pain and immediate discharge" (education, EN) | out-of-scope should-fix | **Fixed** |
| "AI formulas … supreme accuracy" / "Swept-Source" | out-of-scope | **Fixed** |
| "Peer-reviewed / محكمة" guides | out-of-scope | **Fixed** → "reviewed" |
| Red Sea "co-founder" vs caption "scientific council member" | nit | Logged as D-5 |
| Minor AR/EN nuance mismatches (FAQ #4/#5 wording, "without stitches") | nit | Open, for a later copy pass |
| "under Dr. Maan's clinical oversight" (equipment), "لضمان أمان ودقة النتائج", CXL "arrest progression", "Premium IOLs" marketing tone, tag typo "عدسات ثلاثية EDOF" | out-of-scope | Open, recorded for a later content pass |

## 2. Code review — no blocking defects
| Finding | Severity | Disposition |
|---|---|---|
| `reuseExistingServer: true` lets tests pass against a stale `dist/` | medium | **Fixed** (`false`: every run rebuilds) |
| 768px test passes even if the bar is hidden | low-medium | **Fixed** (visibility, x ≥ 0, width asserted) |
| Scroll-listener test asserts an exact add count (brittle) | low-medium | **Fixed** (tracks active listeners; must not grow) |
| WhatsApp bar action 4.1:1 contrast | medium | **Fixed** (`#15803d`, 5.0:1) |
| `String.replace` with a string can interpret `$` patterns in JSON-LD | low | **Fixed** (function replacer) |
| Hero badge year and AR Latin subtitle hard-coded | low | **Fixed** (from data) |
| Positive testimonial render path untested | low | Gate function unit-tested. A rendered-card test needs a test hook in production code, so it was not added. Recorded as a known gap. |
| Quote card may shrink in the flex column | cosmetic | **Fixed** (`width: 100%`) |
| Verified: no TDZ issue with `L()`, all `DOCTOR.*` refs resolve, no XSS vector, llms.txt not duplicated | — | — |

## 3. UI/UX & accessibility review
Clean in all 16 combinations (360/390/768/1366 × AR/EN × light/dark): no overflow, no clipped text, the bar never covers content, focus is visible, accessible names are correct.

| Finding | Severity | Disposition |
|---|---|---|
| Bar WhatsApp label 4.12:1 | blocker | **Fixed** (5.0:1), plus automated contrast test |
| Clinic/hero `.btn-whatsapp` white on #25D366 ≈ 1.98:1 (pre-existing) | blocker | **Fixed** (`#15803d` site-wide), covered by the contrast test |
| Hero CTA below the fold at 1366×768 (pre-existing) | should-fix | **Fixed**: hero order CTA → facts → quote at all widths; test asserts CTA bottom ≤ viewport height at 1366×768 and 1440×900 |
| Arabic dash orphans in facts labels | should-fix | **Fixed** (`&nbsp;–`) |
| Simulator controls 38px | should-fix | **Fixed** (44px ≤600px) |
| EN fact label read backwards | should-fix | **Fixed** ("In clinical & surgical practice since") |
| Dark Book action low non-text contrast | nit | **Fixed** (gold border) |
| `env(safe-area-inset-*)` needs `viewport-fit=cover` | nit | **Fixed** |
| Bar is weighted 1.35/1/1, not "equal" | nit | Intentional; documented |
| EN EDOF tag wraps to 2 lines at 360 | nit | Open (no overlap; tests pass) |
| AR header brand truncated at 360 (pre-existing) | nit | Open, outside Phase 1 scope |
| AR subtitle breaks after "(تخصص" | nit | Open (natural wrapping of the official title) |
