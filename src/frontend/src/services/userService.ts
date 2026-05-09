import { apiClient, shouldUseMockFallback } from '@/services/apiClient'
import { type BackendUser, unwrapUserResponse } from '@/services/apiAdapters'
import { mockBackend } from '@/services/mockBackend'
import type { FlipperProfile, OwnerProfile, UpdateProfilePayload, User } from '@/types/models'

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

export const userService = {
  getUser: (id: string) =>
    withFallback<User>(() => apiClient.get<{ user: BackendUser }>(`/users/${id}`).then(unwrapUserResponse), () => mockBackend.getUser(id)),
  getFlipper: (id: string) =>
    withFallback<FlipperProfile>(
      () => apiClient.get<{ user: BackendUser }>(`/flippers/${id}`).then((response) => unwrapUserResponse(response) as FlipperProfile),
      () => mockBackend.getFlipper(id),
    ),
  getOwner: (id: string) =>
    withFallback<OwnerProfile>(
      () => apiClient.get<{ user: BackendUser }>(`/owners/${id}`).then((response) => unwrapUserResponse(response) as OwnerProfile),
      () => mockBackend.getOwner(id),
    ),
  updateUser: (id: string, payload: UpdateProfilePayload) =>
    withFallback<User>(
      () => apiClient.put<{ user: BackendUser }>(`/users/${id}`, payload).then(unwrapUserResponse),
      () => mockBackend.updateUser(id, payload),
    ),
}
