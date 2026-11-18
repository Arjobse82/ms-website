// Frame Multiplier's help-page drawings (panels.js `guide`, src/_includes/panel/frame-multiplier/how-<id>.njk): the
// basic setup, step by step, and the four settings that fix the frames the basics don't. The campaign is the one
// fm-diagram.js lays out for the product page (the Inferno burger), so the drawings agree with it. A model of what the
// plugin does (monocode.campaign-manager src/main/apps/rollout), drawn to explain it, not its engine.
import { layout, drawFrame, MASTERS } from "./fm-diagram.js";

const INK = "#111", HERO = "#3372f6", PAPER = "#fff", MUTED = "#8a8a8a", RULE = "#cfcfcf", SOFT = "#f3f3f3";
const MARK = "#e8590c", COMP = "#9747ff"; // the drawn paths; Figma's component purple
const f = (n) => +n.toFixed(2);
const svg = (w, h, body, label) =>
  `<svg class="fh-svg" viewBox="0 0 ${f(w)} ${f(h)}" role="img" aria-label="${label}">${body}</svg>`;
const text = (x, y, s, { size = 10, weight = 500, fill = INK, anchor = "start", mono = false } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${mono ? ' font-family="ui-monospace, Menlo, monospace"' : ""}>${s}</text>`;
const rect = (x, y, w, h, attrs) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${attrs}/>`;
const diamond = (cx, cy, r, fill = COMP) => `<path d="M${f(cx)} ${f(cy - r)}L${f(cx + r)} ${f(cy)}L${f(cx)} ${f(cy + r)}L${f(cx - r)} ${f(cy)}Z" fill="${fill}"/>`;
const arrow = (x, y, w) => `<path d="M${f(x)} ${f(y)}h${f(w - 3)}M${f(x + w - 8)} ${f(y - 4.5)}l4.5 4.5-4.5 4.5" fill="none" stroke="${MUTED}" stroke-width="1.5"/>`;
const size = (w, h) => `${w}×${h}`;

// The three masters the basics use: tall, square and wide.
const THREE = [MASTERS[1], MASTERS[3], MASTERS[4]];
// The frames to fill, tall to wide.
const SIZES = [[300, 600], [1000, 1500], [1080, 1200], [1200, 1000], [1500, 500], [728, 90]];

/** A row of frames at one scale, bottom-aligned at `base`, each drawn by `draw(x, y, k, w, h, i)`. */
function row(sizes, x0, base, k, gap, draw) {
  let x = x0, s = "";
  const at = [];
  sizes.forEach(([w, h], i) => {
    const y = base - h * k;
    s += draw(x, y, k, w, h, i);
    at.push({ x, y, w: w * k, h: h * k });
    x += w * k + gap;
  });
  return { s, at, end: x - gap };
}
const frameName = (x, y, s) => text(x, y - 5, s, { size: 8, fill: MUTED, mono: true });

/** A Figma page list, one page picked. */
function pages(x, y, picked) {
  const names = ["[MASTERS] Inferno", "Social", "Print"];
  let s = rect(x, y, 128, 96, `rx="8" fill="${SOFT}"`) + text(x + 12, y + 20, "PAGES", { size: 8, weight: 700, fill: MUTED });
  names.forEach((n, i) => {
    const ry = y + 30 + i * 20;
    if (i === picked) s += rect(x + 6, ry, 116, 18, `rx="4" fill="#dbe6fd"`);
    s += text(x + 12, ry + 12.5, n, { size: 9.5, weight: i === picked ? 650 : 450 });
  });
  return s;
}

/** 01 · The masters page: three masters on a page named [MASTERS]. */
function masters() {
  const k = 0.082, r = row(THREE.map((m) => m.size), 160, 178, k, 20, (x, y, k, w, h, i) =>
    drawFrame(layout(w, h), x, y, k, { master: true }) + frameName(x, y, size(w, h)));
  return svg(r.end + 8, 186, pages(8, 8, 0) + r.s, "A page named [MASTERS] Inferno holding three master frames: tall, square and wide");
}

/** 02 · Shared components: one main component, an instance in every master. */
function components() {
  const k = 0.074, x0 = 150;
  const r = row(THREE.map((m) => m.size), x0, 172, k, 18, (x, y, k, w, h) =>
    drawFrame(layout(w, h), x, y, k, { master: true }) + frameName(x, y, size(w, h)));
  const list = ["Background", "Hero", "Headline", "Logo", "Legal"];
  let s = rect(8, 8, 118, 142, `rx="8" fill="${SOFT}"`) + text(20, 28, "COMPONENTS", { size: 8, weight: 700, fill: MUTED });
  list.forEach((n, i) => {
    const y = 48 + i * 22, on = n === "Hero";
    if (on) s += rect(14, y - 11, 106, 20, `rx="4" fill="#efe5ff"`);
    s += diamond(26, y - 1, 4.5) + text(36, y + 2.5, n, { size: 9.5, weight: on ? 650 : 450, fill: on ? COMP : INK });
  });
  // The Hero component's instances: a ring round the hero in each master, a line to each from the component.
  THREE.forEach((m, i) => {
    const L = layout(...m.size), a = r.at[i];
    const cx = a.x + L.hero.cx * k, cy = a.y + L.hero.cy * k, rr = (L.hero.d / 2) * k + 2.5;
    s += `<path d="M120 ${f(48 + 22 - 1)}C${f(132)} ${f(70)} ${f(cx - 30)} ${f(cy)} ${f(cx - rr)} ${f(cy)}" fill="none" stroke="${COMP}" stroke-width="1" stroke-dasharray="3 2.5" opacity="0.75"/>`;
    s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}" fill="none" stroke="${COMP}" stroke-width="1.5"/>`;
  });
  return svg(r.end + 8, 180, r.s + s, "One Hero main component, with an instance of it in each of the three masters");
}

