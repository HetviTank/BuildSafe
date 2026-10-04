// Company-wide content: identity, contact details, navigation and shared copy.

import {
  FaShieldAlt,
  FaAward,
  FaHeadset,
  FaHandshake,
  FaIndustry,
  FaWarehouse,
  FaBuilding,
  FaRoad,
  FaSearch,
  FaExclamationTriangle,
  FaCheckDouble,
  FaTools,
} from 'react-icons/fa'
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa6'

export const company = {
  name: 'BuildSafe Enterprise',
  shortName: 'BuildSafe',
  tagline: 'Safety Today, Secure Tomorrow',
  certification: 'ISO 9001:2015 Certified Company',
  summary:
    'A professional Fire, Safety & Civil consultancy providing inspection, compliance and advisory services for industrial and commercial facilities — aligned with NBC, IS standards and applicable Factory Rules.',
}

export const contact = {
  phones: ['+91 79907 04863', '+91 93161 33521'],
  emails: ['buildsafeenterprise@gmail.com', 'admin.buildsafe@gmail.com'],
  whatsapp: '917990704863',
  address: {
    line1: 'Plot No. 81, Survey No. 476',
    line2: 'B/H Mithapashvariya Road, Bhuj – Bhachau Bypass',
    city: 'Anjar – 370110, Gujarat, India',
  },
  mapQuery: 'Mithapashvariya Road, Bhuj Bhachau Bypass, Anjar 370110',
  hours: '24/7 Emergency Response',
}

// Social profiles. `color` is the brand colour used on hover; `gradient` styles the large cards.
export const socials = [
  {
    name: 'Facebook',
    handle: 'BuildSafe Enterprise',
    url: 'https://www.facebook.com/profile.php?id=61580669030066',
    icon: FaFacebookF,
    color: '#1877F2',
    gradient: 'from-[#1877F2] to-[#0b4fb3]',
    cta: 'Like our page',
  },
  {
    name: 'Instagram',
    handle: '@buildsafeenterprise',
    url: 'https://www.instagram.com/buildsafeenterprise',
    icon: FaInstagram,
    color: '#E1306C',
    gradient: 'from-[#feda75] via-[#d62976] to-[#4f5bd5]',
    cta: 'Follow us',
  },
  {
    name: 'X',
    handle: '@Buildsafekutch',
    url: 'https://x.com/Buildsafekutch',
    icon: FaXTwitter,
    color: '#000000',
    gradient: 'from-[#1f1f1f] to-[#000000]',
    cta: 'Follow us',
  },
  {
    name: 'LinkedIn',
    handle: 'BuildSafe Enterprise',
    url: 'https://www.linkedin.com/in/buildsafe-enterprise-b784a8376',
    icon: FaLinkedinIn,
    color: '#0A66C2',
    gradient: 'from-[#0A66C2] to-[#063f78]',
    cta: 'Connect',
  },
  {
    name: 'YouTube',
    handle: '@buildsafeenterprise',
    url: 'https://www.youtube.com/@buildsafeenterprise',
    icon: FaYoutube,
    color: '#FF0000',
    gradient: 'from-[#FF0000] to-[#b30000]',
    cta: 'Subscribe',
  },
]

export const telHref = (phone) => `tel:${phone.replace(/\s/g, '')}`

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services', hasDropdown: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export const highlights = [
  { icon: FaAward, text: 'ISO 9001', label: '2015 certified quality management' },
  { icon: FaHandshake, value: 100, suffix: '%', label: 'Client satisfaction' },
  { icon: FaHeadset, value: 24, suffix: '/7', label: 'Emergency response' },
  { icon: FaShieldAlt, value: 6, suffix: '', label: 'Specialised service lines' },
]

export const expertise = [
  'Health & Safety Training',
  'ISO Consulting',
  'Third Party Inspection',
  'Audit Services',
  'Fire & Safety Service',
  'Civil Engineering Service',
  'Fire NOC Support',
  'Environment Audits',
]

export const about = {
  intro:
    'BuildSafe Enterprise is a professional consultancy firm providing Fire Safety, Industrial Safety, Environmental Compliance and Civil Engineering services.',
  body:
    'We offer inspection, auditing, testing and technical consultancy to industries, warehouses, commercial buildings and infrastructure projects — ensuring full alignment with statutory requirements and engineering standards.',
  approach:
    'Our approach focuses on practical site evaluation, risk identification, compliance verification and implementable solutions. With technical expertise and field experience, we deliver cost-effective, customised solutions for every client.',
  mission:
    'To provide high-quality, reliable and innovative construction and safety solutions that protect people, support projects and create lasting value for our customers.',
  vision:
    'To become a trusted leader in construction and safety solutions by delivering excellence, innovation and sustainable growth while building a safer and stronger future.',
}

export const process = [
  {
    icon: FaSearch,
    title: 'Site Evaluation',
    text: 'Practical, on-ground assessment of your facility, systems and operations.',
  },
  {
    icon: FaExclamationTriangle,
    title: 'Risk Identification',
    text: 'Pinpointing fire, structural and operational hazards before they escalate.',
  },
  {
    icon: FaCheckDouble,
    title: 'Compliance Verification',
    text: 'Checking against NBC, IS standards, Factory Rules and Fire NOC norms.',
  },
  {
    icon: FaTools,
    title: 'Implementable Solutions',
    text: 'Cost-effective, customised recommendations your team can act on.',
  },
]

export const industries = [
  { icon: FaIndustry, label: 'Industries & Factories' },
  { icon: FaWarehouse, label: 'Warehouses' },
  { icon: FaBuilding, label: 'Commercial Buildings' },
  { icon: FaRoad, label: 'Infrastructure Projects' },
]
