/**
 * Quest Registry
 *
 * Central registry for all quest definitions in the game.
 * Quests are organized by category (tutorial, skills, exploration, combat, crafting, story).
 */

import { Quest } from '@shared/types';

// Tutorial Quests
import { WelcomeToKennik } from './definitions/tutorial/WelcomeToKennik';
import { FirstCatch } from './definitions/tutorial/FirstCatch';
import { HerbGathering101 } from './definitions/tutorial/HerbGathering101';
import { HealingHands } from './definitions/tutorial/HealingHands';
import { IntoTheWoods } from './definitions/tutorial/IntoTheWoods';

// Optional Quests (Phase 2)
import { SharpeningYourSkills } from './definitions/optional/SharpeningYourSkills';
import { AlchemistsApprentice } from './definitions/optional/AlchemistsApprentice';
import { OreYouReady } from './definitions/optional/OreYouReady';
import { FirstBlood } from './definitions/optional/FirstBlood';
import { ToolTime } from './definitions/optional/ToolTime';
import { CulinaryBasics } from './definitions/optional/CulinaryBasics';
import { FullyEquipped } from './definitions/optional/FullyEquipped';

// Skill Quests (Phase 4 - not yet implemented)
// import { WoodcuttersCraft } from './definitions/skills/WoodcuttersCraft';
// import { MiningForBronze } from './definitions/skills/MiningForBronze';
// import { FirstForge } from './definitions/skills/FirstForge';
// import { TrialByFire } from './definitions/skills/TrialByFire';

// Exploration Quests (Phase 4 - not yet implemented)
// import { GoblinThreat } from './definitions/exploration/GoblinThreat';
// import { MountainMineMystery } from './definitions/exploration/MountainMineMystery';
// import { RareHerbsOfMoonlitMeadow } from './definitions/exploration/RareHerbsOfMoonlitMeadow';

// ============================================================================
// Quest Registry
// ============================================================================

const QUESTS: Quest[] = [
  // Tutorial Quests (5 quests)
  WelcomeToKennik,
  FirstCatch,
  HerbGathering101,
  HealingHands,
  IntoTheWoods,

  // Optional Quests (7 quests - Phase 2)
  SharpeningYourSkills,
  AlchemistsApprentice,
  OreYouReady,
  FirstBlood,
  ToolTime,
  CulinaryBasics,
  FullyEquipped,

  // Skill Quests (Phase 4)
  // WoodcuttersCraft,
  // MiningForBronze,
  // FirstForge,
  // TrialByFire,

  // Exploration Quests (Phase 4)
  // GoblinThreat,
  // MountainMineMystery,
  // RareHerbsOfMoonlitMeadow,
];

// ============================================================================
// Registry Functions
// ============================================================================

/**
 * Get all quests in the registry
 */
export function getAllQuests(): Quest[] {
  return QUESTS;
}

/**
 * Get a specific quest by ID
 */
export function getQuest(questId: string): Quest | undefined {
  return QUESTS.find(q => q.questId === questId);
}

/**
 * Get quests by category
 */
export function getQuestsByCategory(category: string): Quest[] {
  return QUESTS.filter(q => q.category === category);
}

/**
 * Get all tutorial quests
 */
export function getTutorialQuests(): Quest[] {
  return getQuestsByCategory('tutorial');
}

/**
 * Get all skill quests
 */
export function getSkillQuests(): Quest[] {
  return getQuestsByCategory('skills');
}

/**
 * Get all exploration quests
 */
export function getExplorationQuests(): Quest[] {
  return getQuestsByCategory('exploration');
}

/**
 * Get all optional quests
 */
export function getOptionalQuests(): Quest[] {
  return getQuestsByCategory('optional');
}

/**
 * Check if a quest exists
 */
export function questExists(questId: string): boolean {
  return QUESTS.some(q => q.questId === questId);
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  getAllQuests,
  getQuest,
  getQuestsByCategory,
  getTutorialQuests,
  getSkillQuests,
  getExplorationQuests,
  getOptionalQuests,
  questExists
};
