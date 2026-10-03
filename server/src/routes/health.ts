import { Router, Request, Response } from 'express';
import { isDbConnected, getDbStatus } from '../db/connect';

const router = Router();

/**
 * GET /api/health
 * Checks health of the API server and its MongoDB connection.
 */
router.get('/', (req: Request, res: Response) => {
  const connected = isDbConnected();
  const dbStatus = getDbStatus();

  if (connected) {
    res.status(200).json({
      data: {
        status: 'ok',
        db: 'connected'
      }
    });
    return;
  }

  // Database is disconnected, connecting, or unavailable
  res.status(503).json({
    error: {
      code: 'SERVICE_UNAVAILABLE',
      message: 'Service is unhealthy: Database is not connected'
    },
    data: {
      status: 'unhealthy',
      db: dbStatus
    }
  });
});

export default router;
