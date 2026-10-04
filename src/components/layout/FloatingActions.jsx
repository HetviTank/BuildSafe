import { AnimatePresence, motion } from 'framer-motion'
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa'
import useScrolled from '../../hooks/useScrolled'
import { contact } from '../../data/company'

export default function FloatingActions() {
  const showTop = useScrolled(600)

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="grid h-11 w-11 place-items-center rounded-full bg-ink-900 text-white shadow-lg transition hover:bg-brand-500"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
      <a
        href={`https://wa.me/${contact.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-3xl text-white shadow-xl shadow-[#25D366]/40 transition hover:scale-110"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" />
        <FaWhatsapp className="relative" />
      </a>
    </div>
  )
}
