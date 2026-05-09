export const USER_ROLES = ['FLIPPER', 'OWNER'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface FlipperProfile {
  specializations: string[];
  portfolioProjects: number;
  rating: number;
  reviewsCount: number;
}

export interface OwnerProfile {
  companyName: string | null;
  taxId: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  userType: UserRole;
  profilePicture: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  flipperProfile?: FlipperProfile | null;
  ownerProfile?: OwnerProfile | null;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  propertyType: string;
  squareFootage: number | null;
  yearBuilt: number | null;
  condition: string;
  askingPrice: number;
  status: 'active' | 'sold' | 'archived';
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyOwnerId: string;
  propertyTitle: string;
  flipperId: string;
  flipperName: string;
  flipperEmail: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  status: 'pending' | 'contacted' | 'accepted' | 'rejected';
  emailDeliveryStatus: string;
  emailDeliveryDetails: string | null;
  createdAt: string;
  updatedAt: string;
}
