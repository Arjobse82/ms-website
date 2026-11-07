// What Assemblr for Photoshop's panel is drawn from (src/_lib/panels/assemblr-photoshop.js `art`, drawings in
// src/_includes/panel/assemblr-photoshop/): one document with two artboards, Feed and Story, and three products of can
// packshots, each layer a smart object named as Photoshop names a placed file and its copies. The selected product is
// "Cans" in Line-up, and the drawing over the Layout tile (the plugin's Product tile) is the plugin's line-up control at rest
// (catalague-producer src/ui/lineup-widget.ts): each layer an outlined, rounded box the shape of its visible subject,
// upright, standing on a line at the row's angle (Align images: Bottom), the far one smaller and drawn heavier
// (Perspective); the blue axis through the middle of the row with the size-and-angle handle at its end; the nine anchor
// dots round the area, the middle one filled because the middle is the anchor.

export const CAN = { white: "/assets/img/can-white.webp", black: "/assets/img/can-black.webp" };
const layer = (name) => ({ name, src: CAN[name.includes("black") ? "black" : "white"] });

// The drawing's viewBox (400 × 220, as Automated Assemblr's), its area inset so the corner dot clears the note mark.
const VIEW = { w: 400, h: 220 };
const AREA = { x0: 40, y0: 18, x1: 360, y1: 202 };
// The can's visible subject, width over height (src/assets/img/can-*.webp, about 460 × 780).
const CAN_ASPECT = 0.6;

/** The row: `n` layers along a line at `angle` degrees through the area's middle, bottoms on that line, the first the
 *  farthest (heights grow from `far` to `near`, the stroke thins from 4 to 2 as the widget draws perspective). */
export function lineup({ n = 5, angle = 14, step = 44, far = 64, near = 88 } = {}) {
  const cx = (AREA.x0 + AREA.x1) / 2, cy = (AREA.y0 + AREA.y1) / 2;
  const ux = Math.cos((angle * Math.PI) / 180), uy = Math.sin((angle * Math.PI) / 180);
  const hs = Array.from({ length: n }, (_, i) => far + ((near - far) * i) / (n - 1));
  const base = cy + hs.reduce((a, b) => a + b, 0) / n / 2; // the bottoms' line, so the row's middle is the area's
  const r1 = (v) => Math.round(v * 10) / 10;
  const items = hs.map((h, i) => {
    const t = (i - (n - 1) / 2) * step;
    const bx = cx + t * ux, by = base + t * uy, w = h * CAN_ASPECT;
    return { x: r1(bx - w / 2), y: r1(by - h), w: r1(w), h: r1(h), rx: r1(w * 0.18), stroke: r1(4 - (2 * i) / (n - 1)), cx: r1(bx), cy: r1(by - h / 2) };
  });
  const first = items[0], last = items[items.length - 1];
  const axis = { x1: first.cx, y1: first.cy, x2: last.cx, y2: last.cy, mx: r1((first.cx + last.cx) / 2), my: r1((first.cy + last.cy) / 2) };
  const xs = [AREA.x0, cx, AREA.x1], ys = [AREA.y0, cy, AREA.y1];
  const anchors = ys.flatMap((y) => xs.map((x) => ({ x, y }))).filter((p) => !(p.x === cx && p.y === cy));
  return { view: VIEW, area: AREA, items, axis, anchors, guide: { x1: AREA.x0, x2: AREA.x1, y: cy } };
}

/** The Products list as the panel draws it: the artboard in focus's products, then for each other artboard its divider
 *  and its products. */
function list(boards) {
  const rows = [];
  for (const b of boards) {
    if (!b.focus) rows.push({ board: b.name });
    for (const p of b.products) rows.push(p);
  }
  return { rows, count: boards.reduce((n, b) => n + b.products.length, 0) };
}

export function assemblrPhotoshopPanel() {
  const cans = ["can-white", "can-black", "can-white copy", "can-black copy", "can-white copy 2"].map(layer);
  const boards = [
    { name: "Feed", focus: true, products: [
      { name: "Cans", selected: true, layers: cans },
      { name: "Assemblr 2", layers: [layer("can-black copy 2"), { ...layer("can-white copy 3"), off: true }, layer("can-black copy 3")] },
    ] },
    { name: "Story", products: [
      { name: "Assemblr 1", layers: ["can-white copy 4", "can-black copy 4", "can-white copy 5", "can-black copy 5"].map(layer) },
    ] },
  ];
  return {
    doc: "Cans.psd",
    board: "Feed",
    product: { name: "Cans", board: "Feed", layers: cans },
    // Assemble's count: two more layers selected that no product has.
    assemble: 2,
    row: lineup({ n: cans.length }),
    // The Layers panel's front layer, and the row's (the first, with Swap order not pressed): the panel's sentence while
    // "Allow Assemblr to restack layers" is off (src/photoshop/host/arrange.ts orderSentence).
    front: { panel: "can-white copy 2", row: "can-white" },
    // The Products tile: every product in the document, the artboard in focus first, each other artboard under its name.
    // Products are numbered on their own artboard, so Story has an Assemblr 1 of its own.
    products: list(boards),
  };
}
