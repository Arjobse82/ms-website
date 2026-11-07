// Automated Assemblr's panel, explained (src/_data/panels.js): its words are the plugin's own tooltips and notes
// (catalague-producer src/ui/main.ts, src/core/page/fit.ts). Drawings: src/_includes/panel/catalogue-producer/.
import { ICONS } from "../panel-icons.js";
import { catalogueArt } from "../catalogue-art.js";

export default {
  name: "Automated Assemblr",
  // The hero's catalogue spread and How it works's drawings (src/_lib/catalogue-art.js).
  art: catalogueArt(),
  // How it works, a section after the statement (partials/panel-how.njk), each step a drawing,
  // src/_includes/panel/catalogue-producer/how-<id>.njk. Its words are the panel's notes below and PLAN.md's: matching
  // and Check (D51), the build area inside the margins (§5), inserts (D53) and tables (D54), the strip (src/ui/strip.ts).
  how: {
    heading: "From brief to catalogue, and back",
    intro: "How Automated Assemblr turns an Excel brief and your folders of images into catalogue pages, and keeps the two in step.",
    steps: [
      { id: "brief", name: "Built from your brief", wide: true, text: "The Excel brief is the catalogue, one row a product. Each product's images are found in your folders by the code in the file or folder name, or by the product's name, a near match marked Check for you to confirm, and laid out in its cell; its copy is written from the brief's columns, in your paragraph styles. Product and row stay tied: an edit on either side, a new price in the brief or a renamed product on the page, is listed in Changes, to take whichever way you choose." },
      { id: "grid", name: "Pages on a live grid or no grid", text: "Every page is built on a grid: products across and down, and the gap between them, set in Setup ▸ Pages. Change it and Apply changes builds the pages again in one undo step, the products flowing on in the brief's order. Cells can be joined, across and down: here the Party pack takes the width of the page, Sparkling water two cells across and two down, and Lemon soda two across, and the products round them flow on. On Auto a short page gets a smaller grid, and a page break starts a new page wherever a column of the brief changes. Set a page to Free and it is yours to arrange: each product is placed once and never moved again, and its images are still laid out for its cell, wherever you put it and whatever its size." },
      { id: "product", name: "Products managed by Assemblr layout engine", link: { href: "/indesign/assemblr/", label: "More on Assemblr" }, text: "Each product is a cell: an image area over its copy. In the image area Assemblr's layout engine arranges the images by what you can see in them, in Line-up, Grid, Mosaic, Pins or Puzzle, and Copy fitting gives the copy the room it needs and the image area the rest. Badges and prices go on its corners, each price written into your own price design. Drag an image into a cell and it joins the product, arranged with the rest; copy you edit on the page is kept until you choose to overwrite it." },
      { id: "margins", name: "Inside your margins, with inserts", text: "The grid fills each page inside its margins, inside and outside swapped on facing pages, on the parent pages you choose. Anything that is not a product goes in as an insert: an InDesign file, a PDF, any image InDesign places, or a table filled from its own sheet and styled by a design you draw. It takes a full page, with or without bleed, half or a quarter of one, or any block of cells; it keeps its place in the product order or is pinned to a page, and the products flow round it. The panel tells you what size to make the file." },
      { id: "list", name: "The product list", text: "Every product in the brief, in page order. Drag a product to move it: the pages are built again in the new order, and Changes lists how it now differs from the spreadsheet. Or work inside a product: drag its images to change their order, drag one in from another product or from the files no product matched, take one out with × or add one with +. ¶ starts a new page before a product, and + adds an insert after it." },
    ],
  },
  intro: "Automated Assemblr works from one panel in InDesign, in three tabs: Setup, Products and Changes. In each, pick a tile to see its settings; each number says what a setting does, and the note beside it lights up as you point at it.",
  tabs: [
    {
      id: "setup", label: "Setup",
      summary: "Where the catalogue comes from, and how its pages are built.",
      tiles: [
        {
          id: "folders", label: "Folders", icon: ICONS.folders,
          summary: "Where the catalogue comes from: the brief, the folders of images, and how each file finds its product.",
          notes: [
            { name: "Brief", text: "The Excel workbook the catalogue is built from, one row per product. Change… picks another; anything it cannot use is listed as a warning." },
            { name: "Image folders", text: "The folders your packshots live in, and how many files each holds. A folder that has gone missing says so." },
            { name: "Analyse links", text: "Reads the brief and the folders again and matches the files to products. Nothing on the pages changes until you apply it in Changes." },
            { name: "Place images", text: "Puts every product's images on its page and re-fits them all, in steps you can stop; one undo step. Update reads changed files again and re-fits their products, leaving locked or turned images as they are." },
            { name: "Matching", text: "The ways a file can find its product: the product code in the file name, in the folder name, or the product's name. Untick a way to stop using it, and drag to choose which one wins when two disagree: the higher one decides." },
            { name: "Low confidence", text: "Files matched only by a name that looks alike are placed but marked Check, so you confirm each one on its product." },
            { name: "Prefer file types", text: "When one image is in the folders as both a PSD and a TIF, keep only this type." },
          ],
        },
        {
          id: "pages", label: "Pages", icon: ICONS.pages,
          summary: "How the pages are built: the grid each page gets, how many pages, their parent pages and where a new page starts.",
          notes: [
            { name: "Grid: Auto or Consistent", text: "Auto: a page with fewer products gets a smaller grid, its cells the shape of a full page's. Consistent: every page gets the grid you set, and a short page keeps its empty slots." },
            { name: "Across, Down and Gap", text: "Products across and down a page, and the space between them in points. Left on auto, they follow from the number of products." },
            { name: "Copy height", text: "The share of each cell the copy takes, under its image area." },
            { name: "Page count", text: "How many pages the catalogue runs to (auto gives it as many as it needs), and the page it starts on." },
            { name: "Masters", text: "The parent pages the left-hand and right-hand pages are built on." },
            { name: "Page breaks", text: "A brief column, a category say: a new page starts wherever its value changes." },
            { name: "Apply changes", text: "The settings are a draft until Apply changes builds the pages with them, in one undo step. Discard throws them away; nothing is written." },
          ],
        },
        {
          id: "copy", label: "Copy", icon: ICONS.copy,
          summary: "What each product's copy says, from which columns of the brief, in which paragraph styles.",
          notes: [
            { name: "Copy fitting", text: "Off: every cell splits at the same height, whatever its text. Per product: each cell's copy takes what it needs and the image area gets the rest. Match the row: every cell in a row takes the row's largest copy height, so the captions all start level, as most printed catalogues do." },
            { name: "Fields", text: "A row for each column of the brief: tick it to show it in the copy, and use the arrows to change the order." },
            { name: "How each field starts", text: "On a new paragraph, after a line break, a space or a tab, in the paragraph style you choose." },
            { name: "Paragraph styles", text: "Automatic finds the document's style with the field's name. With none, Create style makes it; a style found by a near name waits for you to confirm it." },
            { name: "Leave out empty fields", text: "A product with nothing in a column gets no empty line for it." },
            { name: "Write copy", text: "Writes every product's copy from the brief. Copy edited in InDesign is counted and kept until you choose to overwrite it." },
          ],
        },
        {
          id: "tables", label: "Tables", icon: ICONS.tables,
          summary: "Price lists and spec tables, each filled from its own sheet and styled by a design you draw in InDesign.",
          notes: [
            { name: "Table Setup", text: "A parent page that holds your table designs. Show turns the window to it, and the panel warns you if it is applied to a page that prints." },
            { name: "Designs", text: "A table drawn in InDesign, a header row and one sample row: its columns, styles and strokes are what every table that follows it gets. Use selection as design adds the one you have selected." },
            { name: "Tables", text: "Each table comes from a sheet and follows a design. The panel lists the cells that change and the rows added or removed, and keeps any cell you edited by hand." },
            { name: "Problems, said plainly", text: "A design with no sample row, or a table taller than its frame, is named with what to do about it." },
            { name: "Refresh tables", text: "Reads every table's sheet and design and lists what would change. Nothing changes until you apply it, table by table or all at once." },
          ],
        },
      ],
    },
    {
      id: "products", label: "Products",
      summary: "Each product: how its images are laid out, what goes on its corners, and where it stands in the catalogue.",
      tiles: [
        {
          id: "layout", label: "Layout", icon: ICONS.layout,
          summary: "How the selected product's images are arranged, by what you can see in them rather than their frames: Assemblr's layout engine, inside the catalogue.",
          notes: [
            { name: "The drawing", text: "The product drawn over the panel: drag the line's end to turn the row and set its size, and pick a dot to choose the edge or corner the product holds to." },
            { name: "Arrangements", text: "Line-up, Grid, Mosaic, Pins and Puzzle: five ways to lay out a product's images, each fitted to the visible subject of every image." },
            { name: "The product", text: "The product the selection is in, its page, and its images. Select them all picks every frame it is made of." },
            { name: "Settings", text: "Align images, Angle, Size, Scale, Bleed, Perspective and a clipping path from each image's transparency, as each arrangement has them." },
            { name: "Apply to page, Apply to all", text: "Give every product on this page, or in the catalogue, these settings." },
            { name: "Re-fit and Reset", text: "Re-fit lays the images out again. Reset puts the product back to the arrangement's automatic settings, hand rotation cleared and locks released, in one undo step; Reset page and Reset all do the same wider." },
            { name: "Images", text: "The product's images in order. Drag to reorder, click one to leave it out, + to add one; Unassigned files lists the files that matched no product." },
          ],
        },
        {
          id: "overlays", label: "Overlays", icon: ICONS.overlays,
          summary: "Badges and prices on the corners of a product, from a folder of artwork or a column of the brief.",
          notes: [
            { name: "Where it applies", text: "One product, wherever it goes; a range of pages; or the whole document. A product follows the document until you give it its own." },
            { name: "Corner and Stack", text: "Pick a corner, on the drawing or here; its overlays stack across or down from it. Click another corner to move them there, or swap them with what is there." },
            { name: "Sources", text: "What goes on the corner: badges from the overlays folder, or + Column, a column of the brief whose cells name what goes there." },
            { name: "Size and spacing", text: "Gap and Inset X and Y in points, or scaled with the product by Resize scale; each overlay fitted into a Max width by Max height, in points or as a share of the product." },
            { name: "Overlays folder", text: "One folder of artwork: badges, and price devices, InDesign files the plugin writes each product's price into." },
            { name: "Price sets", text: "Another folder of price devices, another look for the prices. Each corner with a price chooses the set it is drawn from." },
          ],
        },
        {
          id: "catalogue", label: "Catalogue", icon: ICONS.catalogue,
          summary: "Every product in the brief, in page order, each with where it stands.",
          notes: [
            { name: "No image", text: "Shows only the products still waiting for an image." },
            { name: "Order", text: "Drag a product to reorder it: the pages are rebuilt in the new order, and Changes lists the difference from the spreadsheet." },
            { name: "Where each product stands", text: "Its page, its images placed or added, copy overset, an image changed on disk (Update), on the pasteboard, or edited in InDesign." },
            { name: "Check", text: "A file matched only by a name that looks alike waits on its product until you say Looks right or Not this product." },
            { name: "Breaks and inserts", text: "¶ starts a new page before a product; + adds an insert after it, an advert or a table, from an INDD, a PDF or an image." },
          ],
        },
        {
          id: "grid", label: "Grid", icon: ICONS.grid,
          summary: "The selected page's grid, and how many slots each product on it takes.",
          notes: [
            { name: "Managed or Free", text: "Managed: the plugin keeps this page on its grid. Free: you arrange the page, and the plugin leaves it alone." },
            { name: "The page", text: "The page drawn as its grid, each product in its slots. Set… opens this page's own grid and spacing in Setup ▸ Pages." },
            { name: "Size", text: "Give a product more than one slot, a 2 × 2 hero say, and the products round it flow on. One slot puts it back." },
          ],
        },
      ],
    },
    {
      id: "changes", label: "Changes",
      summary: "The brief and the document kept in step both ways: what changed on which side, and which way each change should go.",
      tiles: [
        {
          id: "changes", label: "Changes",
          summary: "The brief and the document kept in step both ways: what changed on which side, and which way each change should go.",
          notes: [
            { name: "Check", text: "Reads the spreadsheet again and compares it with the pages; the tables' sheets are read too." },
            { name: "Apply spreadsheet changes", text: "Brings every edit made in the brief into the document." },
            { name: "Write InDesign edits to spreadsheet", text: "Copies edits made on the pages, a renamed product or a new price, back to the brief. Write everything lets the document win." },
            { name: "One change at a time", text: "Each difference shows both sides. Update document, Write to spreadsheet or Use spreadsheet takes it one way or the other, and × dismisses it until either side changes again." },
            { name: "Changed in both", text: "When the brief and the page both changed the same thing, both are shown and you choose." },
            { name: "Pages and images", text: "Products not on the pages yet, an order that differs, a page that overflows, files that now match another product: each listed with what Apply will do." },
            { name: "When it cannot finish", text: "It says why, and what to do: the brief is open in Excel, close it and try again." },
          ],
        },
      ],
    },
  ],
  // Quick help (partials/panel-help.njk), so far one large card: making the price devices the plugin writes each
  // product's price into (the owner, 2026-11-02). catalague-producer src/core/overlay/device.ts, docs/price-sets.md and
  // PLAN.md D81, D85 at HEAD.
  help: {
    intro: "What the settings alone do not tell you.",
    groups: [{
      id: "prices", label: "Price devices",
      items: [{
        id: "price-devices", q: "Make your price devices", art: "shared/price-devices",
        intro: "Each price device is an InDesign file of its own, kept in the overlays folder or in a folder of its own as a price set. Automated Assemblr writes each product's price from the brief into the device that fits it.",
        points: [
          { name: "One file, one device", text: "Save each device as an .indd, .idml or .idms file. Build it as you like, on as many layers as it needs: a panel or a shape behind, images, and the text frames for the price. It is placed as one, on the product's corner, and follows the product." },
          { name: "Text mapping", text: "Type X where the digits go: $X.XX for dollars and cents, XXc for cents alone. Each product's price is written into those runs only, so the $, the point, the c and every paragraph and character style round them stay as you set them; superscript cents stay superscript. No tagging needed." },
          { name: "More fields from the brief", text: "Tag a text frame, or a run of its text, with the name of a column of your brief, Unit say, in InDesign's Tags panel: each product's value in that column is written there. A tag that names no column is left as you typed it." },
          { name: "A folder a set, a file a kind", text: "One folder holds a device for each kind of price: x-xx, xx-xx and xx-c side by side, $5.50 takes the first, $12.50 the second and 95c the third. Name a file for its shape to settle a device its text leaves open. Keep another look, a sale price say, in a folder of its own: Add price set… makes it Set 2, and each corner with a price chooses its set, for the document, a range of pages or one product. Two devices of one shape and size in one folder clash, and neither is used." },
        ],
      }],
    }],
  },
};
