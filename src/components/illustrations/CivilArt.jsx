import { motion } from 'framer-motion'
import ArtFrame from './ArtFrame'

const floors = Array.from({ length: 6 }, (_, i) => 222 - i * 30)
const windows = [128, 156, 184, 212]

export default function CivilArt({ className }) {
  return (
    <ArtFrame className={className} title="Civil engineering illustration" glow="#fbbf24" glowAt={[330, 60]}>
      {/* Sun */}
      <motion.circle
        cx="330" cy="62" r="22" fill="#fbbf24"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Building rising floor by floor */}
      {floors.map((y, i) => (
        <motion.g
          key={y}
          animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, 0] }}
          transition={{ duration: 7, repeat: Infinity, times: [0, 0.08 + i * 0.07, 0.9, 1], delay: 0 }}
        >
          <rect x="112" y={y} width="130" height="30" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {windows.map((x, j) => (
            <rect key={x} x={x} y={y + 8} width="18" height="14" rx="2" fill={(i + j) % 3 === 0 ? '#fbbf24' : '#475569'} />
          ))}
        </motion.g>
      ))}
      <path d="M112 72 V42 M242 72 V42 M112 52 H242 M112 42 L242 72 M242 42 L112 72" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" />

      {/* Tower crane */}
      <rect x="292" y="70" width="5" height="182" fill="#f25c05" />
      <rect x="306" y="70" width="5" height="182" fill="#f25c05" />
      {Array.from({ length: 8 }, (_, i) => 80 + i * 22).map((y) => (
        <path key={y} d={`M294 ${y} L309 ${y + 22}`} stroke="#f25c05" strokeWidth="2" />
      ))}
      <rect x="170" y="64" width="190" height="6" fill="#f25c05" />
      <path d="M300 64 L300 40 L180 66 M300 40 L356 66" stroke="#f25c05" strokeWidth="2" fill="none" />
      <rect x="338" y="70" width="22" height="18" fill="#475569" />
      <motion.g
        style={{ originX: '196px', originY: '70px' }}
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="196" y1="70" x2="196" y2="112" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="170" y="112" width="52" height="8" rx="2" fill="#94a3b8" />
      </motion.g>

      {/* Blueprint */}
      <g transform="rotate(-8 60 250)">
        <rect x="14" y="214" width="96" height="66" rx="4" fill="#1d3f8f" />
        <path d="M24 226 H100 M24 242 H100 M24 258 H100 M44 220 V276 M72 220 V276" stroke="#ffffff" strokeOpacity="0.2" />
        <motion.path
          d="M28 270 V232 H64 V252 H96 V270 Z"
          stroke="#ffffff" strokeWidth="2.5" fill="none"
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
        />
      </g>

      {/* Hard hat on the ground */}
      <path d="M318 252 A26 22 0 0 1 370 252 Z" fill="#f8fafc" />
      <rect x="310" y="249" width="68" height="7" rx="3.5" fill="#f8fafc" />
      <rect x="341" y="232" width="6" height="18" rx="3" fill="#cbd5e1" />
    </ArtFrame>
  )
}
