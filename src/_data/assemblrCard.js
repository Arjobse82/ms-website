// Assemblr's card on the InDesign page (partials/app-page.njk `cardPlugin`, tiles/plugin-assemblr.njk): the plugin as it
// looks in its dark theme (the owner's screenshot, 2026-11-07): the three tool tiles, the line-up drawn in white over the
// page's photo, and the panel under it. `art` is that drawing; `modes` the five arrangement tabs, their icons and names as
// the live demo's panel has them (tiles/assemblr-panel.html).
import { readFileSync } from "node:fs";

const f = (n) => +n.toFixed(1);

// The line-up: eight frames in a row at 0°, each smaller than the one in front (Perspective), on the area the rectangle
// gives it, the axis through them and a handle at each corner and middle of the area.
function art() {
  const W = 210, H = 285, cy = H / 2, frames = 8;
  const items = Array.from({ length: frames }, (_, i) => {
    const h = 134 * 0.88 ** i, w = h * 0.53;
    return { cx: 65 + i * 15, h, w };
  });
  const rects = [...items].reverse().map((it, k, all) => {
    const i = all.length - 1 - k; // 0 is the front frame, drawn last
    return `<rect x="${f(it.cx - it.w / 2)}" y="${f(cy - it.h / 2)}" width="${f(it.w)}" height="${f(it.h)}" rx="${f(it.w * 0.2)}" stroke-width="${f(2.6 - i * 0.18)}"/>`;
  }).join("");
  const first = items[0], last = items[items.length - 1];
  const handles = [0, W / 2, W].flatMap((x) => [0, cy, H].map((y) => [x, y])).filter(([x, y]) => !(x === W / 2 && y === cy))
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5"/>`).join("");
  return `<svg class="pl-art" viewBox="-8 -8 ${W + 16} ${H + 16}" aria-hidden="true">`
    + `<rect x="0" y="0" width="${W}" height="${H}" rx="22" fill="rgba(70,76,84,.5)"/>`
    + `<g fill="none" stroke="#fff">${rects}</g>`
    + `<line x1="${first.cx}" y1="${cy}" x2="${last.cx}" y2="${cy}" stroke="#3372f6" stroke-width="4" stroke-linecap="round"/>`
    + `<circle cx="104" cy="${cy}" r="6.5" fill="#fff" stroke="#3372f6" stroke-width="2.5"/>`
    + `<circle cx="${last.cx}" cy="${cy}" r="6.5" fill="#3372f6" stroke="#fff" stroke-width="2"/>`
    + `<g fill="#0c0c0c" stroke="rgba(255,255,255,.35)" stroke-width="1">${handles}</g></svg>`;
}

const demo = readFileSync(new URL("../_includes/tiles/assemblr-panel.html", import.meta.url), "utf8");
const modes = [...demo.matchAll(/<button class="ad-mode"[^>]*>(.*?)<\/button>/g)].map((m) => m[1]);

export default { art: art(), modes };
