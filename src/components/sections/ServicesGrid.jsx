import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import { ServiceArt } from '../illustrations'
import { services } from '../../data/services'

export default function ServicesGrid({ exclude }) {
  const list = exclude ? services.filter((s) => s.slug !== exclude) : services

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s, i) => (
        <motion.div
          key={s.slug}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: (i % 3) * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to={`/services/${s.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-ink-900/15"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <ServiceArt name={s.art} className="h-full w-full transition duration-700 group-hover:scale-105" />
              <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-white/95 text-lg text-brand-500 shadow-lg transition duration-500 group-hover:rotate-12 group-hover:bg-brand-500 group-hover:text-white">
                <s.icon />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold transition group-hover:text-brand-600">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500">
                Explore service
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
