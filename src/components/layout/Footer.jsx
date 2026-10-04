import { Link } from 'react-router-dom'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import Logo from '../ui/Logo'
import { company, contact, navLinks, telHref } from '../../data/company'
import { services } from '../../data/services'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-slate-400">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-14 w-14" />
            <div>
              <p className="font-display text-xl font-bold text-white">{company.name}</p>
              <p className="text-sm text-brand-400">{company.tagline}</p>
            </div>
          </Link>
          <p className="mt-5 text-sm leading-relaxed">{company.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-navy-600/60 bg-navy-700/30 px-4 py-1.5 text-xs font-semibold text-blue-200">
              {company.certification}
            </span>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-lg text-white transition hover:bg-[#25D366]"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-brand-400">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Services</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="transition hover:text-brand-400">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Get in Touch</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-brand-500" />
              <span>{contact.address.line1}, {contact.address.line2}, {contact.address.city}</span>
            </li>
            {contact.phones.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-brand-500" />
                <a href={telHref(p)} className="hover:text-white">{p}</a>
              </li>
            ))}
            {contact.emails.map((e) => (
              <li key={e} className="flex items-center gap-3">
                <FaEnvelope className="shrink-0 text-brand-500" />
                <a href={`mailto:${e}`} className="break-all hover:text-white">{e}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>© {year} {company.name}. All rights reserved.</p>
          <p>Fire · Safety · Civil Consultancy — Anjar, Gujarat</p>
        </div>
      </div>
    </footer>
  )
}
