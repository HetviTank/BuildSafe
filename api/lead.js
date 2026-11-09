// Vercel serverless function: POST /api/lead
// Receives a website enquiry and delivers it automatically, in parallel, to:
//   1. the business WhatsApp (via CallMeBot)
//   2. the BuildSafe email inboxes (via the company Gmail account)
// The visitor sees "Thank you" when at least one channel delivered it. If the email was not sent
// here (e.g. no Gmail app password set), the browser emails the lead via FormSubmit instead
// (see src/lib/formsubmit.js), so email works even with zero configuration.
//
// Environment variables (Vercel → Project → Settings → Environment Variables; .env.local for `npm run dev`):
//   CALLMEBOT_APIKEY    key CallMeBot sent to the WhatsApp number               (required for WhatsApp)
//   CALLMEBOT_PHONE     WhatsApp number that receives leads    default +917990704863
//   GMAIL_APP_PASSWORD  16-character Google "app password" of GMAIL_USER        (required for email)
//   GMAIL_USER          Gmail account that sends the email     default buildsafeenterprise@gmail.com
//   LEAD_EMAIL_TO       comma-separated recipients             default both BuildSafe addresses
// Secrets stay on the server — they are never sent to the visitor's browser.

import nodemailer from 'nodemailer'
import { LIMITS, formatPhone, normalizePhone, validateLead } from '../src/lib/lead.js'

const DEFAULTS = {
  CALLMEBOT_PHONE: '+917990704863',
  GMAIL_USER: 'buildsafeenterprise@gmail.com',
  LEAD_EMAIL_TO: 'buildsafeenterprise@gmail.com,admin.buildsafe@gmail.com',
}
const env = (name) => process.env[name]?.trim() || DEFAULTS[name] || ''

const MIN_FILL_MS = 3000 // a person needs more than 3 s to fill the form; bots usually don't
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5 // per IP per window (best effort: per serverless instance)
const hits = new Map()

const json = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
// eslint-disable-next-line no-control-regex -- strip control characters (keeps \n) from user input
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim().slice(0, max)
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_MAX
}

const istTime = () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'

/** The lead as label/value rows, shared by the WhatsApp and email messages. */
const rows = (lead) =>
  [
    ['Name', lead.name],
    ['Phone', formatPhone(lead.phone)],
    ['Email', lead.email],
    ['Company', lead.company],
    ['Service', lead.service],
    ['Source', lead.source],
  ].filter(([, v]) => v)

function whatsappText(lead) {
  return [
    `🔔 *New ${lead.source === 'Website chat' ? 'chat' : 'website'} enquiry — BuildSafe*`,
    '',
    ...rows(lead).map(([k, v]) => `*${k}:* ${v}`),
    '',
    `*Message:*\n${lead.message}`,
    '',
    lead.page ? `Page: ${lead.page}` : null,
    `Time: ${istTime()}`,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

function emailHtml(lead) {
  const tr = ([k, v]) =>
    `<tr><td style="padding:8px 12px;color:#64748b;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 12px;color:#0b1220;font-weight:600">${escapeHtml(v)}</td></tr>`
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
  <div style="background:#0b1220;color:#fff;padding:18px 20px;font-size:18px;font-weight:bold">🔔 New website enquiry <span style="color:#ff7a33">— BuildSafe</span></div>
  <table style="width:100%;border-collapse:collapse;font-size:15px">${rows(lead).map(tr).join('')}</table>
  <div style="padding:12px 20px 4px;color:#64748b;font-size:13px">Message</div>
  <div style="padding:0 20px 18px;color:#0b1220;font-size:15px;white-space:pre-wrap">${escapeHtml(lead.message)}</div>
  <div style="padding:12px 20px;background:#f8fafc;color:#64748b;font-size:12px">${lead.page ? `Page: ${escapeHtml(lead.page)} · ` : ''}${istTime()}<br>Reply to this email to answer ${escapeHtml(lead.name)} directly.</div>
</div>`
}

async function sendWhatsApp(lead) {
  const apikey = env('CALLMEBOT_APIKEY')
  if (!apikey) return 'not-configured'
  const url = new URL('https://api.callmebot.com/whatsapp.php')
  url.searchParams.set('phone', env('CALLMEBOT_PHONE'))
  url.searchParams.set('text', whatsappText(lead))
  url.searchParams.set('apikey', apikey)
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  const text = await res.text()
  if (!res.ok || /error|invalid|not\s+allowed/i.test(text)) throw new Error(`CallMeBot ${res.status}: ${text.slice(0, 200)}`)
  return 'sent'
}

async function sendEmail(lead) {
  const pass = env('GMAIL_APP_PASSWORD').replace(/\s/g, '')
  if (!pass) return 'not-configured'
  const user = env('GMAIL_USER')
  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass }, connectionTimeout: 10000 })
  await transport.sendMail({
    from: `"BuildSafe Website" <${user}>`,
    to: env('LEAD_EMAIL_TO'),
    replyTo: `"${lead.name.replace(/"/g, '')}" <${lead.email}>`,
    subject: `New ${lead.source === 'Website chat' ? 'chat ' : ''}enquiry: ${lead.name}${lead.service ? ` — ${lead.service}` : ''}`,
    text: whatsappText(lead).replace(/\*/g, ''),
    html: emailHtml(lead),
  })
  return 'sent'
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { ok: false, error: 'Invalid request' })
  }

  // Spam checks: hidden "website" field must stay empty, and the form must not be submitted instantly.
  // Pretend success so bots don't learn they were blocked.
  if (body.website || (Number(body.elapsed) > 0 && Number(body.elapsed) < MIN_FILL_MS)) return json(200, { ok: true })

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) return json(429, { ok: false, error: 'Too many enquiries. Please call or WhatsApp us directly.' })

  const lead = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, clean(body[k], max)]))
  lead.phone = normalizePhone(body.phone)
  lead.page = clean(body.page, 200)
  lead.source = clean(body.source, 40) || 'Website'
  const errors = validateLead(lead)
  if (Object.keys(errors).length) return json(422, { ok: false, errors })

  const [whatsapp, email] = await Promise.allSettled([sendWhatsApp(lead), sendEmail(lead)])
  const outcome = { whatsapp, email }
  const channels = {} // per channel: 'sent' | 'failed' | 'not-configured' — the browser uses this to decide on its email fallback
  for (const [channel, r] of Object.entries(outcome)) {
    channels[channel] = r.status === 'rejected' ? 'failed' : r.value
    if (r.status === 'rejected') console.error(`lead: ${channel} delivery failed —`, r.reason?.message ?? r.reason)
    else if (r.value === 'not-configured') console.warn(`lead: ${channel} is not configured (see api/lead.js)`)
  }

  if (Object.values(channels).includes('sent')) return json(200, { ok: true, channels })
  const anyFailed = Object.values(channels).includes('failed')
  return json(anyFailed ? 502 : 503, {
    ok: false,
    channels,
    error: anyFailed ? 'Could not deliver the enquiry' : 'Enquiry service is not configured',
  })
}
