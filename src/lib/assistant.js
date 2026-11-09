// BuildSafe website assistant — a rule-based chatbot (no AI service, no API key).
// It answers from the site's own content (data/services.js, data/company.js, data/clients.js), so when
// that content changes the answers change with it. When a visitor wants a quote, a site visit or a
// callback, the chat UI collects their details (see leadStep below) and delivers them like the
// contact form does (WhatsApp + email).
//
// How matching works: the visitor's text is normalised (lower-case, simple stemming, synonyms), then
// every knowledge entry is scored by the keywords/phrases it contains; the best entry above a
// threshold answers. Otherwise the assistant offers to connect the visitor with the team.

import { about, company, contact, industries, process } from '../data/company'
import { services } from '../data/services'
import { clients } from '../data/clients'
import { fieldError, formatPhone, normalizePhone } from './lead'

// ---------------------------------------------------------------------------------------------
// Text normalisation

const STOP = new Set(
  'a an the and or of for to in on at by with from is are was be been do does did can could would should will i me my we our you your it its this that these those what which who whom how when where why please pls plz want need know tell about any some get give have has had am us there here just also more much very'.split(
    ' ',
  ),
)

// Spelling variants / shorthand → one canonical word.
const SYNONYMS = {
  rates: 'price', rate: 'price', cost: 'price', costs: 'price', charge: 'price', charges: 'price', fee: 'price', fees: 'price',
  pricing: 'price', budget: 'price', quotation: 'quote', estimate: 'estimation', estimat: 'estimation',
  nocs: 'noc', 'n.o.c': 'noc', extinguishers: 'extinguisher', extinguser: 'extinguisher', extingusher: 'extinguisher',
  hydrotesting: 'hydrotest', refilling: 'refill', refil: 'refill', sprinklers: 'sprinkler', hydrants: 'hydrant',
  cranes: 'crane', hooks: 'hook', tackles: 'tackle', drills: 'drill', mockdrill: 'drill', trainings: 'training',
  audits: 'audit', auditing: 'audit', inspections: 'inspection', inspect: 'inspection', certificate: 'certification',
  certified: 'certification', certify: 'certification', tpi: 'thirdparty', mobile: 'phone', number: 'phone', whatsapp: 'phone',
  mail: 'email', gmail: 'email', located: 'location', situated: 'location', office: 'location', address: 'location',
  timing: 'hours', timings: 'hours', time: 'hours', open: 'hours', customers: 'client', clients: 'client', customer: 'client',
  factories: 'factory', industries: 'industry', industrial: 'industry', warehouses: 'warehouse', buildings: 'building',
  structural: 'structure', helmets: 'ppe', helmet: 'ppe', harness: 'ppe', gloves: 'ppe', namaste: 'hello', namaskar: 'hello',
  hii: 'hi', hiii: 'hi', hey: 'hi', helo: 'hello', thx: 'thanks', thank: 'thanks', thanku: 'thanks', dhanyavad: 'thanks',
  shukriya: 'thanks', vacancy: 'job', vacancies: 'job', career: 'job', careers: 'job', hiring: 'job', internship: 'job',
  photos: 'gallery', photo: 'gallery', pictures: 'gallery', images: 'gallery', urgent: 'emergency', asap: 'emergency',
}

const stem = (w) => {
  if (SYNONYMS[w]) return SYNONYMS[w]
  let s = w
  if (s.length > 5 && s.endsWith('ing')) s = s.slice(0, -3)
  else if (s.length > 4 && s.endsWith('ies')) s = s.slice(0, -3) + 'y'
  else if (s.length > 4 && s.endsWith('es') && !s.endsWith('ses')) s = s.slice(0, -2)
  else if (s.length > 3 && s.endsWith('s') && !s.endsWith('ss')) s = s.slice(0, -1)
  return SYNONYMS[s] ?? s
}

/** Lower-cases, strips punctuation and returns { text, words: Set } with stemmed, synonym-mapped words. */
export function normalize(input) {
  const text = ` ${String(input).toLowerCase().replace(/third[\s-]*party/g, 'thirdparty').replace(/[^a-z0-9+@.\s]/g, ' ').replace(/\s+/g, ' ').trim()} `
  const words = new Set(text.split(' ').filter((w) => w && !STOP.has(w)).map(stem))
  return { text, words }
}

// ---------------------------------------------------------------------------------------------
// Knowledge base (built from site data)

