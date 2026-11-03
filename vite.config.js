import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import fs from 'node:fs';
import { buildJsonLd, buildLlmsTxt, SITE, PROCEDURES } from './doctor-data.js';
import { PAGES, pathFor } from './site-routes.js';

// Public origin used for canonical/hreflang/sitemap. drmaanalbarry.com is the owner's chosen
// domain but did not resolve on 2026-11-01 (B-6); set SITE_URL at build time to publish under
// another real origin (e.g. the GitHub Pages URL) without touching code.
const SITE_URL = (process.env.SITE_URL || SITE.url).replace(/\/+$/, '');
// Routes that genuinely exist after `npm run build` (scripts/prerender.mjs writes every page).
export const ROUTES = { ar: `${SITE_URL}/`, en: `${SITE_URL}/en/` };
// Absolute URL of every prerendered page (30: per language 1 home + 7 section pages + 7 procedures).
export const pageUrl = (lang, slug = null, page = null) => `${SITE_URL}/${pathFor(lang, slug, page)}`;
export const PAGE_URLS = PAGES.map(p => ({ ...p, url: pageUrl(p.lang, p.slug, p.page) }));
export { SITE_URL };

// Procedure illustrations are rendered by another workstream into public/images/procedures/.
// Only files that exist at build time are referenced, so a missing image never causes a 404;
// until they land, the page shows its built-in SVG anatomical placeholder.
const PROC_IMAGES = Object.fromEntries(PROCEDURES.map(p => {
  const has = f => fs.existsSync(resolve(import.meta.dirname, 'public/images/procedures', f));
  return [p.slug, { light: has(`${p.slug}.webp`), dark: has(`${p.slug}-dark.webp`) }];
}));

// Publishes JSON-LD and /llms.txt from the single doctor data source (doctor-data.js),
// so structured data and AI-facing text can never drift from what the page shows.
function doctorDataPublisher() {
  const JSON_LD_SLOT = '<!-- @doctor-json-ld -->';
  return {
    name: 'doctor-data-publisher',
    transformIndexHtml(html) {
      if (!html.includes(JSON_LD_SLOT)) throw new Error(`index.html is missing ${JSON_LD_SLOT}`);
      const json = JSON.stringify(buildJsonLd(), null, 2).replace(/</g, '\\u003c');
      return html.replace(JSON_LD_SLOT, () => `<script type="application/ld+json">\n${json}\n</script>`);
    },
    configureServer(server) {
      server.middlewares.use('/llms.txt', (_req, res) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(buildLlmsTxt());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: buildLlmsTxt() });
    }
  };
}

// Canonical, hreflang, og:url, sitemap and robots all come from SITE_URL + ROUTES, and only
// advertise routes that exist. The Arabic page is the default at "/".
function seoPublisher() {
  const alt = (lang, href) => `<link rel="alternate" hreflang="${lang}" href="${href}">`;
  return {
    name: 'seo-publisher',
    transformIndexHtml(html) {
      return html
        .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${ROUTES.ar}">`)
        .replace(/(<link rel="alternate" hreflang="[^"]*"[^>]*>\s*)+/, `${alt('ar', ROUTES.ar)}\n  ${alt('en', ROUTES.en)}\n  ${alt('x-default', ROUTES.ar)}\n  `)
        .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${ROUTES.ar}">`)
        .replace(/content="https:\/\/drmaanalbarry\.com\/images\//g, `content="${SITE_URL}/images/`);
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      // Each page lists its AR/EN pair (+ x-default = Arabic) so every language version is discoverable.
      const links = (slug, page) => ['ar', 'en'].map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l, slug, page)}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('ar', slug, page)}"/>`).join('\n');
      const url = p => `  <url>\n    <loc>${p.url}</loc>\n    <lastmod>${today}</lastmod>\n${links(p.slug, p.page)}\n  </url>`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source:
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${PAGE_URLS.map(url).join('\n')}\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative base path so assets work seamlessly on GitHub Pages, custom domains, and local preview
  base: './',
  plugins: [doctorDataPublisher(), seoPublisher()],
  // Build-time constants for client-side routing/SEO (canonical origin, available illustrations).
  define: {
    __SITE_URL__: JSON.stringify(SITE_URL),
    __PROC_IMAGES__: JSON.stringify(PROC_IMAGES)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 700, // the lazy 3D simulator chunk (three.js) is ~630 kB and only loads on demand
    rollupOptions: {
      // The 3D simulator harness page is test-only: built when CSIM_HARNESS=1 (Playwright sets it).
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        ...(process.env.CSIM_HARNESS ? { cataractSimPreview: resolve(import.meta.dirname, 'cataract-sim-preview.html') } : {}),
        ...(process.env.CSIM_HARNESS ? { lensLabPreview: resolve(import.meta.dirname, 'lens-lab-preview.html') } : {}),
        ...(process.env.CSIM_HARNESS ? { visionSimPreview: resolve(import.meta.dirname, 'vision-sim-preview.html') } : {})
      }
    }
  }
});
