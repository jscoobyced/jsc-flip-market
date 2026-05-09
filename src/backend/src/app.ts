import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { enquiryRouter } from './routes/enquiries';
import { propertyRouter } from './routes/properties';
import { userRouter } from './routes/users';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((origin) => origin.trim()),
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(config.uploadPath));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api', userRouter);
  app.use('/api/properties', propertyRouter);
  app.use('/api/enquiries', enquiryRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
