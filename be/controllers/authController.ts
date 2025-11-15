import { Request, Response } from 'express';
import { validationResult, ValidationError, Result } from 'express-validator';
import User, { IUser } from '../models/User';
import Player from '../models/Player';
import { generateUserToken } from '../utils/jwt';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
      return;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Create player profile
    const player = await Player.create({
      userId: user._id
    });

    // Generate token
    const token = generateUserToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        player: {
          id: player._id,
          level: player.level
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: (error as Error).message
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  try {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Update last login
    await user.updateLastLogin();

    // Get player data
    const player = await Player.findOne({ userId: user._id });

    if (player) {
      await player.updateLastPlayed();
    }

    // Generate token
    const token = generateUserToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          lastLogin: user.lastLogin
        },
        player: player ? {
          id: player._id,
          level: player.level,
          gold: player.gold,
          location: player.currentLocation
        } : null,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: (error as Error).message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user as IUser;

    // Get player data
    const player = await Player.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        player: player ? {
          id: player._id,
          level: player.level,
          experience: player.experience,
          gold: player.gold,
          stats: {
            health: {
              current: player.stats?.health?.current || 0,
              max: player.stats?.health?.max || 100
            },
            mana: {
              current: player.stats?.mana?.current || 0,
              max: player.stats?.mana?.max || 50
            },
            strength: player.stats?.strength || 10,
            dexterity: player.stats?.dexterity || 10,
            intelligence: player.stats?.intelligence || 10,
            vitality: player.stats?.vitality || 10
          },
          skills: player.skills,
          location: player.currentLocation,
          lastPlayed: player.lastPlayed
        } : null
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: (error as Error).message
    });
  }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a JWT-based system, logout is primarily handled client-side
    // This endpoint can be used for logging or cleanup
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: (error as Error).message
    });
  }
};
