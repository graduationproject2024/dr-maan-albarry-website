// Shared clinical-review workflow for the simulators (cataract surgery + vision). Used only by the review
// panels, which load only when a simulator is mounted with { review: true } (internal harness pages).
//
// RULES THIS MODULE ENFORCES
//  - Every gate starts as "pending". A gate changes ONLY through setGate(), which the panels call from the
//    reviewer's own click / key press. Nothing here infers, pre-fills or upgrades a status.
//  - A gate records the model version and the content hash of the item at the moment the reviewer set it.
//    When either changes, the item is flagged "needs re-review"; the old record is kept, never deleted.
//  - Final physician approval cannot be set to an approving state while any clinical gate is pending,
//    rejected or recorded against an older version (finalGuard()).
//  - A browser-saved or exported review is a working note. It is NOT an official approval: the only official
//    record is a signed entry placed by the physician in
//    docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md.
// Pure module (importable from Node); the panels import ./styles.css themselves.

export const CLINICAL_STATES = Object.freeze(['pending', 'approved', 'approved-with-corrections', 'rejected']);
export const ENGINEERING_STATES = Object.freeze(['pending', 'verified', 'failed']);
const APPROVING = new Set(['approved', 'approved-with-corrections', 'verified']);
export const isApproving = (s) => APPROVING.has(s);

export const NOT_OFFICIAL_APPROVAL = Object.freeze({
  en: 'Working notes exported from a browser review session. This file is NOT an official clinical approval, carries no signature and names no reviewer. The only official record is a signed entry placed by the physician in docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md.',
  ar: 'ملاحظات عمل مُصدَّرة من جلسة مراجعة في المتصفح. هذا الملف ليس اعتمادًا سريريًا رسميًا، ولا يحمل توقيعًا ولا يذكر اسم مراجع. السجل الرسمي الوحيد هو إدخال موقَّع يضعه الطبيب في الملف docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md.'
});

// ---------- hashing (content versions) ----------
/** FNV-1a 32-bit hash of a string, as 8 hex digits. Not cryptographic: it only detects change. */
export function hashString(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, '0');
}
/** JSON with numbers rounded to 4 decimals, so tiny floating-point noise cannot change a hash. */
export function stableStringify(v) {
  return JSON.stringify(v, (_k, x) => {
    if (typeof x === 'number') return Number.isFinite(x) ? Number(x.toFixed(4)) + 0 : String(x);
    if (typeof x === 'function') return undefined;
    return x;
  });
}
export const contentHash = (prefix, value) => `${prefix}-${hashString(stableStringify(value))}`;

// ---------- sanitising ----------
export const str = (v, max = 200) => (typeof v === 'string' ? v.slice(0, max) : null);
export const num = (v, fallback = null) => (Number.isFinite(v) ? v : fallback);

// ---------- gates ----------
export function emptyGate() {
  return { status: 'pending', modelVersion: null, contentHash: null, setAt: null };
}
/** Accepts only well-formed data; an unknown status becomes "pending" — never an approval. */
export function normaliseGate(raw, states) {
  if (!raw || typeof raw !== 'object') return emptyGate();
  return {
    status: states.includes(raw.status) ? raw.status : 'pending',
    modelVersion: str(raw.modelVersion, 120),
    contentHash: str(raw.contentHash, 120),
    setAt: str(raw.setAt, 40)
  };
}
export function normaliseHistory(raw, gateIds, statesFor) {
  if (!Array.isArray(raw)) return [];
  return raw.filter((h) => h && typeof h === 'object' && gateIds.includes(h.gate)).slice(-500).map((h) => ({
    gate: h.gate,
    ...normaliseGate(h, statesFor(h.gate)),
    supersededAt: str(h.supersededAt, 40)
  }));
}

/** A gate is stale when the reviewer set it (non-pending) against another model version or content hash. */
export function gateIsStale(gate, current) {
  return gate.status !== 'pending' && (gate.modelVersion !== current.modelVersion || gate.contentHash !== current.contentHash);
}
/** Re-review summary of one item: which non-pending gates were recorded against another version. */
export function staleInfo(gates, current) {
  const ids = Object.keys(gates).filter((id) => gateIsStale(gates[id], current));
  const since = [...new Set(ids.map((id) => gates[id].modelVersion || 'unknown'))];
  const hashes = [...new Set(ids.map((id) => gates[id].contentHash || 'unknown'))];
  return { needsReReview: ids.length > 0, gates: ids, sinceModelVersions: since, sinceContentHashes: hashes };
}
/**
 * May the final physician approval be set to an approving state? Only when every clinical gate is approved
 * (or approved with corrections) for the CURRENT version. Returns the reasons when it may not.
 */
export function finalGuard(gates, clinicalIds, current) {
  const reasons = [];
  for (const id of clinicalIds) {
    const g = gates[id];
    if (g.status === 'pending') reasons.push({ gate: id, why: 'pending' });
    else if (g.status === 'rejected') reasons.push({ gate: id, why: 'rejected' });
    else if (gateIsStale(g, current)) reasons.push({ gate: id, why: 'stale', since: g.modelVersion || 'unknown' });
  }
  return { allowed: reasons.length === 0, reasons };
}

/**
 * The ONLY way a gate changes: the reviewer's own action. The previous record goes to history (old
 * evidence is never deleted) and the new one is stamped with the current version and the time of the click.
 */
export function setGate(record, gateId, status, current, now = new Date().toISOString()) {
  const prev = record.gates[gateId];
  if (prev && (prev.status !== 'pending' || prev.setAt)) record.history.push({ gate: gateId, ...prev, supersededAt: now });
  if (record.history.length > 500) record.history.splice(0, record.history.length - 500);
  record.gates[gateId] = { status, modelVersion: current.modelVersion, contentHash: current.contentHash, setAt: now };
}

// ---------- DOM helpers ----------
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function download(name, href) {
  const a = document.createElement('a');
  a.href = href; a.download = name; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
}
export function downloadJSON(name, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  download(name, url);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Replace a panel's markup and put keyboard focus back on the same control (radio, button, field). */
export function renderPreservingFocus(el, html) {
  const a = document.activeElement;
  let sel = null;
  if (a && a !== el && el.contains(a)) {
    if (a.id) sel = `#${CSS.escape(a.id)}`;
    else if (a.dataset && a.dataset.r) sel = `[data-r="${CSS.escape(a.dataset.r)}"]`;
  }
  el.innerHTML = html;
  if (sel) { const n = el.querySelector(sel); if (n) n.focus({ preventScroll: true }); }
}

/**
 * One gate as a native radio group (keyboard: Tab into the group, arrows to move; screen readers announce the
 * group name and state). Options in `disabled` cannot be chosen; `describedBy` points at the reason text.
 */
export function gateFieldset({ uid, gateId, legend, states, labels, value, disabled = [], describedBy = '', flag = '' }) {
  const opts = states.map((s) => {
    const id = `${uid}-${gateId}-${s}`;
    const dis = disabled.includes(s);
    return `<input class="srv-radio" type="radio" name="${uid}-${gateId}" id="${id}" value="${s}" data-gate="${gateId}"${s === value ? ' checked' : ''}${dis ? ' disabled' : ''}${describedBy ? ` aria-describedby="${describedBy}"` : ''}><label for="${id}" class="srv-opt srv-opt--${s}">${esc(labels[s])}</label>`;
  }).join('');
  return `<fieldset class="srv-gate" data-gate-field="${gateId}"><legend>${esc(legend)}${flag}</legend><div class="srv-opts">${opts}</div></fieldset>`;
}
