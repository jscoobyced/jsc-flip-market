import type { PropsWithChildren, ReactNode } from 'react'

interface PageSectionProps extends PropsWithChildren {
  eyebrow?: string
  title: string
  description?: string
  aside?: ReactNode
  className?: string
}

export function PageSection({ eyebrow, title, description, aside, className = '', children }: PageSectionProps) {
  return (
    <section className={`space-y-6 ${className}`.trim()}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p> : null}
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
            {description ? <p className="mt-3 text-base text-slate-300">{description}</p> : null}
          </div>
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}
