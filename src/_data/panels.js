// Plugin panels explained on their product pages (partials/panel-tour.njk), keyed by a product's `panel` (apps.json).
// Each is a module in src/_lib/panels/: the panel's name, `intro` (the section's opening line), optionally the
// section's `label`, `heading` and local-nav `nav` ("The panel", "Every setting, explained", "Panel" otherwise), and its tabs, a section
// a tab, each with its tiles and, for each tile, what its numbered parts do. A tab with one tile shows it without the
// tile bar; `art` is anything a panel's drawings are drawn from. The words are the plugin's own where it has them, so
// keep them in step with it. Each tile's drawing is src/_includes/panel/<panel>/<tile>.njk, its numbered marks the
// tile's notes in order, and a panel's own look is src/assets/css/panels/<panel>.css (after `uses`, a panel whose look
// it shares). `help`, if it has one, is a Help section after it: tasks step by step and what the panel's messages mean.
// `how`, if it has one, is How it works before the demo and the guide: its steps, each a drawing,
// src/_includes/panel/<panel>/how-<step>.njk (partials/panel-how.njk).

import catalogueProducer from "../_lib/panels/catalogue-producer.js";
import frameMultiplier from "../_lib/panels/frame-multiplier.js";
import idmlExport from "../_lib/panels/idml-export.js";
import assemblr from "../_lib/panels/assemblr.js";
import assemblrPhotoshop from "../_lib/panels/assemblr-photoshop.js";
import bloom from "../_lib/panels/bloom.js";
import adAgent from "../_lib/panels/ad-agent.js";
import studioTools from "../_lib/panels/studio-tools.js";

export default {
  "catalogue-producer": catalogueProducer,
  "frame-multiplier": frameMultiplier,
  "idml-export": idmlExport,
  assemblr,
  "assemblr-photoshop": assemblrPhotoshop,
  bloom,
  "ad-agent": adAgent,
  "studio-tools": studioTools,
};
