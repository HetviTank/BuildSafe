import PageBanner from '../components/layout/PageBanner'
import ServicesGrid from '../components/sections/ServicesGrid'
import Process from '../components/sections/Process'
import CtaBanner from '../components/sections/CtaBanner'

export default function Services() {
  return (
    <>
      <PageBanner
        eyebrow="Our Services"
        title={<>Safety &amp; engineering <span className="text-gradient">services</span></>}
        description="Inspection, auditing, testing, training and technical consultancy — aligned with NBC, IS standards and applicable Factory Rules."
        crumbs={[{ label: 'Services' }]}
      />
      <section className="section bg-slate-50">
        <div className="container-x">
          <ServicesGrid />
        </div>
      </section>
      <Process />
      <CtaBanner />
    </>
  )
}
