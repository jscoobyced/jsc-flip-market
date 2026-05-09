import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LinkButton } from '@/components/common/Button'
import { PageSection } from '@/components/common/PageSection'
import { EmptyState } from '@/components/feedback/EmptyState'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { LoadingCard } from '@/components/feedback/LoadingCard'
import { PropertyCard } from '@/components/property/PropertyCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { propertyService } from '@/services/propertyService'
import { userService } from '@/services/userService'

export function OwnerListingsPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const ownerQuery = useAsyncData(() => userService.getOwner(id), [id])
  const listingsQuery = useAsyncData(() => propertyService.getOwnerListings(id, page, 6), [id, page])
  usePageTitle('Owner listings')

  const isOwn = user?.id === id && user.role === 'OWNER'
  const totalPages = useMemo(() => {
    if (!listingsQuery.data) {
      return 1
    }
    return Math.max(1, Math.ceil(listingsQuery.data.total / listingsQuery.data.pageSize))
  }, [listingsQuery.data])

  if (ownerQuery.loading || listingsQuery.loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  if (!ownerQuery.data || ownerQuery.error || listingsQuery.error) {
    return <InlineNotice message={ownerQuery.error ?? listingsQuery.error ?? 'Unable to load listings'} tone="error" />
  }

  const listings = listingsQuery.data

  if (!listings) {
    return <InlineNotice message="Unable to load listings" tone="error" />
  }

  return (
    <div className="space-y-8">
      <PageSection
        aside={
          isOwn ? (
            <LinkButton to="/properties/new">Create new listing</LinkButton>
          ) : undefined
        }
        description={`Browse active listings for ${ownerQuery.data.name}.`}
        eyebrow="Owner inventory"
        title={`${ownerQuery.data.name}'s listings`}
      >
        {listings.items.length ? (
          <div className="space-y-5">
            {listings.items.map((property) => (
              <PropertyCard key={property.id} editable={isOwn} layout="list" property={property} showOwnerLink={false} />
            ))}
          </div>
        ) : (
          <EmptyState description="Create the first property to start attracting enquiries." title="No listings yet" />
        )}
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 px-5 py-4 text-sm text-slate-300">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-3">
            <button className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50" disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button">
              Previous
            </button>
            <button className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} type="button">
              Next
            </button>
          </div>
        </div>
      </PageSection>
    </div>
  )
}
