import jwt from 'jsonwebtoken';

import { config } from '../config/env';
import type { UserRole } from '../types/models';
import { AppError } from './errors';

interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

export const signAccessToken = (payload: Omit<TokenPayload, 'type'>): string =>
  jwt.sign({ ...payload, type: 'access' }, config.jwtSecret, {
    expiresIn: config.jwtAccessTtl as jwt.SignOptions['expiresIn'],
  });

export const signRefreshToken = (payload: Omit<TokenPayload, 'type'>): string =>
  jwt.sign({ ...payload, type: 'refresh' }, config.jwtSecret, {
    expiresIn: config.jwtRefreshTtl as jwt.SignOptions['expiresIn'],
  });

const verifyToken = (token: string, expectedType: TokenPayload['type']): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

    if (decoded.type !== expectedType) {
      throw new AppError('Invalid token type', 401, 'INVALID_TOKEN');
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
  }
};

export const verifyAccessToken = (token: string): TokenPayload => verifyToken(token, 'access');
export const verifyRefreshToken = (token: string): TokenPayload => verifyToken(token, 'refresh');
