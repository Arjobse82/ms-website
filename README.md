# Monochrome Systems website

A static site built with [Eleventy](https://www.11ty.dev/). Its structure follows apple.com: a dark global nav with flyout menus, app pages with a chapter nav, and product pages with a sticky local nav. Its look is the Monochrome house style shared by Ad Agent and Catalogue Producer: Inter, neutral greys, one signal blue, rectangular buttons, uppercase section labels, status dots, widget tiles and Monochrome's glyph field.

## Run it locally

```sh
npm install
npm start          # http://localhost:8080, reloads on save
npm run build      # writes the site to _site/
```

## Where things live

| To change | Edit |
| --- | --- |
| **The words** on every page: names, taglines, descriptions, prices, highlights, tech specs, tour captions, install steps, headings | the plain text files in `content/` (start with `content/README.txt`) |
| Which apps and products exist, their photos, icons, tiles and Get links | `src/_data/apps.json` |
| Global nav and flyouts | `src/_includes/partials/globalnav.njk` |
| Page layouts | `src/_includes/partials/app-page.njk`, `product-page.njk`, `src/index.njk`, `src/about.njk` |
| Styles | `src/assets/css/main.css` |
| Nav, gallery, local nav and scroll behaviour | `src/assets/js/site.js` |
| The glyph field (horizon, globe, A) | `src/assets/js/glyphs.js`, ported from Ad Agent's `src/app/globe.ts`: never edit it here, compile a newer one with `tsc` |
| Ad Agent's rollout diagram | `src/_data/rollout.js`, `src/_includes/partials/rollout.njk` |
| Assemblr's live demo | `src/assets/js/assemblr-demo.js`, `src/_includes/partials/assemblr-demo.njk`. Its engine, `src/assets/js/assemblr-engine.js`, is Assemblr's own `src/core`, compiled from the catalague-producer repo by `scripts/build-assemblr-engine.sh [commit]`: never edit it here |
| A plugin's panel explained | `src/_data/panels.js` (the registry), each panel's notes in `src/_lib/panels/<panel>.js`, its drawn views in `src/_includes/panel/<panel>/<tile>.njk` (pieces in `src/_includes/panel/ui.njk`), its own look in `src/assets/css/panels/<panel>.css` (loaded only on its page; the shared `.pt-*` look is in `main.css`); `src/_includes/partials/panel-tour.njk`. Automated Assemblr's tile glyphs, `src/_lib/panel-icons.js`, are the plugin's own (catalague-producer `src/ui/shell.html`) |
| Automated Assemblr's flow chart | `src/_data/flows.js`, `src/_includes/partials/flow.njk` |
| Bloom's live job (its hero) | `src/_data/jobs.js` (the frames and marks), `src/_lib/bloom.js` (the bloom, ported from the plugin's own renderer in monocode.campaign-manager `bloom/src/ui/index.js`), `src/_includes/partials/live-job.njk` |
| Frame Multiplier's diagram (its hero) | `src/_data/diagrams.js` (the steps' words), `src/_lib/fm-diagram.js` (the masters, the blend and the drawings), `src/_includes/partials/diagram.njk` |
| Studio Tools' dashboard (its hero and widget list) | `src/_data/dashboards.js` (the registry), `src/_lib/studio-dashboard.js` (the widgets, their art, the page's numbers and each widget's words, from the plugin's own in monocode.campaign-manager `bloom/src/ui/overviewHero.js` and `widgetTiles.js`), `src/_includes/partials/dashboard.njk` and `src/_includes/dashboard/ui.njk` (one widget), its look in `src/assets/css/dashboards/studio-tools.css` (loaded only on its page). The Creatives card's drifting dots are `initDashboards` in `site.js` |
| Product icons | `src/_includes/icons/*.svg`, referenced by `icon` in `apps.json` |
| Figma, Adobe and Apple marks over the home page's tagline | `src/_includes/icons/brand-*.svg`, from Simple Icons (CC0; Adobe's from 9.21.0, before it was taken out) |

The nav, footer, tiles and pages are all generated from `apps.json`. Adding a product there adds its page, its menu entry and its tile.

