// Cans laid out by Assemblr's own engine, the demo's build of catalague-producer src/core
// (src/assets/js/assemblr-engine.js, scripts/build-assemblr-engine.sh), for drawings drawn at build time: a product's
// images by the panel's preview solve, the page's own answer, each placed so its visible subject lands on its rect, as
// the demo places them; and a corner's overlays by the corner's stack. In points, in a w × h area.
// Kept out of src/_data, as a data file's named exports change what Eleventy reads from it.
import * as E from "../assets/js/assemblr-engine.js";
import { SHAPES, SHAPE_SRC, shapeOf } from "./shapes.js";

export { E };

/** Each shape's visible subject, as the engine's traceAlpha reads it from its cut-out (src/_lib/shapes.js): `box` is
 *  [top, left, bottom, right] as fractions of the image, the engine's rectangle order. */
/** The demo's price design, "$X.XX each". */
export const PRICE_ASPECT = 150 / 90;

export const r1 = (n) => Math.round(n * 10) / 10;
const canOf = (name) => SHAPE_SRC[shapeOf(name)];
const subjectOf = (name) => SHAPES[shapeOf(name)];

/** The demo's sizes and turns by hand, dealt from a seed (src/assets/js/assemblr-demo.js handOf, kept the same): a weight,
 *  an AREA ratio, and a turn in degrees, InDesign's sense (positive is counter-clockwise). */
export function handOf(seed, n) {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: n }, () => {
    const scale = 0.6 + rand() * 0.65;
    const turned = rand() < 0.45;
    return { weight: scale * scale, angle: turned ? Math.round((rand() < 0.5 ? -1 : 1) * (12 + rand() * 78)) : 0 };
  });
}

/**
 * A product's images as the engine lays them out in a w × h point area, back to front, and its frame's handles.
 * `hands` (optional, one per image): sizes and turns given by hand, read as the demo reads them: Line-up and Puzzle keep
 * a weight, Puzzle a turn too. A turned can carries `turn`, to be drawn turned about its middle (`cx`, `cy`).
 */
export function laidOut(w, h, names, params, hands = []) {
  const keepsHand = params.mode === "line" || params.mode === "puzzle";
  const turnOf = (i) => (params.mode === "puzzle" ? hands[i]?.angle ?? 0 : 0);
  const subjects = names.map((name, i) => {
    const base = subjectOf(name);
    const s = keepsHand && hands[i] && hands[i].weight !== 1 ? { ...base, weight: hands[i].weight } : base;
    return turnOf(i) ? { ...s, angle: turnOf(i) } : s;
  });
  const out = E.solvePreview({ aspect: w / h, subjects }, params);
  const cans = [...out.items].sort((a, b) => a.z - b.z).map((placed) => {
    const turn = turnOf(placed.index);
    const sub = subjectOf(names[placed.index]);
    const f = E.withBleed(sub.box, params.bleed);
    let rect = placed.rect, cx = 0, cy = 0;
    if (turn) {
      // The solver's rect is the box the turned subject sweeps: the subject upright, its own size, about the same middle.
      cx = ((rect[1] + rect[3]) / 2) * w; cy = ((rect[0] + rect[2]) / 2) * h;
      const a = ((f[3] - f[1]) * sub.aspect) / (f[2] - f[0]);
      const hs = E.uprightHeight((rect[2] - rect[0]) * h, a, turn), ws = a * hs;
      rect = [(cy - hs / 2) / h, (cx - ws / 2) / w, (cy + hs / 2) / h, (cx + ws / 2) / w];
    }
    const [l, t, r, b] = E.imageTarget([0, 0, w, h], rect, f);
    return { src: canOf(names[placed.index]), x: r1(l), y: r1(t), w: r1(r - l), h: r1(b - t), ...(turn ? { turn, cx: r1(cx), cy: r1(cy) } : {}) };
  });
  const overlap = Number(/overlapping by (\d+)%/.exec(out.evidence.join(" "))?.[1] ?? 0);
  return { w, h, cans, overlap, evidence: out.evidence, handles: [[0, 0], [w / 2, 0], [w, 0], [w, h / 2], [w, h], [w / 2, h], [0, h], [0, h / 2]] };
}

/** The overlays on one corner of a w × h area, stacked by the engine: each `{x, y, w, h, cx, cy}` in points. */
export function cornerStack(w, h, corner, aspects, setup = {}) {
  const box = ([t, l, b, r]) => ({ x: r1(l), y: r1(t), w: r1(r - l), h: r1(b - t), cx: r1((l + r) / 2), cy: r1((t + b) / 2) });
  return E.solveStack([0, 0, h, w], corner, { ...E.DEFAULT_CORNER, ...setup }, aspects.map((aspect) => ({ aspect }))).map(box);
}
