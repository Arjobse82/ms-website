// A plugin's work as a flow chart, at the top of its product page (partials/flow.njk): what goes in, what the plugin
// does with it, what comes out, and the loop back. The steps are the panel's own (panels.js), drawn with its tiles (src/_lib/panel-icons.js).
import { ICONS } from "../_lib/panel-icons.js";

// The brief is not a panel tile either: an Excel workbook, a row per product and its sheet tab, drawn the same way.
const BRIEF = '<svg viewBox="0 0 62 62"><rect x="11.5" y="13.5" width="39" height="30" rx="2.5" fill="#fff" stroke="currentColor"/><g fill="currentColor"><rect x="15" y="17" width="5" height="4"/><rect x="15" y="23" width="5" height="4"/><rect x="15" y="29" width="5" height="4"/><rect x="15" y="35" width="5" height="4"/></g><g fill="#d1d0d0"><rect x="22" y="17" width="12" height="4"/><rect x="36" y="17" width="11" height="4"/><rect x="22" y="23" width="12" height="4"/><rect x="36" y="23" width="11" height="4"/><rect x="22" y="29" width="12" height="4"/><rect x="36" y="29" width="11" height="4"/><rect x="22" y="35" width="12" height="4"/><rect x="36" y="35" width="11" height="4"/></g><path d="M14 43.5h13l-1.5 5h-10z" fill="currentColor"/></svg>';
// Match is not a panel tile: a file matched to its product, drawn as the tiles are (62 × 62, 1-unit ink lines, #d1d0d0).
const MATCH = '<svg viewBox="0 0 62 62"><rect x="12" y="16" width="16" height="21" rx="1.5" fill="#d1d0d0"/><rect x="10.5" y="14.5" width="16" height="21" rx="1.5" fill="#fff" stroke="currentColor"/><rect x="36" y="26" width="16" height="21" rx="1.5" fill="currentColor"/><path d="M26.5 25h4a2.5 2.5 0 0 1 2.5 2.5v9.5a2.5 2.5 0 0 0 2.5 2.5h.5" fill="none" stroke="currentColor"/><circle cx="26.5" cy="25" r="1.8" fill="currentColor"/></svg>';

export default {
  "catalogue-producer": {
    title: "From brief to catalogue, and back",
    summary: "The brief, the image folders and the overlays folder go in. Each file is matched to its product, then the pages are built, the images laid out, the copy placed and the badges added. An edit on the page or in the brief can be taken either way.",
    columns: [
      {
        step: "In",
        nodes: [
          { icon: BRIEF, name: "Brief", text: "An Excel workbook, a row per product" },
          { icon: ICONS.folders, name: "Image folders", text: "PSDs, TIFs, JPEGs, PDFs and more" },
          { icon: ICONS.overlays, name: "Overlays folder", text: "Badges, and price devices" },
        ],
      },
      {
        step: "Match",
        nodes: [
          { icon: MATCH, name: "Analyse links", text: "Each file finds its product: by the code in its file name or folder, or by its name. Doubtful matches wait for a Check.", key: true },
        ],
      },
      {
        step: "Build",
        nodes: [
          { icon: ICONS.pages, name: "Pages", text: "Grid, page breaks, masters" },
          { icon: ICONS.layout, name: "Layout", text: "Lays out each product's images by what is in them" },
          { icon: ICONS.copy, name: "Copy", text: "The brief's columns, in your styles" },
          { icon: ICONS.overlays, name: "Badges and prices", text: "On each product's corners, price points styled from a master" },
          { icon: ICONS.tables, name: "Tables", text: "Price lists and spec tables, styled from a master" },
        ],
      },
      {
        step: "Out",
        catalogue: true,
        nodes: [
          { name: "The catalogue", text: "InDesign pages; each step is one undo" },
        ],
      },
    ],
    loop: { name: "Changes", text: "An edit on the page or in the brief is listed, and you choose which way to take it." },
  },
};
