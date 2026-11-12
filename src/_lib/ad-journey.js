// Ad Agent's page, the journey (partials/ad-journey.njk, site.js initJourney): the app's window drawn in its own dark
// house style (frame-multiplier-indesign src/app/index.html, app.css, house.css, nodes.ts; seen in its browser preview,
// 2026-11-12), at 1440 × 900, and a job made in it as you scroll: two creatives, BURGER and THICKSHAKE, a spreadsheet
// brief, the media specs book, the rollout to InDesign and Figma, rounds of edits, a logo profile, the AI's amends and
// a client's email, an A/B, tags and preflight, then the files sent. Everything in the window is drawn once, each part
// with the steps it shows in (`in`, `out`) and the classes it takes at a step (`st`, "4:made 12:dim"); the camera of
// each step frames what it names, and its highlights ring what it points at, both CSS selectors in the window.

export const WIN = { w: 1600, h: 900 };

// ── The job ───────────────────────────────────────────────────────────────────────────────────────────────────────
const CREATIVES = [
  { id: "b", key: "burger", name: "BURGER" },
  { id: "t", key: "shake", name: "THICKSHAKE" },
];
// Each channel's sizes, a creative's own, and where the channel is built: print and screens in the street in
// InDesign, social and display in Figma (the app's rule: InDesign for print, Figma for screens, unless a card says).
const CHANNELS = [
  { c: "b", ch: "OOH", tool: "InDesign", sizes: [["48", 6096, 3048, "mm"], ["6s", 1200, 1800, "mm"]] },
  { c: "b", ch: "DOOH", tool: "InDesign", sizes: [["d", 1080, 1920]] },
  { c: "b", ch: "Social", tool: "Figma", sizes: [["sq", 1080, 1080], ["pt", 1080, 1350]] },
  { c: "b", ch: "Display", tool: "Figma", sizes: [["mr", 300, 250], ["lb", 728, 90]] },
  { c: "t", ch: "DOOH", tool: "InDesign", sizes: [["d", 1080, 1920]] },
  { c: "t", ch: "Social", tool: "Figma", sizes: [["sq", 1080, 1080], ["pt", 1080, 1350]] },
  { c: "t", ch: "Display", tool: "Figma", sizes: [["mr", 300, 250], ["sk", 160, 600]] },
];
// The masters: six a creative, three made in InDesign and three in Figma, each named by its creative. A channel is
// built from the masters of the app it is built in, each size from the one nearest its shape.
const MASTER_SHAPES = [
  ["InDesign", 1200, 1800], ["InDesign", 1920, 1080], ["InDesign", 1080, 1920],
  ["Figma", 1080, 1080], ["Figma", 1080, 1350], ["Figma", 728, 90],
];
export const MASTERS = ["b", "t"].flatMap((c) => MASTER_SHAPES.map(([tool, w, h]) => ({ c, tool, w, h })));
const OUTPUTS = [
  { id: "pdf", label: "PDF-DESPATCH" },
  { id: "lores", label: "PDF-LORES" },
  { id: "jpg", label: "JPG" },
  { id: "png", label: "PNG" },
];
const DESTS = [{ id: "despatch", label: "DESPATCH" }, { id: "approvals", label: "APPROVALS" }];
const OUT_OF = { OOH: ["pdf", "lores"], DOOH: ["jpg"], Social: ["jpg", "png"], Display: ["jpg"] };
const DEST_OF = { pdf: ["despatch"], lores: ["approvals"], jpg: ["despatch", "approvals"], png: ["despatch"] };

// The steps each change reaches (see STEPS): a size edited by hand in R2, the OOH logo profile, the AI's bigger price
// on Social, the client's email (BURGER's headline, THICKSHAKE's price; a bigger logo on the banners suggested), then
// the sizes released for despatch, $1 each, and sent.
const AT = { made: 4, sheet: 5, edit: 6, logo: 7, price: 8, mail: 9, ab: 10, tags: 11, pre: 12, rel: 13, sent: 14 };

