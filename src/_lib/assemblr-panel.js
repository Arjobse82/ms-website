// What Assemblr for InDesign's panel is drawn from (src/_lib/panels/assemblr.js `art`, drawings in
// src/_includes/panel/assemblr/): one document of three pages with three products of can packshots, each image a placed
// file (copies of one file are images of their own). The selected product is "Cans" on page 2, in Line-up, drawn by the
// same row as Assemblr for Photoshop's guide (src/_lib/assemblr-photoshop-panel.js `lineup`); Assemble names the
// products Product 1, Product 2 and so on (catalague-producer src/assemblr/host/assemble.ts), and "Cans" was renamed.
// Its Overlays corners are the plugin's own example (docs/assemblr-listing.md, frame as-overlays): two badges top
// right and a price bottom left, $12.50 drawn by Set 1's dollars style.
import { CAN, lineup } from "./assemblr-photoshop-panel.js";
import { E, laidOut, cornerStack, handOf, r1, PRICE_ASPECT } from "./engine-layout.js";
import { SHAPES, shapeOf } from "./shapes.js";

/** n files of one shape, named as InDesign names placed files: copies of one file share its name. */
const files = (key, n) => Array.from({ length: n }, () => `${key}.psd`);

const image = (name, extra = {}) => ({ name, src: CAN[shapeOf(name)], ext: name.split(".").pop().toUpperCase(), ...extra });

// Same objects stand together: three pink boxes then two tan pillars.
const CAN_NAMES = [...files("pink-box", 3), ...files("tan-pillar", 2)];
const CANS = CAN_NAMES.map((n) => image(n));

/** The Products list as the panel draws it: a divider where the list moves on to another page, each product its row. */
const PAGES = [
  { page: "Page 2", products: [
    { name: "Boxes", selected: true, images: CANS },
    { name: "Product 2", locked: 1, images: files("blue-slab", 3).map((n, i) => image(n, i === 1 ? { off: true } : {})) },
  ] },
  { page: "Page 3", products: [
    { name: "Product 3", disconnected: true, images: [...files("green-brick", 2), ...files("amber-bar", 2)].map((n) => image(n)) },
  ] },
];
// Each product's place in the list, for the drawing's marks (a Nunjucks counter does not outlive its loop).
PAGES.flatMap((p) => p.products).forEach((p, i) => { p.n = i + 1; });

/** The Overlays tile's drawing: the selected product's image area at its own shape (4 : 3 in a 400 × 220 stage), its
 *  corners' overlays as boxes (src/assemblr/ui/overlays.ts overlayDiagram): the open corner's in blue, the others
 *  outlined. A control on each corner: a dot where it holds something, a plus where it holds nothing. */
function corners() {
  const area = { x: 54, y: 14, w: 292, h: 192 };
  const r = (x, y, w, h) => ({ x, y, w, h, rx: Math.round(Math.min(w, h) * 0.18) });
  const pad = 10, s = 52;
  return {
    area: { ...area, rx: Math.round(Math.min(area.w, area.h) * 0.1) },
    // Top right, Across: two badges from the corner along the top edge.
    open: [r(area.x + area.w - pad - s, area.y + pad, s, s), r(area.x + area.w - pad - 2 * s - 6, area.y + pad, s, s)],
    // Bottom left: the price, wider than tall as the dollars style is.
    held: [r(area.x + pad, area.y + area.h - pad - 40, 76, 40)],
    dots: { tr: [area.x + area.w, area.y], bl: [area.x, area.y + area.h] },
    plus: { tl: [area.x, area.y], br: [area.x + area.w, area.y + area.h] },
  };
}

/** How it works (panel/assemblr/how-*.njk): InDesign's Layers panel before and after Assemble, and the product's frame
 *  moved and resized. Assemble adds a layer named "Assemblr" on top when the document has none and moves the images
 *  onto it, whatever layer they were on; the frame, a rectangle with no fill and no stroke, goes behind them, at the
 *  bottom of the layer (catalague-producer src/assemblr/host/assemble.ts assembleSelection, docs/assemblr.md rule 8). A
 *  product moved whole to another layer works there (rule 8, D84): its square dragged in the Layers panel. At its new
 *  size the frame's images re-fit, a grid of one row as Assemble starts, so the drawing scales them with it. */
