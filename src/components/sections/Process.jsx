import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { process } from '../../data/company'

export default function Process() {
  return (
    <section aria-labelledby="process-title" className="section relative overflow-hidden bg-ink-900">
      <div className="grid-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="container-x relative">
        <SectionHeading
          dark
          eyebrow="Our Approach"
          title="Practical expertise, from site to solution"
          description="We combine technical knowledge with field experience to deliver cost-effective, customised solutions — never generic checklists."
        />

        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute left-[12%] right-[12%] top-10 hidden h-px origin-left bg-gradient-to-r from-brand-500 via-brand-400 to-amber-400 lg:block"
          />
          {process.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className="group relative text-center"
            >
              <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-2xl text-brand-400 shadow-xl transition duration-500 group-hover:-translate-y-2 group-hover:rotate-6 group-hover:bg-brand-500 group-hover:text-white">
                <Icon />
                <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white font-display text-xs font-bold text-ink-900">
                  0{i + 1}
                </span>
              </div>
              <h3 id={i === 0 ? 'process-title' : undefined} className="mt-6 text-lg font-bold text-white">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-400">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
