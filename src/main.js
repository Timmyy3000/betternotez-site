import './style.css'
import { animate, createDraggable, createTimeline, scrambleText, spring, stagger, svg } from 'animejs'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { APPS } from './apps.js'
import { ICONS, hydrateIcons } from './icons.js'

const motion = document.documentElement.classList.contains('motion')
const finePointer = matchMedia('(pointer: fine)').matches

hydrateIcons()
markVisitorOs()
document.querySelector('.get-end').append(...[...document.querySelector('.hero .get').children].map((n) => n.cloneNode(true)))
loadStars()
setupModal()

if (motion) {
  gsap.registerPlugin(ScrollTrigger)
  note()
  intro()
  magnetize()
  ink()
  desk()
  orbit()
  ending()
}

function detectOs() {
  const ua = navigator.userAgent
  if (/Windows/i.test(ua)) return 'windows'
  if (/Android|iPhone|iPad/i.test(ua)) return null
  if (/Mac/i.test(ua)) return 'mac'
  if (/Linux|X11/i.test(ua)) return 'linux'
  return null
}

function markVisitorOs() {
  const os = detectOs()
  if (os === null) return
  for (const link of document.querySelectorAll(`.os[data-os="${os}"]`)) link.classList.add('is-yours')
}

async function loadStars() {
  try {
    const res = await fetch('https://api.github.com/repos/Timmyy3000/BetterNotez')
    if (!res.ok) return
    const { stargazers_count: count } = await res.json()
    const pill = document.querySelector('.stars-count')
    const label = pill.querySelector('b')
    pill.hidden = false
    document.querySelector('.stars').setAttribute('aria-label', `BetterNotez on GitHub, ${count} stars`)
    if (!motion) {
      label.textContent = count.toLocaleString()
      return
    }
    const n = { v: 0 }
    animate(n, { v: count, duration: 1400, ease: 'outExpo', modifier: Math.round, onUpdate: () => (label.textContent = n.v.toLocaleString()) })
  } catch {}
}

function intro() {
  const tl = createTimeline({ defaults: { ease: 'outExpo', duration: 1100 } })
  tl.add('.kicker span', { opacity: [0, 1], y: [8, 0], delay: stagger(70) })
    .add('.title .word', { y: ['110%', '0%'], rotate: [4, 0], opacity: [0, 1], delay: stagger(90) }, '<<+=100')
    .add(svg.createDrawable('.scribble path'), { draw: ['0 0', '0 1'], duration: 900, ease: 'inOutQuart' }, '-=500')
    .add('.lede', { opacity: [0, 1], y: [12, 0] }, '-=700')
    .add('.hero .get > *', { opacity: [0, 1], scale: [0.6, 1], delay: stagger(60), ease: spring({ bounce: 0.45, duration: 700 }) }, '-=800')
    .add('.hint, .mark, .stars, .note', { opacity: [0, 1], duration: 800 }, '-=400')
}

function magnetize() {
  if (!finePointer) return
  for (const el of document.querySelectorAll('.os, .app, .stars')) {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * 0.35)
      y((e.clientY - r.top - r.height / 2) * 0.35)
    })
    el.addEventListener('pointerleave', () => {
      x(0)
      y(0)
    })
  }
}

