import type { AuthResponse, PaginatedResult } from '@/types/api'
import type {
  EnquiryPayload,
  FlipperProfile,
  OwnerProfile,
  Property,
  PropertyFormValues,
  PropertyImageRef,
  SearchFilters,
  User,
} from '@/types/models'

interface BackendFlipperProfile {
  specializations: string[]
  portfolioProjects: number
  rating: number
  reviewsCount: number
}

interface BackendOwnerProfile {
  companyName: string | null
  taxId: string | null
}

export interface BackendUser {
  id: string
  email: string
  name: string
  phone: string | null
  userType: 'OWNER' | 'FLIPPER'
  profilePicture: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
  flipperProfile?: BackendFlipperProfile | null
  ownerProfile?: BackendOwnerProfile | null
}

export interface BackendPropertyImage {
  id: string
  propertyId: string
  fileName: string
  filePath: string
  mimeType: string
  createdAt: string
}

export interface BackendProperty {
  id: string
  ownerId: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number | null
  longitude: number | null
  propertyType: Property['propertyType']
  squareFootage: number | null
  yearBuilt: number | null
  condition: Property['condition']
  askingPrice: number
  status: Property['status']
  createdAt: string
  updatedAt: string
  images: BackendPropertyImage[]
}

export interface BackendAuthEnvelope {
  user: BackendUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

type BackendPaginatedEnvelope<T> = {
  items: T[]
  total?: number
  page?: number
  pageSize?: number
  pagination?: {
    total?: number
    page?: number
    limit?: number
    pageSize?: number
  }
}

type BackendPaginatedResponse<T> = {
  items: T[]
} & Partial<PaginatedResult<T>> &
  BackendPaginatedEnvelope<T>

const propertyCache = new Map<string, Property>()

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'FM'
}

function placeholderAvatar(name: string) {
  const initials = initialsFor(name)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="24" fill="#0f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#67e8f9" font-family="Arial, sans-serif" font-size="42" font-weight="700">${initials}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function getApiOrigin() {
  const baseUrl = window.__APP_CONFIG__?.apiBaseUrl ?? '/api'
  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    const url = new URL(baseUrl)
    return url.origin
  }

  return window.location.origin
}

function buildUploadUrl(filePath: string) {
  const normalizedPath = filePath.replace(/^\/+/, '')
  return `${getApiOrigin()}/uploads/${normalizedPath}`
}

function normalizeUser(base: BackendUser): User {
  const common = {
    id: base.id,
    email: base.email,
    name: base.name,
    phone: base.phone ?? '',
    role: base.userType,
    profilePicture: base.profilePicture ?? placeholderAvatar(base.name),
    bio: base.bio ?? '',
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
  }

  if (base.userType === 'FLIPPER') {
    const profile = base.flipperProfile
    return {
      ...common,
      role: 'FLIPPER',
      specializations: profile?.specializations ?? [],
      portfolioProjects: profile?.portfolioProjects ?? 0,
      rating: profile?.rating ?? 0,
    } satisfies FlipperProfile
  }

  const profile = base.ownerProfile
  return {
    ...common,
    role: 'OWNER',
    companyName: profile?.companyName ?? '',
    taxId: profile?.taxId ?? '',
  } satisfies OwnerProfile
}

function normalizeProperty(raw: BackendProperty): Property {
  const imageRefs: PropertyImageRef[] = raw.images.map((image) => ({
    id: image.id,
    url: buildUploadUrl(image.filePath),
  }))

  const property: Property = {
    id: raw.id,
    ownerId: raw.ownerId,
    title: raw.title,
    description: raw.description,
    location: {
      address: raw.address,
      city: raw.city,
      state: raw.state,
      zip: raw.zipCode,
      latitude: raw.latitude ?? undefined,
      longitude: raw.longitude ?? undefined,
    },
    propertyType: raw.propertyType,
    squareFootage: raw.squareFootage,
    yearBuilt: raw.yearBuilt,
    condition: raw.condition,
    askingPrice: raw.askingPrice,
    images: imageRefs.map((image) => image.url),
    imageRefs,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }

  propertyCache.set(property.id, property)
  return property
}