/** 04 · A page of empty frames at the sizes the job needs. */
function frames() {
  const r = row(SIZES, 10, 150, 0.072, 11, (x, y, k, w, h) =>
    rect(x, y, w * k, h * k, `rx="1.5" fill="${PAPER}" stroke="${RULE}" stroke-width="1"`) + frameName(x, y, size(w, h)));
  return svg(r.end + 10, 160, text(10, 20, "Social", { size: 10, weight: 650 }) + text(48, 20, "· 6 empty frames", { size: 10, fill: MUTED }) + r.s,
    "A page named Social with six empty frames at different sizes");
}

/** 05 · Scan, then Multiply: the Frames tab's two buttons, then the same frames filled. */
function multiply() {
  let s = rect(8, 30, 172, 116, `rx="10" fill="${SOFT}"`);
  s += text(22, 52, "Frames", { size: 10, weight: 700 });
  s += rect(22, 64, 144, 28, `rx="6" fill="${PAPER}" stroke="${RULE}"`) + text(94, 82, "Scan for updates", { size: 10, weight: 550, anchor: "middle" });
  s += rect(22, 102, 144, 28, `rx="6" fill="${HERO}"`) + text(94, 120, "Multiply × 6", { size: 10, weight: 650, fill: PAPER, anchor: "middle" });
  s += arrow(194, 88, 34);
  const r = row(SIZES, 244, 160, 0.088, 13, (x, y, k, w, h) => drawFrame(layout(w, h), x, y, k) + frameName(x, y, size(w, h)));
  return svg(r.end + 10, 170, s + r.s, "Scan for updates, then Multiply: the six empty frames are filled from the masters");
}

// ── Going further ────────────────────────────────────────────────────────────────────────────────────────────────

// A photo: a wide scene with its subject, a bottle, off to the right. Drawn in its own units, 300 × 157 (1200 × 628).
const PW = 300, PH = 157, SUBJECT = { x: 200, y: 56, w: 30, h: 66 };
function photo() {
  const b = SUBJECT;
  return rect(0, 0, PW, PH, `fill="#e4e8ee"`) + rect(0, 112, PW, 45, `fill="#c9ced6"`) +
    `<circle cx="62" cy="40" r="16" fill="#f4f6f9"/>` +
    rect(b.x + 3, b.y + 16, b.w - 6, b.h - 16, `rx="6" fill="${HERO}"`) + rect(b.x + 10, b.y + 2, b.w - 20, 16, `rx="2.5" fill="${HERO}"`) +
    rect(b.x + 7, b.y + 34, b.w - 14, 13, `rx="2" fill="${PAPER}" opacity="0.85"`);
}
const focalBox = (x, y, k) => rect(x + (SUBJECT.x - 6) * k, y + (SUBJECT.y - 6) * k, (SUBJECT.w + 12) * k, (SUBJECT.h + 12) * k,
  `fill="none" stroke="${MARK}" stroke-width="1.4" stroke-dasharray="4 3"`);

/** The photo cropped into a w × h frame at x, y, covering it, the focal box kept in view and centred where it can be. */
function crop(id, x, y, w, h) {
  const k = Math.max(w / PW, h / PH);
  const fx = (SUBJECT.x + SUBJECT.w / 2) * k, fy = (SUBJECT.y + SUBJECT.h / 2) * k;
  const ox = Math.min(0, Math.max(w - PW * k, w / 2 - fx)), oy = Math.min(0, Math.max(h - PH * k, h / 2 - fy));
  return `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="2"/></clipPath>` +
    `<g clip-path="url(#${id})"><g transform="translate(${f(x + ox)} ${f(y + oy)}) scale(${f(k)})">${photo()}</g>${focalBox(x + ox, y + oy, k)}</g>` +
    rect(x, y, w, h, `rx="2" fill="none" stroke="${RULE}"`);
}