/** Visitors draw with the mouse or a pen anywhere that isn't a control. Strokes dry, then fade. */
function ink() {
  const canvas = document.getElementById('ink')
  const ctx = canvas.getContext('2d')
  const strokes = []
  let current = null
  let raf = 0
  const LIFE = 2200
  const hint = document.querySelector('.hint')

  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2)
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  addEventListener('resize', resize)

  const loop = () => {
    const now = performance.now()
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i]
      const age = s === current ? 0 : now - s.end
      if (age > LIFE) {
        strokes.splice(i, 1)
        continue
      }
      ctx.globalAlpha = 1 - Math.max(0, age - LIFE * 0.4) / (LIFE * 0.6)
      ctx.strokeStyle = '#ef5b3f'
      ctx.lineCap = ctx.lineJoin = 'round'
      ctx.beginPath()
      const sy = scrollY
      for (let j = 1; j < s.pts.length; j++) {
        const [x0, y0] = s.pts[j - 1]
        const [x1, y1, w] = s.pts[j]
        ctx.lineWidth = w
        ctx.moveTo(x0, y0 - sy)
        ctx.lineTo(x1, y1 - sy)
      }
      ctx.stroke()
    }
    raf = strokes.length ? requestAnimationFrame(loop) : 0
  }
  const kick = () => raf || (raf = requestAnimationFrame(loop))

  addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return
    if (e.target.closest('a, button, dialog, .note, input')) return
    current = { pts: [[e.clientX, e.clientY + scrollY, 2]], end: 0 }
    strokes.push(current)
    document.documentElement.classList.add('drawing')
    if (hint) hint.classList.add('done')
    kick()
  })
  addEventListener('pointermove', (e) => {
    if (!current) return
    const last = current.pts[current.pts.length - 1]
    const d = Math.hypot(e.clientX - last[0], e.clientY + scrollY - last[1])
    if (d < 1.5) return
    const w = e.pointerType === 'pen' && e.pressure ? 1 + e.pressure * 5 : Math.max(1.4, 4.2 - d * 0.08)
    current.pts.push([e.clientX, e.clientY + scrollY, (last[2] + w) / 2])
  })
  const lift = () => {
    if (!current) return
    current.end = performance.now()
    current = null
    document.documentElement.classList.remove('drawing')
  }
  addEventListener('pointerup', lift)
  addEventListener('pointercancel', lift)
  addEventListener('scroll', () => strokes.length && kick(), { passive: true })
}

