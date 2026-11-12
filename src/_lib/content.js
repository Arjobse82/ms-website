// Reads the site's words from the plain text files in /content (see content/README.txt for the format).
// Edit those files, not this one.
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../../content/", import.meta.url);

// A text file -> { fields: { key: "value" }, sections: { name: { items: [{ title, text }], pairs: [[key, value]] } } }
//   key: value          a field (before the first "# section")
//   # section           starts a section
//   ## Title            an item of the section: the lines under it are its text
//   key: value          in a section, a pair (a spec's label and value, a tour slide's picture and its description)
export function parseText(src) {
  const fields = {};
  const sections = {};
  let section = null;
  let item = null;
  const flush = () => {
    if (item) item.text = item.lines.join(" ").replace(/\s+/g, " ").trim();
    item = null;
  };
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trimEnd();
    let m;
    if ((m = line.match(/^##\s+(.*)$/))) {
      flush();
      if (!section) throw new Error(`"## ${m[1]}" is outside a "# section"`);
      item = { title: m[1].trim(), lines: [] };
      section.items.push(item);
    } else if ((m = line.match(/^#\s+(.*)$/))) {
      flush();
      section = sections[m[1].trim().toLowerCase()] = { items: [], pairs: [] };
    } else if (!line.trim() || line.startsWith("//")) {
      continue;
    } else if (item) {
      item.lines.push(line.trim());
    } else if ((m = line.match(/^([^:]+):\s*(.*)$/))) {
      if (section) section.pairs.push([m[1].trim(), m[2].trim()]);
      else fields[m[1].trim()] = m[2].trim();
    } else {
      throw new Error(`Cannot read the line "${line}": expected "name: value"`);
    }
  }
  flush();
  return { fields, sections };
}

export function readText(file) {
  const url = new URL(file, root);
  return existsSync(url) ? parseText(readFileSync(url, "utf8")) : null;
}

// Items of a section laid over the data's own items (which keep their icons and the like): the text's order and count win.
const overItems = (base = [], items, map) => items.map((it, i) => ({ ...base[i], ...map(it) }));
const titleText = (it) => ({ title: it.title, text: it.text });

// site.txt -> the site data (name, tagline, principles, features ...)
export function readSite() {
  const t = readText("site.txt");
  return {
    ...t.fields,
    principles: t.sections.principles.items.map((it) => ({ eyebrow: it.title, title: it.lines[0], text: it.lines.slice(1).join(" ") })),
    features: t.sections.features.items.map(titleText),
  };
}

// An app's / a product's text laid over its entry in apps.json.
export function applyApp(app) {
  const t = readText(`${app.slug}/app.txt`);
  if (!t) return app;
  const out = { ...app, ...t.fields };
  if (t.sections.install) out.install = overItems(app.install, t.sections.install.items, titleText);
  return out;
}

export function applyProduct(app, product) {
  const t = readText(`${app.slug}/${product.slug}.txt`);
  if (!t) return product;
  const out = { ...product, ...t.fields };
  const s = t.sections;
  if (s.highlights) out.features = overItems(product.features, s.highlights.items, titleText);
  if (s.specs) out.specs = s.specs.pairs.map(([label, value]) => ({ label, value }));
  // Pricing: its pairs before the first plan (title, intro, note, and a "column: Name: what it is" a price column, in
  // order), then a plan a "##", its first line its prices split by "|" (a column each), the rest what it gets.
  if (s.pricing) {
    const pairs = s.pricing.pairs;
    out.pricing = {
      ...Object.fromEntries(pairs.filter(([k]) => k !== "column")),
      columns: pairs.filter(([k]) => k === "column").map(([, v]) => {
        const [name, ...text] = v.split(":");
        return { name: name.trim(), text: text.join(":").trim() };
      }),
      plans: s.pricing.items.map((it) => ({
        plan: it.title,
        prices: it.lines[0].split("|").map((x) => x.trim()),
        text: it.lines.slice(1).join(" "),
      })),
    };
  }
  if (s.tour) out.tour = s.tour.pairs.map(([image, alt], i) => ({ ...product.tour?.[i], image, alt }));
  if (s.video && product.video) out.video = { ...product.video, ...Object.fromEntries(s.video.pairs) };
  return out;
}

// pages/*.txt -> { home: {...fields}, about: {...}, labels: {...} } for the templates.
export function readPages() {
  const pages = {};
  for (const name of ["home", "about", "labels"]) {
    const t = readText(`pages/${name}.txt`);
    pages[name] = t ? t.fields : {};
  }
  return pages;
}
