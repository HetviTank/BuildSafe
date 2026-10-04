import { motion } from 'framer-motion'
import { industries } from '../../data/company'

export default function Industries() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {industries.map(({ icon: Icon, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -6 }}
          className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-6 text-center transition-colors hover:bg-brand-50"
        >
          <Icon className="text-3xl text-brand-500" />
          <span className="text-sm font-semibold text-ink-900">{label}</span>
        </motion.div>
      ))}
    </div>
  )
}
