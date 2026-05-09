import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '../types/models';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

export const requireAuth = (request: Request, _response: Response, next: NextFunction): void => {
  const authorization = request.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    next(new AppError('Authorization header is required', 401, 'AUTH_REQUIRED'));
    return;
  }

  const token = authorization.replace('Bearer ', '').trim();
  const payload = verifyAccessToken(token);
  request.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
  next();
};

export const requireRole = (...roles: UserRole[]) => {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
      return;
    }

    if (!roles.includes(request.user.role)) {
      next(new AppError('Forbidden', 403, 'FORBIDDEN'));
      return;
    }

    next();
  };
};
