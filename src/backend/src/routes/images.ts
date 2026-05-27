import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

import { config } from '../config/env';
import { AppError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const getImagePath = (filename: string): string => {
  return path.join(config.uploadPath, filename);
};

router.get(
  '/:filename',
  asyncHandler(async (request, response) => {
    const filename = request.params.filename as string;

    try {
      const fullPath = getImagePath(filename);

      // Check if file exists
      const stat = await fs.stat(fullPath);
      if (!stat.isFile()) {
        throw new AppError('Image not found', 404, 'IMAGE_NOT_FOUND');
      }

      // Read and serve the file
      const fileBuffer = Buffer.from(await fs.readFile(fullPath));
      const ext = path.extname(filename).toLowerCase();

      let contentType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
      } else if (ext === '.png') {
        contentType = 'image/png';
      } else if (ext === '.gif') {
        contentType = 'image/gif';
      } else if (ext === '.webp') {
        contentType = 'image/webp';
      }

      response.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Cross-Origin-Resource-Policy': config.nodeEnv === 'production' ? 'same-origin' : 'cross-origin',
      });
      response.send(fileBuffer);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new AppError('Image not found', 404, 'IMAGE_NOT_FOUND');
      }
      throw error;
    }
  }),
);

export { router as imageRouter };
