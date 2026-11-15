// Frame Multiplier's panel, explained (src/_data/panels.js): its words are the plugin's tooltips, legend and listing
// (monocode.campaign-manager src/main/apps/rollout/ui/ui.html and ui.ts, docs/frame-multiplier-listing.md). Drawings:
// src/_includes/panel/frame-multiplier/, drawn from fm-panel.js.
import { frameMultiplierPanel } from "../fm-panel.js";

export default {
  name: "Frame Multiplier",
  intro: "Frame Multiplier has one panel in Figma with two tabs, Setup and Frames, and its settings behind the cog. Each number marks a part of the panel, and its note lights up when you point at it.",
  art: frameMultiplierPanel(),
  tabs: [
    {
      id: "setup", label: "Setup",
      summary: "Where the masters come from, and the role and behaviour of each of their components when a frame changes shape.",
      tiles: [
        {
          id: "setup", label: "Setup",
          notes: [
            { name: "Masters page", text: "The page Frame Multiplier reads the masters from. Every visible frame on it is a master. A page named [MASTERS] or [TEMPLATES] is found automatically." },
            { name: "Okay", text: "Reads the masters on that page and works out each layer's role and behaviour. It reads only the masters and leaves the page you are on alone." },
            { name: "Concept", text: "Masters that share a hero or background component, or a [bracket] label, form one concept, so a page can hold several creatives at once. Click a concept to show its masters in Figma." },
            { name: "Role", text: "Background, hero, bg/hero, headline, logo, legal or other, each with its glyph. Until you pick one, the role is the engine's guess. A role you pick is set on every master the layer is in." },
            { name: "P · Pin", text: "Holds the position by a corner or an anchor point. A headline anchors by its place on the frame and its text alignment, with A for automatic." },
            { name: "C · Clamp", text: "Keeps an image edge from coming into the frame. On a hero, it clamps the edges you set. On a background, it clamps the edges the image covers on every master, and NSEW means all four." },
            { name: "Fo · Focal", text: "Helps place the image accurately. A means the focal point was found from the picture. For the best results, draw a path named focal." },
            { name: "Co · Collision", text: "The hero nudges, then scales, to keep clear of the copy. On copy, it is a switch for each component." },
            { name: "S · Stretch", text: "Choose whether a layer scales uniformly or stretches to fill." },
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
            { name: "Scan for updates", text: "Reads every frame on this page and every master again, then works out the plan again. When every frame already matches its masters, it says No updates found." },
            { name: "Multiply", text: "Fills every frame on the page that would change from its masters, in one undo step. Layers are added, swapped, removed or restacked, then placed. Locked and ready-for-dev frames are left alone, and each frame is read again afterwards to give its verified score." },
            { name: "Master", text: "M and the master's size, with the frames nearest its proportions listed under it. It also shows how the master is composed: where its hero sits, and where its headline sits in relation to the hero." },
            { name: "Score", text: "How well a frame is laid out. It counts the background's coverage, the subject inside the safe area, overlaps and drift from the masters' proportions, less what any nudge or scale cost. Grey is a forecast from the plan; green, orange and red were measured on the frame as it is." },
            { name: "What a frame needs", text: "A frame reads Multiply ready while it is empty, and updates available, with the first difference, once it has layers. It reads verified when it matches its plan, along with any nudge or scale it took. A locked layer is named in orange and stays where it is." },
            { name: "The plan, drawn", text: "Click a frame to see its plan drawn over it: its ratio, how it is composed, what the score found, and the layers that need to change, which march on the preview." },
            { name: "One frame at a time", text: "Show in Figma selects the frame, Multiply this one fills just this frame, and Promote to master copies it to the masters page." },
            { name: "What was read", text: "The page, its frames and masters, and how many frames are waiting to be multiplied or updated." },
          ],
        },
      ],
    },
    {
      id: "settings", label: "Settings",
      summary: "Behind the cog: the panel's look, how the engine blends masters, and two tools, one that makes frames from a brief and one that clears a page.",
      tiles: [
        {
          id: "settings", label: "Settings",
          notes: [
            { name: "System light/dark mode", text: "The panel follows Figma's light or dark theme. Untick it to choose your own." },
            { name: "Smart blending", text: "When a frame's nearest master leaves the hero needing a nudge, Frame Multiplier also tries the masters' other layouts and keeps whichever needs the least correction. Off: it always uses the nearest master's layout. The setting is saved in the file, so everyone who opens it gets the same frames." },
            { name: "Freeze chips", text: "Shows a chip for each role on the Frames tab. Click one off and that role stays exactly where it is in every frame." },
            { name: "Template mode", text: "Shows Template mode under Masters, which keeps a frame's extra layers instead of removing them." },
            { name: "Import brief with AI", text: "Makes pages and empty frames from your brief, in five steps: the job, what to build, a prompt you take to your own AI chat with the brief attached, its answer pasted back, and a review. The plugin never talks to an AI, and the AI never sees the file." },
            { name: "Clear frames on this page", text: "Takes every layer out of every frame on the page you are on, and never touches the masters page. The first click tells you how many frames; the second clears them." },
          ],
        },
      ],
    },
  ],
};
