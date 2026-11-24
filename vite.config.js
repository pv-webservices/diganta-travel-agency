import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const partialsDir = resolve(root, 'src/partials');
const INCLUDE_RE = /<!--\s*@include\s+([\w-]+)\s*-->/g;

// Every top-level .html file is a page of the site.
const pages = Object.fromEntries(
  readdirSync(root)
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.replace(/\.html$/, ''), resolve(root, file)]),
);

/** Replaces `<!-- @include name -->` with src/partials/name.html (header, footer, …). */
function htmlPartials() {
  const inject = (html, depth = 0) => {
    if (depth > 3) return html;
    return html.replace(INCLUDE_RE, (_, name) => {
      const partial = readFileSync(resolve(partialsDir, `${name}.html`), 'utf8');
      return inject(partial, depth + 1);
    });
  };
  return {
    name: 'html-partials',
    transformIndexHtml: { order: 'pre', handler: (html) => inject(html) },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir.replace(/\\/g, '/')) || file.startsWith(partialsDir)) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
      return undefined;
    },
  };
}

export default defineConfig({
  plugins: [htmlPartials()],
  build: {
    rollupOptions: { input: pages },
  },
});
