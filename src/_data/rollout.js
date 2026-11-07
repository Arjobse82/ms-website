// The rollout drawn on Ad Agent's page, as the app's node view shows one: a brief, its creatives, their channels, the
// sizes and the files each size is made as. Channels and file types are Ad Agent's own (src/core/outputs.ts). The
// chosen path is drawn in the house blue, as the app marks a selected node.

const COL_W = 168;
const COL_GAP = 40;
const ROW_GAP = 12;
const TOP = 34; // room for the column titles

const columns = [
  { title: "Brief", nodes: [{ id: "brief", label: "Spring campaign", sub: "brief.xlsx", tall: true }] },
  {
    title: "Creatives",
    nodes: [
      { id: "hero", label: "HERO", sub: "2 masters", tall: true },
      { id: "offer", label: "OFFER", sub: "1 master", tall: true },
    ],
  },
  { title: "Channels", nodes: [{ id: "ooh", label: "OOH" }, { id: "dooh", label: "DOOH" }, { id: "social", label: "Social" }] },
  {
    title: "Sizes",
    nodes: [
      { id: "s1", label: "1200 × 1800 mm", ratio: [2, 3] },
      { id: "s2", label: "6096 × 3048 mm", ratio: [2, 1] },
      { id: "s3", label: "1080 × 1920", ratio: [9, 16] },
      { id: "s4", label: "1080 × 1080", ratio: [1, 1] },
      { id: "s5", label: "1080 × 1350", ratio: [4, 5] },
    ],
  },
  {
    title: "Files",
    nodes: [
      { id: "pdf", label: "PDF-DESPATCH", mono: true },
      { id: "lores", label: "PDF-LORES", mono: true },
      { id: "jpg", label: "JPG", mono: true },
      { id: "png", label: "PNG", mono: true },
    ],
  },
];

const links = [
  ["brief", "hero"], ["brief", "offer"],
  ["hero", "ooh"], ["hero", "dooh"], ["hero", "social"], ["offer", "social"],
  ["ooh", "s1"], ["ooh", "s2"], ["dooh", "s3"], ["social", "s4"], ["social", "s5"],
  ["s1", "pdf"], ["s1", "lores"], ["s2", "pdf"], ["s2", "lores"], ["s3", "jpg"], ["s4", "jpg"], ["s4", "png"], ["s5", "jpg"],
];

const chosen = ["brief", "hero", "social", "s4", "png"];

export default function () {
  const heightOf = (n) => (n.tall ? 40 : 32);
  const columnHeight = (c) => c.nodes.reduce((sum, n) => sum + heightOf(n), 0) + ROW_GAP * (c.nodes.length - 1);
  const body = Math.max(...columns.map(columnHeight));

  const nodes = columns.flatMap((column, col) => {
    let y = TOP + (body - columnHeight(column)) / 2;
    return column.nodes.map((n) => {
      const h = heightOf(n);
      const node = { ...n, col, x: col * (COL_W + COL_GAP), y, w: COL_W, h, chosen: chosen.includes(n.id) };
      if (n.ratio) {
        // The size's shape: a box at its ratio inside a 12-unit square, as the app's .ratio glyph.
        const [rw, rh] = n.ratio, s = 11 / Math.max(rw, rh);
        node.box = { w: rw * s, h: rh * s, x: 10 + (12 - rw * s) / 2, y: (h - rh * s) / 2 };
      }
      y += h + ROW_GAP;
      return node;
    });
  });

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges = links.map(([a, b]) => {
    const from = byId[a], to = byId[b];
    const x1 = from.x + from.w, y1 = from.y + from.h / 2, x2 = to.x, y2 = to.y + to.h / 2, dx = (x2 - x1) / 2;
    const isChosen = chosen.indexOf(b) === chosen.indexOf(a) + 1 && chosen.includes(a);
    return { col: from.col, chosen: isChosen, d: `M${x1} ${y1}C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}` };
  });
  // The chosen path is drawn last, over the rest.
  edges.sort((a, b) => a.chosen - b.chosen);

  // A file for each link from a size to a file type.
  const sizeIds = columns[3].nodes.map((n) => n.id);
  const sizes = sizeIds.length;
  const files = links.filter(([a]) => sizeIds.includes(a)).length;

  return {
    width: columns.length * COL_W + (columns.length - 1) * COL_GAP,
    height: TOP + body + 2,
    titles: columns.map((c, col) => ({ title: c.title, x: col * (COL_W + COL_GAP) })),
    nodes,
    edges,
    summary: `Ready. ${sizes} sizes, ${files} files`,
  };
}
