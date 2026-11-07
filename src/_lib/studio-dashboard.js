// What the Studio Tools dashboard drawing shows (dashboards.js, partials/dashboard.njk): Bloom's Measure dashboard,
// the screen the plugin opens on, as the plugin draws it in its light, monochrome look. The widgets, their order, their
// art and their names are the plugin's own (monocode.campaign-manager bloom/src/ui/overviewHero.js _OV_WIDGETS;
// widgetTiles.js _widget, _widgetName, _brandTiles and the tiles' art functions; bloom/src/ui-shell.html for the look).
// The page is the Summer Soda campaign Bloom's live job draws: its ten formats for six creatives. Each widget's `text`
// says what it does when you open it, from its panel in the plugin.
// Kept out of src/_data, as a data file's named exports change what Eleventy reads from it.

const f = (n) => +n.toFixed(2);

// A seeded random, so the Grid glyph's cells are the same on every build (the plugin picks its own once a session).
function random(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A status dot on a tile's art: green up to date, orange something new (_widgetDotSvg; the plugin's tooltip in <title>).
const DOT = { green: "var(--w-fixed-ok)", orange: "var(--warn)" };
const dot = (state, cx, cy, r) => `<circle fill="${DOT[state]}" cx="${cx}" cy="${cy}" r="${r}"/>`;

const svg = (viewBox, body) => `<svg viewBox="${viewBox}" aria-hidden="true">${body}</svg>`;

// Sync Folders: a folder with the chain link on its front, its dot (_syncFoldersSvg).
const syncFolders = (state) => svg("449.27 151.12 464.15 464.15",
  '<rect fill="var(--w-fixed-bg-2)" x="449.27" y="151.12" width="464.15" height="464.15" rx="74.35" ry="74.35"/>'
  + '<path fill="var(--w-fixed-light)" stroke="currentColor" stroke-width="7.5" d="M864.19,492.56c0,16.52-13.52,30.04-30.04,30.04h-306.99c-16.52,0-30.04-13.52-30.04-30.04v-215.88c0-16.52,13.52-30.04,30.04-30.04h102.8c16.52,0,39.42,9.73,50.89,21.62l8.66,8.98c11.47,11.89,34.37,21.62,50.89,21.62h93.74c16.52,0,30.04,13.52,30.04,30.04v163.66Z"/>'
  + '<circle fill="var(--w-sf-circle)" cx="671.04" cy="406.71" r="78.66"/>'
  + '<path fill="var(--w-sf-chain)" d="M655.18,444.28l12.87-12.26c4.45.07,8.64.02,13.72-.27l-17.14,17.47c-11.09,11.28-28.49,12.15-39.7,1.19-11.28-11.02-10.6-28.85.77-40.09l18.07-17.86c7.02-6.94,16.89-9.54,26.73-6.84,7.27,1.99,14.04,7.47,17.47,15.1-2.84,3.53-6.31,6.04-7.78,7.7-1.44-5.79-4.99-10.18-9.79-12.32-6.8-3.04-14.52-1.86-19.65,3.26l-19.19,19.19c-6.64,6.64-6.58,17.34-.51,24.01,5.92,6.49,16.95,8.58,24.11,1.7Z"/>'
  + '<path fill="var(--w-sf-chain)" d="M688.85,410.82l18.7-18.51c7.02-6.95,7.73-17.65,1.2-24.9-6.49-7.21-18.01-7.82-25.28-.69l-12.2,11.91-13.47-.07,17.4-17.76c11.06-11.26,28.51-12.11,39.68-1.2,11.32,11.05,10.66,28.85-.75,40.11l-18.55,18.28c-6.98,6.88-17.14,9.07-26.89,6.21-7.78-2.29-14.72-8.59-17.67-17.04,2.32-2.31,6.55-4.82,8.49-6.17,1.33,6.15,4.94,10.72,9.91,12.93,6.55,2.92,14.18,2.09,19.42-3.09Z"/>'
  + dot(state, "538.67", "287.64", 16.25));

