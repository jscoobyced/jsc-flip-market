import { ApiError } from '@/types/api'
import { storage } from '@/utils/storage'

async function request<T>(path: string, init: RequestInit = {}) {
  const baseUrl = window.__APP_CONFIG__?.apiBaseUrl ?? '/api'
  const token = storage.getToken()
  const headers = new Headers(init.headers)
  const isFormData = init.body instanceof FormData

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    })
    const text = await response.text()
    const payload = text ? (JSON.parse(text) as T & { message?: string }) : null

    if (!response.ok) {
      throw new ApiError(payload?.message ?? 'Request failed', response.status)
    }

    return payload as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Unable to reach the API.', 0)
  }
}

export function shouldUseMockFallback(error?: unknown) {
  if (window.__APP_CONFIG__?.useMockData) {
    return true
  }

  return error instanceof ApiError && error.status === 0
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: object | FormData) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
  put: <T>(path: string, body?: object | FormData) =>
    request<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
}
