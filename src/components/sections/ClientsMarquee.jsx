import ClientCard from '../ui/ClientCard'
import { clients } from '../../data/clients'

/** Two counter-scrolling rows of client cards. */
export default function ClientsMarquee() {
  const row = [...clients, ...clients]
  return (
    <div className="relative space-y-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <ClientCard key={i} client={c} className="w-72 shrink-0" />
        ))}
      </div>
      <div className="flex w-max animate-marquee-reverse gap-5 hover:[animation-play-state:paused]">
        {[...row].reverse().map((c, i) => (
          <ClientCard key={i} client={c} className="w-72 shrink-0" />
        ))}
      </div>
    </div>
  )
}
