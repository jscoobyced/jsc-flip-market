import { LinkButton } from '@/components/common/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Not found')

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">That page is out of bounds.</h1>
        <p className="mt-4 text-slate-300">The link may be outdated, or the property might have been removed.</p>
        <div className="mt-8 flex justify-center">
          <LinkButton to="/">Return home</LinkButton>
        </div>
      </div>
    </div>
  )
}
