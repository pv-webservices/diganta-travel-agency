import './page.js';
import { initReveals } from '../main.js';
import { PACKAGES, CATEGORIES, DURATIONS } from '../data/packages.js';
import { packageCard, esc } from '../lib/render.js';

const grid = document.querySelector('[data-package-grid]');
const count = document.querySelector('[data-count]');
const catGroup = document.querySelector('[data-filter="cat"]');
const lenGroup = document.querySelector('[data-filter="len"]');

const params = new URLSearchParams(window.location.search);
const valid = (list, id) => list.some((x) => x.id === id);
const initial = {
  cat: valid(CATEGORIES, params.get('cat')) ? params.get('cat') : 'all',
  len: valid(DURATIONS, params.get('len')) ? params.get('len') : 'all',
};
let state = Object.freeze(initial);

const tabs = (list, active) => list
  .map((o) => `<button type="button" class="tab" data-value="${esc(o.id)}" aria-pressed="${o.id === active}">${esc(o.label)}</button>`)
  .join('');

/** Only toggles aria-pressed, so the clicked button (and keyboard focus) survives. */
const syncTabs = (group, active) => group.querySelectorAll('button[data-value]')
  .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === active)));

function render() {
  const durationTest = DURATIONS.find((d) => d.id === state.len).test;
  const list = PACKAGES.filter((p) => (state.cat === 'all' || p.category === state.cat) && durationTest(p));
  syncTabs(catGroup, state.cat);
  syncTabs(lenGroup, state.len);
  count.textContent = `Showing ${list.length} of ${PACKAGES.length} packages`;
  grid.innerHTML = list.length
    ? list.map((p, i) => packageCard(p, { delay: Math.min(i, 6) * 0.05 })).join('')
    : '<p class="empty">No package matches both filters yet — <a class="link-arrow" href="/contact.html#plan">ask us to build one</a>.</p>';
  initReveals(grid);
}

function syncUrl() {
  const url = new URL(window.location.href);
  ['cat', 'len'].forEach((k) => (state[k] === 'all' ? url.searchParams.delete(k) : url.searchParams.set(k, state[k])));
  window.history.replaceState(null, '', url);
}

[[catGroup, 'cat'], [lenGroup, 'len']].forEach(([group, key]) => {
  group?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    state = Object.freeze({ ...state, [key]: btn.dataset.value });
    render();
    syncUrl();
  });
});

if (grid) {
  catGroup.innerHTML = tabs(CATEGORIES, state.cat);
  lenGroup.innerHTML = tabs(DURATIONS, state.len);
  render();
}
