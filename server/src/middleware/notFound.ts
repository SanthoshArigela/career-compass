import { Request, Response } from 'express';

/**
 * 404 Not Found Middleware.
 * Catches all unmatched routes and returns standard error structure.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`
    }
  });
};
