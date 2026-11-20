import { gsap } from 'gsap';

const RISE_DURATION = 2.4; // seconds for the sun to rise and the count to reach 99
const MAX_WAIT = 2500; // ms — never hold visitors longer than this, even on a slow connection
const SUN_FINAL = 20; // % of the sun kept below the horizon, so it never shows as a full ball

const withTimeout = (promise) => Promise.race([promise, new Promise((r) => { setTimeout(r, MAX_WAIT); })]);

/** Resolves when an <img> has loaded (or failed — we never block the site on one asset). */
function imageReady(img) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  });
}

/**
 * The horizon is drawn, the sun rises with load progress, then the sky and sea
 * panels part at the horizon line to reveal the hero.
 * @param {() => gsap.core.Timeline} onReveal  starts the hero intro; called as the panels part
 * @returns {Promise<void>} resolves when the preloader has been removed
 */
export function runPreloader(onReveal) {
  const root = document.querySelector('.preloader');
  if (!root) {
    onReveal();
    return Promise.resolve();
  }
  const count = root.querySelector('.preloader__count');
  const sun = root.querySelector('.preloader__sun');
  const line = root.querySelector('.preloader__line');
  const word = root.querySelector('.preloader__word');

  const heroImg = document.querySelector('.hero__sky img');
  const ready = Promise.all([document.fonts?.ready ?? Promise.resolve(), imageReady(heroImg)].map(withTimeout));

  // One value drives both the counter and the sun, so they always move together.
  const progress = { v: 0 };
  const render = () => {
    count.textContent = String(Math.round(progress.v * 100)).padStart(3, '0');
    gsap.set(sun, { yPercent: 100 - progress.v * (100 - SUN_FINAL), scale: 0.86 + progress.v * 0.14 });
  };
  gsap.set(word, { opacity: 0, y: 14 });
  gsap.set(sun, { x: 0, y: 0, xPercent: -50, transformOrigin: '50% 100%' });
  render();

  const rise = gsap.timeline()
    .to(line, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' })
    .to(word, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.45)
    .to(progress, { v: 0.99, duration: RISE_DURATION, ease: 'power2.inOut', onUpdate: render }, 0.3);

  return Promise.all([rise.then(), ready])
    .then(() => gsap.to(progress, { v: 1, duration: 0.3, ease: 'power1.out', onUpdate: render }).then())
    .then(() => exit(root, { sun, line, word }, onReveal));
}

function exit(root, { sun, line, word }, onReveal) {
  return new Promise((resolve) => {
    gsap.timeline({
      onComplete: () => {
        root.remove();
        resolve();
      },
    })
      .to({}, { duration: 0.25 }) // a beat at 100 before leaving
      .to(word, { opacity: 0, y: -12, duration: 0.45, ease: 'power2.in' })
      .to(root.querySelector('.preloader__meta'), { opacity: 0, duration: 0.35 }, '<')
      .to(sun, { scale: 6, opacity: 0, duration: 0.9, ease: 'power2.in' }, '-=0.15')
      .to(line, { scaleX: 1.5, opacity: 0, duration: 0.7, ease: 'power2.in' }, '<')
      .add(() => onReveal(), '-=0.45')
      .to(root.querySelector('.preloader__sky'), { yPercent: -101, duration: 1.05, ease: 'expo.inOut' }, '-=0.6')
      .to(root.querySelector('.preloader__sea'), { yPercent: 101, duration: 1.05, ease: 'expo.inOut' }, '<');
  });
}
