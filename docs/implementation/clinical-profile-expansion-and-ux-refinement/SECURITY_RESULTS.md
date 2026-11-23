# Security results

## Manual review of new code
- **Gallery:** manifest strings are HTML-escaped before `innerHTML`; images are same-origin; no URL parameters are read.
- **About page:** publication titles and journals are escaped. Links are fixed PubMed or DOI URLs that open with `rel=noopener noreferrer`.
- **Device links:** official maker URLs only.
- **Before/After and Light Journey text:** set with `textContent` or escaped templates.
- **Other checks:** no new third-party scripts, no new storage of personal data, no new network endpoints. The CSP is unchanged and same-origin compatible.

## Gate checks
- `npm audit --omit=dev --audit-level=high` runs in CI.
- `tests/journeys/security.spec.js` is part of the gate run (`REGRESSION_RESULTS.md`).

## Not run
Semgrep, Gitleaks, OSV-Scanner, CodeQL and OWASP ZAP are not installed or connected here. No results are claimed.
