// What the Frame Multiplier panel's drawings show (panels.js, src/_includes/panel/frame-multiplier/): its role glyphs
// and column icons, the Components rows, the Frames tree and the selected frame's card. The glyphs, icons, column
// letters and wording are the plugin's own (monocode.campaign-manager src/main/apps/rollout/ui/ui.ts: ROLE_ICON, SVG,
// COLS, renderSetup, renderTree, renderDetail; engine/score.ts and updates.ts for the card's lines). The campaign is the
// one fm-diagram.js draws, and the selected frame's card is worked out from its layout, so the two always agree.
import { layout } from "./fm-diagram.js";

const svg = (body, attrs = 'fill="none" stroke="currentColor" stroke-width="1.5"') =>
  `<svg viewBox="0 0 16 16" ${attrs} aria-hidden="true">${body}</svg>`;

/** A role's glyph, as the tree's icon slot draws it. */
const ROLE_ICON = {
  hero: '<path fill="currentColor" stroke="none" d="M8 1.4l2 4.4 4.8.5-3.6 3.2 1 4.7L8 11.8l-4.2 2.4 1-4.7L1.2 6.3 6 5.8z"/>',
  bg: '<rect x="2.5" y="2.5" width="11" height="11" rx="1"/>',
  headline: '<path d="M3 3h10M8 3v10" stroke-width="2"/>',
  legal: '<path d="M4.5 2.5h3.2a5.5 5.5 0 0 1 0 11H4.5z" stroke-width="1.8"/>',
  logo: '<circle cx="8" cy="8" r="5.5"/>',
  other: '<path d="M3 8.5l3.2 3.2L13 4.5" stroke-width="2"/>',
};
const roleIcon = (role) => svg(ROLE_ICON[role], 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"');

/** The Components table's columns: letter, icon, and the roles each applies to (any role when null). */
const ICON = {
  pin: svg('<path d="M8 1.5v8M4.5 5.5l3.5 4 3.5-4"/><path d="M3 14h10" stroke-width="1.7"/>'),
  clamp: svg('<rect x="2" y="2" width="12" height="12"/><path d="M11 2v12"/>'),
  focal: svg('<circle cx="8" cy="8" r="4"/><path d="M8 1.5v2.5M8 12v2.5M1.5 8h2.5M12 8h2.5"/>'),
  collision: svg('<path d="M12.5 0.5L2 9.5H7L3.5 15.5L14 6.5H8.5Z"/>', 'fill="currentColor"'),
  scale: svg('<path d="M1.5 6V1.5h4M14.5 6V1.5h-4M1.5 10v4.5h4M14.5 10v4.5h-4"/>'),
};
const COLS = [
  { key: "pin", ltr: "P", icon: ICON.pin },
  { key: "clamp", ltr: "C", icon: ICON.clamp },
  { key: "focal", ltr: "Fo", icon: ICON.focal },
  { key: "collision", ltr: "Co", icon: ICON.collision },
  { key: "stretch", ltr: "S", icon: ICON.scale },
];

// A pin held by a corner: the plugin's arrow, turned to it.
const PIN_ROT = { ne: -45, nw: -135, se: 45, sw: 135 };
const pin = (corner) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${PIN_ROT[corner]}deg)" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`;
const flag = '<span class="fm-flag">A</span>';
const mono = (s) => `<span class="fm-mono">${s}</span>`;

/** The Components rows, the top of the stack first, as the panel lists them; a cell left out is blank. */
const LAYERS = [
  { name: "Disclaimer", role: "legal", cells: { pin: pin("sw"), collision: ICON.collision, stretch: ICON.scale } },
  { name: "M", role: "logo", cells: { pin: pin("se"), collision: ICON.collision, stretch: ICON.scale } },
  { name: "Inferno", role: "headline", cells: { pin: flag, collision: ICON.collision, stretch: ICON.scale } },
  { name: "Burger", role: "hero", mark: true, cells: { focal: flag, collision: ICON.collision, stretch: ICON.scale } },
  { name: "Red-bg", role: "bg", cells: { clamp: mono("NSEW"), stretch: ICON.scale } },
];

// The card: the 6:5 frame, the one the nudge and scale diagram shows. Its plan, worked out by the layout: where the
// blend put the hero, and where the copy-dodge moved it; the card's lines in the plugin's words.
const W = 1200, H = 1000, L = layout(W, H);
const box = (c) => ({ x: (c.cx - c.d / 2) / W, y: (c.cy - c.d / 2) / H, w: c.d / W, h: c.d / H });
const before = box(L.blended), after = box(L.hero);
const pct = (v) => (v >= 0 ? "+" : "−") + Math.abs(Math.round(v * 1000) / 10) + "%";
const nudged = Math.round((L.nudge / H) * 100), reduced = Math.round((1 - L.scale) * 100);
const SCORE = 100 - nudged - reduced;

