import './page.js';
import { DESTINATIONS, findDestination } from '../data/destinations.js';
import { PACKAGES } from '../data/packages.js';
import { FERRY_ROUTES } from '../data/ferries.js';
import { packageCard, destinationTile, routeCard, esc, icon } from '../lib/render.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const dest = findDestination(new URLSearchParams(window.location.search).get('id')) ?? null;

/** Words used to match a destination inside package stays / itineraries. */
const MATCH_WORDS = {
  'sri-vijaya-puram': ['Sri Vijaya Puram'],
  havelock: ['Swaraj Dweep'],
  neil: ['Shaheed Dweep'],
  'ross-island': ['Ross Island'],
  'north-bay': ['North Bay'],
  baratang: ['Baratang'],
  rangat: ['Rangat'],
  diglipur: ['Diglipur'],
  'barren-island': ['Barren Island'],
};

function packagesFor(d) {
  const words = MATCH_WORDS[d.id] ?? [d.name];
  return PACKAGES.filter((p) => {
    const haystack = [p.route, ...p.stays.map(([s]) => s), ...p.itinerary.map((day) => day.title)].join(' ');
    return words.some((w) => haystack.includes(w));
  });
}

function render(d) {
  document.title = `${d.name} (${d.alias}) · Things to Do & How to Reach | Diganta Travels`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${d.name}, ${d.alias}: ${d.intro.slice(0, 140)}…`);
  const hero = $('[data-d-hero]');
  hero.src = d.img;
  hero.alt = `${d.name} — ${d.tagline}`;
  $('[data-d-crumb]').textContent = d.name;
  const alias = $('[data-d-alias]');
  alias.textContent = d.alias;
  alias.hidden = false;
  $('[data-d-title]').innerHTML = `${esc(d.name)}`;
  $('[data-d-tagline]').textContent = d.tagline;
  $('[data-d-meta]').innerHTML = `
    <span>${icon('pin')}${esc(d.region)}</span>
    <span>${icon('clock')}${esc(d.stay)}</span>`;
  $$('[data-d-name]').forEach((el) => { el.textContent = d.name; });
  $('[data-d-intro]').textContent = d.intro;
  if (d.note) {
    const note = $('[data-d-note]');
    note.querySelector('p').textContent = d.note;
    note.hidden = false;
  }
  $('[data-d-attractions]').innerHTML = d.attractions.map((a, i) => `
    <div class="attraction" data-reveal style="--d:${(i % 3) * 0.06}s"><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div>`).join('');

  const routes = FERRY_ROUTES.filter((r) => r.fromId === d.id || r.toId === d.id
    || (d.id === 'ross-island' && r.id === 'svp-ross-northbay')
    || (d.id === 'rangat' && r.id === 'svp-diglipur'));
  if (routes.length) $('[data-d-routes]').innerHTML = routes.map((r) => routeCard(r)).join('');
  else $('[data-d-routes-wrap]').hidden = true;

  $('[data-d-facts]').innerHTML = [
    ['plane', 'How to reach', d.reach],
    ['bed', 'Ideal stay', d.stay],
    ['heart', 'Best for', d.bestFor.join(' · ')],
    ['sun', 'Best season', 'October to May; calm seas November to April'],
  ].map(([ic, label, text]) => `<div>${icon(ic)}<span><strong>${esc(label)}</strong>${esc(text)}</span></div>`).join('');
  $('[data-d-plan]').href = `/contact.html?interest=${encodeURIComponent(d.name)}#plan`;

  const pkgs = packagesFor(d).slice(0, 6);
  if (pkgs.length) $('[data-d-pkgs]').innerHTML = pkgs.map((p, i) => packageCard(p, { delay: (i % 3) * 0.06 })).join('');
  else $('[data-d-pkgs-wrap]').hidden = true;

  $('[data-d-others]').innerHTML = DESTINATIONS.filter((o) => o.id !== d.id).slice(0, 4)
    .map((o, i) => destinationTile(o, { delay: i * 0.05 })).join('');
}

function renderNotFound() {
  $('[data-d-title]').textContent = 'Destination not found';
  $('[data-d-tagline]').textContent = 'Pick an island below or browse every destination.';
  $('[data-d-body]').innerHTML = `<div class="not-found" style="grid-column:1/-1"><a class="btn" href="/destinations.html">All destinations ${icon('arrow')}</a></div>`;
  $('[data-d-pkgs-wrap]').hidden = true;
  $('[data-d-others]').innerHTML = DESTINATIONS.slice(0, 4).map((o) => destinationTile(o)).join('');
}

if (dest) render(dest);
else renderNotFound();
