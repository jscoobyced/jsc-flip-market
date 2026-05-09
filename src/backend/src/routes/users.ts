import { Router } from 'express';

import { requireAuth } from '../middleware/auth';
import { findUserById, updateUser } from '../repositories/userRepository';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errors';
import { updateUserSchema } from '../validators/user';

const router = Router();

router.get(
  '/users/:id',
  asyncHandler(async (request, response) => {
    const userId = String(request.params.id);
    const user = await findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    response.json({ user });
  }),
);

router.put(
  '/users/:id',
  requireAuth,
  asyncHandler(async (request, response) => {
    const userId = String(request.params.id);
    if (request.user?.id !== userId) {
      throw new AppError('You can only update your own profile', 403, 'FORBIDDEN');
    }

    const payload = updateUserSchema.parse(request.body);
    const updated = await updateUser(userId, payload);

    if (!updated) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    response.json({ user: updated });
  }),
);

router.get(
  '/flippers/:id',
  asyncHandler(async (request, response) => {
    const user = await findUserById(String(request.params.id));
    if (!user || user.userType !== 'FLIPPER') {
      throw new AppError('Flipper not found', 404, 'FLIPPER_NOT_FOUND');
    }

    response.json({ user });
  }),
);

router.get(
  '/owners/:id',
  asyncHandler(async (request, response) => {
    const user = await findUserById(String(request.params.id));
    if (!user || user.userType !== 'OWNER') {
      throw new AppError('Owner not found', 404, 'OWNER_NOT_FOUND');
    }

    response.json({ user });
  }),
);

export { router as userRouter };
