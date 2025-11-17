/**
 * Quest Service
 *
 * Handles all quest-related logic including:
 * - Quest availability checking
 * - Quest acceptance/abandonment
 * - Objective progress tracking
 * - Quest completion and rewards
 * - Auto-accept system for tutorial quests
 * - Integration with activity/crafting/combat/location systems
 */

import { Quest, ObjectiveType, ObjectiveProgress, ActiveQuest, QuestRewards } from '@shared/types';
import QuestRegistry from '../data/quests/QuestRegistry';
import Player, { IPlayer } from '../models/Player';
import itemService from './itemService';

// ============================================================================
// Registry Management
// ============================================================================

/**
 * Get all quest definitions
 */
export function getAllQuests(): Quest[] {
  return QuestRegistry.getAllQuests();
}

/**
 * Get a specific quest definition by ID
 */
export function getQuest(questId: string): Quest | undefined {
  return QuestRegistry.getQuest(questId);
}

// ============================================================================
// Quest Availability
// ============================================================================

/**
 * Check if player meets requirements for a quest
 */
export function meetsRequirements(player: IPlayer, quest: Quest): boolean {
  const { requirements } = quest;

  // Check level requirement
  if (requirements.level && player.level < requirements.level) {
    return false;
  }

  // Check skill requirements
  if (requirements.skills) {
    for (const [skillName, requiredLevel] of Object.entries(requirements.skills)) {
      const playerSkill = player.skills[skillName as keyof typeof player.skills];
      if (!playerSkill || playerSkill.level < requiredLevel) {
        return false;
      }
    }
  }

  // Check prerequisite quests
  if (requirements.quests) {
    for (const prereqQuestId of requirements.quests) {
      if (!player.isQuestCompleted(prereqQuestId)) {
        return false;
      }
    }
  }

  // Check required items
  if (requirements.items) {
    for (const itemId of requirements.items) {
      if (!player.hasInventoryItem(itemId, 1)) {
        return false;
      }
    }
  }

  // Check discovered locations
  if (requirements.locations) {
    for (const locationId of requirements.locations) {
      if (!player.discoveredLocations.includes(locationId)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get all quests player qualifies for (meets requirements, not active/completed)
 */
export function getAvailableQuests(player: IPlayer): Quest[] {
  const allQuests = getAllQuests();

  return allQuests.filter(quest => {
    // Must meet requirements
    if (!meetsRequirements(player, quest)) {
      return false;
    }

    // Must not be active
    if (player.isQuestActive(quest.questId)) {
      return false;
    }

    // Must not be completed (unless repeatable)
    if (player.isQuestCompleted(quest.questId) && !quest.isRepeatable) {
      return false;
    }

    return true;
  });
}

/**
 * Check if player can accept a specific quest
 */
export function canAcceptQuest(player: IPlayer, questId: string): { canAccept: boolean; reason?: string } {
  const quest = getQuest(questId);
  if (!quest) {
    return { canAccept: false, reason: 'Quest not found' };
  }

  if (player.isQuestActive(questId)) {
    return { canAccept: false, reason: 'Quest already active' };
  }

  if (player.isQuestCompleted(questId) && !quest.isRepeatable) {
    return { canAccept: false, reason: 'Quest already completed' };
  }

  if (!meetsRequirements(player, quest)) {
    return { canAccept: false, reason: 'Requirements not met' };
  }

  return { canAccept: true };
}

// ============================================================================
// Quest Management
// ============================================================================

/**
 * Accept a quest
 */
export async function acceptQuest(player: IPlayer, questId: string): Promise<{ success: boolean; message: string; quest?: ActiveQuest }> {
  const check = canAcceptQuest(player, questId);
  if (!check.canAccept) {
    return { success: false, message: check.reason || 'Cannot accept quest' };
  }

  const quest = getQuest(questId);
  if (!quest) {
    return { success: false, message: 'Quest not found' };
  }

  // Initialize quest objectives
  const objectives: ObjectiveProgress[] = quest.objectives.map(obj => ({
    objectiveId: obj.objectiveId,
    type: obj.type,
    current: 0,
    required: obj.quantity,
    completed: false
  }));

  // Add quest to player's active quests
  player.acceptQuest(questId, objectives);
  await player.save();

  const activeQuest = player.getActiveQuest(questId);

  return {
    success: true,
    message: `Quest "${quest.name}" accepted!`,
    quest: activeQuest
  };
}

/**
 * Abandon a quest
 */
export async function abandonQuest(player: IPlayer, questId: string): Promise<{ success: boolean; message: string }> {
  const quest = getQuest(questId);
  if (!quest) {
    return { success: false, message: 'Quest not found' };
  }

  // Cannot abandon tutorial quests (auto-accept quests)
  if (quest.autoAccept) {
    return { success: false, message: 'Tutorial quests cannot be abandoned' };
  }

  if (!player.isQuestActive(questId)) {
    return { success: false, message: 'Quest is not active' };
  }

  // Remove from active quests
  player.quests.active = player.quests.active.filter((q: ActiveQuest) => q.questId !== questId);
  await player.save();

  return {
    success: true,
    message: `Quest "${quest.name}" abandoned`
  };
}

// ============================================================================
// Objective Tracking
// ============================================================================

/**
 * Update quest objective progress
 */
export async function updateObjectiveProgress(
  player: IPlayer,
  questId: string,
  objectiveId: string,
  amount: number = 1
): Promise<ObjectiveProgress | null> {
  const objective = player.updateQuestObjective(questId, objectiveId, amount);

  if (objective) {
    await player.save();
  }

  return objective;
}

/**
 * Check if all objectives in a quest are completed
 */
export function areAllObjectivesCompleted(player: IPlayer, questId: string): boolean {
  const activeQuest = player.getActiveQuest(questId);
  if (!activeQuest) {
    return false;
  }

  return activeQuest.objectives.every((obj: ObjectiveProgress) => obj.completed);
}

// ============================================================================
// Quest Completion & Rewards
// ============================================================================

/**
 * Turn in a completed quest and distribute rewards
 */
export async function turnInQuest(player: IPlayer, questId: string): Promise<{ success: boolean; message: string; rewards?: QuestRewards }> {
  const quest = getQuest(questId);
  if (!quest) {
    return { success: false, message: 'Quest not found' };
  }

  const activeQuest = player.getActiveQuest(questId);
  if (!activeQuest) {
    return { success: false, message: 'Quest is not active' };
  }

  // Check if all objectives are completed
  if (!areAllObjectivesCompleted(player, questId)) {
    return { success: false, message: 'Not all objectives are completed' };
  }

  // Distribute rewards
  const rewards = quest.rewards;

  // Award XP
  if (rewards.experience) {
    for (const [skillOrAttribute, xpAmount] of Object.entries(rewards.experience)) {
      if (player.skills[skillOrAttribute as keyof typeof player.skills]) {
        await player.addSkillExperience(skillOrAttribute as any, xpAmount);
      } else if (player.attributes[skillOrAttribute as keyof typeof player.attributes]) {
        await player.addAttributeExperience(skillOrAttribute as any, xpAmount);
      }
    }
  }

  // Award gold
  if (rewards.gold) {
    player.addGold(rewards.gold);
  }

  // Award items
  if (rewards.items) {
    for (const itemReward of rewards.items) {
      const itemDef = itemService.getItemDefinition(itemReward.itemId);
      if (itemDef) {
        for (let i = 0; i < itemReward.quantity; i++) {
          const instance = itemService.createItemInstance(itemReward.itemId);
          player.addItem(instance);
        }
      }
    }
  }

  // Unlock recipes
  if (rewards.unlocks?.recipes) {
    for (const recipeId of rewards.unlocks.recipes) {
      if (!player.unlockedRecipes.includes(recipeId)) {
        player.unlockedRecipes.push(recipeId);
      }
    }
  }

  // Remove from active quests
  player.quests.active = player.quests.active.filter((q: ActiveQuest) => q.questId !== questId);

  // Add to completed quests
  if (!player.quests.completed.includes(questId)) {
    player.quests.completed.push(questId);
  }

  await player.save();

  // Check for auto-accept quests that are now available
  await checkAutoAcceptQuests(player);

  return {
    success: true,
    message: `Quest "${quest.name}" completed!`,
    rewards
  };
}

// ============================================================================
// Auto-Accept System
// ============================================================================

/**
 * Check for tutorial quests that should auto-accept
 */
export async function checkAutoAcceptQuests(player: IPlayer): Promise<Quest[]> {
  const allQuests = getAllQuests();
  const autoAcceptedQuests: Quest[] = [];

  for (const quest of allQuests) {
    if (!quest.autoAccept) {
      continue;
    }

    // Skip if already active or completed
    if (player.isQuestActive(quest.questId) || player.isQuestCompleted(quest.questId)) {
      continue;
    }

    // Check if requirements are met
    if (meetsRequirements(player, quest)) {
      const result = await acceptQuest(player, quest.questId);
      if (result.success) {
        autoAcceptedQuests.push(quest);
      }
    }
  }

  return autoAcceptedQuests;
}

// ============================================================================
// Event Handlers (Integration with Game Systems)
// ============================================================================

/**
 * Called when player completes an activity
 */
export async function onActivityComplete(
  player: IPlayer,
  activityId: string,
  itemsAwarded: any[]
): Promise<ObjectiveProgress[]> {
  const updatedObjectives: ObjectiveProgress[] = [];

  for (const activeQuest of player.quests.active) {
    const quest = getQuest(activeQuest.questId);
    if (!quest) continue;

    for (const objective of quest.objectives) {
      if (objective.type === ObjectiveType.GATHER && objective.activityId === activityId) {
        // Check if player received the required item
        const receivedItem = itemsAwarded.find((item: any) => item.itemId === objective.itemId);
        if (receivedItem) {
          const updated = await updateObjectiveProgress(
            player,
            activeQuest.questId,
            objective.objectiveId,
            receivedItem.quantity || 1
          );
          if (updated) {
            updatedObjectives.push(updated);
          }
        }
      }
    }
  }

  return updatedObjectives;
}

/**
 * Called when player acquires an item
 */
export async function onItemAcquired(
  player: IPlayer,
  itemId: string,
  quantity: number
): Promise<ObjectiveProgress[]> {
  const updatedObjectives: ObjectiveProgress[] = [];

  for (const activeQuest of player.quests.active) {
    const quest = getQuest(activeQuest.questId);
    if (!quest) continue;

    for (const objective of quest.objectives) {
      if (objective.type === ObjectiveType.ACQUIRE && objective.itemId === itemId) {
        const updated = await updateObjectiveProgress(
          player,
          activeQuest.questId,
          objective.objectiveId,
          quantity
        );
        if (updated) {
          updatedObjectives.push(updated);
        }
      }
    }
  }

  return updatedObjectives;
}

/**
 * Called when player defeats a monster
 */
export async function onMonsterDefeated(
  player: IPlayer,
  monsterId: string
): Promise<ObjectiveProgress[]> {
  const updatedObjectives: ObjectiveProgress[] = [];

  for (const activeQuest of player.quests.active) {
    const quest = getQuest(activeQuest.questId);
    if (!quest) continue;

    for (const objective of quest.objectives) {
      if (objective.type === ObjectiveType.COMBAT && objective.monsterId === monsterId) {
        const updated = await updateObjectiveProgress(
          player,
          activeQuest.questId,
          objective.objectiveId,
          1
        );
        if (updated) {
          updatedObjectives.push(updated);
        }
      }
    }
  }

  return updatedObjectives;
}

/**
 * Called when player discovers a location or visits a facility
 */
export async function onLocationDiscovered(
  player: IPlayer,
  locationId: string,
  facilityId?: string
): Promise<{ objectives: ObjectiveProgress[]; newQuests: Quest[] }> {
  const updatedObjectives: ObjectiveProgress[] = [];

  for (const activeQuest of player.quests.active) {
    const quest = getQuest(activeQuest.questId);
    if (!quest) continue;

    for (const objective of quest.objectives) {
      // Check location visit objectives
      if (objective.type === ObjectiveType.VISIT && objective.locationId === locationId) {
        // If no facility required, or facility matches
        if (!objective.facilityId || objective.facilityId === facilityId) {
          const updated = await updateObjectiveProgress(
            player,
            activeQuest.questId,
            objective.objectiveId,
            1
          );
          if (updated) {
            updatedObjectives.push(updated);
          }
        }
      }

      // Check talk objectives (same as visit)
      if (objective.type === ObjectiveType.TALK && objective.facilityId === facilityId) {
        const updated = await updateObjectiveProgress(
          player,
          activeQuest.questId,
          objective.objectiveId,
          1
        );
        if (updated) {
          updatedObjectives.push(updated);
        }
      }
    }
  }

  // Check for new auto-accept quests
  const newQuests = await checkAutoAcceptQuests(player);

  return { objectives: updatedObjectives, newQuests };
}

/**
 * Called when player crafts a recipe
 */
export async function onRecipeCrafted(
  player: IPlayer,
  recipeId: string
): Promise<ObjectiveProgress[]> {
  const updatedObjectives: ObjectiveProgress[] = [];

  for (const activeQuest of player.quests.active) {
    const quest = getQuest(activeQuest.questId);
    if (!quest) continue;

    for (const objective of quest.objectives) {
      // Standard CRAFT objective with specific recipeId
      if (objective.type === ObjectiveType.CRAFT && objective.recipeId === recipeId) {
        const updated = await updateObjectiveProgress(
          player,
          activeQuest.questId,
          objective.objectiveId,
          1
        );
        if (updated) {
          updatedObjectives.push(updated);
        }
      }

      // Special handling: CulinaryBasics quest - any cooking recipe counts
      if (
        activeQuest.questId === 'optional_culinary_basics' &&
        objective.objectiveId === 'cook_meals' &&
        recipeId.includes('cook') // Any cooking recipe
      ) {
        const updated = await updateObjectiveProgress(
          player,
          activeQuest.questId,
          objective.objectiveId,
          1
        );
        if (updated) {
          updatedObjectives.push(updated);
        }
      }
    }
  }

  return updatedObjectives;
}

/**
 * Called when player levels up a skill
 * Used for "Sharpening Your Skills" quest tracking
 */
export async function onSkillLevelUp(
  player: IPlayer,
  skillName: string,
  newLevel: number
): Promise<ObjectiveProgress[]> {
  const updatedObjectives: ObjectiveProgress[] = [];

  // Check if player has Sharpening Your Skills quest active
  const questId = 'optional_sharpening_skills';
  const activeQuest = player.getActiveQuest(questId);

  if (activeQuest && newLevel >= 5) {
    // Check if it's a gathering skill
    const gatheringSkills = ['woodcutting', 'mining', 'fishing', 'gathering'];
    if (gatheringSkills.includes(skillName)) {
      const updated = await updateObjectiveProgress(
        player,
        questId,
        'reach_level_5',
        1
      );
      if (updated) {
        updatedObjectives.push(updated);
      }
    }
  }

  return updatedObjectives;
}

/**
 * Called when player equips an item
 * Used for "Fully Equipped" quest tracking
 */
export async function onItemEquipped(player: IPlayer): Promise<ObjectiveProgress[]> {
  const updatedObjectives: ObjectiveProgress[] = [];

  // Check if player has Fully Equipped quest active
  const questId = 'optional_fully_equipped';
  const activeQuest = player.getActiveQuest(questId);

  if (activeQuest) {
    // Count how many equipment slots are filled
    let filledSlots = 0;
    const equipmentSlots = player.equipmentSlots;

    for (const [slot, instanceId] of equipmentSlots.entries()) {
      if (instanceId) {
        filledSlots++;
      }
    }

    // Update objective with current count (overwrites, doesn't add)
    const objective = activeQuest.objectives.find(obj => obj.objectiveId === 'equip_all_slots');
    if (objective) {
      // Directly set the current value
      objective.current = filledSlots;
      objective.completed = filledSlots >= 10;
      await player.save();
      updatedObjectives.push(objective);
    }
  }

  return updatedObjectives;
}

// ============================================================================
// UI/Journal Functions
// ============================================================================

/**
 * Get player's active quests with full details
 */
export function getActiveQuests(player: IPlayer): ActiveQuest[] {
  return player.quests.active || [];
}

/**
 * Get player's completed quest IDs
 */
export function getCompletedQuests(player: IPlayer): string[] {
  return player.quests.completed || [];
}

/**
 * Get detailed quest progress for a specific quest
 */
export function getQuestProgress(player: IPlayer, questId: string): { quest: Quest; progress: ObjectiveProgress[]; canTurnIn: boolean } | null {
  const quest = getQuest(questId);
  if (!quest) {
    return null;
  }

  const activeQuest = player.getActiveQuest(questId);
  if (!activeQuest) {
    return null;
  }

  const canTurnIn = areAllObjectivesCompleted(player, questId);

  return {
    quest,
    progress: activeQuest.objectives,
    canTurnIn
  };
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  getAllQuests,
  getQuest,
  meetsRequirements,
  getAvailableQuests,
  canAcceptQuest,
  acceptQuest,
  abandonQuest,
  updateObjectiveProgress,
  areAllObjectivesCompleted,
  turnInQuest,
  checkAutoAcceptQuests,
  onActivityComplete,
  onItemAcquired,
  onMonsterDefeated,
  onLocationDiscovered,
  onRecipeCrafted,
  onSkillLevelUp,
  onItemEquipped,
  getActiveQuests,
  getCompletedQuests,
  getQuestProgress
};
