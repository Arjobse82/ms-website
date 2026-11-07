// Bloom's panel, explained (src/_data/panels.js): the published plugin, which has Build mode only (monocode.campaign-
// manager docs/bloom-build-standalone-plan.md §1–2: no Measure, Overview, reports or spec panels). Its words are the
// plugin's tooltips, welcome tour and listing (bloom/src/ui/index.js, filterBar.js, measureUpdate.js _block1Sentence,
// bloom/welcome-tour-steps.csv, bloom/bloom-config.json bloomOptSpec, docs/bloom-build-listing.md) and what its fixes do
// (src/main/apps/bloom/fixes/fixes.js, tokens/tokenScan.js). Drawings: src/_includes/panel/bloom/, drawn from
// bloom-panel.js, the same job as the hero's live bloom (src/_data/jobs.js).
import { bloomPanel } from "../bloom-panel.js";

export default {
  name: "Bloom",
  intro: "Bloom works from one panel in Figma: the bloom, a line under it that sums the page up, and its settings behind the cog. Each number says what a part of the panel does, and the note beside it lights up as you point at it.",
  art: bloomPanel(),
  tabs: [
    {
      id: "fix", label: "Find and fix",
      summary: "Every mark leads to its layer on the canvas, and many can be fixed from the bloom with a double-click.",
      tiles: [
        {
          id: "fix", label: "Find and fix",
          notes: [
            { name: "Resolution", text: "This dot checks image resolution only: green when every image clears the dpi beside it, amber or red when one is too soft. Point at it for how many fall short and the softest." },
            { name: "A frame's marks", text: "Point at a mark and the other marks on its frame gather round it. Click it to hold them there and go to its layer on the canvas; click the bloom's background to let them go." },
            { name: "Double-click to fix", text: "An off-grid layer snaps to whole pixels, a hidden one is shown, a stretched component or image gets its proportions back and an aspect ratio is locked. On a low-resolution image, a double-click asks for the hi-res file instead." },
            { name: "Dismiss", text: "Right-click a mark to take it off the bloom and out of the report until the plugin closes. When its component is flagged more than once, Dismiss all takes every one; right-click the type's icon in the filter bar to bring them back." },
            { name: "A frame's dot", text: "Each frame is a dot on the rim: solid if it is landscape, a ring if portrait, larger the bigger it is, with its healthy layers fanned out from it, a white glyph standing for ten. Click it to go to the frame; double-click it to snap every off-grid layer in it to whole pixels." },
            { name: "Fix all on this frame", text: "With a frame selected on the canvas, the centre of the bloom shows a glyph for each kind of error on it that can be fixed in one go: off-grid, hidden, stretched or an unlocked aspect ratio. Double-click it to fix them all; while you hold a mark, it offers the same for that mark's kind when the frame has more than one." },
            { name: "Report", text: "The page's issues in a line of plain English, up to three kinds with how many of each. It changes as you fix things, and counts what you have dismissed." },
          ],
        },
      ],
    },
    {
      id: "tokens", label: "Token fixes",
      summary: "A raw value fixed from the corner of the panel: bound to a variable or style you already have, or made into a new one.",
      tiles: [
        {
          id: "tokens", label: "Token fixes",
          notes: [
            { name: "A token's mark", text: "A token is a value typed in rather than taken from a variable or style: a fill or stroke colour, a corner radius, or text with no text style. Click its mark to see its fixes in the corner; click it again to close them." },
            { name: "The raw value", text: "What the mark found, with its glyph: here a corner radius of 25. A shape with more than one raw corner shows each value in turn as you fix them." },
            { name: "Matches", text: "The variables, or styles, it could use instead, the nearest value first. Click one to bind the layer to it; unstyled text is offered the file's text styles, by their first two letters." },
            { name: "+", text: "Makes a new local variable from the raw value and binds the layer to it. For a colour it asks for a name first, starting with Color/ and the hex. There is none for text, and none for a library, which Bloom cannot write to." },
            { name: "LOCAL", text: "The file's own variables and styles. Click it for your design system's instead, under its library's name: a connected team library's variables, and its styles already used in the file. When the library has any that fit, they open first." },
          ],
        },
      ],
    },
    {
      id: "settings", label: "Settings",
      summary: "Behind the cog: which checks run, how sharp an image must be, and how a hi-res image goes in.",
      tiles: [
        {
          id: "settings", label: "Settings",
          notes: [
            { name: "System light/dark mode", text: "The panel follows Figma's light or dark theme. Untick it to choose your own, with a sun or moon button beside the cog." },
            { name: "Ignore hidden layers", text: "Leaves out every error on a layer that is hidden, so the bloom and the report count only what shows." },
            { name: "Errors and Tokens", text: "Each check can be turned off on its own, and the box by Errors or Tokens turns the whole group on or off. A check that is off leaves the bloom, the filter bar and the report." },
            { name: "Low resolution", text: "The resolution an image must reach at the size it is placed: 72, 144 or 300 dpi. The number beside the dot at the top of the panel is this one." },
            { name: "Check frame dimensions in file names", text: "Compares the size in a frame's name with the frame's real size, and puts a pink arrow on the dot of any frame that does not match." },
            { name: "Upload max resolution", text: "Off, Bloom checks the image you pick against the dpi above, at its largest use on the page, and warns if it will fall short. On, the image goes in at its full size, and Bloom says the dpi it reached." },
            { name: "Generate as", text: "New layer puts the hi-res image in the main component, over the low-res one, so every instance gets it. New instance puts it in a copy of the instance beside the original, which is left alone; on a main component, in a new hi-res variant." },
            { name: "Replay welcome tour", text: "Walks you through the panel again, as on the first run." },
          ],
        },
      ],
    },
  ],
};
