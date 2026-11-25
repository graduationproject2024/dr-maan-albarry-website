// Release state report (final stabilization, section 9.2). Run: `npm run release:check` (CI runs it on every build).
//
// A release has four separate states. Only the first can be decided by software:
//   1. Engineering readiness   — the CI checks (type check, build, gate tests). Automatic.
//   2. Visual QA readiness     — a person has looked at the pages. Recorded in release-status.json.
//   3. Medical content review  — Dr. Maan's decisions. Read from the content files; NEVER set by this script or by CI.
//   4. Deployment authorization — the owner's instruction for this commit. Recorded in release-status.json.
//
// What this script enforces (exit code 1):
//   - no clinical item may claim approval without a named reviewer and a date (no fabricated approvals);
//   - an item whose content changed after its review (reApprovalNeeded) may not be marked approved;
//   - release-status.json may not claim medical review "complete" while any item is still pending or draft.
// What it only reports: the pending clinical queue, the model versions, and the two human states.
// Pending clinical items do NOT block a deployment by themselves: the site shows them as educational material
// "pending physician review", which is the owner's standing decision. They block any claim of clinical approval.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const imp = (rel) => import(pathToFileURL(path.join(root, rel)).href);
const problems = [];
const items = [];
const APPROVED = /^(approved|reviewed|validated|signed[- ]?off)$/i;
const isApproved = (s) => APPROVED.test(String(s || ''));

function record(group, id, status, { reviewer = null, reviewedOn = null, reApprovalNeeded = false } = {}) {
  items.push({ group, id, status: String(status || 'unknown'), reviewer, reviewedOn, reApprovalNeeded });
  if (isApproved(status)) {
    if (!reviewer || !reviewedOn) problems.push(`${group} / ${id}: marked "${status}" without a reviewer name and a date`);
    if (reApprovalNeeded) problems.push(`${group} / ${id}: marked "${status}" but its content changed after the review (reApprovalNeeded)`);
  }
}

// 1. anatomical atlas
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/images/procedures/manifest.json'), 'utf8'));
for (const a of manifest.assets) {
  // either field claiming approval counts as a claim
  const status = isApproved(a.approval) ? a.approval : a.reviewStatus;
  record('Anatomical atlas', a.assetId, status, { reviewer: a.reviewer || null, reviewedOn: a.reviewedOn || null, reApprovalNeeded: !!a.reApprovalNeeded });
}
// 2. written clinical content
for (const [name, rel] of [['Procedure pages (text)', 'src/procedures/content.js'], ['Lens Lab (text and levels)', 'src/lens-lab/content.js']]) {
  const mod = await imp(rel);
  const r = mod.REVIEW || {};
  record('Written content', name, r.status, { reviewer: r.reviewer, reviewedOn: r.reviewedOn });
}
// 3. simulators: no approval is stored in the repository; a physician's exported review file is the evidence
const { VISION_MODEL_VERSION } = await imp('src/vision-sim/optics/params.js');
const anatomy = fs.readFileSync(path.join(root, 'src/cataract-sim/anatomy.js'), 'utf8');
const CSIM_MODEL_VERSION = (anatomy.match(/MODEL_VERSION = '([^']+)'/) || [])[1] || 'unknown';
record('Simulators', `Vision simulator optics model ${VISION_MODEL_VERSION}`, 'pending');
record('Simulators', `Cataract 3D anatomy and stages ${CSIM_MODEL_VERSION}`, 'pending');

// 4. the two human states
const statusPath = path.join(root, 'release-status.json');
const human = fs.existsSync(statusPath) ? JSON.parse(fs.readFileSync(statusPath, 'utf8')) : {};
const pending = items.filter((i) => !isApproved(i.status));
const claim = String(human.medicalReview?.status || 'pending');
if (/^(complete|approved)$/i.test(claim) && pending.length) problems.push(`release-status.json says the medical review is "${claim}" but ${pending.length} clinical items are still pending`);
if (/^(complete|approved)$/i.test(claim) && !(human.medicalReview?.reviewer && human.medicalReview?.date)) problems.push('release-status.json: a complete medical review needs the reviewer and the date');

const groups = [...new Set(items.map((i) => i.group))];
const lines = [];
lines.push('## Release state');
lines.push('');
lines.push('| State | Value | Decided by |');
lines.push('|---|---|---|');
lines.push(`| Engineering readiness | see the checks of this run | CI (automatic) |`);
lines.push(`| Visual QA readiness | ${human.visualQa?.status || 'not recorded'}${human.visualQa?.by ? ` — ${human.visualQa.by}, ${human.visualQa.date || ''}` : ''} | a person |`);
lines.push(`| Medical content review | ${pending.length ? `PENDING — ${pending.length} of ${items.length} items not reviewed` : 'all items reviewed'} | Dr. Maan only |`);
lines.push(`| Deployment authorization | ${human.deployment?.authorizedCommit ? `owner authorized ${human.deployment.authorizedCommit} on ${human.deployment.date || '?'}` : 'not recorded for this commit'} | the owner |`);
lines.push('');
lines.push('### Clinical review queue');
lines.push('');
lines.push('| Group | Items | Pending | Changed since review |');
lines.push('|---|---|---|---|');
for (const g of groups) {
  const li = items.filter((i) => i.group === g);
  lines.push(`| ${g} | ${li.length} | ${li.filter((i) => !isApproved(i.status)).length} | ${li.filter((i) => i.reApprovalNeeded).length} |`);
}
lines.push('');
lines.push(problems.length ? `### Problems (${problems.length})\n\n${problems.map((p) => `- ${p}`).join('\n')}` : 'No approval is claimed without evidence.');
lines.push('');
lines.push('Passing automated tests is not medical approval. Pending items are published only as educational material marked "pending physician review".');
const report = lines.join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
if (process.argv.includes('--json')) fs.writeFileSync(path.join(root, 'test-results', 'release-state.json'), JSON.stringify({ items, problems, human }, null, 1));
process.exit(problems.length ? 1 : 0);
