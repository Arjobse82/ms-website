// Frame Multiplier's principles, drawn at build time for its hero (src/_data/diagrams.js, partials/diagram.njk): six
// master layouts whose layers carry roles, the sizes in between laid out by blending the nearest two, and the hero
// nudged, then scaled, clear of the headline where the blend would put it underneath. A model of the plugin's idea, not
// its engine (monocode.campaign-manager src/main/apps/rollout/engine): each layer is blended between the masters nearest
// the frame's proportions, by where the ratio falls between theirs; the headline's text wraps by its letters, so a
// narrower box takes another line; and the copy-dodge moves the hero down as far as the safe area allows, then shrinks
// it about its foot by what is left.
// Kept out of src/_data, as a data file's named exports change what Eleventy reads from it.

const INK = "#111", HERO = "#3372f6", PAPER = "#fff", MUTED = "#8a8a8a";
const f = (n) => +n.toFixed(2);

// Each master, a size and the name its ratio goes by: the headline's box (x, top, width as shares of the frame's width
// and height) and its type size (a share of the frame's short side); the hero's centre (shares) and diameter (a share
// of the short side); the logo and the legal line. Each is laid out for its own shape, and each is clean: its hero sits
// clear of its headline.
export const MASTERS = [
  { size: [160, 600], label: "160×600", headline: { x: 0.1, y: 0.05, w: 0.8, fs: 0.17 }, hero: { cx: 0.5, cy: 0.58, d: 0.86 }, logo: { cx: 0.5, cy: 0.88, d: 0.3 }, legal: { x: 0.1, y: 0.965, w: 0.8 } },
  { size: [1080, 1920], label: "9:16", headline: { x: 0.1, y: 0.07, w: 0.8, fs: 0.1 }, hero: { cx: 0.5, cy: 0.6, d: 0.84 }, logo: { cx: 0.86, cy: 0.93, d: 0.11 }, legal: { x: 0.1, y: 0.955, w: 0.42 } },
  { size: [1080, 1350], label: "4:5", headline: { x: 0.08, y: 0.07, w: 0.84, fs: 0.09 }, hero: { cx: 0.6, cy: 0.64, d: 0.66 }, logo: { cx: 0.12, cy: 0.9, d: 0.1 }, legal: { x: 0.08, y: 0.96, w: 0.4 } },
  { size: [1080, 1080], label: "1:1", headline: { x: 0.07, y: 0.07, w: 0.6, fs: 0.085 }, hero: { cx: 0.68, cy: 0.63, d: 0.52 }, logo: { cx: 0.12, cy: 0.88, d: 0.11 }, legal: { x: 0.07, y: 0.955, w: 0.36 } },
  { size: [1200, 628], label: "1.91:1", headline: { x: 0.05, y: 0.26, w: 0.48, fs: 0.13 }, hero: { cx: 0.75, cy: 0.52, d: 0.8 }, logo: { cx: 0.05, cy: 0.86, d: 0.1 }, legal: { x: 0.12, y: 0.95, w: 0.24 } },
  { size: [970, 250], label: "970×250", headline: { x: 0.2, y: 0.2, w: 0.45, fs: 0.2 }, hero: { cx: 0.83, cy: 0.5, d: 0.84 }, logo: { cx: 0.09, cy: 0.5, d: 0.32 }, legal: { x: 0.2, y: 0.9, w: 0.3 } },
];
export const HEADLINE = "The Towering Inferno Burger.";
const SAFE = 0.04, GAP = 0.03;

const r = (m) => m.size[0] / m.size[1];
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, t) => Object.fromEntries(Object.keys(a).map((k) => [k, lerp(a[k], b[k], t)]));

/** The blend for a ratio: the nearest master below and above, and how far between them it falls (by log ratio). */
export function blendFor(ratio) {
  const ms = [...MASTERS].sort((a, b) => r(a) - r(b));
  if (ratio <= r(ms[0])) return { a: ms[0], b: ms[0], t: 0 };
  if (ratio >= r(ms[ms.length - 1])) return { a: ms[ms.length - 1], b: ms[ms.length - 1], t: 0 };
  const i = ms.findIndex((m) => r(m) >= ratio), a = ms[i - 1], b = ms[i];
  return { a, b, t: (Math.log(ratio) - Math.log(r(a))) / (Math.log(r(b)) - Math.log(r(a))) };
}

