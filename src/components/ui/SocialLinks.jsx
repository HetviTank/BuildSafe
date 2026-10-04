import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import { socials } from '../../data/company'

const external = { target: '_blank', rel: 'noopener noreferrer' }

/**
 * Row of round social buttons that fill with each brand's colour on hover.
 * `tone="dark"` for dark backgrounds, `tone="light"` for light ones.
 */
export function SocialIcons({ tone = 'dark', size = 'md', className = '' }) {
  const box = size === 'sm' ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-base'
  const base =
    tone === 'dark'
      ? 'bg-white/5 text-slate-300 ring-1 ring-white/10'
      : 'bg-white text-ink-900 shadow-sm ring-1 ring-slate-200'

  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {socials.map(({ name, url, icon: Icon, color }, i) => (
        <motion.li
          key={name}
          initial={{ opacity: 0, y: 12, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 18 }}
        >
          <a
            href={url}
            {...external}
            aria-label={`BuildSafe on ${name}`}
            title={name}
            style={{ '--brand': color }}
            className={`group relative grid place-items-center overflow-hidden rounded-full transition duration-300 hover:-translate-y-1 hover:text-white hover:shadow-lg hover:ring-transparent ${box} ${base}`}
          >
            <span className="absolute inset-0 scale-0 rounded-full bg-[var(--brand)] transition-transform duration-300 group-hover:scale-100" />
            <Icon className="relative transition-transform duration-300 group-hover:scale-110" />
          </a>
        </motion.li>
      ))}
    </ul>
  )
}

/** Large brand-coloured cards, one per platform — used on the Contact page. */
export function SocialCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {socials.map(({ name, handle, url, icon: Icon, gradient, cta }, i) => (
        <motion.a
          key={name}
          href={url}
          {...external}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -8 }}
          className={`group relative flex min-h-48 flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg transition-shadow duration-500 hover:shadow-2xl ${gradient}`}
        >
          <Icon className="absolute -bottom-6 -right-6 text-[8rem] text-white/10 transition duration-700 group-hover:-rotate-12 group-hover:scale-110" />
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl backdrop-blur transition duration-500 group-hover:rotate-[360deg] group-hover:bg-white group-hover:text-ink-900">
            <Icon />
          </span>
          <span className="mt-5 font-display text-xl font-bold">{name}</span>
          <span className="mt-0.5 break-all text-sm text-white/80">{handle}</span>
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold">
            {cta}
            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </motion.a>
      ))}
    </div>
  )
}
