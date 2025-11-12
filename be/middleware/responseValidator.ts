/**
 * Response Validation Middleware
 * Validates that all API responses can be properly serialized to JSON
 * Only active in development mode to catch circular reference issues early
 */

import { Request, Response, NextFunction } from 'express';
import { jsonSafe } from '../utils/jsonSafe';

/**
 * Middleware that intercepts res.json() to validate serialization
 * Catches circular reference errors before they reach the client
 */
function responseValidator(req: Request, res: Response, next: NextFunction): void {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'dev') {
    next();
    return;
  }

  // Store the original res.json function
  const originalJson = res.json;

  // Override res.json to add validation
  res.json = function (data: any) {
    const endpoint = `${req.method} ${req.path}`;

    try {
      // Validate that the data can be serialized
      jsonSafe(data, endpoint);

      // If validation passes, call the original json function
      return originalJson.call(this, data);
    } catch (e) {
      // Log the error with context
      console.error(`\n[Response Validation Failed]`);
      console.error(`Endpoint: ${endpoint}`);
      console.error(`Error: ${(e as Error).message}\n`);

      // Return a 500 error to the client with details
      return res.status(500).json({
        message: 'Response serialization failed',
        error: (e as Error).message,
        endpoint: endpoint,
        hint: 'Check server logs for detailed circular reference analysis'
      });
    }
  };

  next();
}

export default responseValidator;
