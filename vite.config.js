import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths let one build run at a domain root or under a sub-path,
  // such as GitHub Pages.
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
