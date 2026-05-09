import { Link } from 'react-router-dom'
import type { Property } from '@/types/models'
import { formatCurrency, formatNumber } from '@/utils/formatters'

interface PropertyCardProps {
  property: Property
  layout?: 'grid' | 'list'
  showOwnerLink?: boolean
  editable?: boolean
}

export function PropertyCard({ property, layout = 'grid', showOwnerLink = true, editable = false }: PropertyCardProps) {
  const listLayout = layout === 'list'

  return (
    <article className={`glass-panel overflow-hidden rounded-3xl ${listLayout ? 'grid gap-5 md:grid-cols-[320px_1fr]' : ''}`}>
      <div className={`relative ${listLayout ? 'h-full min-h-64' : 'h-60'}`}>
        <img alt={property.title} className="h-full w-full object-cover" loading="lazy" src={property.images[0]} />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          {property.propertyType}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">
              {property.location.city}, {property.location.state}
            </p>
            <Link className="mt-1 block text-2xl font-semibold text-white transition hover:text-cyan-300" to={`/properties/${property.id}`}>
              {property.title}
            </Link>
          </div>
          <p className="text-xl font-semibold text-cyan-300">{formatCurrency(property.askingPrice)}</p>
        </div>
        <p className="line-clamp-3 text-sm text-slate-300">{property.description}</p>
        <dl className="grid grid-cols-2 gap-4 text-sm text-slate-300 sm:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Condition</dt>
            <dd className="mt-1 font-medium text-white">{property.condition}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Sq ft</dt>
            <dd className="mt-1 font-medium text-white">{formatNumber(property.squareFootage)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Year built</dt>
            <dd className="mt-1 font-medium text-white">{property.yearBuilt}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</dt>
            <dd className="mt-1 font-medium text-white">{property.status}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          <Link className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200" to={`/properties/${property.id}`}>
            View property →
          </Link>
          {showOwnerLink ? (
            <Link className="text-sm text-slate-300 transition hover:text-white" to={`/owners/${property.ownerId}`}>
              Meet the owner
            </Link>
          ) : null}
          {editable ? (
            <Link className="text-sm text-slate-300 transition hover:text-white" to={`/properties/${property.id}/edit`}>
              Edit listing
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}
