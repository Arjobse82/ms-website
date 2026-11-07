// What Assemblr for InDesign's panel is drawn from (src/_lib/panels/assemblr.js `art`, drawings in
// src/_includes/panel/assemblr/): one document of three pages with three products of can packshots, each image a placed
// file (copies of one file are images of their own). The selected product is "Cans" on page 2, in Line-up, drawn by the
// same row as Assemblr for Photoshop's guide (src/_lib/assemblr-photoshop-panel.js `lineup`); Assemble names the
// products Product 1, Product 2 and so on (catalague-producer src/assemblr/host/assemble.ts), and "Cans" was renamed.
// Its Overlays corners are the plugin's own example (docs/assemblr-listing.md, frame as-overlays): two badges top
// right and a price bottom left, $12.50 drawn by Set 1's dollars style.
import { CAN, lineup } from "./assemblr-photoshop-panel.js";
import { E, laidOut, cornerStack, handOf, r1, PRICE_ASPECT } from "./engine-layout.js";

const image = (name, extra = {}) => ({ name, src: CAN[name.includes("black") ? "black" : "white"], ext: name.split(".").pop().toUpperCase(), ...extra });

const CANS = ["can-white.psd", "can-black.psd", "can-white.psd", "can-black.psd", "can-white.psd"].map((n) => image(n));

/** The Products list as the panel draws it: a divider where the list moves on to another page, each product its row. */
const PAGES = [
  { page: "Page 2", products: [
    { name: "Cans", selected: true, images: CANS },
    { name: "Product 2", locked: 1, images: [image("can-black.psd"), image("can-white.psd", { off: true }), image("can-black.psd")] },
  ] },
  { page: "Page 3", products: [
    { name: "Product 3", disconnected: true, images: ["can-white.psd", "can-black.psd", "can-white.psd", "can-black.psd"].map((n) => image(n)) },
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
  const names = ["can-white.psd", "can-black.psd", "can-white.psd"];
  const text = { name: "Summer range" };
  const LAYER_1 = "#b5b5b5", ASSEMBLR = "#3372f6";
  const frame = (x, y, w, h) => {
    const ch = h * 0.86, cw = ch * (471 / 800), gap = w * 0.03;
    const x0 = x + (w - 3 * cw - 2 * gap) / 2, y0 = y + (h - ch) / 2;
    return {
      x, y, w, h,
      cans: names.map((n, i) => ({ src: CAN[n.includes("black") ? "black" : "white"], x: r1(x0 + i * (cw + gap)), y: r1(y0), w: r1(cw), h: r1(ch) })),
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
    // Six cans in Line-up, landscape and then portrait, at the same settings; and those settings as the panel shows them.
    shape: {
      inset: SHAPE_INSET, from: reshaped(...LANDSCAPE, SIX, LINEUP), to: reshaped(...PORTRAIT, SIX, LINEUP),
      settings: { align: ALIGN[LINEUP.baseline], angle: LINEUP.angle, size: Math.round(LINEUP.size * 100), perspective: Math.round(LINEUP.perspective * 100) },
    },
  };
}

// Landscape to portrait (panel/assemblr/how-shape.njk), laid out by Assemblr's own engine (src/_lib/engine-layout.js),
// in points; the overlays at the corner's defaults (40 pt at most, Resize scale off) but for its insets, drawn wider
// than the 6 pt default to be seen.
const SHAPE_INSET = 12;

// Six cans in Line-up: the row level (Angle 0, the owner, 2026-11-02), Perspective 40 %, Align images Middle (the
// engine's baseline "centre", the panel's ALIGN_CHIPS in src/ui/lineup-widget.ts), and Size 100 % typed in the
// landscape rectangle, so the host records that rectangle's shape with it (setLineup's stampSizeAspect, D89). Dragged
// to portrait, the recorded shape no longer fills the narrower rectangle, so Size is read in the new one (D89 (2f),
// sizeShape): the front can as tall as it allows, the others tucked in behind (the overlap in each one's evidence).
const SIX = ["can-white.psd", "can-black.psd", "can-white.psd", "can-black.psd", "can-white.psd", "can-black.psd"];
const LANDSCAPE = [420, 230], PORTRAIT = [240, 330];
const LINEUP = { ...E.modeStart("line"), angle: 0, perspective: 0.4, baseline: "centre", size: 1, sizeAspect: LANDSCAPE[0] / LANDSCAPE[1] };
const ALIGN = { top: "Top", centre: "Middle", bottom: "Bottom" };

/**
 * The five arrangements (panel/assemblr/how-modes.njk, the owner, 2026-11-02), each laid out by the engine in a 240 × 170
 * pt tile, named and described as the Layout tile's mode chips are (catalague-producer src/assemblr/ui/sections.ts
 * modeChip). Cans as the demo has them, white and black by turns; each arrangement as a designer might set it, so it
 * looks like itself with cans that are all one shape: Line-up turned to −15°, so the row rises as it goes back towards
 * the horizon (the owner, 2026-11-02), overlapping by 30 % (spacing −0.30, Size unset) and receding with Perspective
 * 40 %; Grid three across, closed up 45 % across; Mosaic with seven, a row of
 * three over a row of four; Pins a rack of three, two and one, each row riding up behind the one in front (Space down
 * −55 %) and a little smaller (Perspective 25 %); Puzzle with sixteen, nested round each other, turned as the demo deals
 * turns (handOf) and sized by hand, every fourth one large (Puzzle keeps a hand size and a turn).
 */
function modes() {
  const cans = (n) => Array.from({ length: n }, (_, i) => (i % 2 ? "can-black.psd" : "can-white.psd"));
  const puzzleHand = handOf(3, 16).map((h, i) => ({ weight: i % 4 === 0 ? 2.6 : h.weight * 0.8, angle: h.angle }));
  // Each laid out inside a 12 pt margin of its tile, so no can touches the tile's edge.
  const W = 240, H = 170, pad = 12;
  const lay = (id, name, text, n, params, hands) => ({ id, name, text, pad, ...laidOut(W - 2 * pad, H - 2 * pad, cans(n), params, hands) });
  return [
    lay("line", "Line-up", "One row, with an angle and perspective.", 6, { ...E.modeStart("line"), angle: -15, spacing: -0.3, size: null, perspective: 0.4, alignY: "centre" }),
    lay("grid", "Grid", "Rows and columns.", 6, { ...E.modeStart("grid"), cols: 3, gap: -0.45, gapY: 0.04, alignX: "centre", alignY: "centre" }),
    lay("mosaic", "Mosaic", "Arranged and scaled to fill the space.", 7, E.modeStart("mosaic")),
    lay("pins", "Pins", "A bowling-pins formation.", 6, { ...E.modeStart("pins"), gapY: -0.55, perspective: 0.25, alignY: "centre" }),
    lay("puzzle", "Puzzle", "Tightly packed round each other, at equal area or at the sizes you give them.", 16, E.modeStart("puzzle"), puzzleHand),
  ];
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
    product: { name: "Cans", images: CANS },
    // Three more images selected, in no product: what the Assemble section counts.
    assemble: 3,
    row: lineup({ n: CANS.length }),
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
