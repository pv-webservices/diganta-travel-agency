import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { marquee } from './story.js';

/** Voyages: sticky cards that recede (scale + dim) as the next one slides over. */
export function initVoyages() {
  const cards = [...document.querySelectorAll('.voyage')];
  cards.forEach((card, i) => {
    card.style.setProperty('--i', i);
    const img = card.querySelector('.voyage__media img');
    gsap.fromTo(img, { scale: 1.25 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 20%', scrub: true },
    });
    const next = cards[i + 1];
    if (!next) return;
    gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
      scale: 0.9 + i * 0.012,
      filter: 'brightness(0.8)',
      ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
    });
  });
}

/**
 * Reels strip: wraps the clips in a track and appends a copy so the strip can glide
 * forever. Runs before lazy-video setup so the copies load and play like the originals.
 */
export function prepareReels() {
  const reels = document.querySelector('.reels');
  if (!reels || reels.querySelector('.reels__track')) return;
  const track = document.createElement('div');
  track.className = 'reels__track';
  const items = [...reels.children];
  items.forEach((item) => track.appendChild(item));
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('reel--clone');
    track.appendChild(clone);
  });
  reels.appendChild(track);
}

const REEL_SPEED_DESKTOP = 46; // px per second
const REEL_SPEED_MOBILE = 34;

/** Endless auto-scroll with drag/swipe + momentum. Vertical page scrolling stays native (touch-action: pan-y). */
function runReels(reels, isDesktop) {
  const track = reels.querySelector('.reels__track');
  const first = track.querySelector('.reel');
  const firstClone = track.querySelector('.reel--clone');
  if (!first || !firstClone) return;
  const baseSpeed = isDesktop ? REEL_SPEED_DESKTOP : REEL_SPEED_MOBILE;
  let period = firstClone.offsetLeft - first.offsetLeft;
  let x = 0; let velocity = 0; let hover = 1;
  let dragging = false; let moved = false; let startX = 0; let startPos = 0; let lastX = 0; let lastT = 0;
  let visible = false;

  const wrap = (v) => {
    if (period <= 0) return v;
    let n = v % period;
    if (n > 0) n -= period;
    return n;
  };
  const tick = (_, deltaMs) => {
    if (!visible || dragging) return;
    const dt = Math.min(deltaMs, 64) / 1000;
    velocity *= Math.exp(-dt * 3.2); // fling momentum decays
    x = wrap(x - baseSpeed * hover * dt + velocity * dt);
    gsap.set(track, { x });
  };
  gsap.ticker.add(tick);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(reels);
  window.addEventListener('resize', () => { period = firstClone.offsetLeft - first.offsetLeft; });

  reels.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') gsap.to({ v: hover }, { v: 0.3, duration: 0.6, onUpdate() { hover = this.targets()[0].v; } }); });
  reels.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') gsap.to({ v: hover }, { v: 1, duration: 0.6, onUpdate() { hover = this.targets()[0].v; } }); });
  reels.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false; velocity = 0;
    startX = e.clientX; startPos = x; lastX = e.clientX; lastT = performance.now();
    reels.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    const now = performance.now();
    velocity = ((e.clientX - lastX) / Math.max(1, now - lastT)) * 1000;
    lastX = e.clientX; lastT = now;
    x = wrap(startPos + dx);
    gsap.set(track, { x });
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    velocity = gsap.utils.clamp(-2500, 2500, velocity);
    reels.classList.remove('is-dragging');
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  reels.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
}

export function initPostcards({ isDesktop } = {}) {
  const reels = document.querySelector('.reels');
  if (reels) {
    runReels(reels, isDesktop);
    gsap.from(reels.querySelectorAll('.reel:not(.reel--clone)'), {
      y: 120, rotation: (i) => (i % 2 ? 6 : -6), opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: reels, start: 'top 85%', once: true },
    });
  }
  const polaroids = gsap.utils.toArray('.polaroid');
  polaroids.forEach((p, i) => {
    const rest = [-6, 4, -3, 7, -5][i % 5];
    gsap.fromTo(p, { y: 160 + i * 30, rotation: rest * 4, opacity: 0 }, {
      y: 0, rotation: rest, opacity: 1, ease: 'power2.out',
      scrollTrigger: { trigger: '.polaroids', start: 'top 95%', end: 'top 45%', scrub: 0.6 },
    });
  });
}

/** Topographic contour lines behind "Why Diganta", drawn in procedurally. */
function topo(svg) {
  const centers = [[150, 160], [640, 420], [420, 80]];
  let markup = '';
  centers.forEach(([cx, cy], c) => {
    for (let ring = 1; ring <= 9; ring += 1) {
      const base = ring * 26;
      const pts = [];
      for (let a = 0; a <= 64; a += 1) {
        const t = (a / 64) * Math.PI * 2;
        const r = base + Math.sin(t * 3 + c + ring * 0.4) * 9 + Math.cos(t * 5 + ring) * 5;
        pts.push(`${(cx + Math.cos(t) * r * 1.35).toFixed(1)},${(cy + Math.sin(t) * r).toFixed(1)}`);
      }
      markup += `<path d="M${pts.join('L')}Z"/>`;
    }
  });
  svg.innerHTML = markup;
  gsap.to(svg, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: svg.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
}

export function initWhy() {
  const svg = document.querySelector('.why__topo');
  if (svg) topo(svg);
  document.querySelectorAll('.why__item').forEach((item) => {
    const shapes = item.querySelectorAll('.draw path, .draw circle');
    shapes.forEach((s) => {
      const len = s.getTotalLength();
      gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
    });
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(shapes, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.1 }),
    });
  });
}

/** Where the wordmark's baseline sits inside its line box, so the horizon line and sun can meet it. */
function measureBaseline(word) {
  const style = getComputedStyle(word);
  const size = parseFloat(style.fontSize);
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return size * 0.78;
  ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
  const m = ctx.measureText(word.textContent);
  const ascent = m.fontBoundingBoxAscent ?? size * 0.95;
  const descent = m.fontBoundingBoxDescent ?? size * 0.25;
  const lineHeight = parseFloat(style.lineHeight) || size;
  return (lineHeight - (ascent + descent)) / 2 + ascent;
}

/** Footer: the wordmark sits on a horizon and the sun rises behind it as the journey ends. */
export function initFooter() {
  const mark = document.querySelector('.footer__mark');
  if (!mark) return;
  const word = mark.querySelector('.footer__word');
  const sun = mark.querySelector('.footer__sun');
  const setBaseline = () => mark.style.setProperty('--baseline', `${measureBaseline(word).toFixed(1)}px`);
  setBaseline();
  window.addEventListener('resize', setBaseline);

  gsap.set(sun, { xPercent: -50 });
  gsap.fromTo(sun, { yPercent: 100 }, {
    yPercent: 20, // stops at 80% risen, so it reads as a sun on the horizon rather than a ball
    ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top 85%', end: 'bottom bottom', scrub: true },
  });
  gsap.fromTo(word, { y: 40, opacity: 0.3 }, {
    y: 0, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top 85%', end: 'bottom bottom', scrub: true },
  });
  const year = document.querySelector('.footer .year');
  if (year) year.textContent = String(new Date().getFullYear());
}

export { marquee };
