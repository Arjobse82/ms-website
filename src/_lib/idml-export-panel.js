// What the IDML Export panel's drawings show (panels.js, src/_includes/panel/idml-export/): the Export tab's IDML tree
// and Compatibility report, the Setup tab's swatch tables and the Profile settings colour table. The glyphs, labels and
// readouts are the plugin's own (monocode.campaign-manager src/main/apps/indesignExport/ui.html: CHECK_SVG, FILE_SVG,
// SPREAD_SVG, FOLDER_SVG, CARET_SVG, LINK_SVG, QUESTION_SVG, CHIP_*_SVG; renderIdmlBlock, renderCtrlRow, renderPageRow,
// renderLinksRow, renderCompatibilityReport, renderSwatchRow, renderProfileColourRow), and its sums are the plugin's
// too: a page's size in mm and its paper badge (classifyPageSize, fmtMm), an unmapped colour's CMYK (rgbToNaiveCmyk), a
// saved swatch's dot (cmykToRgbPreview). The job is the Summer Soda print set: an A5 leaflet and a poster.

const svg = (body, attrs = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"') =>
  `<svg viewBox="0 0 24 24" ${attrs} aria-hidden="true">${body}</svg>`;

export const ICON = {
  check: svg('<polyline points="20 6 9 17 4 12"/>', 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'),
  file: svg('<path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M15 2v5h5"/>'),
  spread: '<svg class="ie-spread" viewBox="0 0 38 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 2H6a1 1 0 0 0-1 1v19a1 1 0 0 0 1 1h14z"/><path d="M20 2h9l5 5v15a1 1 0 0 1-1 1H20"/><path d="M29 2v5h5"/></svg>',
  folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  caret: svg('<polyline points="9 6 15 12 9 18"/>', 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'),
  link: svg('<path d="M9 17H7a5 5 0 1 1 0-10h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>', 'fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"'),
  question: svg('<circle cx="12" cy="12" r="9"/><path d="M9.2 9.4a2.8 2.8 0 0 1 5.4.9c0 1.9-2.8 2.3-2.8 3.6"/><line x1="12" y1="17.1" x2="12" y2="17.11"/>', 'fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"'),
  diamond: '<svg class="ie-chip-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><rect x="4.2" y="4.2" width="7.6" height="7.6" transform="rotate(45 8 8)"/></svg>',
  chipCheck: svg('<polyline points="20 6 9 17 4 12"/>', 'fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="square" stroke-linejoin="round"'),
  spreads: svg('<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/>', 'fill="none" stroke="currentColor" stroke-width="1.5"'),
  single: svg('<rect x="7" y="4" width="10" height="16" rx="1"/>', 'fill="none" stroke="currentColor" stroke-width="1.5"'),
};

// classifyPageSize and fmtMm, as the plugin has them: the export is 1:1 px→pt, so a frame's mm is its px × 25.4/72;
// an exact standard size gets its name, the right proportions at the wrong scale get ≈ and the px to resize to.
const MM_PER_PX = 25.4 / 72, PT_PER_MM = 72 / 25.4;
const STD_SIZES = [
  { name: "A6", w: 105, h: 148 }, { name: "A5", w: 148, h: 210 }, { name: "A4", w: 210, h: 297 }, { name: "A3", w: 297, h: 420 },
  { name: "A2", w: 420, h: 594 }, { name: "Letter", w: 215.9, h: 279.4 }, { name: "Legal", w: 215.9, h: 355.6 }, { name: "Tabloid", w: 279.4, h: 431.8 },
];
function classifyPageSize(wPx, hPx) {
  const mmW = wPx * MM_PER_PX, mmH = hPx * MM_PER_PX, portrait = hPx >= wPx;
  for (const s of STD_SIZES) {
    const sw = portrait ? s.w : s.h, sh = portrait ? s.h : s.w;
    if (Math.abs(mmW - sw) <= 0.5 && Math.abs(mmH - sh) <= 0.5) return { mmW, mmH, state: "exact", name: s.name };
  }
  const ratio = Math.max(mmW, mmH) / Math.min(mmW, mmH);
  let best = null, bestDist = Infinity;
  for (const s of STD_SIZES) {
    if (Math.abs(ratio - s.h / s.w) > 0.02) continue;
    const tw = portrait ? s.w : s.h, th = portrait ? s.h : s.w;
    const dist = Math.max(Math.abs(mmW - tw), Math.abs(mmH - th));
    if (dist < bestDist) { bestDist = dist; best = s; }
  }
  if (!best) return { mmW, mmH, state: "none" };
  const px = (v) => Math.round(v * PT_PER_MM);
  return { mmW, mmH, state: "ratio", name: best.name, targetPx: `${px(portrait ? best.w : best.h)}×${px(portrait ? best.h : best.w)}` };
}
const fmtMm = (v) => (Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : v.toFixed(1));

// rgbToNaiveCmyk (K from the brightest channel, no ICC profile) and cmykToRgbPreview, the plugin's two conversions.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
function rgbToNaiveCmyk(h) {
  const [r, g, b] = hex(h), k = 1 - Math.max(r, g, b), p = (n) => Math.round(n * 100);
  return k >= 1 ? [0, 0, 0, 100] : [p((1 - r - k) / (1 - k)), p((1 - g - k) / (1 - k)), p((1 - b - k) / (1 - k)), p(k)];
}
const cmykToRgb = ([c, m, y, k]) => `rgb(${[c, m, y].map((v) => Math.round(255 * (1 - v / 100) * (1 - k / 100))).join(",")})`;

// The Summer Soda colours: two brand swatches saved in the client's profile, a Figma style ("Sun") mapped onto one of
// them, InDesign's own [Paper] and [Black], a named promo colour not mapped yet, and loose fills with no name at all.
// Soda Teal was confirmed from its Figma colour as the plugin proposed it, so its CMYK is that colour's own conversion.
const ORANGE = { name: "Soda Orange", rgb: "#FFB400", values: [0, 30, 100, 0], model: "Spot" };
const TEAL = { name: "Soda Teal", rgb: "#2EC5CE", values: rgbToNaiveCmyk("#2EC5CE"), model: "Process" };
const RED = { figma: "Promo/Red", rgb: "#E4572E" };

// The Setup tab's tables, a row each: its status glyph (tick: named after itself; link: mapped onto another swatch;
// ?: named in Figma, not mapped), its dot, the name (or the hex as placeholder), C M Y K and the model. Only a row that
// can be mapped onto another swatch has the name dropdown.
const row = (status, dot, name, values, model, opts = {}) => ({ status, dot, name, values, model, ...opts });
export const KNOWN = [
  row("tick", "#FFFFFF", "", [0, 0, 0, 0], "[Paper]", { placeholder: "#FFFFFF" }),
  row("tick", "#000000", "", [0, 0, 0, 100], "[Black]", { placeholder: "#000000" }),
  row("tick", ORANGE.rgb, ORANGE.name, ORANGE.values, ORANGE.model),
  row("tick", TEAL.rgb, TEAL.name, TEAL.values, TEAL.model),
  row("link", cmykToRgb(ORANGE.values), ORANGE.name, ORANGE.values, ORANGE.model, { combo: true, title: "Click to clear this mapping" }),
];
export const UNKNOWN = [
  row("unknown", RED.rgb, RED.figma, rgbToNaiveCmyk(RED.rgb), "Process", { combo: true, title: "Add to 'Summer Soda' profile" }),
];
export const HIDDEN_SUMMARY = "6 hidden colours, auto-converted from RGB.";

// Profile settings' table: the profile's colours, this job's and the client's others, a row a swatch.
export const PROFILE = {
  name: "Summer Soda",
  colours: [ORANGE, TEAL, { name: "Soda Lime", values: [35, 0, 85, 10], model: "Process" }, { name: "Soda Cream", values: [0, 4, 18, 0], model: "Process" }]
    .map((c) => ({ ...c, dot: cmykToRgb(c.values) })),
};

// The IDML tree, Group frames by size on: the leaflet's four A5 pages (the cover alone, the inside pair touching as a
// spread, the back alone) in one file, the poster in another. Dots are the file's known swatches; ? is the one named
// colour in it not mapped yet. Links: the image layers, matched by name against the connected Packshots folder.
const LINKS_FOLDER = "Packshots";
const block = (w, h, b) => {
  const s = classifyPageSize(w, h);
  return {
    w, h, ...b,
    mm: `${fmtMm(s.mmW)} × ${fmtMm(s.mmH)} mm`,
    badge: s.state === "exact" ? { cls: "is-exact", text: s.name }
      : s.state === "ratio" ? { cls: "is-approx", text: `≈ ${s.name}`, title: `${s.name} proportions, but not that size — resize the frame to ${s.targetPx} px for an exact ${s.name}` }
      : null,
  };
};
const links = (images) => {
  const found = images.filter((i) => i.file).length;
  return { label: `${LINKS_FOLDER}/Links (${images.length}/`, found: `${found} found`, images };
};
export const BLOCKS = [
  block(420, 595, {
    dots: [ORANGE.rgb, TEAL.rgb, "#000000", "#FFFFFF"],
    unknown: "1 unknown swatch needs mapping",
    chips: [{ label: "FLEX", on: true }, { label: "LINK", icon: true, on: false }],
    pages: [
      { label: "P1", names: "Cover" },
      { label: "P2-P3", names: "Flavours / Offer", spread: true },
      { label: "P4", names: "Back" },
    ],
    links: { ...links([{ name: "Can orange", file: "psd" }, { name: "Can teal", file: "psd" }, { name: "Beach" }]), open: true },
  }),
  block(1000, 1414, {
    dots: [ORANGE.rgb, TEAL.rgb, "#FFFFFF"],
    chips: [],
    pages: [{ label: "P1", names: "Poster" }],
    links: links([{ name: "Can orange", file: "psd" }]),
  }),
];

// The Compatibility report after that Scan, open: renderCompatibilityReport's rows for it, each count read off the
// export's dry run (5 pages in 4 spreads: the leaflet's three and the poster), the messages the plugin's own.
export const COMPAT = [
  { head: "Full Compatibility", kind: "ok", rows: [
    ["Pages & Spreads", "5 pages across 4 spreads"],
    ["Auto Layout", "2 frames compatible"],
    ["Text", "21 text elements placed natively"],
    ["Colour", "5 colours mapped"],
    ["Colour", "1 colour auto-converted from RGB"],
    ["Images", "4 images will export"],
    ["Masks", "No masks in this export"],
    ["Effects", "2 effects will export"],
  ] },
  { head: "Partial Compatibility", kind: "note", rows: [
    ["Colour", "1 colour used a gradient approximated as radial (angular/diamond not supported)"],
  ] },
  { head: "Unsupported Features", kind: "warn", rows: [
    ["Frames & Layout", "1 shape exported with square corners (per-corner radii not supported)"],
  ] },
];

export const EXPORT_LABEL = `Export ${BLOCKS.length} × IDML`;

export function idmlExportPanel() {
  return { icon: ICON, blocks: BLOCKS, compat: COMPAT, exportLabel: EXPORT_LABEL, known: KNOWN, unknown: UNKNOWN, hiddenSummary: HIDDEN_SUMMARY,
    profile: PROFILE, scanned: "Scanned: Whole page · Print", outputFolder: "/Users/studio/Jobs/Summer Soda" };
}