const tel = contact.phones[0].replace(/\s/g, '')
const ACTIONS = {
  call: { type: 'call', label: `Call ${contact.phones[0]}`, href: `tel:${tel}` },
  whatsapp: { type: 'whatsapp', label: 'WhatsApp us', href: `https://wa.me/${contact.whatsapp}` },
  email: { type: 'email', label: 'Email us', href: `mailto:${contact.emails[0]}` },
  lead: { type: 'lead', label: 'Get a free quote' },
  map: { type: 'link', label: 'Open in Google Maps', href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}` },
}

export const QUICK_START = ['Fire NOC help', 'Our services', 'Get a free quote', 'Contact details']

// Extra search words: broad ones per service, specific ones per sub-service (so "fire noc" lands on the
// Fire NOC answer, not the whole Fire & Safety page). Keys must match titles in data/services.js.
const SERVICE_KEYWORDS = {
  'fire-safety': ['fire safety', 'fire', 'fire protection', 'fire fighting'],
  'health-safety-training': ['training', 'staff training', 'employee training', 'workshop', 'drill'],
  'iso-consulting': ['iso', '9001', 'iso certification', 'qms', 'management system', 'certification'],
  'third-party-inspection': ['thirdparty', 'third party inspection', 'equipment inspection'],
  audits: ['audit', 'compliance audit'],
  'civil-engineering': ['civil', 'civil engineering', 'structure', 'construction', 'building plan'],
}
const ITEM_KEYWORDS = {
  'Fire Safety Inspection & Compliance Audit': ['fire inspection', 'risk assessment', 'fire safety inspection'],
  'Fire NOC Support & Documentation': ['noc', 'fire noc', 'renewal', 'approval', 'fire department', 'license'],
  'Fire Alarm & Detection System Review': ['smoke detector', 'fire alarm', 'detector', 'alarm panel'],
  'Fire Extinguisher Inspection, Hydrotesting & Refilling': ['extinguisher', 'refill', 'hydrotest', 'cylinder', 'co2'],
  'Fire Pump, Sprinkler & Hydrant System Inspection': ['sprinkler', 'hydrant', 'fire pump'],
  'Supply of PPEs & Specialized Safety Gear': ['ppe', 'safety gear', 'safety shoes', 'respirator', 'supply'],
  'Onsite Emergency Plan Preparation & Implementation': ['onsite emergency', 'emergency plan', 'mock drill', 'fire drill'],
  'Emergency Evacuation Planning': ['evacuation', 'evacuation plan', 'exit route', 'escape route'],
  'Safety Awareness Programmes': ['awareness', 'toolbox talk', 'safety awareness', 'safety culture'],
  'Gap Assessment': ['gap assessment', 'gap analysis'],
  'Documentation & Implementation Support': ['documentation', 'procedure', 'sop', 'iso documents'],
  'Certification Readiness': ['internal audit', 'certification audit', 'iso audit'],
  'Third-Party Inspection of Tools & Lifting Equipment': ['crane', 'hook', 'lifting', 'tackle', 'hoist', 'sling', 'load test', 'forklift', 'chain pulley'],
  'Safety Audits (Statutory & Customized)': ['safety audit', 'statutory audit', 'statutory'],
  'Fire Safety Compliance Audit': ['fire audit', 'fire safety audit'],
  'Environment Audits & Compliance Support': ['environment', 'environmental', 'environment audit'],
  'Engineering Consultancy & Space Planning': ['space planning', 'layout', 'engineering consultancy'],
  'Pre-DCR & Regulatory Support': ['dcr', 'pre dcr', 'plan approval', 'regulatory'],
  'Testing, Estimation & Quality Control': ['material testing', 'estimation', 'quality control', 'boq', 'cost estimation'],
}

const GENERIC = new Set(['safety', 'service', 'support', 'system', 'review', 'inspection', 'fire', 'program', 'programme', 'management', 'planning', 'compliance'])

function serviceEntries() {
  const out = []
  for (const s of services) {
    const link = { label: `View ${s.title}`, to: `/services/${s.slug}` }
    out.push({
      id: `service:${s.slug}`,
      service: s.title,
      keywords: [...(SERVICE_KEYWORDS[s.slug] ?? []), ...normalize(s.title).words].map((k) => ({ k, w: k.includes(' ') ? 3 : 1.5 })),
      answer: {
        text: `${s.title}: ${s.summary}`,
        bullets: s.items.map((i) => i.title),
        links: [link],
        actions: [ACTIONS.lead],
        quick: ['Get a free quote', 'Other services'],
      },
    })
    // One entry per sub-service so specific questions get specific answers.
    for (const item of s.items) {
      const words = [...normalize(item.title).words].filter((w) => w.length > 2 && !GENERIC.has(w))
      out.push({
        id: `item:${s.slug}:${item.title}`,
        service: s.title,
        keywords: [
          { k: item.title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(), w: 6 },
          ...words.map((k) => ({ k, w: 2 })),
          ...(ITEM_KEYWORDS[item.title] ?? []).map((k) => ({ k, w: k.includes(' ') ? 4 : 3 })),
          ...[...normalize(item.points.join(' ')).words].filter((w) => w.length > 3 && !GENERIC.has(w)).map((k) => ({ k, w: 0.75 })),
        ],
        answer: {
          text: `${item.title} — part of our ${s.title}:`,
          bullets: item.points,
          links: [link],
          actions: [ACTIONS.lead],
          quick: ['Get a free quote', 'Talk to the team'],
        },
      })
    }
  }
  return out
}

const servicesListAnswer = {
  text: `${company.name} offers ${services.length} service lines — tap one to learn more:`,
  links: services.map((s) => ({ label: s.title, to: `/services/${s.slug}` })),
  quick: ['Fire NOC help', 'Get a free quote'],
}

const leadAnswer = (intro) => ({
  text: `${intro} Share a few details and our team will contact you shortly — it takes 30 seconds.`,
  actions: [ACTIONS.lead, ACTIONS.call],
})

const ENTRIES = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'good morning', 'good afternoon', 'good evening', 'kem cho'].map((k) => ({ k, w: 2 })),
    smallTalk: true,
    answer: { text: `Hello! 👋 I'm the ${company.shortName} assistant. Ask me about Fire NOC, safety audits, inspections, training, ISO or civil engineering — or get a free quote.`, quick: QUICK_START },
  },
  {
    id: 'thanks',
    keywords: [{ k: 'thanks', w: 3 }, { k: 'great', w: 1 }, { k: 'ok', w: 0.5 }],
    smallTalk: true,
    answer: { text: `You're welcome! Is there anything else I can help with?`, quick: ['Our services', 'Get a free quote', 'No, that’s all'] },
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see you', 'that s all', 'thats all', 'no that s all', 'nothing else'].map((k) => ({ k, w: 3 })),
    smallTalk: true,
    answer: { text: `Thank you for visiting ${company.name}. Stay safe! For emergencies we respond 24/7 on ${contact.phones[0]}.` },
  },
  {
    id: 'bot',
    keywords: ['are you human', 'are you a bot', 'are you ai', 'real person', 'who are you', 'your name', 'bot', 'robot'].map((k) => ({ k, w: 3 })),
    answer: { text: `I'm ${company.shortName}'s virtual assistant — I answer from our website. For anything I can't handle, I'll pass your details to our team, or you can call ${contact.phones[0]}.`, actions: [ACTIONS.lead, ACTIONS.call] },
  },
  {
    id: 'emergency',
    keywords: ['emergency', 'fire now', 'on fire', 'fire broke', 'caught fire', 'accident', 'help now'].map((k) => ({ k, w: 4 })),
    answer: {
      text: `🚨 If there is a fire or someone is in danger right now, call the Fire Brigade on 101 (or 112) immediately. For urgent support from our team we respond 24/7:`,
      actions: [{ type: 'call', label: 'Call 101 (Fire)', href: 'tel:101' }, ACTIONS.call],
    },
  },
  {
    id: 'contact',
    keywords: ['phone', 'contact', 'call', 'email', 'reach', 'contact details', 'talk to'].map((k) => ({ k, w: 2 })),
    answer: {
      text: `You can reach ${company.name} here:`,
      bullets: [...contact.phones.map((p) => `📞 ${p}`), ...contact.emails.map((e) => `✉️ ${e}`), `⏱ ${contact.hours}`],
      actions: [ACTIONS.call, ACTIONS.whatsapp, ACTIONS.email],
    },
  },
  {
    id: 'location',
    keywords: [{ k: 'location', w: 3 }, { k: 'where', w: 1.5 }, { k: 'map', w: 2 }, { k: 'direction', w: 2 }, { k: 'visit office', w: 3 }],
    answer: {
      text: `Our office is at:`,
      bullets: [contact.address.line1, contact.address.line2, contact.address.city],
      actions: [ACTIONS.map, ACTIONS.call],
    },
  },
  {
    id: 'hours',
    keywords: [{ k: 'hours', w: 3 }, { k: '24 7', w: 3 }, { k: 'available', w: 1.5 }, { k: 'sunday', w: 2 }, { k: 'holiday', w: 2 }],
    answer: { text: `We offer ${contact.hours.toLowerCase()} — call ${contact.phones[0]} any time. For regular enquiries, leave your details and the team will get back to you.`, actions: [ACTIONS.call, ACTIONS.lead] },
  },
  {
    id: 'area',
    keywords: [{ k: 'serve', w: 1 }, ...['area', 'cover', 'city', 'kutch', 'kachchh', 'anjar', 'bhuj', 'gandhidham', 'mundra', 'bhachau', 'mandvi', 'kandla', 'gujarat', 'ahmedabad', 'rajkot', 'outside', 'location wise'].map((k) => ({ k, w: 2 }))],
    answer: { text: `We're based in Anjar (Kutch, Gujarat) and work with sites across Kutch and Gujarat. Tell us your site location and requirement and the team will confirm availability.`, actions: [ACTIONS.lead] },
  },
  {
    id: 'about',
    keywords: [{ k: 'about', w: 1 }, { k: 'company', w: 2 }, { k: 'buildsafe', w: 2 }, { k: 'experience', w: 2 }, { k: 'who are', w: 2 }, { k: 'background', w: 2 }],
    answer: { text: `${about.intro} ${about.body}`, links: [{ label: 'About us', to: '/about' }], quick: ['Our services', 'Clients'] },
  },
  {
    id: 'iso-certified',
    keywords: [{ k: 'certification', w: 1 }, { k: 'iso certified', w: 4 }, { k: 'are you certified', w: 5 }, { k: 'your certification', w: 5 }],
    answer: { text: `Yes — ${company.name} is an ${company.certification}. We also help clients prepare for ISO certification themselves.`, links: [{ label: 'ISO Consulting', to: '/services/iso-consulting' }] },
  },
  {
    id: 'clients',
    keywords: [{ k: 'client', w: 3 }, { k: 'worked with', w: 3 }, { k: 'portfolio', w: 2 }, { k: 'reference', w: 2 }, { k: 'trusted', w: 1 }],
    answer: { text: `Organisations that have worked with us include:`, bullets: clients.map((c) => c.name), links: [{ label: 'See photos of our work', to: '/gallery' }] },
  },
  {
    id: 'industries',
    keywords: [{ k: 'industry', w: 3 }, { k: 'sector', w: 3 }, ...['factory', 'warehouse', 'commercial', 'infrastructure', 'plant'].map((k) => ({ k, w: 1.5 }))],
    answer: { text: `We work with:`, bullets: industries.map((i) => i.label), quick: ['Our services', 'Get a free quote'] },
  },
  {
    id: 'process',
    keywords: [{ k: 'process', w: 3 }, { k: 'how do you work', w: 4 }, { k: 'approach', w: 3 }, { k: 'step', w: 2 }, { k: 'procedure', w: 2 }, { k: 'methodology', w: 3 }],
    answer: { text: `Our approach, step by step:`, bullets: process.map((p, i) => `${i + 1}. ${p.title} — ${p.text}`), actions: [ACTIONS.lead] },
  },
  {
    id: 'standards',
    keywords: ['nbc', 'is code', 'is standard', 'factory rule', 'factories act', 'regulation', 'law', 'legal', 'mandatory', 'compliance'].map((k) => ({ k, w: 2 })),
    answer: { text: `Our inspections, audits and recommendations are aligned with NBC (National Building Code), IS standards, applicable Factory Rules and Fire NOC norms. Tell us about your site and we'll advise what applies to you.`, actions: [ACTIONS.lead] },
  },
  {
    id: 'price',
    keywords: [{ k: 'price', w: 7 }, { k: 'quote', w: 7 }, { k: 'how much', w: 7 }, { k: 'free quote', w: 5 }, { k: 'get a free quote', w: 6 }, { k: 'package', w: 2 }],
    lead: true,
    answer: leadAnswer(`Pricing depends on your site, its size and the scope of work, so we give a custom quote — free of charge.`),
  },
  {
    id: 'callback',
    keywords: ['call me', 'callback', 'call back', 'contact me', 'site visit', 'visit my site', 'meeting', 'appointment', 'talk to the team', 'talk to team', 'speak to', 'consultation'].map((k) => ({ k, w: 4 })),
    lead: true,
    answer: leadAnswer(`Sure — we'd be happy to help.`),
  },
  {
    id: 'services',
    keywords: [{ k: 'services', w: 3 }, { k: 'our services', w: 4 }, { k: 'other services', w: 5 }, { k: 'what do you do', w: 4 }, { k: 'what you do', w: 4 }, { k: 'offer', w: 2 }, { k: 'provide', w: 2 }],
    answer: servicesListAnswer,
  },
  {
    id: 'gallery',
    keywords: [{ k: 'gallery', w: 3 }, { k: 'project', w: 2 }, { k: 'past work', w: 3 }, { k: 'your work', w: 3 }],
    answer: { text: `See photos from our training sessions, fire drills and site work:`, links: [{ label: 'Open gallery', to: '/gallery' }] },
  },
  {
    id: 'job',
    keywords: [{ k: 'job', w: 4 }, { k: 'resume', w: 4 }, { k: 'cv', w: 4 }, { k: 'work with you', w: 3 }],
    answer: { text: `Thanks for your interest in joining ${company.shortName}! Please email your CV to ${contact.emails[0]} and the team will get in touch if there's a suitable opening.`, actions: [ACTIONS.email] },
  },
  ...serviceEntries(),
]

