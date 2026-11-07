// What Automated Assemblr's drawings are drawn from (src/_lib/panels/catalogue-producer.js `art`): the hero's catalogue
// spread with its features over it (partials/catalogue-spread.njk), and How it works's five drawings
// (src/_includes/panel/catalogue-producer/how-*.njk). One made-up catalogue of canned drinks, its brief a row a
// product, its images the site's two cans. Pages are A4 in points, built as the plugin builds them: the grid inside
// each page's margins, inside and outside swapped on facing pages (PLAN.md §5, page.marginPreferences); each product a
// cell, its image area over its copy; inserts an advert and a table (D53, D54). The cans in every image area are laid
// out by Assemblr's own engine (src/_lib/engine-layout.js), the price devices and badges stacked on their corners by it.
import { E, laidOut, cornerStack, r1, PRICE_ASPECT } from "./engine-layout.js";
import { CAN } from "./assemblr-photoshop-panel.js";

const PAGE = { w: 595, h: 842 };
const MARGIN = { top: 42, bottom: 50, inside: 40, outside: 30 };
const GAP = 12;
const COPY = 58; // the copy under each image area, in points

/** The brief: a row a product. `cans` are its images, found in the image folders by its code. Like drinks sit
 *  together, so the pages run in groups of one can, not black, white, black (the owner, 2026-11-02). */
export const BRIEF = [
  { code: "410201", name: "Cola", pack: "6 × 330 ml", price: "$12.50", cans: ["black"] },
  { code: "410202", name: "Cola zero", pack: "6 × 330 ml", price: "$12.50", cans: ["black"] },
  { code: "410203", name: "Duo pack", pack: "12 × 330 ml", price: "$24.00", cans: ["white", "black"] },
  { code: "410204", name: "Party pack", pack: "24 × 330 ml", price: "$45.00", cans: ["white", "white", "white", "white", "white", "white"], badge: true },
  { code: "410205", name: "Sparkling water", pack: "6 × 330 ml", price: "$12.50", cans: ["white"] },
  { code: "410206", name: "Lemon soda", pack: "6 × 330 ml", price: "$13.00", cans: ["white"] },
  { code: "410207", name: "Mixed case", pack: "24 × 330 ml", price: "$46.00", cans: ["white", "white", "white", "black", "black", "black"], badge: true },
  { code: "410208", name: "Ginger beer", pack: "6 × 330 ml", price: "$14.00", cans: ["black"] },
  { code: "410209", name: "Root beer", pack: "6 × 330 ml", price: "$14.00", cans: ["black"] },
  { code: "410210", name: "Tonic", pack: "6 × 330 ml", price: "$13.50", cans: ["white"] },
  { code: "410211", name: "Soda water", pack: "6 × 330 ml", price: "$11.00", cans: ["white"] },
  { code: "410212", name: "Iced tea", pack: "6 × 330 ml", price: "$13.50", cans: ["black"] },
];
const byCode = Object.fromEntries(BRIEF.map((p) => [p.code, p]));

// How a product's images start, as the plugin starts a product (DEFAULT_LINEUP: Line-up, level, a little gap); the two
// heroes as a designer might set them in the panel (the owner, 2026-11-02). The Party pack in Line-up, the first can in
// front, big on the left and the row receding to the right with Perspective 40 %; the cans overlapping by 20 % (spacing
// −0.20, Size left unset so the spacing governs, D37); Align images Middle (baseline "centre"), so the small cans at the
// back sit on the cell's middle, not its foot; the row centred in its cell; Scale 95 %. The Mixed case in Pins:
// three rows of two set by hand (rowCounts), each row back 10 % smaller (Perspective) and riding 90 % up behind the one
// in front (Space down −90 %), centred in its cell, Scale 90 %.
const PLAIN = E.modeStart("line");
const SETTINGS = {
  "410204": { ...E.modeStart("line"), spacing: -0.2, size: null, perspective: 0.4, baseline: "centre", alignY: "centre", scale: 0.95 },
  "410207": { ...E.modeStart("pins"), rows: 3, rowCounts: [2, 2, 2], gapY: -0.9, perspective: 0.1, alignY: "centre", scale: 0.9 },
};

