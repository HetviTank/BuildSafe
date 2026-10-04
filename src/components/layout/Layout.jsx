import { Suspense } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import FloatingActions from './FloatingActions'

/** App shell: shared chrome plus animated transitions between pages. */
export default function Layout() {
  const { pathname } = useLocation()
  const outlet = useOutlet()

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="min-h-svh bg-ink-900" />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <FloatingActions />
    </>
  )
}
