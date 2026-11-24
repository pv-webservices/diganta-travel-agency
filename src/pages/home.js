import '../main.js';
import '../styles/home.css';

import { PACKAGES } from '../data/packages.js';
import { findDestination } from '../data/destinations.js';
import { FERRY_ROUTES } from '../data/ferries.js';
import { packageCard, destinationTile, routeCard } from '../lib/render.js';

const ISLAND_MOSAIC = ['havelock', 'neil', 'sri-vijaya-puram', 'baratang', 'diglipur'];
const TEASER_ROUTES = ['svp-havelock', 'havelock-neil', 'neil-svp'];

const islandGrid = document.querySelector('[data-island-grid]');
if (islandGrid) {
  islandGrid.innerHTML = ISLAND_MOSAIC
    .map(findDestination)
    .filter(Boolean)
    .map((d, i) => destinationTile(d, { large: i === 0, delay: i * 0.06 }))
    .join('');
}

const featured = document.querySelector('[data-featured-packages]');
if (featured) {
  featured.innerHTML = PACKAGES.filter((p) => p.featured)
    .map((p, i) => packageCard(p, { delay: i * 0.08 }))
    .join('');
}

const teaser = document.querySelector('[data-route-teaser]');
if (teaser) {
  teaser.innerHTML = FERRY_ROUTES.filter((r) => TEASER_ROUTES.includes(r.id))
    .map((r) => routeCard(r, { compact: true }))
    .join('');
}
