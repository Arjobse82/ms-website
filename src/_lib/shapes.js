// The example objects in every drawing of Assemblr and Automated Assemblr: ten 3D shapes, each a cut-out
// (src/assets/img/shape-<key>.webp, trimmed to its visible edge plus a 3 % margin, 800 px tall).
//
// `box` is the visible subject as the layout engine reads it: fractions of the image, [top, left, bottom, right]
// (the engine's rectangle order, not CSS's), and `aspect` the image's width over its height. A drawing that places an
// image so its subject lands on a rectangle needs both, so a shape never goes past its cell.
export const SHAPES = {
  "pink-box": { box: [0.0281, 0.0653, 0.9719, 0.9347], aspect: 344 / 800 },
  "tan-pillar": { box: [0.0283, 0.1082, 0.9717, 0.8918], aspect: 209 / 800 },
  "blue-slab": { box: [0.0286, 0.0373, 0.9714, 0.9627], aspect: 613 / 800 },
  "green-brick": { box: [0.0279, 0.0241, 0.9721, 0.9759], aspect: 926 / 800 },
  "amber-bar": { box: [0.0287, 0.0234, 0.9713, 0.9766], aspect: 983 / 800 },
  "grey-cube": { box: [0.0283, 0.0302, 0.9717, 0.9698], aspect: 751 / 800 },
  "rose-cylinder": { box: [0.0278, 0.0219, 0.9722, 0.9781], aspect: 1016 / 800 },
  "blue-arch": { box: [0.0281, 0.0223, 0.9719, 0.9777], aspect: 1006 / 800 },
  "yellow-disc": { box: [0.0281, 0.031, 0.9719, 0.969], aspect: 725 / 800 },
  "red-tile": { box: [0.0288, 0.0197, 0.9712, 0.9803], aspect: 1168 / 800 },
};

export const SHAPE_KEYS = Object.keys(SHAPES);

/** key → the image's URL. */
export const SHAPE_SRC = Object.fromEntries(SHAPE_KEYS.map((k) => [k, `/assets/img/shape-${k}.webp`]));

/** The shape a file or layer name stands for: "pink-box.psd", "pink-box copy 2" and "410203 pink-box.psd" are all the pink box. */
export const shapeOf = (name) => {
  const key = SHAPE_KEYS.find((k) => String(name).includes(k));
  if (!key) throw new Error(`No shape in "${name}"`);
  return key;
};

/** n of one shape, named as Photoshop names a placed file and its copies: "pink-box", "pink-box copy", "pink-box copy 2". */
export const copies = (key, n, from = 0) => Array.from({ length: n }, (_, i) => { const c = from + i; return c === 0 ? key : c === 1 ? `${key} copy` : `${key} copy ${c}`; });
