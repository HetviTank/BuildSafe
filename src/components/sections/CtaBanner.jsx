import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPhoneAlt, FaFireAlt } from 'react-icons/fa'
import { contact, telHref } from '../../data/company'

export default function CtaBanner({
  title = 'Need a fire safety audit or NOC support?',
  text = 'Talk to our team today — we’ll assess your site and guide you through every compliance step.',
}) {
  return (
    <section aria-label="Call to action" className="bg-white py-20">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-6 py-14 text-center sm:px-16"
        >
          <motion.span
            className="absolute -left-6 -top-6 text-[10rem] text-white/10"
            animate={{ rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <FaFireAlt />
          </motion.span>
          <motion.span
            className="absolute -bottom-10 -right-4 text-[12rem] text-white/10"
            animate={{ rotate: [12, 0, 12] }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            <FaFireAlt />
          </motion.span>
          <p className="relative text-sm font-bold uppercase tracking-[0.25em] text-brand-100">24/7 Emergency Response</p>
          <h2 className="relative mx-auto mt-4 max-w-3xl text-3xl font-bold text-white sm:text-5xl">{title}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-brand-50">{text}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <a href={telHref(contact.phones[0])} className="btn bg-white text-brand-600 shadow-xl hover:-translate-y-0.5 hover:bg-ink-900 hover:text-white">
              <FaPhoneAlt /> {contact.phones[0]}
            </a>
            <Link to="/contact" className="btn border border-white/40 text-white hover:bg-white/10">
              Send an Enquiry
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
