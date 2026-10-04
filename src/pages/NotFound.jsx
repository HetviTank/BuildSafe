import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'
import Embers from '../components/ui/Embers'
import usePageTitle from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page Not Found')

  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-ink-900 px-4 text-center">
      <Embers className="-z-10" />
      <div>
        <motion.p
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="text-gradient font-display text-8xl font-extrabold sm:text-9xl"
        >
          404
        </motion.p>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">This page could not be found</h1>
        <p className="mt-3 text-slate-400">The page may have moved. Let&apos;s get you back to safety.</p>
        <Link to="/" className="btn-primary mt-8">
          <FaHome /> Back to Home
        </Link>
      </div>
    </section>
  )
}
