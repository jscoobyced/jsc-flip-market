import { useMemo, useState } from 'react'
import { Button } from '@/components/common/Button'
import { FormField } from '@/components/common/FormField'
import { propertyService } from '@/services/propertyService'
import type { SearchFilters } from '@/types/models'
import { useI18n } from '@/hooks/useI18n'

interface PropertyFiltersProps {
  initialValues?: SearchFilters
  compact?: boolean
  onSearch: (filters: SearchFilters) => void
}

export function PropertyFilters({ initialValues, compact = false, onSearch }: PropertyFiltersProps) {
  const { t } = useI18n()
  const [form, setForm] = useState<SearchFilters>({ ...initialValues })
  const propertyTypes = useMemo(() => propertyService.propertyTypes, [])
  const conditions = useMemo(() => propertyService.conditions, [])

  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const gridClass = compact ? 'grid gap-4 lg:grid-cols-6' : 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'

  return (
    <form
      className={`glass-panel rounded-3xl p-5 sm:p-6 ${compact ? '' : ''}`.trim()}
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(form)
      }}
    >
      <div className={gridClass}>
        <FormField label="Keyword">
          <input
            className="form-control"
            onChange={(event) => update('query', event.target.value)}
            placeholder="City, asset, or opportunity"
            value={form.query ?? ''}
          />
        </FormField>
        <FormField label="City">
          <input className="form-control" onChange={(event) => update('city', event.target.value)} value={form.city ?? ''} />
        </FormField>
        <FormField label="State">
          <input className="form-control" onChange={(event) => update('state', event.target.value)} value={form.state ?? ''} />
        </FormField>
        <FormField label="Property type">
          <select className="form-control" onChange={(event) => update('propertyType', event.target.value as SearchFilters['propertyType'])} value={form.propertyType ?? ''}>
            <option value="">Any type</option>
            {propertyTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Condition">
          <select className="form-control" onChange={(event) => update('condition', event.target.value as SearchFilters['condition'])} value={form.condition ?? ''}>
            <option value="">Any condition</option>
            {conditions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Min price">
          <input
            className="form-control"
            min={0}
            onChange={(event) => update('minPrice', event.target.value ? Number(event.target.value) : undefined)}
            type="number"
            value={form.minPrice ?? ''}
          />
        </FormField>
        <FormField label="Max price">
          <input
            className="form-control"
            min={0}
            onChange={(event) => update('maxPrice', event.target.value ? Number(event.target.value) : undefined)}
            type="number"
            value={form.maxPrice ?? ''}
          />
        </FormField>
        <div className="flex items-end">
          <Button className="w-full" type="submit">
            {t('common.search')}
          </Button>
        </div>
      </div>
    </form>
  )
}