// ── The graph, as the app lays it out (nodes.ts): a column each, titled; tall nodes for the brief and creatives.
// It starts right of where a widget's card opens (x 88–428), so a card never hides a node; the node cards on the
// right open over the outputs and destinations alone (from x 1310). ──
const COL = {
  brief: { x: 452, w: 128 }, creative: { x: 612, w: 120 }, master: { x: 766, w: 182 }, ch: { x: 984, w: 146 },
  size: { x: 1164, w: 140 }, out: { x: 1338, w: 112 }, dest: { x: 1478, w: 104 },
};
const TITLES = [["brief", "Brief"], ["creative", "Creatives"], ["master", "Masters"], ["ch", "Channels"], ["size", "Sizes"], ["out", "Outputs"], ["dest", "Destinations"]];
const ROW = 25, NODE_H = 21, TALL_H = 36, CH_GAP = 9, CR_GAP = 26, TOP_Y = 316, TITLE_Y = 236;

const mmLabel = (w, h, u) => `${w} × ${h}${u ? " " + u : ""}`;

// Each size: its creative, channel and tool, its real size and its drawing's box (`W` × `H`, the longer side 400).
function sizesOf() {
  const out = [];
  for (const g of CHANNELS) for (const [k, w, h, u] of g.sizes) {
    const big = 400, W = w >= h ? big : (big * w) / h, H = w >= h ? (big * h) / w : big;
    out.push({ id: `${g.c}-${k}`, c: g.c, ch: g.ch, tool: g.tool, w, h, u, label: mmLabel(w, h, u), W: +W.toFixed(1), H: +H.toFixed(1) });
  }
  return out;
}

// The ratio glyph (the app's .ratio): the size's shape in an 11-unit box.
const ratio = (w, h) => { const s = 11 / Math.max(w, h); return { w: +(w * s).toFixed(1), h: +(h * s).toFixed(1) }; };

function graph(sizes) {
  const nodes = [], edges = [];
  const node = (n) => { nodes.push(n); return n; };
  // Sizes first, top to bottom: a creative's channels in turn, a gap between channels and a wider one between creatives.
  let y = TOP_Y, k = 0;
  const chans = [];
  CREATIVES.forEach((c, ci) => {
    if (ci) y += CR_GAP - CH_GAP;
    for (const g of CHANNELS.filter((g) => g.c === c.id)) {
      const of = sizes.filter((s) => s.c === c.id && s.ch === g.ch);
      const top = y;
      for (const s of of) {
        const tags = (TAGS_ON[s.id] || []).map((t) => TAG_DEFS.find((d) => d.id === t));
        const pre = PREFLIGHT.find((p) => p.size === s.id);
        node({
          id: `n-${s.id}`, kind: "size", x: COL.size.x, y, w: COL.size.w, h: NODE_H, label: s.label.replace(" mm", ""), unit: s.u,
          ratio: ratio(s.w, s.h), size: s.id, in: 2, d: k++, tags,
          st: [`${AT.made}:made`, owed(s), s.id === "b-sq" ? `${AT.ab}:ab` : "", `${AT.pre}:${pre ? "pre-" + pre.level : "dim"}`, `${AT.rel}:-dim`, `${AT.rel}:-pre-err`, `${AT.rel}:-pre-warn`, `${AT.sent}:released`].filter(Boolean).join(" "),
        });
        y += ROW;
      }
      chans.push({ g, top, bottom: y - ROW + NODE_H, of });
      y += CH_GAP;
    }
  });
  // Channels: centred on their sizes, each with where it is built.
  for (const { g, top, bottom, of } of chans) {
    const n = node({ id: `n-${g.c}-${g.ch.toLowerCase()}`, kind: "ch", x: COL.ch.x, y: (top + bottom) / 2 - NODE_H / 2, w: COL.ch.w, h: NODE_H, label: g.ch, sub: `${of.length} size${of.length > 1 ? "s" : ""}`, tool: g.tool, c: g.c, in: 2 });
    for (const s of of) edges.push(link(n, nodes.find((m) => m.size === s.id), 2));
  }
  // Creatives, centred on their channels; their masters centred on them, each feeding the channels its app builds.
  const creativeNodes = CREATIVES.map((c) => {
    const mine = nodes.filter((n) => n.kind === "ch" && n.c === c.id);
    const top = mine[0].y, bottom = mine[mine.length - 1].y + NODE_H, mid = (top + bottom) / 2;
    const own = MASTERS.filter((m) => m.c === c.id);
    const cr = node({ id: `n-${c.id}`, kind: "creative", x: COL.creative.x, y: mid - TALL_H / 2, w: COL.creative.w, h: TALL_H, label: c.name, sub: `${own.length} masters`, in: 1 });
    const y0 = mid - (own.length * ROW - (ROW - NODE_H)) / 2;
    own.forEach((m, i) => {
      const n = node({ id: `n-${c.id}-m${i}`, kind: "master", x: COL.master.x, y: y0 + i * ROW, w: COL.master.w, h: NODE_H, label: `[${c.name}] ${m.w}x${m.h}`, ratio: ratio(m.w, m.h), tool: m.tool, in: 1 });
      edges.push(link(cr, n, 1));
      for (const ch of mine.filter((ch) => ch.tool === m.tool)) edges.push(link(n, ch, 2));
    });
    return cr;
  });
  // The brief, centred on everything.
  const all = nodes.filter((n) => n.kind === "size");
  const midAll = (all[0].y + all[all.length - 1].y + NODE_H) / 2;
  const brief = node({ id: "n-brief", kind: "brief", x: COL.brief.x, y: midAll - TALL_H / 2, w: COL.brief.w, h: TALL_H, label: "Summer Stack", sub: "brief.xlsx · 12 rows", in: 2 });
  for (const c of creativeNodes) edges.push(link(brief, c, 2));
  // Outputs and destinations, centred too.
  const outs = OUTPUTS.map((o, i) => node({ id: `n-${o.id}`, kind: "out", x: COL.out.x, y: midAll - (OUTPUTS.length * ROW) / 2 + i * ROW + 2, w: COL.out.w, h: NODE_H, label: o.label, out: o.id, in: 3 }));
  const dests = DESTS.map((d, i) => node({ id: `n-${d.id}`, kind: "dest", x: COL.dest.x, y: midAll - (DESTS.length * ROW) / 2 + i * ROW + 2, w: COL.dest.w, h: NODE_H, label: d.label, in: 3, st: `${AT.sent}:sent` }));
  for (const s of all) {
    const sz = sizes.find((x) => x.id === s.size);
    for (const o of OUT_OF[sz.ch]) edges.push(link(s, outs.find((n) => n.out === o), 3, `${AT.sent}:sent`));
  }
  for (const o of outs) for (const d of DEST_OF[o.out]) edges.push(link(o, dests.find((n) => n.id === `n-${d}`), 3, `${AT.sent}:sent`));
  return { nodes, edges, titles: TITLES.map(([k, t]) => ({ x: COL[k].x, y: TITLE_Y, t, in: k === "creative" || k === "master" ? 1 : k === "out" || k === "dest" ? 3 : 2 })) };
}
function link(a, b, step, st = "") {
  const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2, dx = (x2 - x1) / 2;
  return { d: `M${x1} ${y1}C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`, in: step, st };
}

