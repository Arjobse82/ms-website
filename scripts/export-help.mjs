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
// A url from the site's root ("/assets/img/x.webp", Automated Assemblr's panel) names its file from the root and is
// rewritten relative to its stylesheet, because the page is published under a path of its own.
const rewritten = new Map();
for (const css of [...files].filter((f) => f.endsWith(".css"))) {
  let text = readFileSync(join(site, css), "utf8");
  for (const [, url] of text.matchAll(/url\("?([^")]+)"?\)/g)) {
    if (/^(data:|https?:|#)/.test(url)) continue;
    if (url.startsWith("/")) files.add(url.slice(1).replace(/[?#].*$/, ""));
    else files.add(posix.normalize(posix.join(posix.dirname(css), url)));
  }
  text = text.replace(/url\("?(\/[^")]+)"?\)/g, (_, url) => `url("${posix.relative(posix.dirname(css), url.slice(1))}")`);
  rewritten.set(css, text);
}
if ([...files].some((f) => f.startsWith("assets/fonts/"))) files.add("assets/fonts/Inter-OFL.txt");

for (const f of files) {
  mkdirSync(join(out, dirname(f)), { recursive: true });
  if (rewritten.has(f)) writeFileSync(join(out, f), rewritten.get(f));
  else copyFileSync(join(site, f), join(out, f));
}
// A link to another page of the website goes to that plugin's own help page, the one published page it can reach.
const SIBLINGS = {
  "/indesign/assemblr/": "https://monochromesystems.github.io/assemblr-help/",
  "/photoshop/assemblr/": "https://monochromesystems.github.io/assemblr-photoshop-help/",
};
html = html.replace(/href="(\/[^"#?]*\/)"/g, (m, href) => (SIBLINGS[href] ? `href="${SIBLINGS[href]}"` : m));
// The page at the folder's root, its paths relative to it.
html = html.replace(/((?:src|href)=")\/((?:assets\/|favicon))/g, "$1$2");
writeFileSync(join(out, "index.html"), html);
// Served as it is, not through Jekyll.
if (!existsSync(join(out, ".nojekyll"))) writeFileSync(join(out, ".nojekyll"), "");
console.log(`${join(out, "index.html")} and ${files.size} files:\n  ${[...files].sort().join("\n  ")}`);
