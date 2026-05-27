import { apiClient } from '@/services/apiClient'
import { unwrapUserResponse, type BackendUser } from '@/services/apiAdapters'
import type { FlipperProfile, OwnerProfile, UpdateProfilePayload } from '@/types/models'

export const userService = {
  getUser: (id: string) =>
    apiClient.get<{ user: BackendUser }>(`/users/${id}`).then(unwrapUserResponse),
  getFlipper: (id: string) =>
    apiClient.get<{ user: BackendUser }>(`/flippers/${id}`).then((response) => unwrapUserResponse(response) as FlipperProfile),
  getOwner: (id: string) =>
    apiClient.get<{ user: BackendUser }>(`/owners/${id}`).then((response) => unwrapUserResponse(response) as OwnerProfile),
  updateUser: (id: string, payload: UpdateProfilePayload) =>
    apiClient.put<{ user: BackendUser }>(`/users/${id}`, payload).then(unwrapUserResponse),
}
