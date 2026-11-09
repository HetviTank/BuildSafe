import { useSearchParams } from 'react-router-dom'
import PageBanner from '../components/layout/PageBanner'
import ContactForm from '../components/sections/ContactForm'
import { ContactCards, MapEmbed } from '../components/sections/ContactCards'
import Reveal from '../components/ui/Reveal'
import { SocialCards } from '../components/ui/SocialLinks'
import SectionHeading from '../components/ui/SectionHeading'
import { getService } from '../data/services'

const nextSteps = [
  { title: 'Your enquiry reaches our team instantly', text: 'Submitting the form sends your details straight to the BuildSafe team on WhatsApp and email.' },
  { title: 'We get in touch', text: 'Our team contacts you on the mobile number or email you shared to understand your site and requirement.' },
  { title: 'Free quote & next steps', text: 'You get a clear scope and quotation — Fire NOC, audit, inspection, training or civil work.' },
]

export default function Contact() {
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
            <Reveal delay={0.2} className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">What happens next</p>
              <ol className="mt-5 space-y-5">
                {nextSteps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500/10 font-display text-sm font-bold text-brand-600">{i + 1}</span>
                    <span>
                      <span className="block font-semibold text-ink-900">{step.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-3">
            <ContactForm key={preselected} defaultService={preselected} />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Stay Connected"
            title={<>Follow BuildSafe on <span className="text-brand-500">social media</span></>}
            description="Safety tips, training highlights and updates from our sites — follow us on your favourite platform."
          />
          <div className="mt-12">
            <SocialCards />
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container-x">
          <Reveal>
            <MapEmbed className="h-[26rem]" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
