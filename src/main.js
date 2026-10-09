import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/instrument-sans';
import '@fontsource/jetbrains-mono/400.css';
import './style.css';

import { setupDownloads, setupCopyButtons } from './ui.js';
import { setupMotion } from './motion.js';

// Downloads and copy buttons work without motion, so they run first.
setupDownloads();
setupCopyButtons();

const root = document.documentElement;

if (root.classList.contains('motion')) {
  try {
    setupMotion();
  } catch (error) {
    // Motion must never hide the page. Clear any inline styles it set, drop the
    // class so every element shows, and restore the full config text.
    console.error('Motion failed. Showing the static page.', error);
    root.classList.remove('motion');
    document
      .querySelectorAll('[data-enter], [data-sheet], [data-shot], [data-block], [data-msg], .hero-title .word, .steps li')
      .forEach((el) => el.removeAttribute('style'));
    const code = document.getElementById('config-json');
    if (code?.dataset.copy) code.textContent = code.dataset.copy;
  }
}
