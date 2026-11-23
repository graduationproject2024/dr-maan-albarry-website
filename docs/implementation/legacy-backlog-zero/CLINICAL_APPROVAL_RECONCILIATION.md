# Clinical approval reconciliation

- **Owner-communicated approval** (2026-11-17, in chat): Dr. Maan reviewed the existing medical information and data, raised no objections and authorized development to continue. Recorded in `release-status.json → medicalReview.ownerCommunicated` and `phase-2-advanced-clinical-visualization/CLINICAL_REVIEW_PROVENANCE.md`.
- **Item-level evidence:** none supplied (no signature, session file or item decision). Item statuses stay "pending" (27 atlas images, 2 text sets, 2 simulator models); `npm run release:check` passes because no approval is claimed without a reviewer and date.
- **This milestone's changes:** no medically meaningful change. The motion layer does not touch the 3D surgical timeline, the anatomy, the optics model or any medical text; model versions unchanged (`csim-anatomy-2026.11-r2`, `vsim-optics-2026.11-r1`).
- **Trello #22** (physician review) is classified BLOCKED — EXTERNAL for item-level sign-off; the owner's general approval is recorded on it, not converted into item approvals.