/** The screenshots sit in a stack like loose sheets. Scrolling throws each one off to reveal the next. */
function desk() {
  const sheets = gsap.utils.toArray('.sheet')
  const captions = gsap.utils.toArray('.captions li')
  const words = captions.map((li) => li.querySelector('b'))
  const finalWords = words.map((b) => b.textContent)
  const tilt = [-2.5, 1.8, -1.2, 2.4, -0.6]

  sheets.forEach((s, i) => gsap.set(s, { zIndex: sheets.length - i, rotate: tilt[i], y: i * 6, scale: 1 - i * 0.015 }))
  gsap.set(captions, { autoAlpha: 0, y: 20 })
  gsap.set(captions[0], { autoAlpha: 1, y: 0 })

  gsap.fromTo(
    '.sheets',
    { rotateX: 38, y: 120, scale: 0.86 },
    { rotateX: 0, y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.desk', start: 'top bottom', end: 'top top', scrub: true } },
  )

  let shown = 0
  const show = (i) => {
    if (i === shown) return
    gsap.to(captions[shown], { autoAlpha: 0, y: i > shown ? -20 : 20, duration: 0.35 })
    gsap.fromTo(captions[i], { autoAlpha: 0, y: i > shown ? 20 : -20 }, { autoAlpha: 1, y: 0, duration: 0.45 })
    animate(words[i], { innerHTML: scrambleText({ text: finalWords[i], chars: 'abcdefghijklmnopqrstuvwxyz', duration: 500 }) })
    shown = i
  }

  const tl = gsap.timeline({
    defaults: { ease: 'power2.in' },
    scrollTrigger: {
      trigger: '.desk',
      start: 'top top',
      end: () => `+=${innerHeight * (sheets.length - 1) * 0.9}`,
      pin: '.desk-pin',
      scrub: 0.6,
      onUpdate: (st) => {
        gsap.set('.progress i', { scaleX: st.progress })
        show(Math.min(sheets.length - 1, Math.floor(st.progress * (sheets.length - 1) + 0.3)))
      },
    },
  })
  sheets.slice(0, -1).forEach((s, i) => {
    const dir = i % 2 ? 1 : -1
    tl.to(s, { xPercent: dir * 140, yPercent: 12, rotate: dir * 22, duration: 1 }, i)
      .to(sheets.slice(i + 1), { y: (j) => j * 6, scale: (j) => 1 - j * 0.015, rotate: (j) => tilt[i + 1 + j] * (j ? 1 : 0.2), ease: 'power2.out', duration: 1 }, i)
  })
}

function orbit() {
  gsap.from('.ai .h2, .ai .sub', { y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ai', start: 'top 70%' } })
  ScrollTrigger.create({
    trigger: '.orbit',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      animate('.app', { scale: [0, 1], rotate: [-25, 0], opacity: [0, 1], delay: stagger(90), ease: spring({ bounce: 0.5, duration: 800 }) })
      animate('.app svg', { y: [-5, 5], duration: 2600, alternate: true, loop: true, ease: 'inOutSine', delay: stagger(350) })
    },
  })
}

function ending() {
  gsap.from('.end .big', { yPercent: 30, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.end', start: 'top 75%' } })
  gsap.from('.get-end > *', { scale: 0.5, autoAlpha: 0, stagger: 0.06, ease: 'back.out(2)', duration: 0.7, scrollTrigger: { trigger: '.get-end', start: 'top 90%' } })
}

/** A sticky note from the app's sample class. It can be thrown around and springs to a stop. */
function note() {
  const el = document.createElement('div')
  el.className = 'note'
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML = '<small>Comp Sci 101</small>Quiz Thursday.<br/>Know O(log n).'
  document.querySelector('.hero').append(el)
  if (!finePointer) return
  createDraggable(el, { container: document.body, releaseEase: spring({ bounce: 0.4 }), containerFriction: 0.4 })
}

function setupModal() {
  const dialog = document.querySelector('.modal')
  const card = dialog.querySelector('.card')
  const copy = dialog.querySelector('.copy')
  const label = copy.querySelector('.copy-label')
  let app = null
  let origin = null

  const open = (button) => {
    app = APPS[button.dataset.app]
    origin = button
    dialog.querySelector('h3').textContent = app.name
    const icon = dialog.querySelector('.card-icon')
    icon.setAttribute('viewBox', '0 0 24 24')
    icon.innerHTML = ICONS[app.icon]
    dialog.querySelector('.paste').textContent = app.paste
    dialog.querySelector('.restart').textContent = app.restart
    label.textContent = 'Copy prompt'
    copy.classList.remove('copied')
    dialog.showModal()
    if (!motion) return
    const from = button.getBoundingClientRect()
    const to = card.getBoundingClientRect()
    gsap.fromTo(
      card,
      {
        x: from.left + from.width / 2 - (to.left + to.width / 2),
        y: from.top + from.height / 2 - (to.top + to.height / 2),
        scaleX: from.width / to.width,
        scaleY: from.height / to.height,
        borderRadius: 40,
        autoAlpha: 0.4,
      },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 22, autoAlpha: 1, duration: 0.65, ease: 'expo.out' },
    )
    animate(dialog.querySelectorAll('.card-head, .steps li, .copy, .fine'), { opacity: [0, 1], x: [-14, 0], delay: stagger(60, { start: 180 }), duration: 600, ease: 'outExpo' })
  }

  const close = () => {
    if (!motion || !origin) return dialog.close()
    const from = origin.getBoundingClientRect()
    const to = card.getBoundingClientRect()
    gsap.to(card, {
      x: from.left + from.width / 2 - (to.left + to.width / 2),
      y: from.top + from.height / 2 - (to.top + to.height / 2),
      scaleX: from.width / to.width,
      scaleY: from.height / to.height,
      autoAlpha: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        dialog.close()
        gsap.set(card, { clearProps: 'all' })
      },
    })
  }

  for (const b of document.querySelectorAll('.app')) b.addEventListener('click', () => open(b))
  dialog.querySelector('.close').addEventListener('click', close)
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault()
    close()
  })
  dialog.addEventListener('click', (e) => e.target === dialog && close())

  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(app.prompt)
      label.textContent = 'Copied. Paste it into ' + app.name + '.'
      copy.classList.add('copied')
      if (motion) burst(copy)
    } catch {
      label.textContent = 'Copy failed. Try again.'
    }
  })
}

function burst(el) {
  const r = el.getBoundingClientRect()
  for (let i = 0; i < 14; i++) {
    const dot = document.createElement('i')
    dot.className = 'spark'
    dot.style.left = `${r.left + r.width / 2}px`
    dot.style.top = `${r.top + r.height / 2}px`
    el.closest('dialog').append(dot)
    const a = (i / 14) * Math.PI * 2
    const d = 60 + Math.random() * 50
    animate(dot, {
      x: Math.cos(a) * d,
      y: Math.sin(a) * d * 0.6,
      scale: [1, 0],
      duration: 700 + Math.random() * 300,
      ease: 'outExpo',
      onComplete: () => dot.remove(),
    })
  }
  animate(el, { scale: [0.94, 1], ease: spring({ bounce: 0.6, duration: 500 }) })
}
