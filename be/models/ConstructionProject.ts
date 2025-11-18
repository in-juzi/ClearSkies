/**
 * ConstructionProject Model
 * Represents active construction projects that players can collaborate on
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// Type Definitions
// ============================================================================

export type ProjectType = 'house' | 'room' | 'storage' | 'garden-plot' | 'shop' | 'workshop';
export type ProjectStatus = 'in-progress' | 'completed' | 'abandoned';

export interface MaterialRequirement {
  itemId: string;
  required: number;
  contributed: number;
}

export interface Contributor {
  userId: mongoose.Types.ObjectId;
  username: string;
  actionsCompleted: number;
  materialsContributed: Map<string, number>; // itemId -> quantity
}

export interface IConstructionProject extends Document {
  projectId: string;
  projectType: ProjectType;
  ownerId: mongoose.Types.ObjectId; // Reference to User
  ownerName: string;
  propertyId: string | null; // null if building new property
  location: string; // Where the project is located

  // Project requirements
  requiredMaterials: Map<string, MaterialRequirement>; // itemId -> requirement
  requiredGold: number;
  goldPaid: boolean;

  // Progress tracking
  totalActions: number;
  completedActions: number;

  // Contributors and rewards
  contributors: Map<string, Contributor>; // userId -> contributor data
  rewards: {
    baseXP: number; // Split proportionally by actions
    ownerBonusXP: number; // Extra for owner
    completionItem: string | null; // e.g., property deed
  };

  status: ProjectStatus;
  startedAt: Date;
  completedAt: Date | null;

  // Methods
  calculateContributorXP(userId: string): number;
  isComplete(): boolean;
}

// ============================================================================
// Schema Definition
// ============================================================================

const constructionProjectSchema = new Schema<IConstructionProject>({
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  projectType: {
    type: String,
    enum: ['house', 'room', 'storage', 'garden-plot', 'shop', 'workshop'],
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  ownerName: {
    type: String,
    required: true
  },
  propertyId: {
    type: String,
    default: null
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  requiredMaterials: {
    type: Map,
    of: {
      itemId: { type: String, required: true },
      required: { type: Number, required: true },
      contributed: { type: Number, default: 0 }
    },
    default: new Map()
  },
  requiredGold: {
    type: Number,
    default: 0
  },
  goldPaid: {
    type: Boolean,
    default: false
  },
  totalActions: {
    type: Number,
    required: true,
    min: 1
  },
  completedActions: {
    type: Number,
    default: 0,
    min: 0
  },
  contributors: {
    type: Map,
    of: {
      userId: { type: Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      actionsCompleted: { type: Number, default: 0 },
      materialsContributed: { type: Map, of: Number, default: new Map() }
    },
    default: new Map()
  },
  rewards: {
    baseXP: { type: Number, required: true },
    ownerBonusXP: { type: Number, default: 0 },
    completionItem: { type: String, default: null }
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress',
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// ============================================================================
// Indexes
// ============================================================================

constructionProjectSchema.index({ location: 1, status: 1 });
constructionProjectSchema.index({ ownerId: 1, status: 1 });
constructionProjectSchema.index({ status: 1, startedAt: -1 });

// ============================================================================
// Methods
// ============================================================================

// Calculate XP reward for a contributor based on their actions
constructionProjectSchema.methods.calculateContributorXP = function(
  this: IConstructionProject,
  userId: string
): number {
  const contributor = this.contributors.get(userId);
  if (!contributor) return 0;

  // Base XP is split proportionally by actions completed
  const xpPerAction = this.rewards.baseXP / this.totalActions;
  let xp = Math.floor(xpPerAction * contributor.actionsCompleted);

  // Owner gets bonus XP
  if (userId === this.ownerId.toString()) {
    xp += this.rewards.ownerBonusXP;
  }

  return xp;
};

// Check if project is complete
constructionProjectSchema.methods.isComplete = function(this: IConstructionProject): boolean {
  return this.completedActions >= this.totalActions;
};

// ============================================================================
// Export Model
// ============================================================================

export const ConstructionProject = mongoose.model<IConstructionProject>(
  'ConstructionProject',
  constructionProjectSchema
);
