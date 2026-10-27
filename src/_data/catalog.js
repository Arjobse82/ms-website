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
        { label: "Price", value: "To be announced" },
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
    // Products that get their own page under their app.
    products: apps.filter((app) => !app.standalone).flatMap((app) => app.products),
  };
}
