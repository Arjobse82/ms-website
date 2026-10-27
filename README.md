# Monochrome Systems website

A static site built with [Eleventy](https://www.11ty.dev/). Its structure follows apple.com: a dark global nav with flyout menus, app pages with a chapter nav, and product pages with a sticky local nav. The palette is monochrome throughout.

## Run it locally

```sh
npm install
npm start          # http://localhost:8080, reloads on save
npm run build      # writes the site to _site/
```

## Where things live

| To change | Edit |
| --- | --- |
| Apps, products, taglines, install steps, Get links | `src/_data/apps.json` |
| Site name, tagline, principles, default product highlights | `src/_data/site.json` |
| Global nav and flyouts | `src/_includes/partials/globalnav.njk` |
| Page layouts | `src/_includes/partials/app-page.njk`, `product-page.njk`, `src/index.njk`, `src/about.njk` |
| Styles | `src/assets/css/main.css` |
| Nav, gallery and scroll behaviour | `src/assets/js/site.js` |
| Product icons | `src/_includes/icons/*.svg`, referenced by `icon` in `apps.json` |

The nav, footer, tiles and pages are all generated from `apps.json`. Adding a product there adds its page, its menu entry and its tile.

- A product's **Get** button reads "Coming soon" until you give it a `getUrl`.
- An app with `"standalone": true` (Ad Agent) has a single product, and the app page is that product's page.
- `photo` is one of `facade`, `granite` or `granite-tall`. `focus` (CSS `object-position`) and `zoom` choose the crop.

## Photos

Originals live in `git-ignore/`, which is not committed. `npm run images` (macOS: uses `sips` and `cwebp`) rebuilds the WebP versions in `src/assets/img/` and strips all camera metadata. To add a photo, add a line to `scripts/build-images.sh`, run the script, then register the new name and its size in `eleventy.config.js`.

## Deploying

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). In the repository settings, set **Pages > Source** to **GitHub Actions**.

### Moving to a custom domain

No code changes are needed. Links adjust automatically when the site moves from `/<repo>/` to the domain root.

1. In **Settings > Pages > Custom domain**, enter the domain, for example `www.example.com`.
2. At your DNS provider:
   - for `www`, add a `CNAME` record pointing to `<github-user>.github.io`;
   - for the bare domain, add `A` records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
3. Re-run the **Deploy to GitHub Pages** workflow, so the build picks up the new base URL.
4. Once the certificate is issued, tick **Enforce HTTPS**.
