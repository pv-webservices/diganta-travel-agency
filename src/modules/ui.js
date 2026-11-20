import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CONTACT, DEFAULT_WA_MESSAGE, whatsappUrl } from '../config.js';

/* ---------------- NAV: hide on scroll down, solid after the hero, live chapter label */
export function initNav(lenis) {
  const nav = document.querySelector('.nav');
  const num = nav.querySelector('.nav__chapter-num');
  const name = nav.querySelector('.nav__chapter-name');
  const label = nav.querySelector('.nav__chapter');

  ScrollTrigger.create({
    trigger: '.story',
    start: 'top 80px',
    end: 'max',
    onToggle: (self) => nav.classList.toggle('is-solid', self.isActive),
  });

  let lastY = 0;
  lenis.on('scroll', ({ scroll }) => {
    const menuOpen = document.querySelector('.menu.is-open');
    const goingDown = scroll > lastY + 2;
    const goingUp = scroll < lastY - 2;
    if (!menuOpen && scroll > window.innerHeight * 0.9 && goingDown) nav.classList.add('is-hidden');
    if (goingUp || scroll < 80) nav.classList.remove('is-hidden');
    lastY = scroll;
  });

  let currentChapter = '00';
  document.querySelectorAll('[data-chapter]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive || section.dataset.chapter === currentChapter && name.textContent === section.dataset.chapterName) return;
        currentChapter = section.dataset.chapter;
        gsap.timeline()
          .to(label, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in' })
          .add(() => { num.textContent = section.dataset.chapter; name.textContent = section.dataset.chapterName; })
          .fromTo(label, { y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
      },
    });
  });
}

/* ---------------- MENU */
export function initMenu(lenis) {
  const menu = document.querySelector('.menu');
  const burger = document.querySelector('.nav__burger');
  const bg = menu.querySelector('.menu__bg');
  const links = menu.querySelectorAll('.menu__list a');
  const side = menu.querySelectorAll('.menu__side > *');
  let open = false;

  const toggle = (state) => {
    open = state;
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      menu.classList.add('is-open');
      lenis.stop();
      gsap.timeline()
        .fromTo(bg, { clipPath: 'circle(0% at calc(100% - 50px) 38px)' }, { clipPath: 'circle(150% at calc(100% - 50px) 38px)', duration: 0.9, ease: 'expo.inOut' })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, 0.35)
        .fromTo(side, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.5);
    } else {
      lenis.start();
      gsap.timeline({ onComplete: () => menu.classList.remove('is-open') })
        .to([...links, ...side], { opacity: 0, duration: 0.25 })
        .to(bg, { clipPath: 'circle(0% at calc(100% - 50px) 38px)', duration: 0.7, ease: 'expo.inOut' }, 0.1)
        .set([...links, ...side], { opacity: 1 });
    }
  };
  burger.addEventListener('click', () => toggle(!open));
  links.forEach((a) => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) toggle(false); });
  return { close: () => open && toggle(false) };
}

/* ---------------- CURSOR (fine pointers only) */
export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cursor = document.querySelector('.cursor');
  const label = cursor.querySelector('.cursor__label');
  const x = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
  const y = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    cursor.style.opacity = '1';
    x(e.clientX); y(e.clientY);
  });
  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button, label, input, .reels');
    cursor.classList.toggle('is-active', Boolean(labelled));
    cursor.classList.toggle('is-link', !labelled && Boolean(link));
    label.textContent = labelled ? labelled.dataset.cursor : '';
  });
  document.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
}

