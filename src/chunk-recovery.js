// Recovery helpers for lazily loaded chunks (vision simulator, Lens Lab, picture code).
//
// Failure this addresses (06_LENS_LAB_FINAL_RECOVERY.md, path F1): after a deploy, a page that was opened — or served
// from a cache — before the deploy still references the OLD hashed chunk names. Those files no longer exist, so every
// dynamic import 404s, and a plain "Try again" retries the same dead URL forever. When a chunk fails we ask the server
// for the current HTML of this page (no-store); if it points at a different entry script, this tab is running a stale
// build and ONE reload brings the visitor the current one. A sessionStorage guard keyed on the new build prevents a
// reload loop if the new build fails too.

const ENTRY_RE = /\/assets\/index-[\w-]+\.js/;
const GUARD_KEY = 'stale-build-reload';
/** The HTML check must not wait on the same stalled connection that made the chunk fail: give up after this. */
const CHECK_TIMEOUT_MS = 4000;

/** True for the errors browsers / Vite raise when a script or CSS chunk cannot be fetched or evaluated. */
export function isChunkError(err) {
  const m = String((err && (err.message || err)) || '');
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|Failed to fetch|Load failed|NetworkError|ChunkLoadError|chunk-timeout/i.test(m);
}

/** Rejects with a recognisable error when `promise` takes longer than `ms` (the promise itself keeps running). */
export function withTimeout(promise, ms) {
  if (!(ms > 0) || !Number.isFinite(ms)) return promise;
  let id;
  const timer = new Promise((_, reject) => {
    id = setTimeout(() => { const e = new Error(`chunk-timeout after ${ms} ms`); e.timeout = true; reject(e); }, ms);
  });
  return Promise.race([promise, timer]).finally(() => clearTimeout(id));
}

function currentEntry() {
  const s = [...document.querySelectorAll('script[type="module"][src]')].map((e) => e.getAttribute('src')).find((src) => ENTRY_RE.test(src));
  const m = s && s.match(ENTRY_RE);
  return m ? m[0] : null;
}

/** The entry script the server now sends for this page, or null when it cannot tell (offline, no match). */
export async function serverEntry() {
  const ctl = typeof AbortController === 'function' ? new AbortController() : null;
  const id = setTimeout(() => ctl && ctl.abort(), CHECK_TIMEOUT_MS);
  try {
    const res = await withTimeout(fetch(location.pathname + location.search, { cache: 'no-store', credentials: 'same-origin', signal: ctl ? ctl.signal : undefined }), CHECK_TIMEOUT_MS + 100);
    if (!res.ok) return null;
    const m = (await withTimeout(res.text(), CHECK_TIMEOUT_MS)).match(ENTRY_RE);
    return m ? m[0] : null;
  } catch { return null; } finally { clearTimeout(id); }
}

/**
 * After a chunk failure: reload once when this tab runs an older build than the server. Resolves true when a reload
 * was started (the caller should show nothing more), false otherwise (show the normal retry / static fallback).
 */
export async function recoverStaleBuild(err) {
  if (!isChunkError(err) || typeof location === 'undefined') return false;
  const mine = currentEntry();
  if (!mine) return false;
  const theirs = await serverEntry();
  if (!theirs || theirs === mine) return false;
  try {
    if (sessionStorage.getItem(GUARD_KEY) === theirs) return false; // already reloaded for this build once
    sessionStorage.setItem(GUARD_KEY, theirs);
  } catch { return false; } // no storage: cannot guard against a loop, so do not reload
  location.reload();
  return true;
}
