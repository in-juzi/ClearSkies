/**
 * Quest System Type Definitions
 *
 * Defines the structure for quests, objectives, requirements, and rewards.
 * Used by both frontend and backend for type consistency.
 */

// ==================== Enums ====================

export enum QuestCategory {
  TUTORIAL = 'tutorial',
  SKILLS = 'skills',
  EXPLORATION = 'exploration',
  COMBAT = 'combat',
  CRAFTING = 'crafting',
  STORY = 'story',
  OPTIONAL = 'optional'
}

export enum ObjectiveType {
  GATHER = 'gather',      // Complete gathering activity and acquire items
  CRAFT = 'craft',        // Craft specific recipe
  COMBAT = 'combat',      // Defeat monsters
  ACQUIRE = 'acquire',    // Own specific item (from any source)
  VISIT = 'visit',        // Travel to location or facility
  TALK = 'talk'           // Interact with NPC (simplified as facility visit)
}

export enum ResetInterval {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly'
}

// ==================== Quest Objectives ====================

export interface QuestObjective {
  objectiveId: string;
  type: ObjectiveType;
  description: string;

  // Type-specific fields (populated based on objective type)
  activityId?: string;    // For GATHER, COMBAT (activity-based combat)
  itemId?: string;        // For GATHER (item to acquire), ACQUIRE
  monsterId?: string;     // For COMBAT (monster to defeat)
  locationId?: string;    // For VISIT (location to discover)
  facilityId?: string;    // For VISIT, TALK (facility to visit)
  recipeId?: string;      // For CRAFT (recipe to craft)

  quantity: number;       // Number required to complete objective
}

// ==================== Quest Requirements ====================

export interface QuestRequirements {
  level?: number;                       // Minimum overall level
  skills?: Record<string, number>;      // Minimum skill levels (e.g., { fishing: 5 })
  quests?: string[];                    // Prerequisite quest IDs that must be completed
  items?: string[];                     // Required items in inventory
  locations?: string[];                 // Must have discovered these locations
}

// ==================== Quest Rewards ====================

export interface QuestRewards {
  experience?: Record<string, number>;  // Skill/attribute XP (e.g., { fishing: 50, endurance: 25 })
  items?: Array<{
    itemId: string;
    quantity: number;
  }>;
  gold?: number;
  unlocks?: {
    quests?: string[];                  // Quest IDs that become available
    recipes?: string[];                 // Recipe IDs that become unlocked
    locations?: string[];               // Location IDs that become discoverable
  };
}

// ==================== Quest Giver ====================

export interface QuestGiver {
  npcId: string;          // ID of NPC (e.g., 'dockmaster_halvard')
  locationId: string;     // Location where NPC is found
  facilityId: string;     // Facility where NPC is found
}

// ==================== Quest Dialogue ====================

export interface QuestDialogue {
  offer: string;          // Text when offering quest
  progress: string;       // Text when quest is in progress
  complete: string;       // Text when quest is complete
  decline?: string;       // Text if player declines (optional)
}

// ==================== Quest Definition ====================

export interface Quest {
  questId: string;
  name: string;
  description: string;

  questGiver: QuestGiver;
  requirements: QuestRequirements;
  objectives: QuestObjective[];
  rewards: QuestRewards;

  category: QuestCategory;
  isRepeatable: boolean;
  resetInterval?: ResetInterval;
  autoAccept: boolean;              // Tutorial quests auto-start

  dialogue: QuestDialogue;
}

// ==================== Player Quest State (Runtime) ====================

export interface ObjectiveProgress {
  objectiveId: string;
  type: ObjectiveType;
  current: number;
  required: number;
  completed: boolean;
}

export interface ActiveQuest {
  questId: string;
  startedAt: Date;
  objectives: ObjectiveProgress[];
  turnedIn: boolean;                // true if complete but not yet turned in
}

export interface QuestProgress {
  quest: Quest;
  progress: ObjectiveProgress[];
  canTurnIn: boolean;
}

// ==================== Player Quest Data (Database Schema) ====================

export interface PlayerQuestData {
  active: ActiveQuest[];
  completed: string[];              // Array of completed quest IDs
  available: string[];              // Cached available quest IDs
}
