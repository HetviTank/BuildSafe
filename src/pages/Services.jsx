import PageBanner from '../components/layout/PageBanner'
import ServicesGrid from '../components/sections/ServicesGrid'
import Process from '../components/sections/Process'
import CtaBanner from '../components/sections/CtaBanner'
import usePageTitle from '../hooks/usePageTitle'

export default function Services() {
  usePageTitle('Our Services')

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
