import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { FormField } from '@/components/common/FormField'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { usePageTitle } from '@/hooks/usePageTitle'

export function LoginPage() {
  const { login } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ email: 'flipper@example.com', password: 'Password123!' })
  usePageTitle('Log in')

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Authentication</p>
        <h1 className="text-4xl font-semibold text-white">{t('auth.loginTitle')}</h1>
        <p className="text-slate-300">{t('auth.loginSubtitle')}</p>
      </div>
      <form
        className="glass-panel rounded-3xl p-6 sm:p-8"
        onSubmit={async (event) => {
          event.preventDefault()
          setLoading(true)
          setError(null)
          try {
            const user = await login(form)
            const nextPath = (location.state as { from?: string } | undefined)?.from
            void navigate(nextPath ?? (user.role === 'OWNER' ? `/owners/${user.id}/listings` : `/flippers/${user.id}`))
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Unable to sign in')
          } finally {
            setLoading(false)
          }
        }}
      >
        <div className="grid gap-5">
          {error ? <InlineNotice message={error} tone="error" /> : null}
          <FormField label={t('auth.email')}>
            <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" value={form.email} />
          </FormField>
          <FormField label={t('auth.password')}>
            <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" value={form.password} />
          </FormField>
          <Button disabled={loading} type="submit">
            {loading ? 'Signing in…' : t('auth.submitLogin')}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-slate-300">
        Need an account?{' '}
        <Link className="font-semibold text-cyan-300" to="/register">
          {t('nav.register')}
        </Link>
      </p>
    </div>
  )
}