// Export images: a folded page with an arrow up out of it, its dot (_exportWidgetSvg).
const exportImages = (state) => svg("385.03 86.87 592.64 592.64",
  '<rect fill="var(--w-fixed-bg-2)" x="385.03" y="86.87" width="592.64" height="592.64" rx="94.94" ry="94.94"/>'
  + '<path fill="var(--w-fixed-light)" stroke="currentColor" stroke-width="9.22" d="M737.87,186.81l4.5,2.83,100.42,101.93c1.38,1.4,2.59,3.42,2.59,5.53l-.1,263.86c0,9.94-8.33,16.18-16.74,18.33h-292.73c-7.53-2.22-16.12-7.74-16.12-16.94l.02-358.53c0-9.29,9.07-15.19,16.75-17h201.42Z"/>'
  + '<path fill="var(--w-fixed-light)" stroke="currentColor" stroke-width="9.22" d="M844.07,294.63l-91.21.17c-6.58-.69-11.13-4.76-12.42-10.94l.11-94.45-2.68-2.6h-201.42c-7.68,1.81-16.75,7.7-16.75,17l-.02,358.53c0,9.21,8.58,14.72,16.12,16.94h292.73c8.41-2.15,16.74-8.39,16.74-18.33l.1-263.86-1.31-2.46Z"/>'
  + '<path fill="currentColor" d="M687.48,340.01l-.26,174.97-19.37-.12-.14-175.11-53.99,56.61-14.23-12.24,70.79-74.7c4.58-4.83,11.43-3.47,15.59.92l69.98,73.79-14.25,12.25-54.13-56.37Z"/>'
  + dot(state, "581.8", "253.7", 20.75));

// Sync Brief: a spreadsheet with the chain link over it, its dot (_briefLinkSvg).
const syncBrief = (state) => svg("360.87 62.72 640.95 640.95",
  '<rect fill="var(--w-fixed-bg-2)" x="360.87" y="62.72" width="640.95" height="640.95" rx="102.68" ry="102.68"/>'
  + '<rect fill="var(--w-fixed-light)" stroke="currentColor" stroke-width="7.53" x="424.68" y="188.27" width="508.14" height="379.09"/>'
  + '<g stroke="currentColor" stroke-width="2.59"><line x1="424.68" y1="441" x2="932.82" y2="441"/><line x1="424.68" y1="314.64" x2="932.82" y2="314.64"/><line x1="805.79" y1="188.27" x2="805.79" y2="567.36"/><line x1="678.75" y1="188.27" x2="678.75" y2="567.36"/><line x1="551.72" y1="188.27" x2="551.72" y2="567.36"/></g>'
  + '<g transform="translate(-0.55,-32.87)">'
  + '<circle fill="currentColor" cx="679.3" cy="410.68" r="108.62"/>'
  + '<path fill="var(--w-fixed-light)" d="M657.4,462.56l17.77-16.92c6.14.1,11.93.02,18.94-.37l-23.67,24.12c-15.32,15.57-39.34,16.77-54.82,1.65-15.58-15.22-14.63-39.84,1.07-55.36l24.95-24.66c9.7-9.59,23.32-13.17,36.91-9.45,10.03,2.75,19.38,10.31,24.13,20.85-3.92,4.88-8.71,8.33-10.74,10.64-1.98-7.99-6.89-14.05-13.52-17.01-9.39-4.19-20.05-2.57-27.13,4.51l-26.49,26.5c-9.17,9.17-9.09,23.95-.7,33.15,8.17,8.97,23.41,11.85,33.29,2.35Z"/>'
  + '<path fill="var(--w-fixed-light)" d="M703.9,416.36l25.83-25.56c9.7-9.6,10.68-24.37,1.66-34.38-8.96-9.95-24.87-10.79-34.91-.95l-16.84,16.45-18.6-.1,24.03-24.53c15.27-15.55,39.37-16.73,54.8-1.65,15.63,15.26,14.72,39.85-1.04,55.38l-25.61,25.24c-9.64,9.5-23.66,12.53-37.13,8.57-10.74-3.16-20.33-11.86-24.41-23.53,3.2-3.19,9.05-6.65,11.72-8.52,1.84,8.49,6.82,14.8,13.68,17.86,9.04,4.03,19.57,2.89,26.81-4.27Z"/>'
  + '</g>'
  + dot(state, "488.89", "255.61", 22.45));

