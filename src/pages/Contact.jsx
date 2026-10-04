import { useSearchParams } from 'react-router-dom'
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import PageBanner from '../components/layout/PageBanner'
import ContactForm from '../components/sections/ContactForm'
import { ContactCards, MapEmbed } from '../components/sections/ContactCards'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import usePageTitle from '../hooks/usePageTitle'
import { contact, telHref } from '../data/company'
import { getService } from '../data/services'

export default function Contact() {
  usePageTitle('Contact Us')
  const [params] = useSearchParams()
  const preselected = getService(params.get('service') ?? '')?.title ?? ''

  return (
    <>
      <PageBanner
        eyebrow="Contact Us"
        title={<>Let&apos;s make your site <span className="text-gradient">safer</span></>}
        description="Share your requirement and our team will get back to you promptly. For emergencies, call us directly — we respond 24/7."
        crumbs={[{ label: 'Contact Us' }]}
      />

      <section className="relative z-10 -mt-12 pb-8">
        <div className="container-x">
          <ContactCards />
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Get in Touch"
              title="Tell us about your requirement"
              description="Whether it is a Fire NOC, a safety audit, equipment inspection or a civil project — we will guide you through the next steps."
            />
            <Reveal delay={0.2} className="mt-8 space-y-4">
              <a href={telHref(contact.phones[0])} className="group flex items-center gap-4 rounded-2xl bg-ink-900 p-5 text-white transition hover:bg-brand-500">
                <span className="relative grid h-12 w-12 place-items-center rounded-full bg-brand-500 transition group-hover:bg-white group-hover:text-brand-500">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500" />
                  <FaPhoneAlt className="relative" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-slate-400 group-hover:text-brand-100">Emergency? Call now</span>
                  <span className="block font-display text-lg font-bold">{contact.phones[0]}</span>
                </span>
              </a>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl bg-[#25D366]/10 p-5 transition hover:bg-[#25D366]/20">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-2xl text-white">
                  <FaWhatsapp />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-slate-500">Quick response</span>
                  <span className="block font-display text-lg font-bold text-ink-900">Chat on WhatsApp</span>
                </span>
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-3">
            <ContactForm key={preselected} defaultService={preselected} />
          </Reveal>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="container-x">
          <Reveal>
            <MapEmbed className="h-[26rem]" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
