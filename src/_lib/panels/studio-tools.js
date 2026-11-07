// Studio Tools' Setup tab, explained (src/_data/panels.js): the tab of Bloom's Measure dashboard where a brand's logo
// size, clear space and corner are kept, for every channel and every pixel size; the fix that puts a logo right is
// bloom/src/ui/index.js fixLogoClearspaceFrame and fixAllOnChart. Its words are the plugin's own labels, notes
// and tooltips (monocode.campaign-manager bloom/src/ui/channelPanel.js; the save in
// src/main/apps/bloom/assets/assets.js handle_SAVE_ASSET_CONFIG). Drawing: src/_includes/panel/studio-tools/setup.njk,
// drawn from studio-dashboard.js studioSetup(): its logo table only.
import { studioSetup } from "../studio-dashboard.js";

export default {
  name: "Studio Tools",
  label: "Logo",
  heading: "Logo size and position, on every frame",
  nav: "Logo",
  intro: "Bloom checks the logo in every frame: its size, the clear space round it and the corner it sits in. You set the rules once, in the dashboard’s Setup tab, for every channel and down to a single pixel size, and they are saved with the brand. A frame that is off is flagged, and a double-click resizes its logo and moves it to its place, one frame or every frame on a chart at once. Each number says what a part of it does, and the note beside it lights up as you point at it.",
  art: studioSetup(),
  tabs: [
    {
      id: "setup", label: "Setup",
      summary: "The Channels table of the dashboard’s Setup tab: the logo’s size, clear space and corner for all channels, for each channel and for each size. Each change is saved as you make it, and the page is measured again when you leave the tab.",
      tiles: [
        {
          id: "setup", label: "Setup",
          notes: [
            { name: "Logo", text: "The logo’s size as a % of the frame: 4% unless you change it. All channels is the row of defaults every channel inherits." },
            { name: "Pad ↔", text: "The clear space on the logo’s open side edge, as a % of the logo, 25% to begin with. It is measured from the logo’s width, LW, or its height, LH, as you pick under it." },
            { name: "Pad ↕", text: "The clear space below the logo when it sits on a baseplate, as a % of the logo, 14.5% to begin with, measured from its height or its width." },
            { name: "Align", text: "The corner a fix anchors the logo to: SW, SE, NW, NE, or C for the centre. – leaves it in the corner it is nearest." },
            { name: "Lock", text: "Freezes the defaults so they can’t be changed by mistake. Each channel and each one-off has a lock of its own." },
            { name: "A channel", text: "OOH, Social, Display, Website and EDM each have a row: the channel’s own logo size, padding and corner, over the defaults. A grey value is inherited from All channels; type one to set it for that channel alone. The ring beside a name colours its tile on the dashboard, and + Add channel adds one of your own." },
            { name: "Logo, Pad and Base", text: "A channel’s sizes, each with its own spec, saved for that pixel size: the logo as a % of the frame, its padding as a % of the logo’s height, and the baseplate’s height in px. Every frame of that size is checked against these alone; a blank cell falls back to that size’s campaign average." },
            { name: "Loc", text: "The logo’s place at that size. Off, it snaps to the bottom-right corner; on, the plugin captures one frame’s logo position and reuses it for the rest." },
            { name: "Custom", text: "One-off frames, each checked against its own saved logo and baseplate position, and never charted. Give one a label and a size, then pick the positions to save: Logo, Baseplate, or both." },
          ],
        },
      ],
    },
  ],
};
