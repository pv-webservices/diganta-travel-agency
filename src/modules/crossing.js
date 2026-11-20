import { gsap } from 'gsap';
import {
  VIEW, project, MAIN_CHAIN, SMALL_ISLANDS, SEA_LABELS, STOPS, seeded, spline, blob,
} from './chart-data.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}, parent = null) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (parent) parent.appendChild(node);
  return node;
}

/** Coastline: densify the chain and roughen it slightly so it reads as land, not a lozenge. */
function coastline(rand) {
  const pts = MAIN_CHAIN.map(([lat, lon]) => project(lat, lon));
  const dense = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    dense.push(p);
    const mx = (p[0] + q[0]) / 2 + (rand() - 0.5) * 6;
    const my = (p[1] + q[1]) / 2 + (rand() - 0.5) * 6;
    dense.push([mx, my]);
  });
  return spline(dense, true, 0.55);
}

function drawChart(svg) {
  const rand = seeded(7);
  const contours = svg.querySelector('.chart__contours');
  const islands = svg.querySelector('.chart__islands');
  const labels = svg.querySelector('.chart__labels');

  const shapes = [{ d: coastline(rand), small: false }];
  SMALL_ISLANDS.forEach(([lat, lon, rLat, rLon, label]) => {
    shapes.push({ d: blob(lat, lon, rLat, rLon, rand), small: true });
    if (label) {
      const [x, y] = project(lat, lon + rLon + 0.03);
      el('text', { x, y: y + 3, class: 'chart__label' }, labels).textContent = label;
    }
  });

  shapes.forEach(({ d, small }) => {
    // shallow-reef halos — wide translucent strokes under each island
    el('path', { d, fill: 'none', stroke: 'rgba(143,230,217,.35)', 'stroke-width': small ? 10 : 22, 'stroke-linejoin': 'round' }, contours);
    el('path', { d, fill: 'none', stroke: 'rgba(143,230,217,.55)', 'stroke-width': small ? 4 : 9, 'stroke-linejoin': 'round' }, contours);
    el('path', { d, class: `chart__island${small ? ' chart__island--small' : ''}` }, islands);
  });

  const [bx, by] = project(12.278, 93.858);
  el('circle', { cx: bx, cy: by, r: 22, class: 'chart__volcano-glow' }, contours);

  SEA_LABELS.forEach(({ lat, lon, text, rotate }) => {
    const [x, y] = project(lat, lon);
    const t = el('text', { x, y, class: 'chart__label chart__label--sea' }, labels);
    if (rotate) t.setAttribute('transform', `rotate(${rotate} ${x} ${y})`);
    t.textContent = text;
  });
}

function drawRoute(svg) {
  const points = [];
  STOPS.forEach((stop) => {
    stop.via.forEach(([lat, lon]) => points.push(project(lat, lon)));
    points.push(project(...stop.at));
  });
  const d = spline(points, false, 0.6);
  svg.querySelectorAll('.chart__route').forEach((p) => p.setAttribute('d', d));
  const live = svg.querySelector('.chart__route--live');
  const length = live.getTotalLength();

  // locate each stop along the path by sampling
  const samples = 900;
  const fractions = STOPS.map((stop) => {
    const [sx, sy] = project(...stop.at);
    let best = 0; let bestDist = Infinity;
    for (let i = 0; i <= samples; i += 1) {
      const p = live.getPointAtLength((i / samples) * length);
      const dist = (p.x - sx) ** 2 + (p.y - sy) ** 2;
      if (dist < bestDist) { bestDist = dist; best = i / samples; }
    }
    return best;
  });

  const stopsGroup = svg.querySelector('.chart__stops');
  const markers = STOPS.map((stop, i) => {
    const [x, y] = project(...stop.at);
    const g = el('g', { class: `chart__stop${i === 4 ? ' is-volcano' : ''}` }, stopsGroup);
    el('circle', { cx: x, cy: y, r: 4.5 }, g);
    el('text', { x: x + stop.label.dx, y: y + stop.label.dy, 'text-anchor': stop.label.anchor }, g).textContent = stop.name;
    return g;
  });

  return { live, length, fractions, markers };
}

