import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCheckCircle, FaWhatsapp } from 'react-icons/fa'
import { company, contact } from '../../data/company'
import { services } from '../../data/services'
import { PHONE_PREFIX, fieldError, normalizePhone, validateLead } from '../../lib/lead'
import { emailLeadViaFormSubmit } from '../../lib/formsubmit'

const initialForm = { name: '', company: '', phone: '', email: '', service: '', message: '' }

function Field({ label, error, prefix, ...props }) {
  const id = `lead-${props.name}`
  const input = (
    <input
      {...props}
      id={id}
      className={`field ${prefix ? 'rounded-l-none!' : ''} ${error ? 'border-red-400!' : ''}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  )
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink-900">{label}</label>
      {prefix ? (
        <div className="flex">
          <span className="inline-flex shrink-0 select-none items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-ink-900">
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
      {error && <span id={`${id}-error`} className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  )
}

export default function ContactForm({ defaultService = '' }) {
  const [form, setForm] = useState({ ...initialForm, service: defaultService })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({}) // fields the visitor has left at least once
  const [sent, setSent] = useState(false)
  const [lastForm, setLastForm] = useState(null)

  // Live validation: once a field has been visited (or already shows an error), re-check it on every keystroke.
  const update = (e) => {
    const { name } = e.target
    const value = name === 'phone' ? normalizePhone(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [name]: value }))
    if (touched[name] || errors[name]) setErrors((err) => ({ ...err, [name]: fieldError(name, value) }))
  }

  const blur = (e) => {
    const { name, value } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    if (value) setErrors((err) => ({ ...err, [name]: fieldError(name, value) })) // don't nag about fields skipped by tabbing
  }

  const isValid = () => {
    const found = validateLead(form)
    setErrors(found)
    setTouched({ name: true, phone: true, email: true, message: true })
    const first = Object.keys(found)[0]
    if (first) document.getElementById(`lead-${first}`)?.focus()
    return !first
  }

  const finish = (submittedForm) => {
    setLastForm(submittedForm)
    setSent(true)
    setForm({ ...initialForm, service: defaultService })
    setTouched({})
    setErrors({})
  }

  const waUrl = (f) => {
    if (!f) return `https://wa.me/${contact.whatsapp}`
    const lines = [
      `Name: ${f.name}`,
      f.company && `Company: ${f.company}`,
      `Phone: +91${f.phone}`,
      f.email && `Email: ${f.email}`,
      f.service && `Service: ${f.service}`,
      '',
      f.message,
    ].filter(Boolean)
    return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
  }

  const submit = (e) => {
    e.preventDefault()
    if (!isValid()) return
    const url = waUrl(form)
    finish(form)
    window.open(url, '_blank', 'noopener')
    emailLeadViaFormSubmit({ ...form, source: 'Contact form' }) // fire-and-forget
  }


  return (
    <div className="relative h-full rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-100 sm:p-10">
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
            <a
              href={waUrl(lastForm)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 flex items-center justify-center gap-2 w-full bg-[#25D366]! hover:bg-[#1ebe5d]!"
            >
              <FaWhatsapp className="text-lg" />
              Also send via WhatsApp
            </a>
            <button type="button" onClick={() => setSent(false)} className="btn-outline mt-4">
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
              <Field label="Full Name *" name="name" value={form.name} onChange={update} onBlur={blur} error={errors.name} placeholder="Your name" autoComplete="name" maxLength={80} />
              <Field label="Company" name="company" value={form.company} onChange={update} placeholder="Company / site name" autoComplete="organization" maxLength={120} />
              <Field
                label="Mobile Number *"
                name="phone"
                type="tel"
                prefix={PHONE_PREFIX}
                inputMode="numeric"
                maxLength={16} /* room for a pasted "+91 98765 43210"; normalizePhone keeps 10 digits */
                value={form.phone}
                onChange={update}
                onBlur={blur}
                error={errors.phone}
                placeholder="98765 43210"
                autoComplete="tel-national"
              />
              <Field label="Email *" name="email" type="email" inputMode="email" value={form.email} onChange={update} onBlur={blur} error={errors.email} placeholder="you@company.com" autoComplete="email" maxLength={120} />
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
                  id="lead-message"
                  name="message"
                  rows={5}
                  maxLength={1500}
                  value={form.message}
                  onChange={update}
                  onBlur={blur}
                  placeholder="Tell us about your site and requirement…"
                  className={`field resize-none ${errors.message ? 'border-red-400!' : ''}`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'lead-message-error' : undefined}
                />
                {errors.message && <span id="lead-message-error" className="mt-1 block text-xs text-red-500">{errors.message}</span>}
              </label>
            </div>

            <button type="submit" className="btn-primary mt-6 w-full">
              <FaWhatsapp className="text-lg" />
              Send Enquiry via WhatsApp
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
