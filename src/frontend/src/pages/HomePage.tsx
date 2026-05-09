import { useNavigate } from 'react-router-dom'
import { LinkButton } from '@/components/common/Button'
import { PageSection } from '@/components/common/PageSection'
import { LoadingCard } from '@/components/feedback/LoadingCard'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useI18n } from '@/hooks/useI18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import { propertyService } from '@/services/propertyService'
import type { SearchFilters } from '@/types/models'
import { buildSearchParams } from '@/utils/queryString'

const stats = [
  { label: 'Properties listed', value: '128+' },
  { label: 'Qualified flippers', value: '54' },
  { label: 'Average response rate', value: '92%' },
]

export function HomePage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  usePageTitle('Home')

  const { data, loading } = useAsyncData(() => propertyService.getFeaturedProperties(), [])

  function handleSearch(filters: SearchFilters) {
    const query = buildSearchParams({ ...filters, page: 1 })
    void navigate(`/properties/search${query ? `?${query}` : ''}`)
  }

  return (
    <div className="space-y-16 pb-10">
      <section className="glass-panel overflow-hidden rounded-[2rem] border border-white/10 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Marketplace for value-add deals</p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {t('home.heroTitle')}
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">{t('home.heroText')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/properties/search">{t('home.heroPrimary')}</LinkButton>
              <LinkButton to="/register" variant="secondary">
                {t('home.heroSecondary')}
              </LinkButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-slate-950 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Deal flow</p>
              <p className="mt-3 text-lg text-white">Search by city, condition, property type, and price to surface the right opportunity fast.</p>
            </div>
            <PropertyFilters compact initialValues={{ page: 1 }} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <PageSection
        description={t('home.featuredText')}
        eyebrow="Featured"
        title={t('home.featuredTitle')}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <LoadingCard key={index} />)
            : data?.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
      </PageSection>

      <PageSection
        description="Flexible profiles, role-aware dashboards, and listing workflows designed for off-market inventory."
        eyebrow="Marketplace workflow"
        title={t('home.statsTitle')}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Owners list faster',
              body: 'Publish pricing, condition notes, and image galleries in a guided two-step form.',
            },
            {
              title: 'Flippers compare faster',
              body: 'Use filters, detailed owner cards, and polished listing pages to evaluate each opportunity.',
            },
            {
              title: 'Enquiries stay focused',
              body: 'Send deal-specific messages with contact preferences directly from the property detail page.',
            },
          ].map((item) => (
            <article key={item.title} className="glass-panel rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.body}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <section className="glass-panel rounded-[2rem] border border-cyan-400/20 bg-gradient-to-r from-cyan-400/12 to-indigo-500/10 px-6 py-10 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Next steps</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{t('home.ctaTitle')}</h2>
            <p className="mt-4 text-slate-200">{t('home.ctaText')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/register">Join as owner</LinkButton>
            <LinkButton to="/register" variant="secondary">
              Join as flipper
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  )
}
