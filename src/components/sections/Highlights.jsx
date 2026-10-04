import { motion } from 'framer-motion'
import Counter from '../ui/Counter'
import { expertise, highlights } from '../../data/company'

export default function Highlights() {
  return (
    <section id="highlights" aria-label="Highlights" className="relative bg-white">
      <div className="container-x relative z-10 -mt-16 sm:-mt-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-slate-200 shadow-2xl shadow-ink-900/10 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, value, suffix, text, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group flex flex-col items-start gap-3 bg-white p-6 transition-colors hover:bg-brand-50 sm:flex-row sm:items-center sm:p-8"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-xl text-brand-500 transition group-hover:rotate-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white">
                <Icon />
              </span>
              <span>
                <span className="block font-display text-2xl font-bold text-ink-900 sm:text-3xl">
                  {text ?? <Counter value={value} suffix={suffix} />}
                </span>
                <span className="block text-sm text-slate-500">{label}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden border-y border-slate-100 bg-slate-50 py-5">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...expertise, ...expertise].map((e, i) => (
            <span key={i} className="flex items-center gap-6 px-6 font-display text-lg font-semibold text-slate-400 sm:text-xl">
              {e}
              <span className="text-brand-500">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
