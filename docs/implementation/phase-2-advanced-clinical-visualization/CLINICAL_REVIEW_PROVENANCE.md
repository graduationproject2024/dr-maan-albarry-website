# Clinical review provenance

## Owner-communicated approval

| Field | Value |
|---|---|
| Statement | "Dr. Maan has reviewed the existing medical information and data, raised no objections, and authorized the project to continue." (owner's words, summarised from the Phase 2 brief) |
| Communicated by | the owner, in chat |
| Date | 2026-11-17 |
| Scope | existing medical information and data on the live site (`9e1773f`); authorization to continue development |
| Not covered | deployment of new work; Phase 2 changes; any new medical content |
| Per-item evidence | none supplied (no signature, session file or item-level decision) |

Recorded in `release-status.json` → `medicalReview.ownerCommunicated`.

## What was not changed

Item statuses stay "pending" (27 atlas images, 2 text sets, 2 simulator models). They were not changed to physician-signed, because no item-level evidence exists. `npm run release:check` passes: no approval is claimed without a reviewer and a date.

## Effect on Phase 2 work

Development continued without asking again whether existing content was reviewed. Review tools (cataract and vision review modes, model versions, re-approval flags, exports) are unchanged and remain excluded from the public build (404 on the live site).
