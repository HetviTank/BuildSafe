// Site-wide SEO settings.
//
// IMPORTANT: set SITE_URL to the live domain before deploying (no trailing slash),
// e.g. 'https://www.buildsafeenterprise.in'. It is used for canonical URLs, the sitemap,
// robots.txt, Google structured data and social-share previews.
// `npm run build` prints a warning while it is still the placeholder.
export const SITE_URL = 'https://build-safe-zeta.vercel.app'

export const SITE_NAME = 'BuildSafe Enterprise'

// 1200×630 image shown when a page is shared on WhatsApp, LinkedIn, Facebook, X, ...
export const OG_IMAGE = '/og-image.jpg'

export const LOCALE = 'en_IN'

// Structured postal address for Google (keep in sync with `contact.address` in data/company.js).
export const POSTAL_ADDRESS = {
  streetAddress: 'Plot No. 81, Survey No. 476, B/H Mithapashvariya Road, Bhuj – Bhachau Bypass',
  addressLocality: 'Anjar',
  addressRegion: 'Gujarat',
  postalCode: '370110',
  addressCountry: 'IN',
}

export const AREA_SERVED = ['Anjar', 'Kutch', 'Gujarat']

export const absoluteUrl = (path = '/') => `${SITE_URL}${path === '/' ? '/' : path}`