/** The content area of a page: the page less its margins, inside and outside swapped on facing pages. */
function contentOf(side) {
  const left = side === "left" ? MARGIN.outside : MARGIN.inside, right = side === "left" ? MARGIN.inside : MARGIN.outside;
  return { x: left, y: MARGIN.top, w: PAGE.w - left - right, h: PAGE.h - MARGIN.top - MARGIN.bottom };
}

/** The box of a span of cells on a page's grid (`across` × `down`, GAP between), col and row from 0. */
function slot(side, grid, col, row, cols = 1, rows = 1) {
  const c = contentOf(side);
  const cw = (c.w - GAP * (grid.across - 1)) / grid.across, ch = (c.h - GAP * (grid.down - 1)) / grid.down;
  return { x: c.x + col * (cw + GAP), y: c.y + row * (ch + GAP), w: cols * cw + (cols - 1) * GAP, h: rows * ch + (rows - 1) * GAP };
}

/** The demo's price design ("$X.XX each", src/assets/js/assemblr-demo.js priceSvg), the price written in: digits only. */
export function priceSvg(price) {
  const [d = "0", c = "00"] = String(price).replace(/[^\d.]/g, "").split(".");
  const dollars = (d.replace(/^0+(?=\d)/, "") || "0").slice(0, 4), cents = (c + "00").slice(0, 2);
  const big = [66, 66, 46, 38][dollars.length - 1], dw = dollars.length * big * 0.6, x0 = (150 - (14 + 2 + dw + 4 + 38)) / 2;
  const t = (x, y, size, weight, fill, str) => `<text x="${x.toFixed(1)}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}">${str}</text>`;
  return `<svg viewBox="0 0 150 90"><rect width="150" height="90" rx="10" fill="#fff"/>${t(x0, 40, 24, 700, "#111", "$")}${t(x0 + 16, 72, big, 700, "#111", dollars)}${t(x0 + 20 + dw, 44, 32, 700, "#111", cents)}${t(x0 + 21 + dw, 70, 15, 600, "#888", "each")}</svg>`;
}

/**
 * One page of a grid filled from the head of `items` ({code, span: [cols, rows]?}), as the plugin fills it
 * (catalague-producer src/core/page/pack.ts packPage, without its pinned cells or span clamping): each product in turn
 * takes the first cell from the last one placed where its span is free, and the page ends at the first that has none;
 * the rest go on to the next page. Returns the placed cells, {code, col, row, colSpan, rowSpan}.
 */
function packPage(items, cols, rows) {
  const taken = new Array(cols * rows).fill(false);
  const free = (col, row, cs, rs) => {
    if (col + cs > cols || row + rs > rows) return false;
    for (let y = row; y < row + rs; y++) for (let x = col; x < col + cs; x++) if (taken[y * cols + x]) return false;
    return true;
  };
  const cells = [];
  let cursor = 0;
  for (const item of items) {
    const [cs, rs] = item.span ?? [1, 1];
    let at = -1;
    for (let k = cursor; k < cols * rows; k++) if (free(k % cols, Math.floor(k / cols), cs, rs)) { at = k; break; }
    if (at < 0) break;
    const col = at % cols, row = Math.floor(at / cols);
    for (let y = row; y < row + rs; y++) for (let x = col; x < col + cs; x++) taken[y * cols + x] = true;
    cells.push({ code: item.code, col, row, colSpan: cs, rowSpan: rs });
    cursor = at + 1;
  }
  return cells;
}

/** A product's cell in a box: its image area laid out by the engine, a NEW badge on its corner if it has one, its copy. */
export function productCell(code, box, opts = {}) {
  const p = byCode[code];
  const copy = opts.copy ?? COPY;
  const img = { w: box.w, h: box.h - copy };
  const laid = laidOut(img.w, img.h, p.cans.map((c) => `can-${c}.psd`), opts.params ?? SETTINGS[code] ?? PLAIN);
  const [badge] = p.badge || opts.badge ? cornerStack(img.w, img.h, "tr", [1], { insetX: 8, insetY: 8, maxW: opts.badgeSize ?? 40, maxH: opts.badgeSize ?? 40 }) : [];
  const [price] = opts.priceTag ? cornerStack(img.w, img.h, "bl", [PRICE_ASPECT], { insetX: 8, insetY: 8, maxW: 56, maxH: 56 }) : [];
  return { kind: "product", ...round(box), copyH: copy, img, cans: laid.cans, evidence: laid.evidence, badge, price: price && { ...price, svg: priceSvg(p.price) }, p };
}

