// Gallery items. `type: 'photo'` uses `src`; `type: 'art'` renders a built-in illustration.
// `category` must match one of the `galleryCategories` ids. Photos whose category matches a
// service's `art` key also appear on that service page.

import extinguisherAudit from '../assets/images/gallery/extinguisher-audit.webp'
import civilStructural from '../assets/images/gallery/civil-structural.webp'
import banner from '../assets/images/gallery/fire-civil-banner.webp'
import fireDrill from '../assets/images/gallery/fire-drill-training.webp'
import videoSession from '../assets/images/gallery/safety-video-session.webp'
import trainingGroup from '../assets/images/gallery/training-group.webp'
import safetySession from '../assets/images/gallery/workplace-safety-session.webp'

export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'fire', label: 'Fire Safety' },
  { id: 'training', label: 'Training' },
  { id: 'inspection', label: 'Inspection & Audits' },
  { id: 'civil', label: 'Civil Engineering' },
]

export const gallery = [
  { type: 'photo', src: fireDrill, title: 'Fire Extinguisher Demonstration for Workers', category: 'training' },
  { type: 'art', art: 'fire', title: 'Fire Protection Systems', category: 'fire' },
  { type: 'photo', src: safetySession, title: 'Workplace Safety Awareness Session', category: 'training' },
  { type: 'art', art: 'inspection', title: 'Lifting Equipment Inspection', category: 'inspection' },
  { type: 'photo', src: trainingGroup, title: 'Safety Training Batch', category: 'training' },
  { type: 'art', art: 'civil', title: 'Construction & Space Planning', category: 'civil' },
  { type: 'photo', src: banner, title: 'Fire Safety & Civil Solutions', category: 'fire' },
  { type: 'art', art: 'training', title: 'Health & Safety Training', category: 'training' },
  { type: 'photo', src: extinguisherAudit, title: 'Fire Extinguisher Inspection', category: 'fire' },
  { type: 'photo', src: videoSession, title: 'Construction Safety Video Training', category: 'training' },
  { type: 'art', art: 'audit', title: 'Safety & Environment Audits', category: 'inspection' },
  { type: 'photo', src: civilStructural, title: 'Civil & Structural Engineering', category: 'civil', position: 'object-left-top' },
  { type: 'art', art: 'iso', title: 'ISO Consulting', category: 'inspection' },
]
