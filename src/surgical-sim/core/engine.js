// Shared simulation engine for the procedure simulators. One engine, one WebGL context per open viewer; each
// procedure is a declarative definition (procedures/*.js) that builds its scene from the shared anatomical library and
// maps (stage, local progress, variant, options, toggles) → scene state with a pure apply() function. Because the
// scene is a function of the timeline position, pause freezes it exactly, seek rebuilds any moment, and reset is
// seek(0) plus default settings.
//
// Reused from the cataract simulator: renderer/lighting/environment and precompilation (scene.js), timeline,
// playback state machine and adaptive quality + visibility tracking (perf.js).
import * as THREE from 'three';
import { createScene, hasWebGL, maxDpr, precompileScene } from '../../cataract-sim/scene.js';
import { createTimeline } from '../../cataract-sim/timeline.js';
import { createStateMachine } from '../../cataract-sim/state.js';
import { createAdaptiveQuality, observeVisibility } from '../../cataract-sim/perf.js';
import * as lib from '../anatomy/build.js';
import * as geo from '../anatomy/geometry.js';
import { createMaterials, disposeMaterials } from '../anatomy/materials.js';
import { createOrbit } from './orbit.js';
import { createShell } from '../ui/shell.js';
import { contentHash } from '../../sim-review/core.js';

export const ENGINE_VERSION = 'ssim-engine-2026.11-r1';
export const counters = { mounts: 0, destroys: 0, live: 0, renderers: 0, listeners: 0 };

const pick = (v, lang) => (v && typeof v === 'object' ? (v[lang] ?? v.en) : v);

/** Metadata a reviewer needs for one procedure model (also exported to the review queue document). */
export function reviewMetadata(def, variant) {
  const stages = def.stages(variant).map((s) => ({ id: s.id, title: s.title, text: s.text }));
  return {
    modelId: def.modelId, version: def.version, libraryVersion: geo.LIBRARY_VERSION, engineVersion: ENGINE_VERSION,
    procedure: def.slug, variant: variant || null,
    objectives: def.objectives || [], stages, sources: def.sources || [], simplifications: def.simplifications || [],
    engineeringStatus: 'verified-by-automated-tests', visualQa: 'internal', clinicalStatus: 'pending',
    contentHash: contentHash('ssim', { id: def.modelId, v: def.version, variant, stages })
  };
}

