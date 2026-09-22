/* iDisko landing — static prerender build.
 *
 * Reads index.source.html (the editable source, JSX + text/babel blocks),
 * precompiles the JSX at build time, renders each language in headless
 * Chromium and emits fully static, crawlable pages:
 *
 *   index.html      English (canonical https://www.idisko.com/ + x-default)
 *   es/index.html   Spanish     it/index.html  Italian
 *   fr/index.html   French      pt/index.html  Portuguese
 *
 * Also regenerates sitemap.xml with hreflang alternates.
 *
 * Run: npm run build   (needs Chromium; set CHROME_PATH if not auto-found)
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import Babel from '@babel/standalone';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.idisko.com';
const LANGS = ['en', 'es', 'fr', 'it', 'pt'];
const OG_LOCALES = { en: 'en_US', es: 'es_ES', fr: 'fr_FR', it: 'it_IT', pt: 'pt_BR' };
const urlOf = l => (l === 'en' ? `${SITE}/` : `${SITE}/${l}/`);

const src = fs.readFileSync(path.join(ROOT, 'index.source.html'), 'utf-8');

// ── 1. Precompile every text/babel block; drop the runtime Babel vendor ──
let compiled = src.replace(/<script type="text\/babel">([\s\S]*?)<\/script>/g, (_, code) => {
  const out = Babel.transform(code, { presets: ['react'] }).code;
  return '<script>' + out.replace(/<\/script>/g, '<\\/script>') + '</script>';
});
compiled = compiled.replace(/<script src="assets\/vendor\/babel\.min\.js"><\/script>\n?/, '');

// ── 2. Extract per-language meta from the STRINGS dictionary ──
const strings = JSON.parse(compiled.match(/window\.STRINGS = (\{.*?\});\n/s)[1]);

// ── 3. Serve the repo and prerender each language in Chromium ──
const TMP = '.build-tmp.html';
fs.writeFileSync(path.join(ROOT, TMP), compiled);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  try {
    const data = fs.readFileSync(p);
    res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, r));
const port = server.address().port;

const exePath = process.env.CHROME_PATH
  || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch({ executablePath: exePath });

const rendered = {};
for (const lang of LANGS) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  // Deterministic snapshot: no external requests (counters stay hidden and
  // are fetched live client-side; consent banner renders outside #root).
  await ctx.route('**://*/**', route =>
    route.request().url().startsWith(`http://localhost:${port}`) ? route.continue() : route.abort());
  await ctx.addInitScript(l => { window.__PAGE_LANG = l; }, lang);
  const page = await ctx.newPage();
  page.on('pageerror', e => { throw new Error(`[${lang}] page error: ${e.message}`); });
  await page.goto(`http://localhost:${port}/${TMP}`, { waitUntil: 'load' });
  await page.waitForSelector('#features', { timeout: 30000 });
  await page.waitForTimeout(1500);
  rendered[lang] = await page.$eval('#root', el => el.innerHTML);
  await ctx.close();
  console.log(`prerendered ${lang}: ${rendered[lang].length} chars`);
}
await browser.close();
server.close();
fs.unlinkSync(path.join(ROOT, TMP));

// ── 4. Emit one static page per language ──
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const hreflangCluster = [
  ...LANGS.map(l => `<link rel="alternate" hreflang="${l === 'pt' ? 'pt-BR' : l}" href="${urlOf(l)}">`),
  `<link rel="alternate" hreflang="x-default" href="${SITE}/">`,
].join('\n');

for (const lang of LANGS) {
  const meta = strings[lang].meta;
  let out = compiled;

  out = out.replace(/<html lang="en">/, `<html lang="${lang}">`);
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  out = out.replace(/(<meta name="description" content=")[^"]*(">)/, `$1${esc(meta.description)}$2`);
  out = out.replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${esc(meta.title)}$2`);
  out = out.replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${esc(meta.description)}$2`);
  out = out.replace(/(<meta name="twitter:title" content=")[^"]*(">)/, `$1${esc(meta.title)}$2`);
  out = out.replace(/(<meta name="twitter:description" content=")[^"]*(">)/, `$1${esc(meta.description)}$2`);
  out = out.replace(/(<meta property="og:locale" content=")[^"]*(">)/, `$1${OG_LOCALES[lang]}$2`);
  out = out.replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${urlOf(lang)}$2`);
  out = out.replace(/<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${urlOf(lang)}">\n${hreflangCluster}`);

  // Language + prerender flags, read by detectLang()/setLang() in the app.
  let head = `<script>window.__PAGE_LANG=${JSON.stringify(lang)};window.__PRERENDERED=true;</script>`;
  if (lang === 'en') {
    // Root only: honor a stored or browser language once (parity with the
    // old client-side detection). Crawlers don't run this and index EN.
    head += `\n<script>(function(){try{var l=null;try{l=localStorage.getItem('idisko_lang')}catch(e){}\nif(!l){l=(navigator.language||'').slice(0,2).toLowerCase();}\nif(['es','fr','it','pt'].indexOf(l)>=0){location.replace('/'+l+'/');}}catch(e){}})();</script>`;
  }
  out = out.replace(/<head>/, `<head>\n${head}`);

  // Inject the prerendered markup; React re-renders over it on hydration.
  out = out.replace('<div id="root"></div>', `<div id="root">${rendered[lang]}</div>`);

  // Sub-directory pages need absolute asset URLs.
  out = out.replace(/"assets\//g, '"/assets/').replace(/'assets\//g, "'/assets/").replace(/`assets\//g, '`/assets/');

  out = out.replace('<!DOCTYPE html>',
    '<!DOCTYPE html>\n<!-- GENERATED FILE - do not edit. Edit index.source.html and run: npm run build -->');

  const dest = lang === 'en' ? 'index.html' : `${lang}/index.html`;
  fs.mkdirSync(path.dirname(path.join(ROOT, dest)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, dest), out);
  console.log(`wrote ${dest} (${(out.length / 1024).toFixed(0)} KB)`);
}

// ── 5. Sitemap with hreflang alternates ──
const today = new Date().toISOString().slice(0, 10);
const alternates = [
  ...LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l === 'pt' ? 'pt-BR' : l}" href="${urlOf(l)}"/>`),
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`,
].join('\n');
const homeEntries = LANGS.map(l => `  <url>
    <loc>${urlOf(l)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${alternates}
  </url>`).join('\n');
const staticEntries = [
  ['office/', '0.7', 'monthly'], ['faq/', '0.7', 'monthly'],
  ['politique-de-confidentialite/', '0.4', 'yearly'], ['cookies/', '0.4', 'yearly'],
  ['cgu/', '0.4', 'yearly'], ['mentions-legales/', '0.4', 'yearly'],
].map(([p, pr, cf]) => `  <url>
    <loc>${SITE}/${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${cf}</changefreq>
    <priority>${pr}</priority>
  </url>`).join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${homeEntries}
${staticEntries}
</urlset>
`);
console.log('wrote sitemap.xml');
console.log('BUILD OK');
