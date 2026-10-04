import { motion } from 'framer-motion'

const directions = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
}

/** Fades and slides its children in when scrolled into view. */
export default function Reveal({ children, direction = 'up', delay = 0, className = '', as = 'div' }) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
