/**
 * Construction Service
 * Handles construction project creation, contributions, and completion
 */

import { ConstructionProject, IConstructionProject, ProjectType, MaterialRequirement } from '../models/ConstructionProject';
import { IPlayer } from '../models/Player';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import propertyService, { PROPERTY_TIERS } from './propertyService';
import { PropertyTier } from '../models/Property';

// ============================================================================
// Material Requirements by Project Type
// ============================================================================

export const MATERIAL_REQUIREMENTS = {
  cottage: {
    planks: 500,
    nails: 100
  },
  house: {
    planks: 1500,
    nails: 300,
    stone: 100
  },
  manor: {
    planks: 3000,
    nails: 600,
    stone: 300,
    glass: 100
  },
  estate: {
    planks: 5000,
    nails: 1000,
    stone: 600,
    glass: 300
  },
  'grand-estate': {
    planks: 8000,
    nails: 1500,
    stone: 1000,
    glass: 500
  }
};

// ============================================================================
// Project Creation
// ============================================================================

/**
 * Create a new house construction project
 */
export async function createHouseProject(
  player: IPlayer,
  tier: PropertyTier,
  location: string
): Promise<IConstructionProject> {
  const tierConfig = PROPERTY_TIERS[tier];
  const materials = MATERIAL_REQUIREMENTS[tier];

  // Validate player can afford the plot
  const affordCheck = propertyService.canAffordProperty(tier, player.gold, player.skills.construction.level);
  if (!affordCheck.canAfford) {
    throw new Error(affordCheck.reason || 'Cannot afford property');
  }

  // Create project
  const projectId = `project-${uuidv4()}`;
  const requiredMaterials = new Map<string, MaterialRequirement>();

  // Add material requirements
  Object.entries(materials).forEach(([itemId, required]) => {
    requiredMaterials.set(itemId, {
      itemId,
      required,
      contributed: 0
    });
  });

  const project = new ConstructionProject({
    projectId,
    projectType: 'house',
    ownerId: player.userId,
    ownerName: player.userId.toString(), // Will be updated with username
    propertyId: null,
    location,
    requiredMaterials,
    requiredGold: tierConfig.plotCost,
    goldPaid: false,
    totalActions: tierConfig.buildActions,
    completedActions: 0,
    contributors: new Map(),
    rewards: {
      baseXP: tierConfig.buildActions * 20, // 20 XP per action when split
      ownerBonusXP: 500,
      completionItem: null
    },
    status: 'in-progress',
    startedAt: new Date()
  });

  await project.save();
  return project;
}

/**
 * Create a room construction project
 */
export async function createRoomProject(
  player: IPlayer,
  propertyId: string,
  roomType: string,
  location: string
): Promise<IConstructionProject> {
  const projectId = `project-${uuidv4()}`;

  // Room construction requires fewer materials
  const requiredMaterials = new Map<string, MaterialRequirement>();
  requiredMaterials.set('planks', { itemId: 'planks', required: 100, contributed: 0 });
  requiredMaterials.set('nails', { itemId: 'nails', required: 20, contributed: 0 });

  const project = new ConstructionProject({
    projectId,
    projectType: 'room',
    ownerId: player.userId,
    ownerName: player.userId.toString(),
    propertyId,
    location,
    requiredMaterials,
    requiredGold: 0,
    goldPaid: true,
    totalActions: 20,
    completedActions: 0,
    contributors: new Map(),
    rewards: {
      baseXP: 400, // 20 XP per action
      ownerBonusXP: 100,
      completionItem: null
    },
    status: 'in-progress',
    startedAt: new Date()
  });

  await project.save();
  return project;
}

// ============================================================================
// Project Contribution
// ============================================================================

/**
 * Contribute to a construction project (perform actions)
 */
export async function contributeToProject(
  project: IConstructionProject,
  player: IPlayer,
  actionCount: number = 1
): Promise<{
  project: IConstructionProject;
  xpAwarded: number;
  completed: boolean;
}> {
  if (project.status !== 'in-progress') {
    throw new Error('Project is not active');
  }

  if (project.completedActions >= project.totalActions) {
    throw new Error('Project is already complete');
  }

  // Add player as contributor if not already
  const userId = player.userId.toString();
  let contributor = project.contributors.get(userId);

  if (!contributor) {
    contributor = {
      userId: player.userId,
      username: player.userId.toString(), // Will be updated with actual username
      actionsCompleted: 0,
      materialsContributed: new Map()
    };
    project.contributors.set(userId, contributor);
  }

  // Update contribution
  const actualActions = Math.min(actionCount, project.totalActions - project.completedActions);
  contributor.actionsCompleted += actualActions;
  project.completedActions += actualActions;

  // Calculate XP for this contribution (small amount per action)
  const xpPerAction = 5; // Small immediate reward
  const xpAwarded = xpPerAction * actualActions;

  // Check if project is complete
  const completed = project.completedActions >= project.totalActions;

  if (completed) {
    project.status = 'completed';
    project.completedAt = new Date();
  }

  await project.save();

  return { project, xpAwarded, completed };
}

