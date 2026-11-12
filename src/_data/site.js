// The site's words come from content/site.txt. Edit that file, not this one.
import { readSite } from "../_lib/content.js";

export default function () {
  return readSite();
}
