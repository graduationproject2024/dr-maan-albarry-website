import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { buildJsonLd, buildLlmsTxt, SITE } from './doctor-data.js';

// Public origin used for canonical/hreflang/sitemap. drmaanalbarry.com is the owner's chosen
// domain but did not resolve on 2026-11-01 (B-6); set SITE_URL at build time to publish under
// another real origin (e.g. the GitHub Pages URL) without touching code.
const SITE_URL = (process.env.SITE_URL || SITE.url).replace(/\/+$/, '');
// Routes that genuinely exist after `npm run build` (scripts/prerender.mjs writes /en/).
export const ROUTES = { ar: `${SITE_URL}/`, en: `${SITE_URL}/en/` };

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
      const links = ['ar', 'en'].map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${ROUTES[l]}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${ROUTES.ar}"/>`).join('\n');
      const url = loc => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n${links}\n  </url>`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source:
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${url(ROUTES.ar)}\n${url(ROUTES.en)}\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative base path so assets work seamlessly on GitHub Pages, custom domains, and local preview
  base: './',
  plugins: [doctorDataPublisher(), seoPublisher()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 700, // the lazy 3D simulator chunk (three.js) is ~630 kB and only loads on demand
    rollupOptions: {
      // The 3D simulator harness page is test-only: built when CSIM_HARNESS=1 (Playwright sets it).
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        ...(process.env.CSIM_HARNESS ? { cataractSimPreview: resolve(import.meta.dirname, 'cataract-sim-preview.html') } : {})
      }
    }
  }
});
