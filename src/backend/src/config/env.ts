import path from 'path';

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const booleanish = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === 'boolean') {
      return value;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  });

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z
      .string()
      .min(1)
      .default('postgres://postgres:postgres@localhost:5432/real_estate_flipping'),
    JWT_SECRET: z.string().min(16).default('development-jwt-secret-change-me'),
    JWT_ACCESS_TTL: z.string().min(2).default('15m'),
    JWT_REFRESH_TTL: z.string().min(2).default('7d'),
    UPLOAD_PATH: z.string().min(1).default(path.resolve(process.cwd(), 'storage', 'uploads')),
    CORS_ORIGIN: z.string().min(1).default('*'),
    EMAIL_MODE: z.enum(['disabled', 'json', 'smtp']).default('disabled'),
    EMAIL_FROM: z.string().email().default('noreply@example.com'),
    EMAIL_HOST: z.string().optional(),
    EMAIL_PORT: z.coerce.number().int().positive().default(587),
    EMAIL_SECURE: booleanish.default(false),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASSWORD: z.string().optional(),
    AUTO_MIGRATE: booleanish.default(false),
  })
  .superRefine((env, ctx) => {
    if (env.EMAIL_MODE === 'smtp' && (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASSWORD)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'EMAIL_HOST, EMAIL_USER and EMAIL_PASSWORD are required for EMAIL_MODE=smtp',
        path: ['EMAIL_MODE'],
      });
    }
  });

const parsed = envSchema.parse(process.env);

export const config = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  databaseUrl: parsed.DATABASE_URL,
  jwtSecret: parsed.JWT_SECRET,
  jwtAccessTtl: parsed.JWT_ACCESS_TTL,
  jwtRefreshTtl: parsed.JWT_REFRESH_TTL,
  uploadPath: path.isAbsolute(parsed.UPLOAD_PATH)
    ? parsed.UPLOAD_PATH
    : path.resolve(process.cwd(), parsed.UPLOAD_PATH),
  corsOrigin: parsed.CORS_ORIGIN,
  email: {
    mode: parsed.EMAIL_MODE,
    from: parsed.EMAIL_FROM,
    host: parsed.EMAIL_HOST,
    port: parsed.EMAIL_PORT,
    secure: parsed.EMAIL_SECURE,
    user: parsed.EMAIL_USER,
    password: parsed.EMAIL_PASSWORD,
  },
  autoMigrate: parsed.AUTO_MIGRATE,
};
