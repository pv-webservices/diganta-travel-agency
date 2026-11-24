// Small HTML builders shared by several pages. All dynamic text goes through esc().

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** @param {unknown} value @returns {string} */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** @param {string} id @param {string} [cls] */
export const icon = (id, cls = 'ic') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

/** @param {import('../data/packages.js').Package & { imgSm: string, duration: string }} p */
export function packageCard(p, { reveal = true, delay = 0 } = {}) {
  const price = p.price
    ? `<p class="pkg-card__price">Starting <strong>${esc(p.price)}</strong></p>`
    : '<p class="pkg-card__price"><strong>Tailored quote</strong> for your dates</p>';
  return `
  <article class="pkg-card"${reveal ? ` data-reveal style="--d:${delay}s"` : ''}>
    <a class="pkg-card__media" href="/package.html?id=${esc(p.id)}" tabindex="-1" aria-hidden="true">
      <img src="${esc(p.imgSm)}" alt="" loading="lazy" width="760" height="507" />
      ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
    </a>
    <div class="pkg-card__body">
      <h3><a href="/package.html?id=${esc(p.id)}">${esc(p.title)}</a></h3>
      <p class="pkg-card__meta">${icon('calendar')}${esc(p.duration)}</p>
      <p class="pkg-card__route">${esc(p.route)}</p>
      <p>${esc(p.summary)}</p>
      ${price}
      <div class="pkg-card__actions">
        <a class="btn btn--sm" href="/package.html?id=${esc(p.id)}">View Itinerary ${icon('arrow')}</a>
        <a class="btn btn--sm btn--outline" href="/contact.html?package=${encodeURIComponent(p.title)}#plan">Customise</a>
      </div>
    </div>
  </article>`;
}

/** Image tile with a caption, used in the island mosaic. */
export function destinationTile(d, { large = false, delay = 0 } = {}) {
  return `
  <a class="dest-tile" href="/destination.html?id=${esc(d.id)}" data-reveal style="--d:${delay}s">
    <img src="${esc(large ? d.img : d.imgSm)}" alt="${esc(`${d.name} — ${d.tagline}`)}" loading="lazy" />
    <span class="dest-tile__label"><strong>${esc(d.name)}${d.aka ? `<br/>(${esc(d.aka)})` : ''}</strong></span>
  </a>`;
}

/** Card used on the destinations listing page. */
export function destinationCard(d, delay = 0) {
  return `
  <article class="dest-card" data-reveal style="--d:${delay}s">
    <a class="dest-card__media" href="/destination.html?id=${esc(d.id)}" tabindex="-1" aria-hidden="true">
      <img src="${esc(d.imgSm)}" alt="" loading="lazy" width="760" height="507" />
      <span class="chip">${icon('pin')}${esc(d.region)}</span>
    </a>
    <div class="dest-card__body">
      <span class="dest-card__alias">${esc(d.alias)}</span>
      <h3><a href="/destination.html?id=${esc(d.id)}">${esc(d.name)}</a></h3>
      <p>${esc(d.tagline)} ${esc(d.intro.split('. ')[0])}.</p>
      <a class="link-arrow" href="/destination.html?id=${esc(d.id)}">Explore ${esc(d.name)} ${icon('arrow')}</a>
    </div>
  </article>`;
}

const MODE = {
  cruise: { icon: 'ship', label: 'Private cruise' },
  boat: { icon: 'wave', label: 'Boat' },
  road: { icon: 'car', label: 'By road' },
};
const MAX_COMPACT_OPERATORS = 3;

/** @param {import('../data/ferries.js').FerryRoute} r */
export function routeCard(r, { compact = false } = {}) {
  const mode = MODE[r.mode] ?? MODE.cruise;
  const ops = compact && r.operators.length > MAX_COMPACT_OPERATORS
    ? [...r.operators.slice(0, MAX_COMPACT_OPERATORS), `+${r.operators.length - MAX_COMPACT_OPERATORS} more`]
    : r.operators;
  return `
  <article class="route route--${esc(r.mode)}${compact ? ' route--compact' : ''}" data-route="${esc(r.id)}" data-reveal>
    <div class="route__head">
      <span class="route__mode">${icon(mode.icon, 'ic ic--sm')}${mode.label}</span>
      <span class="route__time">${icon('clock', 'ic ic--sm')}${esc(r.duration)}</span>
    </div>
    <h3 class="route__line">
      <span class="route__stop">${esc(r.from)}</span>
      <span class="route__track" aria-label="to">${icon(mode.icon)}</span>
      <span class="route__stop route__stop--end">${esc(r.to)}</span>
    </h3>
    <ul class="route__ops" aria-label="${r.mode === 'road' ? 'How' : 'Operators'}">${ops.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
    ${compact ? '' : `
    <dl class="route__meta">
      <div><dt>${icon('calendar', 'ic ic--sm')}Departures</dt><dd>${esc(r.departures)}</dd></div>
      ${r.fare ? `<div><dt>${icon('ticket', 'ic ic--sm')}Fare</dt><dd>${esc(r.fare)}</dd></div>` : ''}
    </dl>
    <p class="route__note">${icon('sun', 'ic ic--sm')}${esc(r.note)}</p>`}
  </article>`;
}
