import { gsap } from 'gsap';

/** Rising embers on a canvas — only animates while the section is on screen. */
function embers(canvas, count) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = 0; let h = 0; let running = false;

  const resize = () => {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const spawn = (fresh) => ({
    x: Math.random() * w,
    y: fresh ? Math.random() * h : h + 10,
    r: 0.6 + Math.random() * 2.2,
    vy: 0.35 + Math.random() * 1.1,
    sway: Math.random() * Math.PI * 2,
    life: 0.4 + Math.random() * 0.6,
  });
  resize();
  const particles = Array.from({ length: count }, () => spawn(true));

  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach((p, i) => {
      p.y -= p.vy;
      p.sway += 0.02;
      p.x += Math.sin(p.sway) * 0.4;
      const fade = Math.max(0, Math.min(1, p.y / h)) * p.life;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `rgba(255, 196, 120, ${fade})`);
      g.addColorStop(0.4, `rgba(255, 90, 31, ${fade * 0.6})`);
      g.addColorStop(1, 'rgba(255, 90, 31, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
      if (p.y < -20) particles[i] = spawn(false);
    });
    requestAnimationFrame(draw);
  };

  new IntersectionObserver(([entry]) => {
    const wasRunning = running;
    running = entry.isIntersecting;
    if (running && !wasRunning) { resize(); requestAnimationFrame(draw); }
  }).observe(canvas);
  window.addEventListener('resize', resize);
}

export function initVolcano({ isDesktop }) {
  const section = document.querySelector('.volcano');
  if (!section) return;
  embers(section.querySelector('.embers'), isDesktop ? 110 : 55);

  const left = section.querySelector('.volcano__word--l');
  const right = section.querySelector('.volcano__word--r');
  const frame = section.querySelector('.volcano__frame');
  const facts = section.querySelectorAll('.volcano__facts > *');

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 1.6}`,
      pin: section.querySelector('.volcano__pin'),
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  });

  if (isDesktop) {
    tl.fromTo(left, { x: () => window.innerWidth * 0.17, opacity: 0.25 }, { x: 0, opacity: 1, duration: 1 }, 0)
      .fromTo(right, { x: () => -window.innerWidth * 0.17, opacity: 0.25 }, { x: 0, opacity: 1, duration: 1 }, 0);
  } else {
    tl.fromTo(left, { x: () => window.innerWidth * 0.12, opacity: 0.2 }, { x: 0, opacity: 1, duration: 1 }, 0)
      .fromTo(right, { x: () => -window.innerWidth * 0.12, opacity: 0.2 }, { x: 0, opacity: 1, duration: 1 }, 0);
  }
  tl.fromTo(frame, { clipPath: 'inset(22% 22% 22% 22% round 200px 200px 24px 24px)', scale: 0.92 },
    { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 24px 24px)', scale: 1, duration: 1 }, 0)
    .fromTo(frame.querySelector('video'), { scale: 1.5 }, { scale: 1, duration: 1.2 }, 0)
    .fromTo(facts, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 }, 0.7)
    .to({}, { duration: 0.4 });
}
