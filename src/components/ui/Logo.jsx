import logo from '../../assets/images/brand/logo.webp'
import { company } from '../../data/company'

export default function Logo({ className = 'h-12 w-12' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ${className}`}>
      <img src={logo} alt={`${company.name} logo`} className="h-full w-full object-contain" />
    </span>
  )
}
