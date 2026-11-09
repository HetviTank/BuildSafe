// Browser-side email delivery through FormSubmit (https://formsubmit.co) — free, no API key.
// Used by the enquiry form whenever the server did not email the lead itself (no Gmail app password set),
// so every enquiry still reaches the BuildSafe inboxes automatically.
//
// ONE-TIME ACTIVATION: the very first submission makes FormSubmit email buildsafeenterprise@gmail.com an
// "Activate Form" link. Click it once; from then on every enquiry is delivered. (Until then this returns
// { ok: false, needsActivation: true }.)

import { contact } from '../data/company'
import { formatPhone } from './lead'

const ENDPOINT = `https://formsubmit.co/ajax/${contact.emails[0]}`

/** Emails one lead to both BuildSafe addresses. Resolves { ok, needsActivation? } — never throws. */
export async function emailLeadViaFormSubmit(lead) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        Name: lead.name,
        Mobile: formatPhone(lead.phone),
        email: lead.email, // lower-case "email" lets FormSubmit set Reply-To to the visitor
        Company: lead.company || '—',
        Service: lead.service || '—',
        Message: lead.message,
        Source: lead.source || 'Website',
        Page: window.location.pathname + window.location.search,
        _subject: `New enquiry: ${lead.name}${lead.service ? ` — ${lead.service}` : ''}`,
        _cc: contact.emails.slice(1).join(','),
        _template: 'table',
        _captcha: 'false',
      }),
      signal: AbortSignal.timeout(15000),
    })
    const data = await res.json().catch(() => ({}))
    const ok = res.ok && String(data.success) === 'true'
    // Visible in the browser console (F12) — tells the site owner why email delivery failed.
    if (!ok) console.warn(`[BuildSafe] FormSubmit email not sent (HTTP ${res.status}):`, data.message ?? data)
    return { ok, needsActivation: !ok && /activat/i.test(data.message ?? '') }
  } catch (err) {
    console.warn('[BuildSafe] FormSubmit request failed:', err)
    return { ok: false }
  }
}