/**
 * Pay gold for project (plot purchase)
 */
export async function payProjectGold(
  project: IConstructionProject,
  player: IPlayer
): Promise<IConstructionProject> {
  if (project.goldPaid) {
    throw new Error('Gold already paid for this project');
  }

  if (player.gold < project.requiredGold) {
    throw new Error(`Insufficient gold (need ${project.requiredGold}g)`);
  }

  player.gold -= project.requiredGold;
  project.goldPaid = true;

  await player.save();
  await project.save();

  return project;
}

// ============================================================================
// Project Completion
// ============================================================================

/**
 * Complete a construction project and create the property
 */
export async function completeProject(
  project: IConstructionProject
): Promise<{
  property: any;
  rewards: Map<string, { userId: string; username: string; xpAwarded: number }>;
}> {
  if (project.status !== 'completed') {
    throw new Error('Project is not complete');
  }

  let property = null;

  // Create the property based on project type
  if (project.projectType === 'house') {
    const tier = determineTierFromMaterials(project.requiredMaterials);
    property = await propertyService.createProperty(
      project.ownerId,
      tier,
      project.location
    );
  } else if (project.projectType === 'room' && project.propertyId) {
    // Add room to existing property
    property = await propertyService.addRoom(
      project.propertyId,
      'workshop', // Default room type, should be specified in project data
      1
    );
  }

  // Calculate final XP rewards for all contributors
  const rewards = new Map<string, { userId: string; username: string; xpAwarded: number }>();

  project.contributors.forEach((contributor, userId) => {
    const xp = project.calculateContributorXP(userId);
    rewards.set(userId, {
      userId,
      username: contributor.username,
      xpAwarded: xp
    });
  });

  return { property, rewards };
}

/**
 * Abandon a construction project (refund 80% of materials)
 */
export async function abandonProject(
  project: IConstructionProject,
  player: IPlayer
): Promise<{ refundedMaterials: Map<string, number>; refundedGold: number }> {
  if (project.ownerId.toString() !== player.userId.toString()) {
    throw new Error('Only the project owner can abandon it');
  }

  if (project.status !== 'in-progress') {
    throw new Error('Can only abandon in-progress projects');
  }

  // Calculate refunds (80% of contributed materials)
  const refundedMaterials = new Map<string, number>();
  project.requiredMaterials.forEach((req, itemId) => {
    if (req.contributed > 0) {
      const refund = Math.floor(req.contributed * 0.8);
      if (refund > 0) {
        refundedMaterials.set(itemId, refund);
      }
    }
  });

  const refundedGold = project.goldPaid ? Math.floor(project.requiredGold * 0.8) : 0;

  // Mark project as abandoned
  project.status = 'abandoned';
  project.completedAt = new Date();
  await project.save();

  return { refundedMaterials, refundedGold };
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get active projects at a location
 */
export async function getActiveProjectsAtLocation(location: string): Promise<IConstructionProject[]> {
  return await ConstructionProject.find({
    location,
    status: 'in-progress'
  }).sort({ startedAt: -1 });
}

/**
 * Get projects owned by a player
 */
export async function getPlayerProjects(
  ownerId: mongoose.Types.ObjectId,
  status?: string
): Promise<IConstructionProject[]> {
  const query: any = { ownerId };
  if (status) {
    query.status = status;
  }

  return await ConstructionProject.find(query).sort({ startedAt: -1 });
}

/**
 * Get project by ID
 */
export async function getProjectById(projectId: string): Promise<IConstructionProject | null> {
  return await ConstructionProject.findOne({ projectId });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determine property tier from material requirements
 */
function determineTierFromMaterials(materials: Map<string, MaterialRequirement>): PropertyTier {
  const planks = materials.get('planks')?.required || 0;

  if (planks >= 8000) return 'grand-estate';
  if (planks >= 5000) return 'estate';
  if (planks >= 3000) return 'manor';
  if (planks >= 1500) return 'house';
  return 'cottage';
}

/**
 * Calculate max properties based on construction level
 */
export function calculateMaxProperties(constructionLevel: number): number {
  return Math.floor(constructionLevel / 10) + 1;
}

export default {
  MATERIAL_REQUIREMENTS,
  createHouseProject,
  createRoomProject,
  contributeToProject,
  payProjectGold,
  completeProject,
  abandonProject,
  getActiveProjectsAtLocation,
  getPlayerProjects,
  getProjectById,
  calculateMaxProperties
};
