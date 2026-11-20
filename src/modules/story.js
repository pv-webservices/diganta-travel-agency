import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/** Manifesto words light up as the reader scrolls past them. */
function scrubWords() {
  document.querySelectorAll('[data-scrub-words]').forEach((el) => {
    const split = new SplitText(el, { type: 'words', wordsClass: 'word' });
    gsap.to(split.words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: 0.5 },
    });
  });
}

function countUp() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const state = { v: 0 };
    const format = (v) => (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN'));
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(state, {
        v: target, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = format(state.v); },
      }),
    });
  });
}

function parallax() {
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax);
    gsap.fromTo(el, { yPercent: -amount }, {
      yPercent: amount, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    const img = el.querySelector('img');
    if (img) {
      gsap.fromTo(img, { scale: 1.25 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });
}

/** Infinite marquee whose speed (and direction) follows scroll velocity. */
export function marquee(selector, baseSpeed = 40) {
  document.querySelectorAll(selector).forEach((root) => {
    const track = root.querySelector('.marquee__track');
    track.innerHTML += track.innerHTML; // duplicate for a seamless loop
    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: baseSpeed, repeat: -1 });
    loop.totalTime(baseSpeed * 500); // head-room so the loop can also run backwards
    let direction = 1;
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        direction = self.direction;
        const boost = Math.min(Math.abs(self.getVelocity()) / 300, 6);
        gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.3 });
      },
    });
  });
}

export function initStory() {
  scrubWords();
  countUp();
  parallax();
  marquee('.marquee--story');
}
