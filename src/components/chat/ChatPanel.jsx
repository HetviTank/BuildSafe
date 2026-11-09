import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaPaperPlane, FaPhoneAlt, FaRedo, FaTimes, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import logo from '../../assets/images/brand/logo.webp'
import { company, contact } from '../../data/company'
import { services } from '../../data/services'
import { QUICK_START, leadSummary, reply } from '../../lib/assistant'
import { deliverLead } from '../../lib/deliverLead'
import { PHONE_PREFIX, fieldError, formatPhone, normalizePhone, validateLead } from '../../lib/lead'

const STORAGE_KEY = 'buildsafe-chat-v2'
const WELCOME = {
  from: 'bot',
  text: `Hi! 👋 I'm the ${company.shortName} assistant. Ask about Fire NOC, fire safety, audits, inspections, training, ISO or civil engineering — or tap "Get a free quote".`,
  quick: QUICK_START,
}
const ACTION_ICONS = { call: FaPhoneAlt, whatsapp: FaWhatsapp, email: FaEnvelope, link: FaMapMarkerAlt }
const EMPTY_LEAD = { name: '', phone: '', email: '', service: '', message: '' }

let nextId = 1
const withId = (m) => ({ id: `${Date.now()}-${nextId++}`, ...m })
const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const isPhone = () => typeof window !== 'undefined' && window.innerWidth < 640

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    if (saved?.messages?.length) return saved
  } catch {
    // storage unavailable (private mode, blocked) — start fresh
  }
  return null
}

/**
 * On phones the chat is full-screen and sized to the *visible* viewport, so the on-screen keyboard
 * never covers the input (iOS keeps fixed elements under the keyboard otherwise).
 */
