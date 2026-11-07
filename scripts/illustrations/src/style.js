// One shared visual language for every procedure illustration: camera, palette, line weight, backgrounds.

export const OUT_W = 1600;
export const OUT_H = 1000;
export const SS = 2; // supersampling factor of the WebGL render (3200 x 2000, downsampled to 1600 x 1000)

// Resolution controls for the atlas renderer (scripts/illustrations/atlas.mjs). The legacy 1600 x 1000 render keeps
// both at 1. `ppm` scales every painted cut-face canvas (and the fundus map) so a zoomed or larger frame keeps
// one canvas pixel per render pixel; `ink` scales painted line widths so ink stays 2.1 px per 1600 px of output.
export const RES = { ppm: 1, ink: 1, tex: 1 };

// One light rig for the whole series, in camera space ([right, up, towards-viewer]): a warm key light from the
// upper left, a cool fill from the right, a rim light from behind and a soft warm/grey hemisphere.
export const LIGHT_RIG = {
  hemi: { sky: 0xfffaf2, ground: 0xb4aea6, i: 1.15 },
  dirs: [
    { color: 0xfff4e6, i: 2.1, v: [-0.55, 0.62, 0.56] },
    { color: 0xe4edf6, i: 0.6, v: [0.75, -0.15, 0.45] },
    { color: 0xffffff, i: 0.75, v: [0.25, 0.55, -0.8] }
  ]
};

// Line weight of the ink outlines, in output pixels at 1600 px width.
export const INK_PX = 2.1;

export const BG = {
  light: { inner: '#FBF8F3', outer: '#F1EBE2' },
  dark: { inner: '#23262B', outer: '#14161A' }
};

// Section (cut-face) palette, sRGB.
export const C = {
  ink: 'rgba(56, 42, 36, 0.66)',
  inkSoft: 'rgba(56, 42, 36, 0.32)',
  sclera: '#EEE6D9',
  scleraShade: 'rgba(146, 116, 92, 0.42)',
  scleraFibre: 'rgba(168, 140, 112, 0.20)',
  cornea: '#D3E3E8',
  corneaEpi: '#B9CFD6',
  corneaShade: 'rgba(84, 118, 130, 0.30)',
  corneaLamella: 'rgba(110, 145, 158, 0.22)',
  corneaEndo: 'rgba(70, 104, 118, 0.70)',
  graft: '#DCEBEF',
  iris: '#6D4832',
  irisShade: 'rgba(30, 16, 8, 0.45)',
  irisPigment: '#2A1B14',
  ciliary: '#874538',
  ciliaryShade: 'rgba(40, 10, 6, 0.45)',
  choroid: '#682A22',
  retina: '#E3A085',
  retinaInner: '#F0BDA6',
  rpe: '#4A1D17',
  macula: 'rgba(214, 166, 64, 0.62)',
  lens: '#F2EAD6',
  lensNucleus: '#E7D7B2',
  lensShell: 'rgba(168, 146, 104, 0.26)',
  capsule: 'rgba(150, 130, 96, 0.95)',
  cataractCortex: '#DCCBA3',
  cataractNucleus: '#B08046',
  zonule: 'rgba(196, 184, 160, 0.85)',
  nerve: '#EFE3CD',
  nerveSheath: '#E2D5BF',
  riboflavin: 'rgba(222, 196, 46, 0.5)',
  suture: '#1E2A3C',
  implantSection: '#C2E4E6'
};

// 3D (lit) material colours, matched to the section palette.
export const M = {
  sclera: '#EEE5D6',
  cornea: '#E6F2F5',
  iris: '#7A5038',
  ciliary: '#7B3E33',
  choroid: '#5E251E',
  retina: '#E4AC94',
  lensClear: '#F3E9D0',
  cataract: '#D6C39A',
  metal: '#CED3D8',
  sleeve: '#9DB0BD',
  implant: '#BFE3E4',
  implantHaptic: '#4F98A2',
  violet: '#8C7BE0',
  suture: '#1E2A3C'
};
