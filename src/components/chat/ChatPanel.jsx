import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPaperPlane, FaPhoneAlt, FaRedo, FaTimes, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaCheck } from 'react-icons/fa'
import logo from '../../assets/images/brand/logo.webp'
import { company, contact } from '../../data/company'
import { QUICK_START, leadPrompt, leadStep, leadSummary, reply } from '../../lib/assistant'
import { deliverLead } from '../../lib/deliverLead'
import { formatPhone } from '../../lib/lead'

const STORAGE_KEY = 'buildsafe-chat-v1'
const WELCOME = {
  from: 'bot',
  text: `Hi! 👋 I'm the ${company.shortName} assistant. Ask me anything about Fire NOC, fire safety, audits, inspections, training, ISO or civil engineering — or get a free quote.`,
  quick: QUICK_START,
}
const ACTION_ICONS = { call: FaPhoneAlt, whatsapp: FaWhatsapp, email: FaEnvelope, link: FaMapMarkerAlt }
const INPUT_HINTS = {
  name: { placeholder: 'Type your name…', inputMode: 'text', autoComplete: 'name' },
  phone: { placeholder: '10-digit mobile number', inputMode: 'numeric', autoComplete: 'tel-national' },
  email: { placeholder: 'you@company.com', inputMode: 'email', autoComplete: 'email' },
  message: { placeholder: 'Your requirement…', inputMode: 'text', autoComplete: 'off' },
}

let nextId = 1
const withId = (m) => ({ id: `${Date.now()}-${nextId++}`, ...m })

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    if (saved?.messages?.length) return saved
  } catch {
    // storage unavailable (private mode, blocked) — start fresh
  }
  return null
}

