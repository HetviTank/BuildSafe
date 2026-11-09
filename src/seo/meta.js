// Per-page SEO: title, description, canonical path and Google structured data (JSON-LD).
// Used by the browser (useSeo) and by the build-time pre-renderer (scripts/prerender.js),
// so every page ships with the right <head> in its static HTML.

import { company, contact, socials } from '../data/company'
import { services, getService } from '../data/services'
import { AREA_SERVED, OG_IMAGE, POSTAL_ADDRESS, SITE_NAME, SITE_URL, absoluteUrl } from './config'

/** Static pages. Service pages are added automatically from data/services.js. */
const pages = {
  '/': {
    title: 'Fire Safety Consultant in Anjar, Kutch | BuildSafe Enterprise',
    description:
      'ISO 9001:2015 certified fire, safety & civil engineering consultancy in Anjar, Kutch (Gujarat). Fire NOC support, safety audits, third-party inspection & training.',
  },
  '/about': {
    title: 'About Us | BuildSafe Enterprise – Fire & Safety Consultancy, Kutch',
    description:
      'BuildSafe Enterprise is an ISO 9001:2015 certified fire safety, industrial safety, environmental compliance and civil engineering consultancy in Anjar, Kutch.',
    crumb: 'About Us',
  },
  '/services': {
    title: 'Fire, Safety & Civil Engineering Services in Kutch, Gujarat',
    description:
      'Fire NOC & fire safety, health & safety training, ISO consulting, third-party inspection, safety audits and civil engineering services — aligned with NBC & IS standards.',
    crumb: 'Services',
  },
  '/gallery': {
    title: 'Gallery – Safety Training & Fire Drills | BuildSafe Enterprise',
    description:
      'Photos of BuildSafe Enterprise safety training sessions, fire extinguisher demonstrations and workplace safety programmes across Kutch, Gujarat.',
    crumb: 'Gallery',
  },
  '/contact': {
    title: 'Contact BuildSafe Enterprise | Fire Safety Consultant, Anjar',
    description: `Call ${contact.phones[0]} or WhatsApp for fire NOC, safety audit, inspection and civil engineering enquiries. Office in Anjar, Kutch – 24/7 emergency response.`,
    crumb: 'Contact Us',
  },
}

const notFound = {
  title: `Page Not Found | ${SITE_NAME}`,
  description: 'The page you are looking for could not be found.',
  noindex: true,
}

/** Every indexable route — used to pre-render HTML files and build sitemap.xml. */
export const routes = [...Object.keys(pages), ...services.map((s) => `/services/${s.slug}`)]

const businessId = `${SITE_URL}/#business`

function businessSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': businessId,
    name: company.name,
    alternateName: company.shortName,
    slogan: company.tagline,
    description: company.summary,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/apple-touch-icon.png'),
    image: absoluteUrl(OG_IMAGE),
    telephone: contact.phones[0].replace(/\s/g, ''),
    email: contact.emails[0],
    address: { '@type': 'PostalAddress', ...POSTAL_ADDRESS },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`,
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
    contactPoint: contact.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phone.replace(/\s/g, ''),
      contactType: 'customer service',
      areaServed: 'IN',
    })),
    sameAs: socials.map((s) => s.url),
    knowsAbout: services.map((s) => s.title),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fire, Safety & Civil Engineering Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
      })),
    },
  }
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: absoluteUrl('/'),
    name: SITE_NAME,
    inLanguage: 'en-IN',
    publisher: { '@id': businessId },
  }
}

function breadcrumbSchema(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}

function serviceSchema(service) {
  return {
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': businessId },
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.title,
      itemListElement: service.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item.title },
      })),
    },
  }
}

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes })

/**
 * Everything the <head> needs for a URL path.
 * Returns { title, description, path, noindex, jsonLd }.
 */
export function getPageMeta(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'

  if (pages[path]) {
    const page = pages[path]
    const nodes = path === '/' ? [businessSchema(), websiteSchema()] : [businessSchema(), breadcrumbSchema([{ name: page.crumb, path }])]
    return { ...page, path, jsonLd: graph(...nodes) }
  }

  const match = path.match(/^\/services\/([^/]+)$/)
  const service = match && getService(match[1])
  if (service) {
    return {
      title: service.seo?.title ?? `${service.title} | ${SITE_NAME}`,
      description: service.seo?.description ?? service.summary,
      path,
      jsonLd: graph(
        businessSchema(),
        serviceSchema(service),
        breadcrumbSchema([
          { name: 'Services', path: '/services' },
          { name: service.title, path },
        ]),
      ),
    }
  }

  return { ...notFound, path }
}
