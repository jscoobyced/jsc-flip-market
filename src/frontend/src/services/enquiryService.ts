import { apiClient, shouldUseMockFallback } from '@/services/apiClient'
import { normalizeEnquiryPayload } from '@/services/apiAdapters'
import { mockBackend } from '@/services/mockBackend'
import type { Enquiry, EnquiryPayload } from '@/types/models'
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

export const enquiryService = {
  createEnquiry: (payload: EnquiryPayload) =>
    withFallback(
      () => {
        const activeUser = storage.getUser()
        if (!activeUser) {
          throw new Error('You must be logged in to send an enquiry.')
        }
        return apiClient.post('/enquiries', normalizeEnquiryPayload(payload, activeUser))
      },
      () => mockBackend.createEnquiry(payload),
    ),
  getOwnerEnquiries: (ownerId: string) =>
    withFallback<Enquiry[]>(
      () => apiClient.get<{ enquiries: Enquiry[] }>(`/enquiries/owner/${ownerId}`).then((response) => response.enquiries),
      () => mockBackend.ownerEnquiries(ownerId),
    ),
}
