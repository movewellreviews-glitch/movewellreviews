import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output — builds a plain HTML/CSS/JS site into ./dist that can be
// uploaded to any host (Hostinger shared hosting via hPanel / File Manager).
// No Node server or serverless functions required at runtime.
export default defineConfig({
  site: 'https://movewellreviews.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    // Emit /about/index.html style files so Hostinger serves clean URLs.
    format: 'directory',
  },
});
