// What Bloom's panel explained draws (src/_lib/panels/bloom.js, src/_includes/panel/bloom/): the panel in Build mode, the
// only mode the published plugin has, in its dark theme, worked out from the hero's own job (src/_data/jobs.js) so the
// two always show the same page. Its rosette is the hero's (src/_lib/bloom.js renderBloom, without its marks); its marks
// sit on the hero's ring slots, except one frame's, gathered round the mark under the pointer as the plugin gathers
// them (monocode.campaign-manager bloom/src/ui/index.js _mkTick). Its words, glyphs and layout are the plugin's own:
// index.js (_modeChromeHtml, _healthDotHtml, _mkRenderCenter, openDismissMenu, _bloomOptsHtml), filterBar.js
// (_renderFilterBar, _renderTokenLegend), measureUpdate.js (_block1Sentence), bloom-config.json (bloomOptSpec) and
// ui-shell.html for the look. Kept out of src/_data, as a data file's named exports change what Eleventy reads from it.
import { W, COLOURS, renderBloom, glyph, token, markColour } from "./bloom.js";
import jobs from "../_data/jobs.js";

const job = jobs.bloom;
const S = W / 240, CX = W / 2, CY = W / 2, bloomR = W * 0.25;
const FG = COLOURS.fg;
const f = (n) => +n.toFixed(2);
const pct = (n) => +n.toFixed(3) + "%";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const turn = ([x, y], deg) => { const a = (deg * Math.PI) / 180, dx = x - CX, dy = y - CY; return [CX + dx * Math.cos(a) - dy * Math.sin(a), CY + dx * Math.sin(a) + dy * Math.cos(a)]; };
const need = (s, what) => { if (!s.includes(what)) throw new Error(`bloom-panel.js: the hero's bloom has no ${what} (src/_lib/bloom.js changed?)`); return s; };

// The rosette, the frames' dots and fans and the orbiting title: the hero's bloom drawn without its marks, its turning
// layers held at `deg` (the comb and its marks turn at 500 s a turn, the two title rings at 150 s and 210 s, as in the
// plugin), and its ids made this drawing's own.
const BASE = renderBloom({ ...job, marks: [] }).svg;
function rosette(id, deg = 0) {
  let s = BASE.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  s = need(s, '<g class="bl-spin-c bl-ring"></g><g class="bl-flags"></g>').replace('<g class="bl-spin-c bl-ring"></g><g class="bl-flags"></g>', "");
  s = need(s, '<g class="bl-spin-c">').replace('<g class="bl-spin-c">', `<g class="bp-comb" transform="rotate(${f(deg)} ${CX} ${CY})">`);
  s = need(s, '<g class="bl-orbit-1">').replace('<g class="bl-orbit-1">', `<g transform="rotate(${f((deg * 500) / 150)} ${CX} ${CY})">`);
  s = need(s, '<g class="bl-orbit-2">').replace('<g class="bl-orbit-2">', `<g transform="rotate(${f((deg * 500) / 210)} ${CX} ${CY})">`);
  return s.replace(/ class="bl-in" style="[^"]*"/g, "").replace(/bl-orb-/g, `bp-orb-${id}-`).replace(/ class="bl-(fans|dots)"/g, "");
}

