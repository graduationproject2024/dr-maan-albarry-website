# Security results (2026-11-24)

All scanners ran on GitHub runners from `.github/workflows/security.yml` (run 45404102801, PR #6, branch `feat/phase-2-final-closure` as of 13:30 UTC). None had ever been run before.

| Tool | Scope | Result | Action |
|---|---|---|---|
| Gitleaks (latest, `--redact`) | full git history | **0 leaks** | none |
| OSV-Scanner (latest) | `package-lock.json`, 125 packages | **No issues** | none |
| npm audit | all deps | **0 vulnerabilities** | none |
| CodeQL `security-extended` (JavaScript/TypeScript) | repo | **0 results** (2 analyses on `refs/pull/6/merge`) | none |
| Semgrep (p/javascript, p/secrets, p/owasp-top-ten, p/xss; docs excluded) | 188 tracked files, 289 rules | **23 findings, all `github-actions-mutable-action-tag`** | **Fixed** in `a7c29bd`: every action pinned to a commit SHA (tag kept as a comment) |
| OWASP ZAP baseline (passive) | local production build | 0 FAIL; WARN only (below) | see below |

## ZAP warnings
| Warning | Cause | Status |
|---|---|---|
| Missing anti-clickjacking header (10020), CSP failure to define directive with no fallback (10055 — `frame-ancestors`) | `frame-ancestors` / `X-Frame-Options` only work as HTTP response headers; GitHub Pages cannot set headers | **BLOCKED — EXTERNAL**: needs a host/CDN that sets headers (card #3, domain/server) |
| X-Content-Type-Options missing (10021), Permissions-Policy missing (10063), COEP missing (90004), storable-not-cacheable (10049) | same: response headers | **BLOCKED — EXTERNAL** (same) |
| Suspicious comments (10027) | words in minified JS comments | Informational; no secret or internal URL (Gitleaks clean) |

Existing in-page CSP (`index.html`): `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, frames limited to Google Maps. `'unsafe-inline'` for scripts/styles remains (inline base-path script and prerendered styles) — removing it needs hashes in the prerender step; tracked as a hardening item, not a vulnerability (no user-supplied HTML is rendered; all dynamic text goes through `esc()`).

Recommended headers once on a configurable host: `X-Frame-Options: DENY` / `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, HSTS.
