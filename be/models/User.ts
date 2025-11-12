import mongoose, { Document, Schema, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

// ============================================================================
// Document Interface (represents a User document from MongoDB)
// ============================================================================

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastLogin(): Promise<void>;
  toJSON(): Partial<IUser>;
}

// ============================================================================
// Schema Definition
// ============================================================================

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ============================================================================
// Pre-save Middleware
// ============================================================================

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// ============================================================================
// Instance Methods
// ============================================================================

// Method to compare passwords
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function(this: IUser): Promise<void> {
  this.lastLogin = new Date();
  await this.save();
};

// Hide sensitive data when converting to JSON
userSchema.methods.toJSON = function(this: IUser): Partial<IUser> {
  const user = this.toObject();
  delete user.password;
  delete (user as any).__v;
  return user;
};

// ============================================================================
// Model Export
// ============================================================================

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