// Where each frame's dot sits (renderBloom's explicit mode: one a frame, in aspect-ratio order, each turned its share
// of the circle from a start seeded by the job's name), and how far its fan of healthy layers reaches (_buildFan).
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const firstDraw = (seed) => { let a = seed; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const startRot = firstDraw(hash(job.name + "::bloom")) * 360;
const byRatio = [...job.frames].sort((a, b) => a.w / a.h - b.w / b.h);
const maxDiag = Math.max(1, ...job.frames.map((fr) => Math.hypot(fr.w, fr.h)));
function dotOf(name) {
  const i = byRatio.findIndex((fr) => fr.name === name), fr = byRatio[i];
  const a = (((startRot + (i / byRatio.length) * 360) - 90) * Math.PI) / 180;
  const x = CX + Math.cos(a) * bloomR, y = CY + Math.sin(a) * bloomR, r = (1.7 + 3.0 * Math.min(1, Math.hypot(fr.w, fr.h) / maxDiag)) * S;
  // The fan: ring k holds k + 1 glyphs, 4.6 apart, opening outward from the dot.
  const L = fr.healthy | 0, n = Math.min(13, Math.floor(L / 10)) + (L % 10), base = Math.atan2(y - CY, x - CX), gap = 4.6 * S;
  const pts = [[x - r, y - r], [x + r, y + r]];
  for (let ri = 0, idx = 0; idx < n; ri++) {
    const slots = ri + 1, rd = gap * (ri + 1), step = gap / Math.max(gap, rd), xs = 1.7 * S;
    for (let si = 0; si < slots && idx < n; si++, idx++) {
      const t = base + (si - (slots - 1) / 2) * step, px = x + Math.cos(t) * rd, py = y + Math.sin(t) * rd;
      pts.push([px - xs, py - xs], [px + xs, py + xs]);
    }
  }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return { x, y, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
}

// The size ≠ name arrow on its frame's dot (index.js _dimFlag; the same artwork as bloom.js draws), held still.
const arrow = (px, py, w = 15) => {
  const k = w / 252.2, h = w * (112.39 / 252.2);
  return `<g transform="translate(${f(px - w / 2)},${f(py - h)}) scale(${k.toFixed(5)}) translate(-664.22,-364.51)"><path d="M916.42,364.51l-102.7,102.7c-12.92,12.92-33.88,12.92-46.8,0l-102.7-102.7" fill="${COLOURS.pink}"/></g>`;
};

// One mark as the bloom draws it: an error is its glyph, a token its swatch, ring or letter. Monochrome (the plugin's
// default) inks an error white, at its own strength, unless its frame is selected or held: then it shows its colour.
function markSvg(m, x, y, { focused = false, glow = "" } = {}) {
  const xs = 1.9 * S;
  const body = m.group === "token" ? token(m.ico, m.raw ?? FG, 0, 0, 1.4 * S)
    : glyph(m.ico, 0, 0, m.ico === "lockratio" ? xs * 1.35 : xs, focused ? markColour(m) : FG, focused ? 1 : m.ink, 1.4);
  return `<g transform="translate(${f(x)},${f(y)})"${glow ? ` filter="url(#${glow})"` : ""}>${body}</g>`;
}

// The ring of marks, turned `deg` with the comb; the marks of `frame` gathered round `lead` (it at the centre, the rest
// on a ring of (6.5 + n × 0.7) round it, in the order the plugin builds them: errors by type, then tokens).
const ORDER = ["loose", "badbg", "detached", "offgrid", "lowres", "hidden", "emptytext", "stretchimg", "lockratio", "tk-fill", "tk-stroke", "tk-type", "tk-radius"];
function ring({ deg = 0, frame, lead, focus, glow }) {
  const pos = {};
  for (const m of job.marks) if (m.type !== "namesize") pos[m.id] = turn(job.at[m.id], deg);
  const members = job.marks.filter((m) => m.frame === frame && m.type !== "namesize").sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));
  const anchor = pos[lead], others = members.filter((m) => m.id !== lead), rr = (6.5 + others.length * 0.7) * S;
  others.forEach((m, i) => { const t = (i / others.length) * Math.PI * 2; pos[m.id] = [anchor[0] + Math.cos(t) * rr, anchor[1] + Math.sin(t) * rr]; });
  const svg = job.marks.filter((m) => m.type !== "namesize")
    .map((m) => markSvg(m, ...pos[m.id], { focused: m.frame === focus, glow: m.id === lead ? glow : "" })).join("");
  const pts = members.map((m) => pos[m.id]);
  const hw = 1.9 * S * 2.4;   // a glyph and its margin
  const box = [Math.min(...pts.map((p) => p[0])) - hw, Math.min(...pts.map((p) => p[1])) - hw, Math.max(...pts.map((p) => p[0])) + hw, Math.max(...pts.map((p) => p[1])) + hw];
  return { svg, pos, box, anchor };
}

