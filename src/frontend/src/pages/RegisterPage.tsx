import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { FormField } from '@/components/common/FormField'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { UserRole } from '@/types/models'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { t } = useI18n()
  usePageTitle('Register')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    role: 'OWNER' as UserRole,
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bio: '',
    companyName: '',
    taxId: '',
    specializations: 'single-family, multi-family',
  })

  const helperCopy = useMemo(
    () =>
      form.role === 'OWNER'
        ? 'Highlight the types of properties you are ready to list and how buyers can reach you.'
        : 'Share your buying criteria and rehab strengths so owners understand your fit.',
    [form.role],
  )

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Marketplace onboarding</p>
        <h1 className="text-4xl font-semibold text-white">{t('auth.registerTitle')}</h1>
        <p className="text-slate-300">{t('auth.registerSubtitle')}</p>
      </div>
      <form
        className="glass-panel rounded-3xl p-6 sm:p-8"
        onSubmit={async (event) => {
          event.preventDefault()
          setError(null)
          if (form.password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
          }
          if (form.password !== form.confirmPassword) {
            setError('Password confirmation does not match.')
            return
          }

          setLoading(true)
          try {
            const user = await register({
              role: form.role,
              name: form.name,
              email: form.email,
              phone: form.phone,
              password: form.password,
              bio: form.bio,
              companyName: form.role === 'OWNER' ? form.companyName : undefined,
              taxId: form.role === 'OWNER' ? form.taxId : undefined,
              specializations:
                form.role === 'FLIPPER'
                  ? form.specializations
                      .split(',')
                      .map((entry) => entry.trim())
                      .filter(Boolean)
                  : undefined,
            })
            void navigate(user.role === 'OWNER' ? `/owners/${user.id}/listings` : `/flippers/${user.id}`)
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Unable to create account')
          } finally {
            setLoading(false)
          }
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {error ? (
            <div className="md:col-span-2">
              <InlineNotice message={error} tone="error" />
            </div>
          ) : null}
          <FormField label={t('auth.role')}>
            <select className="form-control" onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserRole }))} value={form.role}>
              <option value="OWNER">{t('auth.owner')}</option>
              <option value="FLIPPER">{t('auth.flipper')}</option>
            </select>
          </FormField>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
            {helperCopy}
          </div>
          <FormField label={t('auth.name')}>
            <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
          </FormField>
          <FormField label={t('auth.phone')}>
            <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} value={form.phone} />
          </FormField>
          <FormField label={t('auth.email')}>
            <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" value={form.email} />
          </FormField>
          <FormField label={t('auth.password')}>
            <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" value={form.password} />
          </FormField>
          <FormField label={t('auth.confirmPassword')}>
            <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} type="password" value={form.confirmPassword} />
          </FormField>
          {form.role === 'OWNER' ? (
            <>
              <FormField label={t('auth.companyName')}>
                <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} value={form.companyName} />
              </FormField>
              <FormField label={t('auth.taxId')}>
                <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, taxId: event.target.value }))} value={form.taxId} />
              </FormField>
            </>
          ) : (
            <div className="md:col-span-2">
              <FormField hint="Comma separated values" label={t('auth.specializations')}>
                <input className="form-control" onChange={(event) => setForm((current) => ({ ...current, specializations: event.target.value }))} value={form.specializations} />
              </FormField>
            </div>
          )}
          <div className="md:col-span-2">
            <FormField label={t('auth.bio')}>
              <textarea className="form-control min-h-32" onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} value={form.bio} />
            </FormField>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-300">
            Already registered?{' '}
            <Link className="font-semibold text-cyan-300" to="/login">
              {t('nav.login')}
            </Link>
          </p>
          <Button disabled={loading} type="submit">
            {loading ? 'Creating account…' : t('auth.submitRegister')}
          </Button>
        </div>
      </form>
    </div>
  )
}
