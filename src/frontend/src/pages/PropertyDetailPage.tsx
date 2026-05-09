import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Button, LinkButton } from '@/components/common/Button'
import { FormField } from '@/components/common/FormField'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { LoadingCard } from '@/components/feedback/LoadingCard'
import { PropertyGallery } from '@/components/property/PropertyGallery'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import { enquiryService } from '@/services/enquiryService'
import { propertyService } from '@/services/propertyService'
import { userService } from '@/services/userService'
import { formatCurrency, formatDate, formatNumber } from '@/utils/formatters'

export function PropertyDetailPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const { t } = useI18n()
  const [enquiry, setEnquiry] = useState({ message: '', contactInfo: user?.email ?? user?.phone ?? '' })
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>((location.state as { message?: string } | null)?.message ?? null)
  const propertyQuery = useAsyncData(() => propertyService.getProperty(id), [id])
  const ownerQuery = useAsyncData(
    () => (propertyQuery.data ? userService.getOwner(propertyQuery.data.ownerId) : Promise.resolve(null)),
    [propertyQuery.data?.ownerId ?? ''],
  )
  usePageTitle('Property details')

  if (propertyQuery.loading) {
    return <LoadingCard className="h-[520px]" />
  }

  if (!propertyQuery.data || propertyQuery.error) {
    return <InlineNotice message={propertyQuery.error ?? 'Unable to load property'} tone="error" />
  }

  const property = propertyQuery.data
  const canEnquire = user?.role === 'FLIPPER'
  const isOwner = user?.id === property.ownerId

  return (
    <div className="space-y-8">
      {notice ? <InlineNotice message={notice} tone="success" /> : null}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="space-y-6">
          <PropertyGallery images={property.images} title={property.title} />
          <section className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">{property.location.city}, {property.location.state}</p>
                <h1 className="mt-2 text-4xl font-semibold text-white">{property.title}</h1>
              </div>
              <p className="text-3xl font-semibold text-cyan-300">{formatCurrency(property.askingPrice)}</p>
            </div>
            <p className="mt-5 text-slate-300">{property.description}</p>
            <dl className="mt-8 grid gap-4 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Property type" value={property.propertyType} />
              <Stat label="Condition" value={property.condition} />
              <Stat label="Square footage" value={formatNumber(property.squareFootage)} />
              <Stat label="Year built" value={String(property.yearBuilt)} />
              <Stat label="Status" value={property.status} />
              <Stat label="Address" value={property.location.address} />
              <Stat label="ZIP" value={property.location.zip} />
              <Stat label="Listed" value={formatDate(property.createdAt)} />
            </dl>
            {isOwner ? (
              <div className="mt-8">
                <LinkButton to={`/properties/${property.id}/edit`} variant="secondary">
                  Edit this listing
                </LinkButton>
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">{t('property.ownerDetails')}</h2>
            {ownerQuery.loading ? (
              <p className="mt-4 text-sm text-slate-400">Loading owner details…</p>
            ) : ownerQuery.data ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-4">
                  <img alt={ownerQuery.data.name} className="h-16 w-16 rounded-2xl object-cover" src={ownerQuery.data.profilePicture} />
                  <div>
                    <p className="text-lg font-semibold text-white">{ownerQuery.data.name}</p>
                    <p className="text-sm text-slate-400">{ownerQuery.data.companyName ?? 'Independent owner'}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">{ownerQuery.data.bio}</p>
                <p className="text-sm text-slate-300">Email: {ownerQuery.data.email}</p>
                <p className="text-sm text-slate-300">Phone: {ownerQuery.data.phone}</p>
                <LinkButton to={`/owners/${ownerQuery.data.id}`} variant="secondary">
                  View owner profile
                </LinkButton>
              </div>
            ) : (
              <InlineNotice message={ownerQuery.error ?? 'Owner details unavailable'} tone="error" />
            )}
          </section>

          <section className="glass-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">{t('property.enquire')}</h2>
            <p className="mt-3 text-sm text-slate-300">{t('property.enquireHelp')}</p>
            {!canEnquire ? (
              <div className="mt-5 space-y-3">
                <InlineNotice message="Log in as a flipper to send an enquiry." />
                <LinkButton to="/login">Log in</LinkButton>
              </div>
            ) : (
              <form
                className="mt-5 space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault()
                  setSubmitting(true)
                  setNotice(null)
                  try {
                    await enquiryService.createEnquiry({
                      propertyId: property.id,
                      flipperId: user.id,
                      message: enquiry.message,
                      contactInfo: enquiry.contactInfo,
                    })
                    setNotice('Enquiry sent successfully. The owner has been notified.')
                    setEnquiry((current) => ({ ...current, message: '' }))
                  } catch (reason) {
                    setNotice(reason instanceof Error ? reason.message : 'Unable to send enquiry')
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                <FormField label="Contact details">
                  <input className="form-control" onChange={(event) => setEnquiry((current) => ({ ...current, contactInfo: event.target.value }))} value={enquiry.contactInfo} />
                </FormField>
                <FormField label="Message">
                  <textarea className="form-control min-h-36" onChange={(event) => setEnquiry((current) => ({ ...current, message: event.target.value }))} value={enquiry.message} />
                </FormField>
                <Button disabled={submitting || !enquiry.message.trim()} type="submit">
                  {submitting ? 'Sending…' : 'Send enquiry'}
                </Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-white">{value}</dd>
    </div>
  )
}
