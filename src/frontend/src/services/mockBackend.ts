import type { AuthResponse, PaginatedResult } from '@/types/api'
import { ApiError } from '@/types/api'
import type {
  Enquiry,
  EnquiryPayload,
  FlipperProfile,
  LoginPayload,
  OwnerProfile,
  Property,
  PropertyCondition,
  PropertyFormValues,
  PropertyStatus,
  RegisterPayload,
  SearchFilters,
  UpdateProfilePayload,
  User,
  UserRole,
} from '@/types/models'
import { storage } from '@/utils/storage'

interface MockState {
  users: User[]
  credentials: Record<string, string>
  properties: Property[]
  enquiries: StoredEnquiry[]
}

type StoredEnquiry = Pick<Enquiry, 'id' | 'propertyId' | 'flipperId' | 'message' | 'status' | 'createdAt' | 'updatedAt'> &
  Partial<Omit<Enquiry, 'id' | 'propertyId' | 'flipperId' | 'message' | 'status' | 'createdAt' | 'updatedAt'>>

const now = () => new Date().toISOString()
const wait = (duration = 250) => new Promise((resolve) => window.setTimeout(resolve, duration))
const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const seedUsers: User[] = [
  {
    id: 'owner-1',
    role: 'OWNER',
    email: 'owner@example.com',
    name: 'Maya Chen',
    phone: '+1 (212) 555-0181',
    bio: 'Broker-owner specializing in quick sales for inherited and distressed assets.',
    companyName: 'North Harbor Estates',
    taxId: 'NH-2048',
    profilePicture:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    createdAt: now(),
    updatedAt: now(),
  } satisfies OwnerProfile,
  {
    id: 'owner-2',
    role: 'OWNER',
    email: 'owner2@example.com',
    name: 'Luis Garcia',
    phone: '+1 (305) 555-0146',
    bio: 'Small portfolio owner with off-market homes across Florida and Georgia.',
    companyName: 'LGC Holdings',
    taxId: 'LGC-91',
    profilePicture:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    createdAt: now(),
    updatedAt: now(),
  } satisfies OwnerProfile,
  {
    id: 'flipper-1',
    role: 'FLIPPER',
    email: 'flipper@example.com',
    name: 'Jordan Brooks',
    phone: '+1 (646) 555-0124',
    bio: 'Value-add investor focused on cosmetic rehab and light structural repositioning.',
    specializations: ['single-family', 'multi-family'],
    portfolioProjects: 18,
    rating: 4.8,
    profilePicture:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    createdAt: now(),
    updatedAt: now(),
  } satisfies FlipperProfile,
  {
    id: 'flipper-2',
    role: 'FLIPPER',
    email: 'flipper2@example.com',
    name: 'Ava Patel',
    phone: '+1 (415) 555-0110',
    bio: 'Commercial and mixed-use redeveloper with a strong contractor network.',
    specializations: ['commercial', 'land'],
    portfolioProjects: 11,
    rating: 4.9,
    profilePicture:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    createdAt: now(),
    updatedAt: now(),
  } satisfies FlipperProfile,
]

const seedProperties: Property[] = [
  {
    id: 'property-1',
    ownerId: 'owner-1',
    title: 'Brick rowhouse with expansion potential',
    description:
      'Corner lot rowhouse with dated systems, detached garage, and permits previously approved for a rear addition.',
    location: { address: '145 Hudson Ave', city: 'Brooklyn', state: 'NY', zip: '11201' },
    propertyType: 'single-family',
    squareFootage: 2100,
    yearBuilt: 1926,
    condition: 'needs-work',
    askingPrice: 585000,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    featured: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'property-2',
    ownerId: 'owner-1',
    title: 'Vacant duplex with strong rental comps',
    description:
      'Full-gut duplex in an appreciating corridor. Separate meters already installed and alley access in place.',
    location: { address: '28 Maple Street', city: 'Newark', state: 'NJ', zip: '07102' },
    propertyType: 'multi-family',
    squareFootage: 3100,
    yearBuilt: 1938,
    condition: 'poor',
    askingPrice: 420000,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    featured: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'property-3',
    ownerId: 'owner-2',
    title: 'Warehouse shell ideal for adaptive reuse',
    description:
      'Former cabinet shop with wide-open floor plates, alley loading, and favorable zoning for mixed-use conversion.',
    location: { address: '408 Rivera Way', city: 'Tampa', state: 'FL', zip: '33602' },
    propertyType: 'commercial',
    squareFootage: 6400,
    yearBuilt: 1958,
    condition: 'fair',
    askingPrice: 980000,
    images: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    featured: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'property-4',
    ownerId: 'owner-2',
    title: 'Infill lot with approved plans',
    description:
      'Cleared urban infill lot sold with survey, environmental work, and six-unit townhouse plans.',
    location: { address: '89 Garden Terrace', city: 'Savannah', state: 'GA', zip: '31401' },
    propertyType: 'land',
    squareFootage: 8900,
    yearBuilt: 2024,
    condition: 'good',
    askingPrice: 225000,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    createdAt: now(),
    updatedAt: now(),
  },
]