// Component Manager: four diamonds, a set's variants (_componentIngestSvg).
const componentManager = () => svg("723.27 302.75 474.03 474.03",
  '<rect fill="var(--w-fixed-light)" x="723.27" y="302.75" width="474.03" height="474.03" rx="54.34" ry="54.34"/>'
  + '<g fill="var(--w-fixed-light)" stroke="currentColor" stroke-width="8">'
  + '<rect x="915.44" y="418.49" width="89.69" height="89.69" transform="translate(-46.37 814.73) rotate(-45)"/>'
  + '<rect x="915.44" y="571.35" width="89.69" height="89.69" transform="translate(-154.46 859.51) rotate(-45)"/>'
  + '<rect x="991.87" y="494.92" width="89.69" height="89.69" transform="translate(-78.03 891.16) rotate(-45)"/>'
  + '<rect x="839.01" y="494.92" width="89.69" height="89.69" transform="translate(-122.8 783.07) rotate(-45)"/>'
  + '</g>');

// InDesign Export: the Id mark in a frame with its corner marks (_indesignExportSvg).
const indesignExport = () => svg("371.17 70.92 623.65 626.16",
  '<rect fill="var(--w-fixed-light)" x="470.25" y="170.59" width="426.01" height="426.01"/>'
  + '<path fill="currentColor" d="M894.99,171.86v423.46h-423.46V171.86h423.46M897.54,169.31h-428.56v428.56h428.56V169.31h0Z"/>'
  + '<path fill="currentColor" d="M537.39,516.8V249.29h54.01v267.51h-54.01Z"/>'
  + '<path fill="currentColor" d="M827.69,516.8h-47.63v-28.47c-7.91,11.07-17.24,19.31-28.01,24.73-10.77,5.41-21.62,8.12-32.57,8.12-22.26,0-41.33-8.97-57.21-26.91-15.88-17.94-23.81-42.97-23.81-75.09s7.72-57.81,23.17-74.91c15.45-17.09,34.97-25.64,58.57-25.64,21.65,0,40.39,9,56.2,27.01v-96.35h51.28v267.51ZM690.84,415.71c0,20.68,2.86,35.64,8.58,44.89,8.27,13.38,19.83,20.07,34.67,20.07,11.8,0,21.83-5.02,30.11-15.05,8.27-10.04,12.41-25.03,12.41-44.98,0-22.26-4.01-38.29-12.04-48.08-8.03-9.79-18.31-14.69-30.84-14.69s-22.35,4.84-30.56,14.51-12.32,24.12-12.32,43.34Z"/>'
  + '<g fill="currentColor"><rect x="449.13" y="149.19" width="42.35" height="42.35"/><rect x="874.52" y="149.19" width="42.35" height="42.35"/><rect x="449.13" y="576.46" width="42.35" height="42.35"/><rect x="874.52" y="576.46" width="42.35" height="42.35"/></g>');

// Frame Multiplier: its emblem, eight bars from one square (_rolloutSvg).
const frameMultiplier = () => svg("0 0 474 474",
  '<rect fill="var(--w-fixed-light)" x="0" y="0" width="474" height="474" rx="54" ry="54"/>'
  + '<svg x="88.5" y="88.5" width="297" height="297" viewBox="0 0 228.49 224.86" overflow="visible">'
  + '<g fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10">'
  + '<rect x="48.05" y="21.41" width="40.29" height="89.95" transform="translate(-26.96 67.67) rotate(-45)"/>'
  + '<rect x="140.15" y="113.5" width="40.29" height="89.95" transform="translate(-65.11 159.76) rotate(-45)"/>'
  + '<rect x="23.22" y="138.33" width="89.95" height="40.29" transform="translate(-92.09 94.64) rotate(-45)"/>'
  + '<rect x="115.32" y="46.24" width="89.95" height="40.29" transform="translate(.01 132.79) rotate(-45)"/>'
  + '<rect x="94.1" y="2.33" width="40.29" height="89.95"/><rect x="94.1" y="132.58" width="40.29" height="89.95"/>'
  + '<rect x="4.15" y="92.28" width="89.95" height="40.29"/><rect x="134.39" y="92.28" width="89.95" height="40.29"/>'
  + '</g></svg>');

