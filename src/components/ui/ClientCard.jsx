const initials = (name) =>
  name
    .replace(/\b(Ltd|India|Pvt|Products)\b\.?/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

/** Client tile: shows the logo when provided, otherwise a branded monogram. */
export default function ClientCard({ client, className = '' }) {
  return (
    <div
      className={`group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-ink-900/10 ${className}`}
    >
      {client.logo ? (
        <img src={client.logo} alt="" className="h-12 w-12 shrink-0 object-contain" />
      ) : (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-900 to-ink-700 font-display text-sm font-bold text-white transition duration-300 group-hover:from-brand-500 group-hover:to-brand-700">
          {initials(client.name)}
        </span>
      )}
      <span className="font-display text-sm font-semibold leading-snug text-ink-900 sm:text-base">{client.name}</span>
    </div>
  )
}
