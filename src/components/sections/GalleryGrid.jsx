import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa'
import { ServiceArt } from '../illustrations'
import { gallery, galleryCategories } from '../../data/gallery'

function Media({ item, className }) {
  return item.type === 'photo' ? (
    <img src={item.src} alt={item.title} loading="lazy" className={`object-cover ${item.position ?? ""} ${className}`} />
  ) : (
    <ServiceArt name={item.art} className={className} />
  )
}

function Lightbox({ items, index, onClose, onStep }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  const item = items[index]
  const stop = (fn) => (e) => {
    e.stopPropagation()
    fn()
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink-950/95 p-4 backdrop-blur"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
        >
          <Media item={item} className="max-h-[78vh] w-full" />
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 text-center text-sm text-slate-300">
        <span className="font-semibold text-white">{item.title}</span> · {index + 1} / {items.length}
      </p>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-brand-500">
        <FaTimes />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" onClick={stop(() => onStep(-1))} aria-label="Previous" className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-brand-500 sm:left-6">
            <FaChevronLeft />
          </button>
          <button type="button" onClick={stop(() => onStep(1))} aria-label="Next" className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-brand-500 sm:right-6">
            <FaChevronRight />
          </button>
        </>
      )}
    </motion.div>
  )
}

/** Filterable masonry-style gallery with a lightbox. */
export default function GalleryGrid({ limit, filters = true }) {
  const [category, setCategory] = useState('all')
  const [index, setIndex] = useState(null)

  const filtered = category === 'all' ? gallery : gallery.filter((g) => g.category === category)
  const items = limit ? filtered.slice(0, limit) : filtered

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback((dir) => setIndex((i) => (i + dir + items.length) % items.length), [items.length])

  return (
    <>
      {filters && (
        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
          {galleryCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category === c.id ? 'text-white' : 'bg-white text-ink-900 shadow-sm hover:text-brand-600'
              }`}
            >
              {category === c.id && (
                <motion.span layoutId="gallery-filter" className="absolute inset-0 rounded-full bg-brand-500" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>
      )}

      <motion.div layout className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${filters ? 'mt-10' : ''}`}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.button
              layout
              key={item.title}
              type="button"
              onClick={() => setIndex(i)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-900 text-left shadow-sm"
              aria-label={`Open: ${item.title}`}
            >
              <Media item={item} className="h-full w-full transition duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent p-5 opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="translate-y-3 text-base font-semibold text-white transition duration-500 group-hover:translate-y-0">{item.title}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                  <FaExpand />
                </span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {index !== null && <Lightbox items={items} index={index} onClose={close} onStep={step} />}
      </AnimatePresence>
    </>
  )
}
