/**
 * Achievement System Type Definitions
 *
 * Defines the structure for achievements, tracking long-term player milestones
 * separate from the quest system. Achievements reward cosmetic titles and decorations.
 */

// ==================== Enums ====================

export enum AchievementCategory {
  COMBAT = 'combat',
  CRAFTING = 'crafting',
  GATHERING = 'gathering',
  EXPLORATION = 'exploration',
  SOCIAL = 'social',
  WEALTH = 'wealth'
}

export enum RequirementType {
  COUNT = 'count',            // Count occurrences (e.g., monsters defeated)
  THRESHOLD = 'threshold',    // Reach a threshold (e.g., gold earned)
  COLLECTION = 'collection'   // Collect all items in a set
}

// ==================== Achievement Requirement ====================

export interface AchievementRequirement {
  type: RequirementType;
  target: number;               // Target value to reach
  metric: string;               // What to track (e.g., 'monsters_defeated', 'gold_earned')
}

// ==================== Achievement Reward ====================

export interface AchievementReward {
  title?: string;               // Title text (e.g., "Dragon Slayer")
  decoration?: string;          // Chat decoration/badge ID
}

// ==================== Achievement Definition ====================

export interface Achievement {
  achievementId: string;
  name: string;
  description: string;
  category: AchievementCategory;

  requirement: AchievementRequirement;
  reward: AchievementReward;

  isSecret: boolean;            // Hidden until unlocked
}

// ==================== Player Achievement Progress (Runtime) ====================

export interface AchievementProgress {
  achievementId: string;
  progress: number;             // Current progress toward target
  unlockedAt?: Date;            // Timestamp when unlocked (undefined if not yet unlocked)
}

// ==================== Player Achievement Data (Database Schema) ====================

export interface PlayerAchievementData {
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

export interface PlayerTitleData {
  titles: string[];             // Array of unlocked title strings
  activeTitle: string | null;   // Currently equipped title
  decorations: string[];        // Array of unlocked decoration IDs
}