// The preview: the frame as the plan lays it out, where the blend put the hero dashed, and marching ants round the box
// the Needs line names.
const K = 300 / W, f = (n) => +n.toFixed(1);
const PREVIEW = `<svg class="fm-preview" viewBox="0 0 ${W * K} ${H * K}" role="img" aria-label="The frame as planned: the hero moved down and made smaller to clear the headline">`
  + `<rect width="${W * K}" height="${H * K}" fill="#c8c8c8"/>`
  + `<rect x="${f(L.headline.x * K)}" y="${f(L.headline.y * K)}" width="${f(Math.max(...L.headline.lines.map((l) => l.w)) * K)}" height="${f(L.headline.h * K)}" fill="none" stroke="#111" stroke-width="1"/>`
  + L.headline.lines.map((l, i) => `<rect x="${f(L.headline.x * K)}" y="${f((L.headline.y + i * L.headline.lh + (L.headline.lh - L.headline.fs * 0.62) / 2) * K)}" width="${f(l.w * K)}" height="${f(L.headline.fs * 0.62 * K)}" rx="1.5" fill="#111"/>`).join("")
  + `<circle cx="${f(L.blended.cx * K)}" cy="${f(L.blended.cy * K)}" r="${f((L.blended.d / 2) * K)}" fill="none" stroke="#3372f6" stroke-width="1.2" stroke-dasharray="3 3"/>`
  + `<circle cx="${f(L.hero.cx * K)}" cy="${f(L.hero.cy * K)}" r="${f((L.hero.d / 2) * K)}" fill="#3372f6"/>`
  + `<rect class="fm-ants" x="${f(after.x * W * K)}" y="${f(after.y * H * K)}" width="${f(after.w * W * K)}" height="${f(after.h * H * K)}" fill="none" stroke="#111" stroke-width="1.2" stroke-dasharray="4 3"/>`
  + `<circle cx="${f(L.logo.cx * K)}" cy="${f(L.logo.cy * K)}" r="${f((L.logo.d / 2) * K)}" fill="#fff"/>`
  + `<rect x="${f(L.legal.x * K)}" y="${f(L.legal.y * K)}" width="${f(L.legal.w * K)}" height="2" fill="#777"/>`
  + `</svg>`;

const CARD = {
  name: "Inferno 1200×1000",
  score: SCORE,
  meta: "ratio 1.2 · hero:right|hl:above",
  state: "updates required",
  findings: [`hero nudged ${nudged}% to clear copy — −${nudged}`, `hero reduced ${reduced}% to clear copy — −${reduced}`],
  needs: `Burger box x${pct(after.x - before.x)} y${pct(after.y - before.y)} w${pct(after.w - before.w)} h${pct(after.h - before.h)}`,
  preview: PREVIEW,
  placements: 5,
};

// The Frames tree: the concept, each master in use with its frames under it (lowest score first, as the plugin sorts
// them), and the masters no frame here is nearest to. A grey chip is a forecast; a coloured one was measured on the frame.
const GROUPS = [
  { master: "1080×1920", arrangement: "hero:centre|hl:above", frames: [
    { score: 95, cls: "ok", size: "1000×1500", locked: "Disclaimer", text: "frame verified", markScore: true },
    { score: 97, cls: "ok", size: "720×1280", text: "frame verified" },
  ] },
  { master: "1080×1350", arrangement: "hero:centre|hl:above", frames: [
    { score: 93, cls: "pred", size: "1080×1440", text: "frame Multiply ready", mark: true },
  ] },
  { master: "1080×1080", arrangement: "hero:right|hl:above", frames: [
    { score: SCORE, cls: "pred", size: "1200×1000", text: `frame updates available · ${CARD.needs}`, selected: true },
    { score: SCORE, cls: "warn", size: "300×250", text: "frame verified · nudge & scale applied" },
    { score: 96, cls: "ok", size: "1200×1200", text: "frame verified" },
  ] },
  { master: "970×250", arrangement: "hero:right|hl:beside", frames: [
    { score: 98, cls: "ok", size: "728×90", text: "frame verified" },
  ] },
];
const FRAMES = GROUPS.reduce((n, g) => n + g.frames.length, 0);

export function frameMultiplierPanel() {
  return {
    roles: Object.fromEntries(Object.keys(ROLE_ICON).map((r) => [r, roleIcon(r)])),
    cols: COLS,
    layers: LAYERS.map((l) => ({ ...l, cells: COLS.map((c) => l.cells[c.key] ?? "") })),
    concept: "Inferno",
    groups: GROUPS,
    frames: FRAMES,
    unused: "2 masters not nearest to any frame here (160×600, 1200×628)",
    summary: `Scanned Social · ${FRAMES} frames · 6 masters · 2 to multiply & update`,
    card: CARD,
  };
}
