import { useNavigate } from 'react-router-dom'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { PropertyForm } from '@/components/property/PropertyForm'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import { propertyService } from '@/services/propertyService'

export function PropertyCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useI18n()
  usePageTitle('Create property')

  if (!user || user.role !== 'OWNER') {
    return <InlineNotice message={t('property.ownerOnly')} tone="error" />
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">New listing</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Create a property listing</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Share the condition, pricing, and images flippers need to evaluate the opportunity.</p>
      </div>
      <PropertyForm
        onSubmit={async (values) => {
          const property = await propertyService.createProperty(values)
          void navigate(`/properties/${property.id}`, { state: { message: t('property.created') } })
        }}
        submitLabel="Publish listing"
      />
    </div>
  )
}
