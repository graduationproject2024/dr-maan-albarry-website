# Remaining Blockers (none are engineering tasks)

All are tracked on Trello card #13 — https://trello.com/c/pLeNoaz1. The full list is in [../DOCTOR_DATA_DECISIONS.md](../DOCTOR_DATA_DECISIONS.md).

| ID | Label | Needs | Live interim behaviour |
|---|---|---|---|
| D-1 | PENDING EXTERNAL APPROVAL | Is `0554946433` official, and for which role? | Not shown; verified Magrabi numbers used |
| D-2…D-7 | PENDING EXTERNAL APPROVAL | Confirm owner-supplied roles (Chief of Staff vs Magrabi's "Executive Medical Director"; Taibah chair tense; SSCCRS president; Red Sea co-founder; since 1998) | Owner wording, identical everywhere |
| D-8 | PENDING EXTERNAL APPROVAL | Clinic hours | "Confirm via contact center / portal" |
| D-9 | PENDING EXTERNAL APPROVAL | SCFHS licence record (only if a badge is wanted) | No badge; FRCS shown |
| D-10 | PENDING EXTERNAL APPROVAL | Written permission + verbatim text for testimonials | Hidden; publication gate enforced and tested |
| D-11 / D-12 | PENDING EXTERNAL APPROVAL | Any statistic or personal lens statement, with source and approved text | None shown |
| D-13 | PENDING EXTERNAL APPROVAL (optional) | Analytics provider + consent (P0-7) | Tracking disabled; inert `data-cta` hooks |
| D-14 / B-6 | BLOCKED (decision) | Production domain; `drmaanalbarry.com` does not resolve | `SITE.url` is one constant; canonical/hreflang/sitemap unchanged |
| — | BLOCKED (authorization) | Permission to push / open a PR / deploy | Local branch only |

Known limitations (not blockers): no real-device testing; JS-only rendering (SEO phase); Linux CI would need a GPU or longer timeouts for simulator tests.
