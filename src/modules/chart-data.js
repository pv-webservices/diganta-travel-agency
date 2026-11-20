// Stylised chart of the Andaman Islands. Coordinates are real (lat, lon) and are
// projected into a 520 × 884 SVG space (260 px per degree).
export const VIEW = { w: 520, h: 884 };
const LON0 = 92.1;
const LAT0 = 13.8;
const K = 260;

/** @returns {[number, number]} */
export const project = (lat, lon) => [(lon - LON0) * K, (LAT0 - lat) * K];

// Great Andaman chain (South → Middle → North Andaman), west coast up, east coast down.
export const MAIN_CHAIN = [
  [11.48, 92.62], [11.58, 92.56], [11.72, 92.54], [11.86, 92.58], [12.02, 92.63], [12.16, 92.68],
  [12.34, 92.71], [12.52, 92.74], [12.72, 92.79], [12.92, 92.84], [13.1, 92.87], [13.3, 92.89],
  [13.5, 92.91], [13.64, 92.94], [13.68, 93.0], [13.6, 93.06], [13.42, 93.07], [13.27, 93.04],
  [13.08, 93.02], [12.88, 92.99], [12.64, 92.97], [12.46, 92.93], [12.28, 92.87], [12.12, 92.82],
  [11.96, 92.77], [11.8, 92.77], [11.66, 92.75], [11.56, 92.72],
];

// Smaller islands as noisy ellipses: [lat, lon, radiusLat, radiusLon, label?]
export const SMALL_ISLANDS = [
  [11.99, 92.99, 0.075, 0.045, null], // Swaraj Dweep
  [11.832, 93.03, 0.025, 0.03, null], // Shaheed Dweep
  [12.278, 93.858, 0.03, 0.03, null], // Barren Island
  [10.7, 92.52, 0.2, 0.12, 'Little Andaman'],
  [11.44, 92.65, 0.05, 0.05, 'Rutland'],
  [11.55, 92.23, 0.05, 0.05, null],
  [12.38, 92.93, 0.04, 0.025, 'Long Is.'],
  [12.97, 92.71, 0.08, 0.04, 'Interview Is.'],
  [13.31, 93.07, 0.04, 0.015, null], // Ross & Smith
  [12.07, 93.07, 0.03, 0.02, null],
  [11.69, 92.77, 0.012, 0.012, null], // Ross Island
];

export const SEA_LABELS = [
  { lat: 11.15, lon: 93.25, text: 'Andaman Sea' },
  { lat: 13.0, lon: 92.18, text: 'Bay of Bengal', rotate: -90 },
];

// The voyage, stop by stop. `via` = waypoints sailed through before reaching the stop.
export const STOPS = [
  { name: 'Sri Vijaya Puram', at: [11.6234, 92.7265], via: [], zoom: 2.4, label: { dx: -10, dy: 4, anchor: 'end' } },
  { name: 'Swaraj Dweep', at: [12.03, 92.985], via: [[11.7, 92.86], [11.9, 92.93]], zoom: 2.4, label: { dx: 10, dy: -6, anchor: 'start' } },
  { name: 'Shaheed Dweep', at: [11.832, 93.025], via: [[12.0, 93.09], [11.9, 93.08]], zoom: 2.4, label: { dx: 10, dy: 4, anchor: 'start' } },
  { name: 'Baratang', at: [12.12, 92.8], via: [[11.86, 92.9], [12.0, 92.88]], zoom: 2.1, label: { dx: -10, dy: 4, anchor: 'end' } },
  { name: 'Barren Island', at: [12.278, 93.858], via: [[12.18, 93.05], [12.18, 93.5]], zoom: 1.7, label: { dx: -12, dy: -12, anchor: 'end' } },
  { name: 'Diglipur', at: [13.265, 93.01], via: [[12.6, 93.75], [13.05, 93.4], [13.25, 93.15]], zoom: 1.8, label: { dx: -10, dy: 4, anchor: 'end' } },
];

/** Deterministic pseudo-random so the coastline is identical on every load. */
export function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Closed (or open) Catmull-Rom spline through points → SVG path data. */
export function spline(points, closed = true, tension = 0.5) {
  const n = points.length;
  const pt = (i) => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i += 1) {
    const p0 = pt(i - 1); const p1 = pt(i); const p2 = pt(i + 1); const p3 = pt(i + 2);
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? `${d}Z` : d;
}

/** Noisy ellipse island outline in SVG space. */
export function blob(lat, lon, rLat, rLon, rand) {
  const steps = 14;
  const pts = [];
  for (let i = 0; i < steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    const wobble = 0.78 + rand() * 0.38;
    pts.push(project(lat + Math.sin(a) * rLat * wobble, lon + Math.cos(a) * rLon * wobble));
  }
  return spline(pts, true);
}
