import { apiClient } from '@/services/apiClient'
import {
  buildApiSearchParams,
  normalizePaginatedProperties,
  propertyFormToFormData,
  unwrapPropertyResponse,
  type BackendProperty,
  type PaginatedResult,
} from '@/services/apiAdapters'
import type { PropertyFormValues, SearchFilters } from '@/types/models'

export const propertyService = {
  listProperties: (filters: SearchFilters = {}) => {
    const query = buildApiSearchParams(filters)
    return apiClient
      .get<PaginatedResult<BackendProperty>>(`/properties${query ? `?${query}` : ''}`)
      .then(normalizePaginatedProperties)
  },
  searchProperties: (filters: SearchFilters = {}) => {
    const query = buildApiSearchParams(filters)
    return apiClient
      .get<PaginatedResult<BackendProperty>>(`/properties/search${query ? `?${query}` : ''}`)
      .then(normalizePaginatedProperties)
  },
  getFeaturedProperties: () =>
    apiClient
      .get<PaginatedResult<BackendProperty>>('/properties?status=active&limit=3')
      .then((response) => normalizePaginatedProperties(response).items),
  getProperty: (id: string) =>
    apiClient.get<{ property: BackendProperty }>(`/properties/${id}`).then(unwrapPropertyResponse),
  getOwnerListings: (ownerId: string, page = 1, pageSize = 6) =>
    apiClient
      .get<PaginatedResult<BackendProperty>>(`/properties/${ownerId}/owner-listings?page=${page}&limit=${pageSize}`)
      .then(normalizePaginatedProperties),
  createProperty: (payload: PropertyFormValues) =>
    apiClient.post<{ property: BackendProperty }>('/properties', propertyFormToFormData(null, payload)).then(unwrapPropertyResponse),
  updateProperty: (propertyId: string, payload: PropertyFormValues) =>
    apiClient
      .put<{ property: BackendProperty }>(`/properties/${propertyId}`, propertyFormToFormData(propertyId, payload))
      .then(unwrapPropertyResponse),
  propertyTypes: [
    { value: 'single-family', label: 'Single-family' },
    { value: 'multi-family', label: 'Multi-family' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
  ],
  conditions: [
    { value: 'poor', label: 'Poor' },
    { value: 'fair', label: 'Fair' },
    { value: 'needs-work', label: 'Needs work' },
    { value: 'good', label: 'Good bones' },
  ],
  statuses: [
    { value: 'active', label: 'Active' },
    { value: 'sold', label: 'Sold' },
    { value: 'archived', label: 'Archived' },
  ],
}
