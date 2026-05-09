import { z } from 'zod';

import { USER_ROLES } from '../types/models';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(30).optional().nullable(),
  userType: z.enum(USER_ROLES),
  profilePicture: z.string().url().optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  specializations: z.array(z.string().min(1).max(100)).max(10).optional(),
  portfolioProjects: z.coerce.number().int().min(0).max(100000).optional(),
  companyName: z.string().max(150).optional().nullable(),
  taxId: z.string().max(100).optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
