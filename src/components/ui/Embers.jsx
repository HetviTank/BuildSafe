// Fire-themed floating particles for dark hero areas.
// Positions are generated once at module load so renders stay pure.

const embers = Array.from({ length: 22 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2) // deterministic 0..1
  return {
    left: `${Math.round(r(1) * 100)}%`,
    size: 2 + Math.round(r(2) * 4),
    duration: 7 + r(3) * 8,
    delay: -r(4) * 12,
    drift: Math.round((r(5) - 0.5) * 120),
  }
})

export default function Embers({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember absolute bottom-0 rounded-full bg-gradient-to-t from-brand-500 to-amber-300"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            '--drift': `${e.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
