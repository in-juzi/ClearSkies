/**
 * Standardized Error Classes
 *
 * Provides consistent error handling across the application with proper HTTP status codes,
 * error messages, and optional metadata for debugging.
 */

/**
 * Base application error class
 * All custom errors extend from this
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.metadata = metadata;

    // Maintains proper stack trace for where error was thrown (Node.js only)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 * Client provided invalid data
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', metadata?: Record<string, any>) {
    super(message, 400, true, metadata);
  }
}

/**
 * 401 Unauthorized
 * Authentication required or failed
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', metadata?: Record<string, any>) {
    super(message, 401, true, metadata);
  }
}

/**
 * 403 Forbidden
 * Authenticated but not authorized
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', metadata?: Record<string, any>) {
    super(message, 403, true, metadata);
  }
}

/**
 * 404 Not Found
 * Resource does not exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', metadata?: Record<string, any>) {
    super(`${resource} not found`, 404, true, metadata);
  }
}

/**
 * 409 Conflict
 * Request conflicts with current state (e.g., duplicate username)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', metadata?: Record<string, any>) {
    super(message, 409, true, metadata);
  }
}

/**
 * 422 Unprocessable Entity
 * Request is well-formed but semantically invalid
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', metadata?: Record<string, any>) {
    super(message, 422, true, metadata);
  }
}

/**
 * 500 Internal Server Error
 * Unexpected server error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', metadata?: Record<string, any>) {
    super(message, 500, false, metadata);
  }
}

/**
 * Helper function to determine if an error is an AppError
 */
export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

/**
 * Helper function to convert any error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message, { originalError: error.stack });
  }

  return new InternalServerError('An unknown error occurred', { originalError: String(error) });
}
