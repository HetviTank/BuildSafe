import { motion } from 'framer-motion'
import ArtFrame from './ArtFrame'

const flame =
  'M0 0 C-38 0 -46 -48 -22 -82 C-18 -60 -6 -62 -8 -92 C-2 -120 22 -138 26 -158 C34 -122 60 -100 50 -50 C46 -18 30 0 0 0 Z'
const sparks = [
  { x: 270, d: 0 },
  { x: 300, d: 0.6 },
  { x: 285, d: 1.2 },
  { x: 315, d: 1.8 },
  { x: 260, d: 2.4 },
]
const spray = [0, 0.25, 0.5, 0.75, 1]

export default function FireArt({ className }) {
  return (
    <ArtFrame className={className} title="Fire protection illustration" glowAt={[290, 170]}>
      {/* Flames */}
      <g transform="translate(292 252)">
        <motion.g
          style={{ originY: 1 }}
          animate={{ scaleY: [1, 1.08, 0.95, 1.04, 1], scaleX: [1, 0.96, 1.03, 0.98, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d={flame} fill="#f25c05" />
          <path d={flame} fill="#fb923c" transform="scale(0.68)" />
          <path d={flame} fill="#fde68a" transform="scale(0.36)" />
        </motion.g>
      </g>
      {sparks.map((s) => (
        <motion.circle
          key={s.x}
          cx={s.x}
          cy={150}
          r={2.5}
          fill="#fbbf24"
          animate={{ y: [0, -110], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, delay: s.d, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Extinguisher */}
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M144 98 C200 92 214 160 196 204" stroke="#111827" strokeWidth="9" fill="none" strokeLinecap="round" />
        <rect x="188" y="198" width="16" height="26" rx="4" fill="#334155" transform="rotate(-20 196 211)" />
        <rect x="95" y="112" width="72" height="140" rx="30" fill="#dc2626" />
        <rect x="104" y="126" width="10" height="104" rx="5" fill="#ffffff" opacity="0.25" />
        <rect x="108" y="160" width="46" height="44" rx="6" fill="#f8fafc" />
        <text x="131" y="178" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626" fontFamily="Sora, sans-serif">FIRE</text>
        <rect x="116" y="186" width="30" height="4" rx="2" fill="#cbd5e1" />
        <rect x="116" y="194" width="22" height="4" rx="2" fill="#cbd5e1" />
        <rect x="119" y="92" width="24" height="22" rx="4" fill="#475569" />
        <path d="M112 92 L162 78 L165 86 L120 100 Z" fill="#94a3b8" />
        <circle cx="152" cy="106" r="9" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
        <motion.line
          x1="152" y1="106" x2="157" y2="101"
          stroke="#16a34a" strokeWidth="2" strokeLinecap="round"
          animate={{ rotate: [0, 25, 0] }}
          style={{ originX: '152px', originY: '106px' }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      {/* Spray */}
      {spray.map((d) => (
        <motion.circle
          key={d}
          cx={204}
          cy={214}
          r={4}
          fill="#e2e8f0"
          animate={{ x: [0, 55], y: [0, 10], opacity: [0, 0.9, 0], scale: [0.6, 1.4] }}
          transition={{ duration: 1.25, delay: d, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Shield badge */}
      <g transform="translate(345 62)">
        <path d="M0 -30 L26 -20 V2 C26 20 13 30 0 36 C-13 30 -26 20 -26 2 V-20 Z" fill="#f25c05" />
        <motion.path
          d="M-11 2 L-3 10 L12 -7"
          stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.4, 1] }}
        />
      </g>
    </ArtFrame>
  )
}
