// Frame Multiplier's panel, explained (src/_data/panels.js): its words are the plugin's tooltips, legend and listing
// (monocode.campaign-manager src/main/apps/rollout/ui/ui.html and ui.ts, docs/frame-multiplier-listing.md). Drawings:
// src/_includes/panel/frame-multiplier/, drawn from fm-panel.js.
import { frameMultiplierPanel } from "../fm-panel.js";

export default {
  name: "Frame Multiplier",
  intro: "Frame Multiplier works from one panel in Figma, in two tabs, Setup and Frames, with its settings behind the cog. Each number says what a part of the panel does, and the note beside it lights up as you point at it.",
  art: frameMultiplierPanel(),
  tabs: [
    {
      id: "setup", label: "Setup",
      summary: "Where the masters come from, and what each of their components is: its role, and how it behaves when a frame changes shape.",
      tiles: [
        {
          id: "setup", label: "Setup",
          notes: [
            { name: "Masters page", text: "The page the masters are read from. Every visible frame on it is a master; a page named [MASTERS] or [TEMPLATES] is found on its own." },
            { name: "Okay", text: "Reads the masters on that page and works out each layer's role and behaviour. Only the masters: the page you are on is left alone." },
            { name: "Concept", text: "Masters that share a hero or background component, or a [bracket] label, are one concept, so a page can hold several creatives at once. Click it to show its masters in Figma." },
            { name: "Role", text: "Background, hero, bg/hero, headline, logo, legal or other, each with its glyph. The engine's guess until you pick one; a role you pick is set on every master the layer is in." },
            { name: "P · Pin", text: "Position held by a corner or an anchor point. A headline anchors by its place on the frame and by its text alignment, A for automatic." },
            { name: "C · Clamp", text: "Keeps an image edge from coming into the frame. A hero: the edges you set. A background: the edges it covers on every master, NSEW for all four." },
            { name: "Fo · Focal", text: "Helps place the image accurately. A means it was found from the picture; draw a path named focal for the best results." },
            { name: "Co · Collision", text: "The hero nudges, then scales, to keep clear of the copy. On copy it is a switch, one for each component." },
            { name: "S · Stretch", text: "Keep a layer uniform, or stretch it to fill." },
          ],
        },
      ],
    },
    {
      id: "frames", label: "Frames",
      summary: "Every frame on the page, scored against its masters, and multiplied in one undo step.",
      tiles: [
        {
          id: "frames", label: "Frames",
          notes: [
            { name: "Scan for updates", text: "Reads every frame on this page and every master again, then works the plan out afresh. When every frame already matches its masters, it says No updates found." },
            { name: "Multiply", text: "Fills every frame on the page that would change from its masters: layers added, swapped, removed or restacked, then placed, in one undo step. Locked and ready-for-dev frames are left alone, and each frame is read again afterwards for its verified score." },
            { name: "Master", text: "M and a master's size, with the frames nearest its proportions under it, and how it is composed: where its hero sits, and its headline in relation to it." },
            { name: "Score", text: "How well a frame is laid out: the background's coverage, the subject inside the safe area, overlaps, and drift from the masters' proportions, less what any nudge or scale cost. Grey is forecast from the plan; green, orange and red were measured on the frame as it is." },
            { name: "What a frame needs", text: "Multiply ready while it is empty, updates available with the first difference once it has layers, and verified when it matches its plan, with any nudge or scale it took. A locked layer is named in orange and stays where it is." },
            { name: "The plan, drawn", text: "Click a frame to see its plan drawn over it: its ratio and how it is composed, what the score found, and the layers that need to change, marching on the preview." },
            { name: "One frame at a time", text: "Show in Figma selects the frame, Multiply this one fills just this frame, and Promote to master copies it to the masters page." },
            { name: "What was read", text: "The page, its frames and masters, and how many wait to be multiplied or updated." },
          ],
        },
      ],
    },
    {
      id: "settings", label: "Settings",
      summary: "Behind the cog: how the panel looks, how the engine blends, and two tools, a brief made into frames and a page cleared.",
      tiles: [
        {
          id: "settings", label: "Settings",
          notes: [
            { name: "System light/dark mode", text: "The panel follows Figma's light or dark theme. Untick it to choose your own." },
            { name: "Smart blending", text: "When a frame's nearest master leaves the hero needing a nudge, try the masters' other layouts too and keep whichever needs the least correction. Off: always use the nearest master's layout. It is kept in the file, so everyone opening it gets the same frames." },
            { name: "Freeze chips", text: "Shows a chip for each role on the Frames tab. Click one off and that role stays exactly where it is in every frame." },
            { name: "Template mode", text: "Shows Template mode under Masters, which keeps a frame's extra layers instead of removing them." },
            { name: "Import brief with AI", text: "Makes pages and empty frames from your brief, in five steps: the job, what to build, a prompt you take to your own AI chat with the brief attached, its answer pasted back, and a review. The plugin never talks to an AI, and the AI never sees the file." },
            { name: "Clear frames on this page", text: "Takes every layer out of every frame on the page you are on, never the masters page. The first click says how many; the second clears them." },
          ],
        },
      ],
    },
  ],
};
