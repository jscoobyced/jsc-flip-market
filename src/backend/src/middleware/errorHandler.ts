import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';

import { AppError } from '../utils/errors';

export const notFoundHandler = (_request: Request, _response: Response, next: NextFunction): void => {
  next(new AppError('Route not found', 404, 'NOT_FOUND'));
};

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  void _next;

  if (error instanceof ZodError) {
    response.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    response.status(400).json({
      error: error.message,
      code: 'UPLOAD_ERROR',
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }

  response.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
