// A plugin's dashboard, in its product page's hero (partials/dashboard.njk), and the list of its widgets under it.
// Studio Tools': Bloom's Measure dashboard, the screen the plugin opens on (src/_lib/studio-dashboard.js draws it).
import { studioDashboard } from "../_lib/studio-dashboard.js";

export default {
  "studio-tools": studioDashboard(),
};
