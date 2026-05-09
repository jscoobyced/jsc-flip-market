import { apiClient, shouldUseMockFallback } from '@/services/apiClient'
import { normalizeAuthResponse, type BackendAuthEnvelope, type BackendUser, unwrapUserResponse } from '@/services/apiAdapters'
import { mockBackend } from '@/services/mockBackend'
import type { AuthResponse } from '@/types/api'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '@/types/models'
import { storage } from '@/utils/storage'

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

export const authService = {
  register: (payload: RegisterPayload) =>
    withFallback<AuthResponse>(
      () =>
        apiClient
          .post<BackendAuthEnvelope>('/auth/register', {
            ...payload,
            userType: payload.role,
            portfolioProjects: payload.specializations?.length ? 0 : undefined,
          })
          .then(normalizeAuthResponse),
      () => mockBackend.register(payload),
    ),
  login: (payload: LoginPayload) =>
    withFallback<AuthResponse>(
      () => apiClient.post<BackendAuthEnvelope>('/auth/login', payload).then(normalizeAuthResponse),
      () => mockBackend.login(payload),
    ),
  refreshToken: () =>
    withFallback<AuthResponse>(
      async () => {
        const refreshToken = storage.getRefreshToken()
        const currentUser = storage.getUser()

        if (!refreshToken || !currentUser) {
          throw new Error('No refresh token available')
        }

        const tokens = await apiClient
          .post<{ tokens: { accessToken: string; refreshToken: string } }>('/auth/refresh-token', { refreshToken })
          .then((response) => response.tokens)
        const user = await apiClient.get<{ user: BackendUser }>(`/users/${currentUser.id}`).then(unwrapUserResponse)

        return {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        }
      },
      () => mockBackend.refreshToken(),
    ),
  updateProfile: (id: string, payload: UpdateProfilePayload) =>
    withFallback<User>(
      () => apiClient.put<{ user: BackendUser }>(`/users/${id}`, payload).then(unwrapUserResponse),
      () => mockBackend.updateUser(id, payload),
    ),
}