const round = (b) => ({ x: r1(b.x), y: r1(b.y), w: r1(b.w), h: r1(b.h) });
const pct = (v, of) => r1((v / of) * 1000) / 10;

/** A box as left/top/width/height percentages of a parent W × H: what the drawings place by. */
export function place(b, W, H) {
  return `left: ${pct(b.x, W)}%; top: ${pct(b.y, H)}%; width: ${pct(b.w, W)}%; height: ${pct(b.h, H)}%`;
}

// The price list: a table insert filled from its own sheet (D54), here the brief's codes, names, packs and prices.
const TABLE = { head: ["Code", "Product", "Pack", "Price"], rows: BRIEF.slice(0, 6).map((p) => [p.code, p.name, p.pack, p.price]) };

/** A page: its side, its margins as a box, its cells. */
function page(side, number, cells) {
  return { side, number, w: PAGE.w, h: PAGE.h, margins: round(contentOf(side)), cells };
}

/** The hero's spread: pages 2 and 3, and the features scattered over it. */
function spread() {
  const g = { across: 3, down: 3 };
  const left = page("left", 2, [
    productCell("410204", slot("left", g, 0, 0, 3, 1), { priceTag: true }),
    productCell("410201", slot("left", g, 0, 1)),
    productCell("410202", slot("left", g, 1, 1)),
    productCell("410203", slot("left", g, 2, 1)),
    { kind: "table", ...round(slot("left", g, 0, 2, 3, 1)), table: TABLE, title: "Price list" },
  ]);
  const right = page("right", 3, [
    { kind: "ad", ...round(slot("right", g, 0, 0, 3, 1)), title: "Summer range", sub: "Ice cold, all season", file: "Summer advert.pdf" },
    productCell("410207", slot("right", g, 0, 1, 2, 2), { priceTag: true }),
    productCell("410205", slot("right", g, 2, 1)),
    productCell("410206", slot("right", g, 2, 2)),
  ]);
  // A feature: the point it is about (x, y), in the spread's points (the right page from 595), and where its label
  // sits (lx, ly): down the pasteboard either side, or in the pages' top and bottom margins, its line short. `side`:
  // "left" ends the label at lx, "right" starts it there.
  const R = PAGE.w;
  const [hero, first, , , table] = left.cells, [ad, mixed, , lower] = right.cells;
  const TOP = MARGIN.top / 2, BOTTOM = PAGE.h - MARGIN.bottom / 2, OUT_L = -14, OUT_R = PAGE.w * 2 + 14;
  // In a margin a label runs on one line (`wide`); down the pasteboard it wraps to the pasteboard's width.
  // `special`: a label drawn in blue, what the spread is about (the owner, 2026-11-02).
  const f = (x, y, lx, ly, side, text, special = false) => ({ x: r1(x), y: r1(y), lx: r1(lx), ly: r1(ly), side, text, wide: ly === TOP || ly === BOTTOM, special });
  // A point on one of a cell's cans (back to front, as laidOut gives them), `fy` of the way down it.
  const onCan = (c, i, fy = 0.5) => { const k = c.cans.at(i); return [c.x + k.x + k.w / 2, c.y + k.y + k.h * fy]; };
  // "Layout remains fully editable": about the page, not a product (the owner, 2026-11-02), so its line runs straight
  // down the advert, between its title and its cans, to the gap under it, where the grid's rows meet.
  const editX = R + ad.x + ad.w * 0.52;
  const features = [
    f(...onCan(hero, 3, 0.3), 40, TOP, "right", "Products auto fit into the cell areas", true),
    f(...onCan(hero, -1, 0.62), OUT_L, onCan(hero, -1, 0.62)[1], "left", "Images laid out by Assemblr layout engine"),
    f(hero.x + hero.badge.x + hero.badge.w * 0.15, hero.y + hero.badge.y + hero.badge.h * 0.85, 330, TOP, "right", "Badges and prices on the corners"),
    f(first.x + first.w * 0.5, first.y + first.img.h * 0.45, OUT_L, first.y + first.img.h * 0.45, "left", "Images found by product code or product named folders"),
    f(first.x - 3, first.y + first.img.h + 12, OUT_L, first.y + first.img.h + 30, "left", "Copy from your Excel brief mapped to paragraph styles"),
    f(left.margins.x, left.margins.y + left.margins.h * 0.86, OUT_L, left.margins.y + left.margins.h * 0.86, "left", "Auto fits to your page margin"),
    f(table.x + table.w * 0.42, table.y + table.h * 0.62, 70, BOTTOM, "right", "Tables built from Excel data and a reference table design"),
    f(R + ad.x + ad.w * 0.8, ad.y + ad.h * 0.4, OUT_R, ad.y + ad.h * 0.4, "right", "Inserts: place additional non‑product data like InDesign files, PDFs, images"),
    f(R + lower.x + lower.w * 0.5, lower.y - GAP / 2, OUT_R, lower.y - GAP / 2, "right", "A live grid: change it, the pages re-flow"),
    f(R + lower.x + 42, lower.y + lower.img.h + 40, OUT_R, lower.y + lower.img.h + 40, "right", "Edits made to text can sync back to spreadsheet"),
    f(editX, ad.y + ad.h + GAP / 2, editX, TOP, "left", "Layout remains fully editable at any time", true),
    // From the price device down the inside margin, clear of the Mixed case's copy, to the bottom margin.
    f(R + mixed.x + mixed.price.x, mixed.y + mixed.price.y + mixed.price.h * 0.5, R + 4, BOTTOM, "right", "Price point device auto generated from a separate INDD price device"),
  ];
  return { w: PAGE.w * 2, h: PAGE.h, pages: [left, right], features };
}

