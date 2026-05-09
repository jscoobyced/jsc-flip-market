import { z } from 'zod';

export const createEnquirySchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(10).max(5000),
  contactName: z.string().min(2).max(100),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7).max(30).optional().nullable(),
});
