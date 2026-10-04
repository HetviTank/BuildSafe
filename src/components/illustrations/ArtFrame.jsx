import { useId } from 'react'

/** Shared dark backdrop (gradient, blueprint grid, glow) for every service illustration. */
export default function ArtFrame({ children, className = '', title, glow = '#f25c05', glowAt = [300, 90] }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={title} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1220" />
          <stop offset="100%" stopColor="#1a2740" />
        </linearGradient>
        <radialGradient id={`glow${id}`}>
          <stop offset="0%" stopColor={glow} stopOpacity="0.45" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#ffffff" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#bg${id})`} />
      <rect width="400" height="300" fill={`url(#grid${id})`} />
      <circle cx={glowAt[0]} cy={glowAt[1]} r="160" fill={`url(#glow${id})`} />
      <rect y="252" width="400" height="48" fill="#070b14" opacity="0.55" />
      {children}
    </svg>
  )
}
