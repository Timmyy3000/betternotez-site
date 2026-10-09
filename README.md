# BetterNotez landing page

The one-page site at https://betternotez.timi.click for [BetterNotez](https://github.com/Timmyy3000/BetterNotez).

Vite and vanilla JavaScript. GSAP runs the scroll scenes. anime.js runs the intro, the draggable note, and the AI setup card.

```sh
npm install
npm run dev     # http://localhost:5173
npm run build   # writes dist/
```

The Dockerfile builds `dist/` and serves it with nginx on port 80. Dokploy redeploys on every push to `main`.

Screenshots in `public/shots/` come from the app's `apps/app/scripts/screenshots.mjs`, captured in the warm theme with a Comp Sci 101 subject.
