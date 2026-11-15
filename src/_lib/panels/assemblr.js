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
  intro: "Assemblr works from one panel in InDesign: Plugins ▸ Assemblr. It has one tab, Products, with three tiles. Layout is for the product you are working on, Products lists every product in the document, and Overlays puts badges and price devices on a product's corners. Pick a tile to see it. Each number marks a part of the panel, and its note lights up when you point at it.",
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
    intro: "Assemble moves your images onto a layer of their own and draws an empty rectangle around them. That rectangle is the product. Move or resize it and the images and the badges on its corners follow.",
    steps: [
      { id: "layers", name: "Assemble", text: "Select a few placed images and click Assemble in the Layout tile. Assemblr adds a layer named \"Assemblr\" if the document doesn't have one yet, and moves the images onto it from whatever layer they were on. Nothing else moves. Behind the images it draws an empty rectangle around the space they took up. This is the product's frame. It has no fill and no stroke, so it doesn't print." },
      { id: "frame", name: "The frame", text: "You work the product by its frame. Move the frame and the images move with it, onto another page too. Drag a handle and the images fit the new size. To put the product on another layer, select it (click its name in the Products tile) and drag its square in the Layers panel to that layer. It works the same there, and images you place inside it on that layer join it. To see the frame, turn on View ▸ Extras ▸ Show Frame Edges." },
      { id: "shape", name: "Landscape to portrait", wide: true, hero: true, caption: "Drag the rectangle from landscape to portrait and Assemblr lays the six cans out again for the new shape. The badge and the price keep the same distance from its edges.", text: `These six cans are in Line-up, aligned on their middles (Align images: ${shape.settings.align}), ${shape.settings.angle ? `with the row rotated to ${shape.settings.angle}° and` : "in a level row (Angle 0), with"} Perspective at ${shape.settings.perspective} %, so each can is smaller than the one in front. They overlap by ${shape.from.overlap} % of their width. In landscape that makes the front can as tall as the rectangle (Size ${shape.settings.size} %). Drag the rectangle to portrait and Assemblr lays them out again for the new shape. The row keeps its ${shape.to.overlap} % overlap and is scaled down to fit the narrower rectangle, so it looks the same, only smaller (Size reads ${shape.settings.sizeTo} % there). The badge and the price device stay the same size and the same distance from the edges (Inset X and Y in the Overlays tile), so the margins match at any shape. Turn on Resize scale if you want them to grow with the product instead. They sit on their own layer, "Assemblr overlays", above the product's layer.` },
      { id: "modes", name: "Five arrangements", wide: true, text: "Pick one at the top of the Layout tile: Line-up, Grid, Mosaic, Pins or Puzzle. Each one lays the images out by their visible edges and ignores the empty space in their frames. Each keeps its own settings, so when you switch back they are as you left them. Every example here was laid out by Assemblr's own engine." },
      // The overlays (panel/assemblr/how-overlays.njk, the owner, 2026-11-11): a setup on each corner, its settings marked,
      // and Max size's one example, Ink ("a big feature that InDesign can't do"). catalague-producer D73 (pt, %), D90
      // (Resize scale), D91 (ink).
      { id: "overlays", name: "Overlays on the corners", wide: true, text: "In the Overlays tile, load badges and price devices onto any of the product's four corners. Each corner stacks its overlays from the corner, Across along the edge or Down the side. Gap sets the space between them, and Inset X and Y set their distance from the edges. With Resize scale on, the gap and insets grow and shrink with the product. Price devices use your own InDesign design, with the digits written in where you typed Xs. Each overlay fits inside its Max size, which you can set in three ways. In mm it is the same size on every product. In % it is a share of the image area's width and height. Ink is one number: the share of the image area each overlay covers, keeping its own shape. With Ink a badge has the same weight on every product, whatever the product's size or shape. InDesign can't do this on its own, because an object is either a fixed size or scales with its frame. Set the corners once for the document and every product follows, or give one product or one page its own corners." },
    ],
  },
  tabs: [
    {
      id: "products", label: "Products",
      summary: "Assemblr makes your placed images into products and lays each one out by the visible edges of its images, whatever size their frames are.",
      tiles: [
        {
          id: "product", label: "Layout", icon: ICONS.layout,
          summary: "Assemble the images you select, then set the selected product's arrangement, settings and images.",
          notes: [
            { name: "The drawing", text: "A drawing of the product above the card. Change it and the page updates when you let go. In Line-up, drag the end of the line around to rotate the row (it snaps to 5°; hold Option for 1°), and drag it out or in to set the row's size. Hold Shift to rotate only. Click one of the nine dots to choose where the product sits in its frame. Grid and Pins show bars for the space across and down, Mosaic shows a Rotation stepper for other packings, and Puzzle shows origin points for the images to rest against. A locked image is drawn dashed." },
            { name: "Assemble", text: "Shows when the selection holds placed images that aren't in a product yet. Assemble makes them one product in the space they took up, laid out as a grid with automatic columns, in one undo step. The images move onto a layer named \"Assemblr\". The product's frame is an empty rectangle around them that doesn't print; you move and resize the product by it. When Assemble can't run, the line under it says why." },
            { name: "Arrangements", text: "Line-up (one row with angle and perspective), Grid (rows and columns), Mosaic (scaled to fill the space), Pins (laid out like bowling pins) and Puzzle (tightly packed at equal area). Each one lays the images out by their visible edges and keeps its own settings, so when you switch back they are as you left them." },
            { name: "The product", text: "Shows the product's name, its page and how many images it holds. Products are named Product 1, Product 2 and so on. To rename one, type a new name here and press Return." },
            { name: "Align images, Angle, Size, Scale, Bleed", text: "Align images lines the images up on their top edges, middles or bottom edges. Angle rotates the row, up to 90° either way. Size sets how much of the space the row takes. Scale shrinks the whole arrangement inside its frame. Bleed adds a margin around the visible edges of each image, as a share of its size. Each arrangement shows only the settings it uses. Grid has columns and rows (leave them empty for automatic) and Space across and down, which overlap below 0. Mosaic and Puzzle have Breathing space. Pins has a slider from Rack to Pyramid, and Add row and Remove row. Click a box's chevron to open a slider under it." },
            { name: "Add clipping path to alpha", text: "Clips each image to the outline of its transparency, so nothing outside the cut-out shows." },
            { name: "Perspective", text: "In Line-up and Pins, makes the far images smaller, as if the row went back into the page. At 0 every image is the same size." },
            { name: "Re-fit", text: "Lays the images out again with these settings. In Puzzle it fits them again around the images you placed by hand and the locked ones." },
            { name: "Reset", text: "Puts the product back to this arrangement's automatic settings. Sizes are made equal and hand rotation and shear are cleared. Locks are kept in Puzzle and released in the other arrangements. Images you removed from the layout stay out. One undo step." },
            { name: "Clear transformations", text: "Shows once you have rotated or scaled an image by hand. It sets those images upright at an automatic size and crop, and lays them out again. The settings and locks stay. One undo step." },
            { name: "Swap order", text: "Brings the other end of the row to the front where the images overlap. In Grid it shows once a space is below 0, and sets whether the upper or the lower rows sit on top." },
            { name: "Disassemble", text: "Takes the product apart. Its frame is deleted, and every image stays where it is, on the Assemblr layer." },
            { name: "Disconnect", text: "Stops Assemblr laying this product out, so your edits stay exactly as they are. Its controls dim until you click Reconnect, which lays it out again with the images as they stand and keeps sizes you set by hand. Reset reconnects it too." },
            { name: "Images", text: "Shows the product's images in order, each tile with the image and its file type. Drag a tile to reorder, or drag it into another product's strip to move the image there. × removes an image from the layout: the image leaves the page and its tile stays, dimmed. + on that tile puts it back at the end of the row. The + tile adds image files from disk. A tile marked GROUP is an InDesign group, laid out as one image." },
          ],
        },
        {
          id: "products", label: "Products", icon: ICONS.catalogue,
          summary: "Lists every product in the document page by page, with its images, so you can move images between products.",
          notes: [
            { name: "Products", text: "Shows how many products the document has. The product you are working on is in bold." },
            { name: "Product name", text: "Selects the whole product on the page: its frame, its images and its overlays. The Layout tile then shows it." },
            { name: "Tags", text: "Show the product's image count. Locked and a number appear when some of its images are locked with Object ▸ Lock; those stay put when it is laid out again. Disconnected appears while Assemblr is leaving the product alone; select it to Reconnect or Reset." },
            { name: "Disassemble", text: "Takes the product apart. Its frame is deleted, and every image stays where it is." },
            { name: "+", text: "The last tile in every strip. It adds image files from disk to that product without selecting it first." },
            { name: "Images", text: "Drag a tile from one product's strip into another's and the image moves to that product. Both products are laid out again. A dimmed tile is an image removed from the layout, and its + puts it back. A disconnected product's strip is dimmed and you can't drop tiles on it." },
            { name: "Pages", text: "A divider names each page as the list reaches it: Page 3, Pages 4-5 for a product across the spine, and Pasteboard for a product off the pages. It is only a heading." },
          ],
        },
        {
          id: "overlays", label: "Overlays", icon: ICONS.overlays,
          summary: "Put badges and price devices on a product's corners, for one product, some pages or the whole document.",
          notes: [
            { name: "The drawing", text: "Shows the product's image area at its own shape, with a control on each corner: a dot where the corner has overlays, a plus where it has none. Click one to open that corner. The open corner and its overlays are blue. A box drawn in orange was set by this product or page itself." },
            { name: "Where it applies", text: "With a product selected, this reads Product: and its name, and your changes apply to that product alone. Click it off to edit its page instead. With no product selected, it reads Document, which every product follows until it has a corner of its own. There is also a chip for each page: turn a page on to give it its own overlays, which the page keeps when products move." },
            { name: "The corner", text: "Shows the open corner and what is on it, each item with × to take it off. A product's corner follows the document until you give it its own. Apply document setting drops the product's own setting and shows the document's again, keeping the product's price." },
            { name: "Price", text: "Type the product's price, such as $12.50. Assemblr writes its digits into your own price design and keeps the design's styles. Each product has its own price. A design with another field, such as Unit, gets a box of its own under the price." },
            { name: "Load badge… and Load price…", text: "Bring new artwork into the document. Load badge… takes any file InDesign can place, such as PNG, PSD, PDF or AI. Load price… takes a folder of InDesign files with X where the digits go, such as $X.XX or XXc. No tagging is needed, and each price uses the design that fits it." },
            { name: "The document's overlays", text: "Each badge and price set already in the document shows as a + chip. Click one to put it on this corner." },
            { name: "Apply this corner", text: "To page copies this corner to every other product on this page. To document makes it the document's corner, for every product that follows the document. Each product keeps its own price." },
            { name: "Corner and Stack", text: "The four corners again. Click another corner to move this corner's overlays there, or to swap them with what is already there; they keep their settings. Stack lines them up along the corner's top or bottom edge (Across) or its side (Down)." },
            { name: "Size and spacing", text: "Gap sets the space between overlays, and Inset X and Y set their distance from the image area's edges, in the document's ruler units. With Resize scale on, they resize with the product. Each overlay fits within a Max width and Max height, in mm or as a % of the product's image area." },
            { name: "Reports", text: "Reports what happened when the overlays were placed, for example \"Overlays: 3 placed, 0 removed.\" A yellow triangle marks a problem, such as a badge that couldn't be loaded or a price that no design fits." },
            { name: "In this document", text: "Lists every badge and price set in the document. × removes one from the list and from every product. A set lists its designs and the price shape each one takes, such as $X.XX. A file marked cannot be found keeps working on the pages, from the copy saved in the document." },
          ],
        },
      ],
    },
  ],
  help: {
    intro: "Step-by-step instructions for the everyday jobs, and what to do when the panel shows a message. Every action in Assemblr is one step of Edit ▸ Undo.",
    groups: [
      {
        id: "how", label: "How do I…",
        items: [
          { id: "assemble", q: "Make a product", a: ["Place a few images with transparency, such as PSD or PNG cut-outs, anywhere on one spread.", "Select them and open Plugins ▸ Assemblr.", "Click Assemble in the Layout tile. The images become one product in the space they took up, laid out as a grid."] },
          { id: "arrange", q: "Change how it is arranged", a: ["Select the product: click one of its images, or its name in the Products tile.", "Pick Line-up, Grid, Mosaic, Pins or Puzzle at the top of the Layout tile.", "Drag the drawing or change a setting. The page updates when you let go."] },
          { id: "resize", q: "Make a product bigger or smaller", a: ["Turn on View ▸ Extras ▸ Show Frame Edges.", "With the Selection tool, click the edge of the product's frame, the empty rectangle around its images.", "Drag a handle and the images fit the new size. Drag the frame and they move with it, onto another page too."] },
          { id: "add", q: "Add an image", or: true, a: ["Click + at the end of the product's images and pick the files.", "Or place or drag an image so its centre is inside the product's frame, on the product's layer (\"Assemblr\"). An image on another layer is left alone, so a logo can sit over a product.", "Or drag its tile from another product's images in the Products tile."] },
          { id: "remove", q: "Take an image out", or: true, a: ["Click × on its tile to remove it from the layout. The tile stays, dimmed, and + puts the image back.", "Drag it out of the product's frame and Assemblr leaves it alone from then on. Its tile dims.", "Delete it and it leaves the product completely."] },
          { id: "edit", q: "Move, scale, rotate or crop an image by hand", a: ["Edit the image as usual. Assemblr waits while it is selected.", "Click away and the product is laid out once. A crop is always kept. Scale and rotation are kept in Line-up, Grid and Puzzle, and a moved image goes back to its place. The panel says what wasn't kept.", "To undo the rotation and scaling, click Clear transformations in the Layout tile."] },
          { id: "lock", q: "Keep one image where it is", a: ["Select it and choose Object ▸ Lock. The others fit around it.", "Object ▸ Unlock lets it join the layout again. Reset releases locks too, except in Puzzle."] },
          { id: "badge", q: "Put a badge on a corner", a: ["Select the product and open the Overlays tile.", "Click a corner on the drawing, then Load badge… and pick the artwork. It sits on its own layer, \"Assemblr overlays\", and follows the product when you move or resize it."] },
          { id: "price", q: "Add a price device", a: ["Make your price design in InDesign, with X where the digits go ($X.XX or XXc), and save it in a folder of its own.", "In the Overlays tile, open a corner and click Load price…, then pick the folder.", "Type the price in the box, such as $12.50. If the folder holds several designs, each price uses the one that fits it."] },
          { id: "every", q: "Give every product the same overlays", a: ["Choose Edit ▸ Deselect All. The Overlays tile now edits the Document.", "Set up its corners. Every product follows them until you edit that product's own corner. Or, from a product, click Apply this corner to document."] },
          { id: "copy", q: "Copy a product", a: ["Duplicate it, or copy and paste its frame and images together. The copy is a new product."] },
          { id: "apart", q: "Stop Assemblr changing a product, or take it apart", or: true, a: ["Disconnect leaves it exactly as it is until you click Reconnect.", "Disassemble takes it apart for good. Every image stays where it is."] },
        ],
      },
      // Making the price designs Load price… reads, a large card (partials/panel-help.njk, the owner, 2026-11-02):
      // catalague-producer src/core/overlay/device.ts and PLAN.md D58 (2)–(3), D81 at HEAD.
      {
        id: "prices", label: "Price designs",
        items: [{
          id: "price-designs", q: "Make your price designs", art: "shared/price-devices",
          intro: "Each price design is a separate InDesign file, kept in a folder with the other designs in the same style. Load price… reads the folder as a set, and each price uses the design that fits it.",
          points: [
            { name: "One file, one design", text: "Save each design as an .indd, .idml or .idms file. Build it however you like, on as many layers as it needs: a panel or shape behind, images, and the text frames for the price. It is placed as one object on the product's corner and follows the product." },
            { name: "Text mapping", text: "Type X where the digits go: $X.XX for dollars and cents, XXc for cents only. Assemblr writes the digits into those Xs only, so the $, the point, the c and every paragraph and character style around them stay as you set them. Superscript cents stay superscript. No tagging is needed." },
            { name: "The “each” under the price", text: "Words next to the price that change from product to product, such as “each” or “per kg”, go in a separate, tagged text frame. Each product's corner then gets a box for them under the price (see The “each” under the price, below)." },
            { name: "One folder per set, one file per price shape", text: "One folder holds a design for each price shape. With x-xx, xx-xx and xx-c side by side, $5.50 uses the first, $12.50 the second and 95c the third. If a design's text could fit more than one shape, name the file for the shape it is meant for. Keep a different style, such as a sale price, in a folder of its own and load it as Set 2. If one folder has two designs of the same shape and size, they clash and neither is used." },
          ],
        }, {
          id: "price-unit", q: "The “each” under the price", art: "shared/unit-field", unitFrom: "corner",
          intro: "A price design can include more than the price, such as “each” or “per kg” under it. You type it for each product on its corner, next to its price.",
          points: [
            { name: "In the design", text: "Type “each” in a separate text frame, styled as it should print. Tag the frame in InDesign's Tags panel with a name of your own, such as Unit (see Name a text field in a price design, below). Tag the whole frame, not some of its text." },
            { name: "On the corner", text: "Type a product's price. Once its design is chosen, a Unit box named after the tag appears under it. Type “each”, “per kg” or “per 100 g”, and each product keeps its own." },
            { name: "On the page", text: "The Unit replaces “each” in the frame's styles: “$12.50 each”, “$4.99 per kg”. If a product's Unit box is left empty, its frame is empty, and the panel names the product." },
            { name: "More than one", text: "Tag as many frames as the design needs, each with its own name. Each one gets its own box under the price." },
          ],
        }, {
          id: "price-tags", q: "Name a text field in a price design", wide: true,
          a: [
            "In the price design's file, put the words to be replaced, such as “each”, in a separate text frame, styled as they should print.",
            "Open Window ▸ Utilities ▸ Tags, choose New Tag from the panel menu and name it for what the field holds, such as Unit. The name becomes the label of its box in the panel. A tag name can't contain spaces, so use Unit_of_measure rather than Unit of measure.",
            "With the Selection tool, select the text frame and click the tag in the Tags panel. To check it worked, turn on View ▸ Structure ▸ Show Tagged Frames, which colours tagged frames.",
            "Save the file in the set's folder, then choose Load price… with that folder again so Assemblr reads it.",
            "On a product's corner, type the price and the Unit box appears under it. What you type there replaces the frame's text, in the frame's styles. If you leave it empty, the frame is empty.",
            "The price itself doesn't need a tag. If Assemblr reads a design's price wrongly, tag it the same way: tag the whole frame price, or select its digits with the Type tool and tag them dollars and cents.",
          ],
        }],
      },
      {
        id: "says", label: "When the panel says…",
        items: [
          { id: "why", q: "Assemble is greyed out", a: ["The line under it says why. Assemble works only on placed images. It stops for an image that is already in a product, a locked image or one on a locked layer, a selection across two spreads, an image Automated Assemblr manages, or a locked or hidden Assemblr layer. Unlock or show what it names and try again."] },
          { id: "held", q: "Laid out again once its images are deselected.", a: ["You are editing one of the product's images. Click away and the product is laid out once."] },
          { id: "stale", q: "2 images changed on disk", a: ["Their files have been saved again since Assemblr measured them. Click Update to read them again and lay the product out. Locked or rotated images are left as they are."] },
          { id: "disconnected", q: "Disconnected", a: ["Assemblr is leaving this product alone. Reconnect lays it out again with the images as they stand; Reset puts it back to the arrangement's automatic settings."] },
          { id: "dimmed", q: "A dimmed tile", a: ["The image is removed from the layout. + on the tile puts it back at the end of the row, or drag the tile in among the others to put it back at that spot. A tile that says File not found has lost its file on disk."] },
          { id: "layer", q: "An image I placed didn't join the product", a: ["It is on another layer. Move it onto the product's layer, \"Assemblr\", or add it with + in the strip."] },
          { id: "missing", q: "cannot be found, or a yellow triangle in Overlays", a: ["A badge or price file has been moved or deleted. The overlays already on the pages keep working. To use it on more products, load the file again from its new location."] },
          { id: "clash", q: "'Price dollars' and 'Price dollars 2' are conflicting.", a: ["One folder has two price designs of the same shape, so neither can be chosen. Save each version in its own folder and load it with Load price…. Each folder becomes a separate set."] },
          { id: "slow", q: "Warning: High resolution setting active", a: ["InDesign redraws more slowly in High Quality Display, and with Overprint Preview on. Switch to View ▸ Display Performance ▸ Typical Display while you lay products out."] },
        ],
      },
    ],
  },
};
