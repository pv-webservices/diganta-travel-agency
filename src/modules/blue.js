import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function bubbles(root, count) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const b = document.createElement('i');
    const size = 4 + Math.random() * 16;
    b.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;`
      + `animation-duration:${8 + Math.random() * 12}s;animation-delay:${-Math.random() * 20}s;--dx:${(Math.random() - 0.5) * 80}px`;
    frag.appendChild(b);
  }
  root.appendChild(frag);
}

/** Pointer tilt for cards on devices with a real pointer. */
function tilt(cards) {
  cards.forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 10);
      rx(((e.clientY - r.top) / r.height - 0.5) * -10);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

export function initBlue({ isDesktop }) {
  const section = document.querySelector('.blue');
  if (!section) return;
  const pin = section.querySelector('.blue__pin');
  const track = section.querySelector('.blue__track');
  const bar = section.querySelector('.blue__bar i');
  const cards = [...track.querySelectorAll('.xp')];
  bubbles(section.querySelector('.bubbles'), isDesktop ? 26 : 14);

  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });

  const horizontal = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress });
        skew(gsap.utils.clamp(-5, 5, self.getVelocity() / -400));
      },
      onScrubComplete: () => skew(0),
    },
  });

  // inner parallax + rise-in for each card, timed against the horizontal motion
  cards.forEach((card) => {
    const media = card.querySelector('.xp__media');
    if (media) {
      gsap.fromTo(media, { xPercent: -8 }, {
        xPercent: 8, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true },
      });
    }
    gsap.from(card, {
      yPercent: 14, rotation: 3, opacity: 0.4, ease: 'power2.out',
      scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left 100%', end: 'left 60%', scrub: true },
    });
  });

  if (isDesktop) tilt(cards.filter((c) => !c.classList.contains('xp--end')));
  ScrollTrigger.addEventListener('refreshInit', () => gsap.set(track, { skewX: 0 }));
}