// The steps that change a size (its drawing's states, `layers`): owed (orange) at each, made again by the next.
function changesOf(s) {
  const at = [];
  if (s.id === "b-pt") at.push(AT.edit);
  if (s.ch === "OOH") at.push(AT.logo);
  if (s.ch === "Social") at.push(AT.price);
  at.push(AT.mail);
  return at;
}
const owed = (s) => changesOf(s).map((k) => `${k}:owed ${k + 1}:-owed`).join(" ");

// ── Tags (step 11): the owner's three kinds of review and a client's sign-off, each with its colour ──
export const TAG_DEFS = [
  { id: "retouch", name: "Retouching", colour: "#a371f7", count: 2 },
  { id: "creative", name: "Creative review", colour: "#3372f6", count: 4 },
  { id: "legal", name: "Legal check", colour: "#e5a50a", count: 2 },
  { id: "client", name: "Client approval", colour: "#22a06b", count: 4 },
];
const TAGS_ON = {
  "b-48": ["retouch"], "b-6s": ["retouch"],
  "b-sq": ["creative", "client"], "b-pt": ["creative", "client"], "t-sq": ["creative", "client"], "t-pt": ["creative", "client"],
  "b-lb": ["legal"], "t-sk": ["legal"],
};

// ── Preflight (step 12): the rules' words (src/core/ai/qc.ts), a size each ──
export const PREFLIGHT = [
  { size: "b-48", level: "err", what: "6096 × 3048 mm", words: "burger.psd is about 118 ppi at the size supplied: it will print soft; 300 is wanted" },
  { size: "t-sk", level: "err", what: "160 × 600", words: "Legal text is about 6 px tall: too small to read" },
  { size: "b-d", level: "warn", what: "1080 × 1920", words: "The headline crosses DOOH's safe area by 24 px at the top" },
  { size: "b-lb", level: "warn", what: "728 × 90", words: "The price meets the logo, where no master lets them meet" },
];