export function initCrossing() {
  const section = document.querySelector('.crossing');
  if (!section) return;
  const svg = section.querySelector('.chart');
  const mapBox = section.querySelector('.crossing__map');
  const stopEls = [...section.querySelectorAll('.stop')];
  const dots = [...section.querySelectorAll('.crossing__dots i')];
  const boat = svg.querySelector('.chart__boat');
  const halo = svg.querySelector('.chart__boat-halo');

  drawChart(svg);
  const { live, length, fractions, markers } = drawRoute(svg);

  live.style.strokeDasharray = `${length}`;
  live.style.strokeDashoffset = `${length}`;
  gsap.to(halo, { attr: { r: 20 }, opacity: 0.3, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // ---- boat + route draw driven by a single proxy value
  const voyage = { p: 0 };
  let lastX = null;
  const renderBoat = () => {
    const pt = live.getPointAtLength(voyage.p * length);
    const flip = lastX !== null && pt.x < lastX - 0.01 ? -1 : 1;
    lastX = pt.x;
    boat.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) scale(${flip} 1)`);
    live.style.strokeDashoffset = `${length * (1 - voyage.p)}`;
  };
  renderBoat();

  // ---- camera: the chart's viewBox flies between stops, fitted to the panel's aspect
  const aspect = () => mapBox.clientWidth / Math.max(1, mapBox.clientHeight);
  const overview = () => {
    const a = aspect();
    if (a > VIEW.w / VIEW.h) {
      const w = VIEW.h * a;
      return `${(VIEW.w - w) / 2} 0 ${w} ${VIEW.h}`;
    }
    const h = VIEW.w / a;
    return `0 ${(VIEW.h - h) / 2} ${VIEW.w} ${h}`;
  };
  const viewFor = (i) => {
    const [cx, cy] = project(...STOPS[i].at);
    const a = aspect();
    const h = (VIEW.h / STOPS[i].zoom) * (a > 1 ? 0.9 : 1);
    const w = h * a;
    return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  };
  svg.setAttribute('viewBox', overview());

  // ---- panel switching
  let current = -1;
  gsap.set(stopEls, { autoAlpha: 0 });
  const setActive = (i) => {
    if (i === current) return;
    const prev = stopEls[current];
    const next = stopEls[i];
    const dir = i > current ? 1 : -1;
    if (prev) gsap.to(prev, { autoAlpha: 0, y: -24 * dir, duration: 0.35, ease: 'power2.in', overwrite: true });
    gsap.set(next, { autoAlpha: 1, y: 0 });
    gsap.fromTo(next.querySelector('.stop__media'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', overwrite: true });
    gsap.fromTo(next.querySelector('.stop__media img'), { scale: 1.3 }, { scale: 1, duration: 1.2, ease: 'expo.out' });
    gsap.fromTo(next.querySelectorAll('.stop__body > *'), { y: 26 * dir, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05, delay: 0.1, overwrite: true });
    markers.forEach((m, k) => m.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    current = i;
  };
  setActive(0);

  // ---- the scrubbed voyage
  const arriveAt = [];
  const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
  tl.to(svg, { attr: { viewBox: () => viewFor(0) }, duration: 1 });
  arriveAt.push(0);
  tl.to({}, { duration: 0.6 });
  for (let i = 1; i < STOPS.length; i += 1) {
    const start = tl.duration();
    tl.to(voyage, { p: fractions[i], duration: 1.4, onUpdate: renderBoat }, start);
    tl.to(svg, { attr: { viewBox: () => viewFor(i) }, duration: 1.4 }, start);
    arriveAt.push(start + 1.0);
    tl.to({}, { duration: 0.6 });
  }
  tl.to(svg, { attr: { viewBox: overview }, duration: 1.1 });
  tl.to({}, { duration: 0.4 });

  const onUpdate = () => {
    const t = tl.time();
    let idx = 0;
    arriveAt.forEach((at, k) => { if (t >= at) idx = k; });
    setActive(idx);
  };

  // onUpdate lives on the timeline (not the trigger) so the panel follows the
  // smoothed scrub position, including the catch-up after scrolling stops.
  gsap.timeline({
    onUpdate,
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 5.5}`,
      pin: section.querySelector('.crossing__pin'),
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  }).add(tl);
}
