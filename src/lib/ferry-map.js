// Schematic (not to scale) SVG map of the islands with animated route lines.
// Route ids match FERRY_ROUTES so a route card can highlight its line.
import { esc } from './render.js';

const VIEW = { w: 400, h: 520 };
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Organic island outlines (hand-drawn to sit around the pins). */
const LAND = {
  north: 'M205 18 C221 20 233 38 231 62 C236 84 232 104 224 124 C218 142 212 156 200 160 C188 162 182 148 184 130 C180 112 186 96 184 80 C182 60 186 34 205 18 Z',
  middle: 'M190 160 C204 164 210 182 206 202 C208 222 200 240 188 248 C176 252 166 240 166 224 C164 204 168 186 172 172 C176 162 182 158 190 160 Z',
  baratang: 'M164 232 C174 232 180 242 178 254 C176 266 168 272 160 268 C152 264 150 250 154 240 C156 234 160 232 164 232 Z',
  south: 'M152 272 C166 274 174 292 176 316 C180 344 176 368 182 392 C186 410 178 428 168 442 C156 458 140 460 132 446 C124 428 128 404 126 380 C124 350 132 322 136 300 C140 284 144 272 152 272 Z',
  havelock: 'M248 240 C260 240 268 254 266 272 C264 290 256 304 246 302 C236 300 232 286 234 270 C236 254 240 242 248 240 Z',
  neil: 'M262 337 C272 335 278 342 276 349 C274 355 264 356 259 351 C255 346 256 339 262 337 Z',
  ross: 'M189 383.5 a4.5 4.5 0 1 0 0.1 0 Z',
  northbay: 'M185 356.5 a5.5 5.5 0 1 0 0.1 0 Z',
  barren: 'M337 198 a10 10 0 1 0 0.1 0 Z',
};
/** Small decorative islets of Ritchie’s Archipelago. */
const ISLETS = [[226, 300, 6, 4], [216, 322, 5, 3], [282, 248, 5, 3.5], [214, 214, 7, 5], [240, 330, 3, 2.5]];

/** Map pins: [x, y, label, anchor, dx, dy, hub?] */
const PINS = [
  [172, 404, 'Sri Vijaya Puram', 'end', -12, 22, true],
  [189, 388, 'Ross Island', 'start', 10, 6],
  [185, 362, 'North Bay', 'start', 11, -2],
  [250, 270, 'Swaraj Dweep', 'start', 20, -6],
  [266, 344, 'Shaheed Dweep', 'start', 16, 8],
  [162, 242, 'Baratang', 'end', -12, 4],
  [184, 178, 'Rangat', 'end', -14, 4],
  [208, 72, 'Diglipur', 'start', 30, 4],
  [337, 208, 'Barren Island', 'middle', 0, 30],
];

const ROUTES = {
  'svp-havelock': ['cruise', 'M172 404 Q232 336 250 270'],
  'havelock-neil': ['cruise', 'M250 270 Q284 300 266 344'],
  'neil-svp': ['cruise', 'M266 344 Q224 410 172 404'],
  'svp-ross-northbay': ['boat', 'M172 404 Q186 402 189 388 Q194 374 185 362'],
  'svp-baratang': ['road', 'M172 404 Q150 322 162 242'],
  'svp-diglipur': ['road', 'M172 404 Q150 322 162 242 Q176 208 184 178 Q200 124 208 72'],
  'havelock-barren': ['boat', 'M250 270 Q300 222 337 208'],
};
const CRUISE_LOOP = 'M172 404 Q232 336 250 270 Q284 300 266 344 Q224 410 172 404';

const pill = ([x, y, label, anchor, dx, dy, hub]) => {
  const w = label.length * 6.1 + 16;
  const left = anchor === 'end' ? x + dx - w + 8 : anchor === 'middle' ? x + dx - w / 2 : x + dx - 8;
  return `
    <g class="fm-pin${hub ? ' fm-pin--hub' : ''}">
      ${hub ? `<circle class="fm-pulse" cx="${x}" cy="${y}" r="7"/>` : ''}
      <circle class="fm-dot" cx="${x}" cy="${y}" r="${hub ? 6.5 : 4.5}"/>
      <rect class="fm-tag" x="${left}" y="${y + dy - 12}" width="${w}" height="18" rx="9"/>
      <text class="fm-label" x="${left + w / 2}" y="${y + dy + 1}" text-anchor="middle">${esc(label)}</text>
    </g>`;
};