/** Focal path: a box named focal round the subject; every size keeps it in view. */
function focal() {
  const k = 0.62, mw = PW * k, mh = PH * k;
  let s = text(10, 18, "Master", { size: 9, weight: 650, fill: MUTED });
  s += `<g transform="translate(10 26) scale(${k})">${photo()}</g>` + focalBox(10, 26, k);
  s += text(10 + (SUBJECT.x - 6) * k, 26 + (SUBJECT.y - 6) * k - 5, "focal", { size: 9, weight: 650, fill: MARK, mono: true });
  const x1 = 10 + mw + 30;
  s += arrow(x1 - 24, 26 + mh / 2, 18);
  s += text(x1, 18, "9:16", { size: 9, weight: 650, fill: MUTED }) + crop("fh-focal-a", x1, 26, 62, 110);
  s += text(x1 + 76, 18, "1500×500", { size: 9, weight: 650, fill: MUTED }) + crop("fh-focal-b", x1 + 76, 26, 150, 50);
  return svg(x1 + 76 + 150 + 10, 146, s, "A box named focal drawn round the subject of a photo; a tall and a wide frame both keep it in view");
}

/** Collision path: the shape the hero keeps clear of the copy; the hero nudged, then scaled, to clear the headline. */
function collision() {
  // The layer: an opaque square photo, its product inside, a path named collision round the product.
  let s = text(10, 18, "Hero layer", { size: 9, weight: 650, fill: MUTED });
  s += rect(10, 26, 104, 104, `rx="2" fill="#e4e8ee"`) + rect(10, 98, 104, 32, `fill="#c9ced6"`);
  s += `<circle cx="62" cy="80" r="30" fill="${HERO}"/>`;
  s += `<circle cx="62" cy="80" r="35" fill="none" stroke="${MARK}" stroke-width="1.4" stroke-dasharray="4 3"/>`;
  s += text(62, 40, "collision", { size: 9, weight: 650, fill: MARK, anchor: "middle", mono: true });
  s += arrow(126, 80, 24);
  // The frame: where the blend put the hero (dashed), and where it went to clear the headline.
  const L = layout(1200, 1000), k = 0.13, x = 162, y = 26;
  s += text(x, 18, "1200×1000", { size: 9, weight: 650, fill: MUTED }) + drawFrame(L, x, y, k, { ghost: true });
  s += text(x + L.W * k + 10, y + 52, "nudged,", { size: 9, fill: MUTED }) + text(x + L.W * k + 10, y + 64, "then scaled", { size: 9, fill: MUTED });
  return svg(x + L.W * k + 70, 166, s, "A path named collision round the product in a square photo; in a 1200 by 1000 frame the hero moves down and shrinks to clear the headline");
}

/** Pin: a logo held the same distance from the bottom-right corner in every size. */
function pin() {
  const m = 7, d = 13;
  const r = row([[1080, 1080], [1080, 1920], [1500, 500]], 10, 150, 0.072, 26, (x, y, k, w, h) => {
    const W = w * k, H = h * k, cx = x + W - m - d / 2, cy = y + H - m - d / 2;
    return rect(x, y, W, H, `rx="2" fill="${INK}"`) + rect(x + 7, y + 8, W * 0.55, 5, `rx="1" fill="${PAPER}"`) +
      `<circle cx="${f(cx)}" cy="${f(cy)}" r="${d / 2}" fill="${PAPER}"/>` +
      `<path d="M${f(cx + d / 2)} ${f(cy)}H${f(x + W)}M${f(cx)} ${f(cy + d / 2)}V${f(y + H)}" stroke="${MARK}" stroke-width="1.3"/>` +
      frameName(x, y, size(w, h));
  });
  return svg(r.end + 10, 160, r.s, "A logo pinned to the bottom-right corner: the same offset from that corner in three sizes");
}

/** Stretch: a full-width band in a wide frame, stretched or kept uniform. */
function stretch() {
  const band = (x, y, w, h) => rect(x, y, w, h, `fill="#d9d9d9"`);
  let s = text(10, 18, "Master 1:1", { size: 9, weight: 650, fill: MUTED });
  s += rect(10, 26, 90, 90, `rx="2" fill="${INK}"`) + rect(17, 34, 50, 6, `rx="1" fill="${PAPER}"`) + band(10, 100, 90, 16);
  s += arrow(110, 71, 22);
  const x = 144, W = 180, H = 60;
  s += text(x, 18, "Scale | Stretch", { size: 9, weight: 650, fill: MUTED, mono: true });
  s += rect(x, 26, W, H, `rx="2" fill="${INK}"`) + rect(x + 7, 32, 70, 5, `rx="1" fill="${PAPER}"`) + band(x, 26 + H - 11, W, 11);
  const y2 = 112, bw = 90 * (H / 90), bh = 16 * (H / 90);
  s += text(x, y2 - 8, "Scale | Constrain", { size: 9, weight: 650, fill: MUTED, mono: true });
  s += rect(x, y2, W, H, `rx="2" fill="${INK}"`) + rect(x + 7, y2 + 6, 70, 5, `rx="1" fill="${PAPER}"`) + band(x + (W - bw) / 2, y2 + H - bh, bw, bh);
  return svg(x + W + 10, y2 + H + 8, s, "A band across a square master: in a wide frame, stretched to the full width, or scaled uniformly and left short");
}

export function fmHelpArt() {
  return { masters: masters(), components: components(), frames: frames(), multiply: multiply(), focal: focal(), collision: collision(), pin: pin(), stretch: stretch() };
}
