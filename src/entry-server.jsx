// Build-time entry used by scripts/prerender.js to turn each route into static HTML.
/* eslint-disable react/only-export-components -- build-only entry, never hot-reloaded */
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

export { routes, getPageMeta } from './seo/meta'
export { renderHead } from './seo/head'
export { SITE_URL, GOOGLE_SITE_VERIFICATION } from './seo/config'

/** Renders one URL to HTML, waiting for lazy-loaded pages so the full content is included. */
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    // Inline every Suspense boundary instead of streaming large ones out-of-order,
    // so the HTML reads top-to-bottom for crawlers that don't run JavaScript.
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