function how() {
  const names = files("pink-box", 3);
  const text = { name: "Summer range" };
  const LAYER_1 = "#b5b5b5", ASSEMBLR = "#3372f6";
  const frame = (x, y, w, h) => {
    const ch = h * 0.86, cw = ch * SHAPES["pink-box"].aspect, gap = w * 0.03;
    const x0 = x + (w - 3 * cw - 2 * gap) / 2, y0 = y + (h - ch) / 2;
    return {
      x, y, w, h,
      cans: names.map((n, i) => ({ src: CAN[shapeOf(n)], x: r1(x0 + i * (cw + gap)), y: r1(y0), w: r1(cw), h: r1(ch) })),
      handles: [[x, y], [x + w / 2, y], [x + w, y], [x + w, y + h / 2], [x + w, y + h], [x + w / 2, y + h], [x, y + h], [x, y + h / 2]],
    };
  };
  return {
    before: { foot: "Page: 1, 1 Layer", layers: [{ name: "Layer 1", colour: LAYER_1, items: [text, ...names.map((name) => ({ name }))] }] },
    after: { foot: "Page: 1, 2 Layers", layers: [
      { name: "Assemblr", colour: ASSEMBLR, new: true, items: [...names.map((name) => ({ name, moved: true })), { name: "rectangle", new: true }] },
      { name: "Layer 1", colour: LAYER_1, items: [text] },
    ] },
    // The frame before, dashed, and after it is moved and resized, selected; and the Layers panel with the product's
    // square dragged from its layer to another.
    frame: { w: 480, h: 204, from: frame(12, 53, 150, 90), to: frame(214, 26, 240, 144) },
    move: { layers: [
      { name: "Assemblr", colour: ASSEMBLR, closed: true, sel: "from" },
      { name: "Layer 1", colour: LAYER_1, closed: true, sel: "to" },
    ] },
    modes: modes(),
    overlays: overlaysHow(),
    sizes: sizesHow(),
    // Six cans in Line-up, landscape and then portrait, at the same settings; and those settings as the panel shows them.
    shape: {
      inset: SHAPE_INSET_MM, from: reshaped(...LANDSCAPE, SIX, LINEUP), to: reshaped(...PORTRAIT, SIX, LINEUP),
      // Size never typed: the panel shows what the overlap amounts to in each shape (sections.ts sizeOf).
      settings: { align: ALIGN[LINEUP.baseline], angle: LINEUP.angle, overlap: Math.round(-LINEUP.spacing * 100), size: sizeShown(...LANDSCAPE), sizeTo: sizeShown(...PORTRAIT), perspective: Math.round(LINEUP.perspective * 100) },
    },
  };
}

// Landscape to portrait (panel/assemblr/how-shape.njk), laid out by Assemblr's own engine (src/_lib/engine-layout.js),
// in points; the overlays at the corner's defaults (40 pt at most, Resize scale off) but for its insets, drawn wider
// than the 6 pt default to be seen: 4 mm, labelled in mm (the owner, 2026-11-11: "swap pt for mm").
const MM = 72 / 25.4;
const SHAPE_INSET_MM = 4, SHAPE_INSET = SHAPE_INSET_MM * MM;

