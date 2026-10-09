import { siApple, siClaude, siGithub, siLinux } from 'simple-icons'

const filled = (path) => `<path d="${path}"/>`

const OPENAI_PETAL = 'M12 3.2c2.1 0 3.8 1.7 3.8 3.8v6.1L12 15.3l-3.8-2.2V7c0-2.1 1.7-3.8 3.8-3.8z'

export const ICONS = {
  apple: filled(siApple.path),
  linux: filled(siLinux.path),
  claude: filled(siClaude.path),
  github: filled(siGithub.path),
  windows: '<path d="M2 4.3 10 3.2v7.6H2zM11 3l11-1.5v9.3H11zM2 11.8h8v7.7l-8-1.1zM11 11.8h11v9.7L11 20z"/>',
  openai: `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">${[0, 60, 120, 180, 240, 300]
    .map((a) => `<path d="${OPENAI_PETAL}" transform="rotate(${a} 12 12)"/>`)
    .join('')}</g>`,
}

export function hydrateIcons(root = document) {
  for (const svg of root.querySelectorAll('svg[data-icon]')) {
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.innerHTML = ICONS[svg.dataset.icon]
  }
}
