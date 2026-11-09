import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'
import useScrolled from '../../hooks/useScrolled'
import ChatWidget from '../chat/ChatWidget'

/** Bottom-right floating buttons: back-to-top and the BuildSafe chat assistant. */
export default function FloatingActions() {
  const showTop = useScrolled(600)
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && !chatOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mr-1.5 grid h-11 w-11 place-items-center rounded-full bg-ink-900 text-white shadow-lg transition hover:bg-brand-500"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  )
}
