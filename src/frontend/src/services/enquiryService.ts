import { apiClient } from '@/services/apiClient'
import { normalizeEnquiryPayload } from '@/services/apiAdapters'
import type { Enquiry, EnquiryPayload } from '@/types/models'
import { storage } from '@/utils/storage'

export const enquiryService = {
  createEnquiry: (payload: EnquiryPayload) => {
    const activeUser = storage.getUser()
    if (!activeUser) {
      throw new Error('You must be logged in to send an enquiry.')
    }
    return apiClient.post('/enquiries', normalizeEnquiryPayload(payload, activeUser))
  },
  getOwnerEnquiries: (ownerId: string) =>
    apiClient.get<{ enquiries: Enquiry[] }>(`/enquiries/owner/${ownerId}`).then((response) => response.enquiries),
}