// Precompute keyword forms: multi-word keys match as phrases on the normalised text, single words on the stemmed word set.
for (const e of ENTRIES) {
  e.keywords = e.keywords.map(({ k, w }) => {
    const n = normalize(k)
    if (!k.trim().includes(' ')) return { word: [...n.words][0] ?? k, w }
    // Whole-phrase match that also allows a word ending on the last word ("load test" → "load testing"),
    // but not other trailing letters ("who are you" must not match "who are your").
    const escaped = n.text.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return { phrase: new RegExp(`\\s${escaped}(?:s|es|ing|ed)?\\s`), w }
  })
}

const FALLBACK = {
  text: `I'm not sure I understood that. I can help with Fire NOC, fire safety, audits, third-party inspection, training, ISO and civil engineering — or pass your question to our team.`,
  actions: [ACTIONS.lead, ACTIONS.call],
  quick: ['Our services', 'Get a free quote', 'Contact details'],
}

/**
 * Picks the best answer for a visitor message.
 * @returns {{ id: string, answer: object, lead?: boolean, service?: string, score: number }}
 */
export function reply(message) {
  const { text, words } = normalize(message)
  if (!words.size && !text.trim()) return { id: 'empty', answer: FALLBACK, score: 0 }

  let best = null
  for (const e of ENTRIES) {
    let score = 0
    for (const kw of e.keywords) {
      if (kw.phrase ? kw.phrase.test(text) : words.has(kw.word)) score += kw.w
    }
    // Small talk shouldn't win over a real question that also says "hi"/"thanks".
    if (e.smallTalk && words.size > 3) score *= 0.4
    if (score > (best?.score ?? 0)) best = { ...e, score }
  }

  if (!best || best.score < 1.5) return { id: 'fallback', answer: FALLBACK, score: best?.score ?? 0 }
  return { id: best.id, answer: best.answer, lead: Boolean(best.lead), service: best.service, score: best.score }
}

