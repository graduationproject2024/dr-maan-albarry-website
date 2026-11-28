// Link check of the built site (dist/): every internal link resolves to a built file, every external link answers.
// Usage: npm run build && node scripts/check-links.mjs   (add --no-external to skip network requests)
import fs from 'node:fs';
import path from 'node:path';

const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) files.push(p); } })('dist');

const external = new Map(), schemes = new Set(), missing = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const dir = '/' + path.relative('dist', path.dirname(f)).split(path.sep).join('/');
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^https?:/.test(href)) { if (!external.has(href)) external.set(href, f); continue; }
    if (/^(tel|mailto|sms):/.test(href)) { schemes.add(href); continue; }
    if (href.startsWith('#') || href.startsWith('data:')) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    // pages carry <base href> = site root (index.html head script), so relative links resolve from the root
    const target = path.posix.normalize(path.posix.join(html.includes('<base') ? '/' : dir, clean));
    const candidates = [target, path.posix.join(target, 'index.html')];
    if (!candidates.some((c) => fs.existsSync(path.join('dist', c)))) missing.add(`${target}  (from ${path.relative('dist', f)})`);
  }
}
console.log(`pages: ${files.length}; external links: ${external.size}; tel/mailto: ${[...schemes].join(' ')}`);
console.log(`internal links that do not resolve: ${missing.size}`); for (const m of missing) console.log('  MISSING', m);

let bad = 0;
if (!process.argv.includes('--no-external')) {
  for (const [url] of external) {
    try {
      const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link check)' } });
      console.log(r.status, url); if (r.status >= 400) bad++;
    } catch (e) { console.log('ERR', e.name, url); bad++; }
  }
}
process.exit(missing.size || bad ? 1 : 0);
