import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger stays in sync. */
export function createSmoothScroll() {
  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false, // native momentum on phones — feels right and keeps pins stable
    autoRaf: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Route in-page anchor links through Lenis for eased jumps. */
export function bindAnchors(lenis, onNavigate) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.hasAttribute('data-wa') || link.hasAttribute('data-wa-voyage')) return;
    const id = link.getAttribute('href');
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    event.preventDefault();
    onNavigate?.();
    lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  });
}
