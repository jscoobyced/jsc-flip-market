import { z } from 'zod';

export const propertyBodySchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(20).max(5000),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zipCode: z.string().min(3).max(20),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  propertyType: z.string().min(2).max(100),
  squareFootage: z.coerce.number().int().positive().max(1000000).optional().nullable(),
  yearBuilt: z.coerce.number().int().min(1700).max(3000).optional().nullable(),
  condition: z.string().min(2).max(100),
  askingPrice: z.coerce.number().positive().max(100000000),
  status: z.enum(['active', 'sold', 'archived']).optional(),
  deleteImageIds: z.array(z.string().uuid()).optional(),
});

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  owner_id: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  propertyType: z.string().optional(),
  condition: z.string().optional(),
  status: z.enum(['active', 'sold', 'archived']).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export const propertySearchSchema = propertyQuerySchema.extend({
  q: z.string().max(200).optional(),
});
