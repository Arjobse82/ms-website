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
  intro: "Assemblr works from one panel in Photoshop. It has one tab, Products, with two tiles: Layout, for the product you are working on, and Products, which lists every product in the document. The settings are behind the cog. Each number marks a part of the panel, and its note says what that part does. Point at a part and its note lights up.",
  art: assemblrPhotoshopPanel(),
  tabs: [
    {
      id: "products", label: "Products",
      summary: "Assemble turns your layers into products. Assemblr lays out each product by the visible edges of its layers and ignores the empty canvas around them.",
      tiles: [
        {
          id: "product", label: "Layout", icon: ICONS.layout,
          summary: "Shows the product you are working on. Assemble the selected layers here, then choose the product's arrangement and settings and manage its layers.",
          notes: [
            { name: "The drawing", text: "Shows the product as a drawing over the panel. Drag the end of the line round to change the angle of the row, or drag it in and out to set the row's size. Hold Shift to change the angle only. Click a dot to set where the row sits in the rectangle." },
            { name: "Assemble", text: "Puts the selected layers into one product, with an invisible rectangle around them, in one history step. Nothing on the canvas moves. Any layer that is not a smart object is converted to one. When Assemble leaves a layer out, the panel says why." },
            { name: "Arrangements", text: "Line-up, Grid, Mosaic, Pins and Puzzle are five ways to lay out the product's layers. Each one works from the visible edges of every layer. Until you choose one, nothing moves and the panel says Choose arrangement. Each choice is one history step, so Edit ▸ Undo takes it back." },
            { name: "The product", text: "Shows the product's name, the artboard it is on and how many layers it holds. Products are named Assemblr 1, Assemblr 2 and so on. Type here to rename one." },
            { name: "Settings", text: "Sets how the arrangement lays out the layers. Align images lines the layers up on their top edges, middles or bottom edges. Line-up's other settings are Angle, Size, Scale, Bleed and Perspective. Each arrangement shows only the settings it uses: Grid has columns and rows, and Mosaic and Puzzle have Breathing space." },
            { name: "Add selected", text: "Adds the layers selected in the Layers panel to this product where they stand, in one history step. If an arrangement is chosen, the product is laid out again straight away." },
            { name: "Disconnect", text: "Stops Assemblr touching this product's layers. Until you click Reconnect, nothing is fitted again and nothing snaps back. Reconnect lays the product out again with the layers as they stand." },
            { name: "Swap order", text: "Brings the other end of the row to the front. The Layers panel keeps its own order unless Allow Assemblr to restack layers is on. The panel tells you when the front layer in the Layers panel differs from the row's." },
            { name: "Disassemble", text: "Takes the product apart. Its rectangle is removed and every layer stays where it is." },
            { name: "Layers", text: "Shows the product's layers as thumbnails, in the row's order. Drag a tile to change the order. Click × to turn a layer off: its eye goes off and the other layers close up. Click + to turn it back on." },
          ],
        },
        {
          id: "products", label: "Products", icon: ICONS.catalogue,
          summary: "Lists every product in the document, grouped by artboard, with each product's layers.",
          notes: [
            { name: "Products", text: "Lists every product in the document and how many layers each one holds. The product you are working on is in bold." },
            { name: "Product name", text: "Click the name to select the product's rectangle. Resize the rectangle and the layers fit to it again, in a history step of their own. Move it and the layers move with it." },
            { name: "Disassemble", text: "Takes the product apart. Its rectangle is removed and every layer stays where it is." },
            { name: "+", text: "Adds the layers selected in the Layers panel to this product where they stand. The + sits at the end of every strip while the selection holds layers to add, so you can add them to any product without choosing it first." },
            { name: "Layers", text: "Drag a tile into another product's strip to move the layer to that product, even one on another artboard. Both products are laid out again in one history step. A dimmed tile is a layer that is turned off. Click its + to turn it back on." },
            { name: "Artboards", text: "Lists the artboard you are working in first, then each other artboard under its name. Products are numbered separately on each artboard, as if each artboard were its own document." },
          ],
        },
      ],
    },
    {
      id: "settings", label: "Settings",
      summary: "The two settings behind the cog control what Assemblr may do to your layers.",
      tiles: [
        {
          id: "settings", label: "Settings",
          notes: [
            { name: "Allow Assemblr to unlock images", text: "On by default. When you resize a product, Assemblr may unlock a locked layer in it, and the layer rejoins the set. When this is off, Assemblr never unlocks a layer: a locked layer stays where it is and the others fit around it." },
            { name: "Allow Assemblr to restack layers", text: "Off by default. Layers keep their place in the Layers panel, and the panel tells you when the row's order differs. When this is on, in Line-up and Puzzle, Assemblr reorders the product's layers among the places they already hold in the stack. The row's front layer is then in front in the Layers panel too." },
            { name: "Settings that are on", text: "The right end of the status line names the settings that are on: restack, unlock, or restack · unlock." },
          ],
        },
      ],
    },
  ],
  help: {
    intro: "This section takes you through common jobs step by step and says what to do when the panel shows a message. Every action in Assemblr is one named step in the History panel, so Edit ▸ Undo takes it back.",
    groups: [
      {
        id: "how", label: "How do I…",
        items: [
          { id: "assemble", q: "Make a product", a: ["Put your images on transparent layers on one artboard.", "Select the layers in the Layers panel and choose Plugins ▸ Assemblr.", "Click Assemble. The layers become one product, with an invisible rectangle around them. Nothing on the canvas moves yet."] },
          { id: "arrange", q: "Arrange it", a: ["Pick Line-up, Grid, Mosaic, Pins or Puzzle at the top of the Layout tile. Until you do, nothing moves.", "Drag the drawing or change a setting. The canvas follows when you let go."] },
          { id: "resize", q: "Make a product bigger or smaller", a: ["Click the product's name in the Products tile to select the product's rectangle.", "Resize it with Edit ▸ Free Transform. A moment later the layers fit to the new size, as a history step of their own. One Undo takes that fit back and keeps your resize.", "Move the rectangle and the layers move with it."] },
          { id: "add", q: "Add a layer", or: true, a: ["Select the layers in the Layers panel and click Add selected in the Layout tile. They join the product where they stand.", "Or click + at the end of any product's strip in the Products tile. You don't need to choose the product first.", "Or drag a tile from another product's strip into this product's strip. The layer moves to this product, even from another artboard."] },
          { id: "remove", q: "Take a layer out", or: true, a: ["Click × on its tile to turn it off. Its eye goes off and the other layers close up. Click + to turn it back on.", "Delete, rasterise or merge a layer and it leaves the product."] },
          { id: "edit", q: "Move, scale or rotate a layer by hand", a: ["Edit it as usual. A moved layer snaps back into the arrangement when you deselect it.", "In Line-up and Puzzle a scaled layer keeps its scale. In Grid, Mosaic and Pins it goes back to the arrangement's size. A layer you have rotated is held where it stands while the others fit again."] },
          { id: "lock", q: "Keep one layer where it is", a: ["Lock it in the Layers panel. It stays where it is, and the others use the whole rectangle.", "Unlock it and it rejoins the set when you click away. While Allow Assemblr to unlock images is on, resizing the product unlocks it too."] },
          { id: "order", q: "Put the front layer in front", a: ["Swap order brings the other end of the row to the front.", "The Layers panel keeps its own order. To have it follow the row, tick Allow Assemblr to restack layers behind the cog."] },
          { id: "contents", q: "Change the image inside a layer", a: ["Double-click the smart object's thumbnail, edit its contents and save.", "Assemblr measures that layer again and lays the product out again."] },
          { id: "artboards", q: "Work across artboards", a: ["Each artboard works as a document of its own, and its products are numbered on it.", "Duplicate an artboard and its products are copied with it, along with their arrangements and settings. Nothing moves."] },
          { id: "apart", q: "Stop Assemblr touching a product, or take it apart", or: true, a: ["Disconnect leaves the product's layers alone until you click Reconnect.", "Disassemble takes the product apart for good, and every layer stays where it is. There is no Reset. To go back, use Edit ▸ Undo."] },
        ],
      },
      {
        id: "says", label: "When the panel says…",
        items: [
          { id: "already", q: "Already in Assemblr 1.", a: ["Every layer you selected is in a product already. Select other layers. To move a layer to another product, use Add selected or drag its tile between strips."] },
          { id: "background", q: "Background is the Background layer: it cannot be assembled.", a: ["Turn it into an ordinary layer first with Layer ▸ New ▸ Layer from Background, or leave it out of the selection."] },
          { id: "converted", q: "pink-box converted to a smart object.", a: ["A layer that is not a smart object becomes one when you assemble it, and stays one. To get the original layers back, choose Layer ▸ Smart Objects ▸ Convert to Layers. They come back outside the product."] },
          { id: "choose", q: "Choose arrangement", a: ["The product is assembled but not laid out yet. Pick one of the five arrangements at the top of the Layout tile."] },
          { id: "front", q: "The Layers panel puts … in front; the row's front is …", a: ["The order in the Layers panel differs from the row's. To make them agree, tick Allow Assemblr to restack layers behind the cog. You can also leave it as it is: the canvas is correct either way."] },
          { id: "snapped", q: "… snapped back into Assemblr 1", a: ["You moved one of the product's layers by hand. To move the whole set, move the rectangle. To place the layers by hand, Disconnect the product."] },
          { id: "locked", q: "Locked, left where it is", a: ["A locked layer is held where it is while the others fit around it. Unlock it to let it rejoin the set."] },
          { id: "left", q: "… left Assemblr 1", a: ["A layer was deleted, is no longer a smart object, or was moved onto another artboard. A product can only be on one artboard."] },
          { id: "disconnected", q: "Disconnected", a: ["Assemblr is leaving these layers alone. Reconnect lays the product out again with the layers as they stand."] },
          { id: "busy", q: "Photoshop is busy: try again in a moment.", a: ["A dialog or a transform is open. Finish or cancel it, then try again."] },
        ],
      },
    ],
  },
};
