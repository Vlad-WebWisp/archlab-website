import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      // Keep the private admin page and API routes out of the sitemap.
      filter: (page) => !page.includes('/admin') && !page.includes('/api/'),
    }),
  ],
  output: 'static',
  site: 'https://archlab.pro',
  adapter: cloudflare()
});