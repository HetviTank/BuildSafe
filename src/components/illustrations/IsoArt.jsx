import { motion } from 'framer-motion'
import ArtFrame from './ArtFrame'

const rows = [118, 150, 182]
const teeth = Array.from({ length: 12 }, (_, i) => i * 30)
const stars = [
  { x: 60, y: 60, d: 0 },
  { x: 345, y: 50, d: 0.8 },
  { x: 360, y: 150, d: 1.6 },
  { x: 48, y: 210, d: 2.2 },
]

export default function IsoArt({ className }) {
  return (
    <ArtFrame className={className} title="ISO certification illustration" glow="#1d3f8f" glowAt={[200, 150]}>
      {/* Certificate */}
      <g transform="rotate(-4 180 150)">
        <rect x="96" y="34" width="176" height="222" rx="10" fill="#f8fafc" />
        <rect x="96" y="34" width="176" height="46" rx="10" fill="#1d3f8f" />
        <rect x="96" y="66" width="176" height="14" fill="#1d3f8f" />
        <text x="184" y="64" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff" fontFamily="Sora, sans-serif">ISO 9001</text>
        {rows.map((y, i) => (
          <g key={y}>
            <rect x="114" y={y - 10} width="18" height="18" rx="4" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            <motion.path
              d={`M117 ${y - 1} L122 ${y + 4} L130 ${y - 6}`}
              stroke="#f25c05" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
              animate={{ pathLength: [0, 0, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.15 + i * 0.15, 0.3 + i * 0.15, 1] }}
            />
            <rect x="142" y={y - 6} width={i === 1 ? 70 : 96} height="6" rx="3" fill="#cbd5e1" />
          </g>
        ))}
        <rect x="114" y="214" width="60" height="4" rx="2" fill="#94a3b8" />
        <rect x="114" y="224" width="40" height="4" rx="2" fill="#cbd5e1" />
      </g>

      {/* Seal */}
      <g transform="translate(272 208)">
        <path d="M-18 24 L-30 66 L-12 56 L-4 74 L6 30 Z" fill="#b33a04" />
        <path d="M18 24 L30 66 L12 56 L4 74 L-6 30 Z" fill="#d94a00" />
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
          {teeth.map((a) => (
            <rect key={a} x="-7" y="-46" width="14" height="14" rx="3" fill="#f25c05" transform={`rotate(${a})`} />
          ))}
          <circle r="38" fill="#f25c05" />
        </motion.g>
        <circle r="28" fill="#fbbf24" />
        <circle r="28" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M-11 1 L-3 9 L12 -8" stroke="#0b1220" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {stars.map((s) => (
        <motion.path
          key={s.x}
          d={`M${s.x} ${s.y - 9} L${s.x + 3} ${s.y - 3} L${s.x + 9} ${s.y} L${s.x + 3} ${s.y + 3} L${s.x} ${s.y + 9} L${s.x - 3} ${s.y + 3} L${s.x - 9} ${s.y} L${s.x - 3} ${s.y - 3} Z`}
          fill="#fbbf24"
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.1, 0.7] }}
          transition={{ duration: 2.4, delay: s.d, repeat: Infinity }}
        />
      ))}
    </ArtFrame>
  )
}
