// A plugin's principles as a diagram, in its product page's hero (partials/diagram.njk): its steps left to right, each a
// drawing and a line or two. Frame Multiplier's are drawn by src/_lib/fm-diagram.js, from a model of how the plugin
// lays a size out (its listing, docs/frame-multiplier-listing.md, and its role rules, src/main/apps/rollout/engine/roles.ts,
// in monocode.campaign-manager); the layer names are the plugin's own example (its Component Setup slide).
import { frameMultiplierDiagram } from "../_lib/fm-diagram.js";

const fm = frameMultiplierDiagram();

export default {
  "frame-multiplier": {
    title: "A few masters, every size",
    summary: "Six masters, tall to wide, each with its components in roles. Every other size is laid out from the one or two masters nearest its ratio, blended between them, and where the blend would put the hero under the headline, the hero is nudged clear and then scaled.",
    steps: [
      { id: "masters", name: "Build", svg: fm.masters,
        text: "Build your masters: a few finished layouts, tall to wide, each laid out for its own shape. The more masters you give it, the better every resize in between comes out." },
      { id: "layers", name: "Components", svg: fm.layers,
        text: "Every component of a master has a role: background, hero, headline, logo, legal or other. One named for its role (BG, HERO, HEADLINE, LOGO, Disclaimer) takes it outright; the rest are read from how they sit, and any can be set by hand." },
      { id: "resizes", name: "Resizes", svg: fm.resizes,
        text: "Six masters become hundreds of resizes, each laid out layer by layer from the masters nearest its ratio: blended between two, by where its ratio falls between theirs (the shares under it), or taken from the one beyond. Where the blend puts the hero under the headline, the hero is nudged clear, then scaled when the nudge runs out of room." },
    ],
  },
};
