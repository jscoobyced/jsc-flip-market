import type { SearchFilters } from '@/types/models'

export function buildSearchParams(filters: SearchFilters) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value))
    }
  })

  return params.toString()
}

export function parseSearchFilters(search: string): SearchFilters {
  const params = new URLSearchParams(search)
  const numberKeys = new Set(['minPrice', 'maxPrice', 'page', 'pageSize'])
  const filters: SearchFilters = {}

  params.forEach((value, key) => {
    if (numberKeys.has(key)) {
      const parsed = Number(value)
      if (!Number.isNaN(parsed)) {
        filters[key as keyof SearchFilters] = parsed as never
      }
      return
    }

    if (key === 'featured') {
      filters.featured = value === 'true'
      return
    }

    filters[key as keyof SearchFilters] = value as never
  })

  return filters
}