/* ---------------- HUD: a boat sails down the page; coordinates drift north */
export function initHud() {
  const hud = document.querySelector('.hud');
  const fill = hud.querySelector('.hud__fill');
  const boat = hud.querySelector('.hud__boat');
  const lat = hud.querySelector('.hud__lat');
  const lon = hud.querySelector('.hud__lon');
  const bar = document.querySelector('.progress-bar span');
  const from = [11.6234, 92.7265];
  const to = [13.2651, 93.0108];
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(fill, { scaleY: p });
      gsap.set(bar, { scaleX: p });
      boat.style.top = `${p * 100}%`;
      lat.textContent = `${(from[0] + (to[0] - from[0]) * p).toFixed(4)}° N`;
      lon.textContent = `${(from[1] + (to[1] - from[1]) * p).toFixed(4)}° E`;
    },
  });
  ScrollTrigger.create({
    trigger: '.story', start: 'top center', end: 'max',
    onToggle: (self) => {
      hud.classList.toggle('is-visible', self.isActive);
      document.querySelector('.wa-float').classList.toggle('is-visible', self.isActive);
    },
  });
}

/* ---------------- REVEALS + SPLIT HEADINGS */
export function initReveals() {
  ScrollTrigger.batch('.reveal-up', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
  document.querySelectorAll('[data-split]').forEach((heading) => {
    const split = SplitText.create(heading, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.lines, {
      yPercent: 110, rotation: 2, duration: 1.3, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
    });
  });
}

/* ---------------- LAZY VIDEOS: load near the viewport, loop silently while visible.
   Videos inside a [data-video-group] (e.g. the reels strip) are driven by the group,
   so clips scrolled sideways out of view are already playing when they slide in. */
const visibleVideos = new Set();

function loadVideo(video) {
  if (video.dataset.poster && !video.poster) video.poster = video.dataset.poster;
  if (video.src) return;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'auto';
  video.src = video.dataset.src;
  video.addEventListener('canplay', () => { if (visibleVideos.has(video)) playVideo(video); });
  video.load();
}

function playVideo(video) {
  const attempt = video.play();
  if (attempt) attempt.catch(() => { /* autoplay blocked (e.g. low-power mode) — retried on first tap */ });
}

function setVisible(video, isVisible) {
  if (isVisible) {
    visibleVideos.add(video);
    loadVideo(video);
    playVideo(video);
  } else {
    visibleVideos.delete(video);
    video.pause();
  }
}

export function initLazyVideos() {
  const all = [...document.querySelectorAll('video.lazy-video')];
  const groups = [...document.querySelectorAll('[data-video-group]')];
  const grouped = new Set(groups.flatMap((g) => [...g.querySelectorAll('video.lazy-video')]));
  const targets = [...groups, ...all.filter((v) => !grouped.has(v))];
  const videosOf = (el) => (el.tagName === 'VIDEO' ? [el] : [...el.querySelectorAll('video.lazy-video')]);

  const preloader = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      videosOf(target).forEach(loadVideo);
      preloader.unobserve(target);
    });
  }, { rootMargin: '900px 0px' });

  const player = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => videosOf(target).forEach((v) => setVisible(v, isIntersecting)));
  }, { threshold: 0.01 });

  targets.forEach((t) => { preloader.observe(t); player.observe(t); });

  // Some phones refuse autoplay until the first interaction — retry then.
  const retry = () => visibleVideos.forEach((v) => { if (v.paused) playVideo(v); });
  ['touchstart', 'pointerdown', 'scroll'].forEach((type) => window.addEventListener(type, retry, { passive: true }));
}

/* ---------------- CONTACT LINKS from a single config */
export function initContactLinks() {
  document.querySelectorAll('[data-tel]').forEach((a) => {
    a.href = `tel:${CONTACT.phoneTel}`;
    if (!a.querySelector('.mono')) a.textContent = CONTACT.phoneDisplay;
  });
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = whatsappUrl(DEFAULT_WA_MESSAGE);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  document.querySelectorAll('[data-wa-voyage]').forEach((a) => {
    a.href = whatsappUrl(`Hi Diganta Travels! I'm interested in the "${a.dataset.waVoyage}" voyage. Could you share an itinerary and quote?`);
    a.target = '_blank';
    a.rel = 'noopener';
  });
}
