// The atlas camera language: four standard camera types shared by every shot. Each shot names its type and states
// its exact camera in the manifest (target, direction, up, visible height, field of view).
//
// Eye coordinates (scripts/illustrations/src/anatomy.js): millimetres, +Z = optical axis pointing out of the eye
// (anterior), the globe centre at z = EYE.cz, the corneal apex at z = 3.85.

export const CAMERAS = {
  sagittal: {
    name: 'Sagittal cut-away',
    rule: 'Camera square to a meridional cut face (at most 20 degrees off its normal), anterior to the LEFT, long lens (fov 12-14 degrees) so the painted section reads like a textbook cross-section while the 3D tissue behind it keeps depth.'
  },
  frontal: {
    name: 'Frontal',
    rule: 'Along the visual axis, at most 25 degrees off-axis, the pupil near the frame centre: the view a patient knows from a mirror.'
  },
  oblique: {
    name: '3/4 oblique',
    rule: '35-65 degrees off the visual axis, raised 15-35 degrees, fov 16-18 degrees; a quadrant or wedge cut-away faces the camera so the 3D anatomy and two cut faces read together.'
  },
  macro: {
    name: 'Macro',
    rule: 'Long lens (fov 10-12 degrees), frame height 2-8 mm, on one structure; the painted section is re-rasterised at the macro scale (not an upscaled crop).'
  }
};

export const DEG = Math.PI / 180;
// Direction towards the camera from a polar angle (from +Z, the anterior axis) and an azimuth (around Z, from +X).
export const dirFrom = (polarDeg, azDeg) => {
  const a = polarDeg * DEG, z = azDeg * DEG;
  return [Math.sin(a) * Math.cos(z), Math.sin(a) * Math.sin(z), Math.cos(a)];
};
