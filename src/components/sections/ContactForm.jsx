import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaPaperPlane, FaWhatsapp, FaCheckCircle } from 'react-icons/fa'
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
 * Static-site enquiry form: validates, then opens the visitor's email app or WhatsApp
 * with the message pre-filled. Swap `send` for an API call to receive submissions directly.
 */
export default function ContactForm({ defaultService = '' }) {
  const [form, setForm] = useState({ ...initialForm, service: defaultService })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const send = (channel) => {
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    const body = buildMessage(form)
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(body)}`, '_blank', 'noopener')
    } else {
      const subject = `Enquiry from ${form.name}${form.service ? ` — ${form.service}` : ''}`
      window.location.href = `mailto:${contact.emails[0]}?cc=${contact.emails[1]}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
    setSent(true)
    setForm(initialForm)
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
              Your message is ready to send in your email or WhatsApp app. The {company.shortName} team will get back to you shortly.
            </p>
            <button type="button" onClick={() => setSent(false)} className="btn-outline mt-6">
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={(e) => {
              e.preventDefault()
              send('email')
            }}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-2xl font-bold">Request a consultation</h3>
            <p className="mt-1 text-sm text-slate-500">Fields marked * are required.</p>

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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="btn-primary flex-1">
                <FaPaperPlane /> Send via Email
              </button>
              <button type="button" onClick={() => send('whatsapp')} className="btn flex-1 bg-[#25D366] text-white hover:-translate-y-0.5 hover:bg-[#1ebe5a]">
                <FaWhatsapp className="text-lg" /> Send via WhatsApp
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
