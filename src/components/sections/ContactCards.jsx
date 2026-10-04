import { motion } from 'framer-motion'
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa'
import { company, contact, telHref } from '../../data/company'

const cards = [
  {
    icon: FaPhoneAlt,
    title: 'Call Us',
    lines: contact.phones.map((p) => ({ text: p, href: telHref(p) })),
  },
  {
    icon: FaEnvelope,
    title: 'Email Us',
    lines: contact.emails.map((e) => ({ text: e, href: `mailto:${e}` })),
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Visit Us',
    lines: [{ text: contact.address.line1 }, { text: contact.address.line2 }, { text: contact.address.city }],
  },
  {
    icon: FaClock,
    title: 'Availability',
    lines: [{ text: contact.hours }, { text: 'Site visits by appointment' }],
  },
]

export function ContactCards({ className = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4' }) {
  return (
    <div className={className}>
      {cards.map(({ icon: Icon, title, lines }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-ink-900/10"
        >
          <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/5 transition duration-500 group-hover:scale-[3] group-hover:bg-brand-500/10" />
          <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-xl text-white shadow-lg shadow-brand-500/30 transition duration-500 group-hover:rotate-12">
            <Icon />
          </span>
          <h3 className="relative mt-5 text-lg font-bold">{title}</h3>
          <div className="relative mt-2 space-y-1">
            {lines.map((l) =>
              l.href ? (
                <a key={l.text} href={l.href} className="block break-words text-sm text-slate-600 transition hover:text-brand-600">
                  {l.text}
                </a>
              ) : (
                <p key={l.text} className="text-sm text-slate-600">{l.text}</p>
              ),
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function MapEmbed({ className = 'h-96' }) {
  return (
    <iframe
      title={`${company.name} location`}
      src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&z=14&output=embed`}
      className={`w-full rounded-3xl border-0 shadow-xl shadow-ink-900/5 ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}
