import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCommentDots, FaTimes } from 'react-icons/fa'

// The chat window is code-split: it only downloads when the visitor opens (or hovers) the launcher.
const loadPanel = () => import('./ChatPanel')
const ChatPanel = lazy(loadPanel)

const TEASER_KEY = 'buildsafe-chat-teaser-seen'
const storage = {
  get: (k) => {
    try {
      return sessionStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k, v) => {
    try {
      sessionStorage.setItem(k, v)
    } catch {
      // storage unavailable — teaser may show again, harmless
    }
  },
}

/** Floating chat launcher + greeting bubble; opens the BuildSafe assistant. */
export default function ChatWidget({ open, onOpenChange }) {
  const [teaser, setTeaser] = useState(false)

  // Show a small greeting once per visit, a few seconds after the page loads.
  useEffect(() => {
    if (storage.get(TEASER_KEY)) return
    const t = setTimeout(() => {
      setTeaser(true)
      loadPanel() // warm up the chat code so opening feels instant
    }, 7000)
    return () => clearTimeout(t)
  }, [])

  const dismissTeaser = () => {
    setTeaser(false)
    storage.set(TEASER_KEY, '1')
  }

  const toggle = () => {
    dismissTeaser()
    onOpenChange(!open)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <ChatPanel onClose={() => onOpenChange(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {teaser && !open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-3 right-16 w-60 origin-bottom-right"
            >
              <button
                type="button"
                onClick={toggle}
                className="w-full rounded-2xl rounded-br-md bg-white p-4 pr-8 text-left text-sm text-ink-800 shadow-xl ring-1 ring-slate-100"
              >
                <span className="font-semibold text-ink-900">Hi there! 👋</span>
                <br />
                Need help with Fire NOC, a safety audit or a free quote? Ask me.
              </button>
              <button type="button" onClick={dismissTeaser} aria-label="Dismiss" className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-xs text-slate-400 hover:bg-slate-100">
                <FaTimes />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggle}
          onMouseEnter={loadPanel}
          onFocus={loadPanel}
          aria-label={open ? 'Close chat' : 'Chat with BuildSafe assistant'}
          aria-expanded={open}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-2xl text-white shadow-xl shadow-brand-500/40 transition hover:scale-110"
        >
          {!open && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500" />}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? 'x' : 'chat'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative">
              {open ? <FaTimes /> : <FaCommentDots />}
            </motion.span>
          </AnimatePresence>
          {teaser && !open && <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-white" />}
        </button>
      </div>
    </>
  )
}
