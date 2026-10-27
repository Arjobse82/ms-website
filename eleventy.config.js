import { HtmlBasePlugin } from "@11ty/eleventy";

// Web images made by scripts/build-images.sh: the widths on disk and the size of the largest.
const photos = {
  facade: { widths: [800, 1600, 2400], width: 2400, height: 1589 },
  granite: { widths: [800, 1600, 2400], width: 2400, height: 1589 },
  "granite-tall": { widths: [800, 1600], width: 1600, height: 2415 },
};

export default function (eleventyConfig) {
  // Prefixes root-relative URLs with pathPrefix, so the same templates work
  // at username.github.io/repo/ and later at the root of a custom domain.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.addGlobalData("env", {
    siteUrl: (process.env.SITE_URL || "http://localhost:8080").replace(/\/$/, ""),
  });
  eleventyConfig.addGlobalData("build", {
    year: new Date().getFullYear(),
    version: Date.now().toString(36),
  });

  // 1 -> "01", for step and feature numbers.
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(2, "0"));

  // {% photo "granite", { class: "tile-photo", sizes: "50vw" } %}
  eleventyConfig.addShortcode("photo", (name, options = {}) => {
    const photo = photos[name];
    if (!photo) throw new Error(`Unknown photo "${name}". Known: ${Object.keys(photos).join(", ")}`);
    const { class: className = "", sizes = "100vw", alt = "", eager = false } = options;
    const url = (w) => `/assets/img/${name}-${w}.webp`;
    const srcset = photo.widths.map((w) => `${url(w)} ${w}w`).join(", ");
    const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
    return `<img class="${className}" src="${url(photo.widths[1] ?? photo.widths[0])}" srcset="${srcset}" sizes="${sizes}" width="${photo.width}" height="${photo.height}" alt="${alt}" ${loading} decoding="async">`;
  });
}

export const config = {
  dir: { input: "src", output: "_site" },
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
  pathPrefix: process.env.PATH_PREFIX || "/",
};
