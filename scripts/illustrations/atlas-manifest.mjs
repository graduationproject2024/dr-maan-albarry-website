// Builds public/images/procedures/manifest.json from the render results (atlas.mjs) and the editorial metadata
// (atlas-meta.mjs). Results from earlier runs are kept for shots not re-rendered in this run.
import { META, REFS, VERSION, VERSION_R1, CHANGED, ESSENTIAL } from './atlas-meta.mjs';
import { STRUCTURES } from './src/atlas/structures.js';
import { CAMERAS } from './src/atlas/cameras.js';

export function buildManifest(shots, results, prev) {
  const prevById = Object.fromEntries((prev?.assets || []).map((a) => [a.assetId, a]));
  const assets = shots.map((s) => {
    const m = META[s.id];
    if (!m) throw new Error(`no metadata for ${s.id}`);
    for (const k of m.refs) if (!REFS[k]) throw new Error(`unknown ref ${k} in ${s.id}`);
    for (const lang of ['en', 'ar']) if ([...m.alt[lang]].length > 160) throw new Error(`${s.id} alt.${lang} is ${[...m.alt[lang]].length} chars`);
    const r = results[s.id] || prevById[s.id];
    if (!r) return null;
    const ess = ESSENTIAL[s.id] || [];
    if (s.level === 'L2' && ess.length > 4) throw new Error(`${s.id}: at most 4 essential labels on an L2 hero`);
    const anchors = (r.anchors || r.labelAnchors).map((a) => { const st = STRUCTURES[a.structure || a.id]; return { ...a, en: st?.en, ar: st?.ar, plain: st?.plain || null, essential: ess.includes(a.id) }; });
    for (const id of ess) if (!anchors.some((a) => a.id === id)) throw new Error(`${s.id}: essential label ${id} has no anchor`);
    return {
      assetId: s.id,
      procedure: s.slug,
      level: s.level,
      master: { width: s.W, height: s.H, aspect: s.level === 'L1' ? '4:5' : s.level === 'L2' ? '16:9' : '4:3' },
      camera: s.camera,
      cameraSpec: r.cameraSpec || r.camera,
      files: r.files,
      anchorsFile: `images/procedures/atlas/${s.id}.anchors.json`,
      labelAnchors: anchors,
      structures: m.structures.map((id) => ({ id, en: STRUCTURES[id]?.en, ar: STRUCTURES[id]?.ar })),
      references: m.refs.map((k) => ({ key: k, citation: REFS[k] })),
      knownSimplifications: m.simplifications,
      alt: m.alt,
      caption: m.caption,
      questionsForDrMaan: m.questions,
      version: CHANGED[s.id] ? VERSION : VERSION_R1,
      changeNote: CHANGED[s.id] || null,
      reApprovalNeeded: Boolean(CHANGED[s.id]),
      essentialLabelsReview: 'pending physician review',
      reviewStatus: 'pending',
      reviewer: null,
      reviewedOn: null,
      approval: 'not approved',
      licence: 'Original procedural three.js render made for this site; no third-party models, textures or photographs.'
    };
  }).filter(Boolean);
  for (const a of assets) for (const id of a.structures.map((x) => x.id).concat(a.labelAnchors.map((x) => x.structure))) if (!STRUCTURES[id]) throw new Error(`unknown structure ${id}`);
  return {
    name: 'Dr. Maan Albarry — anatomical atlas image library',
    version: VERSION,
    generated: new Date().toISOString().slice(0, 10),
    generator: 'node scripts/illustrations/atlas.mjs',
    medicalReview: 'NONE. No physician has reviewed these images. Every asset is reviewStatus "pending" and approval "not approved" until Dr. Maan Albarry reviews it.',
    labelLevels: 'labelAnchors[].essential marks the labels shown by default (at most 4 on L2, 1 or 2 on L1); the rest are one tap away under "Show all labels". labelAnchors[].plain is the patient wording shown in the key. Both are proposals pending physician review.',
    levels: {
      L1: 'Homepage / card preview, 4:5, 480/800/1200 px wide, ≤120 KB',
      L2: 'Procedure-page hero, 16:9, 640/1024/1600/2400 px wide (1600 ≤250 KB), JPEG fallback 1024/1600',
      L3: 'Close-up of the structures the procedure acts on, 4:3, 640/1024/1600 px wide, ≤150 KB',
      L4: 'Interactive: only the existing cataract 3D simulator (no new simulators).'
    },
    backgrounds: { transparent: 'WebP with alpha; place on any surface', neutral: 'WebP/JPEG on the series warm off-white (#FBF8F3 → #F1EBE2)' },
    labelAnchorCoordinates: 'x, y normalised to the image frame (0,0 = top-left), identical for every size and background; projected from 3D eye coordinates through the shot camera',
    cameras: CAMERAS,
    legacy: 'The 1600 × 1000 card files images/procedures/<slug>[-dark][-800].webp used by the current pages are kept and re-rendered by scripts/illustrations/render.mjs.',
    assets
  };
}
