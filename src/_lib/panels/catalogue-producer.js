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
    heading: "How the brief becomes catalogue pages",
    intro: "Automated Assemblr builds catalogue pages from an Excel brief and your folders of images, and keeps the brief and the pages in step.",
    // The hero's spread, made as you scroll (panel/catalogue-producer/build.njk): the empty spread held at the top of
    // the window, the panel's settings scrolling under it, each step adding what it sets to the pages. A step's `cap`
    // names the spread at that step; its drawing is build-<id>.njk.
    build: {
      start: { cap: "Pages 2 and 3, empty", name: "An empty spread", text: "Start with a new document: two facing pages on your parent pages, showing only their margins. As you scroll, the spread at the top of this page is built one setting at a time." },
      steps: [
        { id: "pages", cap: "A 3 × 3 grid inside the margins", name: "Set the grid", text: "In Setup ▸ Pages, set Across and Down to 3 and Gap to 12 pt. The grid sits inside each page's margins, with inside and outside swapped on facing pages. Click Apply changes to build the pages." },
        { id: "grid", cap: "Cells joined", name: "Join cells", text: "In the Grid tile, give a product more than one slot. The Party pack takes the width of the page, and the Mixed case takes two across and two down. Two rows are kept free for inserts, and the other products flow on around them." },
        { id: "folders", cap: "Images placed", name: "Place the images", text: "Link the brief and your image folders. Each file finds its product by the code in its name. Place images puts each file in its product's cell, and Assemblr's layout engine lays it out." },
        { id: "copy", cap: "Copy written", name: "Write the copy", text: "Pick the brief's columns for the copy and the paragraph style each one starts in. Write copy fills every cell. Match the row starts the captions at the same height." },
        { id: "layout", cap: "Products arranged", name: "Arrange a product", text: "Select a product and set its arrangement. The Party pack is set to Line-up with Perspective, and the Mixed case to Pins in three rows of two. The images move, and the cell stays where it is." },
        { id: "overlays", cap: "Badges and prices on the corners", name: "Badges and prices", text: "Put overlays on a product's corners: a NEW badge top right and a price device bottom left. The price comes from the brief and is written into a price device you made in InDesign." },
        { id: "inserts", cap: "Inserts added, spread finished", name: "Add the inserts", text: "Anything that is not a product goes in as an insert. Here a PDF advert runs across the top of page 3, and a price list is filled from its own sheet and styled by a table you drew." },
        // Then the spread edited (catalogue-art.js `build`, steps 8 to 12). `group` heads the first of them.
        { id: "swap", group: "Then edit it", cap: "Cola and Duo pack swapped", name: "Swap two products", text: "In the Catalogue tile, drag one product onto another. The Cola and the Duo pack change cells, and each takes its images, copy and corners with it. Changes lists the new order against the brief." },
        { id: "images", cap: "Two images swapped", name: "Swap a product's images", text: "In a product's strip of images, drag one image onto another. Here the Mixed case's first and last images change places, and the engine lays out the arrangement again with them in their new places." },
        { id: "hide", cap: "Lemon soda hidden", name: "Hide a product, show it again", text: "Hide a product and it leaves the pages. The products after it flow up, so Ginger beer moves from the next page into its cell. Show it again and it goes back to its place in the brief's order." },
        { id: "size", cap: "Sparkling water 1 × 2", name: "Change a cell's size", text: "Give a product a bigger or smaller cell. Here Sparkling water takes one across and two down. Its image is laid out again for the new shape, and Ginger beer flows on to the next page." },
        { id: "overlay-size", cap: "A bigger price device", name: "Set an overlay's size", text: "Each corner has its own size, set as a Max width and Max height in points or as a share of the product. Here the Party pack's price device is set to 96 pt, and every other product keeps its own size." },
      ],
    },
    steps: [
      { id: "brief", name: "Built from your brief", wide: true, text: "The Excel brief holds the catalogue, one row per product. Assemblr finds each product's images in your folders by the product code in the file or folder name, or by the product's name. A near match is marked Check for you to confirm. The images are laid out in the product's cell, and its copy is written from the brief's columns in your paragraph styles. Each product stays linked to its row. An edit on either side, such as a new price in the brief or a renamed product on the page, is listed in Changes, and you choose which way it goes." },
      { id: "grid", name: "Pages on a grid, or arranged by hand", text: "Every page is built on a grid. Set the number of products across and down, and the gap between them, in Setup ▸ Pages. Change the grid and Apply changes builds the pages again in one undo step, with the products flowing on in the brief's order. Cells can be joined across and down. Here the Party pack takes the width of the page, Sparkling water takes two cells across and two down, and Lemon soda takes two across. The products around them flow on. On Auto, a short page gets a smaller grid. A page break starts a new page wherever the value in a chosen column of the brief changes. Set a page to Free and you arrange it yourself. Each product is placed once and never moved again. Its images are still laid out for its cell, wherever you put it and whatever size you make it." },
      { id: "product", name: "Products laid out by Assemblr's layout engine", link: { href: "/indesign/assemblr/", label: "More on Assemblr" }, text: "Each product is a cell, with an image area above its copy. In the image area, Assemblr's layout engine arranges the images by what is visible in them, in Line-up, Grid, Mosaic, Pins or Puzzle. Copy fitting gives the copy the room it needs and the image area the rest. Badges and price devices go on the cell's corners, and each price is written into a price device you designed. Drag an image into a cell and it joins the product and is arranged with its other images. Copy you edit on the page is kept until you choose to overwrite it." },
      { id: "margins", name: "Margins, parent pages and inserts", text: "The grid fills each page inside its margins, with inside and outside swapped on facing pages, on the parent pages you choose. Anything that is not a product goes in as an insert: an InDesign file, a PDF, any image InDesign can place, or a table filled from its own sheet and styled by a design you draw. An insert takes a full page (with or without bleed), a half or quarter page, or any block of cells. It keeps its place in the product order or is pinned to a page, and the products flow around it. The panel tells you what size to make the file." },
      { id: "list", name: "The product list", text: "The list shows every product in the brief, in page order. Drag a product to move it. The pages are built again in the new order, and Changes lists how the order now differs from the brief. You can also work inside a product. Drag its images to change their order, or drag one in from another product or from the files no product matched. Take an image out with × or add one with +. ¶ starts a new page before a product, and + adds an insert after it." },
    ],
  },
  // Each tab's tiles are shown one after another, stepped through as you scroll (partials/panel-tour.njk).
  steps: true,
  intro: "Automated Assemblr works from one panel in InDesign, with three tabs: Setup, Products and Changes. Scroll down to go through each tab's tiles in turn, or click a tile to jump to it. Each number says what a setting does, and the note beside it lights up as you point at it.",
  tabs: [
    {
      id: "setup", label: "Setup",
      summary: "Sets where the catalogue comes from and how its pages are built.",
      tiles: [
        {
          id: "folders", label: "Folders", icon: ICONS.folders,
          summary: "Links the brief and the image folders, and sets how each file finds its product.",
          notes: [
            { name: "Brief", text: "Shows the Excel brief the catalogue is built from, one row per product. Change… picks another workbook. Anything in it the plugin cannot use is listed as a warning." },
            { name: "Image folders", text: "Lists the folders your images are in, and how many files each holds. A folder that has gone missing is marked as missing." },
            { name: "Analyse links", text: "Reads the brief and the folders again and matches the files to products. Nothing on the pages changes until you apply it in Changes." },
            { name: "Place images", text: "Places every product's images on its page and re-fits them all, in steps you can stop, as one undo step. Update reads changed files again and re-fits their products. Locked or rotated images are left as they are." },
            { name: "Matching", text: "Sets the ways a file can find its product: by the product code in the file name or the folder name, or by the product's name. Untick a way to stop using it. When two ways disagree, the higher one in the list wins, so drag them into the order you want." },
            { name: "Low confidence", text: "Files matched only by a similar name are placed but marked Check, so you can confirm each one on its product." },
            { name: "Prefer file types", text: "When the same image is in the folders as both a PSD and a TIF, only the type chosen here is used." },
          ],
        },
        {
          id: "pages", label: "Pages", icon: ICONS.pages,
          summary: "Sets how the pages are built: the grid on each page, the number of pages, their parent pages and where a new page starts.",
          notes: [
            { name: "Grid: Auto or Consistent", text: "Auto gives a page with fewer products a smaller grid, with cells the same shape as a full page's. Consistent gives every page the grid you set, and a short page keeps its empty slots." },
            { name: "Across, Down and Gap", text: "Sets the number of products across and down a page, and the space between them in points. Left on auto, Across and Down are worked out from the number of products." },
            { name: "Copy height", text: "Sets the share of each cell the copy takes, under its image area." },
            { name: "Page count", text: "Sets how many pages the catalogue runs to, and the page it starts on. On auto, it gets as many pages as it needs." },
            { name: "Masters", text: "Sets the parent pages that left-hand and right-hand pages are built on." },
            { name: "Page breaks", text: "Choose a column of the brief, such as a category. A new page starts wherever its value changes." },
            { name: "Apply changes", text: "The settings are a draft until Apply changes builds the pages with them, in one undo step. Discard throws them away without writing anything." },
          ],
        },
        {
          id: "copy", label: "Copy", icon: ICONS.copy,
          summary: "Sets what each product's copy says, which columns of the brief it comes from and which paragraph styles it uses.",
          notes: [
            { name: "Copy fitting", text: "Off: every cell splits at the same height, whatever its text. Per product: each cell's copy takes what it needs and the image area gets the rest. Match the row: every cell in a row takes the row's largest copy height, so the captions all start level, as most printed catalogues do." },
            { name: "Fields", text: "Lists a row for each column of the brief. Tick a row to show that column in the copy, and use the arrows to change the order." },
            { name: "How each field starts", text: "Sets whether each field starts on a new paragraph or after a line break, a space or a tab, and the paragraph style it uses." },
            { name: "Paragraph styles", text: "Automatic finds the document's paragraph style with the field's name. If there is none, Create style makes it. A style found by a similar name waits for you to confirm it." },
            { name: "Leave out empty fields", text: "A product with nothing in a column gets no empty line for it." },
            { name: "Write copy", text: "Writes every product's copy from the brief. Copy edited in InDesign is counted and kept until you choose to overwrite it." },
          ],
        },
        {
          id: "tables", label: "Tables", icon: ICONS.tables,
          summary: "Fills price lists and spec tables, each from its own sheet, and styles them by a design you draw in InDesign.",
          notes: [
            { name: "Table Setup", text: "Names the parent page that holds your table designs. Show takes you to it, and the panel warns you if this parent page is applied to a page that prints." },
            { name: "Designs", text: "Lists your table designs. A design is a table drawn in InDesign with a header row and one sample row. Every table that follows it gets its columns, styles and strokes. Use selection as design adds the table you have selected." },
            { name: "Tables", text: "Each table comes from a sheet and follows a design. The panel lists the cells that change and the rows added or removed, and keeps any cell you edited by hand." },
            { name: "Problems", text: "The panel names a design with no sample row, or a table taller than its frame, and says what to do about it." },
            { name: "Refresh tables", text: "Reads every table's sheet and design and lists what would change. Nothing changes until you apply it, table by table or all at once." },
          ],
        },
      ],
    },
    {
      id: "products", label: "Products",
      summary: "Sets how each product's images are laid out and what goes on its corners, and shows where it stands in the catalogue.",
      tiles: [
        {
          id: "layout", label: "Layout", icon: ICONS.layout,
          summary: "Sets how Assemblr's layout engine arranges the selected product's images. The engine works from what is visible in each image and ignores its frame.",
          notes: [
            { name: "The drawing", text: "Shows the product drawn over the panel. Drag the end of the line to rotate the row and set its size. Click a dot to choose the edge or corner the product holds to." },
            { name: "Arrangements", text: "Line-up, Grid, Mosaic, Pins and Puzzle are five ways to lay out a product's images. Each one fits to the visible subject of every image." },
            { name: "The product", text: "Shows the product the selection is in, its page and its images. Select them all selects every frame the product is made of." },
            { name: "Settings", text: "Lists the settings each arrangement has, from Align images, Angle, Size, Scale, Bleed, Perspective and a clipping path made from each image's transparency." },
            { name: "Apply to page, Apply to all", text: "Gives every product on this page, or in the whole catalogue, these settings." },
            { name: "Re-fit and Reset", text: "Re-fit lays the images out again. Reset puts the product back to the arrangement's automatic settings in one undo step, clearing rotation done by hand and releasing locks. Reset page and Reset all do the same for the page or the whole catalogue." },
            { name: "Images", text: "Lists the product's images in order. Drag to reorder them, click one to leave it out, or click + to add one. Unassigned files lists the files that matched no product." },
          ],
        },
        {
          id: "overlays", label: "Overlays", icon: ICONS.overlays,
          summary: "Puts badges and price devices on a product's corners, from a folder of artwork or a column of the brief.",
          notes: [
            { name: "Where it applies", text: "Sets whether a corner's settings apply to one product (wherever it goes), a range of pages or the whole document. A product follows the document's settings until you give it its own." },
            { name: "Corner and Stack", text: "Pick a corner on the drawing or here. Its overlays stack across or down from the corner. Click another corner to move them there, or to swap them with the overlays already there." },
            { name: "Sources", text: "Sets what goes on the corner: badges from the overlays folder, or a column of the brief (+ Column) whose cells name what goes there." },
            { name: "Size and spacing", text: "Set Gap and Inset X and Y in points, or let Resize scale scale them with the product. Each overlay is fitted into a Max width by Max height, in points or as a share of the product." },
            { name: "Overlays folder", text: "Links one folder of artwork that holds badges and price devices. The price devices are InDesign files the plugin writes each product's price into." },
            { name: "Price sets", text: "The overlays folder holds one price set. Each additional style of price device is a folder of its own, listed as Set 1, Set 2 and so on. Each corner with a price chooses the set its device is drawn from." },
          ],
        },
        {
          id: "catalogue", label: "Catalogue", icon: ICONS.catalogue,
          summary: "Lists every product in the brief in page order, with where each one stands.",
          notes: [
            { name: "No image", text: "Shows only the products still waiting for an image." },
            { name: "Order", text: "Drag a product to move it. The pages are rebuilt in the new order, and Changes lists how the order differs from the brief." },
            { name: "Where each product stands", text: "Each product shows its page and its images placed or added. It is also marked when its copy is overset, an image has changed on disk (Update), it is on the pasteboard, or it was edited in InDesign." },
            { name: "Check", text: "A file matched only by a similar name waits on its product until you click Looks right or Not this product." },
            { name: "Breaks and inserts", text: "¶ starts a new page before a product. + adds an insert after it, such as an advert or a table, from an INDD, a PDF or an image." },
          ],
        },
        {
          id: "grid", label: "Grid", icon: ICONS.grid,
          summary: "Shows the selected page's grid and sets how many slots each product on it takes.",
          notes: [
            { name: "Managed or Free", text: "Managed: the plugin keeps this page on its grid. Free: you arrange the page, and the plugin leaves it alone." },
            { name: "The page", text: "Shows the page as its grid, with each product in its slots. Set… opens this page's own grid and spacing in Setup ▸ Pages." },
            { name: "Size", text: "Give a product more than one slot, such as a 2 × 2 hero, and the products around it flow on. Set it to one slot to put it back." },
          ],
        },
      ],
    },
    {
      id: "changes", label: "Changes",
      summary: "Keeps the brief and the document in step both ways. It shows what changed on which side, and you choose which way each change goes.",
      tiles: [
        {
          id: "changes", label: "Changes",
          summary: "Keeps the brief and the document in step both ways. It shows what changed on which side, and you choose which way each change goes.",
          notes: [
            { name: "Check", text: "Reads the brief again and compares it with the pages. The tables' sheets are read too." },
            { name: "Apply spreadsheet changes", text: "Brings every edit made in the brief into the document." },
            { name: "Write InDesign edits to spreadsheet", text: "Copies edits made on the pages, such as a renamed product or a new price, back to the brief. With Write everything, the document wins wherever the two differ." },
            { name: "One change at a time", text: "Each difference shows both sides. Update document, Write to spreadsheet or Use spreadsheet takes it one way or the other, and × dismisses it until either side changes again." },
            { name: "Changed in both", text: "When the brief and the page both changed the same thing, both are shown and you choose." },
            { name: "Pages and images", text: "Lists products not on the pages yet, an order that differs, a page that overflows and files that now match another product, each with what Apply will do." },
            { name: "When it cannot finish", text: "It says why and what to do. If the brief is open in Excel, close it and try again." },
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
    intro: "Before you open the panel, have ready one Excel brief, your images named by product code, and a folder of badges and price devices. Keep a job's files together so the plugin can find them.",
    withHelp: true,
    groups: [{
      id: "job", label: "Your job's files",
      items: [{
        id: "job-folders", q: "Lay out a job's folders", art: "catalogue-producer/job-folders",
        intro: "Keep everything the catalogue is built from in one folder for the job. Link each part once in the panel, with the button beside it in the drawing. Each part is read again whenever you build or check.",
        points: [
          { name: "The brief", text: "An Excel workbook with one row per product and a product code column. Link it with Link brief… in the Folders tile. The pages are built from it, and edits on the pages can be written back to it." },
          { name: "Image folders", text: "Your images, each named with its product's code, in as many folders as you like. Add folder… links each one. Its subfolders are searched too." },
          { name: "The overlays folder", text: "Holds the badges and one price set, with one InDesign file for each kind of price. Link it with Choose folder… in the Overlays tile (see Set up your overlay folders, below)." },
          { name: "Additional price device styles", text: "Optional. Each other style of price device goes in a folder of its own, one price set per folder. Add price set… links the first as Set 1." },
        ],
      }, {
        id: "prepare-brief", q: "Prepare the brief", wide: true,
        a: [
          "Save it as an Excel workbook (.xlsx). From Numbers or Google Sheets, export or download it as .xlsx. The first sheet is read unless you choose another.",
          "Put one product on each row, under a row of column headers. Title rows above the headers are fine, as long as the headers are within the first 30 rows.",
          "The one column the brief needs is a product code, headed Product code, Code, SKU, SAP, Article or Item. A row with no code, such as a section title, is skipped. The code identifies the product, so if you change it, it becomes a new product.",
          "Name, Description, Price, Page and Hero are found by their headers (Product name or Title; Description or Desc; Price, RRP, Retail price or Cost; Page or Pg; Hero or Featured). Every other column, such as Pack or Unit, is read under its own header, so you can show it as copy or use it for overlays.",
          "Put one price in each cell. $12.50, 12.5, 99c, €4,99 and AUD 12.50 are all read. A cell the plugin cannot read as one price, such as 2 for $5, is reported.",
          "A badge column names files in the overlays folder: a cell reading New, Australian grown finds new.png and australian grown.png. Separate names with commas, semicolons or line breaks.",
          "A line break inside a cell (Option+Return on a Mac, Alt+Enter on Windows) is a line break on the page.",
          "Keep merged cells out of the product rows. Close the workbook in Excel before the plugin writes to it, because the plugin waits while Excel has it open.",
        ],
      }, {
        id: "prepare-images", q: "Name your images", wide: true,
        a: [
          "Put the product's code in each file's name: 410201.psd, 410201 front.psd and SKU410201-back.tif all find product 410201. Or name a folder for the code and put the product's images inside.",
          "A code under five characters must start the file's name (12 front.jpg), or be the folder's whole name, so it is never found inside another number.",
          "Several images of one product are placed in the order of the number after the code: 410201 first, then 410201 2, 410201 3, and so on up to 10.",
          "Subfolders are searched. Folders named old, archive, exports or _exports are not, so keep retired images there.",
          "PSD, PSB, TIFF, PNG, JPEG, JPEG 2000, HEIC, AI, PDF, EPS, SVG, GIF and BMP are placed. A PSD, or a PNG or TIFF with transparency, is fitted by the shape of its cut-out. A JPEG is fitted by its whole picture.",
          "The same image saved as both PSD and JPEG is placed twice until you choose one type under Prefer file types.",
          "Files kept in iCloud or Dropbox must be downloaded to the Mac or PC. Choose Make Available Offline or Download Now for the folder first.",
          "If the file names carry no code, tick another way under Matching: a column of file names in the brief, or the product's name. A match by the product's name is marked Check for you to confirm.",
        ],
      }],
    }],
  },
  help: {
    intro: "These notes cover what the settings alone do not tell you.",
    groups: [{
      id: "prices", label: "Badges and prices",
      items: [{
        id: "price-folders", q: "Set up your overlay folders", art: "catalogue-producer/price-folders",
        intro: "Badges and price devices come from folders of artwork on disk. Keep a job's folders together and link each one once in the panel. Each corner with a price then chooses the folder its price devices are drawn from.",
        points: [
          { name: "The overlays folder", text: "Link it with Choose folder… in the Overlays tile. It holds the badges and one price set (the main style), with one device for each kind of price. Every corner draws its price device from this set until it chooses another." },
          { name: "Additional price device styles", text: "Each other style, such as a sale look, is a price set in a folder of its own. Add price set… links the first as Set 1 and the next as Set 2. Change… points a set at another folder, and the corners that chose the set keep it. × removes a set, and anything that chose it goes back to the overlays folder." },
          { name: "Which set a price uses", text: "On a corner with a price, Price set chooses the overlays folder or one of the sets, for the document, a range of pages or one product. A page or product that chooses its own set still follows every other setting of the corner above it." },
          { name: "Folders the plugin cannot reach", text: "The document remembers every device it has used. If a folder is renamed, moved or on an unplugged drive, its devices keep working from what the document holds, and the panel tells you once. Choose folder… or Change… links the folder again." },
        ],
      }, {
        id: "price-devices", q: "Make your price devices", art: "shared/price-devices", folders: [["Overlays", "Overlays folder"], ["Additional price device styles", "Set 1"]],
        intro: "Each price device is an InDesign file of its own. The overlays folder holds one price set. Each additional style is a price set in a folder of its own. Automated Assemblr writes each product's price from the brief into the device that fits it.",
        points: [
          { name: "One file for each device", text: "Save each device as an .indd, .idml or .idms file. Build it however you like, on as many layers as it needs, for example a panel or shape behind, images, and the text frames for the price. It is placed as one item on the product's corner and follows the product." },
          { name: "Text mapping", text: "Type X where the digits go: $X.XX for dollars and cents, XXc for cents alone. Each product's price is written into those runs only. The $, the point, the c and every paragraph and character style around them stay as you set them, so superscript cents stay superscript. The price needs no tags." },
          { name: "The “each” under the price, from the brief", text: "Words beside the price that change from product to product, such as “each” or “per kg”, come from a column of the brief, for example Unit. They are written into a tagged frame in the device (see The “each” under the price, below)." },
          { name: "One folder per set, one file per price shape", text: "One folder holds a device for each shape of price. With x-xx, xx-xx and xx-c side by side, $5.50 takes the first, $12.50 the second and 95c the third. If a device's text leaves its shape unclear, name the file for its shape. A folder holds one style only, so put each additional style in a folder of its own, as a price set (see Set up your overlay folders, above). Two devices of the same shape and size in one folder clash, and neither is used. In two different folders they never clash." },
        ],
      }, {
        id: "price-unit", q: "The “each” under the price", art: "shared/unit-field",
        intro: "A price device can also carry the “each” or “per kg” under the price, written from the brief for every product.",
        points: [
          { name: "In the brief", text: "A column headed Unit, holding whatever goes under each product's price, such as “each”, “per kg” or “per 100 g”." },
          { name: "In the device", text: "Type “each” in a text frame of its own, styled as it should print, and tag the frame Unit in InDesign's Tags panel (Link a text frame to a brief column, below). Tag the whole frame, not a run of its text." },
          { name: "On the page", text: "Each product's Unit replaces “each”, in the frame's styles: “$12.50 each”, “$4.99 per kg”. A product whose Unit cell is blank leaves the frame empty, and the panel names the product." },
          { name: "Any column", text: "This works for any column of the brief. Name the tag after the column's header. A frame whose tag names no column is left as you typed it." },
        ],
      }, {
        id: "price-tags", q: "Link a text frame to a brief column", wide: true,
        a: [
          "In the price device's file, put the words to be replaced, such as per kg, in a text frame of their own, styled as they should print.",
          "Open Window ▸ Utilities ▸ Tags, choose New Tag from the panel's menu and name it after the brief's column header, for example Unit. Case does not matter. A tag cannot hold a space, so a column headed Unit of measure takes the tag Unit_of_measure.",
          "With the Selection tool, select the text frame and click the tag in the Tags panel. View ▸ Structure ▸ Show Tagged Frames colours a tagged frame, so you can check the tag was applied.",
          "Save the file in the overlays folder or a price set. The next Build reads it again.",
          "Each product's value in that column replaces the frame's text, in the frame's styles. A blank cell leaves the frame empty. A frame whose tag names no column is left as you typed it, and the panel says so.",
          "The price itself needs no tag. If the panel reads a device's price wrongly, tag it the same way. Tag the whole frame price, or select the digits with the Type tool and tag them dollars and cents.",
        ],
      }],
    }],
  },
};