// Bloom: the blend rosette, wide to tall, with the B over it, greys in the monochrome look, and a T that goes round it
// (_bloomMarkSvg).
function bloomMark() {
  const cx = 50, cy = 50, N = 10;
  let rings = "";
  for (let k = 0; k < N; k++) {
    const t = k / (N - 1);
    const w = 86 + (30 - 86) * t, h = 30 + (86 - 30) * t, s = 2 + (0.1 - 2) * t;
    const g = Math.round(255 * (1 - (0.1 + 0.55 * t)));
    rings += `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx="2" stroke-width="${s.toFixed(3)}" stroke="rgb(${g},${g},${g})"/>`;
  }
  const xs = 4.4 * 0.65, ox = cx, oy = cy - 35;
  const a = 'stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"';
  const tee = `<line x1="${f(ox - xs)}" y1="${f(oy - xs)}" x2="${f(ox + xs)}" y2="${f(oy - xs)}" ${a}/><line x1="${ox}" y1="${f(oy - xs)}" x2="${ox}" y2="${f(oy + xs)}" ${a}/>`;
  return svg("0 0 100 100",
    `<g fill="none" transform="translate(5 5) scale(0.9)">${rings}</g>`
    + '<text x="50" y="51" text-anchor="middle" dominant-baseline="central" font-family="Inter, -apple-system, sans-serif" font-weight="800" font-size="59" fill="currentColor">B</text>'
    + `<g class="w-brand-orbit"><g class="w-brand-orb-i" style="transform-origin: ${ox}px ${oy}px">${tee}</g></g>`);
}

// Grid: a 5×8 grid of cells, its top row filled and each column a random depth below it, and a second fill, by rows from
// the left, laid over it in translucent grey (_gridGlyphSvg, _makeGridFill, _makeGridFillFromLeft).
function gridGlyph() {
  const rnd = random(20261028);
  const m = 14, w = 100 - 2 * m, h = 100 - 2 * m, cols = 5, rows = 8, cw = w / cols, ch = h / rows, gap = 1.6;
  const cell = (col, row, fill) => `<rect x="${f(m + col * cw + gap / 2)}" y="${f(m + row * ch + gap / 2)}" width="${f(cw - gap)}" height="${f(ch - gap)}" ${fill}/>`;
  let fills = "", over = "";
  for (let col = 0; col < cols; col++) {
    const depth = 1 + Math.floor(rnd() * rows);
    for (let row = 0; row < depth; row++) fills += cell(col, row, 'fill="currentColor"');
  }
  for (let row = 0; row < rows; row++) {
    const depth = 1 + Math.floor(rnd() * cols);
    for (let col = 0; col < depth; col++) over += cell(col, row, 'fill="#c0c0c0" fill-opacity="0.5"');
  }
  return svg("0 0 100 100", fills + over);
}

