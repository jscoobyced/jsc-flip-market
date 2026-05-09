import { Router } from 'express';

import { requireAuth, requireRole } from '../middleware/auth';
import { createEnquiry, getEnquiryById, listEnquiriesByOwnerId, listEnquiriesByPropertyId } from '../repositories/enquiryRepository';
import { getPropertyById } from '../repositories/propertyRepository';
import { findUserById } from '../repositories/userRepository';
import { sendEnquiryNotification } from '../services/email';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errors';
import { createEnquirySchema } from '../validators/enquiry';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('FLIPPER'),
  asyncHandler(async (request, response) => {
    const payload = createEnquirySchema.parse(request.body);
    const property = await getPropertyById(payload.propertyId);
    if (!property) {
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    const owner = await findUserById(property.ownerId);
    const flipper = await findUserById(request.user!.id);
    if (!owner || !flipper) {
      throw new AppError('Related users could not be found', 400, 'INVALID_ENQUIRY');
    }

    let emailResult;
    try {
      emailResult = await sendEnquiryNotification({
        ownerEmail: owner.email,
        ownerName: owner.name,
        propertyTitle: property.title,
        message: payload.message,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        flipperName: flipper.name,
      });
    } catch (error) {
      emailResult = {
        mode: 'smtp' as const,
        delivered: false,
        details: error instanceof Error ? error.message : 'Email delivery failed',
      };
    }

    const enquiry = await createEnquiry({
      propertyId: payload.propertyId,
      flipperId: request.user!.id,
      message: payload.message,
      contactName: payload.contactName,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      emailDeliveryStatus: emailResult.delivered ? 'sent' : emailResult.mode,
      emailDeliveryDetails: emailResult.details,
    });

    response.status(201).json({
      enquiry,
      email: emailResult,
    });
  }),
);

router.get(
  '/owner/:ownerId',
  requireAuth,
  requireRole('OWNER'),
  asyncHandler(async (request, response) => {
    const ownerId = String(request.params.ownerId);
    if (request.user!.id !== ownerId) {
      throw new AppError('Only the owner can view their enquiries', 403, 'FORBIDDEN');
    }

    const enquiries = await listEnquiriesByOwnerId(ownerId);
    response.json({ enquiries });
  }),
);

router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (request, response) => {
    const enquiry = await getEnquiryById(String(request.params.id));
    if (!enquiry) {
      throw new AppError('Enquiry not found', 404, 'ENQUIRY_NOT_FOUND');
    }

    if (request.user!.id !== enquiry.flipperId && request.user!.id !== enquiry.propertyOwnerId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    response.json({ enquiry });
  }),
);

router.get(
  '/property/:propertyId',
  requireAuth,
  asyncHandler(async (request, response) => {
    const propertyId = String(request.params.propertyId);
    const property = await getPropertyById(propertyId);
    if (!property) {
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    if (request.user!.id !== property.ownerId) {
      throw new AppError('Only the property owner can view all enquiries', 403, 'FORBIDDEN');
    }

    const enquiries = await listEnquiriesByPropertyId(propertyId);
    response.json({ enquiries });
  }),
);

export { router as enquiryRouter };
