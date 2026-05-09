import { apiClient, shouldUseMockFallback } from '@/services/apiClient'
import {
  buildApiSearchParams,
  type BackendProperty,
  normalizePaginatedProperties,
  propertyFormToFormData,
  unwrapPropertyResponse,
} from '@/services/apiAdapters'
import { mockBackend } from '@/services/mockBackend'
import type { PaginatedResult } from '@/types/api'
import type { Property, PropertyFormValues, SearchFilters } from '@/types/models'

async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  try {
    return await primary()
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return fallback()
    }
    throw error
  }
}

export const propertyService = {
  listProperties: (filters: SearchFilters = {}) => {
    const query = buildApiSearchParams(filters)
    return withFallback<PaginatedResult<Property>>(
      () =>
        apiClient
          .get<PaginatedResult<BackendProperty>>(`/properties${query ? `?${query}` : ''}`)
          .then(normalizePaginatedProperties),
      () => mockBackend.listProperties(filters),
    )
  },
  searchProperties: (filters: SearchFilters = {}) => {
    const query = buildApiSearchParams(filters)
    return withFallback<PaginatedResult<Property>>(
      () =>
        apiClient
          .get<PaginatedResult<BackendProperty>>(`/properties/search${query ? `?${query}` : ''}`)
          .then(normalizePaginatedProperties),
      () => mockBackend.searchProperties(filters),
    )
  },
  getFeaturedProperties: () =>
    withFallback<Property[]>(
      () =>
        apiClient
          .get<PaginatedResult<BackendProperty>>('/properties?status=active&limit=3')
          .then((response) => normalizePaginatedProperties(response).items),
      () => mockBackend.featuredProperties(),
    ),
  getProperty: (id: string) =>
    withFallback<Property>(
      () => apiClient.get<{ property: BackendProperty }>(`/properties/${id}`).then(unwrapPropertyResponse),
      () => mockBackend.getProperty(id),
    ),
  getOwnerListings: (ownerId: string, page = 1, pageSize = 6) =>
    withFallback<PaginatedResult<Property>>(
      () =>
        apiClient
          .get<PaginatedResult<BackendProperty>>(`/properties/${ownerId}/owner-listings?page=${page}&limit=${pageSize}`)
          .then(normalizePaginatedProperties),
      () => mockBackend.ownerListings(ownerId, page, pageSize),
    ),
  createProperty: (ownerId: string, payload: PropertyFormValues) =>
    withFallback<Property>(
      () => apiClient.post<{ property: BackendProperty }>('/properties', propertyFormToFormData(null, payload)).then(unwrapPropertyResponse),
      () => mockBackend.createProperty(ownerId, payload),
    ),
  updateProperty: (propertyId: string, ownerId: string, payload: PropertyFormValues) =>
    withFallback<Property>(
      () =>
        apiClient
          .put<{ property: BackendProperty }>(`/properties/${propertyId}`, propertyFormToFormData(propertyId, payload))
          .then(unwrapPropertyResponse),
      () => mockBackend.updateProperty(propertyId, ownerId, payload),
    ),
  propertyTypes: mockBackend.propertyTypes,
  conditions: mockBackend.conditions,
  statuses: mockBackend.statuses,
}
