import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import healthRouter from './routes/health';
import careerIntelligenceRouter from './routes/careerIntelligenceRoutes';
import progressRouter from './routes/progressRoutes';
import studentRouter from './routes/studentRoutes';
import catalogRouter from './routes/catalogRoutes';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

/**
 * Creates and configures the Express application instance.
 * Decoupled from server listening to facilitate automated testing.
 */
export const createApp = (): Express => {
  const app = express();

  // 1. Security Headers
  app.use(helmet());

  // 2. Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // 3. Body Parsing with bounded size limit
  app.use(express.json({ limit: '1mb' }));

  // 4. API Routes
  app.use('/api/health', healthRouter);
  app.use('/api/students', careerIntelligenceRouter);
  app.use('/api/students', progressRouter);
  app.use('/api/students', studentRouter);
  app.use('/api', catalogRouter);

  // 5. 404 Not Found Handler
  app.use(notFoundHandler);

  // 6. Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;
