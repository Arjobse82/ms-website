// Assemblr for Photoshop's panel, explained (src/_data/panels.js): its words are the plugin's own labels, tooltips and
// listing (catalague-producer src/photoshop/ui/main.ts and shell.html, src/assemblr/ui/sections.ts in its Photoshop
// branches, src/ui/lineup-widget.ts, src/ui/strip.ts, docs/photoshop-listing.md, docs/photoshop-scenarios.md, PLAN.md
// D64, D68, D70, D74). One tab, Products, with its two tiles, and the two settings behind the cog for what Assemblr may
// do to your layers (the panel's look left out, the owner, 2026-10-29); no Overlays, which the
// Photoshop panel does not have (D68 (12)). `help` is its quick help (partials/panel-help.njk), from the same sources and
// the host's own sentences (src/photoshop/host). Drawings: src/_includes/panel/assemblr-photoshop/, drawn from
// src/_lib/assemblr-photoshop-panel.js.
import { ICONS } from "../panel-icons.js";
import { assemblrPhotoshopPanel } from "../assemblr-photoshop-panel.js";

export default {
  name: "Assemblr",
  label: "User guide",
  heading: "Every control, explained",
  nav: "Guide",
  intro: "Assemblr works from one panel in Photoshop, with one tab, Products, and two tiles: Layout, for the product you are working on, and Products, for every product in the document. Its settings are behind the cog. Each number says what a part of the panel does, and the note beside it lights up as you point at it.",
  art: assemblrPhotoshopPanel(),
  tabs: [
    {
      id: "products", label: "Products",
      summary: "Your layers become products, and each is laid out by the visible pixels in its layers, so empty canvas in a layer is ignored.",
      tiles: [
        {
          id: "product", label: "Layout", icon: ICONS.layout,
          summary: "The product you are working on. Assemble the selected layers, then set its arrangement and its settings and manage its layers.",
          notes: [
            { name: "The drawing", text: "The product drawn over the panel. Drag the end of the line round to change the angle of the row, or in and out to set its size; hold Shift to change the angle only. Click a dot to set where the row sits in the rectangle." },
            { name: "Assemble", text: "Puts the selected layers into one product, with an invisible rectangle around them, in one history step. Nothing on the canvas moves. A layer that is not a smart object is converted to one. When Assemble leaves a layer out, the panel says why." },
            { name: "Arrangements", text: "Line-up, Grid, Mosaic, Pins and Puzzle are five ways to lay out the product's layers, each working from the visible part of every layer. Until you choose one, nothing moves and the panel says Choose arrangement. Each choice is one history step; undo it with Edit ▸ Undo." },
            { name: "The product", text: "Shows the product's name, the artboard it is on and how many layers it holds. Products are named Assemblr 1, Assemblr 2 and so on; type here to rename one." },
            { name: "Settings", text: "Align images lines the layers up on their top edges, middles or bottom edges; Angle, Size, Scale, Bleed and Perspective are Line-up's other settings. Each arrangement shows only the settings it uses: Grid has columns and rows, and Mosaic and Puzzle have a Breathing space." },
            { name: "Add selected", text: "Adds the layers selected in the Layers panel to this product, where they stand, in one history step. With an arrangement chosen, the product is laid out again at once." },
            { name: "Disconnect", text: "Stops Assemblr touching this product's layers: it re-fits nothing and snaps nothing back until you click Reconnect. Reconnect lays the product out again with the layers as they stand." },
            { name: "Swap order", text: "Brings the other end of the row to the front. The Layers panel keeps its own order unless Allow Assemblr to restack layers is on, and the panel says when its front layer differs from the row's." },
            { name: "Disassemble", text: "Takes the product apart. Its rectangle is removed and every layer stays where it is." },
            { name: "Layers", text: "Thumbnails of the product's layers, in the row's order. Drag a tile to change the order. × turns a layer off: its eye goes off and the others close up. + turns it back on." },
          ],
        },
        {
          id: "products", label: "Products", icon: ICONS.catalogue,
          summary: "Every product in the document, grouped by artboard, each with its layers.",
          notes: [
            { name: "Products", text: "Every product in the document, with how many layers each one holds. The product you are working on is in bold." },
            { name: "Product name", text: "Selects the product's rectangle. Resize the rectangle and the layers re-fit, in a history step of their own. Move it and the layers move with it." },
            { name: "Disassemble", text: "Takes the product apart. Its rectangle is removed and every layer stays where it is." },
            { name: "+", text: "Adds the layers selected in the Layers panel to this product, where they stand. It sits at the end of every strip while the selection holds layers to add, so you can add them to any product without choosing it first." },
            { name: "Layers", text: "Drag a tile into another product's strip and the layer moves to that product, even on another artboard, and both products are laid out again in one history step. A dimmed tile is a layer that is turned off; click its + to turn it back on." },
            { name: "Artboards", text: "The artboard you are working in comes first, and each other artboard follows under its name. Products are numbered separately on each artboard, as if each were its own document." },
          ],
        },
      ],
    },
    {
      id: "settings", label: "Settings",
      summary: "Behind the cog are two settings for what Assemblr may do to your layers.",
      tiles: [
        {
          id: "settings", label: "Settings",
          notes: [
            { name: "Allow Assemblr to unlock images", text: "On by default: Assemblr may release a layer's lock when you resize its product, and the layer rejoins the set. Off: Assemblr never unlocks a layer, so a locked layer stays where it is and the others fit around it." },
            { name: "Allow Assemblr to restack layers", text: "Off by default: layers keep their place in the Layers panel, and the panel says when the row's order differs. On: in Line-up and Puzzle, Assemblr reorders the product's layers among the places they already hold, so the row's front layer is in front in the Layers panel too." },
            { name: "Settings that are on", text: "The right end of the status line names the settings that are on: restack, unlock, or restack · unlock." },
          ],
        },
      ],
    },
  ],
  help: {
    intro: "Common jobs step by step, and what to do when the panel shows a message. Every action in Assemblr is one named step in the History panel; undo it with Edit ▸ Undo.",
    groups: [
      {
        id: "how", label: "How do I…",
        items: [
          { id: "assemble", q: "Make a product", a: ["Put your images on transparent layers, on one artboard.", "Select the layers in the Layers panel and open Plugins ▸ Assemblr.", "Click Assemble. The layers become one product, with an invisible rectangle around them. Nothing on the canvas moves yet."] },
          { id: "arrange", q: "Arrange it", a: ["Pick Line-up, Grid, Mosaic, Pins or Puzzle at the top of the Layout tile. Until you do, nothing moves.", "Drag the drawing or change a setting; the canvas follows when you let go."] },
          { id: "resize", q: "Make a product bigger or smaller", a: ["Click the product's name in the Products tile: it selects the product's rectangle.", "Resize it with Edit ▸ Free Transform. The layers re-fit a moment later, as a history step of their own, so one Undo takes the re-fit off and keeps your resize.", "Move the rectangle and the layers move with it."] },
          { id: "add", q: "Add a layer", or: true, a: ["Select the layers in the Layers panel and click Add selected in the Layout tile. They join where they stand.", "Or click + at the end of any product's strip in the Products tile, without choosing the product first.", "Or drag a tile from another product's strip: the layer moves to that product, onto another artboard too."] },
          { id: "remove", q: "Take a layer out", or: true, a: ["× on its tile turns it off: its eye goes off and the others close up. + turns it back on.", "Delete, rasterize or merge a layer and it leaves the product."] },
          { id: "edit", q: "Move, scale or turn a layer by hand", a: ["Edit it as usual. A moved layer snaps back into the arrangement when you deselect it.", "A scale is kept in Line-up and Puzzle; in Grid, Mosaic and Pins the layer goes back to the arrangement's size. A layer you have rotated is held where it stands while the others re-fit."] },
          { id: "lock", q: "Keep one layer where it is", a: ["Lock it in the Layers panel. It stays where it is, and the others use the whole rectangle.", "Unlock it and it rejoins the set when you click away. While Allow Assemblr to unlock images is on, resizing the product unlocks it too."] },
          { id: "order", q: "Put the front layer in front", a: ["Swap order brings the other end of the row to the front.", "The Layers panel keeps its own order. To have it follow the row, tick Allow Assemblr to restack layers behind the cog."] },
          { id: "contents", q: "Change a picture inside a layer", a: ["Double-click the smart object's thumbnail, edit its contents and save.", "That layer is measured again and the product re-fits."] },
          { id: "artboards", q: "Work across artboards", a: ["Each artboard works as a document of its own, its products numbered on it.", "Duplicate an artboard and its products are copied with it, with their arrangements and settings. Nothing moves."] },
          { id: "apart", q: "Stop Assemblr touching a product, or take it apart", or: true, a: ["Disconnect leaves its layers alone until you Reconnect.", "Disassemble takes it apart for good: every layer stays where it stands. There is no Reset; use Edit ▸ Undo."] },
        ],
      },
      {
        id: "says", label: "When the panel says…",
        items: [
          { id: "already", q: "Already in Assemblr 1.", a: ["Every layer you selected is in a product already. Select other layers, or use Add selected or a strip to move one."] },
          { id: "background", q: "Background is the Background layer: it cannot be assembled.", a: ["Turn it into an ordinary layer first, with Layer ▸ New ▸ Layer from Background, or leave it out of the selection."] },
          { id: "converted", q: "pink-box converted to a smart object.", a: ["A layer that is not a smart object becomes one when you assemble it, and stays one. Layer ▸ Smart Objects ▸ Convert to Layers gives you the original layers back, out of the product."] },
          { id: "choose", q: "Choose arrangement", a: ["The product is assembled but not laid out yet. Pick one of the five arrangements at the top of the Layout tile."] },
          { id: "front", q: "The Layers panel puts … in front; the row's front is …", a: ["The Layers panel's order and the row's differ. Tick Allow Assemblr to restack layers behind the cog to make them agree, or leave it as it is, because the canvas is correct either way."] },
          { id: "snapped", q: "… snapped back into Assemblr 1", a: ["You moved one of the product's layers by hand. Move the rectangle to move the set, or Disconnect the product to place its layers by hand."] },
          { id: "locked", q: "Locked, left where it is", a: ["A locked layer is held where it stands while the others fit round it. Unlock it to let it rejoin the set."] },
          { id: "left", q: "… left Assemblr 1", a: ["A layer was deleted, is no longer a smart object, or moved onto another artboard. A product can only be on one artboard."] },
          { id: "disconnected", q: "Disconnected", a: ["Assemblr is leaving these layers alone. Reconnect lays the product out again with the layers as they stand."] },
          { id: "busy", q: "Photoshop is busy: try again in a moment.", a: ["A dialog or a transform is open. Finish or cancel it, then try again."] },
        ],
      },
    ],
  },
};
