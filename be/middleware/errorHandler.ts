/**
 * Error Handling Middleware
 *
 * Centralized error handling for Express application.
 * Catches all errors and formats them consistently for the client.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, isAppError, toAppError } from '../utils/errors';

/**
 * Global error handler middleware
 * Must be registered AFTER all routes
 *
 * @param err - Error object
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const appError = toAppError(err);

  // Log error for debugging (only non-operational errors in production)
  if (!appError.isOperational || process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', {
      message: appError.message,
      statusCode: appError.statusCode,
      stack: appError.stack,
      metadata: appError.metadata,
      path: req.path,
      method: req.method
    });
  }

  // Send error response to client
  res.status(appError.statusCode).json({
    error: {
      message: appError.message,
      statusCode: appError.statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        metadata: appError.metadata,
        stack: appError.stack
      })
    }
  });
}

/**
 * Async handler wrapper
 * Wraps async route handlers to automatically catch errors and pass to error middleware
 *
 * @param fn - Async route handler function
 * @returns Wrapped function that catches errors
 *
 * @example
 * router.get('/items', asyncHandler(async (req, res) => {
 *   const items = await getItems();
 *   res.json(items);
 * }));
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler middleware
 * Catches requests to non-existent routes
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = new AppError(
    `Cannot ${req.method} ${req.path}`,
    404,
    true,
    { method: req.method, path: req.path }
  );
  next(error);
}
