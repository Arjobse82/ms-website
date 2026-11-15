// Bloom's panel, explained (src/_data/panels.js): the published plugin, which has Build mode only (monocode.campaign-
// manager docs/bloom-build-standalone-plan.md §1–2: no Measure, Overview, reports or spec panels). Its words are the
// plugin's tooltips, welcome tour and listing (bloom/src/ui/index.js, filterBar.js, measureUpdate.js _block1Sentence,
// bloom/welcome-tour-steps.csv, bloom/bloom-config.json bloomOptSpec, docs/bloom-build-listing.md) and what its fixes do
// (src/main/apps/bloom/fixes/fixes.js, tokens/tokenScan.js). Drawings: src/_includes/panel/bloom/, drawn from
// bloom-panel.js, the same job as the hero's live bloom (src/_data/jobs.js).
import { bloomPanel } from "../bloom-panel.js";

export default {
  name: "Bloom",
  intro: "Bloom has one panel in Figma. It shows the bloom, a line under it that summarises the page, and the settings behind the cog. Each number marks a part of the panel, and its note lights up when you point at it.",
  art: bloomPanel(),
  tabs: [
    {
      id: "fix", label: "Find and fix",
      summary: "Each mark takes you to its layer on the canvas, and you can fix many of them from the bloom with a double-click.",
      tiles: [
        {
          id: "fix", label: "Find and fix",
          notes: [
            { name: "Resolution", text: "This dot checks image resolution only. It is green when every image meets the dpi beside it and amber or red when one is too soft. Point at it to see how many fall short and which is the softest." },
            { name: "A frame's marks", text: "Point at a mark and the other marks on its frame gather round it. Click the mark to hold them there and go to its layer on the canvas. Click the bloom's background to release them." },
            { name: "Double-click to fix", text: "Double-click a mark and Bloom snaps an off-grid layer to whole pixels, shows a hidden layer, restores the proportions of a stretched component or image, or locks an aspect ratio. On a low-resolution image, a double-click asks you for the hi-res file instead." },
            { name: "Dismiss", text: "Right-click a mark to remove it from the bloom and the report until the plugin closes. If its component is flagged more than once, Dismiss all removes every one. To bring them back, right-click the type's icon in the filter bar." },
            { name: "A frame's dot", text: "Each frame is a dot on the rim. A solid dot is a landscape frame, a ring is portrait, and the bigger the frame, the bigger the dot. Its healthy layers fan out from it, and a white glyph stands for ten. Click the dot to go to the frame, or double-click it to snap every off-grid layer in the frame to whole pixels." },
            { name: "Fix all on this frame", text: "With a frame selected on the canvas, the centre of the bloom shows a glyph for each kind of error on it that can be fixed in one go: off-grid, hidden, stretched or an unlocked aspect ratio. Double-click a glyph to fix them all. While you hold a mark, the centre offers the same for that mark's kind when the frame has more than one." },
            { name: "Report", text: "A line of plain English that lists the page's issues, up to three kinds with a count for each. It updates as you fix things, and it counts what you have dismissed." },
          ],
        },
      ],
    },
    {
      id: "tokens", label: "Token fixes",
      summary: "Fix a raw value from the corner of the panel, either by binding it to a variable or style you already have or by making a new one.",
      tiles: [
        {
          id: "tokens", label: "Token fixes",
          notes: [
            { name: "A token's mark", text: "A token is a value typed in rather than taken from a variable or style: a fill or stroke colour, a corner radius, or text with no text style. Click its mark to see its fixes in the corner, and click it again to close them." },
            { name: "The raw value", text: "The value the mark found, shown with its glyph. Here it is a corner radius of 25. A shape with more than one raw corner shows each value in turn as you fix them." },
            { name: "Matches", text: "The variables or styles the layer could use instead, nearest value first. Click one to bind the layer to it. Unstyled text is offered the file's text styles, by their first two letters." },
            { name: "+", text: "Makes a new local variable from the raw value and binds the layer to it. For a colour, it asks for a name first, which starts with Color/ and the hex. There is no + for text, or for a library, because Bloom cannot write to a library." },
            { name: "LOCAL", text: "Shows the file's own variables and styles. Click it to see your design system's instead, under its library's name: the variables of a connected team library and its styles already used in the file. If the library has any that fit, they open first." },
          ],
        },
      ],
    },
    {
      id: "settings", label: "Settings",
      summary: "Behind the cog: which checks run, the dpi an image must reach, and how a hi-res image goes in.",
      tiles: [
        {
          id: "settings", label: "Settings",
          notes: [
            { name: "System light/dark mode", text: "The panel follows Figma's light or dark theme. Untick the box to choose your own with the sun or moon button beside the cog." },
            { name: "Ignore hidden layers", text: "Leaves out every error on a hidden layer, so the bloom and the report count only visible layers." },
            { name: "Errors and Tokens", text: "Each check can be turned off on its own, and the box by Errors or Tokens turns the whole group on or off. A check that is off leaves the bloom, the filter bar and the report." },
            { name: "Low resolution", text: "The resolution an image must reach at the size it is placed: 72, 144 or 300 dpi. This is the number beside the dot at the top of the panel." },
            { name: "Check frame dimensions in file names", text: "Compares the size in a frame's name with the frame's real size, and puts a pink arrow on the dot of any frame that does not match." },
            { name: "Upload max resolution", text: "Off: Bloom checks the image you pick against the dpi above, at its largest use on the page, and warns you if it will fall short. On: the image goes in at its full size and Bloom tells you the dpi it reached." },
            { name: "Generate as", text: "New layer puts the hi-res image in the main component, over the low-res one, so every instance gets it. New instance puts it in a copy of the instance beside the original and leaves the original alone. On a main component, it goes in a new hi-res variant." },
            { name: "Replay welcome tour", text: "Walks you through the panel again, as on the first run." },
          ],
        },
      ],
    },
  ],
};
