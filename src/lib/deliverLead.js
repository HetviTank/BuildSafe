// Sends a lead (from the contact form or the chat assistant) to BuildSafe automatically:
//   1. POST /api/lead  → WhatsApp (CallMeBot) + email (Gmail) when configured on the server
//   2. if the server didn't email it (or couldn't be reached) → email from the browser via FormSubmit
// Resolves { ok: true } | { ok: false, errors? } — never throws.

import { emailLeadViaFormSubmit } from './formsubmit'

/**
 * @param {{name:string, phone:string, email:string, company?:string, service?:string, message:string}} lead
 * @param {{ source?: string, honeypot?: string, startedAt?: number }} [meta]  startedAt = performance.now() when the form/chat opened
 */
export async function deliverLead(lead, { source = 'Contact form', honeypot = '', startedAt = 0 } = {}) {
  const elapsed = startedAt ? performance.now() - startedAt : 0
  if (honeypot) return { ok: true } // bot filled the hidden field — pretend success, send nothing

  let server = { ok: false, status: 0, channels: null }
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...lead,
        source,
        website: honeypot,
        page: window.location.pathname + window.location.search,
        elapsed: Math.round(elapsed),
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 422 && data.errors) return { ok: false, errors: data.errors }
    server = { ok: res.ok && data.ok === true, status: res.status, channels: data.channels ?? null }
  } catch {
    // server unreachable — fall through to the browser email
  }

  // Email from the browser unless the server already emailed it. (No `channels` + ok = request was
  // silently dropped as spam; 429 = rate-limited — neither should be emailed.)
  const needsEmail = server.channels ? server.channels.email !== 'sent' : !server.ok && server.status !== 429
  const emailed = needsEmail ? (await emailLeadViaFormSubmit({ ...lead, source })).ok : false

  return { ok: server.ok || emailed }
}
