// Gallery photos. `category` must match one of the `galleryCategories` ids.
// `wide: true` makes the photo span two columns in the full gallery.
// Photos whose category matches a service's `art` key also appear on that service page.

import plantBriefing from '../assets/images/gallery/plant-safety-briefing.webp'
import extinguisherDemo from '../assets/images/gallery/fire-extinguisher-demonstration.webp'
import hydrantDrill from '../assets/images/gallery/fire-hydrant-hose-drill.webp'
import factoryFloor from '../assets/images/gallery/factory-floor-safety-training.webp'
import cleanroom from '../assets/images/gallery/cleanroom-staff-training.webp'
import toolboxTalk from '../assets/images/gallery/warehouse-toolbox-talk.webp'
import panelWalkthrough from '../assets/images/gallery/electrical-panel-safety-walkthrough.webp'
import stretcherDrill from '../assets/images/gallery/emergency-rescue-stretcher-drill.webp'
import classroom from '../assets/images/gallery/classroom-safety-training.webp'
import awarenessSession from '../assets/images/gallery/workplace-safety-awareness-session.webp'

export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'training', label: 'Training' },
]

// Order matters: on large screens this fills the 3-column grid exactly (two wide tiles),
// and the Home page shows the first 6.
export const gallery = [
  { src: plantBriefing, title: 'Plant Safety Briefing for Staff', category: 'training', wide: true },
  { src: extinguisherDemo, title: 'Fire Extinguisher Live Demonstration', category: 'training', position: 'object-[50%_32%]' },
  { src: hydrantDrill, title: 'Fire Hydrant Hose Drill', category: 'training' },
  { src: factoryFloor, title: 'Safety Awareness Training on the Factory Floor', category: 'training', wide: true },
  { src: cleanroom, title: 'Safety Training for Cleanroom Staff', category: 'training' },
  { src: toolboxTalk, title: 'Toolbox Talk for Warehouse Workers', category: 'training' },
  { src: panelWalkthrough, title: 'Electrical Panel Room Safety Walkthrough', category: 'training' },
  { src: stretcherDrill, title: 'Emergency Rescue & Stretcher Drill', category: 'training' },
  { src: classroom, title: 'Classroom Safety Training Session', category: 'training' },
  { src: awarenessSession, title: 'Workplace Safety Awareness Session', category: 'training' },
]
