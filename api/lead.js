// Vercel serverless function: POST /api/lead
// Receives a website enquiry and forwards it to the business WhatsApp via CallMeBot.
//
// Required environment variables (Vercel → Project → Settings → Environment Variables,
// or .env.local for `npm run dev`):
//   CALLMEBOT_PHONE   WhatsApp number that receives leads, with country code, e.g. +917990704863
//   CALLMEBOT_APIKEY  key sent by CallMeBot when that number activated the bot
// The API key stays on the server — it is never sent to the visitor's browser.

const LIMITS = { name: 80, company: 120, phone: 20, email: 120, service: 80, message: 1500, page: 200 }
const MIN_FILL_MS = 3000 // a person needs more than 3 s to fill the form; bots usually don't
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5 // per IP per window (best effort: per serverless instance)
const hits = new Map()

const json = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
// eslint-disable-next-line no-control-regex -- strip control characters (keeps \n) from user input
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim().slice(0, max)

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_MAX
}

function buildMessage(lead) {
  const lines = [
    '🔔 *New website enquiry — BuildSafe*',
    '',
    `*Name:* ${lead.name}`,
    `*Phone:* ${lead.phone}`,
    lead.email ? `*Email:* ${lead.email}` : null,
    lead.company ? `*Company:* ${lead.company}` : null,
    lead.service ? `*Service:* ${lead.service}` : null,
    '',
    `*Message:*\n${lead.message}`,
    '',
    lead.page ? `Page: ${lead.page}` : null,
    `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} IST`,
  ]
  return lines.filter((l) => l !== null).join('\n') // null = optional field left empty
}

export async function POST(request) {
  const { CALLMEBOT_PHONE: phone, CALLMEBOT_APIKEY: apikey } = process.env
  if (!phone || !apikey) {
    console.error('lead: CALLMEBOT_PHONE / CALLMEBOT_APIKEY are not set')
    return json(503, { ok: false, error: 'Enquiry service is not configured' })
  }

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
  const errors = {}
  if (!lead.name) errors.name = 'Please enter your name'
  if (!/^[+\d][\d\s-]{7,}$/.test(lead.phone)) errors.phone = 'Please enter a valid phone number'
  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email)) errors.email = 'Please enter a valid email'
  if (!lead.message) errors.message = 'Please tell us how we can help'
  if (Object.keys(errors).length) return json(422, { ok: false, errors })

  const url = new URL('https://api.callmebot.com/whatsapp.php')
  url.searchParams.set('phone', phone)
  url.searchParams.set('text', buildMessage(lead))
  url.searchParams.set('apikey', apikey)

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const text = await res.text()
    if (!res.ok || /error|invalid|not\s+allowed/i.test(text)) {
      console.error('lead: CallMeBot rejected the message', res.status, text.slice(0, 300))
      return json(502, { ok: false, error: 'Could not deliver the enquiry' })
    }
  } catch (err) {
    console.error('lead: CallMeBot request failed', err)
    return json(502, { ok: false, error: 'Could not deliver the enquiry' })
  }

  return json(200, { ok: true })
}