// ── The artwork: a size's layout from its shape, the way the masters adapt, drawn in SVG ──
const BRAND = {
  burger: { bg: "#ffc93c", ink: "#1b1b1b", hero: "aj-burger", heroR: 1.2, line: ["SMASH", "IT."], line2: ["STACK IT", "HIGH."], price: "$9.90" },
  shake: { bg: "#f9b8d0", ink: "#3a0f22", hero: "aj-shake", heroR: 0.6, line: ["THICK.", "SHAKE."], line2: null, price: "$5.50", price2: "$4.90" },
};
const CW = 0.64; // a bold capital's width, in ems
const r1 = (v) => +v.toFixed(1);

/** A size's drawing at a state: `edit` (R2, by hand), `logo` (the OOH profile), `big` (the AI's price), `mail` (the
 *  client's email), `b` (its B). */
export function art(s, st = {}) {
  const b = BRAND[CREATIVES.find((c) => c.id === s.c).key];
  const { W, H } = s, u = Math.min(W, H), r = W / H, pad = u * 0.07;
  const words = st.mail && b.line2 ? b.line2 : b.line;
  const price = st.mail && b.price2 ? b.price2 : b.price;
  const fit = (lines, maxW, maxFs) => Math.min(maxFs, maxW / (Math.max(...lines.map((l) => l.length)) * CW));
  let head, hero, roundel, logo, legal;
  const logoH = u * 0.085, logoW = logoH * 3.3;
  if (r < 0.45) {
    // A skyscraper: logo, headline, hero, price, top to bottom.
    logo = { x: (W - logoW) / 2, y: pad, w: logoW, h: logoH };
    const fs = fit(words, W - 2 * pad, W * 0.3);
    head = { x: pad, y: logo.y + logoH + pad * 1.6 + fs * 0.8, fs, lines: words };
    const top = head.y + fs * (words.length - 0.2) + pad, hh = Math.min(H * 0.36, (W - 2 * pad) / b.heroR);
    hero = { x: (W - hh * b.heroR) / 2, y: top, w: hh * b.heroR, h: hh };
    const rr = W * 0.24;
    roundel = { cx: W / 2, cy: hero.y + hh + rr * 1.3, r: rr };
    legal = { x: W / 2, y: H - pad * 0.8, anchor: "middle", fs: W * 0.06 };
  } else if (r <= 1.25) {
    // Portrait and square: the headline top left, the hero below it, the price on the hero's right, logo bottom left.
    const fs = fit(words, W - 2 * pad, u * 0.2) * (st.edit ? 1.12 : 1);
    head = { x: pad, y: pad + fs * 0.82, fs, lines: words };
    const top = head.y + fs * (words.length - 1) + fs * 0.45, bottom = H - pad - logoH - pad * 0.6;
    let hh = Math.min(bottom - top, (W * 0.86) / b.heroR) * (st.edit ? 1.08 : 1);
    hero = { x: (W - hh * b.heroR) / 2, y: bottom - hh, w: hh * b.heroR, h: hh };
    const rr = u * 0.12;
    roundel = { cx: W - pad - rr, cy: Math.max(top + rr, hero.y + hh * 0.25), r: rr };
    logo = { x: pad, y: H - pad - logoH, w: logoW, h: logoH };
    legal = { x: W - pad, y: H - pad * 0.7, anchor: "end", fs: u * 0.024 };
  } else if (r < 3.5) {
    // Landscape: the headline and price on the left, the hero on the right.
    const fs = fit(words, W * 0.46 - pad, H * 0.2);
    head = { x: pad, y: pad + fs * 0.85, fs, lines: words };
    const hh = Math.min(H - 2 * pad, (W * 0.5) / b.heroR);
    hero = { x: W - pad - hh * b.heroR, y: (H - hh) / 2, w: hh * b.heroR, h: hh };
    const rr = H * 0.13;
    roundel = { cx: pad + rr, cy: head.y + fs * (words.length - 1) + fs * 0.4 + rr, r: rr };
    logo = { x: pad, y: H - pad - logoH, w: logoW, h: logoH };
    legal = { x: W - pad, y: H - pad * 0.5, anchor: "end", fs: u * 0.03 };
  } else {
    // A leaderboard: logo, headline, hero, price, left to right.
    const lh = H * 0.42, lw = lh * 3.3;
    logo = { x: pad * 0.6, y: (H - lh) / 2, w: lw, h: lh };
    const one = [words.join(" ")], fs = fit(one, W * 0.38, H * 0.5);
    head = { x: logo.x + lw + H * 0.35, y: H / 2 + fs * 0.36, fs, lines: one };
    const hh = H * 0.86;
    hero = { x: W * 0.66, y: (H - hh) / 2, w: hh * b.heroR, h: hh };
    roundel = { cx: W - H * 0.55, cy: H / 2, r: H * 0.4 };
    legal = { x: W - H * 1.05, y: H - H * 0.08, anchor: "end", fs: H * 0.09 };
  }
  // The OOH logo profile: 3 % of the layout's ink, bottom right, inset 23 % of its height; the legal line moves left.
  if (st.logo) {
    const area = 0.03 * W * H, h = Math.sqrt(area / 3.3), inset = h * 0.23 + pad * 0.6;
    logo = { x: W - inset - h * 3.3, y: H - inset - h, w: h * 3.3, h };
    legal = { ...legal, x: pad, anchor: "start" };
    if (r <= 1.25) roundel = { ...roundel, cy: Math.min(roundel.cy, logo.y - roundel.r * 1.2) };
  }
  if (st.big) roundel = { ...roundel, r: roundel.r * 1.4, cx: r < 3.5 && r > 1.25 ? roundel.cx + roundel.r * 0.4 : roundel.cx - (r <= 1.25 ? roundel.r * 0.4 : 0) };
  const R = (o) => `x="${r1(o.x)}" y="${r1(o.y)}" width="${r1(o.w)}" height="${r1(o.h)}"`;
  const text = head.lines.map((l, i) => `<tspan x="${r1(head.x)}" dy="${i ? r1(head.fs * 0.92) : 0}">${l}</tspan>`).join("");
  const rf = roundel.r * (price.length > 4 ? 0.62 : 0.7);
  const parts = [
    `<rect width="${r1(W)}" height="${r1(H)}" fill="${b.bg}"/>`,
    `<use href="#${b.hero}" ${R(hero)}/>`,
    `<text class="aj-a-head" x="${r1(head.x)}" y="${r1(head.y)}" font-size="${r1(head.fs)}" fill="${b.ink}">${text}</text>`,
    `<circle cx="${r1(roundel.cx)}" cy="${r1(roundel.cy)}" r="${r1(roundel.r)}" fill="${st.b ? "#e5484d" : b.ink}"/>`,
    `<text class="aj-a-price" x="${r1(roundel.cx)}" y="${r1(roundel.cy + rf * 0.36)}" font-size="${r1(rf)}">${price}</text>`,
    `<rect ${R(logo)} rx="${r1(logo.h * 0.5)}" fill="${b.ink}"/>`,
    `<text class="aj-a-logo" x="${r1(logo.x + logo.w / 2)}" y="${r1(logo.y + logo.h * 0.66)}" font-size="${r1(logo.h * 0.5)}">STACK'D</text>`,
    `<text class="aj-a-legal" x="${r1(legal.x)}" y="${r1(legal.y)}" font-size="${r1(legal.fs)}" text-anchor="${legal.anchor}" fill="${b.ink}">At participating stores. Prices may vary.</text>`,
  ];
  return `<svg class="aj-art" viewBox="0 0 ${r1(W)} ${r1(H)}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${parts.join("")}</svg>`;
}

