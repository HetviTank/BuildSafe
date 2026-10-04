import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, description, align = 'center', dark = false }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left'
  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        {eyebrow}
      </span>
      <h2 className={`mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${dark ? 'text-white' : ''}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </Reveal>
  )
}