export function buildApiSearchParams(filters: SearchFilters) {
  const params = new URLSearchParams()

  if (filters.query) params.set('q', filters.query)
  if (filters.city) params.set('city', filters.city)
  if (filters.state) params.set('state', filters.state)
  if (filters.propertyType) params.set('propertyType', filters.propertyType)
  if (filters.condition) params.set('condition', filters.condition)
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters.ownerId) params.set('owner_id', filters.ownerId)
  if (filters.page !== undefined) params.set('page', String(filters.page))
  if (filters.pageSize !== undefined) params.set('limit', String(filters.pageSize))

  return params.toString()
}

export function normalizeAuthResponse(payload: BackendAuthEnvelope): AuthResponse {
  return {
    token: payload.tokens.accessToken,
    refreshToken: payload.tokens.refreshToken,
    user: normalizeUser(payload.user),
  }
}

export function unwrapUserResponse(payload: { user: BackendUser }) {
  return normalizeUser(payload.user)
}

export function unwrapPropertyResponse(payload: { property: BackendProperty }) {
  return normalizeProperty(payload.property)
}

export function normalizePaginatedProperties(payload: BackendPaginatedResponse<BackendProperty>): PaginatedResult<Property> {
  const page = payload.pagination?.page ?? payload.page ?? 1
  const total = payload.pagination?.total ?? payload.total ?? payload.items.length
  const pageSize =
    payload.pagination?.pageSize ??
    payload.pagination?.limit ??
    payload.pageSize ??
    payload.items.length ??
    1

  return {
    items: payload.items.map(normalizeProperty),
    total,
    page,
    pageSize,
  }
}

function dataUrlToFile(dataUrl: string, name: string) {
  const [metadata, content] = dataUrl.split(',', 2)
  const mimeType = metadata.match(/data:(.*?);base64/)?.[1] ?? 'application/octet-stream'
  const binary = window.atob(content)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new File([bytes], name, { type: mimeType })
}

function appendValue(formData: FormData, key: string, value: string | number) {
  formData.append(key, String(value))
}

export function propertyFormToFormData(propertyId: string | null, values: PropertyFormValues) {
  const formData = new FormData()
  appendValue(formData, 'title', values.title)
  appendValue(formData, 'description', values.description)
  appendValue(formData, 'propertyType', values.propertyType)
  appendValue(formData, 'address', values.address)
  appendValue(formData, 'city', values.city)
  appendValue(formData, 'state', values.state)
  appendValue(formData, 'zipCode', values.zip)
  appendValue(formData, 'squareFootage', values.squareFootage)
  appendValue(formData, 'yearBuilt', values.yearBuilt)
  appendValue(formData, 'condition', values.condition)
  appendValue(formData, 'askingPrice', values.askingPrice)
  appendValue(formData, 'status', values.status)

  const existing = propertyId ? propertyCache.get(propertyId) : undefined
  const keptUrls = new Set(values.images.filter((image) => !image.startsWith('data:')))
  const deleteImageIds =
    existing?.imageRefs?.filter((image) => !keptUrls.has(image.url)).map((image) => image.id) ?? []

  if (deleteImageIds.length) {
    formData.append('deleteImageIds', JSON.stringify(deleteImageIds))
  }

  values.images
    .filter((image) => image.startsWith('data:'))
    .forEach((image, index) => {
      formData.append('images', dataUrlToFile(image, `property-image-${index + 1}.png`))
    })

  return formData
}

export function normalizeEnquiryPayload(payload: EnquiryPayload, activeUser: User) {
  const hasEmail = payload.contactInfo.includes('@')

  return {
    propertyId: payload.propertyId,
    message: payload.message,
    contactName: activeUser.name,
    contactEmail: hasEmail ? payload.contactInfo : activeUser.email,
    contactPhone: hasEmail ? activeUser.phone || null : payload.contactInfo,
  }
}