/** One bot message: text, optional bullet list, page links and action buttons. */
function BotMessage({ m, onAction, onNavigate }) {
  return (
    <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm text-ink-800 shadow-sm ring-1 ring-slate-100">
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
              className="group flex items-center justify-between gap-2 rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              {l.label}
              <FaArrowRight className="shrink-0 text-[10px] transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
      {m.actions && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {m.actions.map((a) => {
            if (a.type === 'lead' || a.type === 'send' || a.type === 'cancel') {
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => onAction(a)}
                  disabled={m.used}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-default disabled:opacity-50 ${
                    a.type === 'cancel' ? 'bg-slate-100 text-ink-800 hover:bg-slate-200' : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}
                >
                  {a.type === 'send' && <FaCheck className="text-[10px]" />}
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
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
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

/**
 * The chat window. Answers come from the rule-based assistant in src/lib/assistant.js; quote/callback
 * requests collect name → mobile → email → requirement, then deliverLead() sends them to WhatsApp + email.
 */
export default function ChatPanel({ onClose }) {
  const [saved] = useState(loadSession)
  const [messages, setMessages] = useState(() => saved?.messages ?? [withId(WELCOME)])
  const [mode, setMode] = useState(() => (saved?.mode?.type === 'sending' ? { type: 'chat' } : saved?.mode ?? { type: 'chat' }))
  const [context, setContext] = useState(() => saved?.context ?? { service: '', questions: [] })
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const openedAt = useRef(0)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    openedAt.current = performance.now()
    inputRef.current?.focus()
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.slice(-60), mode, context }))
    } catch {
      // storage unavailable — conversation simply won't survive a reload
    }
  }, [messages, mode, context])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  /** Adds bot message(s) after a short "typing…" pause so replies feel natural. */
  const botSay = useCallback((...msgs) => {
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, ...msgs.map((m) => withId({ from: 'bot', ...m }))])
    }, 450 + Math.min(600, (msgs[0]?.text?.length ?? 0) * 4))
    timers.current.push(t)
  }, [])

  const markUsed = () => setMessages((prev) => prev.map((m) => (m.actions ? { ...m, used: true } : m)))

  const startLead = useCallback(
    (service = context.service) => {
      const lead = { service }
      setMode({ type: 'lead', step: 'name', lead })
      botSay({ text: `${leadPrompt('name', lead)}\n(You can type "cancel" at any time.)` })
    },
    [botSay, context.service],
  )

  const send = async (lead) => {
    setMode({ type: 'sending' })
    setTyping(true)
    const recent = context.questions.slice(-5)
    let message = lead.message
    if (recent.length) message += `\n\nAsked in chat:\n${recent.map((q) => `- ${q}`).join('\n')}`
    const result = await deliverLead(
      { name: lead.name, phone: lead.phone, email: lead.email, company: '', service: lead.service ?? '', message: message.slice(0, 1500) },
      { source: 'Website chat', startedAt: openedAt.current },
    )
    setTyping(false)
    setMode({ type: 'chat' })
    const first = lead.name.split(' ')[0]
    if (result.ok) {
      setMessages((prev) => [
        ...prev,
        withId({
          from: 'bot',
          text: `✅ Thank you, ${first}! Your details have been sent to the ${company.shortName} team. We'll contact you on ${formatPhone(lead.phone)} shortly.`,
          quick: ['Our services', 'No, that’s all'],
        }),
      ])
    } else {
      const text = encodeURIComponent(`Hi BuildSafe, I need help.\n${leadSummary(lead).join('\n')}`)
      setMessages((prev) => [
        ...prev,
        withId({
          from: 'bot',
          text: `Sorry ${first}, I couldn't send your details automatically. Please send them with one tap, or call us:`,
          actions: [
            { type: 'whatsapp', label: 'Send on WhatsApp', href: `https://wa.me/${contact.whatsapp}?text=${text}` },
            { type: 'call', label: `Call ${contact.phones[0]}`, href: `tel:${contact.phones[0].replace(/\s/g, '')}` },
          ],
        }),
      ])
    }
  }

  const cancelLead = () => {
    setMode({ type: 'chat' })
    botSay({ text: `No problem — I've cancelled that. What else can I help with?`, quick: QUICK_START })
  }

  const handleUser = (raw) => {
    const text = raw.trim().slice(0, 500)
    if (!text || typing || mode.type === 'sending') return
    setMessages((prev) => [...prev, withId({ from: 'user', text: mode.type === 'lead' && mode.step === 'phone' ? `+91 ${text.replace(/^\+?91\s*/, '')}` : text })])
    setInput('')

    if (mode.type === 'lead') {
      const r = leadStep(mode.step, mode.lead, text)
      if (r.cancelled) return cancelLead()
      if (r.error) return botSay({ text: r.error })
      if (r.done) {
        setMode({ type: 'confirm', lead: r.lead })
        return botSay({
          text: 'Please check your details:',
          bullets: leadSummary(r.lead),
          actions: [{ type: 'send', label: 'Send to BuildSafe' }, { type: 'cancel', label: 'Cancel' }],
        })
      }
      setMode({ type: 'lead', step: r.step, lead: r.lead })
      return botSay({ text: leadPrompt(r.step, r.lead) })
    }

    if (mode.type === 'confirm') {
      if (/^(y|yes|ok|okay|send|confirm|sure|haan|ha)\b/i.test(text)) {
        markUsed()
        return send(mode.lead)
      }
      if (/^(n|no|cancel|stop)\b/i.test(text)) {
        markUsed()
        return cancelLead()
      }
      return botSay({ text: `Shall I send these details to our team? Reply "yes" to send or "cancel".`, actions: [{ type: 'send', label: 'Send to BuildSafe' }, { type: 'cancel', label: 'Cancel' }] })
    }

    const r = reply(text)
    // Remember the topic of the latest question only; a quote request keeps it, anything else unrelated clears it.
    const service = r.service ?? (r.lead ? context.service : '')
    setContext((c) => ({ service, questions: r.id === 'greeting' || r.id === 'thanks' ? c.questions : [...c.questions, text].slice(-10) }))
    if (!r.lead) return botSay(r.answer)
    // Quote / callback intent: answer, then go straight into collecting details (one botSay keeps the order).
    const lead = { service }
    setMode({ type: 'lead', step: 'name', lead })
    botSay({ ...r.answer, actions: r.answer.actions?.filter((a) => a.type !== 'lead') }, { text: `${leadPrompt('name', lead)}\n(You can type "cancel" at any time.)` })
  }

  const onAction = (a) => {
    if (a.type === 'lead') {
      if (mode.type !== 'chat') return
      setMessages((prev) => [...prev, withId({ from: 'user', text: a.label })])
      return startLead()
    }
    if (mode.type !== 'confirm') return
    markUsed()
    if (a.type === 'send') {
      setMessages((prev) => [...prev, withId({ from: 'user', text: 'Send to BuildSafe' })])
      send(mode.lead)
    } else {
      setMessages((prev) => [...prev, withId({ from: 'user', text: 'Cancel' })])
      cancelLead()
    }
  }

  const restart = () => {
    timers.current.forEach(clearTimeout)
    setTyping(false)
    setMode({ type: 'chat' })
    setContext({ service: '', questions: [] })
    setMessages([withId(WELCOME)])
    inputRef.current?.focus()
  }

  const last = messages[messages.length - 1]
  const quick = !typing && mode.type === 'chat' && last?.from === 'bot' ? last.quick : mode.type === 'lead' && !typing ? ['Cancel'] : null
  const hints = mode.type === 'lead' ? INPUT_HINTS[mode.step] : { placeholder: 'Type your question…', inputMode: 'text', autoComplete: 'off' }

  return (
    <motion.div
      role="dialog"
      aria-label={`${company.shortName} assistant`}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      className="fixed inset-x-3 bottom-24 z-50 flex h-[min(620px,calc(100svh-7.5rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl shadow-ink-900/30 ring-1 ring-ink-900/10 sm:inset-x-auto sm:right-5 sm:w-[390px]"
    >
      {/* Header */}
      <div className="relative flex items-center gap-3 bg-ink-900 px-4 py-3.5 text-white">
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
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat with the team on WhatsApp" className="grid h-8 w-8 place-items-center rounded-full text-[#25D366] transition hover:bg-white/10">
            <FaWhatsapp className="text-lg" />
          </a>
          <a href={`tel:${contact.phones[0].replace(/\s/g, '')}`} aria-label={`Call ${contact.phones[0]}`} className="grid h-8 w-8 place-items-center rounded-full text-brand-400 transition hover:bg-white/10">
            <FaPhoneAlt className="text-sm" />
          </a>
          <button type="button" onClick={restart} aria-label="Start a new conversation" className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-white/10">
            <FaRedo className="text-xs" />
          </button>
          <button type="button" onClick={onClose} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-white/10">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
        {messages.map((m) =>
          m.from === 'bot' ? (
            <div key={m.id} className="flex">
              <BotMessage m={m} onAction={onAction} onNavigate={() => window.innerWidth < 640 && onClose()} />
            </div>
          ) : (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tr-md bg-brand-500 px-4 py-2.5 text-sm text-white shadow-sm">{m.text}</p>
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

      {/* Quick replies */}
      {quick?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => (q === 'Cancel' && mode.type === 'lead' ? (setMessages((p) => [...p, withId({ from: 'user', text: 'Cancel' })]), cancelLead()) : q === 'Get a free quote' ? onAction({ type: 'lead', label: q }) : handleUser(q))}
              className="shrink-0 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleUser(input)
        }}
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
      >
        {mode.type === 'lead' && mode.step === 'phone' && <span className="pl-1 text-sm font-semibold text-ink-900">+91</span>}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(mode.type === 'lead' && mode.step === 'phone' ? e.target.value.replace(/[^\d+\s-]/g, '') : e.target.value)}
          maxLength={mode.type === 'lead' && mode.step === 'phone' ? 16 : 500}
          type={mode.type === 'lead' && mode.step === 'email' ? 'email' : 'text'}
          {...hints}
          disabled={mode.type === 'sending'}
          aria-label="Message"
          className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
        <button type="submit" disabled={!input.trim() || typing || mode.type === 'sending'} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600 disabled:opacity-40">
          <FaPaperPlane className="text-sm" />
        </button>
      </form>
    </motion.div>
  )
}