// The headline, wrapped by its letters (an average letter is 0.55 of the type size) into the box's width.
function wrap(text, boxW, fs) {
  const em = (s) => s.length * 0.55 * fs, lines = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && em(last + " " + word) <= boxW) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  return lines.map((s) => ({ s, w: em(s) }));
}

/** A frame W × H laid out: the blend, then the copy-dodge. Returns its layers in pixels, and what the dodge did. */
export function layout(W, H) {
  const { a, b, t } = blendFor(W / H), short = Math.min(W, H);
  const hl = mix(a.headline, b.headline, t), he = mix(a.hero, b.hero, t), lo = mix(a.logo, b.logo, t), le = mix(a.legal, b.legal, t);
  const fs = hl.fs * short, lines = wrap(HEADLINE, hl.w * W, fs), lh = fs * 1.08;
  const headline = { x: hl.x * W, y: hl.y * H, w: hl.w * W, h: lines.length * lh, fs, lh, lines };
  const blended = { cx: he.cx * W, cy: he.cy * H, d: he.d * short };
  const hero = { ...blended };
  // The copy-dodge, where the hero and the headline's letters overlap: the cheaper way clear, down or to the right;
  // as far that way as the safe area lets it go (the nudge), then smaller by what is left, its far side held (the scale).
  const textR = headline.x + Math.max(...lines.map((l) => l.w)), textB = headline.y + headline.h;
  const overlaps = hero.cx + hero.d / 2 > headline.x && hero.cx - hero.d / 2 < textR && hero.cy - hero.d / 2 < textB;
  let nudge = 0, scale = 1, way = null;
  if (overlaps) {
    const down = textB + GAP * H - (hero.cy - hero.d / 2), right = textR + GAP * W - (hero.cx - hero.d / 2);
    way = right < down ? "right" : "down";
    const need = way === "right" ? right : down;
    const room = Math.max(0, way === "right" ? W * (1 - SAFE) - (hero.cx + hero.d / 2) : H * (1 - SAFE) - (hero.cy + hero.d / 2));
    nudge = Math.min(need, room);
    if (way === "right") hero.cx += nudge; else hero.cy += nudge;
    const rest = need - nudge;
    if (rest > 0) {
      const d = hero.d - rest;
      scale = d / hero.d;
      if (way === "right") hero.cx = hero.cx + hero.d / 2 - d / 2; else hero.cy = hero.cy + hero.d / 2 - d / 2;
      hero.d = d;
    }
  }
  return {
    W, H, blend: { a, b, t }, headline, blended, hero, nudge, scale, way,
    logo: { cx: lo.cx * W, cy: lo.cy * H, d: lo.d * short }, legal: { x: le.x * W, y: le.y * H, w: le.w * W },
  };
}

