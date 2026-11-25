// @ts-check
import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // The live domain: canonical URLs, Open Graph URLs and the sitemap are built from it.
  site: 'https://nu-glaze.co.za',
  trailingSlash: 'always',
  integrations: [sitemap({filter: (page) => !page.includes('/404')})],
  vite: {plugins: [tailwindcss()]},
});
