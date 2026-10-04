import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChevronRight } from 'react-icons/fa'
import Embers from '../ui/Embers'

/** Dark hero banner with breadcrumb, used at the top of every inner page. */
export default function PageBanner({ eyebrow, title, description, crumbs = [], children }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 pb-20 pt-36 sm:pb-24">
      <div className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-[110px]" />
      <div className="absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-navy-600/30 blur-[110px]" />
      <Embers className="-z-10 opacity-60" />

      <div className={`container-x grid items-center gap-12 ${children ? 'lg:grid-cols-2' : ''}`}>
        <div className={children ? '' : 'mx-auto max-w-3xl text-center'}>
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-wrap items-center gap-2 text-sm text-slate-400 ${children ? '' : 'justify-center'}`}
          >
            <Link to="/" className="hover:text-brand-400">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <FaChevronRight className="text-[10px]" />
                {c.to ? (
                  <Link to={c.to} className="hover:text-brand-400">{c.label}</Link>
                ) : (
                  <span className="text-brand-400">{c.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-brand-400"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-5 text-lg leading-relaxed text-slate-300"
            >
              {description}
            </motion.p>
          )}
        </div>
        {children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