// Six cans in Line-up: the row level (Angle 0, the owner, 2026-11-02), Perspective 40 %, Align images Middle (the
// engine's baseline "centre", the panel's ALIGN_CHIPS in src/ui/lineup-widget.ts), overlapping by 10 % with Size never
// typed, so the overlap governs (D37) and the row keeps it at any shape, scaled to fit: in portrait the cans get smaller
// rather than tucking in. (Size 100 % typed in landscape tucked them to about 70 % in portrait, D89 (2f) sizeShape: too
// much overlap for the hero, the owner, 2026-11-11.) The panel's Size box shows what the overlap amounts to in each shape.
const SIX = files("pink-box", 6); // One object, six of it (the owner, 2026-11-11).
const LANDSCAPE = [420, 230], PORTRAIT = [240, 330];
const LINEUP = { ...E.modeStart("line"), angle: 0, perspective: 0.4, baseline: "centre", alignY: "centre", size: null, spacing: -0.1 };
/** The Size the panel shows for LINEUP in a w × h rectangle (catalague-producer src/assemblr/ui/sections.ts sizeOf). */
function sizeShown(w, h) {
  const preview = { aspect: w / h, subjects: SIX.map((n) => SHAPES[shapeOf(n)]) };
  return Math.round(E.sizeOfSpacing(LINEUP.spacing, { items: E.previewItems(preview, LINEUP), aspect: w / h, params: LINEUP }) * 100);
}
const ALIGN = { top: "Top", centre: "Middle", bottom: "Bottom" };

/**
 * The five arrangements (panel/assemblr/how-modes.njk, the owner, 2026-11-02), each laid out by the engine in a 240 × 170
 * pt tile, named and described as the Layout tile's mode chips are (catalague-producer src/assemblr/ui/sections.ts
 * modeChip). Each arrangement as a designer might set it (the owner, 2026-11-11): Line-up the hero's own row (SIX and
 * LINEUP above: six pink boxes, level, overlapping by 10 %, Perspective 40 %); Grid six blue slabs three across and two
 * down, overlapping 40 % both ways; Mosaic five different objects, one each; Pins a rack of three, two and one of one
 * object, the yellow disc, each row riding up behind the one in front (Space down −55 %) and a little smaller
 * (Perspective 25 %); Puzzle with sixteen, nested round each other, turned as the demo deals turns (handOf) and sized
 * by hand from large to tiny (Puzzle keeps a hand size and a turn).
 */
function modes() {
  // Same objects stand together, a group of each shape in turn.
  const cans = (groups) => groups.flatMap(([key, n]) => files(key, n));
  // Sixteen sizes, from 12 down to 0.08 evenly in log, dealt so neighbours differ (the owner, 2026-11-11: "more varied").
  const sizes = Array.from({ length: 16 }, (_, k) => 12 * Math.pow(0.08 / 12, k / 15));
  const deal = [0, 15, 3, 9, 1, 12, 6, 14, 2, 10, 5, 13, 4, 11, 7, 8];
  const puzzleHand = handOf(3, 16).map((h, i) => ({ weight: sizes[deal[i]], angle: h.angle }));
  // Each laid out inside a 12 pt margin of its tile, so no can touches the tile's edge.
  const W = 240, H = 170, pad = 12;
  const lay = (id, name, text, groups, params, hands) => ({ id, name, text, pad, ...laidOut(W - 2 * pad, H - 2 * pad, cans(groups), params, hands) });
  return [
    lay("line", "Line-up", "One row, with an angle and perspective.", [["pink-box", 6]], LINEUP),
    lay("grid", "Grid", "Rows and columns.", [["blue-slab", 6]], { ...E.modeStart("grid"), cols: 3, gap: -0.4, gapY: -0.4, alignX: "centre", alignY: "centre" }),
    lay("mosaic", "Mosaic", "Arranged and scaled to fill the space.", [["yellow-disc", 1], ["grey-cube", 1], ["red-tile", 1], ["rose-cylinder", 1], ["blue-arch", 1]], E.modeStart("mosaic")),
    lay("pins", "Pins", "A bowling-pins formation.", [["yellow-disc", 6]], { ...E.modeStart("pins"), gapY: -0.55, perspective: 0.25, alignY: "centre" }),
    lay("puzzle", "Puzzle", "Tightly packed round each other, at equal area or at the sizes you give them.", [["grey-cube", 8], ["yellow-disc", 5], ["red-tile", 3]], E.modeStart("puzzle"), puzzleHand),
  ];
}

/**
 * The overlays (panel/assemblr/how-overlays.njk, the owner, 2026-11-11): the hero's product with a setup on each corner,
 * each stacked by the engine (cornerStack, catalague-producer src/core/overlay/stack.ts solveStack), in points: top
 * left three small badges stacked Down; top right two badges stacked Across, a Gap between; bottom left the price; bottom
 * right a wide badge fitted inside its Max width × Max height. Under it Max size's one example, Ink (sizesHow).
 */
