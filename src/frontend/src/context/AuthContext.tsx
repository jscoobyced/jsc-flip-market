import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { authService } from '@/services/authService'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '@/types/models'
import { storage } from '@/utils/storage'

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => void
  updateUser: (payload: UpdateProfilePayload) => Promise<User>
  refreshSession: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(storage.getUser())
  const [token, setToken] = useState<string | null>(storage.getToken())
  const [loading, setLoading] = useState(true)

  const persist = useCallback((nextToken: string, nextRefreshToken: string, nextUser: User) => {
    setToken(nextToken)
    setUser(nextUser)
    storage.setToken(nextToken)
    storage.setRefreshToken(nextRefreshToken)
    storage.setUser(nextUser)
  }, [])

  useEffect(() => {
    if (!storage.getToken() || !storage.getUser()) {
      setLoading(false)
      return
    }

    authService
      .refreshToken()
      .then(({ token: nextToken, refreshToken: nextRefreshToken, user: nextUser }) =>
        persist(nextToken, nextRefreshToken, nextUser),
      )
      .catch(() => storage.clearAuth())
      .finally(() => setLoading(false))
  }, [persist])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authService.login(payload)
      persist(response.token, response.refreshToken, response.user)
      return response.user
    },
    [persist],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authService.register(payload)
      persist(response.token, response.refreshToken, response.user)
      return response.user
    },
    [persist],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    storage.clearAuth()
  }, [])

  const updateUser = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (!user) {
        throw new Error('No active user')
      }
      const updatedUser = await authService.updateProfile(user.id, payload)
      if (token) {
        persist(token, storage.getRefreshToken() ?? token, updatedUser)
      } else {
        setUser(updatedUser)
        storage.setUser(updatedUser)
      }
      return updatedUser
    },
    [persist, token, user],
  )

  const refreshSession = useCallback(async () => {
    if (!token) {
      return
    }
    const response = await authService.refreshToken()
    persist(response.token, response.refreshToken, response.user)
  }, [persist, token])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      refreshSession,
      isAuthenticated: Boolean(user && token),
    }),
    [loading, login, logout, refreshSession, register, token, updateUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
