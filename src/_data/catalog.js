// Derived from apps.json and site.json: URLs, menu links, related products.
// Edit those two files, not this one.
import { readFileSync } from "node:fs";

const read = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));

export default function () {
  const site = read("./site.json");

  const base = read("./apps.json").map((app) => {
    const url = `/${app.slug}/`;
    const products = app.products.map((product) => ({
      focus: "50% 50%",
      zoom: 1,
      getUrl: "",
      ...product,
      // A plain tile in place of a photo: the product's `tile` ("black", "white" or "radial"), or black when it has no photo.
      tile: product.tile ?? (product.photo ? null : "black"),
      // A standalone app has one product, and the app page is that product's page.
      url: app.standalone ? url : `${url}${product.slug}/`,
      appSlug: app.slug,
      appName: app.name,
      appUrl: url,
      kind: app.kind,
      standalone: Boolean(app.standalone),
      features: (product.features ?? site.features).map((f) => ({
        ...f,
        text: f.text.replaceAll("{app}", app.name),
      })),
      specs: product.specs ?? [
        { label: "Works with", value: app.name },
        { label: "Availability", value: product.getUrl ? "Available now" : "Coming soon" },
        { label: "Price", value: product.price ?? "To be announced" },
        ...(product.trial ? [{ label: "Free trial", value: product.trial }] : []),
      ],
    }));
    const menuLinks = app.standalone
      ? [
          { label: "Overview", url: `${url}#overview` },
          { label: "Highlights", url: `${url}#features` },
          { label: "Tech specs", url: `${url}#specs` },
        ]
      : [
          { label: "How to install", url: `${url}#install` },
          { label: "Why Monochrome", url: `${url}#why` },
        ];
    return { ...app, url, products, menuLinks };
  });

  const all = base.flatMap((app) => app.products);

  // No photo is used by two products (the owner, 2026-10-28): each product's picture is its own. One product in two
  // apps (Assemblr, in InDesign and in Photoshop, one slug) is one product, with one picture (the owner, 2026-11-03).
  const byPhoto = new Map();
  for (const p of all) {
    if (!p.photo || p.tile) continue;
    const other = byPhoto.get(p.photo);
    if (other && other.slug !== p.slug) throw new Error(`Photo "${p.photo}" is used by both ${other.url} and ${p.url}: give one of them another photo, or a plain "tile".`);
    byPhoto.set(p.photo, p);
  }

  // Plain copies, so the data has no cycles: siblings first, then the rest of the catalog.
  const relatedTo = (product) => {
    const siblings = all.filter((p) => p.appSlug === product.appSlug && p !== product);
    const others = all.filter((p) => p.appSlug !== product.appSlug);
    return [...siblings, ...others].slice(0, 4).map((p) => ({ ...p }));
  };

  const apps = base.map((app) => ({
    ...app,
    products: app.products.map((p) => ({ ...p, related: relatedTo(p) })),
  }));

  return {
    apps,
    // Every product, for the home page lineup.
    allProducts: apps.flatMap((app) => app.products),
    // One entry per product (Assemblr is in InDesign and Photoshop), with every app it works in, for the compact lineup row.
    lineup: [...apps.flatMap((app) => app.products).reduce((m, p) => {
      const seen = m.get(p.slug);
      if (seen) seen.appNames.push(p.appName);
      else m.set(p.slug, { ...p, appNames: [p.appName] });
      return m;
    }, new Map()).values()],
    // Products that get their own page under their app.
    products: apps.filter((app) => !app.standalone).flatMap((app) => app.products),
  };
}
