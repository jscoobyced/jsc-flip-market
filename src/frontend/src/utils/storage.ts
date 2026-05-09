import type { User } from '@/types/models'

const AUTH_TOKEN_KEY = 'flipmarket.auth.token'
const AUTH_REFRESH_TOKEN_KEY = 'flipmarket.auth.refreshToken'
const AUTH_USER_KEY = 'flipmarket.auth.user'
const LANGUAGE_KEY = 'flipmarket.language'
const MOCK_DB_KEY = 'flipmarket.mock.db'

function read<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export const storage = {
  getToken: () => read<string>(AUTH_TOKEN_KEY),
  setToken: (token: string) => write(AUTH_TOKEN_KEY, token),
  clearToken: () => window.localStorage.removeItem(AUTH_TOKEN_KEY),
  getRefreshToken: () => read<string>(AUTH_REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => write(AUTH_REFRESH_TOKEN_KEY, token),
  clearRefreshToken: () => window.localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY),
  getUser: () => read<User>(AUTH_USER_KEY),
  setUser: (user: User) => write(AUTH_USER_KEY, user),
  clearUser: () => window.localStorage.removeItem(AUTH_USER_KEY),
  getLanguage: () => read<string>(LANGUAGE_KEY),
  setLanguage: (language: string) => write(LANGUAGE_KEY, language),
  getMockDb: <T>() => read<T>(MOCK_DB_KEY),
  setMockDb: <T>(value: T) => write(MOCK_DB_KEY, value),
  clearAuth() {
    this.clearToken()
    this.clearRefreshToken()
    this.clearUser()
  },
}
