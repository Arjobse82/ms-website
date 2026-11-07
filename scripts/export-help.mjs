// Copies a help page (src/help/*.njk, built by Eleventy) and only the files it uses into a folder of its own, its paths
// made relative, so it can be published on its own: Assemblr's help pages are published with GitHub Pages from
// monochromesystems/assemblr-help and monochromesystems/assemblr-photoshop-help. Run `npx @11ty/eleventy` first.
//
//   node scripts/export-help.mjs help/assemblr ../assemblr-help [_site]
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";

const [page, out, site = "_site"] = process.argv.slice(2);
if (!page || !out) throw new Error("usage: node scripts/export-help.mjs <page, e.g. help/assemblr> <folder> [built site]");

let html = readFileSync(join(site, page, "index.html"), "utf8");
const files = new Set();
// Every file the page names from the site's root: its styles, its script, its images, its icon.
for (const [, path] of html.matchAll(/(?:src|href)="\/((?:assets\/|favicon)[^"?#]*)/g)) files.add(path);
// And every file its styles name in turn (the fonts), with the fonts' licence.
for (const css of [...files].filter((f) => f.endsWith(".css"))) {
  for (const [, url] of readFileSync(join(site, css), "utf8").matchAll(/url\("?([^")]+)"?\)/g)) {
    if (!/^(data:|https?:|#)/.test(url)) files.add(posix.normalize(posix.join(posix.dirname(css), url)));
  }
}
if ([...files].some((f) => f.startsWith("assets/fonts/"))) files.add("assets/fonts/Inter-OFL.txt");

for (const f of files) {
  mkdirSync(join(out, dirname(f)), { recursive: true });
  copyFileSync(join(site, f), join(out, f));
}
// The page at the folder's root, its paths relative to it.
html = html.replace(/((?:src|href)=")\/((?:assets\/|favicon))/g, "$1$2");
writeFileSync(join(out, "index.html"), html);
// Served as it is, not through Jekyll.
if (!existsSync(join(out, ".nojekyll"))) writeFileSync(join(out, ".nojekyll"), "");
console.log(`${join(out, "index.html")} and ${files.size} files:\n  ${[...files].sort().join("\n  ")}`);
