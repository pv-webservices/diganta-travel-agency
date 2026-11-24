# Diganta Travel Agency

Official website for Diganta Travels Pvt. Ltd. — Andaman tour operator in Sri Vijaya Puram.

## Tech Stack
- Vite (multi-page build)
- Vanilla HTML5 / CSS3 / JavaScript (ES modules) — no runtime dependencies

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview
```

## Structure

| Path | What it is |
|------|------------|
| `*.html` (root) | One file per page: `index`, `packages`, `package` (detail, `?id=`), `destinations` (incl. ferry routes), `destination` (detail, `?id=`), `experiences`, `services`, `gallery`, `travel-info`, `about`, `contact` |
| `src/partials/` | Shared HTML (`head`, `header`, `footer`, `icons`) injected with `<!-- @include name -->` by the plugin in `vite.config.js` |
| `src/data/` | Content as data: `packages.js` (16 itineraries built from `itinerary-days.js`), `destinations.js`, `ferries.js` |
| `src/pages/` | One entry script per page; `page.js` is the entry for static pages |
| `src/lib/` | HTML builders (`render.js`) and the SVG ferry-route map (`ferry-map.js`) |
| `src/styles/` | `base` (tokens, buttons, forms), `layout` (header/footer), `components`, `home`, `pages` |
| `src/config.js` | Phone, WhatsApp, email, address — change here and every link follows |
| `public/media/` | Images (`img/gen/` = generated imagery) and web-encoded video clips (`video/web/`) |
| `assets-original/` | Raw source photos and videos (not served) |

## Adding content
- **New package:** add an entry to `src/data/packages.js`; compose days from `itinerary-days.js`. It appears on the packages page and gets its own `/package.html?id=<id>` page automatically.
- **New page:** create `name.html` in the root using an existing page as a template — it is picked up by the build automatically.

## Enquiry forms
Forms have no backend: they compose a WhatsApp message to the number in `src/config.js` and open it, so nothing is sent until the visitor presses Send.
