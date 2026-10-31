import { defineConfig } from 'vite';
import { buildJsonLd, buildLlmsTxt } from './doctor-data.js';

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

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative base path so assets work seamlessly on GitHub Pages, custom domains, and local preview
  base: './',
  plugins: [doctorDataPublisher()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