// Measure: a zig-zag line with hollow ends, behind the widget's title and pills (_measureGraphSvg, monochrome).
function measureGraph() {
  const pts = [[6, 88], [44, 24], [78, 72], [120, 46], [194, 84]];
  const ends = [pts[0], pts[pts.length - 1]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="var(--w-surface)" stroke="currentColor" stroke-width="1.2"/>`).join("");
  return svg("0 0 200 100", `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round"/>${ends}`);
}

// Measure, opened: the logo's width as a percentage of each frame's width across the Summer Soda campaign, against the
// brand's spec (Logo 4 %, the plugin's bloom-config.json clearSpaceDefaults). A drawing for the product page: the
// frames are the live job's ten formats (jobs.js); which miss the spec, and by how much, is made up.
const SPEC = 4, TOLERANCE = 0.4;
const LOGO_FRAMES = [
  ["Skyscraper", "160×600", 4.0], ["Half page", "300×600", 4.1], ["MPU", "300×250", 3.9], ["Leaderboard", "728×90", 4.0],
  ["Mobile banner", "320×100", 4.2], ["Billboard", "970×250", 2.9], ["Large rectangle", "336×280", 4.0],
  ["Square", "1080×1080", 4.1], ["Story", "1080×1920", 5.6], ["Portrait", "1080×1350", 4.0],
];
const isOff = (v) => Math.abs(v - SPEC) > TOLERANCE;

function measureChart() {
  const L = 30, R = 372, T = 10, B = 128, LO = 2, HI = 6, n = LOGO_FRAMES.length;
  const y = (v) => f(B - ((v - LO) / (HI - LO)) * (B - T));
  const x = (i) => f(L + ((i + 0.5) * (R - L)) / n);
  const mono = 'font-family="ui-monospace,Menlo,monospace" fill="#888"';
  const grid = [2, 3, 4, 5, 6].map((v) => `<line x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}" stroke="#ececec" stroke-width="1"/><text x="${L - 5}" y="${y(v) + 2.5}" text-anchor="end" font-size="7.5" ${mono}>${v}%</text>`).join("");
  const band = `<rect x="${L}" y="${y(SPEC + TOLERANCE)}" width="${R - L}" height="${f(y(SPEC - TOLERANCE) - y(SPEC + TOLERANCE))}" fill="#f1f1f1"/><line x1="${L}" y1="${y(SPEC)}" x2="${R}" y2="${y(SPEC)}" stroke="#999" stroke-width="1" stroke-dasharray="3 3"/><text x="${L + 4}" y="${y(SPEC + TOLERANCE) - 4}" text-anchor="start" font-size="7.5" ${mono}>spec ${SPEC}%</text>`;
  const line = `<polyline points="${LOGO_FRAMES.map((fr, i) => `${x(i)},${y(fr[2])}`).join(" ")}" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round"/>`;
  const dots = LOGO_FRAMES.map((fr, i) => isOff(fr[2])
    ? `<circle cx="${x(i)}" cy="${y(fr[2])}" r="4.2" fill="var(--warn)" stroke="var(--w-surface)" stroke-width="1.2"/>`
    : `<circle cx="${x(i)}" cy="${y(fr[2])}" r="3.3" fill="var(--w-surface)" stroke="currentColor" stroke-width="1.2"/>`).join("");
  const labels = LOGO_FRAMES.map((fr, i) => `<text transform="translate(${x(i) + 2},${B + 9}) rotate(-38)" text-anchor="end" font-size="6.5" ${mono}>${fr[1]}</text>`).join("");
  return svg("0 0 380 160", grid + band + line + dots + labels);
}

const measureExample = () => ({
  element: "Logo",
  spec: SPEC,
  tolerance: TOLERANCE,
  frames: LOGO_FRAMES.length,
  on: LOGO_FRAMES.filter((fr) => !isOff(fr[2])).length,
  svg: measureChart(),
  flagged: LOGO_FRAMES.filter((fr) => isOff(fr[2])).map(([name, size, v]) => ({
    name, size, value: v.toFixed(1), note: v < SPEC ? `${(SPEC - v).toFixed(1)} under spec: too small` : `${(v - SPEC).toFixed(1)} over spec: too big`,
  })),
});

// The app bar's icons: Scan, the theme switch and the cog (bloom/src/ui/index.js _REFRESH_SVG, _MOON_SVG, _COG_SVG).
const ICONS = {
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"></path><path d="M21 3v6h-6"></path></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
};

// The page: six creatives, each in the live job's seven display formats and three social ones.
const CREATIVES = ["Original", "Zero Sugar", "Cherry", "Lime", "Mango", "Peach"];
const CHANNELS = [{ key: "DISPLAY", n: 7 * CREATIVES.length }, { key: "SOCIAL", n: 3 * CREATIVES.length }];
// What the Measure widget measures: the two layout elements (a diamond) and the others picked to track.
const MEASURED = [{ label: "Logo", layout: true }, { label: "Baseplate", layout: true }, { label: "Headline" }, { label: "Packshot" }];

// The widgets in the plugin's order: Creatives and Measure, the channel tiles after them, the ported widgets and the
// three apps' tiles, then the Bloom and Grid tiles last. `app` is the included app a tile opens (catalog slug); `bridge`
// marks the three that work through Monochrome Bridge.
const WIDGETS = [
  { key: "creatives", name: "Creatives", kind: "creatives", span: 5,
    text: "Every creative on the page, named and counted. Open it to set each creative’s layout: whether its logo and baseplate are checked against the brand spec, placed freely, or left out." },
  { key: "template", name: "Measure", kind: "measure", span: 5,
    text: "The elements measured in every frame: the logo and baseplate, marked with a diamond, and any others you pick. Open it for the consistency charts, each element’s size across every format, with the frames that stray flagged." },
  ...CHANNELS.map((c, i) => ({ key: c.key, name: c.key[0] + c.key.slice(1).toLowerCase(), kind: "channel", n: c.n, accent: i === 0 })),
  { key: "syncFolders", name: "Sync Folders", kind: "art", art: syncFolders("green"), bridge: true, status: "Up to date",
    text: "Links folders on your Mac to the page. Each image is matched by name to the master component it belongs in, and a new version comes in with one click. It also holds the Draft and Final folders exports go to." },
  { key: "export", name: "Export images", kind: "art", art: exportImages("green"), bridge: true, status: "Up to date",
    text: "Exports the page’s frames as JPEG, PNG or layered PNG into the Draft or Final folder, or as a PDF contact sheet you can page through before it’s made." },
  { key: "brieflink", name: "Sync Brief", kind: "art", art: syncBrief("orange"), bridge: true, status: "New brief available",
    text: "Links the page to an Excel brief, each column bound to a layer. When the brief changes, each change is listed to apply one by one or all at once, and frames the brief has that the page lacks can be generated." },
  { key: "componentIngest", name: "Component Manager", kind: "art", art: componentManager(),
    text: "Drop in folders of PNG, PSD or SVG files and each one becomes a variant in its component set, trimmed and laid out five across. Files already there are skipped." },
  { key: "indesignExport", name: "InDesign Export", kind: "art", art: indesignExport(), app: "idml-export" },
  { key: "rollout", name: "Frame Multiplier", kind: "art", art: frameMultiplier(), app: "frame-multiplier" },
  { key: "brandmark", name: "Bloom", kind: "brand", art: bloomMark(), app: "bloom", brand: "dark" },
  { key: "gridglyph", name: "Grid", kind: "brand", art: gridGlyph(), brand: "light",
    text: "Lays the page’s frames out by aspect ratio. Matrix groups like ratios into columns, landscape to portrait, largest first; Ladder gives each creative a column with its formats lined up in rows, to compare. Revert puts them back." },
];

// One line on each of the ten apps, for the Apps row (the three included apps keep their catalogue taglines).
const SHORT = {
  creatives: "Every creative on the page, named and counted; set each one's layout.",
  template: "Logo and baseplate measured in every frame, with the strays flagged.",
  gridglyph: "Lays the page's frames out by aspect ratio.",
  syncFolders: "Links folders on your Mac to the page's master components.",
  export: "Exports frames as JPEG, PNG or a PDF contact sheet.",
  brieflink: "Keeps the page in step with an Excel brief.",
  componentIngest: "Drops folders of images into component sets.",
  indesignExport: "Send your files to InDesign with maximum compatibility.",
  rollout: "Automate your advertising.",
  brandmark: "Quality control check for your Figma designs.",
};
// The ten, in the order the Apps row shows them.
const TEN = ["creatives", "template", "gridglyph", "syncFolders", "export", "brieflink", "componentIngest", "indesignExport", "rollout", "brandmark"];

// The channel tiles, explained as one entry in the list.
const CHANNELS_TEXT = "A tile for each channel on the page, OOH, social, display, website or EDM, with its number of frames. Open one for a table of its frames, each one’s logo and baseplate checked against the spec.";

// The list under the hero, in this order: Bloom's own widgets, then the studio's. The included apps' tiles have their cards.
const LIST = ["creatives", "template", "channels", "gridglyph", "syncFolders", "export", "brieflink", "componentIngest"];

// The diamond on a layout element's pill (measureEntry.js _MP_DIAMOND).
const DIAMOND = '<svg viewBox="0 0 8 8" aria-hidden="true"><path d="M4 0.5L7.5 4L4 7.5L0.5 4Z" fill="currentColor"/></svg>';

// A widget's classes, as _widget gives them: its kind's, a tile's square, a channel's variant and its digits.
function classes(w) {
  if (w.kind === "creatives") return "widget w-creatives";
  if (w.kind === "measure") return "widget w-template";
  if (w.brand) return `widget w-brand-cell w-brand-${w.brand}`;
  if (w.kind === "channel") {
    const digits = String(w.n).length;
    return `widget widget--tile w-tile-ch${w.accent ? " widget--accent" : ""}${digits >= 3 ? " nd-3" : digits === 2 ? " nd-2" : ""}`;
  }
  return "widget widget--tile w-art";
}

export function studioDashboard() {
  // Each tile links to what it is on this page: an included app's card, or the widget's entry in the list.
  const widgets = WIDGETS.map((w) => {
    const id = w.kind === "channel" ? "channels" : w.key;
    return { ...w, id, short: SHORT[id], cls: classes(w), href: w.app ? `#app-${w.app}` : `#widget-${id}` };
  });
  const entry = (id) => {
    const w = widgets.find((x) => x.id === id);
    return w.kind === "channel" ? { ...w, name: "Channels", text: CHANNELS_TEXT } : w;
  };
  return {
    title: "Studio Tools",
    brand: "Summer Soda",
    tabs: ["Dashboard", "Setup"],
    icons: ICONS,
    diamond: DIAMOND,
    creatives: CREATIVES,
    measured: MEASURED,
    graph: measureGraph(),
    measure: measureExample(),
    widgets,
    frames: CHANNELS.reduce((n, c) => n + c.n, 0),
    intro: "Studio Tools opens on Bloom’s Measure dashboard, which reads the page’s frames: the campaign’s creatives, its channels and how each frame measures up. A click opens a widget in place, and the widgets drag into any order you like.",
    list: LIST.map(entry),
    ten: TEN.map((id) => widgets.find((x) => x.id === id)),
    bridge: "Sync Folders, Export images and Sync Brief reach your folders through Monochrome Bridge, a small app on your Mac. The dot on each one’s tile is its state: green, up to date; orange, something new; red, a folder or file has gone missing.",
  };
}

// The Setup tab's logo table, as Studio Tools' panel guide draws it (panels.js "studio-tools",
// src/_includes/panel/studio-tools/): its Channels section (bloom/src/ui/channelPanel.js _renderChannelPanel,
// _chLogoSectionHtml, _chRuleRowHtml, _chSpecCellsHtml, _chCustomSectionHtml), the logo parts only: the defaults, a row
// for each channel, a channel's sizes and the one-offs; each channel's label rows and its Generic sizes are left out.
// The defaults are the plugin's (bloom-config.json clearSpaceDefaults: logo 4%, clear space 25% beside and 14.5% below,
// measured from the logo's width and height), the channels its own (defaultChannelGroups); their values, Display's
// sizes and the one-off are this brand's.
const LOCK_OPEN = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V4a3 3 0 016 0"/></svg>';

export function studioSetup() {
  return {
    frames: CHANNELS.reduce((n, c) => n + c.n, 0),
    lock: LOCK_OPEN,
    // All channels: Logo, Pad ↔, Pad ↕, Align, and what the two pads are measured from.
    defaults: { logo: "4", side: "25", below: "14.5", align: "–", sideBasis: "LW", belowBasis: "LH" },
    // Each channel's own values over the defaults; one left blank inherits (grey). A channel's sizes, each a label and
    // a size with its spec: logo % · pad % · baseplate px · custom location.
    channels: [
      { name: "OOH", logo: "3" },
      { name: "SOCIAL", logo: "6", side: "20" },
      { name: "DISPLAY", logo: "5", sized: [
        { label: "MPU", size: "300x250", logo: "6.5", pad: "30", base: "22", loc: false },
        { label: "LEADERBOARD", size: "728x90", logo: "3.5", pad: "20", base: "", loc: false },
        { label: "SKYSCRAPER", size: "160x600", logo: "", pad: "", base: "40", loc: true },
      ] },
      { name: "WEBSITE" },
      { name: "EDM", align: "SE" },
    ],
    custom: [{ label: "TAKEOVER", size: "1920x1080", logo: true, halo: false }],
  };
}
