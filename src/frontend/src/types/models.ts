export type UserRole = 'OWNER' | 'FLIPPER'
export type PropertyStatus = 'active' | 'sold' | 'archived'
export type PropertyCondition = 'poor' | 'fair' | 'needs-work' | 'good'
export type PropertyType = 'single-family' | 'multi-family' | 'commercial' | 'land'
export type EnquiryStatus = 'pending' | 'contacted' | 'accepted' | 'rejected'

export interface PropertyLocation {
  address: string
  city: string
  state: string
  zip: string
  latitude?: number
  longitude?: number
}

export interface UserBase {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  profilePicture?: string
  bio: string
  createdAt: string
  updatedAt: string
}

export interface FlipperProfile extends UserBase {
  role: 'FLIPPER'
  specializations: string[]
  portfolioProjects: number
  rating: number
}

export interface OwnerProfile extends UserBase {
  role: 'OWNER'
  companyName?: string
  taxId?: string
}

export type User = FlipperProfile | OwnerProfile

export interface PropertyImageRef {
  id: string
  url: string
}

export interface Property {
  id: string
  ownerId: string
  title: string
  description: string
  location: PropertyLocation
  propertyType: PropertyType
  squareFootage: number | null
  yearBuilt: number | null
  condition: PropertyCondition
  askingPrice: number
  images: string[]
  imageRefs?: PropertyImageRef[]
  status: PropertyStatus
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface Enquiry {
  id: string
  propertyId: string
  propertyOwnerId: string
  propertyTitle: string
  flipperId: string
  flipperName: string
  flipperEmail: string
  message: string
  contactName: string
  contactEmail: string
  contactPhone: string | null
  status: EnquiryStatus
  emailDeliveryStatus: string
  emailDeliveryDetails: string | null
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  query?: string
  city?: string
  state?: string
  propertyType?: PropertyType | ''
  condition?: PropertyCondition | ''
  minPrice?: number
  maxPrice?: number
  ownerId?: string
  featured?: boolean
  page?: number
  pageSize?: number
}

export interface PropertyFormValues {
  title: string
  description: string
  propertyType: PropertyType
  address: string
  city: string
  state: string
  zip: string
  squareFootage: number
  yearBuilt: number
  condition: PropertyCondition
  askingPrice: number
  status: PropertyStatus
  images: string[]
}

export interface RegisterPayload {
  role: UserRole
  name: string
  email: string
  phone: string
  password: string
  bio: string
  companyName?: string
  taxId?: string
  specializations?: string[]
}

export interface LoginPayload {
  email: string
  password: string
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  bio?: string
  profilePicture?: string
  companyName?: string
  taxId?: string
  specializations?: string[]
}

export interface EnquiryPayload {
  propertyId: string
  flipperId: string
  message: string
  contactInfo: string
}