/** How it works's drawings (panel/catalogue-producer/how-*.njk). */
function how() {
  // Built from the brief: its first rows, the image folder, and the Duo pack's cell, its two files found by its code.
  const pick = "410203";
  const files = [
    { name: "410201.psd", code: "410201" },
    { name: "410202.psd", code: "410202" },
    { name: "410203 white.psd", can: "white", code: pick },
    { name: "410203 black.psd", can: "black", code: pick },
    { name: "410204 front.psd", code: "410204" },
  ].map((f) => ({ ...f, src: CAN[f.can ?? byCode[f.code].cans[0]], on: f.code === pick }));
  const brief = { head: ["Code", "Name", "Pack", "Price"], rows: BRIEF.slice(0, 5).map((p) => ({ cells: [p.code, p.name, p.pack, p.price], on: p.code === pick })) };
  const cell = productCell(pick, { x: 0, y: 0, w: 200, h: 250 }, { copy: 62 });

  // A live grid, then the same page set to Free (the owner, 2026-11-02). The grid: the page that starts at the Party
  // pack at 4 × 3, cells joined, its products packed in the brief's order (packPage): the Party pack across the page,
  // Sparkling water two across and two down, Lemon soda two across, the next two in the cells left, the rest on to the
  // next page. `ghost`: the cells drawn over the page as boxes, what is in them faded.
  const FROM = BRIEF.findIndex((p) => p.code === "410204");
  const g4 = { across: 4, down: 3 };
  const packed = packPage(BRIEF.slice(FROM).map((p) => ({ code: p.code, span: { "410204": [4, 1], "410205": [2, 2], "410206": [2, 1] }[p.code] })), g4.across, g4.down);
  const grid = {
    ...page("left", 2, packed.map((c) => ({
      ...productCell(c.code, slot("left", g4, c.col, c.row, c.colSpan, c.rowSpan), { copy: 50 }),
      joined: c.colSpan > 1 || c.rowSpan > 1 ? [c.colSpan, c.rowSpan] : null,
    }))),
    ghost: true, label: `Grid ${g4.across} × ${g4.down}`,
  };
  // A label over the two cells under the 2 × 1, its line up to the can in it: what is in a cell is laid out again for
  // the cell's new size.
  const grown = grid.cells.find((c) => c.p.code === "410206"), can = grown.cans.at(-1);
  grid.features = [{ x: r1(grown.x + can.x + can.w / 2), y: r1(grown.y + can.y + can.h * 0.6), lx: r1(grown.x + grown.w / 2), ly: r1(grown.y + grown.h + GAP + 70), side: "centre", text: "Auto resize between cells" }];
  // Free (D15): the plugin places a product once and never moves it again, the designer arranges the page by hand;
  // what is in a cell is still laid out for the cell, wherever and whatever size it is. Cells of no grid, inside the
  // margins (the left page's content area is x 30–555, y 42–792).
  const FREE = [
    ["410204", 30, 42, 340, 250], ["410205", 384, 92, 171, 290], ["410207", 30, 306, 210, 290],
    ["410206", 254, 396, 301, 200], ["410208", 130, 610, 200, 182], ["410209", 344, 610, 140, 182],
  ];
  const free = { ...page("left", 2, FREE.map(([code, x, y, w, h]) => productCell(code, { x, y, w, h }, { copy: 50 }))), ghost: true, label: "Free" };

  // Products by Assemblr: one product's cell up close, what makes it up labelled.
  const big = productCell("410204", { x: 16, y: 14, w: 290, h: 300 }, { copy: 70, priceTag: true });
  const LX = 326;
  const bigFeatures = [
    { x: r1(big.x + big.badge.x + big.badge.w), y: r1(big.y + big.badge.y + big.badge.h * 0.5), lx: LX, ly: r1(big.y + big.badge.y + big.badge.h * 0.5), side: "right", text: "The corners: badges and prices" },
    { x: r1(big.x + big.w * 0.55), y: r1(big.y + big.img.h * 0.6), lx: LX, ly: r1(big.y + big.img.h * 0.62), side: "right", text: "The image area: Assemblr's layout engine" },
    { x: r1(big.x - 4), y: r1(big.y + big.img.h + 14), lx: LX, ly: r1(big.y + big.img.h + 50), side: "right", text: "The copy: the brief's columns" },
  ];

  // Inside the margins: page 4 its products, a row of dark cans over a row of light, and a price list across its last
  // row; page 5 a full-page advert with bleed, the document's bleed on the outer edges and none at the spine (D53 (2)).
  const g = { across: 3, down: 3 };
  const BLEED = 9;
  const marginsLeft = page("left", 4, [
    ...["410208", "410209", "410212", "410205", "410210", "410211"].map((code, i) => productCell(code, slot("left", g, i % 3, Math.floor(i / 3)), { copy: 50 })),
    { kind: "table", ...round(slot("left", g, 0, 2, 3, 1)), table: TABLE, title: "Price list" },
  ]);
  const marginsRight = { ...page("right", 5, [{ kind: "ad", x: 0, y: -BLEED, w: PAGE.w + BLEED, h: PAGE.h + 2 * BLEED, title: "Summer range", sub: "Ice cold, all season", bleed: true }]), bleed: BLEED };
  const lm = marginsLeft.margins;
  const marginFeatures = [
    { x: lm.x, y: lm.y, lx: 70, ly: MARGIN.top / 2, side: "right", wide: true, text: "The page inside its margins" },
    { x: r1(lm.x + lm.w * 0.5), y: r1(slot("left", g, 0, 2).y + 100), lx: 70, ly: PAGE.h - MARGIN.bottom / 2, side: "right", wide: true, text: "A table, three cells wide" },
    { x: r1(PAGE.w * 2 + BLEED), y: 300, lx: r1(PAGE.w * 2 - 30), ly: 300, side: "left", wide: true, text: "A PDF, full page with bleed" },
  ];


  // The product list: four products, the Duo pack lifted to move it up, and in the Party pack's strip a can lifted to
  // move it along.
  const list = [
    { n: 1, code: "410201", page: "P. 2" },
    { n: 2, code: "410203", page: "P. 2", dropBefore: true },
    { n: 3, code: "410202", page: "P. 2", lifted: true },
    { n: 4, code: "410204", page: "P. 2", liftAt: 3 },
  ].map((r) => ({ ...r, name: byCode[r.code].name, images: byCode[r.code].cans.map((c) => ({ src: CAN[c], ext: "PSD" })) }));

  return {
    brief: { brief, files, cell, pick },
    grid: { grid, free },
    product: { w: 530, h: 330, cell: big, features: bigFeatures },
    margins: { w: PAGE.w * 2, h: PAGE.h, pages: [marginsLeft, marginsRight], features: marginFeatures },
    list,
  };
}

export function catalogueArt() {
  return { spread: spread(), how: how() };
}

export { CAN };
