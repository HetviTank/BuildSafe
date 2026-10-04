import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FaPhoneAlt, FaChevronDown } from 'react-icons/fa'
import Logo from '../ui/Logo'
import { SocialIcons } from '../ui/SocialLinks'
import useScrolled from '../../hooks/useScrolled'
import { contact, navLinks, telHref } from '../../data/company'
import { services } from '../../data/services'

const isActive = (pathname, to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

function ServicesDropdown({ onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-4"
    >
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-ink-900/95 p-3 shadow-2xl backdrop-blur-xl">
        {services.map(({ slug, title, icon: Icon, tagline }) => (
          <NavLink
            key={slug}
            to={`/services/${slug}`}
            onClick={onNavigate}
            className={({ isActive: active }) =>
              `group flex gap-3 rounded-xl p-3 transition ${active ? 'bg-brand-500/15' : 'hover:bg-white/5'}`
            }
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-brand-400 transition group-hover:bg-brand-500 group-hover:text-white">
              <Icon />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-400">{tagline}</span>
            </span>
          </NavLink>
        ))}
      </div>
    </motion.div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [mobileServices, setMobileServices] = useState(false)
  const scrolled = useScrolled()
  const { pathname } = useLocation()

  // Close menus whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setDropdown(false)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'bg-ink-900/85 py-3 shadow-lg shadow-black/20 backdrop-blur-xl' : 'py-5'
      }`}
    >
      <nav className="container-x flex items-center justify-between gap-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-white">
              Build<span className="text-brand-500">Safe</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Enterprise
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.to)
            return (
              <li
                key={link.to}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setDropdown(true)}
                onMouseLeave={() => link.hasDropdown && setDropdown(false)}
              >
                <Link
                  to={link.to}
                  onFocus={() => link.hasDropdown && setDropdown(true)}
                  className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                  {link.hasDropdown && (
                    <FaChevronDown className={`text-[10px] transition-transform ${dropdown ? 'rotate-180' : ''}`} />
                  )}
                </Link>
                <AnimatePresence>
                  {link.hasDropdown && dropdown && <ServicesDropdown onNavigate={() => setDropdown(false)} />}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>

        <a href={telHref(contact.phones[0])} className="btn-primary hidden py-2.5! lg:inline-flex">
          <FaPhoneAlt className="text-xs" /> Call Now
        </a>

        <button
          type="button"
          className="rounded-lg p-2 text-2xl text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100svh-4.5rem)] overflow-y-auto lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pb-6 pt-4">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <div className="flex items-center">
                    <Link
                      to={link.to}
                      className={`block flex-1 rounded-xl px-4 py-3 font-semibold ${
                        isActive(pathname, link.to) ? 'bg-brand-500 text-white' : 'text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.hasDropdown && (
                      <button
                        type="button"
                        onClick={() => setMobileServices((s) => !s)}
                        aria-label="Toggle services list"
                        aria-expanded={mobileServices}
                        className="ml-2 grid h-11 w-11 place-items-center rounded-xl text-slate-200 hover:bg-white/5"
                      >
                        <FaChevronDown className={`transition-transform ${mobileServices ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {mobileServices && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 overflow-hidden border-l border-white/10 pl-3"
                        >
                          {services.map((s) => (
                            <li key={s.slug}>
                              <NavLink
                                to={`/services/${s.slug}`}
                                className={({ isActive: active }) =>
                                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                                    active ? 'text-brand-400' : 'text-slate-300 hover:text-white'
                                  }`
                                }
                              >
                                <s.icon className="text-brand-500" /> {s.title}
                              </NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </motion.li>
              ))}
              <li className="mt-3">
                <a href={telHref(contact.phones[0])} className="btn-primary w-full">
                  <FaPhoneAlt className="text-xs" /> {contact.phones[0]}
                </a>
              </li>
              <li className="mt-4 flex justify-center">
                <SocialIcons size="sm" />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
