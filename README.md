# BetterNotez landing page

The one-page site for [BetterNotez](https://github.com/Timmyy3000/BetterNotez). It is plain HTML, CSS, and JavaScript, built with [Vite](https://vite.dev/). Motion uses [GSAP](https://gsap.com/) with ScrollTrigger and [anime.js](https://animejs.com/) v4. The fonts are the same ones the app uses, self-hosted through `@fontsource`.

## Run it locally

You need Node.js 22 or newer.

```sh
npm ci
npm run dev       # http://localhost:5173
```

## Build

```sh
npm run build     # writes dist/
npm run preview   # serves dist/ at http://localhost:4173
```

## Docker

The image builds the site with `node:22-alpine` and serves `dist/` with `nginx:alpine` on port 80.

```sh
docker build -t betternotez-site .
docker run --rm -p 8080:80 betternotez-site
```

Then open http://localhost:8080.

## Files

- `index.html`: the page copy and structure, with the meta and structured data.
- `src/style.css`: the design. The colors, fonts, and sizes are at the top.
- `src/ui.js`: highlights the visitor's platform and runs the copy buttons.
- `src/motion.js`: the page-load and scroll motion.
- `public/screenshots/`: copies of `docs/screenshots/` from the BetterNotez repo. Copy them again when the app's screenshots change.
- `nginx.conf`: the server config for the Docker image.

## Motion and accessibility

Motion runs only when the visitor has not asked for reduced motion. In that case, every element shows its final state. If the motion code fails, the page also falls back to its final state.

## Before you launch

- The download links point to the `v0.1.0` release on GitHub. They work once that release is published.
- Link previews show a title and description. To add an image, add an `og:image` tag with the absolute URL of a 1200 × 630 image.
