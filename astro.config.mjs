// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production is the domain root. The GitHub Pages demo sets SITE_URL and
// BASE_PATH (see .github/workflows/deploy.yml) to serve from a sub-path.
const site = process.env.SITE_URL ?? 'https://nu-glaze.co.za';
const base = process.env.BASE_PATH ?? '/';

/**
 * Pages link to each other root-relative ("/products/"). When the site is
 * built for a sub-path, prefix every root-relative href/src/srcset in the
 * generated HTML. URLs Astro already prefixed (its own /_astro assets) are
 * left alone.
 */
function prefixBase() {
  const prefix = base.replace(/\/$/, '');
  /** @param {string} url */
  const fix = (url) => (url.startsWith('/') && !url.startsWith('//') && !url.startsWith(`${prefix}/`) ? `${prefix}${url}` : url);
  /** @param {string} dir */
  const walk = (dir) =>
    fs.readdirSync(dir, {withFileTypes: true}).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
    });
  return {
    name: 'prefix-base',
    hooks: {
      /** @param {{dir: URL}} options */
      'astro:build:done': ({dir}) => {
        if (!prefix) return;
        for (const file of walk(fileURLToPath(dir))) {
          const html = fs
            .readFileSync(file, 'utf8')
            .replace(/(\s(?:href|src|action|poster)=")([^"]*)"/g, (_, a, url) => `${a}${fix(url)}"`)
            .replace(/(\ssrcset=")([^"]*)"/g, (_, a, set) => `${a}${set.split(/,\s*/).map((/** @type {string} */ c) => fix(c)).join(', ')}"`);
          fs.writeFileSync(file, html);
        }
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap({filter: (page) => !page.includes('/404')}), prefixBase()],
  vite: {plugins: [tailwindcss()]},
});
