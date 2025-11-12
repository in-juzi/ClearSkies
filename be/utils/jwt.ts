import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '7d';

// ============================================================================
// Type Definitions
// ============================================================================

interface TokenPayload {
  id: string;
  username: string;
  email: string;
}

// ============================================================================
// JWT Functions
// ============================================================================

/**
 * Generate JWT token
 * @param payload - Data to encode in token
 * @returns JWT token
 */
export const generateToken = (payload: string | object): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  } as SignOptions);
};

/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate token for user
 * @param user - User object
 * @returns JWT token
 */
export const generateUserToken = (user: IUser): string => {
  return generateToken({
    id: user._id.toString(),
    username: user.username,
    email: user.email
  });
};
