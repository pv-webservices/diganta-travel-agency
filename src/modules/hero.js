import { gsap } from 'gsap';

// The hero photo's horizon sits at 50.6% of its height (measured from the image).
const HORIZON = 0.506;
const IMG_RATIO = 4 / 3;

/** Wrap each letter twice: the outer span is driven by scroll, the inner by the intro. */
function splitLetters(el) {
  const text = el.textContent;
  el.textContent = '';
  return [...text].map((ch) => {
    const outer = document.createElement('span');
    outer.className = 'hero__char';
    const inner = document.createElement('span');
    inner.className = 'hero__char-in';
    inner.style.display = 'inline-block';
    inner.textContent = ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    return outer;
  });
}

/** Where the photo's horizon lands inside a cover-fitted box. */
function horizonFor(width, height) {
  const scale = Math.max(width / IMG_RATIO, height);
  const renderedH = scale;
  return (height - renderedH) / 2 + HORIZON * renderedH;
}

function injectRippleFilter() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <filter id="ripple" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.09" numOctaves="2" seed="4">
        <animate attributeName="baseFrequency" dur="14s" values="0.006 0.09;0.008 0.12;0.006 0.09" repeatCount="indefinite"/>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" scale="22"/>
    </filter>`;
  document.body.appendChild(svg);
  document.documentElement.classList.add('has-ripple');
}

export function initHero({ isDesktop }) {
  const hero = document.querySelector('.hero');
  if (!hero) return { intro: () => {} };
  const stage = hero.querySelector('.hero__stage');
  const scene = hero.querySelector('.hero__scene');
  const word = hero.querySelector('.hero__word');
  const chars = splitLetters(word);
  const innerChars = chars.map((c) => c.firstChild);
  const sun = hero.querySelector('.hero__sun');
  const sunCore = sun.querySelector('span');
  const reflection = hero.querySelector('.hero__reflection');
  const pictures = hero.querySelectorAll('.hero__sky picture, .hero__sea picture');
  const ui = hero.querySelector('.hero__ui');
  const ship = hero.querySelector('.hero__ship');

  const setHorizon = () => {
    const hz = horizonFor(stage.clientWidth, stage.clientHeight);
    stage.style.setProperty('--hz', `${hz}px`);
  };
  setHorizon();
  window.addEventListener('resize', setHorizon);
  if (isDesktop) injectRippleFilter();

  // ---- initial (pre-intro) state
  gsap.set(innerChars, { yPercent: 118 });
  gsap.set(sun, { xPercent: -50, yPercent: 0 });
  gsap.set(sunCore, { yPercent: 70, scale: 0.7 });
  gsap.set(pictures, { scale: 1.22 });
  gsap.set(reflection, { opacity: 0 });
  const uiParts = ui.querySelectorAll('.hero__kicker > *, .hero__sub, .hero__ctas > *, .hero__meta > *, .hero__scroll');
  gsap.set(uiParts, { opacity: 0, y: 24 });

  // ---- the ambient life: a ship crossing the horizon, birds drifting
  gsap.fromTo(ship, { x: () => -120 }, {
    x: () => window.innerWidth + 120, duration: isDesktop ? 70 : 45, ease: 'none', repeat: -1, delay: 2,
  });
  gsap.to('.hero__birds', { x: -50, y: 14, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  const intro = () => gsap.timeline()
    .to(pictures, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
    .to(sunCore, { yPercent: -40, scale: 1, duration: 2.8, ease: 'expo.out' }, 0.1)
    .to(innerChars, { yPercent: 0, duration: 1.8, ease: 'expo.out', stagger: { each: 0.07, from: 'center' } }, 0.25)
    .to(reflection, { opacity: 0.42, duration: 2, ease: 'power2.out' }, 0.9)
    .to(uiParts, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.06 }, 0.9);

  // ---- scroll: the word sinks back below the horizon, the sun sets, the tide rises
  function createScroll() {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.3}`,
        pin: stage,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    tl.fromTo(ui, { opacity: 1, y: 0 }, { opacity: 0, y: -60, duration: 0.25, immediateRender: false }, 0)
      .fromTo(chars, { yPercent: 0 }, {
        yPercent: 120, duration: 0.55, ease: 'power2.in', stagger: { each: 0.03, from: 'edges' }, immediateRender: false,
      }, 0.05)
      .fromTo(reflection.firstElementChild, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 0.05)
      .fromTo(sun, { yPercent: 0 }, { yPercent: 45, duration: 0.7, immediateRender: false }, 0.1)
      .fromTo(sunCore, { filter: 'hue-rotate(0deg) saturate(1)' }, { filter: 'hue-rotate(-28deg) saturate(1.6)', duration: 0.7, immediateRender: false }, 0.1)
      .fromTo('.hero__dusk', { opacity: 0 }, { opacity: 0.85, duration: 0.7, immediateRender: false }, 0.1)
      .fromTo(scene, { scale: 1 }, { scale: 1.14, duration: 1, immediateRender: false }, 0)
      .fromTo('.hero__tide', { yPercent: 100, y: 150 }, { yPercent: 0, y: 0, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, 0.6);
  }
  createScroll();

  // ---- pointer parallax (desktop) — sea & sky move as one, the word and sun drift on top
  if (isDesktop) {
    const sceneX = gsap.quickTo(scene, 'x', { duration: 1.4, ease: 'power3' });
    const sceneY = gsap.quickTo(scene, 'y', { duration: 1.4, ease: 'power3' });
    const titleX = gsap.quickTo(word, 'x', { duration: 1.6, ease: 'power3' });
    const sunX = gsap.quickTo(sun, 'x', { duration: 2, ease: 'power3' });
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      sceneX(nx * -24);
      sceneY(ny * -12);
      titleX(nx * 30);
      sunX(nx * 60);
    });
  }

  return { intro };
}