const seedEnquiries: StoredEnquiry[] = [
  {
    id: 'enquiry-1',
    propertyId: 'property-1',
    propertyOwnerId: 'owner-1',
    propertyTitle: 'Brick rowhouse with expansion potential',
    flipperId: 'flipper-1',
    flipperName: 'Jordan Brooks',
    flipperEmail: 'flipper@example.com',
    message: 'I can close in cash this month and would like to review any structural reports before touring.',
    contactName: 'Jordan Brooks',
    contactEmail: 'flipper@example.com',
    contactPhone: '+1 (646) 555-0124',
    status: 'pending',
    emailDeliveryStatus: 'mock',
    emailDeliveryDetails: 'Stored in the mock backend.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'enquiry-2',
    propertyId: 'property-2',
    propertyOwnerId: 'owner-1',
    propertyTitle: 'Vacant duplex with strong rental comps',
    flipperId: 'flipper-2',
    flipperName: 'Ava Patel',
    flipperEmail: 'flipper2@example.com',
    message: 'Interested in the duplex. Can you share occupancy history, utility setup, and your ideal closing window?',
    contactName: 'Ava Patel',
    contactEmail: 'flipper2@example.com',
    contactPhone: '+1 (415) 555-0110',
    status: 'contacted',
    emailDeliveryStatus: 'mock',
    emailDeliveryDetails: 'Stored in the mock backend.',
    createdAt: now(),
    updatedAt: now(),
  },
]

const defaultState: MockState = {
  users: seedUsers,
  credentials: {
    'owner@example.com': 'Password123!',
    'owner2@example.com': 'Password123!',
    'flipper@example.com': 'Password123!',
    'flipper2@example.com': 'Password123!',
  },
  properties: seedProperties,
  enquiries: seedEnquiries,
}

function getState() {
  return storage.getMockDb<MockState>() ?? defaultState
}

function saveState(state: MockState) {
  storage.setMockDb(state)
  return state
}

function assertRole<T extends UserRole>(user: User | undefined, role: T) {
  if (!user || user.role !== role) {
    throw new ApiError('Not found', 404)
  }
  return user as Extract<User, { role: T }>
}

function tokenFor(user: User) {
  return `mock-token-${user.id}`
}

function authResponse(user: User): AuthResponse {
  return { token: tokenFor(user), refreshToken: `${tokenFor(user)}-refresh`, user }
}

