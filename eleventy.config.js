import { HtmlBasePlugin } from "@11ty/eleventy";

// Web images made by scripts/build-images.sh: the widths on disk, the size of the largest, and how far the photo is
// turned (degrees; the brand turns and zooms its photos, so they are not obvious at a glance).
const photos = {
  facade: { widths: [800, 1600, 2400], width: 2400, height: 1589, turn: 90 },
  granite: { widths: [800, 1600, 2400], width: 2400, height: 1589, turn: 180 },
  "granite-tall": { widths: [800, 1600], width: 1600, height: 2415, turn: -90 },
  "frame-multiplier": { widths: [800, 1600, 2400], width: 2400, height: 1589, turn: -90 },
  bloom: { widths: [800, 1600, 2400], width: 2400, height: 1589, turn: 90 },
  // A video's poster stays upright: it carries the product's name.
  "assemblr-intro": { widths: [800, 1280], width: 1280, height: 720 },
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

  // {% photo "granite", { class: "tile-photo", sizes: "50vw", turn: 90, centre: "40% 25%" } %}   (turn: the photo's own
  // unless given; centre, for a turned photo: the point of it, in its own fractions before it is turned, that sits in the
  // middle of its box, site.js placing it there as far as the photo's edges allow)
  // Every photo is followed by its tint (.photo-tint, main.css): a grey layer over the picture that dulls it down, under
  // whatever the photo's container draws on top.
  eleventyConfig.addShortcode("photo", (name, options = {}) => {
    const photo = photos[name];
    if (!photo) throw new Error(`Unknown photo "${name}". Known: ${Object.keys(photos).join(", ")}`);
    const { class: className = "", sizes = "100vw", alt = "", eager = false, turn = photo.turn ?? 0, centre } = options;
    // A turned photo grows to keep covering its box: site.js works out how far (--cover), main.css turns it.
    const turned = (((turn % 360) + 360) % 360) !== 0
      ? ` data-turn${centre ? ` data-centre="${centre}"` : ""} style="--turn: ${turn}deg"` : "";
    const url = (w) => `/assets/img/${name}-${w}.webp`;
    const srcset = photo.widths.map((w) => `${url(w)} ${w}w`).join(", ");
    const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
    return `<img class="${className}"${turned} src="${url(photo.widths[1] ?? photo.widths[0])}" srcset="${srcset}" sizes="${sizes}" width="${photo.width}" height="${photo.height}" alt="${alt}" ${loading} decoding="async"><span class="photo-tint" aria-hidden="true"></span>`;
  });

  // {% slide "bloom-tour-1", "What the slide shows" %}: one slide of a product's tour (scripts/build-images.sh), 1920 × 1080.
  // A screen, not a photo: never tinted or turned, and its alt text says what it shows.
  const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  eleventyConfig.addShortcode("slide", (name, alt = "") => {
    const url = (w) => `/assets/img/${name}-${w}.webp`;
    return `<img class="slide-image" src="${url(1920)}" srcset="${url(960)} 960w, ${url(1920)} 1920w" sizes="(max-width: 734px) 86vw, 860px" width="1920" height="1080" alt="${attr(alt)}" loading="lazy" decoding="async">`;
  });
}

export const config = {
  dir: { input: "src", output: "_site" },
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
  pathPrefix: process.env.PATH_PREFIX || "/",
};
