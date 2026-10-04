import { Link } from 'react-router-dom'
import { FaArrowRight, FaBullseye, FaEye } from 'react-icons/fa'
import Hero from '../components/sections/Hero'
import Highlights from '../components/sections/Highlights'
import Process from '../components/sections/Process'
import ServicesGrid from '../components/sections/ServicesGrid'
import ClientsMarquee from '../components/sections/ClientsMarquee'
import GalleryGrid from '../components/sections/GalleryGrid'
import CtaBanner from '../components/sections/CtaBanner'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import FireArt from '../components/illustrations/FireArt'
import extinguisherAudit from '../assets/images/gallery/extinguisher-audit.webp'
import usePageTitle from '../hooks/usePageTitle'
import { about } from '../data/company'

export default function Home() {
  usePageTitle()

  return (
    <>
      <Hero />
      <Highlights />

      {/* About preview */}
      <section className="section overflow-hidden bg-white">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <Reveal direction="right" className="relative">
            <div className="absolute -left-6 -top-6 h-40 w-40 rounded-3xl bg-brand-500/10" />
            <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full border-[14px] border-brand-500/10" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <FireArt className="aspect-[4/3] w-full" />
            </div>
            <div className="absolute -bottom-10 left-6 hidden w-56 overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:block">
              <img src={extinguisherAudit} alt="Fire extinguisher compliance check" className="aspect-[5/3] w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -top-5 right-6 rounded-2xl bg-white px-5 py-4 shadow-xl">
              <p className="font-display text-lg font-bold text-ink-900">ISO 9001:2015</p>
              <p className="text-xs text-slate-500">Certified Company</p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title={<>Protecting people, property &amp; <span className="text-brand-500">progress</span></>}
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg font-medium text-ink-800">{about.intro}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{about.body}</p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: FaBullseye, title: 'Our Mission', text: about.mission },
                { icon: FaEye, title: 'Our Vision', text: about.vision },
              ].map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={0.15 + i * 0.1}>
                  <div className="group h-full rounded-2xl border border-slate-100 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-xl">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-white transition group-hover:bg-brand-500">
                      <Icon />
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3} className="mt-8">
              <Link to="/about" className="btn-primary group">
                More About Us <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeading
            eyebrow="What We Do"
            title={<>Complete fire, safety &amp; <span className="text-brand-500">civil</span> solutions</>}
            description="Six specialised service lines that help industries, warehouses and buildings meet fire safety and statutory requirements."
          />
          <div className="mt-14">
            <ServicesGrid />
          </div>
        </div>
      </section>

      <Process />

      {/* Clients */}
      <section className="section overflow-hidden bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Clients"
            title="Trusted by leading organisations"
            description="From defence and FMCG to chemicals and processing — organisations that take safety seriously work with us."
          />
        </div>
        <div className="mt-14">
          <ClientsMarquee />
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Gallery" title="Our work in the field" />
            <Reveal>
              <Link to="/gallery" className="btn-outline group">
                View Full Gallery <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12">
            <GalleryGrid limit={6} filters={false} />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
