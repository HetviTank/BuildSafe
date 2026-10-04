import PageBanner from '../components/layout/PageBanner'
import GalleryGrid from '../components/sections/GalleryGrid'
import CtaBanner from '../components/sections/CtaBanner'
import usePageTitle from '../hooks/usePageTitle'

export default function Gallery() {
  usePageTitle('Gallery')

  return (
    <>
      <PageBanner
        eyebrow="Gallery"
        title={<>Our work in the <span className="text-gradient">field</span></>}
        description="A look at our inspections, audits, training and engineering work."
        crumbs={[{ label: 'Gallery' }]}
      />
      <section className="section bg-slate-50">
        <div className="container-x">
          <GalleryGrid />
        </div>
      </section>
      <CtaBanner title="Want results like these on your site?" />
    </>
  )
}
