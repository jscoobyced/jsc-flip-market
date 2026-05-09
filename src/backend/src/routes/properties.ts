import fs from 'fs/promises';
import path from 'path';

import { Router } from 'express';

import { config } from '../config/env';
import { requireAuth, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  listProperties,
  searchProperties,
  updateProperty,
} from '../repositories/propertyRepository';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errors';
import { propertyBodySchema, propertyQuerySchema, propertySearchSchema } from '../validators/property';

const router = Router();

const parseDeleteImageIds = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : undefined;
  } catch {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
};

const normalizeBody = (body: Record<string, unknown>) => ({
  ...body,
  latitude: body.latitude === '' ? null : body.latitude,
  longitude: body.longitude === '' ? null : body.longitude,
  squareFootage: body.squareFootage === '' ? null : body.squareFootage,
  yearBuilt: body.yearBuilt === '' ? null : body.yearBuilt,
  deleteImageIds: parseDeleteImageIds(body.deleteImageIds),
});

const toStoredFiles = (files: Express.Multer.File[] | undefined) =>
  (files ?? []).map((file) => ({
    originalName: file.originalname,
    storedFileName: file.filename,
    mimeType: file.mimetype,
    relativePath: path.relative(config.uploadPath, file.path),
  }));

const deleteStoredFiles = async (relativePaths: string[]): Promise<void> => {
  await Promise.all(
    relativePaths.map(async (relativePath) => {
      try {
        await fs.unlink(path.join(config.uploadPath, relativePath));
      } catch {
        // Ignore missing files to keep delete/update idempotent.
      }
    }),
  );
};

router.get(
  '/',
  asyncHandler(async (request, response) => {
    const query = propertyQuerySchema.parse(request.query);
    const result = await listProperties({
      page: query.page,
      limit: query.limit,
      ownerId: query.owner_id,
      city: query.city,
      state: query.state,
      propertyType: query.propertyType,
      condition: query.condition,
      status: query.status,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });
    response.json(result);
  }),
);

router.get(
  '/search',
  asyncHandler(async (request, response) => {
    const query = propertySearchSchema.parse(request.query);
    const result = await searchProperties({
      page: query.page,
      limit: query.limit,
      ownerId: query.owner_id,
      city: query.city,
      state: query.state,
      propertyType: query.propertyType,
      condition: query.condition,
      status: query.status,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      q: query.q,
    });
    response.json(result);
  }),
);

router.get(
  '/:ownerId/owner-listings',
  asyncHandler(async (request, response) => {
    const ownerId = String(request.params.ownerId);
    const query = propertyQuerySchema.parse({ ...request.query, owner_id: ownerId });
    const result = await listProperties({
      page: query.page,
      limit: query.limit,
      ownerId,
      status: query.status,
      city: query.city,
      state: query.state,
      propertyType: query.propertyType,
      condition: query.condition,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });
    response.json(result);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (request, response) => {
    const propertyId = String(request.params.id);
    const property = await getPropertyById(propertyId);
    if (!property) {
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    response.json({ property });
  }),
);

router.post(
  '/',
  requireAuth,
  requireRole('OWNER'),
  upload.array('images', 10),
  asyncHandler(async (request, response) => {
    const payload = propertyBodySchema.parse(normalizeBody(request.body as Record<string, unknown>));
    const property = await createProperty(
      {
        ownerId: request.user!.id,
        title: payload.title,
        description: payload.description,
        address: payload.address,
        city: payload.city,
        state: payload.state,
        zipCode: payload.zipCode,
        latitude: payload.latitude,
        longitude: payload.longitude,
        propertyType: payload.propertyType,
        squareFootage: payload.squareFootage,
        yearBuilt: payload.yearBuilt,
        condition: payload.condition,
        askingPrice: payload.askingPrice,
        status: payload.status,
      },
      toStoredFiles(request.files as Express.Multer.File[] | undefined),
    );

    response.status(201).json({ property });
  }),
);

router.put(
  '/:id',
  requireAuth,
  requireRole('OWNER'),
  upload.array('images', 10),
  asyncHandler(async (request, response) => {
    const propertyId = String(request.params.id);
    const existing = await getPropertyById(propertyId);
    if (!existing) {
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }
    if (existing.ownerId !== request.user!.id) {
      throw new AppError('You can only update your own listings', 403, 'FORBIDDEN');
    }

    const payload = propertyBodySchema.partial().parse(normalizeBody(request.body as Record<string, unknown>));
    const result = await updateProperty(
      propertyId,
      request.user!.id,
      {
        title: payload.title,
        description: payload.description,
        address: payload.address,
        city: payload.city,
        state: payload.state,
        zipCode: payload.zipCode,
        latitude: payload.latitude,
        longitude: payload.longitude,
        propertyType: payload.propertyType,
        squareFootage: payload.squareFootage,
        yearBuilt: payload.yearBuilt,
        condition: payload.condition,
        askingPrice: payload.askingPrice,
        status: payload.status,
        deleteImageIds: payload.deleteImageIds,
      },
      toStoredFiles(request.files as Express.Multer.File[] | undefined),
    );

    await deleteStoredFiles(result.deletedImagePaths);
    response.json({ property: result.property });
  }),
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('OWNER'),
  asyncHandler(async (request, response) => {
    const result = await deleteProperty(String(request.params.id), request.user!.id);
    if (!result.deleted) {
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    await deleteStoredFiles(result.imagePaths);
    response.status(204).send();
  }),
);

export { router as propertyRouter };
