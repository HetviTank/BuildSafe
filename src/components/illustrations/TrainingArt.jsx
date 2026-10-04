import { motion } from 'framer-motion'
import ArtFrame from './ArtFrame'

const audience = [
  { x: 92, hat: '#f25c05', d: 0 },
  { x: 162, hat: '#f8fafc', d: 0.4 },
  { x: 232, hat: '#fbbf24', d: 0.8 },
]

function Person({ x, hat, delay }) {
  return (
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.2, delay, repeat: Infinity, ease: 'easeInOut' }}>
      <path d={`M${x - 30} 300 C${x - 30} 262 ${x - 18} 250 ${x} 250 C${x + 18} 250 ${x + 30} 262 ${x + 30} 300 Z`} fill="#1d3f8f" />
      <circle cx={x} cy={232} r={16} fill="#c98b5f" />
      <path d={`M${x - 19} 228 A19 19 0 0 1 ${x + 19} 228 Z`} fill={hat} />
      <rect x={x - 22} y={226} width={44} height={5} rx={2.5} fill={hat} />
    </motion.g>
  )
}

export default function TrainingArt({ className }) {
  return (
    <ArtFrame className={className} title="Safety training illustration" glowAt={[160, 110]}>
      {/* Board */}
      <line x1="90" y1="180" x2="76" y2="250" stroke="#475569" strokeWidth="5" />
      <line x1="230" y1="180" x2="244" y2="250" stroke="#475569" strokeWidth="5" />
      <rect x="56" y="44" width="208" height="140" rx="10" fill="#f8fafc" />
      <rect x="72" y="60" width="92" height="10" rx="5" fill="#f25c05" />
      <rect x="72" y="76" width="60" height="6" rx="3" fill="#cbd5e1" />
      <motion.path
        d="M76 162 L114 132 L146 146 L186 104 L244 118"
        stroke="#1d3f8f" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        animate={{ pathLength: [0, 1, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.5, 1] }}
      />
      {[[114, 132], [146, 146], [186, 104]].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={5} fill="#f25c05" />
      ))}
      <g transform="translate(210 64)">
        <rect width="40" height="30" rx="6" fill="#fff4ec" stroke="#f25c05" strokeWidth="2" />
        <path d="M10 15 L17 22 L30 9" stroke="#f25c05" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Instructor */}
      <g>
        <rect x="292" y="140" width="46" height="112" rx="18" fill="#f25c05" />
        <rect x="300" y="160" width="30" height="5" fill="#fde68a" />
        <rect x="300" y="196" width="30" height="5" fill="#fde68a" />
        <motion.line
          x1="298" y1="160" x2="262" y2="128"
          stroke="#f25c05" strokeWidth="11" strokeLinecap="round"
          style={{ originX: '298px', originY: '160px' }}
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="315" cy="118" r="19" fill="#c98b5f" />
        <path d="M293 113 A22 22 0 0 1 337 113 Z" fill="#f8fafc" />
        <rect x="289" y="110" width="52" height="6" rx="3" fill="#f8fafc" />
      </g>

      {audience.map((p) => (
        <Person key={p.x} x={p.x} hat={p.hat} delay={p.d} />
      ))}

      {/* Speech bubble */}
      <motion.g
        animate={{ scale: [0.9, 1, 0.9], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ originX: '355px', originY: '78px' }}
      >
        <rect x="334" y="58" width="44" height="32" rx="10" fill="#fbbf24" />
        <path d="M344 88 L338 100 L354 88 Z" fill="#fbbf24" />
        <text x="356" y="80" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0b1220" fontFamily="Sora, sans-serif">!</text>
      </motion.g>
    </ArtFrame>
  )
}
