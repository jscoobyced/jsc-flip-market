import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

import multer from 'multer';

import { config } from '../config/env';
import { AppError } from '../utils/errors';

export const ensureUploadDir = (): void => {
  fs.mkdirSync(config.uploadPath, { recursive: true });
};

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, config.uploadPath);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname) || '.bin';
    callback(null, `${randomUUID()}${extension.toLowerCase()}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (_request, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new AppError('Only image uploads are supported', 400, 'INVALID_UPLOAD_TYPE'));
      return;
    }

    callback(null, true);
  },
});
