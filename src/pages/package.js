import './page.js';
import { PACKAGES, findPackage } from '../data/packages.js';
import { packageCard, esc, icon } from '../lib/render.js';

const $ = (sel) => document.querySelector(sel);
const id = new URLSearchParams(window.location.search).get('id');
const pkg = findPackage(id) ?? null;

function renderNotFound() {
  $('[data-pkg-title]').textContent = 'Package not found';
  $('[data-pkg-summary]').textContent = 'This itinerary may have been renamed. Browse all our Andaman packages instead.';
  $('[data-pkg-body]').innerHTML = `
    <div class="not-found" style="grid-column:1/-1">
      <a class="btn" href="/packages.html">See all packages ${icon('arrow')}</a>
    </div>`;
  $('[data-pkg-similar]').innerHTML = PACKAGES.filter((p) => p.featured).map((p) => packageCard(p)).join('');
}

const dayHtml = (d, i) => `
  <details class="acc day"${i === 0 ? ' open' : ''}>
    <summary>
      <span class="day__num">Day<b>${i + 1}</b></span>
      <span><span class="day__title">${esc(d.title)}</span>
      ${d.stay ? `<span class="day__stay">${icon('bed', 'ic ic--sm')} Overnight: ${esc(d.stay)}</span>` : ''}</span>
    </summary>
    <div class="acc__body">
      <p>${esc(d.text)}</p>
      ${d.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}
    </div>
  </details>`;

function renderPackage(p) {
  document.title = `${p.title} · ${p.duration} Andaman Itinerary | Diganta Travels`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${p.title} (${p.duration}): ${p.summary} Day-by-day itinerary by Diganta Travels.`);

  const hero = $('[data-pkg-hero]');
  hero.src = p.img;
  hero.alt = p.title;
  $('[data-pkg-crumb]').textContent = p.title;
  $('[data-pkg-title]').textContent = p.title;
  $('[data-pkg-summary]').textContent = p.summary;
  if (p.badge) { const b = $('[data-pkg-badge]'); b.textContent = p.badge; b.hidden = false; }
  $('[data-pkg-meta]').innerHTML = `
    <span>${icon('calendar')}${esc(p.duration)}</span>
    <span>${icon('route')}${esc(p.route)}</span>`;

  $('[data-pkg-route]').textContent = `${p.route}. ${p.stays.map(([place, n]) => `${n}N ${place}`).join(' · ')}.`;
  $('[data-pkg-stays]').innerHTML = p.stays
    .map(([place, n]) => `<span style="--n:${n}"><b>${n}N</b>${esc(place)}</span>`).join('');
  $('[data-pkg-highlights]').innerHTML = p.highlights
    .map((h) => `<span class="chip">${icon('star', 'ic ic--sm')}${esc(h)}</span>`).join('');
  $('[data-pkg-days]').innerHTML = p.itinerary.map(dayHtml).join('');
  $('[data-pkg-incl]').innerHTML = p.inclusions.map((t) => `<li>${icon('check')}${esc(t)}</li>`).join('');
  $('[data-pkg-excl]').innerHTML = p.exclusions.map((t) => `<li>${icon('x')}${esc(t)}</li>`).join('');
  $('[data-pkg-price]').innerHTML = p.price
    ? `Starting from <strong>${esc(p.price)}</strong>`
    : `Price <strong>On request</strong> for your dates &amp; hotel choice`;
  $('[data-pkg-field]').value = `${p.title} (${p.duration})`;

  const similar = PACKAGES
    .filter((o) => o.id !== p.id)
    .map((o) => ({ o, score: (o.category === p.category ? 2 : 0) + (Math.abs(o.nights - p.nights) <= 1 ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ o }) => packageCard(o));
  $('[data-pkg-similar]').innerHTML = similar.join('');
}

if (pkg) renderPackage(pkg);
else renderNotFound();