- A product's **Get** button reads "Coming soon" until you give it a `getUrl`. Without its own `specs`, its Tech specs say "Available now" once it has one, and its Price is its `price` ("$99 a month"), or "To be announced"; a `trial` ("7 days of full access") adds a Free trial row.
- An app with `"standalone": true` (Ad Agent) has a single product, and the app page is that product's page.
- `photo` is one of `facade`, `granite`, `granite-tall`, `frame-multiplier` or `bloom`, and no two products may share one (the build stops if they do). `focus` (CSS `object-position`) and `zoom` choose the crop. Photos are turned and zoomed in, so they are not obvious at a glance: each has a default `turn` in `eleventy.config.js` (degrees; any angle works), and a product or app can set its own `turn`. Every photo also gets a grey tint laid over it to dull it down; its colour and strength is `--photo-tint` in `main.css`. A product can have a plain tile in place of a photo, `"tile": "black"` or `"white"` (one with no `photo` is black), or keep its photo on its tiles and have a plain card only in its highlights, `"highlightsTile": "black"` or `"white"` (Automated Assemblr), and `art` puts an artwork from `src/_includes/tiles/` on its tiles in place of its icon (IDML Export: Figma to InDesign).
- `tour` gives a product a Tour section: its Figma Community carousel, slide by slide, `[{ "image": "bloom-tour-1", "alt": "…" }, …]`. The slides come from `git-ignore/assets/carousels/` through `slides` in `scripts/build-images.sh`; they are screens, so never tinted or turned, and each needs alt text saying what it shows.
- `demo: true` adds the live demo (Assemblr's page): the plugin's own layout engine and its panel's tools in the browser. The page plays InDesign, with a product of cans on it (`can-white`, `can-black`, made by the image script). The panel beside it has the plugin's two tiles, switched along its top, with the plugin's names, ranges and groups. **Layout** has the five modes with their bars, Align images, Angle and Size, the Grid and Pins row controls, Scale, Bleed, Perspective, Reset, Swap order, Clear transformations and the image strip (click a can to turn it off, drag to reorder, + adds one). **Overlays** (clicking a badge on the page opens it on that badge's corner) has a corner's list, Load badge…, Load price…, the corner chips (with something on the open corner, another chip moves it there or swaps it with what is there, as the plugin's do), Stack, Resize scale, Inset X, Gap, Inset Y and Max size. The line-up's handle on the page is the panel drawing's own control. The page counts as 595 pt wide, so the pt fields mean what they do in InDesign. The badge artwork is `BADGES` in `assemblr-demo.js`. Pictures dropped on the page and badges loaded are read in the browser and never uploaded.
- `panel` adds a section explaining a plugin's panel (a key of `panels.js`: `"catalogue-producer"` for Automated Assemblr, `"frame-multiplier"`, `"idml-export"`, `"assemblr"` for Assemblr for InDesign, `"assemblr-photoshop"`, `"bloom"`, `"ad-agent"`, `"studio-tools"`, its Setup tab, where a brand's logo size, clear space and corner are kept): a section for each of the panel's tabs, the panel drawn with its tiles, and beside the open tile what each numbered part does. A panel's `intro` opens the section; a tab with one tile shows it without the tile bar. Each tile's notes are in its panel's module, `src/_lib/panels/<panel>.js`, in the order of the numbered marks in its drawing, `src/_includes/panel/<panel>/<tile>.njk`; the words are the plugin's own where it has them, so keep them in step with it. Frame Multiplier's drawings are drawn from `src/_lib/fm-panel.js`, its selected frame's card worked out from the same layout as its diagram. Studio Tools' Setup, its logo table only (the defaults, a row for each channel, a channel's sizes and the one-offs), is drawn from `studioSetup()` in `src/_lib/studio-dashboard.js`; on its page the guide comes straight after the included apps, its label, heading and nav link the panel's own (`label`, `heading`, `nav`), and the dashboard's Setup tab links to it. Assemblr for InDesign's is written as its user guide, every tile and setting drawn from `src/_lib/assemblr-panel.js`; its look is Assemblr for Photoshop's (`uses`, a panel whose stylesheet loads first) plus `assemblr.css`, and its `help` adds a Help section after it (`partials/panel-help.njk`): tasks step by step and what the panel's messages mean, each card with an id, `#help-<id>`, to link to from the plugin. Its `how` adds How it works before the demo (`partials/panel-how.njk`): what Assemble does to the document, the Layers panel before and after, the product's frame moved and resized, and the same product landscape then portrait, its overlays' insets kept (laid out at build time by the demo's engine, `assemblr-engine.js`), drawn in `src/_includes/panel/assemblr/how-*.njk` from `how()` in `src/_lib/assemblr-panel.js`; the help page shows it too. Assemblr for Photoshop's guide has a `help` of its own too.
- `flow` puts a flow chart of a plugin's work in its hero, in place of its photo (`"catalogue-producer"`, a key of `flows.js`): columns of steps, each drawn with the panel tile it is made in, and the loop back along the bottom.
- `diagram` puts a diagram of a plugin's principles in its hero, in place of its photo (`"frame-multiplier"`, a key of `diagrams.js`): Frame Multiplier's six masters, one master's layer stack with its roles, and the family tree of resizes, each blended from its nearest masters, one drawn large with its hero nudged and scaled clear of the headline. The layouts are worked out, not drawn: `fm-diagram.js` holds the six masters and blends every resize from them, so change a master there and the whole diagram follows.
- `job` puts a plugin's live job in its hero, in place of its photo (`"bloom"`, a key of `jobs.js`): Bloom's bloom of a page, on black, with one of each mark the plugin makes, its filter bar and its readout. Hovering over a mark or a chip opens what the plugin says about it; a tap or a click keeps it open. The bloom is drawn at build time; its geometry, glyphs, colours and rates are the plugin's, so keep `bloom.js` in step with it.
- `"look": "white"` makes the whole page white: the light look (`"light"`: nav, hero, statement and highlights) and every section that is otherwise grey (Studio Tools). On it the dashboard's window sits on the page, with no grey canvas behind it.
- `dashboard` puts a plugin's dashboard in its hero, in place of its photo (`"studio-tools"`, a key of `dashboards.js`): the plugin's window in Figma, open on Bloom's Measure dashboard for the Summer Soda page, drawn as the plugin draws it in its light, monochrome look. Each widget links to what it is on the page, and a Widgets section after it lists every widget that isn't an included app, each as the dashboard draws it, with what it does. The art, names and order are the plugin's, so keep `studio-dashboard.js` in step with it.
- `includes` (product slugs, in order) adds a section with a card for each app a product includes, its tile, name and tagline, linking to its page (Studio Tools: Bloom, Frame Multiplier and IDML Export). The dashboard's tile for each one links to its card.
- `"look": "light"` makes a product's page white: its nav, hero, statement and highlights light instead of dark.
- An icon can be a picture rather than a vector: `studio-tools.svg` is an `<img>` of `studio-tools-icon.webp`, also made by the image script.
- `glyphs` puts Monochrome's glyph field in a product's hero instead of its photo: a form (`"horizon"`, `"globe"` or `"a"`), or the JSON Ad Agent's tune panel copies with **Copy options**, pasted as is. `rollout: true` adds Ad Agent's node view to its page.
- `video` puts a product's video at the top of its page, in place of its photo: `{ "label": "Intro", "youtube": "<video id>", "title": "…", "poster": "<photo name>", "length": "2:30" }`. The poster is a photo made by `scripts/build-images.sh` (Assemblr's is the video's own thumbnail, `assemblr-intro`); YouTube's player loads only when someone presses play.

## Photos

Originals live in `git-ignore/`, which is not committed. `npm run images` (macOS: uses `sips` and `cwebp`) rebuilds the WebP versions in `src/assets/img/` and strips all camera metadata. To add a photo, add a line to `scripts/build-images.sh`, run the script, then register the new name and its size in `eleventy.config.js`.

## Deploying

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). In the repository settings, set **Pages > Source** to **GitHub Actions**.

### The Assemblr help pages

Each Assemblr's user guide and quick help also make a page of their own (`src/help/<panel>.njk`, `partials/help-page.njk`, `layouts/help.njk`: nothing on it links to the rest of the site), published on its own for the plugin's listing from a public repository in the `monochromesystems` organisation that holds only that page and the files it uses:

- Assemblr for InDesign: `/help/assemblr/`, `monochromesystems/assemblr-help`, https://monochromesystems.github.io/assemblr-help/
- Assemblr for Photoshop: `/help/assemblr-photoshop/`, `monochromesystems/assemblr-photoshop-help`, https://monochromesystems.github.io/assemblr-photoshop-help/

To update one after changing its guide (`src/_lib/panels/assemblr.js` or `assemblr-photoshop.js`), run `npm run help:assemblr` or `npm run help:assemblr-photoshop`, which builds the site and copies the page into `../assemblr-help` or `../assemblr-photoshop-help` (`scripts/export-help.mjs`, its paths made relative), then commit and push there; GitHub Pages republishes it in a minute or so.

### Moving to a custom domain

No code changes are needed. Links adjust automatically when the site moves from `/<repo>/` to the domain root.

1. In **Settings > Pages > Custom domain**, enter the domain, for example `www.example.com`.
2. At your DNS provider:
   - for `www`, add a `CNAME` record pointing to `<github-user>.github.io`;
   - for the bare domain, add `A` records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
3. Re-run the **Deploy to GitHub Pages** workflow, so the build picks up the new base URL.
4. Once the certificate is issued, tick **Enforce HTTPS**.
