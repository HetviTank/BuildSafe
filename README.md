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
api/lead.js               # Serverless function: enquiry form → WhatsApp (CallMeBot) + email (Gmail)
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
├── lib/
│   ├── deliverLead.js    # Sends a lead: server (WhatsApp/email) + FormSubmit email fallback
│   ├── lead.js           # Enquiry-form validation rules (shared with api/lead.js)
│   └── formsubmit.js     # No-key email delivery of enquiries (FormSubmit)
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

## Contact form → WhatsApp + email leads

When a visitor clicks **Send Enquiry**, the lead is delivered automatically to:

- **buildsafeenterprise@gmail.com + admin.buildsafe@gmail.com** — works with **no API keys**: the browser
  sends it through [FormSubmit](https://formsubmit.co) (`src/lib/formsubmit.js`). If a Gmail app password is
  configured, the server sends it from the company Gmail instead (no duplicates). *Reply* answers the visitor.
- **WhatsApp +91 79907 04863** — via [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
  from `api/lead.js`, once `CALLMEBOT_APIKEY` is set (WhatsApp always needs the number owner's one-time permission).

The visitor sees "Thank you" when any channel delivered it; only if everything fails do they get one-tap
WhatsApp / email fallbacks. Form rules (shared by browser and server, in `src/lib/lead.js`):
name, mobile (fixed +91, exactly 10 digits starting 6–9), valid email, and message are required;
fields are checked live as the visitor types. Spam protection: hidden honeypot field,
"submitted too fast" check, and a per-IP rate limit. Secrets stay on the server.

**Activate email (once, required):** after deploying, submit one test enquiry on `/contact`. FormSubmit emails
buildsafeenterprise@gmail.com an **"Activate Form"** link (check Spam/Promotions too) — click it. Every
enquiry after that arrives in both inboxes automatically.

**WhatsApp setup (and optional Gmail sending)** — Vercel → Project → Settings → **Environment Variables** (Production + Preview):

| Variable | Value |
| --- | --- |
| `CALLMEBOT_APIKEY` | On the phone with +91 79907 04863, save **+34 644 91 07 79** as a contact and WhatsApp it `I allow callmebot to send me messages` — it replies with the key |
| `GMAIL_APP_PASSWORD` *(optional — replaces FormSubmit)* | Sign in to buildsafeenterprise@gmail.com → [Google Account → Security](https://myaccount.google.com/security) → turn on 2-Step Verification → [App passwords](https://myaccount.google.com/apppasswords) → create one named "Website" → copy the 16-character password |

Optional overrides: `CALLMEBOT_PHONE` (default `+917990704863`), `GMAIL_USER`
(default `buildsafeenterprise@gmail.com`), `LEAD_EMAIL_TO` (default both BuildSafe addresses, comma-separated).

Then redeploy (Deployments → ⋯ → Redeploy) and send a test enquiry from `/contact`.
For local testing copy `.env.example` to `.env.local` and run `npm run dev`.
If leads stop arriving, check Vercel → Project → **Logs** for lines starting with `lead:`.

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

After the first deploy — **these steps decide whether the site appears on Google**:

1. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console) → *Add property* →
   **URL prefix** → `https://build-safe-zeta.vercel.app/` → choose **HTML tag** → copy only the `content="…"` value into
   `GOOGLE_SITE_VERIFICATION` in `src/seo/config.js` → push → click **Verify**.
   Then: *Sitemaps* → submit `sitemap.xml`; *URL inspection* → enter the home URL → **Request indexing**
   (repeat for /services, /contact and each service page).
2. **Google Business Profile** — [business.google.com](https://business.google.com) → create "BuildSafe Enterprise"
   with exactly the same name, address and phone as the website, category *Fire protection consultant* /
   *Safety consultant*, add the website link and photos. This is what shows the business on Google Maps and for
   "buildsafe anjar" / "fire safety consultant near me".
3. **Link the website everywhere** — put `https://build-safe-zeta.vercel.app` in the bio/website field of the Facebook,
   Instagram, LinkedIn, X and YouTube profiles, and list the business (same name/address/phone) on JustDial,
   IndiaMART and Sulekha. Each link helps Google discover and trust the site.
4. **Own domain (recommended)** — e.g. `buildsafeenterprise.in`. Buy it, add it in Vercel → Project → Settings →
   Domains, then set `SITE_URL` in `src/seo/config.js` to it and redeploy. A real domain ranks and looks far better
   than `*.vercel.app` (Search Console can then be verified by DNS instead of the HTML tag).
5. Check the structured data with the [Rich Results Test](https://search.google.com/test/rich-results).

Expect the site to appear for **"BuildSafe Enterprise"** and **"BuildSafe Anjar / Kutch"** within days to a few weeks of
indexing. The bare term "build safe" is shared with established companies (e.g. buildsafe.in, Buildsafe Australia), so
ranking first for it takes time, links and reviews — the brand + location searches are what customers in Kutch use.

## Deployment

`npm run build` outputs a static `dist/` folder with one HTML file per page (`about.html`,
`services/fire-safety.html`, ...) and a `404.html`. Clean URLs (`/about`), real 404s and long-term
caching of `/assets/` are already configured for:

- **Vercel** — `vercel.json`
- **Netlify** — works out of the box (`public/_headers` for caching)
- **Apache / Hostinger / cPanel** — `public/.htaccess`
