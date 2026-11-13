// Assemblr for InDesign's panel, explained (src/_data/panels.js), as a user guide: its words are the plugin's own labels,
// tooltips and notes (catalague-producer src/assemblr/ui/main.ts, sections.ts, overlays.ts and shell.html; the shared
// src/ui/lineup-widget.ts, strip.ts, pins-control.ts, overlay-geometry.ts and status.ts), and its behaviour docs/assemblr.md's
// rules and docs/assemblr-listing.md as of HEAD 9b659bc (2026-10-28: Assemble starts in Grid; a frame deleted by hand
// leaves its product). One tab, Products, with its three tiles; the settings behind the cog are left out (the owner,
// 2026-10-29). `help` is the Help section after it (partials/panel-help.njk): tasks step by step (`or`: ways to do it
// rather than steps), and what the panel's messages mean. Drawings: src/_includes/panel/assemblr/, drawn from
// src/_lib/assemblr-panel.js; their look shares Assemblr for Photoshop's (`uses`).
import { ICONS } from "../panel-icons.js";
import { assemblrPanel } from "../assemblr-panel.js";

const art = assemblrPanel();
const shape = art.how.shape;

export default {
  name: "Assemblr",
  label: "User guide",
  heading: "Every control, explained",
  nav: "Guide",
  uses: "assemblr-photoshop",
  intro: "Assemblr works from one panel in InDesign: Plugins ▸ Assemblr. It has one tab, Products, with three tiles: Layout, for the product you are working on; Products, for every product in the document; and Overlays, for badges and prices on a product's corners. Pick a tile to see it; each number says what a part of the panel does, and the note beside it lights up as you point at it.",
  art,
  // How it works, before the demo and the guide (partials/panel-how.njk): what Assemble does to the document, each step
  // a drawing, src/_includes/panel/assemblr/how-<id>.njk (docs/assemblr.md rules 1, 2 and 8; the overlays'
  // docs/assemblr-listing.md and src/core/overlay/stack.ts DEFAULT_CORNER). A `wide` step takes the whole row; the
  // `hero` one is drawn on the product page's hero, under its buttons, with its `caption` (the owner, 2026-11-02), and
  // stays a step on the help page.
  how: {
    // In the product page's hero, above the video (the owner, 2026-11-02).
    inHero: true,
    heading: "One layer, one rectangle",
    intro: "What Assemble does to your document: it moves your images onto a layer of their own and draws an empty rectangle round them. That rectangle is the product; whatever you do to it, the images and the badges on its corners follow.",
    steps: [
      { id: "layers", name: "Assemble", text: "Select a few placed images and click Assemble in the Layout tile. Assemblr adds a layer named \"Assemblr\", if the document has none yet, and moves the images onto it from whatever layer they were on; everything else stays where it is. Behind them it draws an empty rectangle round the space they took up: the product's frame. It has no fill and no stroke, so it prints nothing." },
      { id: "frame", name: "The frame", text: "The rectangle is the handle you work the product by. Move it and the images move with it, onto another page too; drag a handle and they re-fit to the new size. To put the product on another layer, select it (click its name in the Products tile) and drag its square in the Layers panel to any layer: it goes on working there, and pictures you place inside it on that layer join it. To see the rectangle, turn on View ▸ Extras ▸ Show Frame Edges." },
      { id: "shape", name: "Landscape to portrait", wide: true, hero: true, caption: "One rectangle drives it all. Drag it from landscape to portrait and the six cans are laid out again for the new shape, while the badge and the price keep the same distance from its edges.", text: `The rectangle drives it all. Here six cans in Line-up, lined up on their middles (Align images: ${shape.settings.align}), ${shape.settings.angle ? `the row turned to ${shape.settings.angle}° and` : "in a level row (Angle 0), with"} Perspective at ${shape.settings.perspective} %, so each can is smaller than the one in front of it, overlapping by ${shape.from.overlap} % of their width, which in landscape makes the front can as tall as the rectangle (Size ${shape.settings.size} %). Drag it to portrait and they are laid out again for the new shape: the row keeps its ${shape.to.overlap} % overlap and is scaled down to fit the narrower rectangle, so it looks the same, only smaller (Size reads ${shape.settings.sizeTo} % there). The badges and prices on its corners keep to its edges: each stays the same distance in, Inset X and Y in the Overlays tile, and the same size, so the margins match at any shape. Turn Resize scale on to have them grow with the product instead. They sit on a layer of their own, "Assemblr overlays", above the product's.` },
      { id: "modes", name: "Five arrangements", wide: true, text: "Pick one at the top of the Layout tile: Line-up, Grid, Mosaic, Pins or Puzzle. Each lays the images out by what you can see in them, not by their frames, and each keeps its own settings, so switching back finds them as you left them. Every one here is laid out by Assemblr's own engine." },
      // The overlays (panel/assemblr/how-overlays.njk, the owner, 2026-11-11): a setup on each corner, its settings marked,
      // and Max size's one example, Ink ("a big feature that InDesign can't do"). catalague-producer D73 (pt, %), D90
      // (Resize scale), D91 (ink).
      { id: "overlays", name: "Overlays on the corners", wide: true, text: "In the Overlays tile, load badges and prices onto any of the product's four corners. Each corner stacks its overlays from the corner, Across along the edge or Down the side, with a Gap between them and Inset X and Y in from the edges; Resize scale makes the gap and insets grow and shrink with the product. A price is written into your own InDesign design, the digits where its Xs are. Each overlay fits inside its Max size, set three ways: mm, the same size on every product; %, a share of the image area's width and height; or Ink, one number, the share of the image area's area each overlay takes, its own shape kept. With Ink a badge carries the same weight on every product, whatever its size or shape, something InDesign cannot do: on its own, an object is a fixed size or scales with its frame. Set the corners once for the document and every product follows, or give one product or one page corners of its own." },
    ],
  },
  tabs: [
    {
      id: "products", label: "Products",
      summary: "Your placed images made into products, each laid out by what you can see in its pictures rather than their frames.",
      tiles: [
        {
          id: "product", label: "Layout", icon: ICONS.layout,
          summary: "Assemble for the images you select, then the selected product: its arrangement, its settings and its images.",
          notes: [
            { name: "The drawing", text: "The product drawn above the card; the page follows when you let go. In Line-up, drag the end of the line round to turn the row (it snaps to 5°; hold Option for 1°) and out or in to set its size; hold Shift to only turn. Click one of the nine dots to choose where the product sits in its frame. Grid and Pins show bars for the space across and down, Mosaic a Rotation stepper for other packings, and Puzzle origin points to rest the images against. A locked image is drawn dashed." },
            { name: "Assemble", text: "Shown while the selection holds placed images that are in no product. Assemble makes them one product, in the space they took up, laid out as a grid with automatic columns, in one undo step. The images move onto a layer named \"Assemblr\", and the product's frame, an empty rectangle round them that prints nothing, is the handle you move and resize it by. When Assemble cannot run, the line under it says why." },
            { name: "Arrangements", text: "Line-up (one row with angle and perspective), Grid (rows and columns), Mosaic (scaled to fill the space), Pins (a bowling-pins formation) and Puzzle (tightly packed at equal area). Each lays the images out by their visible subject, and each keeps its own settings, so switching back finds them as you left them." },
            { name: "The product", text: "Its name, the page it is on and how many images it holds. Products are named Product 1, Product 2 and so on; type a new name here and press Return to rename one." },
            { name: "Align images, Angle, Size, Scale, Bleed", text: "Align images lines the images up on their top edges, middles or bottom edges. Angle turns the row, up to 90° either way; Size is how much of the space the row takes. Scale shrinks the whole arrangement inside its frame, and Bleed adds a margin round each picture's visible subject, as a share of its size. Each arrangement shows only what it uses: Grid its columns and rows (empty is automatic) and Space across and down, which overlap below 0; Mosaic and Puzzle a Breathing space; Pins a slider from Rack to Pyramid and Add row or Remove row. A box's chevron drops a slider down from it." },
            { name: "Add clipping path to alpha", text: "Clips each picture to its cut-out, the outline of its transparency, so nothing outside the product shows." },
            { name: "Perspective", text: "In Line-up and Pins: makes the far images smaller, as if the row went back into the page. 0 keeps every image the same size." },
            { name: "Re-fit", text: "Lays the images out again with these settings. In Puzzle it nests them again round the images you placed by hand and the locked ones." },
            { name: "Reset", text: "Puts the product back to this arrangement's automatic settings: equal sizes, hand rotation and shear cleared, locks kept in Puzzle and released in the other arrangements. Images removed from the layout stay out. One undo step." },
            { name: "Clear transformations", text: "Shown once you have turned or scaled an image by hand. It sets those images upright, at an automatic size and crop, and lays them out again; the settings and locks stay. One undo step." },
            { name: "Swap order", text: "Brings the other end of the row to the front, where the images overlap. In Grid it shows once a space is below 0, and chooses whether the upper or the lower rows sit on top." },
            { name: "Disassemble", text: "Takes the product apart: its frame goes, and every image stays where it stands, on the Assemblr layer." },
            { name: "Disconnect", text: "Stops Assemblr laying this product out, so your edits are left exactly as they are. Its controls dim until you Reconnect, which lays it out again with the images as they stand, sizes you set by hand kept; Reset reconnects it too." },
            { name: "Images", text: "The product's images in their order, each tile its picture and file type. Drag a tile to reorder, or into another product's strip to move the image there. × removes an image from the layout: it leaves the page and its tile stays, dimmed; + on that tile puts it back at the end of the row. The + tile adds image files from disk. A tile marked GROUP is an InDesign group, laid out as one image." },
          ],
        },
        {
          id: "products", label: "Products", icon: ICONS.catalogue,
          summary: "Every product in the document, page by page, each with its images, so you can move images between products.",
          notes: [
            { name: "Products", text: "Every product in the document, and how many there are. The product you are working on is in bold." },
            { name: "Product name", text: "Selects the whole product on the page: its frame, its images and its overlays. Then the Layout tile shows it." },
            { name: "Tags", text: "Its image count, then Locked and a number when some of its images are locked with Object ▸ Lock (they stay where they are when it is laid out again), and Disconnected while Assemblr is leaving it alone; select it to Reconnect or Reset." },
            { name: "Disassemble", text: "Takes the product apart: its frame goes, and every image stays where it stands." },
            { name: "+", text: "Ends every strip: adds image files from disk to that product, without selecting it first." },
            { name: "Images", text: "Drag a tile from one product's strip into another's and the image moves to that product; both are laid out again. A dimmed tile is an image removed from the layout: its + puts it back. A disconnected product's strip is dimmed and takes no drops." },
            { name: "Pages", text: "A divider names the page where the list moves on to it: Page 3, Pages 4-5 for a product across the spine, and Pasteboard for a product off the pages. It is a heading only." },
          ],
        },
        {
          id: "overlays", label: "Overlays", icon: ICONS.overlays,
          summary: "Badges and prices on the corners of a product, for one product, a range of pages or the whole document.",
          notes: [
            { name: "The drawing", text: "The product's image area at its own shape, a control on each corner: a dot where the corner holds overlays, a plus where it holds none. Click one to open that corner; the open corner is blue, and so are its overlays. A box drawn in orange is one this product or page set itself." },
            { name: "Where it applies", text: "With a product selected, Product: and its name, for that product alone; click it off to edit its page instead. With no product selected, Document, which every product follows until it sets a corner of its own, and a chip per page: turn pages on to give them overlays of their own, which a page keeps when products move." },
            { name: "The corner", text: "The product and the open corner, and what is on it, each with × to take it off. Follows the document, until you give it its own; then Apply document setting drops its own and shows the document's again, keeping its price." },
            { name: "Price", text: "Type the product's price, such as $12.50. Its digits are written into your own price design, its styles kept, and each product types its own. A design with another field, such as Unit, gets a box of its own under the price." },
            { name: "Load badge… and Load price…", text: "Bring new artwork into the document. Load badge… takes any files InDesign can place, PNG, PSD, PDF or AI. Load price… takes a folder of InDesign files with X where the digits go, such as $X.XX or XXc: no tagging needed, and each price is drawn with the design that fits it." },
            { name: "The document's overlays", text: "Each badge and price set already in the document, as a + chip: click one to put it on this corner." },
            { name: "Apply this corner", text: "To page makes this corner the same on every other product on this page; to document makes it the document's, for every product that follows it. Each product keeps its own price." },
            { name: "Corner and Stack", text: "The four corners again: click another to move this corner's overlays there, or to swap them with what is there; they keep their settings. Stack lays them along the corner's top or bottom edge (Across) or its side (Down)." },
            { name: "Size and spacing", text: "Gap between the overlays, and Inset X and Y from the image area's edges, in the document's ruler units. Resize scale on makes them resize with the product. Each overlay fits in a Max width by Max height, in mm or as a % of the product's image area." },
            { name: "Reports", text: "What happened when the overlays were laid: \"Overlays: 3 placed, 0 removed.\" A yellow triangle marks a problem, such as a badge that could not be loaded or a price no design fits." },
            { name: "In this document", text: "Every badge and price set the document holds; × removes one from the list and from every product. A set lists its designs and what each spells, $X.XX say. A file marked cannot be found keeps working on the pages from the copy the document holds." },
          ],
        },
      ],
    },
  ],
  help: {
    intro: "The everyday jobs, step by step, and what to do when the panel tells you something. Every action in Assemblr is one step of Edit ▸ Undo.",
    groups: [
      {
        id: "how", label: "How do I…",
        items: [
          { id: "assemble", q: "Make a product", a: ["Place a few images with transparency, PSD or PNG cut-outs say, anywhere on one spread.", "Select them and open Plugins ▸ Assemblr.", "Click Assemble in the Layout tile. The images become one product in the space they took up, laid out as a grid."] },
          { id: "arrange", q: "Change how it is arranged", a: ["Select the product: click one of its images, or its name in the Products tile.", "Pick Line-up, Grid, Mosaic, Pins or Puzzle at the top of the Layout tile.", "Drag the drawing or change a setting; the page follows when you let go."] },
          { id: "resize", q: "Make a product bigger or smaller", a: ["Turn on View ▸ Extras ▸ Show Frame Edges.", "With the Selection tool, click the edge of the product's frame, the empty rectangle round its images.", "Drag a handle: the images re-fit to the new size. Drag the frame and they move with it, onto another page too."] },
          { id: "add", q: "Add an image", or: true, a: ["Click + at the end of the product's images and pick the files.", "Or place or drag a picture so its centre is inside the product's frame, on the product's layer (\"Assemblr\"). A picture on another layer is left alone, so a logo or a sticker can sit over a product.", "Or drag its tile from another product's images in the Products tile."] },
          { id: "remove", q: "Take an image out", or: true, a: ["× on its tile removes it from the layout; its tile stays, dimmed, and + puts it back.", "Drag it out of the product's frame and it is yours from then on; its tile dims.", "Delete it and it leaves the product altogether."] },
          { id: "edit", q: "Move, scale, turn or crop an image by hand", a: ["Edit the image as usual; Assemblr waits while it is selected.", "Click away. The product is laid out once: a crop is kept, a scale and a turn are kept in Line-up, Grid and Puzzle, and a moved image goes back to its place. The panel says what was not kept.", "Clear transformations in the Layout tile undoes the turns and scales."] },
          { id: "lock", q: "Keep one image where it is", a: ["Select it and choose Object ▸ Lock. The others fit round it.", "Object ▸ Unlock lets it join the layout again. Reset releases locks too, except in Puzzle."] },
          { id: "badge", q: "Put a badge on a corner", a: ["Select the product and open the Overlays tile.", "Click a corner on the drawing, then Load badge… and pick the artwork. It sits on its own layer, \"Assemblr overlays\", and follows the product when you move or resize it."] },
          { id: "price", q: "Show a price", a: ["Make your price design in InDesign, with X where the digits go, $X.XX or XXc, and save it in a folder of its own.", "In the Overlays tile, open a corner and click Load price…, then pick the folder.", "Type the price in the box, $12.50 say. Several designs in one folder: each price takes the one that fits it."] },
          { id: "every", q: "Give every product the same overlays", a: ["Choose Edit ▸ Deselect All. The Overlays tile now edits the Document.", "Set up its corners: every product follows them until you edit its own corner. Or, from a product, click Apply this corner to document."] },
          { id: "copy", q: "Copy a product", a: ["Duplicate or copy and paste it, its frame and images together. The copy is a new product of its own."] },
          { id: "apart", q: "Stop Assemblr touching a product, or take it apart", or: true, a: ["Disconnect leaves it exactly as it is until you Reconnect.", "Disassemble takes it apart for good: every image stays where it stands."] },
        ],
      },
      // Making the price designs Load price… reads, a large card (partials/panel-help.njk, the owner, 2026-11-02):
      // catalague-producer src/core/overlay/device.ts and PLAN.md D58 (2)–(3), D81 at HEAD.
      {
        id: "prices", label: "Price designs",
        items: [{
          id: "price-designs", q: "Make your price designs", art: "shared/price-devices",
          intro: "Each price design is an InDesign file of its own, kept with the others of its look in a folder. Load price… reads the folder as a set, and each price is drawn with the design that fits it.",
          points: [
            { name: "One file, one design", text: "Save each design as an .indd, .idml or .idms file. Build it as you like, on as many layers as it needs: a panel or a shape behind, images, and the text frames for the price. It is placed as one, on the product's corner, and follows the product." },
            { name: "Text mapping", text: "Type X where the digits go: $X.XX for dollars and cents, XXc for cents alone. Assemblr writes each price's digits into those runs only, so the $, the point, the c and every paragraph and character style round them stay as you set them; superscript cents stay superscript. No tagging needed." },
            { name: "The “each” under the price", text: "Words beside the price that change from product to product, “each” or “per kg”, go in a text frame of their own, tagged: the price then gets a box for them under it on each product's corner (The “each” under the price, below)." },
            { name: "A folder a set, a file a kind", text: "One folder holds a design for each kind of price: x-xx, xx-xx and xx-c side by side, $5.50 takes the first, $12.50 the second and 95c the third. Name a file for its shape to settle a design its text leaves open. Keep another look, a sale price say, in a folder of its own and load it as Set 2. Two designs of one shape and size in one folder clash, and neither is used." },
          ],
        }, {
          id: "price-unit", q: "The “each” under the price", art: "shared/unit-field", unitFrom: "corner",
          intro: "A price design can carry more than the price: the “each” or “per kg” under it, typed for each product on its corner, beside its price.",
          points: [
            { name: "In the design", text: "Type “each” in a text frame of its own, styled as it should print, and tag the frame in InDesign's Tags panel with a name of your own, Unit say (Name a text field in a price design, below). Tag the whole frame, not a run of its text." },
            { name: "On the corner", text: "Type a product's price and, once its design is chosen, a Unit box appears under it, named for the tag. Type “each”, “per kg” or “per 100 g”: each product keeps its own." },
            { name: "On the page", text: "The Unit replaces “each”, in the frame's styles: “$12.50 each”, “$4.99 per kg”. A product whose Unit box is left empty gets an empty frame, and the panel names it." },
            { name: "More than one", text: "Tag as many frames as the design needs, each with its own name: each gets its own box under the price." },
          ],
        }, {
          id: "price-tags", q: "Name a text field in a price design", wide: true,
          a: [
            "In the price design's file, put the words to be replaced, “each” say, in a text frame of their own, styled as they should print.",
            "Open Window ▸ Utilities ▸ Tags, choose New Tag from the panel's menu and name it for what the field holds: Unit. The name is the label of its box in the panel; a tag cannot hold a space, so use Unit_of_measure rather than Unit of measure.",
            "With the Selection tool, select the text frame and click the tag in the Tags panel. View ▸ Structure ▸ Show Tagged Frames colours a tagged frame, so you can see it took.",
            "Save the file in the set's folder, and choose Load price… with that folder again so Assemblr reads it.",
            "On a product's corner, type the price: the box named Unit appears under it. What you type there replaces the frame's text, in the frame's styles; left empty, the frame is empty.",
            "The price itself needs no tag. If a design's price is read wrongly, tag it the same way: the whole frame price, or select its digits with the Type tool and tag them dollars and cents.",
          ],
        }],
      },
      {
        id: "says", label: "When the panel says…",
        items: [
          { id: "why", q: "Assemble is greyed out", a: ["The line under it says why. Only placed images are assembled; an image already in a product, a locked image or one on a locked layer, a selection across two spreads, an image Automated Assemblr manages, or a locked or hidden Assemblr layer stops it. Unlock or show what it names and try again."] },
          { id: "held", q: "Laid out again once its images are deselected.", a: ["You are editing one of the product's images. Click away and it is laid out once."] },
          { id: "stale", q: "2 images changed on disk", a: ["Their files were saved again since they were measured. Click Update to read them again and lay the product out; locked or turned images are left as they are."] },
          { id: "disconnected", q: "Disconnected", a: ["Assemblr is leaving this product alone. Reconnect lays it out again with the images as they stand; Reset puts it back to the arrangement's automatic settings."] },
          { id: "dimmed", q: "A dimmed tile", a: ["The image is removed from the layout. + on the tile puts it back at the end of the row, or drag the tile in among the others to put it back at that spot. A tile that says File not found has lost its file on disk."] },
          { id: "layer", q: "A picture I placed did not join", a: ["It is on another layer. Move it onto the product's layer, \"Assemblr\", or add it with + in the strip."] },
          { id: "missing", q: "cannot be found, or a yellow triangle in Overlays", a: ["A badge or price file has moved or gone. The overlays already on the pages keep working; load the file again from its new place to use it on more products."] },
          { id: "clash", q: "'Price dollars' and 'Price dollars 2' are conflicting.", a: ["Two price designs of the same shape are in one folder, so neither can be chosen. Save each version in a folder of its own and load it with Load price…: each folder is a set of its own."] },
          { id: "slow", q: "Warning: High resolution setting active", a: ["InDesign redraws more slowly in High Quality Display, and with Overprint Preview on. Switch to View ▸ Display Performance ▸ Typical Display while you lay products out."] },
        ],
      },
    ],
  },
};
