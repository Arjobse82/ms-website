// Assemblr's live demo (partials/assemblr-demo.njk): the plugin's own layout engine (assemblr-engine.js, built from its
// source by scripts/build-assemblr-engine.sh) and the plugin's own tools, in the browser. The page plays InDesign, with a
// product of cans on it; the panel beside it has the plugin's two tiles, their tools named, ranged and grouped as
// Assemblr's panel has them (src/assemblr/ui/sections.ts, overlays.ts): Layout, with its modes, fields and image strip,
// and Overlays, with its corners. Nothing here lays anything out itself:
// - a picture is measured as the Photoshop host measures a layer: its alpha read at a long side of 512, traced for the
//   subject box (threshold 254) and the silhouette (`traceAlpha`, `silhouette`);
// - the arrangement is the panel's preview solve, the page's own answer (`solvePreview`), and each picture is placed so
//   its subject lands on the solved rect (`imageTarget`, the Photoshop host's maths);
// - the line-up's axis on the page is the panel drawing's control (`controlAxis`, `dragAngle`, `sizeFromDrag`), Pins'
//   rows are the panel's (`resolveCounts`), and a corner's overlays are stacked by `solveStack`, its Resize scale stamped
//   by `stampMaster`.
// Pictures and artwork a visitor adds are read here and never leave the browser.

const engineUrl = new URL(`./assemblr-engine.js${new URL(import.meta.url).search}`, import.meta.url);
const E = await import(engineUrl.href);

const READ_LONG = 512;
const MAX = 10;
// The page is a document this many points wide (A4's short side), so the panel's pt fields mean what they mean in InDesign.
const PAGE_PT = 595;
const CANS = [
  { src: new URL("../img/can-white.webp", import.meta.url).href, label: "White can" },
  { src: new URL("../img/can-black.webp", import.meta.url).href, label: "Black can" },
];
// Clear space round each can, in can heights [top, left, bottom, right]: packshots never agree on it, which is the
// whole problem.
const PADS = [
  [0.03, 0.04, 0.03, 0.04], [0.2, 0.1, 0.04, 0.14], [0.06, 0.24, 0.22, 0.06], [0.3, 0.08, 0.02, 0.1], [0.05, 0.16, 0.14, 0.26],
  [0.14, 0.05, 0.3, 0.12], [0.02, 0.2, 0.1, 0.02], [0.24, 0.02, 0.08, 0.2], [0.1, 0.12, 0.2, 0.08], [0.04, 0.06, 0.26, 0.18],
];
const AREA_START = { x: 0.08, y: 0.1, w: 0.84, h: 0.8 };
const MODE_LABELS = { line: "Line-up", grid: "Grid", mosaic: "Mosaic", pins: "Pins", puzzle: "Puzzle" };
const MODE_ICONS = {
  line: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="4.6" cy="5" r="3"/><circle cx="7.6" cy="7.8" r="3.8"/><circle cx="10.6" cy="10.6" r="4.4"/></svg>',
  grid: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="4" height="4"/><rect x="6" y="1" width="4" height="4"/><rect x="11" y="1" width="4" height="4"/><rect x="1" y="6" width="4" height="4"/><rect x="6" y="6" width="4" height="4"/><rect x="11" y="6" width="4" height="4"/><rect x="1" y="11" width="4" height="4"/><rect x="6" y="11" width="4" height="4"/><rect x="11" y="11" width="4" height="4"/></svg>',
  mosaic: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="9"/><rect x="8" y="1" width="7" height="5"/><rect x="8" y="7" width="7" height="8"/><rect x="1" y="11" width="6" height="4"/></svg>',
  pins: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.8"/><circle cx="5.5" cy="7.5" r="1.8"/><circle cx="10.5" cy="7.5" r="1.8"/><circle cx="3" cy="12.5" r="1.8"/><circle cx="8" cy="12.5" r="1.8"/><circle cx="13" cy="12.5" r="1.8"/></svg>',
  puzzle: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 5h3.2a1.8 1.8 0 1 1 3.6 0H12v3.2a1.8 1.8 0 1 1 0 3.6V15H2z"/></svg>',
};
// The panel's two tiles.
const TILES = [
  ["layout", "Layout", MODE_ICONS.line],
  ["overlays", "Overlays", '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="3.5" width="11" height="11" rx="1.5"/><circle cx="12" cy="4" r="3.2" fill="currentColor" stroke="none"/></svg>'],
];
const RACK_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 4h20L12 21z"/></svg>';
const PYRAMID_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l10 17H2z"/></svg>';
const ALIGN_ICONS = {
  top: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1.5" width="14" height="1.4"/><rect x="3" y="4" width="4" height="9"/><rect x="9" y="4" width="4" height="5"/></svg>',
  centre: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="7.3" width="14" height="1.4"/><rect x="3" y="3" width="4" height="10"/><rect x="9" y="5" width="4" height="6"/></svg>',
  bottom: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="13.1" width="14" height="1.4"/><rect x="3" y="3" width="4" height="9"/><rect x="9" y="7" width="4" height="5"/></svg>',
};
const STACK_ICONS = {
  across: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="5" width="4" height="6"/><rect x="6" y="5" width="4" height="6"/><rect x="11" y="5" width="4" height="6"/></svg>',
  down: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="5" y="1" width="6" height="4"/><rect x="5" y="6" width="6" height="4"/><rect x="5" y="11" width="6" height="4"/></svg>',
};
const CORNER_NAMES = { tl: "Top left", tr: "Top right", bl: "Bottom left", br: "Bottom right" };
/** A corner's chip: the product in miniature, its corner filled where something is on it. */
const cornerIcon = (c, held) => {
  const x = c.endsWith("l") ? 3 : 9, y = c.startsWith("t") ? 3 : 8;
  return `<svg viewBox="0 0 16 14" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1" y="1" width="14" height="12" rx="1.5"/><rect x="${x}" y="${y}" width="4" height="3"${held ? ' fill="currentColor"' : ""}/></svg>`;
};