function overlaysHow() {
  // Labelled in mm (the owner, 2026-11-11: "swap pt for mm"), laid out in points: 4 mm insets, 3 mm gap, Max 25 × 15 mm.
  const LABEL = { inset: 4, gap: 3, max: { w: 25, h: 15 } };
  const W = 440, H = 270, INSET = LABEL.inset * MM, GAP = LABEL.gap * MM, MAX = { w: LABEL.max.w * MM, h: LABEL.max.h * MM };
  const S = { insetX: INSET, insetY: INSET };
  const main = {
    w: W, h: H,
    cans: laidOut(W, H, SIX, { ...LINEUP, scale: 0.6 }).cans,
    tr: cornerStack(W, H, "tr", [1, 1], { ...S, gap: GAP, maxW: 44, maxH: 44 }),
    bl: cornerStack(W, H, "bl", [PRICE_ASPECT], { ...S, maxW: 84, maxH: 50 }),
  };
  main.tl = cornerStack(W, H, "tl", [1, 1, 1], { ...S, gap: 6, maxW: 30, maxH: 30, direction: "down" });
  main.br = cornerStack(W, H, "br", [2.4], { ...S, maxW: MAX.w, maxH: MAX.h });
  main.maxBox = { x: W - INSET - MAX.w, y: H - INSET - MAX.h, w: MAX.w, h: MAX.h };
  return { inset: LABEL.inset, gap: LABEL.gap, max: LABEL.max, main };
}

/**
 * Max size, one example (under the overlays in panel/assemblr/how-overlays.njk, the owner, 2026-11-11): Ink 4 %, the same badge top right and
 * price bottom left on three products of different sizes and shapes, sized by the engine (cornerStack, D91: A = W × H ×
 * inkPct / 100, each artwork's aspect kept). `share` is how much of the image area the badge takes: 4 % on every one.
 * (In pt the same badge took 4.3, 6.7 and 7.7 % of these three; in 22 % × 22 %, 2.4, 4.8 and 2.4 %.)
 */
function sizesHow() {
  const SETUP = { insetX: 8, insetY: 8, sizing: "ink", inkPct: 4 };
  return [[300, 150], [170, 170], [112, 224]].map(([w, h]) => {
    const [badge] = cornerStack(w, h, "tr", [1], SETUP);
    const [price] = cornerStack(w, h, "bl", [PRICE_ASPECT], SETUP);
    return { w, h, cans: laidOut(w, h, files("pink-box", 3), { ...LINEUP, scale: 0.62 }).cans, badge, price, share: ((badge.w * badge.h) / (w * h) * 100).toFixed(1) };
  });
}

/** laidOut, with a badge top right and the price bottom left stacked on its corners. */
function reshaped(w, h, names, params) {
  const inset = { insetX: SHAPE_INSET, insetY: SHAPE_INSET, inset: SHAPE_INSET };
  const [badge] = cornerStack(w, h, "tr", [1], inset);
  const [price] = cornerStack(w, h, "bl", [PRICE_ASPECT], inset);
  return { ...laidOut(w, h, names, params), badge, price };
}

export function assemblrPanel() {
  return {
    how: how(),
    page: "2",
    product: { name: "Boxes", images: CANS },
    // Three more images selected, in no product: what the Assemble section counts.
    assemble: 3,
    row: lineup({ n: CANS.length, shapes: CAN_NAMES.map(shapeOf) }),
    products: { pages: PAGES, count: PAGES.reduce((n, p) => n + p.products.length, 0) },
    overlays: {
      drawing: corners(),
      badges: ["new.png", "australian grown.png"],
      price: { value: "$12.50", set: "Set 1", extra: { label: "Unit", value: "each" } },
      list: ["new.png", "australian grown.png", "1 year warranty.psd"],
      missing: "1 year warranty.psd",
      set: { name: "Set 1", folder: "Price styles", styles: [["Price dollars", "$X.XX"], ["Price cents", "XXc"]] },
    },
  };
}