// A box in a drawing's units, as the left, top, width and height of a spot laid over it, in per cent.
const spot = ([x0, y0, x1, y1], vb) => ({ left: pct(((x0 - vb[0]) / vb[2]) * 100), top: pct(((y0 - vb[1]) / vb[3]) * 100), width: pct(((x1 - x0) / vb[2]) * 100), height: pct(((y1 - y0) / vb[3]) * 100) });
const around = ([x, y], r) => [x - r, y - r, x + r, y + r];

// The line under the bloom (measureUpdate.js _block1Sentence): the first three things found, in its order and words.
const count = (type) => job.marks.filter((m) => m.type === type).length;
const plr = (n) => (n === 1 ? "" : "s"), isAre = (n) => (n === 1 ? "is" : "are");
const DPI = 72;
const lowresDpis = job.marks.filter((m) => m.type === "lowres").map((m) => parseInt(m.value, 10)).filter((n) => n > 0);
function sentence() {
  const parts = [];
  const lr = count("lowres");
  if (lr) parts.push(`${lr} image${plr(lr)} ${lr === 1 ? "sits" : "sit"} below ${DPI}dpi resolution${lowresDpis.length ? " — the softest at " + Math.min(...lowresDpis) + " dpi" : ""}`);
  const st = count("badbg") + count("stretchimg");
  if (st) parts.push(`${st} asset${plr(st)} ${isAre(st)} stretched out of proportion`);
  const og = count("offgrid");
  if (og) parts.push(`${og} layer${plr(og)} ${isAre(og)} off the pixel grid`);
  const et = count("emptytext");
  if (et) parts.push(`${et} text layer${plr(et)} ${isAre(et)} empty or still say lorem ipsum`);
  const s = parts.slice(0, 3).join("; ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
// The dot beside the dpi: resolution only (_pageHealthInfo): orange when the softest image is within 80% of the dpi.
const softest = Math.min(...lowresDpis);
const health = !lowresDpis.length ? "green" : softest >= DPI * 0.8 ? "orange" : "red";

// The filter bar, bottom left (filterBar.js _renderFilterBar): a 12-unit icon a type found, errors above tokens. Its
// error colours are the bar's own (red #e5484d, amber --warn); a token is one ink dot a type, whatever its colour.
const FB_RED = "#e5484d";
const FB_ERRORS = [["loose", "loose", FB_RED], ["badbg", "badbg", FB_RED], ["detached", "detached", FB_RED], ["offgrid", "offgrid", COLOURS.warn], ["lowres", "lowres", COLOURS.warn], ["hidden", "hidden", FB_RED], ["emptytext", "emptytext", FB_RED], ["stretchimg", "img", FB_RED], ["lockratio", "lockratio", COLOURS.warn]];
const FB_TOKENS = ["tk-fill", "tk-stroke", "tk-type", "tk-radius"];
const fbIcon = (body) => `<svg viewBox="0 0 12 12" aria-hidden="true">${body}</svg>`;
const xsBar = 1.9 * S;
const filterBar = {
  errors: FB_ERRORS.filter(([t]) => count(t)).map(([, ico, col]) => fbIcon(glyph(ico, 6, 6, xsBar, col, 1, 1))),
  tokens: FB_TOKENS.filter((t) => count(t)).map((t) => fbIcon(token(t, FG, 6, 6, xsBar))),
};

const COG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
const LOGO = '<svg viewBox="642 456 638 168" fill="currentColor" aria-hidden="true"><path d="M647.28,463.25c0-.87.66-1.53,1.53-1.53h5.68c.87,0,1.52.65,1.52,1.53v66.78c8.3-15.49,22.91-24.66,42.56-24.66,30.77,0,51.28,22.91,51.28,56.74s-20.51,56.74-51.28,56.74c-19.64,0-34.26-9.17-42.56-24.66v20.95c0,.87-.65,1.53-1.52,1.53h-5.68c-.87,0-1.53-.65-1.53-1.53v-151.89ZM698.57,611.21c25.53,0,42.55-19.86,42.55-49.1s-17.02-48.88-42.55-48.88-42.56,19.86-42.56,48.88,17.03,49.1,42.56,49.1Z"/><path d="M802.86,597.9c0,6.54,4.36,10.91,10.91,10.91h38.63c.87,0,1.53.65,1.53,1.53v4.8c0,.87-.66,1.53-1.53,1.53h-39.72c-11.13,0-18.55-7.42-18.55-18.55v-128.54h-38.41c-.87,0-1.53-.65-1.53-1.53v-4.8c0-.87.66-1.53,1.53-1.53h45.61c.87,0,1.53.65,1.53,1.53v134.65Z"/><path d="M924.83,505.36c30.77,0,51.28,22.91,51.28,56.74s-20.51,56.74-51.28,56.74-51.29-22.7-51.29-56.74,20.51-56.74,51.29-56.74ZM924.83,611.21c25.53,0,42.55-19.86,42.55-49.1s-17.02-48.88-42.55-48.88-42.56,19.86-42.56,48.88,17.03,49.1,42.56,49.1Z"/><path d="M1055.74,505.36c30.77,0,51.28,22.91,51.28,56.74s-20.51,56.74-51.28,56.74-51.29-22.7-51.29-56.74,20.51-56.74,51.29-56.74ZM1055.74,611.21c25.53,0,42.55-19.86,42.55-49.1s-17.02-48.88-42.55-48.88-42.56,19.86-42.56,48.88,17.03,49.1,42.56,49.1Z"/><path d="M1135.36,509.07c0-.87.66-1.53,1.53-1.53h5.68c.87,0,1.52.65,1.52,1.53v13.1c7.21-11.35,17.68-16.81,26.84-16.81,10.26,0,17.9,4.58,19.86,17.24,6.98-11.57,17.9-17.24,27.06-17.24,12.01,0,20.3,6.11,20.3,24.44v85.33c0,.87-.65,1.53-1.52,1.53h-5.68c-.87,0-1.53-.65-1.53-1.53v-85.33c0-13.97-3.93-16.59-11.57-16.59-12,0-20.73,11.13-26.62,22.04v79.87c0,.87-.65,1.53-1.53,1.53h-5.67c-.87,0-1.53-.65-1.53-1.53v-85.33c0-13.97-3.93-16.59-11.57-16.59-12.22,0-20.95,11.35-26.84,22.48v79.43c0,.87-.65,1.53-1.52,1.53h-5.68c-.87,0-1.53-.65-1.53-1.53v-106.06Z"/><path d="M1256.59,509.23h-3.34c-.2,0-.34-.15-.34-.34v-1.11c0-.19.14-.34.34-.34h8.62c.19,0,.34.15.34.34v1.11c0,.2-.15.34-.34.34h-3.34v11.71c0,.19-.15.34-.35.34h-1.25c-.2,0-.34-.15-.34-.34v-11.71ZM1271.46,507.73c.09-.19.29-.29.48-.29h1.26c.19,0,.34.15.34.34v13.17c0,.19-.15.34-.34.34h-1.26c-.19,0-.34-.15-.34-.24l-1.88-4.31v9.29c0,.19-.15.34-.35.34h-1.25c-.2,0-.34-.15-.34-.34v-13.17c0-.19.14-.34.34-.34h1.25c.2,0,.39.1.49.29l2.47,5.71,2.47-5.71Z"/></svg>';

// ── Find and fix: the whole panel, the pointer on the Half page frame's off-grid mark (right-clicked, so its Dismiss
//    menu is open) while that frame is selected on the canvas, so the centre offers to fix what can be fixed on it. ──
function fixView() {
  const frame = "Half page 300×600";
  const lead = job.marks.find((m) => m.frame === frame && m.type === "offgrid");
  const r = ring({ frame, lead: lead.id, focus: frame });
  const dot = dotOf(frame), sky = dotOf(job.marks.find((m) => m.type === "namesize").layer);
  // The centre: with one frame selected on the canvas, a glyph for each kind of error on it that a double-click fixes
  // (off-grid, hidden, stretched, aspect ratio), in its own colour (_mkRenderCenter, row 2).
  const FIXABLE = { offgrid: "offgrid", hidden: "hidden", badbg: "badbg", lockratio: "lockratio" };
  const kinds = [...new Set(job.marks.filter((m) => m.frame === frame && FIXABLE[m.type]).map((m) => m.type))];
  const off = 1.1 * S;
  const centre = kinds.map((t, i) => glyph(FIXABLE[t], CX + (i - (kinds.length - 1) / 2) * off, CY, 1.9 * S, ["offgrid", "lockratio"].includes(t) ? COLOURS.warn : COLOURS.red, 1, 1.4)).join("");
  const vb = [0, 0, W, W];
  const svg = `<svg class="bp-bloom" viewBox="${vb.join(" ")}" role="img" aria-label="The bloom, the Half page frame's marks gathered round its off-grid mark">`
    + rosette("fix") + arrow(sky.x, sky.y) + `<g>${r.svg}</g><g>${centre}</g></svg>`;
  const xs = 1.9 * S * 1.7;
  return {
    svg,
    dpi: DPI,
    health,
    cog: COG,
    logo: LOGO,
    report: sentence(),
    readout: { value: lead.value ?? "", type: lead.label },
    filterBar,
    // The spots, in reading order: the gathered marks, the mark under the pointer, its menu, the frame's dot, the centre.
    cluster: spot(r.box, vb),
    lead: spot(around(r.anchor, xs), vb),
    menu: { left: pct((r.anchor[0] / W) * 100), top: pct(((r.anchor[1] + 4) / W) * 100) },
    dot: spot([dot.box[0] - 2, dot.box[1] - 2, dot.box[2] + 2, dot.box[3] + 2], vb),
    centre: spot(around([CX, CY], 1.9 * S * 2.2), vb),
  };
}

// ── Token fixes: the lower right quarter of the panel, close up: the comb turned on (so the radius mark has come round to
//    the lower right), the mark clicked, its frame's marks held round it, and its fixes open in the corner. The legend is
//    filterBar.js _renderTokenLegend's for a raw corner radius of 25 in its Local set, laid out by ui-shell.html: three
//    20-unit columns 6 apart, right-packed, two 12-unit rows 4 apart, the caption 3 below. ──
function tokensView() {
  const radius = job.marks.find((m) => m.type === "tk-radius");
  const [x0, y0] = job.at[radius.id];
  const deg = 30 - (Math.atan2(y0 - CY, x0 - CX) * 180) / Math.PI;   // turned until it sits 30° below the right
  const glow = "bp-glow-tokens";
  const r = ring({ deg, frame: radius.frame, lead: radius.id, focus: radius.frame, glow });
  // The panel: 380 wide; the bloom, 276, centred in its 352 × 400 host 14 in; the corner row's 28 high bottom at 398.
  const BX = 52, BY = 62, RIGHT = 362, TOP = 370;
  const vb = [140, 196, 240, 218];   // from the bloom's centre to the window's right edge and the caption's foot
  const col = (c) => RIGHT - (3 - c) * 20 - (2 - c) * 6;        // column c (0–2): its left edge
  const rowTop = [TOP, TOP + 16];
  const chip = (c, row, text, flag = false) => `<rect x="${col(c) + 0.5}" y="${rowTop[row] + 0.5}" width="19" height="11" rx="3" fill="${flag ? FG : "#24272c"}" stroke="${flag ? FG : "#5a616b"}"/>`
    + `<text x="${col(c) + 10}" y="${rowTop[row] + 6.3}" text-anchor="middle" dominant-baseline="central" font-family="ui-monospace,Menlo,monospace" font-size="7" font-weight="700" fill="${flag ? "#111" : "#c3c7cd"}">${esc(text)}</text>`;
  const s2 = 1.9 * S * 1.5 * 0.9, gx = col(2) + 10, gy = rowTop[0] + 6;
  const legend = chip(1, 0, radius.value, true)
    + `<path d="M ${f(gx - s2)} ${f(gy + s2)} L ${f(gx - s2)} ${f(gy - s2 * 0.3)} Q ${f(gx - s2)} ${f(gy - s2)} ${f(gx + s2 * 0.3)} ${f(gy - s2)} L ${f(gx + s2)} ${f(gy - s2)}" fill="none" stroke="${FG}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`
    + chip(0, 1, "20") + chip(1, 1, "30")
    + `<text x="${col(2) + 10}" y="${rowTop[1] + 4.5}" text-anchor="middle" dominant-baseline="central" font-family="Inter,-apple-system,sans-serif" font-size="10" font-weight="700" fill="${FG}">+</text>`
    + `<text x="364" y="${rowTop[1] + 12 + 3 + 4.2}" text-anchor="end" dominant-baseline="central" font-family="ui-monospace,Menlo,monospace" font-size="7" letter-spacing="0.84" fill="#6b727c">LOCAL</text>`;
  const svg = `<svg class="bp-bloom bp-crop-svg" viewBox="${vb.join(" ")}" role="img" aria-label="The corner of the panel, close up: a raw corner radius of 25, with the radius variables 20 and 30 and a plus under it">`
    + `<defs><clipPath id="bp-clip-tokens"><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}"/></clipPath>`
    + `<filter id="${glow}" x="-2" y="-2" width="5" height="5"><feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#fff" flood-opacity="0.6"/></filter>`
    + `<radialGradient id="bp-pool-tokens"><stop offset="0.35" stop-color="#000" stop-opacity="0.4"/><stop offset="0.7" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`
    + `<g clip-path="url(#bp-clip-tokens)"><circle cx="${BX + CX}" cy="${BY + CY}" r="200" fill="url(#bp-pool-tokens)"/>`
    + `<g transform="translate(${BX},${BY})">${rosette("tokens", deg)}${r.svg}</g>${legend}</g></svg>`;
  const at = (p) => [p[0] + BX, p[1] + BY];
  return {
    svg,
    mark: spot(around(at(r.anchor), 1.9 * S * 2), vb),
    value: spot([col(1) - 2, rowTop[0] - 2, RIGHT + 2, rowTop[0] + 14], vb),
    matches: spot([col(0) - 2, rowTop[1] - 2, col(1) + 22, rowTop[1] + 14], vb),
    add: spot([col(2) + 2, rowTop[1] - 2, col(2) + 18, rowTop[1] + 14], vb),
    caption: spot([336, rowTop[1] + 14.5, 366, rowTop[1] + 24], vb),
  };
}

// ── Settings: the cog's popover in Build mode (index.js _bloomOptsHtml over bloom-config.json's bloomOptSpec, its
//    Options, Errors, Tokens and Uploads groups), at its defaults (index.js _bloomToggles, _themeAuto). ──
function settingsView() {
  return {
    errors: ["Loose layers", "Stretched component", "Detached instances", "Off-grid position", "Low resolution", "Hidden layers", "Empty / lorem ipsum text", "Stretched images (in components)", "Aspect ratio unlocked", "Check frame dimensions in file names"],
    tokens: ["Raw fill colour", "Raw stroke colour", "Unstyled text", "Raw corner radius"],
    dpi: `${DPI}dpi ▾`,
    generateAs: "New layer ▾",
  };
}

export function bloomPanel() {
  return { fix: fixView(), tokens: tokensView(), settings: settingsView() };
}
