# Next Phase 2 and 3 — dependency map (PROVISIONAL)

Status values: **Satisfied** · **Engineering** (work needed) · **Medical** (review needed) · **Owner** (decision needed) · **External** (asset or service needed) · **Unknown**.
No dates are given: there is no basis for them until the scope is defined.

| Future item (candidate) | Lens Lab stable | Optical model review | 3D rendering work | New anatomical assets | Physician approval | New content | External APIs | Hosting decision | Performance testing | UI components | SEO infrastructure |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P2-01 Clinical review of existing material | Satisfied | Medical | — | — | Medical | — | — | — | — | Satisfied (review tools) | — |
| P2-02 Cataract viewer faster set-up | — | — | Engineering | — | Medical if visuals change | — | — | — | Engineering | Satisfied | — |
| P2-03 Animations for other procedures (#10) | — | — | Engineering | External or Engineering | Medical | Owner + Medical | — | — | Engineering | Satisfied (viewer pattern) | Satisfied |
| P2-04 Optical model extension (if wanted) | Satisfied | Medical | Engineering | — | Medical | — | — | — | Engineering | Satisfied | — |
| P2-05 Real-device verification | Satisfied | — | — | — | — | — | — | — | External (phones) | — | — |
| P3-01 New education sections | — | — | — | Engineering | Medical | Owner + Medical | — | — | — | Satisfied (patterns) | Satisfied (registry) |
| P3-02 Booking system (#8) | — | — | — | — | — | Owner | External (clinic system) | Owner | Engineering | Engineering | Satisfied |
| P3-03 Chat assistant (#9) | — | — | — | — | Medical (answers) | Owner | External | Owner | Engineering | Engineering | — |
| P3-04 Production domain (#3, D-14) | — | — | — | — | — | — | External (registrar) | Owner | — | — | Engineering (SITE_URL switch) |
| P3-05 New portrait (#4) | — | — | — | External (photo) | — | — | — | — | Engineering (re-measure LCP) | Satisfied (PORTRAIT setting) | — |
| P3-06 Analytics (D-13) | — | — | — | — | — | Owner (consent) | External | — | — | Engineering | — |

## Cross-cutting prerequisites

| Prerequisite | Status |
|---|---|
| Current milestone merged and deployed | Owner (deploy instruction) |
| CI gate proven on GitHub runners | Engineering: needs one push to run (`CI_CD_QUALITY_GATES.md`) |
| Clinical review of the 13 changed images and 35 terms | Medical |
| Doctor/clinic facts D-1 to D-14 | Owner / clinic |
| Domain | Owner / External |
