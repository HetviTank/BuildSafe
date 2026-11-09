// Turns page meta into <head> tags — as an HTML string at build time, and as live DOM
// updates in the browser when the visitor navigates. Each tag carries a `data-seo` key so
// the browser updates the pre-rendered tags in place instead of adding duplicates.

import { LOCALE, OG_IMAGE, SITE_NAME, absoluteUrl } from './config'

/** @returns {{ key: string, tag: 'meta' | 'link' | 'script', attrs?: object, text?: string }[]} */
export function headTags(meta) {
  const url = absoluteUrl(meta.path)
  const image = absoluteUrl(OG_IMAGE)
  const tags = [
    { key: 'description', tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { key: 'robots', tag: 'meta', attrs: { name: 'robots', content: meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' } },
    { key: 'og:type', tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { key: 'og:site_name', tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME } },
    { key: 'og:locale', tag: 'meta', attrs: { property: 'og:locale', content: LOCALE } },
    { key: 'og:title', tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { key: 'og:description', tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { key: 'og:image', tag: 'meta', attrs: { property: 'og:image', content: image } },
    { key: 'og:image:width', tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { key: 'og:image:height', tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { key: 'og:image:alt', tag: 'meta', attrs: { property: 'og:image:alt', content: `${SITE_NAME} – Fire, Safety & Civil Consultancy` } },
    { key: 'twitter:card', tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { key: 'twitter:title', tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { key: 'twitter:description', tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { key: 'twitter:image', tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  ]
  if (!meta.noindex) {
    tags.push(
      { key: 'canonical', tag: 'link', attrs: { rel: 'canonical', href: url } },
      { key: 'og:url', tag: 'meta', attrs: { property: 'og:url', content: url } },
    )
  }
  if (meta.jsonLd) {
    // Escape "<" so content can never close the <script> element early.
    tags.push({ key: 'jsonld', tag: 'script', attrs: { type: 'application/ld+json' }, text: JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c') })
  }
  return tags
}

const escapeAttr = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeText = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Build time: the full SEO block for the static HTML <head>. */
export function renderHead(meta) {
  const lines = [`<title>${escapeText(meta.title)}</title>`]
  for (const t of headTags(meta)) {
    const attrs = Object.entries({ 'data-seo': t.key, ...t.attrs })
      .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
      .join(' ')
    lines.push(t.tag === 'script' ? `<script ${attrs}>${t.text}</script>` : `<${t.tag} ${attrs} />`)
  }
  return lines.join('\n    ')
}

/** Browser: bring document.head in line with `meta` after a client-side navigation. */
export function applyHead(meta) {
  document.title = meta.title
  const tags = headTags(meta)
  const wanted = new Set(tags.map((t) => t.key))

  for (const t of tags) {
    let el = document.head.querySelector(`[data-seo="${t.key}"]`)
    if (!el) {
      el = document.createElement(t.tag)
      el.setAttribute('data-seo', t.key)
      document.head.appendChild(el)
    }
    for (const [k, v] of Object.entries(t.attrs ?? {})) el.setAttribute(k, v)
    if (t.text != null) el.textContent = t.text
  }
  // Remove tags the new page doesn't use (e.g. canonical on the 404 page).
  for (const el of document.head.querySelectorAll('[data-seo]')) {
    if (!wanted.has(el.getAttribute('data-seo'))) el.remove()
  }
}
