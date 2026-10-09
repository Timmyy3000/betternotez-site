import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createTimeline, stagger, svg } from 'animejs';

gsap.registerPlugin(ScrollTrigger);

// Motion has three moments, and nothing else moves:
// 1. Page load: the title rises, the ink line under "notepad" draws, and the lecture sheet settles.
// 2. Scroll: each screenshot rises into place once.
// 3. Scroll: the connect steps play in order. The config types in, then the example chat appears.
//
// The inline script in index.html sets the `motion` class. Elements hidden by
// CSS under that class are revealed here. Use fromTo, not from: gsap.from reads
// the element's current style, and CSS hides these elements.
export function setupMotion() {
  // 1. Page load. animejs v4 runs this timeline on creation.
  const underline = svg.createDrawable('.ink-line path');
  underline.forEach((path) => path.setAttribute('draw', '0 0'));

  createTimeline({ defaults: { ease: 'outExpo' } })
    .add('.hero-title .word', { opacity: [0, 1], translateY: ['0.35em', '0em'], duration: 1100, delay: stagger(140) }, 0)
    .add('[data-enter]', { opacity: [0, 1], translateY: [14, 0], duration: 900, delay: stagger(90) }, 380)
    .add(underline, { draw: ['0 0', '0 1'], duration: 1000, ease: 'inOutSine' }, 900);

  gsap.fromTo(
    '[data-sheet]',
    { autoAlpha: 0, y: 56, rotation: 3 },
    { autoAlpha: 1, y: 0, rotation: -1.2, duration: 1.3, ease: 'power3.out', delay: 0.25 },
  );

  // 2. Scroll. Each screenshot rises once as it enters the viewport.
  gsap.utils.toArray('[data-shot]').forEach((figure) => {
    gsap.fromTo(
      figure,
      { autoAlpha: 0, y: 44 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: figure, start: 'top 88%', once: true },
      },
    );
  });

  // 3. Scroll. The connect sequence plays once, then stays in its final state.
  const code = document.getElementById('config-json');
  const configText = code.textContent;
  code.dataset.copy = configText; // copy buttons read the full text from here
  code.textContent = '';
  const typed = { count: 0 };

  const connect = createTimeline({ autoplay: false, defaults: { ease: 'outQuad' } })
    .add('.steps li', { opacity: [0, 1], translateX: [-12, 0], duration: 600, delay: stagger(260) }, 0)
    .add('.demo [data-block]', { opacity: [0, 1], translateY: [12, 0], duration: 600 }, 150)
    .add(
      typed,
      {
        count: configText.length,
        duration: 2400,
        ease: 'linear',
        onBegin: () => code.classList.add('typing'),
        onUpdate: () => {
          code.textContent = configText.slice(0, Math.round(typed.count));
        },
        onComplete: () => code.classList.remove('typing'),
      },
      650,
    )
    .add('.chat [data-msg]', { opacity: [0, 1], translateY: [8, 0], duration: 500, delay: stagger(600) }, '+=200');

  ScrollTrigger.create({
    trigger: '#connect',
    start: 'top 70%',
    once: true,
    onEnter: () => connect.play(),
  });

  // Web fonts load after the first layout. Measure again so the triggers land correctly.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
