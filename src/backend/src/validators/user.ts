import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().min(7).max(30).optional().nullable(),
    profilePicture: z.string().url().optional().nullable(),
    bio: z.string().max(1000).optional().nullable(),
    specializations: z.array(z.string().min(1).max(100)).max(10).optional(),
    portfolioProjects: z.coerce.number().int().min(0).max(100000).optional(),
    companyName: z.string().max(150).optional().nullable(),
    taxId: z.string().max(100).optional().nullable(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be provided');
