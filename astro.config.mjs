import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { legacyRedirects } from './src/data/legacy-redirects.mjs';

export default defineConfig({
  site: 'https://improved365.com',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "github-dark",
    }
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },
  integrations: [ sitemap({
    // Keep legacy redirect shells and noindex pages out of the sitemap
    filter: (page) =>
      !Object.keys(legacyRedirects).some((slug) => page.includes(`/${slug}/`) || page.endsWith(`/${slug}`)) &&
      !page.includes('/microsoft-dynamics-365-partner/') &&
      !page.includes('/dynamics-gp-to-dynamics-365/'),
  }), mdx()],
});
