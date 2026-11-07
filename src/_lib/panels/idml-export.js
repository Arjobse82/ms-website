// IDML Export's panel, explained (src/_data/panels.js): its words are the plugin's own labels, tooltips and notes
// (monocode.campaign-manager src/main/apps/indesignExport/ui.html and legacy.ts, docs/indesign-export-listing.md and
// indesign-export-support.md). Drawings: src/_includes/panel/idml-export/, drawn from idml-export-panel.js.
import { idmlExportPanel } from "../idml-export-panel.js";

export default {
  name: "IDML Export",
  intro: "IDML Export works from one panel in Figma, in two tabs, Export and Setup, with its profile settings behind the cog. Each number says what a part of the panel does, and the note beside it lights up as you point at it.",
  art: idmlExportPanel(),
  tabs: [
    {
      id: "export", label: "Export",
      summary: "One Scan lays your frames out as IDML files, checks what will come across, and Export writes them.",
      tiles: [
        {
          id: "export", label: "Export",
          notes: [
            { name: "Scan", text: "Reads the frames you have selected, or every visible frame on the page when nothing is selected. It lays them out as IDML files below and collects their colours for the Setup tab." },
            { name: "Spreads or Single pages", text: "Spreads joins frames that touch side by side, top-aligned and the same height, into one spread; Single pages makes every frame a page of its own. Shown only when the scan has frames that could join." },
            { name: "Group frames by size", text: "Frames of one size go into one IDML file, a file for each size. Shown only when the scan holds more than one size." },
            { name: "Create separate IDML files", text: "An IDML file for every page or spread. Shown only when the scan makes more than one." },
            { name: "Compatibility report", text: "A dry run of the export, made after every Scan, so you see it before you export. Click it for three tables: what comes across in full, what is converted with a workaround and how, and what cannot be converted." },
            { name: "IDML", text: "One IDML file, its known swatches as dots. A ? means a named colour in it still needs mapping; click a dot to go to the colours on the Setup tab." },
            { name: "FLEX and LINK", text: "This file's own Flex layout and component links, overriding the defaults in Profile settings. Each shows only when the file has Auto Layout frames or components; point at one for what to check in it." },
            { name: "Page size", text: "The pages' size in mm, one Figma pixel to one point, and the paper size it matches. ≈ means the right proportions at the wrong size, with the px to resize the frame to; nothing is scaled." },
            { name: "Bleed and colour mode", text: "The file's bleed, 3 mm unless you pick 0, 1 or 5 mm. CMYK, the default, is for print; RGB passes every colour through as Figma's RGB." },
            { name: "Pages", text: "The file's pages and spreads, in reading order: top to bottom, then left to right, each with its frames' names." },
            { name: "Links", text: "The file's images. Click the folder to connect a folder of hi-res files: an image whose layer name matches a JPEG, PNG, PSD, AI, EPS or PDF there links to that file instead of Figma's copy. A Links folder in the output folder is connected on its own." },
            { name: "Export", text: "Builds the files in Monochrome Bridge, the free companion app, each in a folder of its own in the output folder, or a ZIP when there is none. Without a subscription it reads Export Test Page: text and Figma images come across, colours turn grey and styles and layers are removed, with one of each kept as a sample." },
          ],
        },
      ],
    },
    {
      id: "setup", label: "Setup",
      summary: "This job's colours, mapped to print swatches, the client profile they come from, and where the files go.",
      tiles: [
        {
          id: "setup", label: "Setup",
          notes: [
            { name: "Profile", text: "The client colour profile in use. Picking one replaces this job's colours with the profile's, so the next Scan matches them by name; + New profile… saves the colours under a client's name. The × ejects the profile and clears the colours back to Default; the profile stays saved." },
            { name: "Output folder", text: "Where Export writes the files; with none, Export saves a ZIP instead. Approve shows when Monochrome Bridge has not been shown the folder: choose it once in the picker and the bridge remembers it." },
            { name: "Known swatches", text: "Colours that already have a print swatch: InDesign's [Paper] and [Black] for pure white and black, and Figma styles and variables whose names are mapped. A tick is a swatch with its own name; a chain link is a colour mapped onto another swatch, and clicking it clears the mapping." },
            { name: "Swatch name", text: "On a row that can be remapped, the name opens a list of every known swatch: pick one and the colour takes its name, inks and type. Names are read-only here; you rename a swatch in Profile settings." },
            { name: "C M Y K and Process or Spot", text: "The swatch's inks, in per cent, and whether it is a process, spot or registration colour, or InDesign's [Black] or [Paper]." },
            { name: "Unknown swatches", text: "Colours with a Figma name that is not mapped yet, converted from RGB until you decide. Point at the ? and click its + to save the colour and add it to the profile." },
            { name: "Hidden swatches", text: "Colours with no Figma name, such as loose fills in vector art, converted from RGB and counted. Click the heading to see them and map one by hand for this export." },
            { name: "Save", text: "Saves this job's colour mapping, for the export and the next Scan. It never changes the profile: a row that differs from it shows its tick in black, and pointing at the tick shows a + that adds it." },
            { name: "Overprint fill and stroke", text: "Turn overprint on or off for the fills or strokes of the shapes and text you have selected in Figma, for InDesign. Each box shows the selection as it is, and is dimmed when nothing selected can take it. They stay at the foot of both tabs." },
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
            { name: "Profile colours", text: "The profile's colours, a row for each swatch however many Figma names map onto it. Rename a swatch, change its inks or type, or remove it with ×, then save. Colours only come in from a Scan." },
            { name: "Save profile", text: "Saves the table into the profile, and into this job's colours. A colour still waiting to be added from the Setup tab stays out until you add it." },
            { name: "Delete profile", text: "Deletes the profile and goes back to Default. On Default it reads Reset default and clears Default's colours instead, since Default is always there." },
          ],
        },
      ],
    },
  ],
};