/** A laid-out frame drawn at x, y, scaled by k. `ghost` draws where the blend put the hero, dashed. */
export function drawFrame(L, x, y, k, { ghost = false, master = false, lite = false } = {}) {
  const X = (v) => f(x + v * k), Y = (v) => f(y + v * k), K = (v) => f(v * k);
  const h = L.headline, cap = h.fs * 0.62;
  let s = `<rect x="${X(0)}" y="${Y(0)}" width="${K(L.W)}" height="${K(L.H)}" rx="${f(Math.max(1.5, K(L.W) * 0.03))}" fill="${INK}"${master ? "" : ' opacity="0.86"'}/>`;
  s += h.lines.map((l, i) => `<rect x="${X(h.x)}" y="${Y(h.y + i * h.lh + (h.lh - cap) / 2)}" width="${K(l.w)}" height="${K(cap)}" rx="${f(K(cap) * 0.2)}" fill="${PAPER}"/>`).join("");
  if (ghost) s += `<circle cx="${X(L.blended.cx)}" cy="${Y(L.blended.cy)}" r="${K(L.blended.d / 2)}" fill="none" stroke="${HERO}" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  s += `<circle cx="${X(L.hero.cx)}" cy="${Y(L.hero.cy)}" r="${K(L.hero.d / 2)}" fill="${HERO}"/>`;
  if (lite) return s;
  s += `<circle cx="${X(L.logo.cx)}" cy="${Y(L.logo.cy)}" r="${K(L.logo.d / 2)}" fill="${PAPER}"/>`;
  s += `<rect x="${X(L.legal.x)}" y="${Y(L.legal.y)}" width="${K(L.legal.w)}" height="${f(Math.max(0.8, K(L.H * 0.008)))}" fill="${MUTED}"/>`;
  return s;
}

// The resizes the family tree follows, tall to wide: one between each pair of masters, and one beyond the widest.
const SIZES = [[300, 600], [1000, 1500], [1080, 1200], [1200, 1000], [1500, 500], [728, 90]];
const name = (m) => m.label;
const ratioName = (w, h) => {
  const g = (a, b) => (b ? g(b, a % b) : a), d = g(w, h);
  return w / d > 20 || h / d > 20 ? `${w}×${h}` : `${w / d}:${h / d}`;
};
const label = (x, y, text, { size = 10, weight = 500, fill = INK, anchor = "start", mono = false } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${mono ? ' font-family="ui-monospace, Menlo, monospace" letter-spacing="0.04em"' : ""}>${text}</text>`;

/** 01 · Build: the six masters as thumbnails, each laid out for its own shape, in rows by shape, each row filling the
 *  width at one height. */
function masters() {
  const W = 300, x0 = 10, rows = [[0, 1, 2], [3, 4], [5]], heights = [150, 92, null];
  let s = "", y = 8;
  rows.forEach((row, ri) => {
    const ms = row.map((i) => MASTERS[i]);
    const h = heights[ri] ?? W * (ms[0].size[1] / ms[0].size[0]);
    const widths = ms.map((m) => h * r(m)), gap = ms.length > 1 ? (W - widths.reduce((a, b) => a + b, 0)) / (ms.length - 1) : 0;
    let x = x0;
    ms.forEach((m, j) => {
      const L = layout(...m.size), k = h / m.size[1];
      s += drawFrame(L, x, y, k, { master: true });
      s += label(x, y + h + 15, m.label, { size: 10, weight: 700, mono: true });
      x += widths[j] + gap;
    });
    y += h + 38;
  });
  return `<svg class="dg-svg" viewBox="0 0 320 ${f(y - 16)}" role="img" aria-label="Six masters, tall to wide, each laid out for its own shape">${s}</svg>`;
}

// The plugin's role glyphs, as its Setup menu draws them: background □, hero ★, headline T, logo ○, legal T.
const ROLE_GLYPH = {
  background: (x, y) => `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="none" stroke="${INK}" stroke-width="1.2"/>`,
  hero: (x, y) => `<polygon points="${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 2.2 : 5; return `${f(x + Math.cos(a) * rr)},${f(y + Math.sin(a) * rr)}`; }).join(" ")}" fill="${INK}"/>`,
  headline: (x, y) => label(x, y + 4, "T", { size: 11, weight: 700, anchor: "middle" }),
  logo: (x, y) => `<circle cx="${x}" cy="${y}" r="4.2" fill="none" stroke="${INK}" stroke-width="1.3"/>`,
  legal: (x, y) => label(x, y + 3.5, "T", { size: 9, weight: 500, anchor: "middle" }),
};

/** 02 · Layers: the square master pulled apart, its layers stacked, each with its role and the layer's name. */
function layers() {
  const M = layout(1080, 1080), S = 108, k = S / 1080, gap = 37, top = 30, x0 = 26;
  const iso = (ty) => `matrix(0.866 0.5 -0.866 0.5 ${f(x0 + S * 0.866)} ${f(ty)})`;
  const plate = (inner, ty, fill = PAPER) => `<g transform="${iso(ty)}"><rect width="${S}" height="${S}" fill="${fill}" stroke="#cfcfcf" stroke-width="0.8"/>${inner}</g>`;
  const h = M.headline, cap = h.fs * 0.62;
  const stack = [
    ["legal", "Disclaimer", `<rect x="${f(M.legal.x * k)}" y="${f(M.legal.y * k)}" width="${f(M.legal.w * k)}" height="1.4" fill="${MUTED}"/>`],
    ["logo", "M", `<circle cx="${f(M.logo.cx * k)}" cy="${f(M.logo.cy * k)}" r="${f((M.logo.d / 2) * k)}" fill="${INK}"/>`],
    ["headline", "Inferno", h.lines.map((l, i) => `<rect x="${f(h.x * k)}" y="${f((h.y + i * h.lh + (h.lh - cap) / 2) * k)}" width="${f(l.w * k)}" height="${f(cap * k)}" fill="${INK}"/>`).join("")],
    ["hero", "Burger", `<circle cx="${f(M.hero.cx * k)}" cy="${f(M.hero.cy * k)}" r="${f((M.hero.d / 2) * k)}" fill="${HERO}"/>`],
    ["background", "Red-bg", ""],
  ];
  let s = "";
  // Bottom up, so each plate lies over the one under it; its label at its right-hand corner.
  [...stack].reverse().forEach(([role, layer, inner], j) => {
    const i = stack.length - 1 - j, ty = top + i * gap;
    s += plate(inner, ty, role === "background" ? INK : "none");
    const cx = x0 + S * 0.866 * 2, cy = ty + S * 0.5;
    s += `<line x1="${f(cx + 4)}" y1="${f(cy)}" x2="${f(cx + 22)}" y2="${f(cy)}" stroke="#bdbdbd" stroke-width="1"/>`;
    s += ROLE_GLYPH[role](cx + 32, cy) + label(cx + 44, cy + 3.5, role, { size: 10.5, weight: 600 }) + label(cx + 44, cy + 16, layer, { size: 9.5, fill: MUTED });
  });
  return `<svg class="dg-svg" viewBox="0 0 330 300" role="img" aria-label="The square master's components stacked, each with its role: background (Red-bg), hero (Burger), headline (Inferno), logo (M) and legal (Disclaimer)">${s}</svg>`;
}

/** 03 · Resizes: the masters as parents, each resize under them with a line from the one or two it is blended from,
 *  heavier for the larger share; and the one where the hero was nudged and scaled, drawn large. */
function resizes() {
  const VW = 620, parentsY = 34, kidsY = 150;
  const fit = (w, h, box) => box / Math.max(w, h);
  const parents = MASTERS.map((m, i) => { const [w, h] = m.size; return { w, h, m, L: layout(w, h), cx: 46 + i * 95, k: fit(w, h, w > h ? 86 : 64) }; });
  const kids = SIZES.map(([w, h], i) => ({ w, h, L: layout(w, h), cx: i < 5 ? 93.5 + i * 95 : 575, k: fit(w, h, w > h ? (w / h > 2 ? 80 : 62) : 56) }));
  let lines = "", frames = "";
  for (const p of parents) {
    const pw = p.w * p.k, ph = p.h * p.k;
    frames += drawFrame(p.L, p.cx - pw / 2, parentsY, p.k, { master: true });
    frames += label(p.cx, parentsY - 10, name(p.m), { size: 9.5, weight: 700, anchor: "middle", mono: true });
    p.bottom = parentsY + ph;
  }
  const parentOf = (m) => parents.find((p) => p.m === m);
  for (const c of kids) {
    const cw = c.w * c.k, ch = c.h * c.k, { a, b, t } = c.L.blend;
    const shares = a === b ? [[a, 1]] : [[a, 1 - t], [b, t]];
    for (const [m, share] of shares) {
      const p = parentOf(m);
      lines += `<path d="M ${p.cx} ${f(p.bottom + 3)} C ${p.cx} ${f(p.bottom + 40)}, ${c.cx} ${f(kidsY - 40)}, ${c.cx} ${kidsY - 3}" fill="none" stroke="${INK}" stroke-width="${f(0.6 + share * 2.2)}" opacity="${f(0.25 + share * 0.6)}"/>`;
    }
    const hot = c.L.nudge > 0 && c.L.scale < 1 && c.L.way === "down";
    frames += drawFrame(c.L, c.cx - cw / 2, kidsY, c.k);
    if (hot) frames += `<rect x="${f(c.cx - cw / 2 - 3)}" y="${kidsY - 3}" width="${f(cw + 6)}" height="${f(ch + 6)}" rx="4" fill="none" stroke="${HERO}" stroke-width="1.4"/>`;
    frames += label(c.cx, kidsY + ch + 15, ratioName(c.w, c.h), { size: 10, weight: 700, anchor: "middle", mono: true });
    frames += label(c.cx, kidsY + ch + 28, shares.length === 1 ? `${name(a)} alone` : `${Math.round((1 - t) * 100)} · ${Math.round(t * 100)}`, { size: 9, fill: MUTED, anchor: "middle", mono: true });
    c.hot = hot; c.bottom = kidsY + ch;
  }
  // The output: hundreds more from the same six, each laid out the same way — rows of every shape in a shuffled order,
  // smaller row by row and fading, as the page fills.
  const kidsEnd = Math.max(...kids.map((k) => k.bottom)) + 28, fy0 = kidsEnd + 44;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  let field = "", n = 0, fy = fy0;
  for (const hr of [24, 20, 17, 15, 13, 11, 10, 9, 8, 7, 7, 6]) {
    let x = 0;
    for (let tries = 0; tries < 8; ) {
      const ratio = Math.exp(Math.log(0.25) + rnd() * (Math.log(6) - Math.log(0.25))), w = hr * ratio;
      if (x + w > VW) { tries++; continue; }
      field += drawFrame(layout(Math.round(1000 * ratio), 1000), x, fy, hr / 1000, { lite: true });
      x += w + 3.5; n++;
    }
    fy += hr + 4;
  }
  const total = n + kids.length;
  const big = `${MASTERS.length} → ${total}`;
  const count = `<text x="0" y="${f(fy0 - 14)}" font-size="22" font-weight="700" fill="${INK}" letter-spacing="-0.02em">${big}</text>`
    + label(big.length * 12.5 + 10, fy0 - 16, "MASTERS → RESIZES, EACH ONE LAID OUT", { size: 9, weight: 600, fill: MUTED, mono: true });

  // The nudge and the scale, magnified over the field: the 6:5, where the blend put its hero (dashed), the line it must
  // stay under, the nudge down and the hero scaled the rest of the way.
  const c = kids.find((k) => k.hot), Lc = c.L, K = 136 / c.w, iw = 226, ix = VW - iw, iy = fy0 - 8, bx = ix + 12, by = iy + 12;
  const cx = (v) => f(bx + v * K), cy = (v) => f(by + v * K);
  let call = `<path d="M ${c.cx} ${f(kidsEnd + 4)} C ${c.cx} ${f(iy - 10)}, ${f(ix + 30)} ${f(iy - 24)}, ${f(ix + 40)} ${f(iy - 1)}" fill="none" stroke="${HERO}" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  call += `<rect x="${ix}" y="${iy}" width="${iw}" height="${f(c.h * K + 80)}" rx="10" fill="#fff" stroke="#e3e3e3" filter="url(#dg-lift)"/>`;
  call += drawFrame(Lc, bx, by, K, { ghost: true });
  const clear = by + (Lc.headline.y + Lc.headline.h + GAP * c.h) * K;
  call += `<line x1="${f(bx + 5)}" y1="${f(clear)}" x2="${f(bx + c.w * K - 5)}" y2="${f(clear)}" stroke="#fff" stroke-opacity="0.55" stroke-width="1" stroke-dasharray="2 3"/>`;
  call += `<line x1="${cx(Lc.blended.cx)}" y1="${cy(Lc.blended.cy)}" x2="${cx(Lc.blended.cx)}" y2="${f(+cy(Lc.blended.cy) + Lc.nudge * K)}" stroke="#fff" stroke-width="1.4" marker-end="url(#dg-arrow)"/>`;
  const nx = bx + c.w * K + 10;
  call += label(nx, by + 12, "6:5", { size: 10, weight: 700, mono: true });
  call += label(nx, by + 34, "NUDGE", { size: 9, weight: 700, fill: HERO, mono: true }) + label(nx, by + 46, `down ${Math.round((Lc.nudge / c.h) * 100)}%`, { size: 9, fill: MUTED });
  call += label(nx, by + 68, "SCALE", { size: 9, weight: 700, fill: HERO, mono: true }) + label(nx, by + 80, `${Math.round(Lc.scale * 100)}%`, { size: 9, fill: MUTED });
  const ny = by + c.h * K + 20;
  call += label(bx, ny, "Where the blend put the hero (dashed) is under", { size: 9, fill: MUTED }) + label(bx, ny + 13, "the headline: nudged clear, then scaled.", { size: 9, fill: MUTED });

  const height = Math.max(fy, iy + c.h * K + 80) + 8;
  const defs = `<defs><marker id="dg-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#fff"/></marker>`
    + `<linearGradient id="dg-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0.12"/></linearGradient>`
    + `<mask id="dg-field"><rect x="0" y="${f(fy0)}" width="${VW}" height="${f(fy - fy0)}" fill="url(#dg-fade)"/></mask>`
    + `<filter id="dg-lift" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.14"/></filter></defs>`;
  return `<svg class="dg-svg" viewBox="0 0 ${VW} ${f(height)}" role="img" aria-label="A family tree: the six masters above, the resizes below, each joined to the one or two masters it is blended from, and under them ${total} resizes in all; the 6:5 magnified, its hero nudged down and scaled clear of the headline">${defs}${lines}${frames}${count}<g mask="url(#dg-field)">${field}</g>${call}</svg>`;
}

/** The diagram's three steps, left to right. */
export function frameMultiplierDiagram() {
  return { masters: masters(), layers: layers(), resizes: resizes() };
}
