import type { Property, User } from '@/types/models'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface FeaturedResponse {
  items: Property[]
}
