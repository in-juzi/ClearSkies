import { IUser } from '../models/User';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Authenticated request with required user
 * Use this type instead of 'as any' for protected routes
 */
export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export {};