export async function mountEngine(host, def, opts = {}) {
  counters.mounts++; counters.live++;
  const offs = [];
  const track = (el, type, fn, o) => { el.addEventListener(type, fn, o); counters.listeners++; return () => { el.removeEventListener(type, fn, o); counters.listeners--; }; };
  const reduced = () => opts.reducedMotion ?? (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const listeners = {};
  const emit = (type, data) => (listeners[type] || []).forEach((fn) => { try { fn(data); } catch (e) { console.warn(e); } });

  const S = {
    lang: opts.lang === 'en' ? 'en' : 'ar', theme: opts.theme === 'dark' ? 'dark' : 'light',
    variant: def.variants ? (def.variants.find((v) => v.id === opts.variant) || def.variants[0]).id : null,
    options: Object.fromEntries((def.options || []).map((o) => [o.id, o.default ?? o.choices[0].id])),
    toggles: Object.fromEntries((def.toggles || []).map((t) => [t.id, t.default !== false])),
    section: false, labels: true, explore: false, expanded: false, playing: false, quality: 'auto',
    index: -1, destroyed: false
  };
  let stages = def.stages(S.variant);
  let tl = createTimeline(stages.map((s) => s.duration));
  const sm = createStateMachine({ debug: !!opts.debug, onChange: (st) => { shell && shell.update(view()); emit('state', st); } });

  let shell = null, ctx = null, orbit = null, model = null, quality = null, unobserve = null, ro = null;
  let raf = 0, last = 0, dirty = true, visible = true;
  const v3 = new THREE.Vector3();

  const view = () => ({
    lang: S.lang, theme: S.theme, state: sm.state, playing: S.playing, index: Math.max(0, S.index), stages, progress: tl.progress,
    variant: S.variant, options: S.options, toggles: S.toggles, section: S.section, labels: S.labels, explore: S.explore, expanded: S.expanded,
    extra: def.extra ? def.extra({ variant: S.variant, options: S.options, index: Math.max(0, S.index), stage: stages[Math.max(0, S.index)] }) : null
  });

  // ---------- UI shell (built first: it is also the non-3D alternative and the WebGL fallback) ----------
  shell = createShell(host, { def, lang: S.lang, theme: S.theme, track, action: (type, v) => act(type, v) });
  sm.to('loading');
  shell.update(view());

  const fallback = (reason) => {
    S.index = 0;
    sm.to('fallback');
    shell.showFallback(reason);
    shell.update(view());
  };

  if (opts.forceFallback || !hasWebGL()) {
    fallback('webgl');
  } else {
    try {
      const canvas = document.createElement('canvas');
      canvas.tabIndex = 0;
      canvas.setAttribute('role', 'img');
      shell.canvasHost.appendChild(canvas);
      ctx = createScene({ canvas, debug: !!opts.debug, theme: S.theme });
      counters.renderers++;
      const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1e4);
      const mats = createMaterials(clipPlane);
      model = def.build({ THREE, lib, geo, mats, scene: ctx.scene });
      model.mats = mats; model.clipPlane = clipPlane;
      ctx.scene.add(model.root);
      orbit = createOrbit(ctx.camera, canvas, { reducedMotion: reduced, track, onChange: () => invalidate(), minR: def.minR ?? 8, maxR: def.maxR ?? 90 });
      quality = createAdaptiveQuality({ initialDpr: maxDpr(), onChange: (dpr) => { ctx.renderer.setPixelRatio(dpr); resize(); } });
      unobserve = observeVisibility(shell.viewport, (v) => { visible = v; if (v) invalidate(); }, {
        observer: () => {}, listen: (el, type, fn) => track(el, type, fn)
      });
      if ('ResizeObserver' in window) { ro = new ResizeObserver(() => resize()); ro.observe(shell.viewport); }
      offs.push(track(canvas, 'webglcontextlost', (e) => { e.preventDefault(); sm.to('error'); shell.setNotice('lost'); }));
      offs.push(track(canvas, 'webglcontextrestored', () => { shell.setNotice(null); sm.to(S.playing ? 'playing' : 'paused'); invalidate(); }));
      resize();
      enterStage(0, true);
      applyTime();
      // compile shaders before the first visible frame (the loading overlay is still up), then show the scene
      await precompileScene(ctx.renderer, ctx.scene, ctx.camera, { alive: () => !S.destroyed });
      if (S.destroyed) return controller();
      sm.to('ready');
      shell.setLoading(false);
      invalidate();
      if (opts.autoplay) play();
    } catch (err) {
      console.warn('[surgical-sim] 3D view unavailable', err);
      teardown3D();
      fallback('error');
    }
  }

  // ---------- rendering ----------
  function resize() {
    if (!ctx) return;
    const w = Math.max(1, shell.canvasHost.clientWidth), h = Math.max(1, shell.canvasHost.clientHeight);
    ctx.renderer.setSize(w, h, false);
    ctx.camera.aspect = w / h;
    ctx.camera.updateProjectionMatrix();
    invalidate();
  }
  function invalidate() { dirty = true; schedule(); }
  function schedule() { if (!raf && !S.destroyed && ctx) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    let busy = false;
    if (S.playing && sm.state !== 'error') {
      const done = tl.advance(dt);
      applyTime();
      busy = true;
      if (done) { S.playing = false; sm.to('completed'); shell.update(view()); emit('complete'); }
      shell.setProgress(tl.progress);
    }
    if (orbit.tick(dt)) busy = true;
    if (dirty || busy) {
      if (visible) {
        ctx.renderer.render(ctx.scene, ctx.camera);
        placeLabels();
        if (S.playing && S.quality === 'auto') quality.tick(now);
      }
      dirty = !visible;
    }
    if ((busy || dirty) && visible) schedule(); else last = 0;
  }

  // ---------- stages and scene state ----------
  function enterStage(i, instant = false) {
    S.index = i;
    const st = stages[i];
    if (st.section !== undefined) setSection(!!st.section, false);
    if (orbit && st.camera && def.cameras[st.camera]) orbit.goTo(def.cameras[st.camera], instant);
    shell.update(view());
    emit('stage', { index: i, id: st.id });
  }
  function applyTime() {
    const loc = tl.locate();
    if (loc.index !== S.index) enterStage(loc.index);
    if (!model) return;
    const st = stages[loc.index];
    model.apply({ stage: st, index: loc.index, p: loc.p, variant: S.variant, options: S.options, toggles: S.toggles, section: S.section, lang: S.lang });
    for (const t of def.toggles || []) if (!S.toggles[t.id]) for (const part of t.parts || []) if (model.parts[part]) model.parts[part].visible = false;
    invalidate();
  }
  function setSection(on, apply = true) {
    S.section = !!on;
    if (model) {
      model.clipPlane.constant = S.section ? 0 : 1e4;
      model.root.traverse((o) => { if (o.name === 'caps') o.visible = S.section; });
      if (apply) applyTime();
    }
    shell.update(view());
  }

  // ---------- labels ----------
  function placeLabels() {
    const items = model && model.labels ? model.labels : [];
    const els = shell.labelEls(items, S.lang);
    const w = shell.canvasHost.clientWidth, h = shell.canvasHost.clientHeight;
    items.forEach((l, k) => {
      const el = els[k];
      const part = l.part ? model.parts[l.part] : null;
      let partVisible = true;
      for (let o = part; o; o = o.parent) if (!o.visible) { partVisible = false; break; }
      const show = S.labels && partVisible && (!l.inner || S.section) && (!l.when || l.when({ stage: stages[S.index], index: S.index, variant: S.variant, section: S.section, options: S.options }));
      if (!show) { el.hidden = true; return; }
      v3.set(l.at[0], l.at[1], l.at[2]);
      if (model.root) v3.applyMatrix4(model.root.matrixWorld);
      v3.project(ctx.camera);
      if (v3.z > 1 || Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05) { el.hidden = true; return; }
      el.hidden = false;
      el.style.transform = `translate(${((v3.x + 1) / 2) * w}px, ${((1 - v3.y) / 2) * h}px)`;
    });
  }

  // ---------- playback ----------
  function play() {
    if (!['ready', 'paused', 'completed', 'playing', 'fallback'].includes(sm.state) || sm.state === 'fallback') return;
    if (tl.progress >= 1) { tl.set(0); applyTime(); }
    S.playing = true; sm.to('playing'); shell.update(view()); schedule();
  }
  function pause() {
    if (!S.playing) return;
    S.playing = false; sm.to('paused'); shell.update(view());
  }
  function seek(t01) {
    tl.seek(Math.max(0, Math.min(1, Number(t01) || 0)));
    if (sm.state === 'fallback') { S.index = tl.locate().index; shell.update(view()); return; }
    applyTime(); shell.setProgress(tl.progress);
    if (!S.playing && sm.state === 'completed' && tl.progress < 1) { sm.to('paused'); shell.update(view()); }
  }
  function setStage(idOrIndex) {
    const i = typeof idOrIndex === 'number' ? idOrIndex : stages.findIndex((s) => s.id === idOrIndex);
    if (i < 0 || i >= stages.length) return;
    // a stage shows its end state when chosen directly (the explanation matches what is on screen)
    const [a, b] = tl.stageRange(i);
    tl.seek(S.playing ? a : a + (b - a) * 0.999);
    if (sm.state === 'fallback') { S.index = i; shell.update(view()); emit('stage', { index: i, id: stages[i].id }); return; }
    if (i === S.index) enterStage(i);
    applyTime(); shell.setProgress(tl.progress);
    if (sm.state === 'completed') { sm.to('paused'); shell.update(view()); }
  }
  function setVariant(id) {
    if (!def.variants || !def.variants.some((v) => v.id === id) || id === S.variant) return;
    const wasPlaying = S.playing;
    S.playing = false;
    S.variant = id;
    stages = def.stages(id);
    tl = createTimeline(stages.map((s) => s.duration));
    S.index = -1;
    if (sm.state !== 'fallback') { if (['playing', 'completed'].includes(sm.state)) sm.to('paused'); applyTime(); } else { S.index = 0; shell.update(view()); }
    shell.setProgress(0);
    emit('variant', id);
    if (wasPlaying) play();
  }
  function reset() {
    S.playing = false;
    S.options = Object.fromEntries((def.options || []).map((o) => [o.id, o.default ?? o.choices[0].id]));
    S.toggles = Object.fromEntries((def.toggles || []).map((t) => [t.id, t.default !== false]));
    tl.set(0);
    if (sm.state === 'fallback') { S.index = 0; shell.update(view()); return; }
    if (['playing', 'completed'].includes(sm.state)) sm.to('paused');
    S.index = -1;
    setSection(false, false);
    applyTime();
    if (orbit) orbit.goTo(def.cameras[stages[0].camera] || Object.values(def.cameras)[0], true);
    shell.setProgress(0); shell.update(view());
  }

  function act(type, v) {
    switch (type) {
      case 'play': return S.playing ? pause() : play();
      case 'pause': return pause();
      case 'prev': return setStage(Math.max(0, S.index - 1));
      case 'next': return setStage(Math.min(stages.length - 1, S.index + 1));
      case 'stage': return setStage(v);
      case 'seek': return seek(v);
      case 'variant': return setVariant(v);
      case 'option': S.options = { ...S.options, [v[0]]: v[1] }; applyTime(); return shell.update(view());
      case 'toggle': S.toggles = { ...S.toggles, [v[0]]: !!v[1] }; applyTime(); return shell.update(view());
      case 'camera': if (orbit && def.cameras[v]) orbit.goTo(def.cameras[v]); schedule(); return undefined;
      case 'section': return setSection(v);
      case 'labels': S.labels = !!v; invalidate(); return shell.update(view());
      case 'explore': S.explore = !!v; if (orbit) orbit.setExplore(S.explore); return shell.update(view());
      case 'expand': S.expanded = !!v; shell.update(view()); return setTimeout(resize, 30);
      case 'zoomIn': return orbit && orbit.zoom(0.85);
      case 'zoomOut': return orbit && orbit.zoom(1.18);
      case 'resetView': return orbit && (orbit.goTo(def.cameras[stages[Math.max(0, S.index)].camera] || Object.values(def.cameras)[0]), schedule());
      case 'reset': return reset();
      case 'close': emit('close'); return undefined;
      default: return undefined;
    }
  }

  function teardown3D() {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (ro) { ro.disconnect(); ro = null; }
    if (unobserve) { unobserve(); unobserve = null; }
    if (orbit) { orbit.dispose(); orbit = null; }
    if (model) { try { model.dispose && model.dispose(); } catch { /* ignore */ } if (model.mats) disposeMaterials(model.mats); model = null; }
    if (ctx) {
      const canvas = ctx.renderer.domElement;
      ctx.dispose();
      try { ctx.renderer.forceContextLoss(); } catch { /* ignore */ }
      canvas.remove();
      ctx = null; counters.renderers--;
    }
  }

  function controller() {
    return {
      mount: undefined,
      play, pause, resume: play, seek, setStage, reset, setVariant,
      nextStage: () => act('next'), previousStage: () => act('prev'),
      setLang(l) { S.lang = l === 'en' ? 'en' : 'ar'; shell.setLang(S.lang); shell.update(view()); invalidate(); },
      setLanguage(l) { this.setLang(l); },
      setTheme(t) { S.theme = t === 'dark' ? 'dark' : 'light'; shell.setTheme(S.theme); if (ctx) ctx.setTheme(S.theme); invalidate(); },
      setQuality(level) {
        S.quality = ['low', 'high', 'auto'].includes(level) ? level : 'auto';
        if (ctx) { ctx.renderer.setPixelRatio(S.quality === 'low' ? 1 : S.quality === 'high' ? maxDpr() : quality.dpr); resize(); }
      },
      setCameraMode: (m) => act('camera', m),
      setSection: (on) => act('section', on),
      setOption: (id, val) => act('option', [id, val]),
      showAnatomy: (id) => act('toggle', [id, true]),
      hideAnatomy: (id) => act('toggle', [id, false]),
      getState() {
        const info = ctx ? ctx.renderer.info : null;
        return {
          procedure: def.slug, modelId: def.modelId, version: def.version, state: sm.state, playing: S.playing,
          variant: S.variant, stageIndex: Math.max(0, S.index), stageId: stages[Math.max(0, S.index)].id, stageCount: stages.length,
          progress: tl.progress, elapsed: tl.elapsed, options: { ...S.options }, toggles: { ...S.toggles },
          section: S.section, labels: S.labels, explore: S.explore, expanded: S.expanded,
          camera: orbit ? { ...orbit.spherical, target: orbit.target, moving: orbit.moving } : null,
          dpr: ctx ? ctx.renderer.getPixelRatio() : 0,
          render: info ? { calls: info.render.calls, triangles: info.render.triangles, geometries: info.memory.geometries, textures: info.memory.textures } : null,
          probe: model && model.probe ? model.probe() : null
        };
      },
      getReviewMetadata: () => reviewMetadata(def, S.variant),
      on(type, fn) { (listeners[type] ||= []).push(fn); return () => { listeners[type] = listeners[type].filter((f) => f !== fn); }; },
      destroy() {
        if (S.destroyed) return;
        S.destroyed = true;
        teardown3D();
        offs.forEach((off) => off()); offs.length = 0;
        shell.destroy();
        counters.destroys++; counters.live--;
      }
    };
  }
  return controller();
}
