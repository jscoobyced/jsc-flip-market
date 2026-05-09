import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { PageSection } from '@/components/common/PageSection'
import { EmptyState } from '@/components/feedback/EmptyState'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { LoadingCard } from '@/components/feedback/LoadingCard'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useI18n } from '@/hooks/useI18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import { propertyService } from '@/services/propertyService'
import type { SearchFilters } from '@/types/models'
import { buildSearchParams, parseSearchFilters } from '@/utils/queryString'

export function SearchResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const filters = useMemo(() => ({ page: 1, pageSize: 6, ...parseSearchFilters(location.search) }), [location.search])
  const { data, loading, error } = useAsyncData(() => propertyService.searchProperties(filters), [location.search])
  usePageTitle('Search properties')

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  function updateSearch(nextFilters: SearchFilters) {
    const query = buildSearchParams({ ...nextFilters, page: 1, pageSize: filters.pageSize ?? 6 })
    void navigate(`/properties/search${query ? `?${query}` : ''}`)
  }

  return (
    <div className="space-y-8">
      <PageSection description={t('search.subtitle')} eyebrow="Discovery" title={t('search.title')}>
        <PropertyFilters initialValues={filters} onSearch={updateSearch} />
      </PageSection>

      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 px-5 py-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {data?.total ?? 0} {t('search.results')}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => setLayout('grid')} variant={layout === 'grid' ? 'primary' : 'secondary'}>
            {t('search.grid')}
          </Button>
          <Button onClick={() => setLayout('list')} variant={layout === 'list' ? 'primary' : 'secondary'}>
            {t('search.list')}
          </Button>
        </div>
      </div>

      {error ? <InlineNotice message={error} tone="error" /> : null}
      {loading ? (
        <div className={`grid gap-6 ${layout === 'grid' ? 'lg:grid-cols-3' : ''}`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : data && data.items.length ? (
        <div className={layout === 'grid' ? 'grid gap-6 lg:grid-cols-3' : 'space-y-6'}>
          {data.items.map((property) => (
            <PropertyCard key={property.id} layout={layout} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState description={t('search.noResults')} title="No results" />
      )}

      <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 px-5 py-4 text-sm text-slate-300">
        <span>
          Page {filters.page ?? 1} of {totalPages}
        </span>
        <div className="flex gap-3">
          <button
            className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
            disabled={(filters.page ?? 1) === 1}
            onClick={() => updateSearch({ ...filters, page: (filters.page ?? 1) - 1 })}
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
            disabled={(filters.page ?? 1) >= totalPages}
            onClick={() => updateSearch({ ...filters, page: (filters.page ?? 1) + 1 })}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
