// Writes the image part of the physician review queue from public/images/procedures/manifest.json, so the queue
// can never drift from what the site shows. Run: node scripts/clinical-queue.mjs > <file>. Approves nothing.
import fs from 'node:fs';
const m = JSON.parse(fs.readFileSync('public/images/procedures/manifest.json', 'utf8'));
const out = [];
const esc = (t) => String(t ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const assets = m.assets;
const changed = assets.filter((a) => a.reApprovalNeeded);
out.push(`Source: \`public/images/procedures/manifest.json\` (${m.version || ''}). ${assets.length} images; ${changed.length} changed since any earlier look and marked for re-approval. Every image: review status \`${[...new Set(assets.map((a) => a.reviewStatus))].join(', ')}\`, approval \`${[...new Set(assets.map((a) => a.approval))].join(', ')}\`.`);
out.push('');
out.push('### A. Images (decision per image: approve / approve with changes / reject)');
out.push('');
out.push('| # | Image | Level | Version | Re-approval | Shown by default | Behind "Show all labels" | Decision |');
out.push('|---|---|---|---|---|---|---|---|');
assets.forEach((a, i) => {
  const ess = a.labelAnchors.filter((l) => l.essential).map((l) => l.plain?.en || l.en).join('; ');
  const rest = a.labelAnchors.filter((l) => !l.essential).map((l) => l.plain?.en || l.en).join('; ');
  out.push(`| ${i + 1} | \`${a.assetId}\` | ${a.level} | ${a.version} | ${a.reApprovalNeeded ? '**yes**' : 'no'} | ${esc(ess)} | ${esc(rest) || '—'} | pending |`);
});
out.push('');
out.push('### B. Plain-language terms (decision per term: accept / change to …)');
out.push('');
const terms = new Map();
for (const a of assets) for (const l of a.labelAnchors) if (l.plain && l.plain.en && l.plain.en !== l.en) terms.set(l.en, { plainEn: l.plain.en, plainAr: l.plain.ar, ar: l.ar, used: (terms.get(l.en)?.used || 0) + 1 });
out.push(`${terms.size} medical terms are shown to patients in plainer words. The medical term stays in brackets where space allows.`);
out.push('');
out.push('| # | Medical term (EN) | Patient wording (EN) | Medical term (AR) | Patient wording (AR) | Images | Decision |');
out.push('|---|---|---|---|---|---|---|');
[...terms.entries()].forEach(([en, t], i) => out.push(`| ${i + 1} | ${esc(en)} | ${esc(t.plainEn)} | ${esc(t.ar)} | ${esc(t.plainAr)} | ${t.used} | pending |`));
out.push('');
out.push('### C. Per image: what changed, known simplifications, questions, references');
out.push('');
for (const a of assets) {
  out.push(`#### \`${a.assetId}\`${a.reApprovalNeeded ? ' — re-approval needed' : ''}`);
  out.push('');
  out.push(`- Caption (EN): ${esc(a.caption?.en)}`);
  if (a.changeNote?.length) out.push(`- Changed: ${esc([].concat(a.changeNote).join(' '))}`);
  out.push(`- Known simplifications: ${esc((a.knownSimplifications || []).join(' · '))}`);
  if (a.questionsForDrMaan?.length) out.push(`- Questions for Dr. Maan: ${a.questionsForDrMaan.map((q, k) => `(${k + 1}) ${esc(q)}`).join(' ')}`);
  out.push(`- References: ${[...new Set((a.references || []).map((r) => r.key))].join(', ')}`);
  out.push('');
}
const refs = new Map();
for (const a of assets) for (const r of a.references || []) refs.set(r.key, r.citation);
out.push('### D. Reference list');
out.push('');
for (const [k, c] of [...refs.entries()].sort()) out.push(`- **${k}**: ${esc(c)}`);
console.log(out.join('\n'));
