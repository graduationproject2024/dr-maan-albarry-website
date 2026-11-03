// The seven procedure compositions. Each module exports a function (ctx) => composition (see main.js).
import cataract from './cataract.js';
import laser from './laser.js';
import icl from './icl.js';
import cxl from './cxl.js';
import transplant from './transplant.js';
import injection from './injection.js';
import implants from './implants.js';

export const SLUGS = ['cataract-surgery', 'lens-implants', 'laser-vision-correction', 'icl', 'keratoconus-cxl', 'corneal-transplant', 'intravitreal-injections'];

export const SCENES = {
  'cataract-surgery': cataract,
  'lens-implants': implants,
  'laser-vision-correction': laser,
  'icl': icl,
  'keratoconus-cxl': cxl,
  'corneal-transplant': transplant,
  'intravitreal-injections': injection
};