// ---------------------------------------------------------------------------------------------
// Lead capture inside the chat: name → phone → email → requirement → send.

export const LEAD_STEPS = ['name', 'phone', 'email', 'message']

const PROMPTS = {
  name: () => `Great! What's your name?`,
  phone: (lead) => `Thanks ${lead.name.split(' ')[0]}! What's your mobile number? (10 digits, +91)`,
  email: () => `And your email address?`,
  message: (lead) =>
    lead.service
      ? `Briefly, what do you need help with? (e.g. site location, type of facility — I'll note it's about ${lead.service})`
      : `Briefly, what do you need help with? (e.g. Fire NOC, audit, site location)`,
}

export const leadPrompt = (step, lead) => PROMPTS[step](lead)

const CANCEL = /^(cancel|stop|exit|quit|no|nevermind|never mind|leave it)$/i

/**
 * Advances the chat lead form by one answer.
 * @returns {{ lead, step: string|null, error?: string, cancelled?: boolean, done?: boolean }}
 *          step=null + done=true → ready to send.
 */
export function leadStep(step, lead, input) {
  const raw = String(input).trim()
  if (CANCEL.test(raw)) return { lead, step: null, cancelled: true }

  const value = step === 'phone' ? normalizePhone(raw) : raw
  const error = step === 'name' && value.length < 2 ? 'Please enter your name' : fieldError(step, value)
  if (error) return { lead, step, error }

  const next = { ...lead, [step]: value }
  const i = LEAD_STEPS.indexOf(step)
  return i === LEAD_STEPS.length - 1 ? { lead: next, step: null, done: true } : { lead: next, step: LEAD_STEPS[i + 1] }
}

/** Human summary shown before sending. */
export const leadSummary = (lead) =>
  [`Name: ${lead.name}`, `Mobile: ${formatPhone(lead.phone)}`, `Email: ${lead.email}`, lead.service && `About: ${lead.service}`, `Need: ${lead.message}`].filter(Boolean)
