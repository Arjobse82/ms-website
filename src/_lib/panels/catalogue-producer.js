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
    // The hero's spread, made as you scroll (panel/catalogue-producer/build.njk): the empty spread held at the top of
    // the window, the panel's settings scrolling under it, each step adding what it sets to the pages. A step's `cap`
    // names the spread at that step; its drawing is build-<id>.njk.
    build: {
      start: { cap: "Pages 2 and 3, empty", name: "An empty spread", text: "A new document: two facing pages on your parent pages, their margins and nothing else. Scroll, and build the spread at the top of this page, one setting at a time." },
      steps: [
        { id: "pages", cap: "A 3 × 3 grid inside the margins", name: "Set the grid", text: "In Setup ▸ Pages: three across, three down and 12 pt between, inside each page's margins, inside and outside swapped on facing pages. Apply changes builds the pages." },
        { id: "grid", cap: "Cells joined", name: "Join cells", text: "In the Grid tile, give a product more than one slot: the Party pack the width of the page, the Mixed case two across and two down. Two rows are kept for inserts, and the products round them flow on." },
        { id: "folders", cap: "Images placed", name: "Place the images", text: "Point it at the brief and your image folders. Each file finds its product by the code in its name, and Place images puts it in the product's cell, laid out by Assemblr's engine." },
        { id: "copy", cap: "Copy written", name: "Write the copy", text: "Pick the brief's columns for the copy and the paragraph style each starts in. Write copy fills every cell, and Match the row starts the captions level." },
        { id: "layout", cap: "Products arranged", name: "Arrange a product", text: "Select a product and set its arrangement: the Party pack in Line-up with perspective, the Mixed case in Pins, three rows of two. The images move; the cell stays." },
        { id: "overlays", cap: "Badges and prices on the corners", name: "Badges and prices", text: "Put overlays on a product's corners: a NEW badge top right, and bottom left a price device, the price written from the brief into your own InDesign design." },
        { id: "inserts", cap: "Inserts in, the spread made", name: "Add the inserts", text: "Anything that is not a product goes in as an insert: a PDF advert across the top of page 3, and a price list filled from its own sheet and styled by a table you drew." },
        // Then the spread edited (catalogue-art.js `build`, steps 8 to 12). `group` heads the first of them.
        { id: "swap", group: "Then edit it", cap: "Cola and Duo pack swapped", name: "Swap two products", text: "Drag a product in the Catalogue tile onto another: the Cola and the Duo pack change cells, each with its images, its copy and its corners. Changes lists the new order against the brief." },
        { id: "images", cap: "Two images swapped", name: "Swap a product's images", text: "In a product's strip of images, drag one onto another: the Mixed case's first and last change places, and the engine lays the arrangement out again round them." },
        { id: "hide", cap: "Lemon soda hidden", name: "Hide a product, show it again", text: "Hide a product and it leaves the pages, the products after it flowing up: Ginger beer comes up from the next page into its cell. Show it, and it goes back in its place in the brief's order." },
        { id: "size", cap: "Sparkling water 1 × 2", name: "Change a cell's size", text: "Give a product a bigger or a smaller cell: Sparkling water one across and two down. Its image is laid out again for the new shape, and Ginger beer flows on to the next page." },
        { id: "overlay-size", cap: "A bigger price device", name: "Size an overlay your own way", text: "Each corner sets its own size: a Max width and a Max height in points, or as a share of the product. The Party pack's price device goes to 96 pt; every other product keeps its own." },
      ],
    },
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
            { name: "Price sets", text: "The overlays folder holds one price set; each additional price device style is a folder of its own, Set 1, Set 2. Each corner with a price chooses the set it is drawn from." },
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
  // Quick help (partials/panel-help.njk): the overlay folders and their price sets (the owner, 2026-11-13), making the
  // price devices the plugin writes each product's price into (the owner, 2026-11-02), and tagging a device's text
  // frame for a brief column (the owner, 2026-11-13). catalague-producer src/core/overlay/device.ts (`readDevice`: a
  // column's tag on a whole frame only), src/core/overlay/sets.ts, docs/price-sets.md and PLAN.md D81, D85 at HEAD.
  // Reading a column's name from the frame's text, no tag, is noted for the next release (docs/next-release.md item 1).
  // Prepare your files and folders (the owner, 2026-11-13: "start the help page on how the user needs to prepare their
  // files and folders"): the help page's first section (partials/help-page.njk), its cards drawn by panel-help.njk, and
  // the Quick help's groups after them (`withHelp`), so the help page shows the price cards once, here. The rules are
  // catalague-producer's at HEAD: src/core/brief/header.ts (ROLE_ALIASES, EXACT_ONLY_ALIASES, the header in the first 30
  // rows), brief.ts (a code column required; a row without a code skipped; merged cells; formulas), price/parse.ts,
  // match/match.ts (defaultCriteria, MIN_FILE_KEY / MIN_FOLDER_KEY 5, trailingVariant), match/files.ts
  // (EXCLUDED_FOLDERS, pickNewest), match/belt.ts (imageOrder, cellKeys, preferType), image/format.ts, overlay/names.ts,
  // host/files/folders.ts (cloud placeholders), host/store/xlsx-store.ts (Excel's lock file).
  prepare: {
    heading: "Prepare your files and folders",
    intro: "Before you open the panel: one Excel brief, your images named by product code, and a folder of badges and price artwork. Keep a job's files together, and the plugin finds the rest.",
    withHelp: true,
    groups: [{
      id: "job", label: "Your job's files",
      items: [{
        id: "job-folders", q: "Lay out a job's folders", art: "catalogue-producer/job-folders",
        intro: "One folder a job holds everything the catalogue is built from. Each part is linked once in the panel, by the button beside it in the drawing, and read again whenever you build or check.",
        points: [
          { name: "The brief", text: "An Excel workbook, one row a product, with a product code column. Link brief… in the Folders tile links it; it is what the pages are built from, and edits on the pages can be written back to it." },
          { name: "Image folders", text: "Your packshots, each named with its product's code, in as many folders as you like: Add folder… links each one, and its subfolders are searched too." },
          { name: "The overlays folder", text: "Badges, and one price set only: one InDesign file for each kind of price. Choose folder… in Overlays links it (Set up your overlay folders, below)." },
          { name: "Additional price device styles", text: "Optional: every other style of price device goes in a folder of its own, one price set a folder. Add price set… links the first as Set 1." },
        ],
      }, {
        id: "prepare-brief", q: "Prepare the brief", wide: true,
        a: [
          "Save it as an Excel workbook (.xlsx). From Numbers or Google Sheets, export or download it as .xlsx. The first sheet is read unless you choose another.",
          "One row a product, under a row of column headers. Title rows above the headers are fine, within the first 30 rows.",
          "Give it a product code column, the one column it needs: headed Product code, Code, SKU, SAP, Article or Item. A row with no code, a section title say, is skipped. The code is the product: change it and it is a new product.",
          "Name, Description, Price, Page and Hero are found by their headers (Product name or Title; Description or Desc; Price, RRP, Retail price or Cost; Page or Pg; Hero or Featured). Every other column, Pack or Unit say, is read under its own header, for you to show as copy or use for overlays.",
          "One price a cell: $12.50, 12.5, 99c, €4,99 and AUD 12.50 all read. A cell the plugin cannot read as one price, 2 for $5 say, is reported.",
          "A badge column names files in the overlays folder: New, Australian grown finds new.png and australian grown.png. Separate names with commas, semicolons or line breaks.",
          "A line break inside a cell (Option+Return on a Mac, Alt+Enter on Windows) is a line break on the page.",
          "Keep merged cells out of the product rows, and close the workbook in Excel when the plugin writes to it: it waits while Excel has it open.",
        ],
      }, {
        id: "prepare-images", q: "Name your images", wide: true,
        a: [
          "Put the product's code in each file's name: 410201.psd, 410201 front.psd and SKU410201-back.tif all find product 410201. Or name a folder for the code and put its shots inside.",
          "A code under five characters must start the file's name (12 front.jpg), or be the folder's whole name, so it is never found inside another number.",
          "Several images of one product are placed in the order of the number after the code: 410201 first, then 410201 2, 410201 3, and on to 10.",
          "Subfolders are searched. Folders named old, archive, exports or _exports are not, so keep retired shots there.",
          "PSD, PSB, TIFF, PNG, JPEG, JPEG 2000, HEIC, AI, PDF, EPS, SVG, GIF and BMP are placed. A PSD, or a PNG or TIFF with transparency, is fitted by its cut-out shape; a JPEG by its whole picture.",
          "The same picture saved as both PSD and JPEG is placed twice until you choose one type under Prefer file types.",
          "Files kept in iCloud or Dropbox must be on the Mac or PC: choose Make Available Offline or Download Now for the folder first.",
          "Names that carry no code? Tick a column under Matching instead: a column of file names in the brief, or the product's name (marked Check, for you to confirm).",
        ],
      }],
    }],
  },
  help: {
    intro: "What the settings alone do not tell you.",
    groups: [{
      id: "prices", label: "Badges and prices",
      items: [{
        id: "price-folders", q: "Set up your overlay folders", art: "catalogue-producer/price-folders",
        intro: "Badges and prices come from folders of artwork on disk. Keep a job's folders together, link each one once in the panel, and each corner with a price chooses the folder its prices are drawn from.",
        points: [
          { name: "The overlays folder", text: "Choose folder… in Overlays links it. It holds the badges and one price set only, the main style: one device for each kind of price. Every corner draws its price from these until it chooses another set." },
          { name: "Additional price device styles", text: "Each other style, a sale look say, is a price set in a folder of its own. Add price set… links the first as Set 1, the next as Set 2. Change… points a set at another folder and keeps the corners that chose it; × removes it, and what chose it goes back to the overlays folder." },
          { name: "Which set a price uses", text: "On a corner with a price, Price set chooses the overlays folder or a set, for the document, a range of pages or one product. A page or a product that chooses a set still follows every other setting of the corner above it." },
          { name: "Folders the plugin cannot reach", text: "The document remembers every device it has used, so a folder renamed, moved or on a drive not plugged in goes on working from what the document holds, and the panel says so once. Choose folder… or Change… links it again." },
        ],
      }, {
        id: "price-devices", q: "Make your price devices", art: "shared/price-devices", folders: [["Overlays", "Overlays folder"], ["Additional price device styles", "Set 1"]],
        intro: "Each price device is an InDesign file of its own. The overlays folder holds one price set; each additional style is a price set in a folder of its own. Automated Assemblr writes each product's price from the brief into the device that fits it.",
        points: [
          { name: "One file, one device", text: "Save each device as an .indd, .idml or .idms file. Build it as you like, on as many layers as it needs: a panel or a shape behind, images, and the text frames for the price. It is placed as one, on the product's corner, and follows the product." },
          { name: "Text mapping", text: "Type X where the digits go: $X.XX for dollars and cents, XXc for cents alone. Each product's price is written into those runs only, so the $, the point, the c and every paragraph and character style round them stay as you set them; superscript cents stay superscript. No tagging needed." },
          { name: "The “each” under the price, from the brief", text: "Words beside the price that change from product to product, “each” or “per kg”, come from a column of the brief, Unit say, written into a tagged frame of the device (The “each” under the price, below)." },
          { name: "A folder a set, a file a kind", text: "One folder holds a device for each kind of price: x-xx, xx-xx and xx-c side by side, $5.50 takes the first, $12.50 the second and 95c the third. Name a file for its shape to settle a device its text leaves open. A folder holds one style only: put each additional style in a folder of its own, a price set (Set up your overlay folders, above). Two devices of one shape and size in one folder clash, and neither is used; in two folders they never do." },
        ],
      }, {
        id: "price-unit", q: "The “each” under the price", art: "shared/unit-field",
        intro: "A price device can carry more than the price: the “each” or “per kg” under it, written from the brief for every product.",
        points: [
          { name: "In the brief", text: "A column headed Unit, holding “each”, “per kg”, “per 100 g”: whatever goes under that product's price." },
          { name: "In the device", text: "Type “each” in a text frame of its own, styled as it should print, and tag the frame Unit in InDesign's Tags panel (Link a text frame to a brief column, below). Tag the whole frame, not a run of its text." },
          { name: "On the page", text: "Each product's Unit replaces “each”, in the frame's styles: “$12.50 each”, “$4.99 per kg”. A product whose Unit cell is blank leaves the frame empty, and the panel names it." },
          { name: "Any column", text: "The same works for any column of the brief: name the tag for the column's header. A tag that names no column is left as you typed it." },
        ],
      }, {
        id: "price-tags", q: "Link a text frame to a brief column", wide: true,
        a: [
          "In the price device's file, put the words to be replaced, per kg say, in a text frame of their own, styled as they should print.",
          "Open Window ▸ Utilities ▸ Tags, choose New Tag from the panel's menu and name it as the brief's column header: Unit. Case does not matter; a tag cannot hold a space, so a column headed Unit of measure takes the tag Unit_of_measure.",
          "With the Selection tool, select the text frame and click the tag in the Tags panel. View ▸ Structure ▸ Show Tagged Frames colours a tagged frame, so you can see it took.",
          "Save the file in the overlays folder or a price set. The next Build reads it again.",
          "Each product's value in that column replaces the frame's text, in the frame's styles. A blank cell leaves the frame empty; a tag that names no column is left as you typed it, and the panel says so.",
          "The price itself needs no tag. If the panel reads a device's price wrongly, tag it the same way: the whole frame price, or select its digits with the Type tool and tag them dollars and cents.",
        ],
      }],
    }],
  },
};
