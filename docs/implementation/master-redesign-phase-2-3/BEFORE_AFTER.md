# Before / after — by section

Paths are relative to `docs/implementation/master-redesign-phase-2-3/evidence/`. Each pair exists for
`390-ar-light`, `390-ar-dark`, `390-en-light`, `390-en-dark`, `1440-ar-light`, `1440-ar-dark`,
`1440-en-light`, `1440-en-dark` (substitute the folder name). Examples below use `1440-ar-light` and `390-ar-light`.
Section order changed, so file numbers differ between before and after.

| Section | Before | After | What materially changed |
|---|---|---|---|
| Header | (before capture failed: fixed header) — see `before/…/01-home.jpg` top | `after/sections/1440-ar-light/00-site-header.jpg`, `390-en-light/00-site-header.jpg` | Pill nav + teal pill active state replaced by a serif wordmark, plain text nav with a gold underline, icon-only language/theme controls; phone header carries no booking button (the bar does) |
| Mobile drawer | n/a (dropdown list with inline styles) | `after/interactions/drawer-390-ar.jpg`, `drawer-390-en-dark.jpg` | Full-height contents sheet, numbered serif entries, map/appearance/channels at the foot |
| Hero | `before/sections/1440-ar-light/01-home.jpg` | `after/sections/1440-ar-light/01-home.jpg`, `390-ar-light/01-home.jpg`, `interactions/hero-360-en.jpg`, `hero-768-ar.jpg`, `hero-1920-en.jpg` | Ruqaa H1, glow orbs, rings, "+" marks, floating ✓FRCS badge, quote card and social chips removed; Naskh/Newsreader name, current role from data, book + clinic-line CTAs, arch-framed portrait (desktop) / cameo (phone), 3-fact ledger incl. the 15,000+ statistic |
| Credentials | `before/…/02-qualifications.jpg` | `after/…/02-qualifications.jpg` | Four emoji cards (🏛️🔬👁️⚕️) → a four-column ledger (qualifications, academic, leadership, memberships) with rules and one emphasised current role |
| Biography | `before/…/03-profile.jpg` | `after/…/03-profile.jpg` | Centered header + chips + emoji tech cards → sticky aside with round portrait, serif lede, current/previous appointment timeline (full role wording), Ruqaa signature, single wide conference image with captioned list |
| Expertise & services | `before/…/04-specialties.jpg` | `after/…/04-specialties.jpg` | Four image cards with "SURG-01" codes and pill tags → numbered index list beside one clinical photograph; technology as a 2×2 ledger; care pathway as a connected 4-step line; accreditation as a quiet footnote |
| Cataract & lens guide | `before/…/06-cataracts.jpg` | `after/…/05-cataracts.jpg` | Three cards with eye-icon pips → "what a cataract is" intro with photo, then a single comparison sheet with ruled columns and bar scales (halos in gold), neutral "how is the lens chosen" note |
| Questionnaire | `before/…/07-questionnaire.jpg` | `after/…/06-questionnaire.jpg` | Centered generic card → split layout (sticky intro + paper card), radio-style options, gold step bar |
| Vision simulator | `before/…/05-simulator.jpg` | `after/…/07-simulator.jpg` | Light card on grey → always-dark "instrument" stage, gold selected states, serif metrics; WebGL logic untouched |
| 3D cataract surgery | — (new) | `after/…/08-cataract-3d.jpg`, `interactions/c3d-1440-ar-active.jpg`, `c3d-390-en-active.jpg` | New section: intro, review/consultation notices, line-drawn eye poster, start button; lazy module mounts in place and survives language switches |
| Library | `before/…/08-education.jpg` | `after/…/09-education.jpg` | Plain accordion + red card → numbered serif article index beside a sticky head and a calm red-flag callout |
| Clinic & booking | `before/…/09-clinic.jpg` | `after/…/10-clinic.jpg` | Map-first card with emoji rows (🏥📞🕒📍) → "three ways to your appointment" (portal, Dr. Maan's direct line for call/WhatsApp, Magrabi call center) plus a visit card with hours, address and map |
| FAQ | `before/…/10-faq.jpg` | `after/…/11-faq.jpg` | Centered accordion → sticky head + serif question list with circular plus marks |
| Closing CTA | (inside `before/…/full.jpg`) | (inside `after/…/full.jpg`) | Gradient banner with ✓ trust row → dark band, one headline, three actions |
| Footer | `before/…/11-footer.jpg` | `after/…/12-footer.jpg` | Four columns with repeated #specialties links → brand, contents, contact; disclaimer; source links |
| Full page | `before/sections/*/full.jpg` | `after/sections/*/full.jpg` | 390px page height 20,335 → 18,301 (AR) while adding a section and losing no medical content |
