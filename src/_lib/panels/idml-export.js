// IDML Export's panel, explained (src/_data/panels.js): its words are the plugin's own labels, tooltips and notes
// (monocode.campaign-manager src/main/apps/indesignExport/ui.html and legacy.ts, docs/indesign-export-listing.md and
// indesign-export-support.md). Drawings: src/_includes/panel/idml-export/, drawn from idml-export-panel.js.
import { idmlExportPanel } from "../idml-export-panel.js";

export default {
  name: "IDML Export",
  intro: "IDML Export has one panel in Figma with two tabs, Export and Setup, and its profile settings behind the cog. Each number marks a part of the panel, and its note lights up when you point at it.",
  art: idmlExportPanel(),
  tabs: [
    {
      id: "export", label: "Export",
      summary: "Scan lays your frames out as IDML files and checks what will come across. Export then writes them.",
      tiles: [
        {
          id: "export", label: "Export",
          notes: [
            { name: "Scan", text: "Reads the frames you have selected, or every visible frame on the page when nothing is selected. It lays them out as IDML files below and collects their colours for the Setup tab." },
            { name: "Spreads or Single pages", text: "Spreads joins frames that touch side by side, are top-aligned and have the same height into one spread. Single pages makes every frame a page of its own. It only shows when the scan has frames that could join." },
            { name: "Group frames by size", text: "Frames of one size go into one IDML file, so you get a file for each size. It only shows when the scan holds more than one size." },
            { name: "Create separate IDML files", text: "Makes an IDML file for every page or spread. It only shows when the scan makes more than one." },
            { name: "Compatibility report", text: "A dry run of the export, made after every Scan, so you can read it before you export. Click it for three tables: what comes across in full, what is converted with a workaround (and how), and what cannot be converted." },
            { name: "IDML", text: "One IDML file, with its known swatches shown as dots. A ? means a named colour in the file still needs mapping. Click a dot to go to the colours on the Setup tab." },
            { name: "FLEX and LINK", text: "This file's own settings for Flex layout and component links. They override the defaults in Profile settings. Each only shows when the file has Auto Layout frames or components. Point at one to see what to check in it." },
            { name: "Page size", text: "The pages' size in mm, at one Figma pixel to one point, and the paper size it matches. ≈ means the proportions are right but the size is wrong, and gives the px to resize the frame to. Nothing is scaled." },
            { name: "Bleed and colour mode", text: "The file's bleed, which is 3 mm unless you pick 0, 1 or 5 mm, and its colour mode. CMYK is the default and is for print. RGB passes every colour through as Figma's RGB." },
            { name: "Pages", text: "The file's pages and spreads, in reading order: top to bottom, then left to right, each with its frames' names." },
            { name: "Links", text: "The file's images. Click the folder icon to connect a folder of hi-res files. An image whose layer name matches a JPEG, PNG, PSD, AI, EPS or PDF in that folder links to that file instead of Figma's copy. A Links folder inside the output folder is connected automatically." },
            { name: "Export", text: "Builds the files in Monochrome Bridge, the free companion app. Each goes in a folder of its own in the output folder, or in a ZIP when there is no output folder. Without a subscription the button reads Export Test Page. Text and Figma images come across, colours turn grey, and styles and layers are removed except one of each, kept as a sample." },
          ],
        },
      ],
    },
    {
      id: "setup", label: "Setup",
      summary: "This job's colours mapped to print swatches, the client profile they come from, and the folder the files go to.",
      tiles: [
        {
          id: "setup", label: "Setup",
          notes: [
            { name: "Profile", text: "The client colour profile in use. Picking one replaces this job's colours with the profile's, so the next Scan matches them by name. + New profile… saves the colours under a client's name. The × ejects the profile and returns the colours to Default. The profile itself stays saved." },
            { name: "Output folder", text: "Where Export writes the files. With no folder, Export saves a ZIP instead. Approve shows when Monochrome Bridge has not yet been given access to the folder. Choose it once in the picker and the bridge remembers it." },
            { name: "Known swatches", text: "Colours that already have a print swatch: InDesign's [Paper] and [Black] for pure white and black, and Figma styles and variables whose names are mapped. A tick marks a swatch with its own name. A chain link marks a colour mapped onto another swatch; click it to clear the mapping." },
            { name: "Swatch name", text: "On a row that can be remapped, the name opens a list of every known swatch: pick one and the colour takes its name, inks and type. Names are read-only here; you rename a swatch in Profile settings." },
            { name: "C M Y K and Process or Spot", text: "The swatch's inks, in per cent, and whether it is a process, spot or registration colour, or InDesign's [Black] or [Paper]." },
            { name: "Unknown swatches", text: "Colours with a Figma name that is not mapped yet, converted from RGB until you decide. Point at the ? and click its + to save the colour and add it to the profile." },
            { name: "Hidden swatches", text: "Colours with no Figma name, such as loose fills in vector art, converted from RGB and counted. Click the heading to see them and map one by hand for this export." },
            { name: "Save", text: "Saves this job's colour mapping for the export and the next Scan. It never changes the profile. A row that differs from the profile shows its tick in black, and pointing at the tick shows a + that adds the row to the profile." },
            { name: "Overprint fill and stroke", text: "Turn overprint on or off, for InDesign, on the fills or strokes of the shapes and text you have selected in Figma. Each box shows the current state of the selection and is dimmed when nothing selected can take it. The boxes stay at the foot of both tabs." },
          ],
        },
      ],
    },
    {
      id: "profile", label: "Profile settings",
      summary: "Behind the cog: how Auto Layout and components are exported, how unnamed colours are treated, and the profile's own colours.",
      tiles: [
        {
          id: "profile", label: "Profile settings",
          notes: [
            { name: "Apply Flex layout when available", text: "On: Auto Layout frames become InDesign Flex layout where they are compatible, as the Compatibility report's Auto Layout row shows. Off: Auto Layout is ignored, and those frames export as static frames." },
            { name: "Save components to idml links", text: "Exports each component as an IDML file of its own, linked into the page and listed under Links. An IDML link is not permanent in InDesign: convert it to INDD later, or swap it for a new link." },
            { name: "Convert hidden swatches without mapping", text: "On: colours with no Figma name convert from RGB on their own and stay out of the Setup tab's list. Off: every one is listed under Hidden swatches, to map by hand." },
            { name: "Profile colours", text: "The profile's colours, with one row for each swatch however many Figma names map onto it. Rename a swatch, change its inks or type, or remove it with ×, then save. Colours only come in from a Scan." },
            { name: "Save profile", text: "Saves the table into the profile, and into this job's colours. A colour still waiting to be added from the Setup tab stays out until you add it." },
            { name: "Delete profile", text: "Deletes the profile and goes back to Default. On Default it reads Reset default and clears Default's colours instead, since Default is always there." },
          ],
        },
      ],
    },
  ],
};
