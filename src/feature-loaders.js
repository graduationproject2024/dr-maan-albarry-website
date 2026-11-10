// ============================================================
// FEATURE LOADERS — lazy, optional interactive modules built by other workstreams.
//
//   src/lens-lab/index.js       mount(host, { lang, theme, reducedMotion })            → controller
//   src/light-journey/index.js  mount(host, { lang, theme, reducedMotion, linkFor })   → controller
//   controller = { destroy, setLang, setTheme, getState, on }
//
// import.meta.glob() resolves at build time to only the files that exist, so a module that has not landed yet
// never breaks the build: hasFeature() is false and the page shows its static "coming soon" summary instead.
//
// Mount pattern (same as the vision simulator in main.js):
//   • the module renders into a host <div> owned by this file and kept OUTSIDE the page markup, so a re-render
//     of #app (language switch, theme) re-attaches the same live host instead of destroying the module;
//   • it mounts only when its slot nears the viewport (IntersectionObserver, 400 px margin);
//   • while a mount is expected the slot reserves its height (data-reserve → CSS min-height), so nothing below
//     shifts; prerendered/no-JS pages and failed loads drop the reservation (BUG-09 / BUG-10) and keep the
//     static summary visible, with a retry button on failure;
//   • setLang / setTheme are forwarded; leaving the page destroys the module.
// ============================================================

const MODULES = import.meta.glob(['./lens-lab/index.js', './light-journey/index.js']);

export const FEATURE_PATHS = {
  'lens-lab': './lens-lab/index.js',
  'light-journey': './light-journey/index.js'
};

/** True when the module exists in this build. */
export const hasFeature = key => typeof MODULES[FEATURE_PATHS[key]] === 'function';

/** Import a feature module (rejects when it is not part of this build). */
export function loadFeature(key) {
  const loader = MODULES[FEATURE_PATHS[key]];
  return loader ? loader() : Promise.reject(new Error(`feature "${key}" is not available in this build`));
}

/**
 * One lazily mounted feature for the lifetime of the app.
 *   key        'lens-lab' | 'light-journey'
 *   slotId     id of the element in the page markup that receives the host (carries data-*-host + data-reserve)
 *   options    () => mount options (lang, theme, reducedMotion, linkFor, …) read at mount time
 *   messages   () => { error, retry } in the current language
 *   enabled    () => may this page start the module (section-registry.js `features`)? When false nothing is downloaded
 */
export function createFeatureMount({ key, slotId, options, messages, load = loadFeature, enabled = () => true }) {
  const st = { host: null, ctrl: null, loading: false, io: null, failed: false, token: 0 };
  const slot = () => document.getElementById(slotId);
  const wrap = () => slot()?.closest('.feature') || null;
  const mark = () => {
    const w = wrap();
    if (!w) return;
    w.classList.toggle('is-mounted', Boolean(st.ctrl));
    w.classList.toggle('is-loading', st.loading);
    w.classList.toggle('is-failed', st.failed);
  };

  function showError() {
    st.failed = true;
    const s = slot();
    if (s) s.removeAttribute('data-reserve');
    mark();
    if (!st.host) return;
    const m = messages();
    st.host.innerHTML = `<div class="feature-status" role="status"><p>${m.error}</p><button type="button" class="btn btn-quiet" data-feature-retry>${m.retry}</button></div>`;
    st.host.querySelector('[data-feature-retry]').addEventListener('click', () => {
      const s2 = slot();
      if (s2) s2.setAttribute('data-reserve', '');
      st.host.innerHTML = '';
      st.failed = false;
      load_();
    });
  }

  async function load_() {
    if (st.loading || st.ctrl) return;
    st.loading = true; mark();
    const token = ++st.token;
    try {
      const mod = await load(key);
      if (token !== st.token || !st.host || !st.host.isConnected) return; // visitor left the page while it loaded
      st.host.innerHTML = '';
      const ctrl = await mod.mount(st.host, options());
      if (token !== st.token || !st.host || !st.host.isConnected) { try { ctrl && ctrl.destroy && ctrl.destroy(); } catch (e) { /* ignore */ } return; }
      st.ctrl = ctrl;
      const o = options();
      try { ctrl.setLang && ctrl.setLang(o.lang); ctrl.setTheme && ctrl.setTheme(o.theme); } catch (e) { /* module handles its own errors */ }
      st.failed = false;
      const s = slot();
      if (s) s.removeAttribute('data-reserve'); // the module now sizes itself
    } catch (err) {
      console.warn(`${key} failed to load`, err);
      showError();
    } finally { st.loading = false; mark(); }
  }

  return {
    get controller() { return st.ctrl; },
    /** Attach to the slot of the current render (or tear down when the page no longer has one). */
    sync() {
      const s = slot();
      if (!s) { this.destroy(); return; }
      if (!enabled() || (!hasFeature(key) && load === loadFeature)) { s.removeAttribute('data-reserve'); return; }
      if (!st.host) { st.host = document.createElement('div'); st.host.className = 'feature-host-inner'; }
      if (st.host.parentNode !== s) s.appendChild(st.host); // survive #app re-renders
      if (st.ctrl) {
        s.removeAttribute('data-reserve');
        const o = options();
        try { st.ctrl.setLang && st.ctrl.setLang(o.lang); st.ctrl.setTheme && st.ctrl.setTheme(o.theme); } catch (e) { /* ignore */ }
        mark();
        return;
      }
      if (st.loading) { mark(); return; }
      if (st.failed) { showError(); return; } // re-render in the new language; retry stays one tap away
      if (st.io) st.io.disconnect();
      st.io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        st.io.disconnect(); st.io = null;
        load_();
      }, { rootMargin: '400px 0px' });
      st.io.observe(s);
      mark();
    },
    setTheme(theme) { if (st.ctrl && st.ctrl.setTheme) { try { st.ctrl.setTheme(theme); } catch (e) { /* ignore */ } } },
    setLang(lang) { if (st.ctrl && st.ctrl.setLang) { try { st.ctrl.setLang(lang); } catch (e) { /* ignore */ } } },
    destroy() {
      st.token++;
      if (st.io) { st.io.disconnect(); st.io = null; }
      if (st.ctrl) { try { st.ctrl.destroy(); } catch (e) { /* module handles its own errors */ } st.ctrl = null; }
      if (st.host) { st.host.remove(); st.host = null; }
      st.failed = false; st.loading = false;
    }
  };
}
