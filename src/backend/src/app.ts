import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { enquiryRouter } from './routes/enquiries';
import i18nRouter from './routes/i18n';
import { imageRouter } from './routes/images';
import { propertyRouter } from './routes/properties';
import { userRouter } from './routes/users';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Total-Count'],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api', userRouter);
  app.use('/api/properties', propertyRouter);
  app.use('/api/properties/images', imageRouter);
  app.use('/api/enquiries', enquiryRouter);
  app.use('/api/i18n', i18nRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
