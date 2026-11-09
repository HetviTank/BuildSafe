// Runs after `vite build`: renders every route to static HTML so search engines and
// social-media previews see the real content and the right <head> for each page.
//
// Output (in dist/):
//   index.html, about.html, services.html, services/<slug>.html, gallery.html, contact.html
//   404.html     — served by the host for unknown URLs (with a real 404 status)
//   sitemap.xml  — every indexable page
//   robots.txt   — allows crawling and points to the sitemap

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, routes, getPageMeta, renderHead, SITE_URL, GOOGLE_SITE_VERIFICATION } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

if (SITE_URL.includes('example.com')) {
  console.warn('\n\x1b[33m⚠  SITE_URL is still the placeholder (src/seo/config.js). Set it to the live domain before deploying.\x1b[0m\n')
}

if (!GOOGLE_SITE_VERIFICATION) {
  console.log('ℹ  Google Search Console not verified yet — add GOOGLE_SITE_VERIFICATION in src/seo/config.js (see README → SEO).')
}

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--seo-head-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html must contain <!--seo-head--> and an empty <div id="root"></div>')
}

const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`)

async function writePage(url, file) {
  const html = template
    .replace('<!--seo-head-->', renderHead(getPageMeta(url)))
    .replace('<div id="root"></div>', `<div id="root">${await render(url)}</div>`)
  const out = path.join(dist, file)
  await fs.mkdir(path.dirname(out), { recursive: true })
  await fs.writeFile(out, html)
  console.log(`  prerendered ${url.padEnd(36)} → dist/${file}`)
}

for (const route of routes) await writePage(route, fileFor(route))
await writePage('/404', '404.html')

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : r.split('/').length > 2 ? '0.8' : '0.7'}</priority></url>`)
  .join('\n')}
</urlset>
`
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap)
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
console.log(`  wrote dist/sitemap.xml (${routes.length} URLs) and dist/robots.txt`)

await fs.rm(ssrDir, { recursive: true, force: true })
