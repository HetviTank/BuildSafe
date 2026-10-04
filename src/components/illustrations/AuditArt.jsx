import { motion } from 'framer-motion'
import ArtFrame from './ArtFrame'

const rows = [104, 142, 180, 218]
const bars = [
  { x: 278, h: 50 },
  { x: 302, h: 80 },
  { x: 326, h: 64 },
  { x: 350, h: 104 },
]

export default function AuditArt({ className }) {
  return (
    <ArtFrame className={className} title="Safety audit illustration" glowAt={[120, 150]}>
      {/* Clipboard */}
      <motion.g animate={{ rotate: [-2, 1, -2] }} style={{ originX: '160px', originY: '160px' }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <rect x="70" y="50" width="176" height="226" rx="14" fill="#7c4a24" />
        <rect x="82" y="70" width="152" height="196" rx="6" fill="#f8fafc" />
        <rect x="126" y="38" width="64" height="26" rx="7" fill="#94a3b8" />
        <circle cx="158" cy="44" r="5" fill="#475569" />
        {rows.map((y, i) => (
          <g key={y}>
            <rect x="96" y={y - 11} width="20" height="20" rx="5" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
            <motion.path
              d={`M99 ${y - 1} L105 ${y + 5} L114 ${y - 7}`}
              stroke={i === 2 ? '#f25c05' : '#16a34a'}
              strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"
              animate={{ pathLength: [0, 0, 1, 1] }}
              transition={{ duration: 5, repeat: Infinity, times: [0, 0.1 + i * 0.15, 0.22 + i * 0.15, 1] }}
            />
            <rect x="126" y={y - 7} width={i % 2 ? 70 : 92} height="6" rx="3" fill="#cbd5e1" />
            <rect x="126" y={y + 3} width="44" height="4" rx="2" fill="#e2e8f0" />
          </g>
        ))}
      </motion.g>

      {/* Bar chart */}
      <line x1="270" y1="232" x2="380" y2="232" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      {bars.map((b, i) => (
        <motion.rect
          key={b.x}
          x={b.x}
          y={232 - b.h}
          width="18"
          height={b.h}
          rx="4"
          fill={i === bars.length - 1 ? '#f25c05' : '#334155'}
          style={{ originY: 1 }}
          animate={{ scaleY: [0.2, 1, 1, 0.2] }}
          transition={{ duration: 4, delay: i * 0.15, repeat: Infinity, times: [0, 0.3, 0.85, 1] }}
        />
      ))}

      {/* Shield */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <g transform="translate(322 82)">
          <path d="M0 -34 L30 -22 V2 C30 22 15 34 0 40 C-15 34 -30 22 -30 2 V-22 Z" fill="#1d3f8f" />
          <path d="M0 -24 L20 -16 V2 C20 16 10 24 0 29 Z" fill="#ffffff" opacity="0.15" />
          <path d="M-12 2 L-3 11 L13 -7" stroke="#fbbf24" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </motion.g>
    </ArtFrame>
  )
}
