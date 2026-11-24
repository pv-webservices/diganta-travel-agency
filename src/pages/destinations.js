import './page.js';
import { DESTINATIONS } from '../data/destinations.js';
import { FERRY_ROUTES, FERRY_OPERATORS, FERRY_TIPS } from '../data/ferries.js';
import { destinationCard, routeCard, esc, icon } from '../lib/render.js';
import { ferryMapSvg, linkRoutesToMap } from '../lib/ferry-map.js';

const $ = (sel) => document.querySelector(sel);

$('[data-dest-grid]').innerHTML = DESTINATIONS.map((d, i) => destinationCard(d, (i % 3) * 0.06)).join('');

const map = $('[data-ferry-map]');
const list = $('[data-route-list]');
map.innerHTML = ferryMapSvg();
list.innerHTML = FERRY_ROUTES.map((r) => routeCard(r)).join('');
linkRoutesToMap(list, map);

$('[data-operators]').innerHTML = FERRY_OPERATORS.map((o) => `
  <div class="operator" data-reveal>
    <span class="operator__logo" aria-hidden="true">${esc(o.name.charAt(0))}</span>
    <h4>${esc(o.name)}</h4>
    <small>${esc(o.classes)}</small>
    <p><strong>${esc(o.vessel)}</strong> — ${esc(o.about)}</p>
  </div>`).join('');

$('[data-ferry-tips]').innerHTML = FERRY_TIPS.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('');
