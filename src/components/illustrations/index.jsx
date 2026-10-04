import FireArt from './FireArt'
import TrainingArt from './TrainingArt'
import IsoArt from './IsoArt'
import InspectionArt from './InspectionArt'
import AuditArt from './AuditArt'
import CivilArt from './CivilArt'

/** Maps the `art` key used in data files to its illustration component. */
const illustrations = {
  fire: FireArt,
  training: TrainingArt,
  iso: IsoArt,
  inspection: InspectionArt,
  audit: AuditArt,
  civil: CivilArt,
}

export function ServiceArt({ name, className }) {
  const Art = illustrations[name] ?? FireArt
  return <Art className={className} />
}