// Badges as a document's overlays folder would hold them (the plugin takes any artwork file; these are the demo's own).
const BADGES = {
  new: { label: "new", aspect: 1, svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#111"/><text x="50" y="61" text-anchor="middle" font-family="Inter, sans-serif" font-size="29" font-weight="700" letter-spacing="1" fill="#fff">NEW</text></svg>' },
  sale: { label: "sale", aspect: 160 / 70, svg: '<svg viewBox="0 0 160 70"><rect width="160" height="70" rx="10" fill="#3372f6"/><text x="80" y="47" text-anchor="middle" font-family="Inter, sans-serif" font-size="34" font-weight="700" letter-spacing="2" fill="#fff">SALE</text></svg>' },
  off: { label: "20-off", aspect: 1, svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#111" stroke-width="5"/><text x="50" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="27" font-weight="700" fill="#111">−20%</text></svg>' },
  pack: { label: "4-pack", aspect: 150 / 56, svg: '<svg viewBox="0 0 150 56"><rect width="150" height="56" rx="28" fill="#111"/><text x="75" y="37" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="#fff">4 PACK</text></svg>' },
};
// The price design ("$X.XX each", as a designer's InDesign file would have it): the product's price is written into it,
// digits only, so nothing a visitor types is ever markup.
const PRICE_ASPECT = 150 / 90;
function priceSvg(price) {
  const [d = "0", c = "00"] = String(price).replace(/[^\d.]/g, "").split(".");
  const dollars = (d.replace(/^0+(?=\d)/, "") || "0").slice(0, 4), cents = (c + "00").slice(0, 2);
  // "$", the dollars large, the cents over "each": measured at Inter's digit width and centred on the card.
  const big = [66, 66, 46, 38][dollars.length - 1], dw = dollars.length * big * 0.6, x0 = (150 - (14 + 2 + dw + 4 + 38)) / 2;
  const t = (x, y, size, weight, fill, s) => `<text x="${x.toFixed(1)}" y="${y}" font-family="Inter, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${s}</text>`;
  return `<svg viewBox="0 0 150 90"><rect width="150" height="90" rx="10" fill="#fff"/>${t(x0, 40, 24, 700, "#111", "$")}${t(x0 + 16, 72, big, 700, "#111", dollars)}${t(x0 + 20 + dw, 44, 32, 700, "#111", cents)}${t(x0 + 21 + dw, 70, 15, 600, "#888", "each")}</svg>`;
}

// Where each mode starts, as the plugin starts it (Grid: Assemble's own start, centred), but Line-up's row centred in
// the frame (alignY "centre", the owner, 2026-11-02), where the plugin sits it at the foot; its images still aligned
// at Bottom.
const startOf = (mode) => (mode === "grid" ? { ...E.modeStart(mode), cols: 0, alignX: "centre", alignY: "centre" }
  : mode === "line" ? { ...E.modeStart(mode), alignY: "centre" } : E.modeStart(mode));

// Sizes and turns as a designer gives them by hand on the page: a weight (an AREA ratio, kept by Line-up and Puzzle; Grid,
// Mosaic and Pins set the sizes themselves) and, in Puzzle, a turn (InDesign's sense: positive is counter-clockwise).
// Dealt from a seed, so a layout holds still until Randomise size deals again.
function handOf(seed, n) {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: n }, () => {
    const scale = 0.6 + rand() * 0.65; // 60 %–125 % of the height
    const turned = rand() < 0.45;
    return { weight: scale * scale, angle: turned ? Math.round((rand() < 0.5 ? -1 : 1) * (12 + rand() * 78)) : 0 };
  });
}
const UNTOUCHED = { weight: 1, angle: 0 };

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v; // only ever the demo's own constant artwork and icons
    else el.setAttribute(k, v === true ? "" : v);
  }
  el.append(...kids.flat(Infinity).filter((kid) => kid != null && kid !== false));
  return el;
}

/** A picture's alpha plane at a long side of READ_LONG, the size the Photoshop host reads at. */
function alphaOf(img) {
  const w = img.naturalWidth, ht = img.naturalHeight, s = Math.min(1, READ_LONG / Math.max(w, ht));
  const cw = Math.max(1, Math.round(w * s)), ch = Math.max(1, Math.round(ht * s));
  const g = Object.assign(document.createElement("canvas"), { width: cw, height: ch }).getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0, cw, ch);
  const rgba = g.getImageData(0, 0, cw, ch).data, alpha = new Uint8Array(cw * ch);
  for (let p = 0; p < alpha.length; p++) alpha[p] = rgba[p * 4 + 3];
  return { width: cw, height: ch, alpha };
}

/** The subject box and silhouette, as fractions of the picture, and the picture's aspect. */
function measure(img) {
  const mask = alphaOf(img), aspect = img.naturalWidth / img.naturalHeight;
  const t = E.traceAlpha(mask);
  if (!t.box || t.inside >= mask.width * mask.height) return { box: [0, 0, 1, 1], aspect };
  const b = t.box, shape = E.silhouette(mask);
  return { box: [b[0] / mask.height, b[1] / mask.width, b[2] / mask.height, b[3] / mask.width], aspect, ...(shape.length ? { shape } : {}) };
}

/** A measured can inside a frame with `pad` of clear space round it: the same subject, in the larger picture's fractions. */
function padded(m, pad) {
  const cw = m.aspect, W = cw + pad[1] + pad[3], H = 1 + pad[0] + pad[2];
  const fx = (x) => (pad[1] + x * cw) / W, fy = (y) => (pad[0] + y) / H;
  return {
    subject: { box: [fy(m.box[0]), fx(m.box[1]), fy(m.box[2]), fx(m.box[3])], aspect: W / H, ...(m.shape ? { shape: m.shape.map((ring) => ring.map((q) => ({ x: fx(q.x), y: fy(q.y) }))) } : {}) },
    inner: { left: pad[1] / W, top: pad[0] / H, width: cw / W, height: 1 / H },
  };
}

const loaded = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.decoding = "async";
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`could not read ${src}`));
  img.src = src;
});