// A size's drawings across the steps: a layer a state, each in from the step it starts at and out at the next.
function layers(s) {
  const changes = [{ at: AT.sheet, st: {} }];
  const KEY = { [AT.edit]: "edit", [AT.logo]: "logo", [AT.price]: "big", [AT.mail]: "mail" };
  for (const at of changesOf(s)) changes.push({ at, st: { ...changes[changes.length - 1].st, [KEY[at]]: true } });
  return changes.map((c, i) => ({ in: c.at, out: changes[i + 1]?.at, svg: art(s, c.st) }));
}

// The viewer's sheet (steps 5–9): each creative's sizes in a row, at one height, each with its tool; the leaderboard
// and skyscraper at a width and height of their own.
function sheet(sizes) {
  const ROW_H = 118;
  return CREATIVES.map((c) => ({
    name: c.name,
    items: sizes.filter((s) => s.c === c.id).map((s) => {
      const r = s.w / s.h;
      const w = r >= 3.5 ? 236 : ROW_H * r, h = r >= 3.5 ? 236 / r : ROW_H;
      return { ...s, dw: r1(w), dh: r1(h), layers: layers(s), edits: s.id === "b-pt" ? ["HEADLINE 112 %", "HERO 108 %"] : null };
    }),
  }));
}

// ── The steps ─────────────────────────────────────────────────────────────────────────────────────────────────────
// `cam`: what the step frames ("all", the whole window); `hl`: what it rings, a box each (a selector's matches as one).
export const STEPS = [
  { id: "start", title: "Scroll down to begin", text: "", cam: "all", hl: [] },
  { id: "masters", title: "Import your masters", text: "Build your masters in Figma and InDesign, and connect them to the app. Ad Agent can read and write to both programs.", cam: "#aj-card-masters, .aj-n-creative, .aj-n-master", hl: ["#aj-card-masters .aj-ms-id", "#aj-card-masters .aj-ms-fg", "#n-b-m0, #n-b-m5", "#n-t-m0, #n-t-m5"] },
  { id: "brief", title: "Preview your campaign rollout from the brief", text: "Import your brief. AI will begin a plan to roll out the files into InDesign or Figma.", cam: "#aj-card-brief, .aj-n-brief, .aj-n-ch, .aj-n-size", hl: [".aj-n-ch, .aj-n-size"] },
  { id: "specs", title: "Load your spec sheets", text: "AI will ensure your provided specs are applied to the rollout.", cam: "#aj-card-brief, .aj-n-size, .aj-n-out, .aj-n-dest", hl: ["#aj-card-brief"] },
  { id: "run", title: "Roll out to InDesign and Figma", text: "Press play. Ad Agent generates every size from the master: a low-res preview, free to review and amend as often as you like.", cam: "#aj-play, .aj-n-master, .aj-n-ch, .aj-n-size", hl: [".aj-n-size"] },
  { id: "sheet", title: "Twelve sizes, each from its nearest master", text: "Every size starts from the master nearest its shape and adapts its layout: headline, hero, price and logo moved and scaled, not squashed. Five came from the InDesign masters and seven from Figma's. All are low-res previews: free to review, their working files held back until you release them.", cam: "#aj-sheet", hl: ["#aj-sheet .aj-lowres"] },
  { id: "edit", title: "Edits managed with rounds", text: "Each change is a point in the round you can go back to.", cam: "#aj-th-b-pt, #aj-rounds", hl: ["#aj-th-b-pt", "#aj-rounds .aj-points"] },
  { id: "logo", title: "Apply Brand guidelines", text: "The app can store your brand guidelines and apply measurable changes like logo sizes and positions automatically.", cam: "#aj-card-brand, #aj-th-b-48, #aj-th-b-6s", hl: ["#aj-card-brand .aj-prof-on", "#aj-th-b-48", "#aj-th-b-6s"] },
  { id: "ai", title: "Amends, manually or with AI", text: "Ask the AI: make the price 20 % bigger on every Social size. It changes the price component on the four sizes and checks it still clears the logo.", cam: "#aj-chat-1, .aj-th-social", hl: ["#aj-chat-1 .aj-q", "#aj-th-b-sq", "#aj-th-b-pt", "#aj-th-t-sq", "#aj-th-t-pt"] },
  { id: "mail", title: "AI can handle a range of feedback", text: "Paste the client's feedback. The AI processes it into changes for your approval: BURGER's new headline on seven sizes, THICKSHAKE's new price on five. **Standard AI Plan** reads text feedback; **Multimodal AI Plan** also reads images, such as a marked-up proof or a screenshot.", cam: "#aj-chat-2, #aj-sheet", hl: ["#aj-chat-2 .aj-q", "#aj-chat-2 .aj-ask"] },
  { id: "ab", title: "An A/B round", text: "Make a B of the square Social post to test one difference: the price in red. B is drawn behind A, and it follows A's changes except its own. Its files end _a and _b while both live.", cam: "#aj-card-ab, #n-b-sq, #aj-rounds", hl: ["#aj-rounds .aj-ab", "#n-b-sq", "#aj-card-ab .aj-ab-b"] },
  { id: "tags", title: "Tagged for review", text: "Tag sizes for whoever looks next: the billboards for retouching, the social posts for creative review and the client's approval, the small display sizes for a legal check. The tag row filters the view by any of them.", cam: "#aj-tagrow, #aj-tagmenu, .aj-n-size", hl: ["#aj-tagrow .aj-tag-user", "#aj-tagmenu"] },
  { id: "preflight", title: "Preflight, on every size", text: "Every size made is checked, free: pictures too low in resolution for their print size, legal text too small to read, type over a screen's safe area, elements that meet where no master lets them. Two to fix, two to look at.", cam: ".aj-n-ch, .aj-n-size, #aj-card-pre", hl: ["#aj-card-pre .aj-pre-list"] },
  { id: "release", title: "Release for despatch: $1 a size", text: "Reviewing is free. When the round is approved, release the sizes you need, $1 each: Ad Agent saves each one's working file, the .indd or the Figma frame, and makes its full-resolution exports for despatch. Every later amend to a released size is free.", cam: "#aj-card-rel, .aj-n-size", hl: ["#aj-card-rel .aj-take", "#aj-card-rel .aj-rel-list"] },
  { id: "sent", title: "Delivered", text: "Released, you get each size's working file, in InDesign or Figma, at full resolution. Each channel's files go out as its specs ask: print PDFs to DESPATCH, proof PDFs and JPGs to APPROVALS, named by the job's tags.", cam: "all", hl: ["#n-despatch, #n-approvals", "#aj-status .is-on"] },
];

