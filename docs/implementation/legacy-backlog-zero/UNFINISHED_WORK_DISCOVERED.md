# Unfinished work discovered

| Finding | Where | Action this milestone |
|---|---|---|
| No Content-Security-Policy and no referrer policy on any page | `index.html` → all prerendered pages and `404.html` (#2 comment of 2026-11-02 said headers not covered) | added as `<meta>`: self-only scripts/styles/images/fonts, Google Maps frame only, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`; referrer `strict-origin-when-cross-origin`. `frame-ancestors` and HSTS cannot be set by meta: external (host) |
| 20 cards say "Closed by the owner on 2026-11-21" but are open | Trello | each audited card gets a correcting status comment |
| #20 checklist item BUG-11 "custom 404 page still to do" | Trello | done since 2026-11-17 (BUG-FS-03, live); item ticked only after `routing.spec.js` passes |
| `full-regression.yml` never run on GitHub | #28 | left open: needs a run on GitHub (not triggered without the owner) |
| `TRELLO_COMPLETE_INVENTORY.md` first draft said "Checklists: 0" | this folder | corrected (7 checklists) |
| `'unsafe-inline'` needed in script-src | inline `onclick` handlers and the theme bootstrap script | kept; removing it means rewriting every inline handler: logged as future hardening, not done |
