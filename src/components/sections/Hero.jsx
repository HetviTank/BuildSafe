import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa'
import isoBadge from '../../assets/images/brand/iso-badge.webp'
import Embers from '../ui/Embers'
import { company } from '../../data/company'

const headline = ['Safety', 'Today,']
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}
const points = ['Fire NOC & Compliance', 'Safety Audits & Inspection', 'Civil & Structural Engineering']

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="home" ref={ref} className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink-900">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800" />
      <motion.div style={{ y: bgY }} className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Embers className="-z-10" />
      <div className="absolute -left-32 top-1/4 -z-10 h-96 w-96 rounded-full bg-brand-500/25 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-navy-600/30 blur-[120px]" />

      <motion.div style={{ opacity: fade }} className="container-x grid items-center gap-14 pb-20 pt-32 lg:grid-cols-12">
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-7">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Fire · Safety · Civil Consultancy
          </motion.span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {headline.map((word) => (
              <motion.span key={word} variants={item} className="mr-4 inline-block">
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span variants={item} className="text-gradient inline-block">
              Secure Tomorrow.
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            {company.summary}
          </motion.p>

          <motion.ul variants={item} className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <FaCheckCircle className="text-brand-500" /> {p}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary group">
              Get a Free Consultation
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/services" className="btn-ghost">Explore Services</Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto hidden w-full max-w-sm lg:col-span-5 lg:block"
        >
          <div className="animate-float">
            <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="relative rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="absolute inset-0 animate-[spin_30s_linear_infinite] rounded-full border-2 border-dashed border-brand-500/40" />
              <img src={isoBadge} alt={company.certification} className="relative rounded-full bg-white shadow-2xl" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute -right-6 -top-4 rounded-2xl border border-white/10 bg-ink-800/90 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="font-display text-2xl font-bold text-white">24/7</p>
            <p className="text-xs text-slate-400">Emergency Response</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute -bottom-4 -left-8 rounded-2xl border border-white/10 bg-ink-800/90 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="font-display text-2xl font-bold text-brand-400">100%</p>
            <p className="text-xs text-slate-400">Client Satisfaction</p>
          </motion.div>
        </motion.div>
      </motion.div>

      <a
        href="#highlights"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <span className="flex h-11 w-7 justify-center rounded-full border-2 border-white/30 pt-2">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-brand-500"
          />
        </span>
      </a>
    </section>
  )
}
