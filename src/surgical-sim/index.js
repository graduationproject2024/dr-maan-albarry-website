// Procedure simulators — public entry. One shared engine (core/engine.js) and one lazily loaded definition per
// procedure. Each definition is its own small chunk; three.js and the engine are shared with the cataract simulator.
//
//   mount(host, { procedure, lang, theme, reducedMotion, variant?, autoplay?, debug? }) → controller
//   controller: play pause resume seek setStage nextStage previousStage reset setVariant setLang setTheme
//               setQuality setCameraMode setSection setOption showAnatomy hideAnatomy getState getReviewMetadata on destroy
import { mountEngine, counters, ENGINE_VERSION, reviewMetadata } from './core/engine.js';

export const PROCEDURES = {
  'lens-implants': () => import('./procedures/iol.js'),
  icl: () => import('./procedures/icl.js'),
  'laser-vision-correction': () => import('./procedures/laser.js'),
  'keratoconus-cxl': () => import('./procedures/keratoconus-cxl.js'),
  'corneal-transplant': () => import('./procedures/corneal-transplant.js'),
  'intravitreal-injections': () => import('./procedures/intravitreal.js')
};

export const hasProcedure = (slug) => Object.prototype.hasOwnProperty.call(PROCEDURES, slug);
export { counters, ENGINE_VERSION };

export async function loadDefinition(slug) {
  if (!hasProcedure(slug)) throw new Error(`no simulator for "${slug}"`);
  return (await PROCEDURES[slug]()).default;
}

export async function mount(host, options = {}) {
  const def = await loadDefinition(options.procedure);
  return mountEngine(host, def, options);
}

/** Review metadata for every procedure and variant (used by the review-queue export and the tests). */
export async function allReviewMetadata() {
  const out = [];
  for (const slug of Object.keys(PROCEDURES)) {
    const def = await loadDefinition(slug);
    for (const v of def.variants ? def.variants.map((x) => x.id) : [null]) out.push(reviewMetadata(def, v));
  }
  return out;
}