const pct = (v) => Math.round(v * 100);
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export async function startDemo(root) {
  const page = root.querySelector("[data-demo-page]");
  const panel = root.querySelector("[data-demo-panel]");
  const toolbar = root.querySelector("[data-demo-toolbar]");
  const liveRegion = root.querySelector("[data-demo-live]");
  const cans = await Promise.all(CANS.map(async (c) => ({ ...c, m: measure(await loaded(c.src)) })));

  /* State ------------------------------------------------------------------------------------------------------------ */

  let S;
  let uid = 0;
  const canPicture = (i, hand) => {
    const can = cans[i % cans.length], p = padded(can.m, PADS[i % PADS.length]);
    return { key: `can-${i}`, label: can.label, src: can.src, subject: p.subject, inner: p.inner, on: true, hand };
  };
  const overlay = (kind, id, extra = {}) => ({ kind, id, key: `ov-${++uid}`, ...extra });
  function fresh() {
    const hand = handOf(7, MAX);
    S = {
      nextCan: 6, seed: 7,
      pictures: Array.from({ length: 6 }, (_, i) => canPicture(i, hand[i])),
      area: { ...AREA_START },
      modes: Object.fromEntries(E.MODES.map((mode) => [mode, startOf(mode)])),
      overlays: { tl: [], tr: [overlay("badge", "new")], bl: [overlay("price", "price")], br: [] },
      // The plugin's corner, its Max size as a share of the product (its % setting), so badges read at any screen size.
      setups: Object.fromEntries(E.CORNERS.map((c) => [c, { ...E.DEFAULT_CORNER, sizing: "pct", maxWPct: 18, maxHPct: 18 }])),
      corner: "tr", price: "2.50", tile: "layout", evidence: [], handleSide: 1,
    };
    S.params = S.modes.line;
  }
  const on = () => S.pictures.filter((p) => p.on);

  /* The page: pictures, the product's frame, its overlays and the line-up's axis ------------------------------------- */

  const frame = h("div", { class: "ad-area" });
  const handles = ["tl", "tr", "bl", "br"].map((corner) =>
    h("button", { class: `ad-handle ad-handle-${corner}`, type: "button", "data-corner": corner, "aria-label": `Resize the product's frame from its ${CORNER_NAMES[corner].toLowerCase()} corner (arrow keys)` }));
  // The Overlays tile's drawing on the page: a mark on each corner, which opens that corner.
  const markers = E.CORNERS.map((c) => h("button", { class: `ad-marker ad-marker-${c}`, type: "button", "aria-label": `Open the ${CORNER_NAMES[c].toLowerCase()} corner`, onclick: () => openCorner(c, false) }));
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs) => { const el = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); return el; };
  const axis = svgEl("svg", { class: "ad-axis" });
  frame.append(axis, ...handles, ...markers);
  page.append(frame);

  const elements = new Map(); // picture key -> { el, img }
  function syncElements() {
    for (const [key, { el }] of elements) if (!S.pictures.some((p) => p.key === key)) { el.remove(); elements.delete(key); }
    for (const p of S.pictures) {
      if (elements.has(p.key)) continue;
      const img = h("img", { src: p.src, alt: "", draggable: "false" });
      Object.assign(img.style, { left: `${p.inner.left * 100}%`, top: `${p.inner.top * 100}%`, width: `${p.inner.width * 100}%`, height: `${p.inner.height * 100}%` });
      const el = h("div", { class: "ad-item is-new" }, img);
      page.insertBefore(el, frame);
      elements.set(p.key, { el, img });
    }
  }

  /**
   * A drag: every move while the button is down goes to `move`, wherever the pointer is (heard on the window, so nothing
   * redrawn under it can end the drag); letting go only ends it.
   */
  function dragging(el, event, move, done = () => {}) {
    event.preventDefault();
    const id = event.pointerId;
    try { el.setPointerCapture(id); } catch { /* the window hears it anyway */ }
    root.classList.add("is-dragging");
    const onMove = (e) => { if (e.pointerId === id) move(e); };
    const onUp = (e) => {
      if (e.pointerId !== id) return;
      root.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      done();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  const size = () => ({ w: S.area.w * page.clientWidth, h: S.area.h * page.clientHeight });
  const ptPerPx = () => PAGE_PT / page.clientWidth;
  const areaPt = () => { const s = size(), k = ptPerPx(); return { w: s.w * k, h: s.h * k }; };
  const keepsHand = () => S.params.mode === "line" || S.params.mode === "puzzle";
  const turnOf = (p) => (S.params.mode === "puzzle" ? p.hand.angle : 0);
  const subjectOf = (p) => {
    const s = keepsHand() && p.hand.weight !== 1 ? { ...p.subject, weight: p.hand.weight } : p.subject;
    return turnOf(p) ? { ...s, angle: turnOf(p) } : s;
  };
  const preview = () => { const s = size(); return { aspect: s.w / s.h, subjects: on().map(subjectOf) }; };
  const items = () => E.previewItems(preview(), S.params);
  const sizeNow = () => S.params.size ?? E.sizeOfSpacing(S.params.spacing, { items: items(), aspect: preview().aspect, params: S.params });

  function solve() {
    const W = page.clientWidth, H = page.clientHeight, s = size();
    for (const p of S.pictures) { const e = elements.get(p.key); if (e) e.el.hidden = !p.on; }
    Object.assign(frame.style, { left: `${S.area.x * 100}%`, top: `${S.area.y * 100}%`, width: `${S.area.w * 100}%`, height: `${S.area.h * 100}%` });
    if (!(s.w > 0) || !(s.h > 0)) return;
    const live = on();
    if (live.length) {
      const out = E.solvePreview(preview(), S.params);
      S.evidence = out.evidence;
      const ox = S.area.x * W, oy = S.area.y * H;
      for (const placed of out.items) {
        const p = live[placed.index], el = elements.get(p.key)?.el;
        if (!el) continue;
        const f = E.withBleed(p.subject.box, S.params.bleed), turn = turnOf(p);
        let rect = placed.rect, cx = 0, cy = 0;
        if (turn) {
          // The solver's rect is the box the turned subject sweeps: the subject upright, its own size, about the same middle.
          cx = ((rect[1] + rect[3]) / 2) * s.w; cy = ((rect[0] + rect[2]) / 2) * s.h;
          const a = ((f[3] - f[1]) * p.subject.aspect) / (f[2] - f[0]);
          const hs = E.uprightHeight((rect[2] - rect[0]) * s.h, a, turn), ws = a * hs;
          rect = [(cy - hs / 2) / s.h, (cx - ws / 2) / s.w, (cy + hs / 2) / s.h, (cx + ws / 2) / s.w];
        }
        const [l, t, r, b] = E.imageTarget([0, 0, s.w, s.h], rect, f);
        Object.assign(el.style, {
          left: `${ox + l}px`, top: `${oy + t}px`, width: `${r - l}px`, height: `${b - t}px`, zIndex: String(placed.z + 2),
          transformOrigin: turn ? `${cx - l}px ${cy - t}px` : "50% 50%",
          transform: turn ? `rotate(${-turn}deg)` : "none", // CSS turns clockwise; InDesign's positive is counter-clockwise
        });
      }
    } else S.evidence = ["No images are on: turn one on in the strip."];
    layOverlays(s);
    drawAxis(s);
    settle();
  }

  /** After a solve: new elements take their place without animating, and the engine's note reaches a screen reader. */
  let liveTimer = 0, said = "";
  function settle() {
    requestAnimationFrame(() => {
      elements.forEach(({ el }) => el.classList.remove("is-new"));
      badgeEls.forEach(({ el }) => el.classList.remove("is-new"));
    });
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => { const now = S.evidence[0] ?? ""; if (now !== said) { said = now; liveRegion.textContent = now; } }, 700);
  }

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; solve(); sync(); });
  };

  /* Corner overlays: each corner's stack, laid in points on the product's frame, so it follows every resize ---------- */

  // One element per overlay, kept as it moves from corner to corner, so a move or a swap glides there. Each is a button:
  // clicking a badge opens the Overlays tile on its corner.
  const badgeEls = new Map(); // overlay key -> { el, sig }
  const aspectOfOverlay = (o) => (o.kind === "price" ? PRICE_ASPECT : o.kind === "file" ? o.aspect : BADGES[o.id].aspect);
  const nameOf = (o) => (o.kind === "price" ? `The price, $${S.price}` : o.kind === "file" ? o.label : `The ${BADGES[o.id].label} badge`);
  function openOverlay(key) {
    const c = E.CORNERS.find((k) => S.overlays[k].some((o) => o.key === key));
    if (!c) return;
    const switched = S.tile !== "overlays";
    S.tile = "overlays";
    openCorner(c, false);
    if (switched) panel.scrollTop = 0;
  }
  function layOverlays(s) {
    const k = ptPerPx(), area = [0, 0, s.h * k, s.w * k], want = new Set();
    for (const c of E.CORNERS) {
      const list = S.overlays[c];
      const rects = E.solveStack(area, c, S.setups[c], list.map((o) => ({ aspect: aspectOfOverlay(o) })));
      list.forEach((o, i) => {
        want.add(o.key);
        let entry = badgeEls.get(o.key);
        if (!entry) {
          const el = h("button", { class: "ad-badge is-new", type: "button", onclick: () => openOverlay(o.key) });
          if (o.kind === "file") el.append(h("img", { src: o.src, alt: "" }));
          else if (o.kind === "badge") el.innerHTML = BADGES[o.id].svg;
          frame.append(el);
          entry = { el, sig: "" };
          badgeEls.set(o.key, entry);
        }
        if (o.kind === "price" && entry.sig !== S.price) { entry.el.innerHTML = priceSvg(S.price); entry.sig = S.price; }
        const [t, l, b, r] = rects[i];
        Object.assign(entry.el.style, { transform: `translate(${l / k}px, ${t / k}px)`, width: `${(r - l) / k}px`, height: `${(b - t) / k}px` });
        entry.el.setAttribute("aria-label", `${nameOf(o)}, ${CORNER_NAMES[c].toLowerCase()}: open its corner`);
        entry.el.classList.toggle("is-open", S.tile === "overlays" && c === S.corner);
      });
    }
    for (const [key, { el }] of badgeEls) if (!want.has(key)) { el.remove(); badgeEls.delete(key); }
    root.classList.toggle("show-markers", S.tile === "overlays");
    markers.forEach((m, i) => {
      const c = E.CORNERS[i];
      m.setAttribute("aria-pressed", String(c === S.corner));
      m.classList.toggle("has-badges", S.overlays[c].length > 0);
    });
  }

  /**
   * Another corner, as the panel's corner chips have it: with something on the open corner, its overlays MOVE there, or
   * SWAP with what is there, each corner's overlays keeping their size and spacing; with nothing on it, that corner opens.
   * The page's corner marks only ever open a corner.
   */
  function openCorner(to, move) {
    const from = S.corner;
    if (move && to !== from && S.overlays[from].length) {
      [S.overlays[from], S.overlays[to]] = [S.overlays[to], S.overlays[from]];
      [S.setups[from], S.setups[to]] = [S.setups[to], S.setups[from]];
    }
    S.corner = to;
    render();
    queue();
  }

  /* The line-up's axis, the panel drawing's control on the page: drag its end to turn the row and set its Size -------- */

  // Drawn once and moved, never rebuilt: an element taken out from under a held pointer would end its drag.
  const fan = svgEl("g", { class: "ad-fans" });
  const axisLine = svgEl("line", { class: "ad-axis-line" });
  const axisMid = svgEl("circle", { class: "ad-axis-mid", r: 5 });
  const grip = svgEl("g", { class: "ad-axis-grip", tabindex: "0", role: "slider", "aria-label": "The line-up's handle: drag it to turn the row and set its size; arrow keys too" });
  grip.append(svgEl("circle", { class: "ad-axis-hit", r: 22 }), svgEl("circle", { class: "ad-axis-handle", r: 9 }));
  axis.append(fan, axisLine, axisMid, grip);
  let axisHeld = false, handleAt = { x: 0, y: 0 };
  // While the button is down, the pointer turns the row (its direction from the middle, snapped every 5°, free with
  // Alt) and sizes it (how far along the line it is); the handle stays on the end being dragged. Letting go changes nothing.
  grip.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const box = frame.getBoundingClientRect(), off = { x: event.clientX - box.left - handleAt.x, y: event.clientY - box.top - handleAt.y };
    axisHeld = true;
    dragging(grip, event, (e) => {
      const ss = size(), R = ss.w / ss.h, mid = { x: R / 2, y: 0.5 };
      const p = { x: (e.clientX - box.left - off.x) / ss.h, y: (e.clientY - box.top - off.y) / ss.h };
      const angle = E.dragAngle(mid, p, e.altKey ? 0 : 5), t = (angle * Math.PI) / 180, along = E.alongLine(mid, angle, p);
      S.handleSide = along < 0 ? -1 : 1;
      patch({ angle, size: Math.max(0.01, E.sizeFromDrag(along, E.roomFrom(mid, { x: Math.cos(t), y: Math.sin(t) }, R))) });
    }, () => { axisHeld = false; queue(); });
  });
  grip.addEventListener("keydown", (event) => {
    const d = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, 0.05], ArrowDown: [0, -0.05] }[event.key];
    if (!d) return;
    event.preventDefault();
    patch({ angle: E.clampAngle(S.params.angle + d[0]), size: Math.min(1, Math.max(0.01, sizeNow() + d[1])) });
  });
  function drawAxis(s) {
    const show = S.params.mode === "line" && S.tile === "layout" && on().length > 0;
    axis.style.display = show ? "" : "none";
    if (!show) return;
    // The panel drawing's axis for the row's angle and Size, the same while dragging and after, on the handle's own end.
    const R = s.w / s.h, px = (p) => ({ x: p.x * s.h, y: p.y * s.h });
    const line = E.controlAxis(R, S.params.angle, sizeNow());
    const m = px(line.mid);
    let a = px(line.start), b = px(line.end);
    if (S.handleSide < 0) [a, b] = [b, a];
    axis.setAttribute("viewBox", `0 0 ${s.w} ${s.h}`);
    Object.entries({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }).forEach(([k, v]) => axisLine.setAttribute(k, v));
    axisMid.setAttribute("cx", m.x);
    axisMid.setAttribute("cy", m.y);
    handleAt = b;
    grip.setAttribute("transform", `translate(${b.x} ${b.y})`);
    grip.setAttribute("aria-valuetext", `${S.params.angle}°, size ${pct(sizeNow())}%`);
    // The fan while the handle is held: the angles it snaps to, every 5°, drawn through the line-up's middle.
    fan.replaceChildren();
    if (axisHeld) for (const deg of E.fanAngles(5, E.ANGLE_LIMIT)) {
      const t = (deg * Math.PI) / 180, u = { x: Math.cos(t), y: Math.sin(t) };
      for (const side of [1, -1]) fan.append(svgEl("line", { class: deg === S.params.angle ? "ad-fan is-on" : "ad-fan", x1: m.x + side * u.x * 28, y1: m.y + side * u.y * 28, x2: m.x + side * u.x * 60, y2: m.y + side * u.y * 60 }));
    }
  }

  /* The frame: drag or arrow a corner, as resizing the product's frame in InDesign ------------------------------------ */

  const MIN_W = 0.16, MIN_H = 0.22;
  function resizeFrom(corner, x, y) {
    let { x: l, y: t } = S.area, r = S.area.x + S.area.w, b = S.area.y + S.area.h;
    const clamp = (v) => Math.min(1, Math.max(0, v));
    if (corner.includes("l")) l = Math.min(clamp(x), r - MIN_W); else r = Math.max(clamp(x), l + MIN_W);
    if (corner.includes("t")) t = Math.min(clamp(y), b - MIN_H); else b = Math.max(clamp(y), t + MIN_H);
    S.area = { x: l, y: t, w: r - l, h: b - t };
    queue();
  }
  for (const handle of handles) {
    const corner = handle.dataset.corner;
    handle.addEventListener("pointerdown", (event) => {
      const box = page.getBoundingClientRect();
      dragging(handle, event, (e) => resizeFrom(corner, (e.clientX - box.left) / box.width, (e.clientY - box.top) / box.height));
    });
    handle.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 0.08 : 0.02;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
      if (!d) return;
      event.preventDefault();
      resizeFrom(corner, (corner.includes("l") ? S.area.x : S.area.x + S.area.w) + d[0], (corner.includes("t") ? S.area.y : S.area.y + S.area.h) + d[1]);
    });
  }
  new ResizeObserver(() => queue()).observe(page);

  /* The plugin's actions ------------------------------------------------------------------------------------------------ */

  function patch(p) {
    S.params = { ...S.params, ...p };
    S.modes[S.params.mode] = S.params;
    queue();
  }
  const forgetHand = () => S.pictures.forEach((p) => { p.hand = UNTOUCHED; });
  const handEdited = () => on().some((p) => p.hand.weight !== 1 || p.hand.angle !== 0);
  function addCan() {
    if (S.pictures.length >= MAX) return;
    const i = S.nextCan++;
    S.pictures.push(canPicture(i, handEdited() ? handOf(S.seed + i, 1)[0] : UNTOUCHED));
    syncElements(); render(); queue();
  }
  async function addFiles(files, intoCorner = null) {
    for (const file of [...files].filter((f) => /^image\/(png|webp|gif|svg\+xml|jpeg)$/.test(f.type))) {
      const src = URL.createObjectURL(file);
      try {
        const img = await loaded(src);
        if (intoCorner) S.overlays[intoCorner] = [...S.overlays[intoCorner], overlay("file", file.name, { src, label: file.name, aspect: img.naturalWidth / img.naturalHeight || 1 })];
        else {
          if (S.pictures.length >= MAX) { URL.revokeObjectURL(src); break; }
          S.pictures.push({ key: `own-${++uid}`, label: file.name, src, subject: measure(img), inner: { left: 0, top: 0, width: 1, height: 1 }, on: true, hand: UNTOUCHED });
        }
      } catch {
        URL.revokeObjectURL(src);
      }
    }
    syncElements(); render(); queue();
  }

  /* Controls: the panel's own names, ranges and groups --------------------------------------------------------------- */

  let syncs = [];
  const sync = () => syncs.forEach((f) => f());
  const btn = (label, onclick, extra = {}) => h("button", { class: "ad-btn", type: "button", onclick, ...extra }, label);

  /** A number field, as the panel's: its label with its unit, the value committed as it is typed. */
  function num({ label, get, set, min, max, step = 1 }) {
    const id = `ad-${++uid}`;
    const input = h("input", { class: "ad-num", id, type: "number", inputmode: "decimal", min, max, step });
    input.addEventListener("input", () => { if (input.value === "" || !Number.isFinite(Number(input.value))) return; set(Math.min(max, Math.max(min, Number(input.value)))); });
    input.addEventListener("change", () => { input.value = String(get()); });
    syncs.push(() => { if (document.activeElement !== input) input.value = String(get()); });
    return [h("label", { class: "ad-label", for: id }, label), input];
  }
  /** A slider, as the panel's bars under the modes and its Perspective: the value read out beside its name. */
  function bar({ label, get, set, min, max, step = 1, unit = "%", ends = null }) {
    const id = `ad-${++uid}`;
    const input = h("input", { class: "ad-slider", id, type: "range", min, max, step });
    const out = h("output", { class: "ad-value", for: id });
    input.addEventListener("input", () => set(Number(input.value)));
    syncs.push(() => { if (document.activeElement !== input) input.value = String(get()); out.textContent = `${get()}${unit ?? ""}`; });
    const end = ([icon, name]) => h("span", { class: "ad-end", role: "img", "aria-label": name, title: name, html: icon });
    return h("div", { class: "ad-bar" },
      h("div", { class: "ad-bar-head" }, h("label", { for: id }, label), unit == null ? null : out),
      h("div", { class: "ad-bar-track" }, ends ? end(ends[0]) : null, input, ends ? end(ends[1]) : null));
  }
  /** A segmented choice, as Align images and Stack: its name, then a bordered row of options, one pressed. */
  function segmented({ label, options, get, set, icons = null }) {
    const buttons = options.map(([value, text, name]) => h("button", { class: "ad-seg", type: "button", title: name ?? null, onclick: () => set(value) },
      icons ? h("span", { class: "ad-icon", html: icons[value] }) : null, text));
    syncs.push(() => buttons.forEach((b, i) => b.setAttribute("aria-pressed", String(options[i][0] === get()))));
    return h("div", { class: "ad-seg-row" }, h("span", { class: "ad-label" }, label), h("div", { class: "ad-segs", role: "group", "aria-label": label }, buttons));
  }
  function stepper(label, value, dec, inc) {
    const less = h("button", { class: "ad-step", type: "button", "aria-label": `${label}: one fewer`, onclick: dec.run }, "−");
    const more = h("button", { class: "ad-step", type: "button", "aria-label": `${label}: one more`, onclick: inc.run }, "+");
    const shown = h("span", { class: "ad-step-value" });
    syncs.push(() => { shown.textContent = String(value()); less.disabled = !dec.can(); more.disabled = !inc.can(); });
    return h("span", { class: "ad-stepper", role: "group", "aria-label": label }, less, shown, more);
  }
  function toggle(label, get, set) {
    const id = `ad-${++uid}`;
    const input = h("input", { type: "checkbox", role: "switch", id, class: "ad-switch" });
    input.addEventListener("change", () => set(input.checked));
    syncs.push(() => { input.checked = !!get(); });
    return [h("label", { class: "ad-label", for: id }, label), h("span", { class: "ad-cell" }, input)];
  }

  function layoutTile() {
    const mode = S.params.mode, out = [];
    // The modes, then the bars that sit under them (the panel's top bars).
    out.push(h("div", { class: "ad-modes", role: "group", "aria-label": "Arrangement" }, E.MODES.map((m) =>
      h("button", { class: "ad-mode", type: "button", "aria-pressed": String(m === mode), onclick: () => { if (m === S.params.mode) return; S.params = S.modes[m]; render(); queue(); } },
        h("span", { class: "ad-icon", html: MODE_ICONS[m] }), MODE_LABELS[m]))));
    if (mode === "grid" || mode === "pins") {
      out.push(bar({ label: "Space across", min: -100, max: 50, get: () => pct(S.params.gap), set: (v) => patch({ gap: v / 100 }) }));
      out.push(bar({ label: "Space down", min: -100, max: 50, get: () => pct(S.params.gapY), set: (v) => patch({ gapY: v / 100 }) }));
    }
    if (mode === "mosaic") {
      out.push(bar({ label: "Breathing space", min: 0, max: 50, get: () => pct(S.params.gap), set: (v) => patch({ gap: v / 100 }) }));
      const choices = () => Math.max(1, E.mosaicChoices(preview(), S.params)), at = () => ((S.params.cycle % choices()) + choices()) % choices();
      const shown = h("span", { class: "ad-value" });
      syncs.push(() => { shown.textContent = `${at() + 1} of ${choices()}`; });
      out.push(h("div", { class: "ad-bar" }, h("div", { class: "ad-bar-head" }, h("span", {}, "Rotation"), h("span", { class: "ad-rotation" },
        btn("‹", () => patch({ cycle: S.params.cycle - 1 }), { "aria-label": "Previous arrangement" }), shown, btn("›", () => patch({ cycle: S.params.cycle + 1 }), { "aria-label": "Next arrangement" })))));
    }

    if (mode === "line") out.push(segmented({ label: "Align images", options: [["top", "Top"], ["centre", "Middle"], ["bottom", "Bottom"]], icons: ALIGN_ICONS, get: () => S.params.baseline, set: (v) => patch({ baseline: v }) }));
    if (mode === "grid") out.push(gridCount());
    if (mode === "pins") out.push(...pinsFields());

    const form = [];
    if (mode === "line") {
      form.push(...num({ label: "Angle (°)", min: -E.ANGLE_LIMIT, max: E.ANGLE_LIMIT, step: 5, get: () => S.params.angle, set: (v) => patch({ angle: E.clampAngle(v) }) }));
      form.push(...num({ label: "Size (%)", min: 1, max: 100, step: 5, get: () => pct(sizeNow()), set: (v) => patch({ size: Math.max(0.01, v / 100) }) }));
    }
    if (mode === "puzzle") form.push(...num({ label: "Breathing space (%)", min: 0, max: 50, get: () => pct(S.params.gap), set: (v) => patch({ gap: v / 100 }) }));
    form.push(...num({ label: "Scale (%)", min: 10, max: 100, step: 5, get: () => pct(S.params.scale), set: (v) => patch({ scale: v / 100 }) }));
    form.push(...num({ label: "Bleed (%)", min: 0, max: 50, get: () => pct(S.params.bleed), set: (v) => patch({ bleed: v / 100 }) }));
    out.push(h("div", { class: "ad-form" }, form));

    // Perspective, its slider always open, in the modes that recede (Line-up, and Pins row by row).
    if (mode === "line" || mode === "pins") out.push(bar({ label: "Perspective (%)", min: 0, max: 90, get: () => pct(S.params.perspective), set: (v) => patch({ perspective: v / 100 }) }));

    // Reset: the mode's own start, hand sizes and turns forgotten. Swap order where there is a front to swap. Clear
    // transformations where the mode keeps the sizes and turns given by hand.
    const swap = btn("Swap order", () => patch({ order: S.params.order === "first-front" ? "last-front" : "first-front" }));
    syncs.push(() => { swap.hidden = !(S.params.mode === "line" || ((S.params.mode === "grid" || S.params.mode === "pins") && (S.params.gap < 0 || S.params.gapY < 0))); });
    const clear = btn("Clear transformations", () => { forgetHand(); render(); queue(); });
    syncs.push(() => { clear.hidden = !handEdited() || !keepsHand(); });
    out.push(h("div", { class: "ad-buttons" },
      btn("Reset", () => { S.params = S.modes[S.params.mode] = startOf(S.params.mode); S.handleSide = 1; forgetHand(); render(); queue(); }),
      swap, clear));

    out.push(h("p", { class: "label ad-section" }, "Images"), imageStrip());
    return out;
  }

  function gridCount() {
    const auto = () => { const its = items(), c = E.gridColumns(its, preview().aspect, S.params); return { c, r: E.gridRows(its, c, S.params) }; };
    const n = () => on().length;
    const automatic = h("button", { class: "ad-link", type: "button", onclick: () => patch({ cols: 0, rows: 0 }) }, "Automatic");
    syncs.push(() => { automatic.hidden = !(S.params.cols >= 1 || S.params.rows >= 1); });
    return h("div", { class: "ad-grid-count" }, h("span", { class: "ad-label" }, "Grid"),
      stepper("Image columns", () => auto().c, { can: () => auto().c > 1, run: () => patch({ cols: auto().c - 1, rows: 0 }) }, { can: () => auto().c < Math.min(E.MAX_COLS, n()), run: () => patch({ cols: auto().c + 1, rows: 0 }) }),
      h("span", { class: "ad-times", "aria-hidden": "true" }, "×"),
      stepper("Image rows", () => auto().r, { can: () => auto().r > 1, run: () => patch({ rows: auto().r - 1, cols: 0 }) }, { can: () => auto().r < n(), run: () => patch({ rows: auto().r + 1, cols: 0 }) }),
      automatic);
  }

  /** Pins, as the panel's pins control: Rack to Pyramid, the formation drawn with a − and + per row, and its foot. */
  function pinsFields() {
    const n = on().length;
    const diagram = h("div", { class: "ad-pins", role: "group", "aria-label": "Images in each row, back to front" });
    const foot = h("div", { class: "ad-buttons" });
    const sendRows = (next) => patch({ rows: next.length, rowCounts: next });
    const donorFor = (c, i) => {
      for (let j = i + 1; j < c.length; j++) if (c[j] > 1) return j;
      for (let j = i - 1; j >= 0; j--) if (c[j] > 1) return j;
      return -1;
    };
    syncs.push(() => {
      const c = E.resolveCounts(n, S.params), hand = S.params.rowCounts.length > 0;
      diagram.replaceChildren(...c.map((k, i) => {
        const donor = donorFor(c, i), to = i + 1 < c.length ? i + 1 : i - 1;
        return h("div", { class: "ad-pin-row" },
          h("button", { class: "ad-step", type: "button", "aria-label": `Row ${i + 1}: one image fewer`, disabled: k > 1 && to >= 0 ? null : true, onclick: () => { const next = [...c]; next[i]--; next[to]++; sendRows(next); } }, "−"),
          h("span", { class: "ad-pin-dots", "aria-label": plural(k, "image"), role: "img" }, Array.from({ length: k }, () => h("span", { class: "ad-pin-dot" }))),
          h("button", { class: "ad-step", type: "button", "aria-label": `Row ${i + 1}: one image more`, disabled: donor >= 0 && k < E.MAX_COLS ? null : true, onclick: () => { const next = [...c]; next[i]++; next[donor]--; sendRows(next); } }, "+"));
      }));
      const r = c.length, lastDonor = c.reduce((at, k, i) => (k > 1 ? i : at), -1);
      const canAdd = r < Math.min(n, E.MAX_PIN_ROWS) && (!hand || lastDonor >= 0);
      foot.replaceChildren(
        btn("Remove row", () => { if (!hand) return patch({ rows: r - 1, rowCounts: [] }); const next = c.slice(0, -1); next[next.length - 1] += c[r - 1]; sendRows(next); }, { disabled: r <= 1 ? true : null }),
        btn("Add row", () => { if (!hand) return patch({ rows: r + 1, rowCounts: [] }); const next = [...c]; next[lastDonor]--; sendRows([...next, 1]); }, { disabled: canAdd ? null : true }),
        hand ? h("button", { class: "ad-link", type: "button", onclick: () => patch({ rowCounts: [] }) }, "Automatic") : null);
    });
    return [
      bar({ label: "Rack to Pyramid", min: -100, max: 100, step: 5, unit: null, ends: [[RACK_ICON, "Rack"], [PYRAMID_ICON, "Pyramid"]], get: () => Math.round(S.params.distribution * 100), set: (v) => patch({ distribution: v / 100, rowCounts: [] }) }),
      diagram, foot,
    ];
  }

  /** The strip: a tile per image, in line-up order. Click to turn one off (its tile stays, dimmed) or on; drag to reorder. */
  function imageStrip() {
    const strip = h("div", { class: "ad-strip" });
    const move = (from, to) => { const [moved] = S.pictures.splice(from, 1); S.pictures.splice(to, 0, moved); render(); queue(); };
    S.pictures.forEach((p, i) => {
      const thumb = h("button", { class: `ad-thumb${p.on ? "" : " is-off"}`, type: "button", "aria-pressed": String(p.on), title: p.label,
        "aria-label": `${p.label}, image ${i + 1}, ${p.on ? "on" : "off"}. Alt and an arrow key moves it.` },
        h("img", { src: p.src, alt: "", draggable: "false" }), p.on ? null : h("span", { class: "ad-thumb-plus", "aria-hidden": "true" }, "+"));
      let start = null, dragged = false;
      thumb.addEventListener("pointerdown", (e) => { start = { x: e.clientX, y: e.clientY }; dragged = false; thumb.setPointerCapture(e.pointerId); });
      thumb.addEventListener("pointermove", (e) => {
        if (!start) return;
        if (!dragged && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) { dragged = true; thumb.classList.add("is-dragging"); }
        if (dragged) thumb.style.transform = `translate(${e.clientX - start.x}px, ${e.clientY - start.y}px)`;
      });
      thumb.addEventListener("pointerup", (e) => {
        start = null;
        if (!dragged) return;
        thumb.style.transform = "";
        thumb.classList.remove("is-dragging");
        const to = [...strip.querySelectorAll(".ad-thumb:not(.ad-thumb-add)")].findIndex((t) => {
          if (t === thumb) return false;
          const r = t.getBoundingClientRect();
          return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        });
        if (to >= 0) move(i, to);
      });
      thumb.addEventListener("click", (e) => { if (dragged) { e.preventDefault(); dragged = false; return; } p.on = !p.on; render(); queue(); });
      thumb.addEventListener("keydown", (e) => {
        if (!e.altKey || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
        e.preventDefault();
        const to = i + (e.key === "ArrowLeft" ? -1 : 1);
        if (to < 0 || to >= S.pictures.length) return;
        move(i, to);
        panel.querySelectorAll(".ad-thumb")[to]?.focus();
      });
      strip.append(thumb);
    });
    if (S.pictures.length < MAX) strip.append(h("button", { class: "ad-thumb ad-thumb-add", type: "button", "aria-label": "Add a can", title: "Add a can", onclick: addCan }, "+"));
    return strip;
  }

  function overlaysTile() {
    const c = S.corner, list = S.overlays[c];
    // Every corner change goes through the plugin's own stamp, so Resize scale records the product it was set on.
    const setCorner = (p) => { const prev = S.setups[c]; S.setups[c] = { ...prev, ...E.stampMaster(prev, p, areaPt()) }; queue(); };
    const add = (o) => { S.overlays[c] = [...S.overlays[c], o]; render(); queue(); };
    const priceName = () => { const el = h("span"); syncs.push(() => { el.textContent = `price.indd ($${S.price})`; }); return el; };
    const out = [
      h("p", { class: "ad-heading" }, CORNER_NAMES[c]),
      list.length ? h("ul", { class: "ad-overlay-list" }, list.map((o, i) => h("li", {},
        o.kind === "price" ? priceName() : h("span", {}, o.kind === "file" ? o.label : `${BADGES[o.id].label}.png`),
        h("button", { class: "ad-x", type: "button", "aria-label": "Remove from this corner", onclick: () => { S.overlays[c] = list.filter((_, j) => j !== i); render(); queue(); } }, "×"))))
        : h("p", { class: "ad-meta" }, "Nothing on this corner yet."),
    ];
    const badgeFile = h("input", { type: "file", accept: "image/png,image/webp,image/gif,image/svg+xml,image/jpeg", hidden: true });
    badgeFile.addEventListener("change", () => { addFiles(badgeFile.files, c); badgeFile.value = ""; });
    out.push(h("div", { class: "ad-buttons" },
      btn("Load badge…", () => badgeFile.click(), { title: "Any artwork from your disk; it stays in your browser" }), badgeFile,
      btn("Load price…", () => add(overlay("price", "price")), { disabled: list.some((o) => o.kind === "price") ? true : null })));
    // Artwork the document already has, one click away, as the panel offers it.
    const quick = Object.entries(BADGES).filter(([id]) => !list.some((o) => o.id === id));
    if (quick.length) out.push(h("div", { class: "ad-buttons" }, quick.map(([id, b]) => h("button", { class: "ad-chip", type: "button", onclick: () => add(overlay("badge", id)) }, `+ ${b.label}.png`))));
    if (E.CORNERS.some((k) => S.overlays[k].some((o) => o.kind === "price"))) {
      const price = h("input", { class: "ad-num ad-price", type: "text", inputmode: "decimal", value: S.price, maxlength: "7", id: `ad-${++uid}` });
      price.addEventListener("input", () => { S.price = price.value.replace(/[^\d.]/g, "") || "0"; queue(); });
      out.push(h("div", { class: "ad-form" }, h("label", { class: "ad-label", for: price.id }, "Price ($)"), price));
    }

    // Corner: the chips with Stack beside them, then the geometry, as the panel's corner form.
    const holds = list.length > 0;
    const chips = E.CORNERS.map((k) => {
      const word = CORNER_NAMES[k].toLowerCase(), held = S.overlays[k].length > 0;
      const title = k === c ? `${CORNER_NAMES[k]}: the open corner` : !holds ? `Open the ${word}`
        : held ? `Swap with the ${word}: each corner's overlays keep their size and spacing` : `Move this corner's overlays to the ${word}: they keep their size and spacing`;
      return h("button", { class: "ad-seg ad-corner-chip", type: "button", "aria-label": CORNER_NAMES[k], "aria-pressed": String(k === c), title, onclick: () => { if (k !== c) openCorner(k, true); } },
        h("span", { class: "ad-icon", html: cornerIcon(k, held) }));
    });
    out.push(h("p", { class: "label ad-section", title: "Click another corner to move this corner's overlays there, or to swap them with what is there: they keep their settings." }, "Corner"));
    out.push(h("div", { class: "ad-corner-row" },
      h("div", { class: "ad-segs", role: "group", "aria-label": "Corner" }, chips),
      segmented({ label: "Stack", options: [["across", "Across", "Stack along the corner's top or bottom edge"], ["down", "Down", "Stack along the corner's side edge"]], icons: STACK_ICONS, get: () => S.setups[S.corner].direction, set: (v) => setCorner({ direction: v }) })));
    out.push(h("p", { class: "ad-meta" }, holds ? "Click another corner to move these overlays there, or to swap them with what is there." : "Click a corner, here or on the page, to open it."));
    const pctMode = S.setups[c].sizing === "pct";
    out.push(h("div", { class: "ad-form" },
      ...toggle("Resize scale", () => S.setups[S.corner].spacing === "scaled", (v) => setCorner({ spacing: v ? "scaled" : "pt" })),
      ...num({ label: "Inset X (pt)", min: -60, max: 200, get: () => Math.round(S.setups[S.corner].insetX), set: (v) => setCorner({ insetX: v }) }),
      ...num({ label: "Gap (pt)", min: 0, max: 200, get: () => Math.round(S.setups[S.corner].gap), set: (v) => setCorner({ gap: v }) }),
      ...num({ label: "Inset Y (pt)", min: -60, max: 200, get: () => Math.round(S.setups[S.corner].insetY), set: (v) => setCorner({ insetY: v }) })));
    out.push(segmented({ label: "Max size", options: [["pt", "pt"], ["pct", "%"]], get: () => S.setups[S.corner].sizing, set: (v) => { setCorner({ sizing: v }); render(); } }));
    out.push(h("div", { class: "ad-form" },
      ...num({ label: pctMode ? "Max width (%)" : "Max width (pt)", min: 1, max: pctMode ? 100 : 400, get: () => Math.round(pctMode ? S.setups[S.corner].maxWPct : S.setups[S.corner].maxW), set: (v) => setCorner(pctMode ? { maxWPct: v } : { maxW: v }) }),
      ...num({ label: pctMode ? "Max height (%)" : "Max height (pt)", min: 1, max: pctMode ? 100 : 400, get: () => Math.round(pctMode ? S.setups[S.corner].maxHPct : S.setups[S.corner].maxH), set: (v) => setCorner(pctMode ? { maxHPct: v } : { maxH: v }) })));
    return out;
  }

  /** The panel: its two tiles as switches along the top (as the plugin's tile bar), the open one's tools under them. */
  function render() {
    const scroll = panel.scrollTop;
    syncs = [];
    const tiles = h("div", { class: "ad-tiles", role: "group", "aria-label": "Assemblr's tiles" }, TILES.map(([key, label, icon]) =>
      h("button", { class: "ad-tile", type: "button", "aria-pressed": String(S.tile === key), onclick: () => { if (S.tile === key) return; S.tile = key; render(); panel.scrollTop = 0; queue(); } },
        h("span", { class: "ad-icon", html: icon }), label)));
    panel.replaceChildren(tiles, h("div", { class: "ad-body" }, S.tile === "layout" ? layoutTile() : overlaysTile()));
    panel.scrollTop = scroll;
    sync();
  }

  function renderToolbar() {
    toolbar.replaceChildren(
      h("button", { class: "ad-tool", type: "button", title: "Give each can a new size (Line-up and Puzzle keep them), and in Puzzle a turn", onclick: () => { S.seed++; const hand = handOf(S.seed, MAX); S.pictures.forEach((p, i) => { p.hand = hand[i]; }); render(); queue(); } }, "Randomise size"),
      h("button", { class: "ad-tool", type: "button", onclick: () => { S.pictures.filter((p) => p.key.startsWith("own-")).forEach((p) => URL.revokeObjectURL(p.src)); fresh(); syncElements(); render(); queue(); } }, "Start again"));
  }

  // Drop pictures on the page to add them.
  page.addEventListener("dragover", (event) => { if (event.dataTransfer?.types.includes("Files")) { event.preventDefault(); root.classList.add("is-dropping"); } });
  page.addEventListener("dragleave", (event) => { if (!page.contains(event.relatedTarget)) root.classList.remove("is-dropping"); });
  page.addEventListener("drop", (event) => { event.preventDefault(); root.classList.remove("is-dropping"); if (event.dataTransfer?.files.length) addFiles(event.dataTransfer.files); });

  fresh();
  syncElements();
  renderToolbar();
  render();
  solve();
  sync();
  root.classList.add("is-ready");
}