// On a phone the whole window is too small to read: each step's camera there frames a tighter part of what it shows.
const MOBILE_CAM = {
  start: "all", masters: "#aj-card-masters", brief: ".aj-n-brief, .aj-n-ch, .aj-n-size", specs: "#aj-card-brief",
  run: ".aj-n-ch, .aj-n-size", sheet: "#aj-th-b-48, #aj-th-b-6s, #aj-th-b-d, #aj-th-t-d, #aj-th-t-sq", edit: "#aj-th-b-pt",
  logo: "#aj-th-b-48, #aj-th-b-6s", ai: "#aj-chat-1, #aj-th-t-sq, #aj-th-t-pt", mail: "#aj-chat-2", ab: "#aj-card-ab",
  tags: "#aj-tagmenu, .aj-n-size", preflight: "#aj-card-pre", release: "#aj-card-rel", sent: ".aj-n-size, .aj-n-out, .aj-n-dest",
};

export function adJourney() {
  const sizes = sizesOf();
  const g = graph(sizes);
  return {
    heading: "From brief to despatch",
    intro: "A job made in Ad Agent's window, start to finish: the masters and a spreadsheet brief, the despatch specs, the rollout to InDesign and Figma, rounds of edits by hand and by the AI, an A/B, review tags and preflight, all on free low-res previews, then the release for despatch at $1 a size. Scroll, and each step zooms in on what it does.",
    win: WIN,
    at: AT,
    nodes: g.nodes,
    edges: g.edges,
    titles: g.titles,
    sheet: sheet(sizes),
    masters: ["InDesign", "Figma"].map((tool) => ({
      tool,
      files: MASTERS.filter((m) => m.tool === tool).map((m) => `[${CREATIVES.find((c) => c.id === m.c).name}] ${m.w}x${m.h}${tool === "InDesign" ? ".indd" : ""}`),
    })),
    tags: TAG_DEFS,
    preflight: PREFLIGHT.map((p) => ({ ...p })),
    ab: { a: art(sizes.find((s) => s.id === "b-sq"), { big: true, mail: true }), b: art(sizes.find((s) => s.id === "b-sq"), { big: true, mail: true, b: true }) },
    // The release: every size (B its own), $1 each, by channel.
    release: (() => {
      const by = {};
      for (const s of sizes) by[s.ch] = (by[s.ch] || 0) + 1 + (s.id === "b-sq" ? 1 : 0);
      const n = sizes.length + 1;
      return { n, channels: Object.entries(by).map(([ch, k]) => ({ ch, k })) };
    })(),
    steps: STEPS.map((s) => ({ ...s, mcam: MOBILE_CAM[s.id] })),
    sizes: sizes.length,
  };
}
