import './page.js';
import { initReveals, isolate } from '../main.js';
import { esc, icon } from '../lib/render.js';

const G = '/media/img/gen/';
const P = '/media/img/';
const V = '/media/video/';

/** @typedef {{ type: 'img' | 'video', src: string, thumb: string, cat: string, caption: string }} Item */

const img = (file, cat, caption, dir = G) => ({ type: 'img', src: `${dir}${file}.webp`, thumb: `${dir}${file}-sm.webp`, cat, caption });
const vid = (file, cat, caption, dir = V) => ({ type: 'video', src: `${dir}${file}.mp4`, thumb: `${dir}${file}.webp`, cat, caption });

/** @type {Item[]} */
const ITEMS = [
  vid('web/scuba', 'underwater', 'First scuba dive with an instructor'),
  img('dest-havelock', 'beaches', 'Radhanagar Beach, Swaraj Dweep'),
  img('photo-5', 'beaches', 'Shade and white sand', P),
  vid('web/seawalk', 'underwater', 'Sea walk among sergeant-majors'),
  img('dest-neil', 'islands', 'Natural Bridge, Shaheed Dweep'),
  vid('reel-ferry', 'travellers', 'On the cruise to the islands'),
  img('exp-seawalk', 'underwater', 'Sea walk at North Bay', P),
  img('post-kalapathar', 'beaches', 'Kalapathar Beach'),
  vid('volcano-smoke', 'islands', 'Barren Island — India’s only active volcano'),
  img('dest-ross', 'islands', 'Ross Island ruins'),
  img('photo-6', 'beaches', 'Turquoise shallows', P),
  vid('web/snorkel', 'underwater', 'Snorkelling over the reef'),
  img('dest-baratang', 'islands', 'Mangrove creek, Baratang'),
  vid('reel-joy', 'travellers', 'Shallow-water joy'),
  img('exp-bioluminescence', 'underwater', 'Night kayaking in bioluminescence', P),
  img('dest-ross-smith', 'islands', 'Ross & Smith twin islands, Diglipur'),
  vid('sunset', 'beaches', 'Sunset over the Andaman Sea'),
  img('post-sunset-jetty', 'beaches', 'A jetty at sunset'),
  img('photo-3', 'travellers', 'Beach day', P),
  vid('web/seawalk-2', 'underwater', 'Walking among the corals'),
  img('dest-north-bay', 'islands', 'North Bay lighthouse'),
  vid('reel-swing', 'travellers', 'Beach swing'),
  img('exp-glassboat', 'underwater', 'Glass-bottom boat view', P),
  img('dest-sri-vijaya-puram', 'islands', 'Cellular Jail, Sri Vijaya Puram'),
  vid('lagoon', 'beaches', 'Lagoon'),
  img('photo-9', 'travellers', 'At the jetty', P),
  vid('reel-cliff', 'travellers', 'Cliffs & blue'),
  img('post-sitapur', 'beaches', 'Sunrise at Sitapur'),
  img('dest-diglipur', 'underwater', 'Sea turtle over the reef'),
  vid('wake', 'islands', 'Island hopping by sea'),
  img('photo-11', 'travellers', 'With the captain', P),
  img('post-mangrove', 'islands', 'Mangrove roots at low tide'),
  vid('beach', 'beaches', 'Beach day'),
  img('photo-2', 'islands', 'Barren Island from the deck', P),
  vid('reel-walk', 'travellers', 'Shoreline walk'),
  img('post-chidiyatapu', 'beaches', 'Chidiyatapu sunset'),
];

const FILTERS = [
  ['all', 'All'], ['beaches', 'Beaches'], ['underwater', 'Underwater'], ['islands', 'Islands'], ['travellers', 'Travellers'], ['video', 'Videos'],
];

const grid = document.querySelector('[data-gallery]');
const filterGroup = document.querySelector('[data-gallery-filter]');
const count = document.querySelector('[data-gallery-count]');
const box = document.querySelector('[data-lightbox]');
const stage = box.querySelector('[data-lightbox-stage]');
const caption = box.querySelector('[data-lightbox-caption]');
let lastFocus = null;

grid.innerHTML = ITEMS.map((item, i) => `
  <button type="button" class="masonry__item" data-index="${i}" data-cat="${item.cat}" data-type="${item.type}" data-reveal>
    <img src="${esc(item.thumb)}" alt="${esc(item.caption)}" loading="lazy" />
    ${item.type === 'video' ? `<span class="masonry__play">${icon('play')}</span>` : ''}
    <span class="masonry__cap" aria-hidden="true">${esc(item.caption)}</span>
  </button>`).join('');

function applyFilter(value) {
  let shown = 0;
  grid.querySelectorAll('.masonry__item').forEach((el) => {
    const match = value === 'all' || el.dataset.cat === value || (value === 'video' && el.dataset.type === 'video');
    el.hidden = !match;
    if (match) shown += 1;
  });
  filterGroup.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === value)));
  count.textContent = `${shown} photos & videos`;
  initReveals(grid);
}

filterGroup.innerHTML = FILTERS.map(([v, label]) => `<button type="button" class="tab" data-value="${v}">${label}</button>`).join('');
filterGroup.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-value]');
  if (btn) applyFilter(btn.dataset.value);
});
applyFilter('all');

function open(item) {
  lastFocus = document.activeElement;
  stage.innerHTML = item.type === 'video'
    ? `<video src="${esc(item.src)}" poster="${esc(item.thumb)}" controls autoplay playsinline></video>`
    : `<img src="${esc(item.src)}" alt="${esc(item.caption)}" />`;
  caption.textContent = item.caption;
  box.hidden = false;
  isolate(box, true);
  box.querySelector('[data-lightbox-close]').focus();
}

function close() {
  box.hidden = true;
  stage.innerHTML = '';
  isolate(box, false);
  lastFocus?.focus();
}

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-index]');
  if (btn) open(ITEMS[Number(btn.dataset.index)]);
});
box.addEventListener('click', (e) => {
  if (e.target === box || e.target.closest('[data-lightbox-close]')) close();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) close(); });
