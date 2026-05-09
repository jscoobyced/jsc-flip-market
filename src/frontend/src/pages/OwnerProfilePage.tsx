import { useState } from 'react'
import { LinkButton } from '@/components/common/Button'
import { FormField } from '@/components/common/FormField'
import { PageSection } from '@/components/common/PageSection'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { LoadingCard } from '@/components/feedback/LoadingCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { userService } from '@/services/userService'
import type { OwnerProfile } from '@/types/models'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/common/Button'

export function OwnerProfilePage() {
  const { id = '' } = useParams()
  const { user, updateUser } = useAuth()
  const { data, loading, error, refetch } = useAsyncData(() => userService.getOwner(id), [id])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  usePageTitle('Owner profile')

  if (loading) {
    return <LoadingCard className="h-[420px]" />
  }

  if (error || !data) {
    return <InlineNotice message={error ?? 'Unable to load owner profile'} tone="error" />
  }

  const isOwnProfile = user?.id === data.id

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <img alt={data.name} className="h-28 w-28 rounded-3xl object-cover" src={data.profilePicture} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Owner profile</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">{data.name}</h1>
              <p className="mt-3 max-w-2xl text-slate-300">{data.bio}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {isOwnProfile ? <LinkButton to="/dashboard">View dashboard</LinkButton> : null}
            <LinkButton to={`/owners/${data.id}/listings`} variant="secondary">
              View listings
            </LinkButton>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <PageSection title="Company overview" description={data.bio}>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard label="Company name" value={data.companyName ?? 'Independent owner'} />
            <InfoCard label="Tax ID" value={data.taxId ?? 'Provided on request'} />
            <InfoCard label="Email" value={data.email} />
            <InfoCard label="Phone" value={data.phone} />
          </div>
        </PageSection>
        {isOwnProfile ? (
          <OwnerEditor
            message={message}
            onSave={async (payload) => {
              setSaving(true)
              setMessage(null)
              try {
                await updateUser(payload)
                setMessage('Profile updated successfully.')
                refetch()
              } finally {
                setSaving(false)
              }
            }}
            owner={data}
            saving={saving}
          />
        ) : null}
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function OwnerEditor({
  owner,
  onSave,
  saving,
  message,
}: {
  owner: OwnerProfile
  onSave: (payload: { name: string; phone: string; bio: string; companyName: string; taxId: string }) => Promise<void>
  saving: boolean
  message: string | null
}) {
  const [name, setName] = useState(owner.name)
  const [phone, setPhone] = useState(owner.phone)
  const [bio, setBio] = useState(owner.bio)
  const [companyName, setCompanyName] = useState(owner.companyName ?? '')
  const [taxId, setTaxId] = useState(owner.taxId ?? '')

  return (
    <form
      className="glass-panel rounded-3xl p-6"
      onSubmit={(event) => {
        event.preventDefault()
        void onSave({ name, phone, bio, companyName, taxId })
      }}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Edit your owner profile</h3>
        {message ? <InlineNotice message={message} tone="success" /> : null}
        <FormField label="Name">
          <input className="form-control" onChange={(event) => setName(event.target.value)} value={name} />
        </FormField>
        <FormField label="Phone">
          <input className="form-control" onChange={(event) => setPhone(event.target.value)} value={phone} />
        </FormField>
        <FormField label="Company name">
          <input className="form-control" onChange={(event) => setCompanyName(event.target.value)} value={companyName} />
        </FormField>
        <FormField label="Tax ID">
          <input className="form-control" onChange={(event) => setTaxId(event.target.value)} value={taxId} />
        </FormField>
        <FormField label="Bio">
          <textarea className="form-control min-h-28" onChange={(event) => setBio(event.target.value)} value={bio} />
        </FormField>
        <Button disabled={saving} type="submit">
          {saving ? 'Saving…' : 'Save profile'}
        </Button>
      </div>
    </form>
  )
}
