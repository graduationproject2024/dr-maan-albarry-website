# Phase 0 Changelog — Doctor Data & Medical Content Integrity

## New
- **`doctor-data.js`** is the single source of truth for identity, qualifications, roles (with `current` flag and `source`), contacts (one role per number, `status`), clinic, social links, credibility (`statistics`, `testimonials`), FAQ, the JSON-LD builder, the llms.txt builder, and `isPublishableTestimonial()`.
- **`vite.config.js` plugin `doctor-data-publisher`** injects JSON-LD into `index.html` at the `<!-- @doctor-json-ld -->` slot (dev and build), emits `/llms.txt` at build time, and serves it from dev middleware.

## Changed — `main.js`
- Imports `DOCTOR`, `FAQ`, `whatsappUrl` and `publishableTestimonials`. All flat `DOCTOR.*` fields were replaced with the central nested structure; the `L()` helper picks the current language.
- Removed the unused duplicate simulator data block (old lines 56–138). It carried a second copy of the EDOF preference wording.
- **Contacts:** call → `920018000` / `19505` (Magrabi); WhatsApp → Magrabi's published Dr. Maan line `966508533309`; `0554946433` removed from UI, footer, sticky bar and bundle.
- **Hero:** SCFHS "licence" badge → verified FRCS (UK). Unsourced `100%` / `+15,000` stats and the stale `+26` → three facts (since 1998 · FRCS · Magrabi Madinah) with `<bdi>` for correct mixed-direction rendering. "Senior Consultant" → "Consultant". Badge year and subtitle now come from data.
- **Qualifications:** removed "Saudi Board" / "Board Certified" / "Cornea Fellowship"; the leadership card is generated from `roles`; the intro states each item's provenance.
- **Profile:** the second bio paragraph, which repeated the timeline, was removed. Chips are generated from data. EN role "Chief Medical Officer" → "Chief of Staff", matching the Arabic.
- **Testimonials:** the hard-coded reviews, stars and "pending confirmation" note were replaced by `renderTestimonials()`, which renders nothing until a record passes the publication gate.
- **EDOF neutrality:** simulator chip, canvas tag, result note and disclaimer; IOL-guide badge, highlighted card, card copy and "Clinical guidance by Dr. Maan" box; questionnaire summary ("zero halos"). All rewritten as neutral trade-offs in both languages. The comparison content is preserved.
- **Questionnaire options:** "zero halos" and "95%+ independence" → achievable preferences. Trifocal subtitle no longer promises independence. EDOF halo score 1 → 2 pips (it was equal to monofocal, which is labelled "lowest"). Monofocal "always/definitely needs glasses" → "usually".
- **Incision:** "2.2 mm" (two places, AR + EN) → "small incision".
- **Clinic hours:** the unconfirmed schedule was replaced by a "confirm via contact center / booking portal" message.
- **FAQ:** rendered from the shared `FAQ` array, the same one that feeds FAQPage JSON-LD. The booking answer now lists the verified contact roles.
- **CTA banner:** "Board-Certified Care" → "Specialist Care".
- **Related overstatements fixed:** "zero pain and immediate discharge" → "usually little discomfort; most patients go home the same day". "AI formulas for supreme refractive accuracy" / "Swept-Source" → "optical biometry with modern lens-power formulas". "Peer-reviewed / محكمة" → "reviewed". Simulator note "need the surgeon's review before publishing" → "approximate values for illustration".
- **Follow-up:** remaining reviewer copy fixed. Equipment "oversight" claim removed; guarantee phrasing ("لضمان أمان ودقة النتائج", "يضمن … الراحة التامة", "ensuring … outcomes") neutralised; CXL now "aims to slow or stop progression; response varies" (4 places); "Premium/smart IOLs", "Surgical Mastery" and the tag typo fixed; FAQ #4/#5 questions aligned between AR and EN.
- Inert `data-cta="book|call|whatsapp"` attributes added for future consented measurement (no tracking).

## Changed — other files
- `index.html`: hand-written JSON-LD replaced by the generated slot. Meta descriptions unchanged; they were already consistent with the role wording.
- JSON-LD now contains only Physician (with Hospital, FRCS credential, verified memberships) and FAQPage. Removed: opening hours, geo, priceRange, fake BreadcrumbList, MedicalBusiness duplicate, role-as-organisation `memberOf`.
- `llms.txt` and `public/llms.txt` deleted. The root copy was not used by the build; the public copy is superseded by the generated file.
- Social links: tracking query parameters (`xtok`, `s/t`, `?ra=m`) were stripped. Destinations are unchanged.
