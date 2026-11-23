# Provenance and publication policy

Every new fact lives in `clinical-profile.js` with these fields:
- `original`: the owner's wording, verbatim.
- `source`: `owner-2026-11-23`, `doctor`, `magrabi`, `taibah` or `manufacturer`.
- `display`: `public` (shown as written), `qualified` (shown in factual, non-comparative wording) or `internal` (kept in the registry only).
- `evidence[]`: documents found, each with its URL.
- `pending`: what is still missing.

Rules applied:
1. **Comparative claims** ("first in Madinah or Saudi Arabia", "pioneer", "one of the first") are not published until documentary evidence exists.
   - The same item is published as a dated fact ("... in Madinah since 2010").
   - The original stays in the registry. The change is recorded in `FIRST_IN_REGION_CLAIMS.md`, not made silently.
2. **Positioning statements** (A03, A16) stay internal; the concrete items are shown instead.
3. **Publications** are linked only after they are found in PubMed with his name and affiliation. Unverified claimed papers render nothing.
4. **Personal remarks** (L01, "despite his reluctance") stay internal.
5. **Medications, doses and routes** that were not supplied are never added (A12, A13).
6. **Devices** are described only from the makers' official pages. Introducing a device is never presented as inventing it.
7. **Photographs** are published only with documented permission, stripped metadata and, for operating-room photos, a privacy review (`isPublishablePhoto`).
8. **Nothing here is a clinical approval.** New educational content is marked as pending Dr. Maan's review.

Items from this brief carry the on-page tag "Provided by Dr. Maan via the site owner".
