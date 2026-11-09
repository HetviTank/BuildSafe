# BuildSafe Enterprise — Website

A modern, animated, SEO-optimised website for **BuildSafe Enterprise** (Fire, Safety & Civil Consultancy, Anjar).
Built with **React 19 + Vite**, **Tailwind CSS v4** and **Framer Motion**.

## Getting started

```bash
npm install
npm run dev       # local dev server → http://localhost:5173
npm run build     # production build → dist/ (every page pre-rendered to HTML)
npm run preview   # preview the production build
npm run lint
```

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Us |
| `/services` | All services |
| `/services/fire-safety` · `health-safety-training` · `iso-consulting` · `third-party-inspection` · `audits` · `civil-engineering` | One page per service |
| `/gallery` | Filterable gallery with lightbox |
| `/contact` | Contact (`/contact?service=audits` pre-selects a service) |

## Folder structure

```
raw-images/               # Original full-size photos/logos (NOT used by the site)
├── gallery/              # Same names as the WebP versions in src/assets/images/gallery/
└── clients/              # Same names as the WebP versions in src/assets/images/clients/
api/lead.js               # Serverless function: enquiry form → WhatsApp (CallMeBot)
public/                   # Copied as-is to dist/: favicon, app icons, og-image.jpg (share preview),
                          # site.webmanifest, hosting config (.htaccess, _headers)
scripts/prerender.js      # Build step: renders every route to static HTML + sitemap.xml + robots.txt
src/
├── assets/images/        # Optimised WebP photos used by the site (brand/, clients/, gallery/)
├── components/
│   ├── illustrations/    # Custom animated SVG artwork, one per service
│   ├── layout/           # Layout (page transitions), Navbar, Footer, PageBanner, ...
│   ├── sections/         # Reusable blocks: Hero, ServicesGrid, GalleryGrid, ContactForm, ...
│   └── ui/               # Small building blocks: Reveal, Counter, Embers, ClientCard, ...
├── data/                 # ALL site content
│   ├── company.js        # Name, contacts, address, navigation, mission/vision
│   ├── services.js       # The 6 service pages
│   ├── clients.js        # Client list
│   └── gallery.js        # Gallery photos & artwork
├── hooks/                # useSeo, useScrolled
├── pages/                # One file per route
├── seo/
│   ├── config.js         # SITE_URL (live domain), business address, share image
│   ├── meta.js           # Page titles/descriptions + Google structured data (JSON-LD)
│   └── head.js           # Writes the <head> tags (build time and in the browser)
├── styles/index.css      # Tailwind theme (brand colours, fonts, animations)
├── App.jsx               # Routes
├── main.jsx              # Browser entry (hydrates the pre-rendered HTML)
└── entry-server.jsx      # Build-time entry used by scripts/prerender.js
```

## Editing content

All text lives in **`src/data/`** — no component changes needed.

- **Add a gallery photo:** keep the original in `raw-images/gallery/`, save a WebP copy (~1280px wide)
  in `src/assets/images/gallery/`, import it in `gallery.js`, add an entry.
- **Add a client logo:** put it in `src/assets/images/clients/`, import it in `clients.js` and set `logo`.
  Clients without a logo show a branded monogram.
- **Edit a service page:** change its entry in `services.js` (its `seo` block is the Google title/description).
- **Add a new service:** add an entry to `services.js` — its page, sitemap entry and structured data are generated automatically.

## Contact form → WhatsApp leads (CallMeBot)

"Send Enquiry" posts the form to `api/lead.js` (a Vercel serverless function), which forwards the
lead to the business WhatsApp through [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/).
The API key lives only on the server. Spam protection: hidden honeypot field, "submitted too fast" check,
and a per-IP rate limit. If delivery fails, the visitor gets one-tap WhatsApp / email fallbacks.

**One-time setup**

1. On the phone with the receiving WhatsApp number, save **+34 644 91 07 79** as a contact and send it:
   `I allow callmebot to send me messages` — the bot replies with your API key.
2. In Vercel → Project → Settings → **Environment Variables**, add (for Production *and* Preview):
   - `CALLMEBOT_PHONE` = the receiving number with country code, e.g. `+917990704863`
   - `CALLMEBOT_APIKEY` = the key from step 1
3. Redeploy (Deployments → ⋯ → Redeploy), then send a test enquiry from `/contact`.

For local testing copy `.env.example` to `.env.local`, fill in the key and run `npm run dev`.
If messages stop arriving, check Vercel → Project → Logs for lines starting with `lead:`.

## SEO

- **Before going live, set `SITE_URL` in `src/seo/config.js`** to the real domain. The build warns while it
  is still the placeholder.
- Every page is pre-rendered at build time, so Google and social apps (WhatsApp, LinkedIn, ...) see the
  full content plus that page's own title, description, canonical URL, share image and structured data.
- Page titles/descriptions: static pages in `src/seo/meta.js`, service pages in `src/data/services.js`.
- Structured data: a `ProfessionalService` (local business) with address, phones and social profiles on
  every page, a `Service` on each service page, and breadcrumbs.
- `dist/sitemap.xml` and `dist/robots.txt` are generated from the routes on every build.
- **Adding a new page/route:** add it to `App.jsx` *and* to `pages` in `src/seo/meta.js`, otherwise it
  is not pre-rendered and will return 404 on the live site.

After the first deploy:

1. Add the site to [Google Search Console](https://search.google.com/search-console), verify it and
   submit `https://<your-domain>/sitemap.xml`.
2. Create/claim the **Google Business Profile** for BuildSafe Enterprise with the same name, address
   and phone as the website — this drives "near me" and Google Maps results.
3. Check the structured data with the [Rich Results Test](https://search.google.com/test/rich-results).

## Deployment

`npm run build` outputs a static `dist/` folder with one HTML file per page (`about.html`,
`services/fire-safety.html`, ...) and a `404.html`. Clean URLs (`/about`), real 404s and long-term
caching of `/assets/` are already configured for:

- **Vercel** — `vercel.json`
- **Netlify** — works out of the box (`public/_headers` for caching)
- **Apache / Hostinger / cPanel** — `public/.htaccess`
