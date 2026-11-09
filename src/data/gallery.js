// Gallery photos. `category` must match one of the `galleryCategories` ids.
// `wide: true` makes the photo span two columns in the full gallery.
// Photos whose category matches a service's `art` key also appear on that service page.

import fireDrill from '../assets/images/gallery/fire-drill-training.webp'
import videoSession from '../assets/images/gallery/safety-video-session.webp'
import trainingGroup from '../assets/images/gallery/training-group.webp'
import safetySession from '../assets/images/gallery/workplace-safety-session.webp'
import classroomBriefing from '../assets/images/gallery/classroom-safety-briefing.webp'
import classroomPresentation from '../assets/images/gallery/classroom-presentation.webp'

export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'training', label: 'Training' },
]

export const gallery = [
  { src: trainingGroup, title: 'Safety Training Batch', category: 'training', wide: true },
  { src: fireDrill, title: 'Fire Extinguisher Demonstration for Workers', category: 'training' },
  { src: safetySession, title: 'Workplace Safety Awareness Session', category: 'training' },
  { src: classroomBriefing, title: 'Safety Induction Briefing for Site Workers', category: 'training' },
  { src: classroomPresentation, title: 'Classroom Safety Training Presentation', category: 'training' },
  { src: videoSession, title: 'Construction Safety Video Training', category: 'training', wide: true, position: 'object-[50%_32%]' },
]
