// Enquiry-form rules shared by the browser (ContactForm) and the server (api/lead.js),
// so both always agree on what a valid lead is. Keep this file free of React/browser code.

export const PHONE_PREFIX = '+91'

export const LIMITS = { name: 80, company: 120, phone: 10, email: 120, service: 80, message: 1500 }

/** Indian mobile number: exactly 10 digits, starting with 6, 7, 8 or 9 (entered without +91). */
export const isValidPhone = (digits) => /^[6-9]\d{9}$/.test(digits)

/** name@domain.tld — no spaces, one @, a dot in the domain and a 2+ letter ending. */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(email)

/** Keep only digits, at most 10 — used as the visitor types or pastes (e.g. "+91 98765-43210"). */
export function normalizePhone(value) {
  let digits = String(value ?? '').replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2) // pasted with country code
  if (digits.length > 10 && digits.startsWith('0')) digits = digits.replace(/^0+/, '') // pasted with leading 0
  return digits.slice(0, 10)
}

/** "9876543210" → "+91 98765 43210" */
export const formatPhone = (digits) => `${PHONE_PREFIX} ${digits.slice(0, 5)} ${digits.slice(5)}`.trim()

/** Error message for one field, or '' when it is valid. */
export function fieldError(name, value = '') {
  const v = String(value).trim()
  switch (name) {
    case 'name':
      return v ? '' : 'Please enter your name'
    case 'phone':
      if (!v) return 'Please enter your mobile number'
      return isValidPhone(v) ? '' : 'Enter a valid 10-digit mobile number (starts with 6–9)'
    case 'email':
      if (!v) return 'Please enter your email address'
      return isValidEmail(v) ? '' : 'Enter a valid email address, e.g. name@company.com'
    case 'message':
      return v ? '' : 'Please tell us how we can help'
    default:
      return ''
  }
}

/** All errors for a form object: { field: message } — empty object when valid. */
export function validateLead(form) {
  const errors = {}
  for (const name of ['name', 'phone', 'email', 'message']) {
    const err = fieldError(name, form[name])
    if (err) errors[name] = err
  }
  return errors
}
