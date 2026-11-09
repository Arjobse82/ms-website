// A plugin's live job, in its product page's hero (partials/live-job.njk): a page as the plugin sees it, with one of
// each thing it marks. Bloom's: a display set for a summer campaign, drawn as the bloom (src/_lib/bloom.js) from its
// frames (their names, sizes, and their healthy layers by role) and its marks. Each mark's label, colour and glyph are
// the plugin's (monocode.campaign-manager bloom/src/ui/index.js _errLabel, _tokenLabel and _drawGlyph, bloom-config.json),
// its value line the plugin's own readout ("65 dpi"), `title` the plugin's tooltip for it, and `action` what a
// double-click or a click does there; `text` says in a line what the check found.
import { renderBloom, chip, markColour } from "../_lib/bloom.js";

const FIX = "Double-click to fix";
const TOKEN_FIX = "Click to see fix options";

const frames = [
  { name: "Skyscraper 160×600", w: 160, h: 640, healthy: 6, cats: { text: 2, bg: 2, vector: 1, kv: 1 } },
  { name: "Half page 300×600", w: 300, h: 600, healthy: 9, cats: { text: 3, bg: 2, vector: 2, kv: 2 } },
  { name: "MPU 300×250", w: 300, h: 250, healthy: 7, cats: { text: 3, bg: 2, kv: 2 } },
  { name: "Leaderboard 728×90", w: 728, h: 90, healthy: 5, cats: { text: 2, bg: 1, kv: 2 } },
  { name: "Mobile banner 320×100", w: 320, h: 100, healthy: 4, cats: { text: 2, bg: 1, kv: 1 } },
  { name: "Billboard 970×250", w: 970, h: 250, healthy: 8, cats: { text: 3, bg: 2, vector: 1, kv: 2 } },
  { name: "Large rectangle 336×280", w: 336, h: 280, healthy: 6, cats: { text: 2, bg: 2, kv: 2 } },
  { name: "Square 1080×1080", w: 1080, h: 1080, healthy: 12, cats: { text: 4, bg: 3, vector: 2, kv: 2, at: 1 } },
  { name: "Story 1080×1920", w: 1080, h: 1920, healthy: 14, cats: { text: 5, bg: 3, vector: 3, kv: 2, at: 1 } },
  { name: "Portrait 1080×1350", w: 1080, h: 1350, healthy: 10, cats: { text: 4, bg: 3, vector: 1, kv: 2 } },
];

const errors = [
  { type: "loose", ico: "loose", label: "Loose layer", layer: "Rectangle 12", frame: "Skyscraper 160×600",
    text: "It sits straight in the frame, outside any group or component." },
  { type: "badbg", ico: "badbg", label: "Stretched component", layer: "Button / Primary", frame: "Leaderboard 728×90",
    text: "This instance is scaled unevenly, out of its component's proportions.", action: FIX },
  { type: "detached", ico: "detached", label: "Detached instance", layer: "Logo", frame: "Half page 300×600",
    text: "Detached from its component, it no longer follows the component's changes." },
  { type: "offgrid", ico: "text", label: "Off-grid position", layer: "Headline", frame: "Half page 300×600",
    text: "It sits at X 24.5: neither edge is on a whole pixel. Its mark is its layer's own glyph, T for text.", action: FIX },
  { type: "lowres", ico: "lowres", label: "Low resolution", value: "65 dpi", layer: "pink-box.jpg", frame: "MPU 300×250",
    text: "At this size the image is below the 72 dpi you check for.", action: "Double-click to upload hi-res image" },
  { type: "hidden", ico: "hidden", label: "Hidden layer", layer: "Old price", frame: "MPU 300×250",
    text: "Switched off, but still in the frame, where it is easy to forget.", action: FIX },
  { type: "emptytext", ico: "emptytext", label: "Empty / lorem ipsum text", layer: "Body", frame: "Square 1080×1080",
    text: "The copy still says lorem ipsum." },
  { type: "stretchimg", ico: "img", label: "Stretched image", value: "tan-pillar.png", layer: "Packshot", frame: "Card / Product",
    text: "Its fill is set to Stretch in a component, so it distorts when the component is resized.", action: FIX },
  { type: "lockratio", ico: "lockratio", label: "Aspect ratio unlocked", layer: "Button / Primary", frame: "Component",
    text: "A component without its aspect ratio locked can be scaled out of shape.", action: FIX },
  { type: "namesize", label: "Size ≠ name", value: "160×640 · named 160×600", layer: "Skyscraper 160×600", frame: "Frame",
    text: "The size in the frame's name is not the frame's size. The arrow sits on its frame's dot." },
];

const tokens = [
  { type: "tk-fill", ico: "tk-fill", label: "Raw fill colour", raw: "#ffb400", value: "#FFB400", layer: "Sun", frame: "Half page 300×600",
    text: "A colour typed in, not taken from a variable or style." },
  { type: "tk-stroke", ico: "tk-stroke", label: "Raw stroke colour", raw: "#2ec5ce", value: "#2EC5CE", layer: "Card / Product", frame: "Component",
    text: "An outline colour typed in, not taken from a variable." },
  { type: "tk-type", ico: "tk-type", label: "Unstyled text", layer: "Offer", frame: "Leaderboard 728×90",
    text: "Text set by hand, with no text style." },
  { type: "tk-radius", ico: "tk-radius", label: "Raw corner radius", value: "25", layer: "Card / Product", frame: "Component",
    text: "A radius typed in, not taken from a variable." },
];

// The plugin's tooltip: the label, its value, and what a double-click does (index.js, the marks' <title>).
const titleOf = (m) => m.type === "namesize" ? "Frame size 160×640 · name says 160×600"
  : m.group === "token" ? `${m.label}${m.value ? " " + m.value : ""} — click to see fix options`
  : m.label + (m.value ? (m.type === "lowres" ? ": " : " — ") + m.value : "") + (m.action ? " · " + m.action.toLowerCase() : "");

// Monochrome, the plugin's default: an error mark is ink of its own strength until it is hovered (_monoInkFilter).
const ink = (i) => (0.55 + ((i * 0.618034) % 1) * 0.45).toFixed(2);

const marks = [
  ...errors.map((m, i) => ({ ...m, id: i, group: "error" })),
  ...tokens.map((m, i) => ({ ...m, id: errors.length + i, group: "token" })),
].map((m, i) => ({ ...m, ink: ink(i), action: m.action ?? (m.group === "token" ? TOKEN_FIX : ""), colour: markColour(m) }))
  .map((m) => ({ ...m, title: titleOf(m), chip: chip(m) }));

const job = { name: "DISPLAY SET", file: "Summer Soda", page: "Display set", frames, marks };
const { svg, at } = renderBloom(job);

export default {
  bloom: { ...job, errors: errors.length, tokens: tokens.length, svg, at, box: 276 },
};
