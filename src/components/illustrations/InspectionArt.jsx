import { motion } from 'framer-motion'
import ArtFrame from './ArtFrame'

const mastRungs = Array.from({ length: 9 }, (_, i) => 70 + i * 20)
const jibRungs = Array.from({ length: 13 }, (_, i) => 100 + i * 20)

export default function InspectionArt({ className }) {
  return (
    <ArtFrame className={className} title="Lifting equipment inspection illustration" glowAt={[250, 120]}>
      {/* Crane mast */}
      <rect x="80" y="62" width="4" height="190" fill="#fbbf24" />
      <rect x="104" y="62" width="4" height="190" fill="#fbbf24" />
      {mastRungs.map((y) => (
        <path key={y} d={`M82 ${y} L106 ${y + 20} M106 ${y} L82 ${y + 20}`} stroke="#fbbf24" strokeWidth="2" />
      ))}
      {/* Jib */}
      <rect x="44" y="52" width="320" height="4" fill="#fbbf24" />
      <rect x="94" y="70" width="270" height="4" fill="#fbbf24" />
      {jibRungs.map((x) => (
        <path key={x} d={`M${x} 56 L${x + 20} 70`} stroke="#fbbf24" strokeWidth="2" />
      ))}
      <path d="M94 52 L94 24 L364 54" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
      <rect x="40" y="56" width="34" height="26" rx="3" fill="#475569" />
      <rect x="86" y="74" width="26" height="22" rx="4" fill="#f25c05" />
      <rect x="92" y="79" width="14" height="9" rx="2" fill="#bae6fd" />

      {/* Trolley + swinging hook and load */}
      <rect x="236" y="72" width="28" height="10" rx="3" fill="#94a3b8" />
      <motion.g
        style={{ originX: '250px', originY: '82px' }}
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="250" y1="82" x2="250" y2="168" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M250 168 v10 a8 8 0 1 1 -8 8" stroke="#e2e8f0" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M242 190 L222 206 M242 190 L278 206" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="214" y="206" width="72" height="44" rx="4" fill="#f25c05" />
        <rect x="214" y="206" width="72" height="44" rx="4" fill="none" stroke="#b33a04" strokeWidth="3" />
        <text x="250" y="233" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="Sora, sans-serif">SWL 5T</text>
      </motion.g>

      {/* Magnifier */}
      <motion.g
        animate={{ x: [0, -20, 0], y: [0, 14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="352" y1="190" x2="380" y2="220" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
        <circle cx="332" cy="168" r="30" fill="#ffffff" fillOpacity="0.12" stroke="#f8fafc" strokeWidth="6" />
        <motion.path
          d="M320 168 L329 177 L345 159"
          stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
        />
      </motion.g>
    </ArtFrame>
  )
}
