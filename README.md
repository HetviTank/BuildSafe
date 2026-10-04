# BuildSafe Enterprise — Website

A modern, animated single-page website for **BuildSafe Enterprise** (Fire, Safety & Civil Consultancy, Anjar).
Built with **React 19 + Vite**, **Tailwind CSS v4** and **Framer Motion**.

## Getting started

```bash
npm install
npm run dev       # local dev server → http://localhost:5173
npm run build     # production build → dist/
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
src/
├── assets/images/        # Optimised WebP photos (brand/, gallery/)
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
├── hooks/                # usePageTitle, useScrolled
├── pages/                # One file per route
├── styles/index.css      # Tailwind theme (brand colours, fonts, animations)
├── App.jsx               # Routes
└── main.jsx              # Entry point
```

## Editing content

All text lives in **`src/data/`** — no component changes needed.

- **Add a gallery photo:** put it in `src/assets/images/gallery/`, import it in `gallery.js`, add an entry.
- **Add a client logo:** put it in `src/assets/images/clients/`, import it in `clients.js` and set `logo`.
  Clients without a logo show a branded monogram.
- **Edit a service page:** change its entry in `services.js`.

## Contact form

The site is static (no backend). The enquiry form validates input, then opens the visitor's
email app (to both company addresses) or WhatsApp with the message pre-filled.
To receive submissions directly instead, connect a service such as Formspree, EmailJS or Web3Forms
inside `send()` in `src/components/sections/Contact.jsx`.

## Deployment

`npm run build` outputs a static `dist/` folder. Because the site has multiple pages, the host must
send every URL to `index.html`. This is already configured for:

- **Netlify** — `public/_redirects`
- **Vercel** — `vercel.json`
- **Apache / Hostinger / cPanel** — `public/.htaccess`
# BuildSafe
