import './styles/base.css';
import './styles/hero-story.css';
import './styles/sections.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { createSmoothScroll, bindAnchors } from './modules/smooth.js';
import { runPreloader } from './modules/preloader.js';
import { initHero } from './modules/hero.js';
import { initStory } from './modules/story.js';
import { initCrossing } from './modules/crossing.js';
import { initVolcano } from './modules/volcano.js';
import { initBlue } from './modules/blue.js';
import {
  initVoyages, initPostcards, initWhy, initFooter, prepareReels,
} from './modules/sections.js';
import {
  initNav, initMenu, initCursor, initHud, initReveals, initLazyVideos, initContactLinks,
} from './modules/ui.js';
import { initPlanner } from './modules/planner.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
root.classList.add('js', 'css-ready'); // styles are in — reveal the page shell
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = window.matchMedia('(min-width: 861px) and (hover: hover)').matches;
if (reducedMotion) root.classList.add('reduced');

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const lenis = createSmoothScroll();
lenis.stop();

// Content wiring that never depends on motion
initContactLinks();
initPlanner();
prepareReels();
initLazyVideos();

const menu = initMenu(lenis);
bindAnchors(lenis, () => menu.close());

async function boot() {
  // Start the loading screen straight away; the page is built behind it.
  let resolveHero;
  const heroReady = new Promise((resolve) => { resolveHero = resolve; });
  const preloading = runPreloader(() => heroReady.then((hero) => hero.intro()));

  await Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => { setTimeout(r, 1500); })]);

  resolveHero(initHero({ isDesktop: isDesktop && !reducedMotion }));
  initNav(lenis);
  initCursor();
  initHud();
  initReveals();
  initStory();

  if (!reducedMotion) {
    initCrossing();
    initVolcano({ isDesktop });
    initBlue({ isDesktop });
    initVoyages();
  }
  initPostcards({ isDesktop });
  initWhy();
  initFooter();
  ScrollTrigger.refresh();

  await preloading;
  document.body.classList.remove('is-loading');
  lenis.start();
}

boot().catch((error) => {
  // Never leave visitors stuck behind the preloader.
  document.querySelector('.preloader')?.remove();
  document.body.classList.remove('is-loading');
  root.classList.remove('js');
  lenis.start();
  throw error;
});

// Recalculate after late-loading media changes layout
window.addEventListener('load', () => ScrollTrigger.refresh());
