/**
 * Shared model types for frontend/backend
 *
 * Export this file to frontend for type-safe API communication
 */

import { SkillName, AttributeName, Skill, Attribute, Stats } from './common';
import { CombatLogType } from './combat';

// ============================================================================
// User Model Types
// ============================================================================

export interface UserModel {
  _id: string;
  username: string;
  email: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Chat Message Model Types
// ============================================================================

export type ChatChannel = 'global';

export interface ChatMessageModel {
  _id: string;
  userId: string;
  username: string;
  message: string;
  channel: ChatChannel;
  createdAt: Date;
}

// ============================================================================
// Player Model Types
// ============================================================================

export interface InventoryItemModel {
  instanceId: string;
  itemId: string;
  quantity: number;
  qualities: Record<string, number>; // Plain object for JSON serialization
  traits: Record<string, number>; // Plain object for JSON serialization
  equipped: boolean;
  acquiredAt: Date;
}

export interface ActiveActivityModel {
  activityId: string;
  facilityId: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
}

export interface TravelStateModel {
  isTravel: boolean;
  targetLocationId?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface ActiveCraftingModel {
  recipeId?: string;
  startTime?: Date;
  endTime?: Date;
  selectedIngredients?: Record<string, string[]>; // Plain object for JSON
}

export interface CombatLogEntryModel {
  timestamp: Date;
  message: string;
  type: CombatLogType;
}

export interface ActiveCombatModel {
  activityId?: string;
  monsterId?: string;
  monsterInstance?: Record<string, any>; // Plain object for JSON
  playerLastAttackTime?: Date;
  monsterLastAttackTime?: Date;
  playerNextAttackTime?: Date;
  monsterNextAttackTime?: Date;
  turnCount: number;
  abilityCooldowns?: Record<string, number>; // Plain object for JSON
  combatLog: CombatLogEntryModel[];
  startTime?: Date;
}

export interface CombatStatsModel {
  monstersDefeated: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  deaths: number;
  criticalHits: number;
  dodges: number;
}

export interface QuestProgressModel {
  questId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: Record<string, any>;
}

export interface AchievementModel {
  achievementId: string;
  unlockedAt: Date;
}

export interface PlayerStatsModel {
  health: Stats;
  mana: Stats;
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface PlayerModel {
  _id: string;
  userId: string;
  level: number;
  experience: number;
  stats: PlayerStatsModel;
  gold: number;
  inventory: InventoryItemModel[];
  inventoryCapacity: number;
  equipmentSlots: Record<string, string | null>; // Plain object for JSON
  currentLocation: string;
  discoveredLocations: string[];
  activeActivity?: ActiveActivityModel;
  travelState?: TravelStateModel;
  activeCrafting?: ActiveCraftingModel;
  activeCombat?: ActiveCombatModel;
  lastCombatActivityId?: string;
  combatStats: CombatStatsModel;
  questProgress: QuestProgressModel[];
  achievements: AchievementModel[];
  attributes: Record<AttributeName, Attribute>;
  skills: Record<SkillName, Skill>;
  createdAt: Date;
  lastPlayed: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: Pick<UserModel, '_id' | 'username' | 'email' | 'createdAt' | 'lastLogin'>;
    player: Pick<PlayerModel, '_id' | 'level' | 'gold'> & { location?: string } | null;
    token: string;
  };
  errors?: any[];
}

export interface PlayerProfileResponse {
  success: boolean;
  data?: {
    user: Pick<UserModel, '_id' | 'username' | 'email' | 'lastLogin' | 'createdAt'>;
    player: Pick<PlayerModel, '_id' | 'level' | 'experience' | 'gold' | 'stats' | 'skills' | 'lastPlayed'> & { location?: string } | null;
  };
}

export interface InventoryResponse {
  inventory: any[]; // Enhanced with item details
  capacity: number;
  size: number;
  totalValue: number;
}

export interface EquippedItemsResponse {
  equippedItems: Record<string, any>; // Enhanced with item details
  slots: Record<string, string | null>;
}
