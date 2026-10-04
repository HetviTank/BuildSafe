import { Link, Navigate, NavLink, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaCheck, FaPhoneAlt, FaWhatsapp, FaEnvelope, FaAward } from 'react-icons/fa'
import PageBanner from '../components/layout/PageBanner'
import CtaBanner from '../components/sections/CtaBanner'
import ServicesGrid from '../components/sections/ServicesGrid'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import { ServiceArt } from '../components/illustrations'
import usePageTitle from '../hooks/usePageTitle'
import { contact, process, telHref } from '../data/company'
import { getService, services } from '../data/services'
import { gallery } from '../data/gallery'

const benefits = [
  'Aligned with NBC, IS standards & Factory Rules',
  'Practical, on-site evaluation by experienced engineers',
  'Clear reports with prioritised recommendations',
  'Cost-effective solutions customised to your site',
]

function Sidebar({ current }) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-bold">All Services</h3>
        <ul className="mt-4 space-y-1.5">
          {services.map((s) => (
            <li key={s.slug}>
              <NavLink
                to={`/services/${s.slug}`}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-ink-900 hover:bg-brand-50 hover:text-brand-600'
                  }`
                }
              >
                <s.icon className={s.slug === current ? 'text-white' : 'text-brand-500'} />
                <span className="flex-1">{s.title}</span>
                <FaArrowRight className="text-xs opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-7 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/30 blur-2xl" />
        <h3 className="relative text-xl font-bold text-white">Need help with this?</h3>
        <p className="relative mt-2 text-sm text-slate-300">Talk to our team — 24/7 emergency response.</p>
        <div className="relative mt-5 space-y-3">
          <a href={telHref(contact.phones[0])} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-brand-500">
            <FaPhoneAlt className="text-brand-400" /> {contact.phones[0]}
          </a>
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-[#25D366]">
            <FaWhatsapp className="text-lg text-[#25D366]" /> Chat on WhatsApp
          </a>
          <a href={`mailto:${contact.emails[0]}`} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-brand-500">
            <FaEnvelope className="text-brand-400" /> Email us
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500 text-xl text-white">
          <FaAward />
        </span>
        <p className="text-sm font-semibold text-ink-900">ISO 9001:2015 certified quality management</p>
      </div>
    </aside>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getService(slug)
  usePageTitle(service?.title)

  if (!service) return <Navigate to="/services" replace />

  const photos = gallery.filter((g) => g.category === service.art)
  const index = services.indexOf(service)
  const prev = services[(index - 1 + services.length) % services.length]
  const next = services[(index + 1) % services.length]

  return (
    <>
      <PageBanner
        eyebrow={service.tagline}
        title={service.title}
        description={service.summary}
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
      >
        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-500/40 to-transparent blur-xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <ServiceArt name={service.art} className="aspect-[4/3] w-full" />
          </div>
        </div>
      </PageBanner>

      <section className="section bg-slate-50">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                <service.icon /> Overview
              </span>
              <p className="mt-5 text-xl leading-relaxed text-ink-800">{service.intro}</p>
            </Reveal>

            <h2 className="mt-14 text-2xl font-bold sm:text-3xl">What we offer</h2>
            <div className="mt-6 space-y-5">
              {service.items.map((item, i) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition duration-500 hover:shadow-xl hover:ring-brand-200 sm:p-8"
                >
                  <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-brand-500 transition duration-500 group-hover:scale-y-100" />
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink-900 font-display text-lg font-bold text-white transition duration-500 group-hover:bg-brand-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
                      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        {item.points.map((p) => (
                          <li key={p} className="flex gap-2.5 text-sm text-slate-600">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/10 text-[9px] text-brand-500">
                              <FaCheck />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {photos.length > 0 && (
              <>
                <h2 className="mt-14 text-2xl font-bold sm:text-3xl">From the field</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {photos.slice(0, 4).map((photo, i) => (
                    <Reveal key={photo.title} delay={i * 0.08}>
                      <figure className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-900">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          loading="lazy"
                          className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${photo.position ?? ''}`}
                        />
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-5 pt-12 text-sm font-semibold text-white">
                          {photo.title}
                        </figcaption>
                      </figure>
                    </Reveal>
                  ))}
                </div>
              </>
            )}

            {/* Why BuildSafe */}
            <Reveal className="mt-14 rounded-3xl bg-ink-900 p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-white">Why choose BuildSafe?</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-slate-300">
                    <FaCheck className="mt-1 shrink-0 text-brand-400" /> {b}
                  </li>
                ))}
              </ul>
              <Link to={`/contact?service=${service.slug}`} className="btn-primary group mt-8">
                Enquire about this service <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>

            {/* How we work */}
            <h2 className="mt-14 text-2xl font-bold sm:text-3xl">How we work</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {process.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.08}>
                  <div className="flex h-full gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                      <Icon />
                    </span>
                    <div>
                      <h3 className="font-bold">{i + 1}. {title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Prev / next */}
            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              <Link to={`/services/${prev.slug}`} className="group rounded-2xl bg-white p-5 ring-1 ring-slate-100 transition hover:ring-brand-300">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <FaArrowLeft className="transition group-hover:-translate-x-1" /> Previous
                </span>
                <span className="mt-1 block font-bold text-ink-900 group-hover:text-brand-600">{prev.title}</span>
              </Link>
              <Link to={`/services/${next.slug}`} className="group rounded-2xl bg-white p-5 text-right ring-1 ring-slate-100 transition hover:ring-brand-300">
                <span className="flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Next <FaArrowRight className="transition group-hover:translate-x-1" />
                </span>
                <span className="mt-1 block font-bold text-ink-900 group-hover:text-brand-600">{next.title}</span>
              </Link>
            </div>
          </div>

          <Sidebar current={service.slug} />
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Explore More" title="Other services" />
          <div className="mt-12">
            <ServicesGrid exclude={service.slug} />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