function useViewportBox() {
  const [box, setBox] = useState(null)
  useEffect(() => {
    const vv = window.visualViewport
    const update = () => setBox(isPhone() ? { top: vv ? vv.offsetTop : 0, height: vv ? vv.height : window.innerHeight } : null)
    update()
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return box
}

/** One bot message: text, optional bullet list, page links and action buttons. */
function BotMessage({ m, onQuote, onNavigate }) {
  return (
    <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[15px] text-ink-800 shadow-sm ring-1 ring-slate-100 sm:text-sm">
      <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
      {m.bullets && (
        <ul className="mt-2 space-y-1">
          {m.bullets.map((b) => (
            <li key={b} className="flex gap-2 leading-snug">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {m.links && (
        <div className="mt-3 flex flex-col gap-1.5">
          {m.links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onNavigate}
              className="group flex items-center justify-between gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              {l.label}
              <FaArrowRight className="shrink-0 text-[10px] transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
      {m.actions && (
        <div className="mt-3 flex flex-wrap gap-2">
          {m.actions.map((a) => {
            if (a.type === 'lead') {
              return (
                <button key={a.label} type="button" onClick={onQuote} className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-brand-600">
                  {a.label}
                </button>
              )
            }
            const Icon = ACTION_ICONS[a.type] ?? FaArrowRight
            const external = a.href.startsWith('http')
            return (
              <a
                key={a.label}
                href={a.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                  a.type === 'whatsapp' ? 'bg-[#25D366] text-white hover:bg-[#1ebe5a]' : 'bg-ink-900 text-white hover:bg-ink-800'
                }`}
              >
                <Icon className="text-[11px]" /> {a.label}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

// 16px text on phones (text-base) stops iOS from zooming in when a field is tapped.
const fieldClass = (error) =>
  `w-full rounded-xl border bg-white px-3.5 py-3 text-base text-ink-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 sm:text-sm ${
    error ? 'border-red-400' : 'border-slate-200'
  }`

/** Simple one-screen quote form shown inside the chat — easy to fill on a phone. */
function QuoteForm({ initial, onBack, onSent }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const startedAt = useRef(0)
  useEffect(() => {
    startedAt.current = performance.now()
  }, [])

  const update = (e) => {
    const { name } = e.target
    const value = name === 'phone' ? normalizePhone(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [name]: value }))
    if (touched[name] || errors[name]) setErrors((err) => ({ ...err, [name]: fieldError(name, value) }))
  }
  const blur = (e) => {
    const { name, value } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    if (value) setErrors((err) => ({ ...err, [name]: fieldError(name, value) }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (sending) return
    const found = validateLead(form)
    setErrors(found)
    setTouched({ name: true, phone: true, email: true, message: true })
    const first = Object.keys(found)[0]
    if (first) return document.getElementById(`chat-${first}`)?.focus()
    setSending(true)
    setFailed(false)
    const result = await deliverLead({ ...form, company: '' }, { source: 'Website chat', startedAt: startedAt.current })
    setSending(false)
    if (result.ok) return onSent(form)
    if (result.errors) return setErrors(result.errors)
    setFailed(true)
  }

  const err = (name) => errors[name] && <span className="mt-1 block text-xs text-red-500">{errors[name]}</span>
  const waText = encodeURIComponent(`Hi BuildSafe, I need help.\n${leadSummary(form).join('\n')}`)

  return (
    <motion.form
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      onSubmit={submit}
      noValidate
      className="absolute inset-0 z-10 flex flex-col bg-slate-50"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5">
        <button type="button" onClick={onBack} aria-label="Back to chat" className="grid h-10 w-10 place-items-center rounded-full text-ink-900 hover:bg-slate-100">
          <FaArrowLeft />
        </button>
        <div>
          <p className="font-display text-sm font-bold text-ink-900">Get a free quote</p>
          <p className="text-xs text-slate-500">Goes straight to our team on WhatsApp &amp; email</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-900">Name *</span>
          <input id="chat-name" name="name" value={form.name} onChange={update} onBlur={blur} autoComplete="name" enterKeyHint="next" maxLength={80} placeholder="Your name" className={fieldClass(errors.name)} />
          {err('name')}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-900">Mobile number *</span>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-base font-semibold text-ink-900 sm:text-sm">{PHONE_PREFIX}</span>
            <input
              id="chat-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              enterKeyHint="next"
              maxLength={16} /* room for a pasted "+91 98765 43210"; normalizePhone keeps 10 digits */
              value={form.phone}
              onChange={update}
              onBlur={blur}
              placeholder="98765 43210"
              className={`${fieldClass(errors.phone)} rounded-l-none`}
            />
          </div>
          {err('phone')}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-900">Email *</span>
          <input id="chat-email" name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" maxLength={120} value={form.email} onChange={update} onBlur={blur} placeholder="you@company.com" className={fieldClass(errors.email)} />
          {err('email')}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-900">Service</span>
          <select name="service" value={form.service} onChange={update} className={fieldClass(false)}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>{s.title}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-900">Your requirement *</span>
          <textarea id="chat-message" name="message" rows={3} maxLength={1500} value={form.message} onChange={update} onBlur={blur} placeholder="e.g. Fire NOC for our warehouse in Anjar" className={`${fieldClass(errors.message)} resize-none`} />
          {err('message')}
        </label>

        {failed && (
          <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Couldn&apos;t send automatically right now.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={`https://wa.me/${contact.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-semibold text-white">
                <FaWhatsapp /> Send on WhatsApp
              </a>
              <a href={`tel:${contact.phones[0].replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white">
                <FaPhoneAlt className="text-[10px]" /> Call {contact.phones[0]}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-3">
        <button type="submit" disabled={sending} className="btn-primary w-full py-3.5 disabled:cursor-wait disabled:opacity-70">
          {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          {sending ? 'Sending…' : 'Send to BuildSafe'}
        </button>
      </div>
    </motion.form>
  )
}

/**
 * The chat window. Answers come from the rule-based assistant in src/lib/assistant.js.
 * Quote / callback requests open a one-screen form (QuoteForm) that delivers the lead to WhatsApp + email.
 * Rendered in a portal above everything (incl. the fixed navbar); full-screen on phones.
 */
export default function ChatPanel({ onClose }) {
  const [saved] = useState(loadSession)
  const [messages, setMessages] = useState(() => saved?.messages ?? [withId(WELCOME)])
  const [context, setContext] = useState(() => saved?.context ?? { service: '', questions: [] })
  const [quote, setQuote] = useState(null) // initial values while the quote form is open
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timers = useRef([])
  const box = useViewportBox()

  useEffect(() => {
    if (!isTouch()) inputRef.current?.focus() // don't pop the keyboard open on phones
    const pending = timers.current
    // Lock the page behind the full-screen chat on phones.
    const prevOverflow = document.body.style.overflow
    if (isPhone()) document.body.style.overflow = 'hidden'
    return () => {
      pending.forEach(clearTimeout)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.slice(-60), context }))
    } catch {
      // storage unavailable — conversation simply won't survive a reload
    }
  }, [messages, context])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, box?.height])

  /** Adds bot message(s) after a short "typing…" pause so replies feel natural. */
  const botSay = useCallback((...msgs) => {
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, ...msgs.map((m) => withId({ from: 'bot', ...m }))])
    }, 400 + Math.min(500, (msgs[0]?.text?.length ?? 0) * 3))
    timers.current.push(t)
  }, [])

  const openQuote = useCallback(
    (service = context.service) => {
      inputRef.current?.blur()
      const lastQuestion = context.questions.at(-1)
      setQuote({ ...EMPTY_LEAD, service, message: lastQuestion && !/quote|price|cost|call|visit/i.test(lastQuestion) ? lastQuestion : '' })
    },
    [context],
  )

  const handleUser = (raw) => {
    const text = raw.trim().slice(0, 500)
    if (!text || typing) return
    setMessages((prev) => [...prev, withId({ from: 'user', text })])
    setInput('')
    const r = reply(text)
    // Remember the topic of the latest question only; a quote request keeps it, anything else unrelated clears it.
    const service = r.service ?? (r.lead ? context.service : '')
    setContext((c) => ({ service, questions: r.id === 'greeting' || r.id === 'thanks' ? c.questions : [...c.questions, text].slice(-10) }))
    if (r.lead) {
      botSay({ text: `${r.answer.text}\n\nI've opened a short form — it goes straight to our team.` })
      const t = setTimeout(() => openQuote(service), 900)
      timers.current.push(t)
      return
    }
    botSay(r.answer)
  }

  const onQuoteSent = (lead) => {
    setQuote(null)
    setMessages((prev) => [
      ...prev,
      withId({
        from: 'bot',
        text: `✅ Thank you, ${lead.name.split(' ')[0]}! Your details have been sent to the ${company.shortName} team. We'll contact you on ${formatPhone(lead.phone)} shortly.`,
        quick: ['Our services', 'No, that’s all'],
      }),
    ])
  }

  const restart = () => {
    timers.current.forEach(clearTimeout)
    setTyping(false)
    setQuote(null)
    setContext({ service: '', questions: [] })
    setMessages([withId(WELCOME)])
  }

  const last = messages[messages.length - 1]
  const quick = !typing && last?.from === 'bot' ? last.quick?.filter((q) => q !== 'Get a free quote') : null
  const onQuick = (q) => handleUser(q)

  return createPortal(
    <motion.div
      role="dialog"
      aria-label={`${company.shortName} assistant`}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={(e) => e.key === 'Escape' && (quote ? setQuote(null) : onClose())}
      style={box ? { top: box.top, height: box.height } : undefined}
      className="fixed inset-x-0 top-0 z-[60] flex h-[100dvh] flex-col overflow-hidden bg-slate-50 sm:inset-x-auto sm:top-auto sm:bottom-24 sm:right-5 sm:h-[min(620px,calc(100svh-7.5rem))] sm:w-[390px] sm:origin-bottom-right sm:rounded-3xl sm:shadow-2xl sm:shadow-ink-900/30 sm:ring-1 sm:ring-ink-900/10"
    >
      {/* Header */}
      <div className="relative flex shrink-0 items-center gap-3 bg-ink-900 px-4 py-3 text-white">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-brand-500/30 blur-2xl" />
        <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1">
          <img src={logo} alt="" className="h-full w-full object-contain" />
          <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-ink-900" />
        </span>
        <div className="relative min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold">{company.shortName} Assistant</p>
          <p className="text-xs text-slate-400">Online · replies instantly</p>
        </div>
        <div className="relative -mr-1 flex items-center">
          <a href={`tel:${contact.phones[0].replace(/\s/g, '')}`} aria-label={`Call ${contact.phones[0]}`} className="grid h-10 w-10 place-items-center rounded-full text-brand-400 transition hover:bg-white/10">
            <FaPhoneAlt className="text-sm" />
          </a>
          <button type="button" onClick={restart} aria-label="Start a new conversation" className="grid h-10 w-10 place-items-center rounded-full text-slate-300 transition hover:bg-white/10">
            <FaRedo className="text-xs" />
          </button>
          <button type="button" onClick={onClose} aria-label="Close chat" className="grid h-10 w-10 place-items-center rounded-full text-slate-200 transition hover:bg-white/10">
            <FaTimes className="text-lg" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Messages */}
        <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
          {messages.map((m) =>
            m.from === 'bot' ? (
              <div key={m.id} className="flex">
                <BotMessage m={m} onQuote={() => openQuote()} onNavigate={() => isPhone() && onClose()} />
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tr-md bg-brand-500 px-4 py-2.5 text-[15px] text-white shadow-sm sm:text-sm">{m.text}</p>
              </div>
            ),
          )}
          {typing && (
            <div className="flex" aria-label="Assistant is typing">
              <div className="flex gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-100">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="h-2 w-2 rounded-full bg-slate-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick replies + always-visible quote / WhatsApp buttons (no typing needed) */}
        <div className="shrink-0 space-y-2 px-4 pb-2">
          {quick?.length > 0 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
              {quick.map((q) => (
                <button key={q} type="button" onClick={() => onQuick(q)} className="shrink-0 rounded-full border border-brand-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={() => openQuote()} className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 sm:py-2.5">
              Get a free quote
            </button>
            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe5a] sm:py-2.5">
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleUser(input)
          }}
          className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            enterKeyHint="send"
            autoComplete="off"
            placeholder="Type your question…"
            aria-label="Message"
            className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-3 text-base text-ink-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 sm:py-2.5 sm:text-sm"
          />
          <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600 disabled:opacity-40">
            <FaPaperPlane className="text-sm" />
          </button>
        </form>

        <AnimatePresence>{quote && <QuoteForm initial={quote} onBack={() => setQuote(null)} onSent={onQuoteSent} />}</AnimatePresence>
      </div>
    </motion.div>,
    document.body,
  )
}
