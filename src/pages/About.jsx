import { FaBullseye, FaEye, FaCheckCircle } from 'react-icons/fa'
import PageBanner from '../components/layout/PageBanner'
import Process from '../components/sections/Process'
import Industries from '../components/sections/Industries'
import CtaBanner from '../components/sections/CtaBanner'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import ClientCard from '../components/ui/ClientCard'
import CivilArt from '../components/illustrations/CivilArt'
import isoBadge from '../assets/images/brand/iso-badge.webp'
import usePageTitle from '../hooks/usePageTitle'
import { about, company, expertise } from '../data/company'
import { clients } from '../data/clients'

export default function About() {
  usePageTitle('About Us')

  return (
    <>
      <PageBanner
        eyebrow="About BuildSafe"
        title={<>Building a <span className="text-gradient">safer</span> tomorrow</>}
        description={company.summary}
        crumbs={[{ label: 'About Us' }]}
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <CivilArt className="aspect-[4/3] w-full" />
        </div>
      </PageBanner>

      {/* Who we are */}
      <section className="section overflow-hidden bg-white">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Who We Are" title="Fire, safety & civil expertise under one roof" />
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg font-medium text-ink-800">{about.intro}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{about.body}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{about.approach}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {expertise.slice(0, 6).map((e) => (
                  <li key={e} className="flex items-center gap-3 text-sm font-semibold text-ink-900">
                    <FaCheckCircle className="text-brand-500" /> {e}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal direction="left" className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="relative animate-float rounded-full bg-white p-4 shadow-2xl ring-1 ring-slate-100">
              <div className="absolute inset-0 animate-[spin_30s_linear_infinite] rounded-full border-2 border-dashed border-brand-500/40" />
              <img src={isoBadge} alt={company.certification} className="relative rounded-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="section bg-slate-50">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[
            { icon: FaBullseye, title: 'Our Mission', text: about.mission },
            { icon: FaEye, title: 'Our Vision', text: about.vision },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.15}>
              <div className="group relative h-full overflow-hidden rounded-3xl bg-ink-900 p-10 text-white">
                <Icon className="absolute -bottom-6 -right-6 text-[9rem] text-white/5 transition duration-700 group-hover:rotate-12 group-hover:scale-110" />
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-2xl shadow-lg shadow-brand-500/30">
                  <Icon />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-white">{title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Process />

      {/* Sectors & clients */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Sectors We Serve" title="Where our expertise makes a difference" />
          <div className="mt-12">
            <Industries />
          </div>

          <div className="mt-24">
            <SectionHeading eyebrow="Our Clients" title="Organisations that trust BuildSafe" />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {clients.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.06}>
                  <ClientCard client={c} className="h-full" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
