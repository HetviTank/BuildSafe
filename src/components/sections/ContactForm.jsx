import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaPaperPlane, FaWhatsapp, FaCheckCircle, FaEnvelope, FaSpinner } from 'react-icons/fa'
import { company, contact } from '../../data/company'
import { services } from '../../data/services'

const initialForm = { name: '', company: '', phone: '', email: '', service: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name'
  if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) errors.phone = 'Please enter a valid phone number'
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Please enter a valid email'
  if (!form.message.trim()) errors.message = 'Please tell us how we can help'
  return errors
}

function buildMessage(form) {
  const details = [
    `Name: ${form.name}`,
    form.company && `Company: ${form.company}`,
    `Phone: ${form.phone}`,
    form.email && `Email: ${form.email}`,
    form.service && `Service: ${form.service}`,
  ].filter(Boolean)
  return `${details.join('\n')}\n\n${form.message}`
}

function Field({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink-900">{label}</span>
      <input {...props} className={`field ${error ? 'border-red-400!' : ''}`} aria-invalid={!!error} />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

/**
 * Enquiry form. "Send Enquiry" posts to /api/lead, which forwards the lead to the business
 * WhatsApp via CallMeBot (see api/lead.js). "WhatsApp us" opens a pre-filled chat instead.
 * If delivery fails, the visitor is offered WhatsApp / email fallbacks so the lead isn't lost.
 */
export default function ContactForm({ defaultService = '' }) {
  const [form, setForm] = useState({ ...initialForm, service: defaultService })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [failedLead, setFailedLead] = useState(null)
  const openedAt = useRef(0) // when the form appeared — used for the server's "too fast = bot" check
  useEffect(() => {
    openedAt.current = performance.now()
  }, [])

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const openWhatsApp = (data) =>
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(buildMessage(data))}`, '_blank', 'noopener')

  const openEmail = (data) => {
    const subject = `Enquiry from ${data.name}${data.service ? ` — ${data.service}` : ''}`
    window.location.href = `mailto:${contact.emails[0]}?cc=${contact.emails[1]}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage(data))}`
  }

  const isValid = () => {
    const found = validate(form)
    setErrors(found)
    return Object.keys(found).length === 0
  }

  const finish = () => {
    setSent(true)
    setStatus('idle')
    setForm({ ...initialForm, service: defaultService })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || !isValid()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          website: e.currentTarget.elements.website?.value ?? '', // honeypot, empty for real visitors
          page: window.location.pathname + window.location.search,
          elapsed: Math.round(performance.now() - openedAt.current),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) return finish()
      if (res.status === 422 && data.errors) {
        setErrors(data.errors)
        return setStatus('idle')
      }
      throw new Error(data.error || `HTTP ${res.status}`)
    } catch {
      setFailedLead(form)
      setStatus('error')
    }
  }

  const sendViaWhatsApp = () => {
    if (!isValid()) return
    openWhatsApp(form)
    finish()
  }

  return (
    <div className="relative h-full rounded-3xl bg-white p-6 shadow-xl shadow-ink-900/5 ring-1 ring-slate-100 sm:p-10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full min-h-96 flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl text-green-600"
            >
              <FaCheckCircle />
            </motion.span>
            <h3 className="mt-6 text-2xl font-bold">Thank you!</h3>
            <p className="mt-2 max-w-sm text-slate-600">
              We have received your enquiry. The {company.shortName} team will contact you shortly.
            </p>
            <button type="button" onClick={() => setSent(false)} className="btn-outline mt-6">
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-2xl font-bold">Request a consultation</h3>
            <p className="mt-1 text-sm text-slate-500">Fields marked * are required.</p>

            {/* Honeypot: hidden from people, bots tend to fill it in. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full Name *" name="name" value={form.name} onChange={update} error={errors.name} placeholder="Your name" autoComplete="name" />
              <Field label="Company" name="company" value={form.company} onChange={update} placeholder="Company / site name" autoComplete="organization" />
              <Field label="Phone *" name="phone" type="tel" value={form.phone} onChange={update} error={errors.phone} placeholder="+91 98765 43210" autoComplete="tel" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={update} error={errors.email} placeholder="you@company.com" autoComplete="email" />
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-ink-900">Service Required</span>
                <select name="service" value={form.service} onChange={update} className="field">
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-ink-900">Message *</span>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={update}
                  placeholder="Tell us about your site and requirement…"
                  className={`field resize-none ${errors.message ? 'border-red-400!' : ''}`}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <span className="mt-1 block text-xs text-red-500">{errors.message}</span>}
              </label>
            </div>

            {status === 'error' && failedLead && (
              <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Sorry, we couldn&apos;t send your enquiry automatically.</p>
                <p className="mt-1">Please send it with one tap instead — your details are already filled in:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => { openWhatsApp(failedLead); finish() }} className="btn bg-[#25D366] px-4 py-2 text-white hover:bg-[#1ebe5a]">
                    <FaWhatsapp /> Send on WhatsApp
                  </button>
                  <button type="button" onClick={() => { openEmail(failedLead); finish() }} className="btn-outline px-4 py-2">
                    <FaEnvelope /> Send by Email
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={status === 'sending'} className="btn-primary flex-1 disabled:cursor-wait disabled:opacity-70">
                {status === 'sending' ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
              </button>
              <button type="button" onClick={sendViaWhatsApp} className="btn flex-1 bg-[#25D366] text-white hover:-translate-y-0.5 hover:bg-[#1ebe5a]">
                <FaWhatsapp className="text-lg" /> WhatsApp us
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
