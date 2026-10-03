import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Standard Application Error with HTTP status code and machine-readable error code.
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Centralized Express Error Handling Middleware.
 * Enforces consistent API error response format:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human readable message"
 *   }
 * }
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Handle AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
    return;
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError' && 'issues' in err) {
    const zodErr = err as { issues: Array<{ path: (string | number)[]; message: string }> };
    const message = zodErr.issues
      .map((i) => (i.path.length > 0 ? `${i.path.join('.')}: ${i.message}` : i.message))
      .join('; ');

    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message
      }
    });
    return;
  }

  // Handle malformed JSON body errors from express.json()
  if ('type' in err && (err as { type: string }).type === 'entity.parse.failed') {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON_BODY',
        message: 'The request payload contains malformed or unparseable JSON.'
      }
    });
    return;
  }

  // Handle payload too large
  if ('type' in err && (err as { type: string }).type === 'entity.too.large') {
    res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'The request payload exceeds the allowed size limit.'
      }
    });
    return;
  }

  // Log unexpected errors on the server for debugging
  console.error(`[Unhandled Error] ${req.method} ${req.originalUrl}:`, err);

  // Never expose raw internal stack traces to clients
  const message =
    env.NODE_ENV === 'production'
      ? 'An internal server error occurred.'
      : err.message || 'An unexpected error occurred.';

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message
    }
  });
};