export function ferryMapSvg() {
  const shapes = Object.entries(LAND).map(([id, d]) => `<path id="fm-${id}" d="${d}"/>`).join('');
  const uses = Object.keys(LAND).map((id) => `<use href="#fm-${id}"/>`).join('');
  const islets = ISLETS.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`).join('');
  const routes = Object.entries(ROUTES).map(([id, [mode, d]]) =>
    `<path class="fm-route fm-route--${mode}" data-route-path="${id}" d="${d}"/>`).join('');
  const ferry = reducedMotion() ? '' : `
    <g class="fm-ferry">
      <circle r="9" fill="#fff"/>
      <path d="M-5 1h10l-2 3.5h-6z M-3 1v-3h5v3 M-0.5 -2v-2.5" fill="none" stroke="#0a3a24" stroke-width="1.4" stroke-linejoin="round"/>
      <animateMotion dur="16s" repeatCount="indefinite" path="${CRUISE_LOOP}"/>
    </g>`;
  return `
  <svg viewBox="0 0 ${VIEW.w} ${VIEW.h}" role="img" aria-labelledby="fm-title">
    <title id="fm-title">Andaman Islands route map: cruises between Sri Vijaya Puram, Swaraj Dweep and Shaheed Dweep; boats to Ross Island, North Bay and Barren Island; road north to Baratang, Rangat and Diglipur.</title>
    <defs>
      <radialGradient id="fm-sea" cx="55%" cy="55%" r="75%">
        <stop offset="0" stop-color="#14a3a6"/><stop offset=".55" stop-color="#0b6f7c"/><stop offset="1" stop-color="#073f4b"/>
      </radialGradient>
      <linearGradient id="fm-land" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7cc46a"/><stop offset="1" stop-color="#2e7d3d"/>
      </linearGradient>
      <pattern id="fm-waves" width="44" height="18" patternUnits="userSpaceOnUse">
        <path d="M0 9 q11 -7 22 0 t22 0" fill="none" stroke="rgb(255 255 255 / .06)" stroke-width="1.2"/>
      </pattern>
      ${shapes}
    </defs>
    <rect width="${VIEW.w}" height="${VIEW.h}" fill="url(#fm-sea)"/>
    <rect width="${VIEW.w}" height="${VIEW.h}" fill="url(#fm-waves)"/>
    <g class="fm-depth" fill="none">
      <path d="M110 20 C90 160 100 330 96 500"/><path d="M80 40 C60 180 70 340 66 510"/>
      <path d="M300 120 C340 200 330 320 300 430"/><path d="M330 90 C380 190 370 330 330 470"/>
    </g>
    <text class="fm-sea-label" x="300" y="470">ANDAMAN SEA</text>
    <text class="fm-sea-label" x="24" y="300" transform="rotate(-90 24 300)">BAY OF BENGAL</text>
    <g class="fm-reef">${uses}</g>
    <g class="fm-islets">${islets}</g>
    <g class="fm-land">${uses}</g>
    <g class="fm-crater"><circle cx="337" cy="208" r="4"/></g>
    <g class="fm-smoke"><circle cx="340" cy="194" r="3"/><circle cx="345" cy="186" r="4"/><circle cx="352" cy="177" r="5"/></g>
    ${routes}
    ${ferry}
    ${PINS.map(pill).join('')}
    <g class="fm-compass" transform="translate(362 52)">
      <circle r="18"/><path d="M0 -14 L5 0 L0 14 L-5 0 Z"/><path class="fm-compass__n" d="M0 -14 L5 0 L-5 0 Z"/>
      <text y="-22" text-anchor="middle">N</text>
    </g>
  </svg>`;
}

/**
 * Hover / focus / tap on a route card highlights its line on the map.
 * In the mobile carousel, the card scrolled into the centre is highlighted automatically.
 */
export function linkRoutesToMap(listEl, mapEl) {
  const paths = [...mapEl.querySelectorAll('[data-route-path]')];
  const cards = [...listEl.querySelectorAll('[data-route]')];
  const highlight = (id) => {
    paths.forEach((p) => {
      p.classList.toggle('is-hot', p.dataset.routePath === id);
      p.classList.toggle('is-dim', Boolean(id) && p.dataset.routePath !== id);
    });
    cards.forEach((c) => c.classList.toggle('is-hot', c.dataset.route === id));
  };
  const carousel = window.matchMedia('(max-width: 900px)');
  cards.forEach((card) => {
    card.tabIndex = 0;
    card.addEventListener('mouseenter', () => highlight(card.dataset.route));
    card.addEventListener('focus', () => highlight(card.dataset.route));
    card.addEventListener('click', () => highlight(card.dataset.route));
    card.addEventListener('mouseleave', () => { if (!carousel.matches) highlight(null); });
    card.addEventListener('blur', () => { if (!carousel.matches) highlight(null); });
  });
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    if (!carousel.matches) return;
    const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (best) highlight(best.target.dataset.route);
  }, { root: listEl, threshold: [0.6, 0.9] });
  cards.forEach((c) => io.observe(c));
}