function paginate<T>(items: T[], page = 1, pageSize = 6): PaginatedResult<T> {
  const offset = (page - 1) * pageSize
  return {
    items: items.slice(offset, offset + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}

function filterProperties(properties: Property[], filters: SearchFilters = {}) {
  const query = filters.query?.toLowerCase().trim()
  const filtered = properties.filter((property) => {
    if (filters.ownerId && property.ownerId !== filters.ownerId) {
      return false
    }
    if (filters.featured && !property.featured) {
      return false
    }
    if (filters.city && property.location.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false
    }
    if (filters.state && property.location.state.toLowerCase() !== filters.state.toLowerCase()) {
      return false
    }
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false
    }
    if (filters.condition && property.condition !== filters.condition) {
      return false
    }
    if (filters.minPrice && property.askingPrice < filters.minPrice) {
      return false
    }
    if (filters.maxPrice && property.askingPrice > filters.maxPrice) {
      return false
    }
    if (query) {
      const haystack = [
        property.title,
        property.description,
        property.location.city,
        property.location.state,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) {
        return false
      }
    }
    return property.status === 'active' || filters.ownerId === property.ownerId
  })

  return filtered.sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

function makeUser(payload: RegisterPayload): User {
  const timestamp = now()
  if (payload.role === 'OWNER') {
    return {
      id: makeId('owner'),
      role: 'OWNER',
      email: payload.email,
      name: payload.name,
      phone: payload.phone,
      bio: payload.bio,
      companyName: payload.companyName,
      taxId: payload.taxId,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  }

  return {
    id: makeId('flipper'),
    role: 'FLIPPER',
    email: payload.email,
    name: payload.name,
    phone: payload.phone,
    bio: payload.bio,
    specializations: payload.specializations ?? [],
    portfolioProjects: 0,
    rating: 5,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

function propertyFromForm(ownerId: string, payload: PropertyFormValues, current?: Property): Property {
  const timestamp = now()
  return {
    id: current?.id ?? makeId('property'),
    ownerId,
    title: payload.title,
    description: payload.description,
    propertyType: payload.propertyType,
    location: {
      address: payload.address,
      city: payload.city,
      state: payload.state,
      zip: payload.zip,
    },
    squareFootage: payload.squareFootage,
    yearBuilt: payload.yearBuilt,
    condition: payload.condition,
    askingPrice: payload.askingPrice,
    images: payload.images,
    status: payload.status,
    featured: current?.featured ?? false,
    createdAt: current?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
}

function hydrateEnquiry(enquiry: StoredEnquiry, state: MockState): Enquiry {
  const property = state.properties.find((entry) => entry.id === enquiry.propertyId)
  const flipper = state.users.find((entry) => entry.id === enquiry.flipperId && entry.role === 'FLIPPER')

  return {
    id: enquiry.id,
    propertyId: enquiry.propertyId,
    propertyOwnerId: enquiry.propertyOwnerId ?? property?.ownerId ?? '',
    propertyTitle: enquiry.propertyTitle ?? property?.title ?? 'Property',
    flipperId: enquiry.flipperId,
    flipperName: enquiry.flipperName ?? flipper?.name ?? 'Unknown flipper',
    flipperEmail: enquiry.flipperEmail ?? flipper?.email ?? '',
    message: enquiry.message,
    contactName: enquiry.contactName ?? flipper?.name ?? 'Unknown contact',
    contactEmail: enquiry.contactEmail ?? flipper?.email ?? '',
    contactPhone: enquiry.contactPhone ?? flipper?.phone ?? null,
    status: enquiry.status,
    emailDeliveryStatus: enquiry.emailDeliveryStatus ?? 'mock',
    emailDeliveryDetails: enquiry.emailDeliveryDetails ?? 'Stored in the mock backend.',
    createdAt: enquiry.createdAt,
    updatedAt: enquiry.updatedAt,
  }
}

export const mockBackend = {
  async register(payload: RegisterPayload) {
    await wait()
    const state = getState()
    if (state.users.some((user) => user.email.toLowerCase() == payload.email.toLowerCase())) {
      throw new ApiError('An account already exists for that email.', 409)
    }

    const user = makeUser(payload)
    state.users.unshift(user)
    state.credentials[payload.email] = payload.password
    saveState(state)
    return authResponse(user)
  },
  async login(payload: LoginPayload) {
    await wait()
    const state = getState()
    const user = state.users.find((entry) => entry.email.toLowerCase() === payload.email.toLowerCase())
    if (!user || state.credentials[user.email] !== payload.password) {
      throw new ApiError('Incorrect email or password.', 401)
    }
    return authResponse(user)
  },
  async refreshToken(token?: string | null) {
    await wait(120)
    const activeToken = token ?? storage.getToken()
    if (!activeToken) {
      throw new ApiError('Unauthorized', 401)
    }
    const userId = activeToken.replace('mock-token-', '')
    const user = getState().users.find((entry) => entry.id === userId)
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }
    return authResponse(user)
  },
  async getUser(id: string) {
    await wait()
    const user = getState().users.find((entry) => entry.id === id)
    if (!user) {
      throw new ApiError('User not found.', 404)
    }
    return user
  },
  async getFlipper(id: string) {
    const user = await this.getUser(id)
    return assertRole(user, 'FLIPPER')
  },
  async getOwner(id: string) {
    const user = await this.getUser(id)
    return assertRole(user, 'OWNER')
  },
  async updateUser(id: string, payload: UpdateProfilePayload) {
    await wait()
    const state = getState()
    const index = state.users.findIndex((entry) => entry.id === id)
    if (index < 0) {
      throw new ApiError('User not found.', 404)
    }
    const current = state.users[index]
    const updated = {
      ...current,
      ...payload,
      updatedAt: now(),
    } as User
    state.users[index] = updated
    saveState(state)
    return updated
  },
  async listProperties(filters: SearchFilters = {}) {
    await wait()
    const state = getState()
    return paginate(filterProperties(state.properties, filters), filters.page ?? 1, filters.pageSize ?? 6)
  },
  async searchProperties(filters: SearchFilters = {}) {
    return this.listProperties(filters)
  },
  async featuredProperties() {
    await wait()
    return filterProperties(getState().properties, { featured: true }).slice(0, 3)
  },
  async getProperty(id: string) {
    await wait()
    const property = getState().properties.find((entry) => entry.id === id)
    if (!property) {
      throw new ApiError('Property not found.', 404)
    }
    return property
  },
  async ownerListings(ownerId: string, page = 1, pageSize = 6) {
    await wait()
    const properties = filterProperties(getState().properties, { ownerId })
    return paginate(properties, page, pageSize)
  },
  async ownerEnquiries(ownerId: string) {
    await wait()
    const activeUser = storage.getUser()
    if (!activeUser || activeUser.role !== 'OWNER' || activeUser.id !== ownerId) {
      throw new ApiError('Forbidden', 403)
    }

    const state = getState()
    return state.enquiries
      .map((entry) => hydrateEnquiry(entry, state))
      .filter((entry) => entry.propertyOwnerId === ownerId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  },
  async createProperty(ownerId: string, payload: PropertyFormValues) {
    await wait()
    const state = getState()
    const property = propertyFromForm(ownerId, payload)
    state.properties.unshift(property)
    saveState(state)
    return property
  },
  async updateProperty(propertyId: string, ownerId: string, payload: PropertyFormValues) {
    await wait()
    const state = getState()
    const index = state.properties.findIndex((entry) => entry.id === propertyId)
    if (index < 0) {
      throw new ApiError('Property not found.', 404)
    }
    if (state.properties[index].ownerId !== ownerId) {
      throw new ApiError('You cannot edit that property.', 403)
    }
    const property = propertyFromForm(ownerId, payload, state.properties[index])
    state.properties[index] = property
    saveState(state)
    return property
  },
  async createEnquiry(payload: EnquiryPayload) {
    await wait()
    const state = getState()
    const property = state.properties.find((entry) => entry.id === payload.propertyId)
    if (!property) {
      throw new ApiError('Property not found.', 404)
    }

    const flipper = state.users.find((entry) => entry.id === payload.flipperId && entry.role === 'FLIPPER')
    if (!flipper) {
      throw new ApiError('Flipper not found.', 404)
    }

    const hasEmail = payload.contactInfo.includes('@')
    const enquiry: StoredEnquiry = {
      id: makeId('enquiry'),
      propertyId: payload.propertyId,
      propertyOwnerId: property.ownerId,
      propertyTitle: property.title,
      flipperId: payload.flipperId,
      flipperName: flipper.name,
      flipperEmail: flipper.email,
      message: payload.message,
      contactName: flipper.name,
      contactEmail: hasEmail ? payload.contactInfo : flipper.email,
      contactPhone: hasEmail ? flipper.phone ?? null : payload.contactInfo,
      status: 'pending',
      emailDeliveryStatus: 'mock',
      emailDeliveryDetails: 'Stored in the mock backend.',
      createdAt: now(),
      updatedAt: now(),
    }
    state.enquiries.unshift(enquiry)
    saveState(state)
    return hydrateEnquiry(enquiry, state)
  },
  conditions: [
    { value: 'poor', label: 'Poor' },
    { value: 'fair', label: 'Fair' },
    { value: 'needs-work', label: 'Needs work' },
    { value: 'good', label: 'Good bones' },
  ] satisfies Array<{ value: PropertyCondition; label: string }>,
  propertyTypes: [
    { value: 'single-family', label: 'Single-family' },
    { value: 'multi-family', label: 'Multi-family' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
  ],
  statuses: [
    { value: 'active', label: 'Active' },
    { value: 'sold', label: 'Sold' },
    { value: 'archived', label: 'Archived' },
  ] satisfies Array<{ value: PropertyStatus; label: string }>,
}
