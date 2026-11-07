// Bloom's graphic, the bloom, drawn at build time for its live job (src/_data/jobs.js, partials/live-job.njk). A port of
// the plugin's own renderer (monocode.campaign-manager bloom/src/ui/index.js): renderBloomSVG in its explicit mode (a page
// of up to 10 frame sizes: one square, one spoke and one dot a frame), buildDots, _buildFan (each frame's healthy layers
// fanned out from its dot), _dimFlag (the pink size ≠ name arrow), the orbiting title, the ring the error and token marks
// ride, and _drawGlyph / _drawToken, in the plugin's dark theme. Its 276-unit box, S and every constant are the plugin's;
// strokes don't scale with the box (non-scaling-stroke), so its hairlines stay hairlines at the site's size. The seed is
// this file's own, so the rosette is the plugin's in kind, not the plugin's for this page to the pixel.
// Kept out of src/_data, as a data file's named exports change what Eleventy reads from it.

export const W = 276;
const S = W / 240, CX = W / 2, CY = W / 2;
export const COLOURS = { fg: "#f1f2f4", red: "#ff6369", warn: "#ff7d1a", pink: "#ff9dcb", muted: "#8b9298", bg: "#000" };
const FG = COLOURS.fg;

// A seeded random stream (mulberry32 over an FNV-1a hash of the seed string), so a job always blooms the same.
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
function rng(seed) {
  let a = seed;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rot = (x, y, deg) => { const a = (deg * Math.PI) / 180; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; };
const f = (n) => +n.toFixed(2);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** _drawGlyph: an error mark's glyph (or a healthy layer's, by its role) at px, py, half-size xs. */
export function glyph(ico, px, py, xs, col, op = 1, width = 1) {
  const sa = `stroke="${col}" stroke-width="${width}" opacity="${op}" fill="none"`;
  const ln = (x1, y1, x2, y2) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${sa}/>`;
  const txt = (ch, size) => `<text x="${f(px)}" y="${f(py)}" text-anchor="middle" dominant-baseline="central" font-family="ui-monospace,Menlo,monospace" font-size="${f(size)}" fill="${col}" opacity="${op}">${ch}</text>`;
  const sq = `<rect x="${f(px - xs)}" y="${f(py - xs)}" width="${f(2 * xs)}" height="${f(2 * xs)}" ${sa}/>`;
  switch (ico) {
    case "text": return ln(px - xs, py - xs, px + xs, py - xs) + ln(px, py - xs, px, py + xs);
    case "kv": case "detached": return `<polygon points="${f(px)},${f(py - xs)} ${f(px + xs)},${f(py)} ${f(px)},${f(py + xs)} ${f(px - xs)},${f(py)}" ${sa}/>`;
    case "bg": case "badbg": return sq;
    case "vector": return `<circle cx="${f(px)}" cy="${f(py)}" r="${f(xs)}" ${sa}/>`;
    case "at": return txt("@", 2.6 * xs);
    case "offgrid": return ln(px - xs, py + xs, px + xs, py - xs);
    case "hidden": return `<circle cx="${f(px)}" cy="${f(py)}" r="${f(xs * 0.7)}" ${sa}/>` + ln(px - xs, py + xs, px + xs, py - xs);
    case "emptytext": return ln(px - xs, py - xs, px + xs, py - xs) + ln(px, py - xs, px, py + xs) + ln(px - xs * 1.1, py + xs * 0.5, px + xs * 1.1, py + xs * 0.5);
    case "lowres": case "img": return sq + `<polyline points="${f(px - xs * 0.65)},${f(py + xs * 0.65)} ${f(px - xs * 0.1)},${f(py - xs * 0.1)} ${f(px + xs * 0.65)},${f(py + xs * 0.65)}" ${sa}/>`;
    case "lockratio": {
      const bw = xs * 1.5, bh = xs * 0.92, sr = xs * 0.64, y = py + xs * 0.12;
      return `<rect x="${f(px - bw / 2)}" y="${f(y)}" width="${f(bw)}" height="${f(bh)}" rx="1.5" ${sa}/><path d="M ${f(px - sr)} ${f(y)} A ${f(sr)} ${f(sr)} 0 0 1 ${f(px + sr)} ${f(y)}" ${sa}/>`;
    }
    default: return ln(px - xs, py - xs, px + xs, py + xs) + ln(px - xs, py + xs, px + xs, py - xs);
  }
}

/** _drawToken: a token candidate's mark — a disc in a raw fill colour, a ring in a raw stroke colour, an "a", a corner. */
export function token(ico, col, px, py, xs) {
  const r = xs * 1.5;
  if (ico === "tk-fill") return `<circle cx="${f(px)}" cy="${f(py)}" r="${f(r)}" fill="${col}"/>`;
  if (ico === "tk-stroke") return `<circle cx="${f(px)}" cy="${f(py)}" r="${f(r - 0.6)}" fill="none" stroke="${col}" stroke-width="1.4"/>`;
  if (ico === "tk-type") return `<text x="${f(px)}" y="${f(py)}" text-anchor="middle" dominant-baseline="central" font-family="ui-monospace,Menlo,monospace" font-size="${f(4.5 * xs)}" fill="${FG}">a</text>`;
  const s = r * 0.9;
  return `<path d="M ${f(px - s)} ${f(py + s)} L ${f(px - s)} ${f(py - s * 0.3)} Q ${f(px - s)} ${f(py - s)} ${f(px + s * 0.3)} ${f(py - s)} L ${f(px + s)} ${f(py - s)}" fill="none" stroke="${FG}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** A mark's colour, as the plugin gives it: red for most errors, amber (--warn) for off-grid, low resolution and an unlocked ratio. */
export const markColour = (m) => m.group === "token" ? (m.raw ?? FG) : m.type === "namesize" ? COLOURS.pink : (["offgrid", "lowres", "lockratio"].includes(m.type) ? COLOURS.warn : COLOURS.red);

/** A chip's glyph for the filter bar, on a 16-unit box. Off-grid is a slash there, whatever the layer. */
export function chip(m) {
  const col = markColour(m);
  const body = m.group === "token" ? token(m.ico, col, 0, 0, 3.6) : m.type === "namesize" ? ARROW(0, 4, 13) : glyph(m.type === "offgrid" ? "offgrid" : m.ico, 0, 0, 4.6, col, 1, 1.4);
  return `<svg viewBox="-8 -8 16 16" aria-hidden="true">${body}</svg>`;
}

// The pink arrow's artwork (an open path filled solid), its tip at px, py, `w` wide.
const ARROW = (px, py, w) => {
  const k = w / 252.2, h = w * (112.39 / 252.2);
  return `<g transform="translate(${f(px - w / 2)},${f(py - h)}) scale(${k.toFixed(5)}) translate(-664.22,-364.51)"><path d="M916.42,364.51l-102.7,102.7c-12.92,12.92-33.88,12.92-46.8,0l-102.7-102.7" fill="${COLOURS.pink}"/></g>`;
};

/**
 * The bloom for a job: `{ name, file, page, frames: [{ name, w, h, healthy, cats }], marks: [{ id, type, ico, group, frame, … }] }`.
 * Returns the SVG and, for each mark, where it sits (the ring, or a misnamed frame's dot) in the box's units.
 */
export function renderBloom(job) {
  const rnd = rng(hash(job.name + "::bloom"));
  const maxDim = W * 0.5, bloomR = maxDim / 2, startRot = rnd() * 360;
  // Explicit mode: one master a frame, in aspect-ratio order, each turned its share of the circle.
  const frames = [...job.frames].sort((a, b) => a.w / a.h - b.w / b.h);
  const mN = frames.length;
  const M = frames.map((fr, i) => {
    const [w, h] = fr.w >= fr.h ? [maxDim, (maxDim * fr.h) / fr.w] : [(maxDim * fr.w) / fr.h, maxDim];
    return { fr, i, w, h, rotDeg: startRot + (i / mN) * 360 };
  });

  // The comb: each frame's square (explicit mode draws them at 0.4) and its spoke, one tick just outside the rosette.
  let comb = "";
  M.forEach((m, i) => {
    comb += `<g class="bl-in" style="--d: ${Math.min(i * 40, 800)}ms"><rect x="${f(CX - m.w / 2)}" y="${f(CY - m.h / 2)}" width="${f(m.w)}" height="${f(m.h)}" fill="none" stroke="${FG}" stroke-width="0.5" opacity="0.4" transform="rotate(${f(m.rotDeg)} ${CX} ${CY})"/>`;
    const th = ((m.rotDeg - 90) * Math.PI) / 180, ux = Math.cos(th), uy = Math.sin(th), px0 = -Math.sin(th), py0 = Math.cos(th);
    const r0 = bloomR + 9 * S, cx = CX + ux * r0, cy = CY + uy * r0, len = 2.4 * S;
    comb += `<line x1="${f(cx - px0 * len)}" y1="${f(cy - py0 * len)}" x2="${f(cx + px0 * len)}" y2="${f(cy + py0 * len)}" stroke="${FG}" stroke-width="1" stroke-linecap="round" opacity="0.8"/></g>`;
  });

  // The dots, static: at the rosette's rim on each frame's angle, sized by the frame's pixels; landscape solid, portrait open.
  const dotPos = M.map((m) => { const [x, y] = rot(0, -bloomR, m.rotDeg); return { x: CX + x, y: CY + y }; });
  const maxDiag = Math.max(1, ...frames.map((fr) => Math.hypot(fr.w, fr.h)));
  let dots = "", fans = "";
  M.forEach((m, i) => {
    const { x, y } = dotPos[i], r = (1.7 + 3.0 * Math.min(1, Math.hypot(m.fr.w, m.fr.h) / maxDiag)) * S;
    dots += m.fr.w > m.fr.h ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${FG}"/>` : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${FG}" stroke-width="1.2"/>`;
    fans += fan(dotPos[i], m.fr, job.name + "::fan" + i);
  });

  // The title: the file's name and the page's, lower case, on two rings that turn at their own rates.
  const orbR1 = bloomR + 28.5 * S, orbR2 = bloomR + 15 * S;
  const circ = (r) => `M ${f(CX - r)} ${CY} a ${f(r)} ${f(r)} 0 1 1 ${f(2 * r)} 0 a ${f(r)} ${f(r)} 0 1 1 ${f(-2 * r)} 0`;
  const title = `<defs><path id="bl-orb-1" d="${circ(orbR1)}"/><path id="bl-orb-2" d="${circ(orbR2)}"/></defs>`
    + `<g class="bl-orbit-1"><text font-family="ui-monospace,Menlo,monospace" font-size="${f(5.36 * S)}" letter-spacing="${f(S)}" fill="${COLOURS.muted}" paint-order="stroke" stroke="${COLOURS.bg}" stroke-width="3" stroke-linejoin="round"><textPath href="#bl-orb-1" startOffset="25%" text-anchor="middle">${esc(job.file.toLowerCase())}</textPath></text></g>`
    + `<g class="bl-orbit-2"><text font-family="ui-monospace,Menlo,monospace" font-size="${f(8 * S)}" letter-spacing="${f(S)}" fill="${FG}" paint-order="stroke" stroke="${COLOURS.bg}" stroke-width="2.4" stroke-linejoin="round"><textPath href="#bl-orb-2" startOffset="25%" text-anchor="middle">${esc(job.page.toLowerCase())}</textPath></text></g>`;

  // The marks: each on a free slot of the ring round the bloom (clear of the spokes, apart from each other), riding
  // the comb; a misnamed frame's arrow sits on its dot instead.
  const xrnd = rng(hash(job.name + "::xmarks"));
  const ringLo = Math.max(bloomR + 18 * S, W * 0.38), ringHi = W / 2 - 8 * S, placed = [];
  const far = (x, y) => placed.every((p) => Math.hypot(p[0] - x, p[1] - y) > 16 * S);
  const slot = () => {
    for (let t = 0; t < 400; t++) {
      const a = xrnd() * Math.PI * 2, r = ringLo + xrnd() * (ringHi - ringLo), x = CX + Math.cos(a) * r, y = CY + Math.sin(a) * r;
      if (far(x, y) || t === 399) { placed.push([x, y]); return [x, y]; }
    }
  };
  const xs0 = 1.9 * S, hit = xs0 * 2.4;
  let ring = "", flags = "";
  const at = {};
  for (const m of job.marks) {
    const label = esc(m.label);
    if (m.type === "namesize") {
      const i = M.findIndex((mm) => mm.fr.name === m.layer), { x, y } = dotPos[i];
      at[m.id] = [x, y - 3.5];
      flags += `<g class="bl-mark bl-flag" data-mark="${m.id}" tabindex="0" role="button" aria-label="${label}: ${esc(m.layer)}" aria-describedby="lj-pop-${m.id}"><title>${esc(m.title)}</title><g class="bl-bob">${ARROW(x, y, 15)}</g><circle cx="${f(x)}" cy="${f(y - 3.5)}" r="${f(hit)}" fill="transparent"/></g>`;
      continue;
    }
    const [x, y] = slot();
    at[m.id] = [x, y];
    const col = markColour(m);
    const body = m.group === "token" ? token(m.ico, col, 0, 0, 1.4 * S) : glyph(m.ico, 0, 0, m.ico === "lockratio" ? xs0 * 1.35 : xs0, col, 1, 1.4);
    ring += `<g class="bl-mark${m.group === "token" ? " bl-token" : ""}" data-mark="${m.id}" transform="translate(${f(x)},${f(y)})" tabindex="0" role="button" aria-label="${label}: ${esc(m.layer)}" aria-describedby="lj-pop-${m.id}" style="--d: ${(0.9 + (job.marks.indexOf(m) * 0.07)).toFixed(2)}s; --ink: ${m.ink}"><title>${esc(m.title)}</title><g class="bl-up"><circle r="${f(hit)}" fill="transparent"/><g class="bl-glyph">${body}</g></g></g>`;
  }

  const svg = `<svg class="lj-bloom" viewBox="0 0 ${W} ${W}" role="img" aria-label="The bloom: ${mN} frames as a rosette, and ${job.marks.length} marks round it">`
    + `<g class="bl-spin-c">${comb}</g>`
    + `<circle cx="${CX}" cy="${CY}" r="${f(1.1 * S)}" fill="${FG}" opacity="0.45"/>`
    + `<g class="bl-fans">${fans}</g><g class="bl-dots">${dots}</g>${title}`
    + `<g class="bl-spin-c bl-ring">${ring}</g><g class="bl-flags">${flags}</g></svg>`;
  return { svg, at };
}

// _buildFan: a frame's healthy layers as a sunburst opening outward from its dot — ring r holds r + 1 slots, each
// mark the layer's role glyph; one in white for every ten (up to 13), the rest grey.
function fan(dot, fr, seed) {
  const L = Math.max(0, fr.healthy | 0), blacks = Math.min(13, Math.floor(L / 10)), greys = L % 10;
  const shades = [...Array(blacks).fill("1"), ...Array(greys).fill("0.66")], N = shades.length;
  if (!N) return "";
  const frnd = rng(hash(seed)), c = fr.cats ?? {}, pool = [], present = [];
  for (const [k, n] of Object.entries(c)) { for (let i = 0; i < n; i++) pool.push(k); if (n > 0) present.push(k); }
  const seq = present.slice(0, N);
  while (seq.length < N) seq.push(pool.length ? pool[Math.floor(frnd() * pool.length)] : "vector");
  for (let i = seq.length - 1; i > 0; i--) { const j = Math.floor(frnd() * (i + 1)); [seq[i], seq[j]] = [seq[j], seq[i]]; }
  const base = Math.atan2(dot.y - CY, dot.x - CX), gap = 4.6 * S, baseXs = 1.7 * S;
  let out = "", idx = 0;
  for (let ri = 0; idx < N; ri++) {
    const slots = ri + 1, rd = gap * (ri + 1), step = gap / Math.max(gap, rd), xs = Math.max(0.9 * S, baseXs * (1 - ri * 0.12));
    for (let si = 0; si < slots && idx < N; si++, idx++) {
      const a = base + (si - (slots - 1) / 2) * step;
      out += glyph(seq[idx], dot.x + Math.cos(a) * rd, dot.y + Math.sin(a) * rd, xs, FG, shades[idx]);
    }
  }
  return out;
}
