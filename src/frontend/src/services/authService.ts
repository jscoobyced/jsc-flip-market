import { apiClient } from '@/services/apiClient'
import {
  normalizeAuthResponse,
  type BackendAuthEnvelope,
  type BackendUser,
  unwrapUserResponse,
} from '@/services/apiAdapters'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '@/types/models'
import { storage } from '@/utils/storage'

export const authService = {
  register: (payload: RegisterPayload) =>
    apiClient
      .post<BackendAuthEnvelope>('/auth/register', {
        ...payload,
        userType: payload.role,
        portfolioProjects: payload.specializations?.length ? 0 : undefined,
      })
      .then(normalizeAuthResponse),
  login: (payload: LoginPayload) =>
    apiClient.post<BackendAuthEnvelope>('/auth/login', payload).then(normalizeAuthResponse),
  refreshToken: () =>
    apiClient
      .post<{ tokens: { accessToken: string; refreshToken: string } }>('/auth/refresh-token', {
        refreshToken: storage.getRefreshToken(),
      })
      .then((response) => response.tokens)
      .then(async (tokens) => {
        const user = await apiClient
          .get<{ user: BackendUser }>(`/users/${storage.getUser()?.id}`)
          .then(unwrapUserResponse)
        return {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        }
      }),
  updateProfile: (id: string, payload: UpdateProfilePayload) =>
    apiClient.put<{ user: BackendUser }>(`/users/${id}`, payload).then(unwrapUserResponse),
}
