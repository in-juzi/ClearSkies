/**
 * Reward Processor Service
 * Centralizes reward processing logic for activities, combat, crafting, and quests
 * Eliminates code duplication across handlers and controllers
 */
import { IPlayer } from '../models/Player';
import itemService from './itemService';
import playerInventoryService from './playerInventoryService';

/**
 * Reward structure for processing
 */
export interface RewardInput {
  experience?: Record<string, number>; // { skillId: xpAmount }
  items?: Array<{
    itemId: string;
    quantity: number;
    qualityBonus?: number;
    qualityMultiplier?: number;
  }>;
  gold?: number;
}

/**
 * Processed reward output
 */
export interface RewardOutput {
  xpRewards: Record<string, {
    skill: any;
    attribute: any;
  }>;
  itemsAdded: Array<{
    itemId: string;
    name: string;
    quantity: number;
    instanceId: string;
    qualities: any;
    traits: any;
    definition?: any;
  }>;
  goldAdded: number;
}

class RewardProcessor {
  /**
   * Process XP rewards for player
   * Awards XP to multiple skills and their linked attributes
   */
  async processXPRewards(
    player: IPlayer,
    experience: Record<string, number>
  ): Promise<Record<string, { skill: any; attribute: any }>> {
    const xpRewards: Record<string, { skill: any; attribute: any }> = {};

    for (const [skillId, xpAmount] of Object.entries(experience)) {
      if (xpAmount > 0) {
        const result = await player.addSkillExperience(skillId as any, xpAmount);
        xpRewards[skillId] = result;
      }
    }

    return xpRewards;
  }

  /**
   * Process item rewards for player
   * Generates item instances with random qualities/traits and adds to inventory
   */
  async processItemRewards(
    player: IPlayer,
    items: Array<{
      itemId: string;
      quantity: number;
      qualityBonus?: number;
      qualityMultiplier?: number;
    }>
  ): Promise<Array<{
    itemId: string;
    name: string;
    quantity: number;
    instanceId: string;
    qualities: any;
    traits: any;
    definition?: any;
  }>> {
    const itemsAdded: any[] = [];

    for (const itemReward of items) {
      // Generate random qualities and traits
      const qualities = itemService.generateRandomQualities(itemReward.itemId);
      const traits = itemService.generateRandomTraits(itemReward.itemId);

      // Create item instance
      const itemInstance = itemService.createItemInstance(
        itemReward.itemId,
        itemReward.quantity,
        qualities,
        traits
      );

      // Store instance ID before adding (to avoid circular ref)
      const instanceId = itemInstance.instanceId;

      // Add to player inventory using service
      playerInventoryService.addItem(player, itemInstance);

      // Get item definition for response
      const itemDef = itemService.getItemDefinition(itemReward.itemId);

      // Convert Maps to plain objects for JSON
      const plainQualities = qualities instanceof Map
        ? Object.fromEntries(qualities)
        : qualities;
      const plainTraits = traits instanceof Map
        ? Object.fromEntries(traits)
        : traits;

      itemsAdded.push({
        itemId: itemReward.itemId,
        name: itemDef?.name || itemReward.itemId,
        quantity: itemReward.quantity,
        instanceId,
        qualities: plainQualities,
        traits: plainTraits,
        definition: itemDef ? {
          icon: itemDef.icon,
          rarity: itemDef.rarity
        } : undefined
      });
    }

    return itemsAdded;
  }

  /**
   * Process gold rewards for player
   */
  processGoldReward(player: IPlayer, gold: number): number {
    if (gold > 0) {
      player.addGold(gold);
      return gold;
    }
    return 0;
  }

  /**
   * Process all rewards at once (XP, items, gold)
   * Single method for complete reward processing
   *
   * @param player - Player receiving rewards
   * @param rewards - Reward structure
   * @returns Processed rewards with details
   */
  async processRewards(
    player: IPlayer,
    rewards: RewardInput
  ): Promise<RewardOutput> {
    const result: RewardOutput = {
      xpRewards: {},
      itemsAdded: [],
      goldAdded: 0
    };

    // 1. Process XP rewards
    if (rewards.experience && Object.keys(rewards.experience).length > 0) {
      result.xpRewards = await this.processXPRewards(player, rewards.experience);
    }

    // 2. Process item rewards
    if (rewards.items && rewards.items.length > 0) {
      result.itemsAdded = await this.processItemRewards(player, rewards.items);
    }

    // 3. Process gold reward
    if (rewards.gold) {
      result.goldAdded = this.processGoldReward(player, rewards.gold);
    }

    // 4. Save player with all new rewards
    await player.save();

    return result;
  }

  /**
   * Process rewards with quest updates
   * Extended version that also triggers quest progress updates
   *
   * @param player - Player receiving rewards
   * @param rewards - Reward structure
   * @param context - Context for quest updates (activityId, recipeId, monsterId, etc.)
   * @returns Processed rewards with quest progress
   */
  async processRewardsWithQuests(
    player: IPlayer,
    rewards: RewardInput,
    context: {
      activityId?: string;
      recipeId?: string;
      monsterId?: string;
      itemsAdded?: any[];
    }
  ): Promise<RewardOutput & { questProgress: any[] }> {
    const questService = require('./questService');

    // Process standard rewards
    const result = await this.processRewards(player, rewards);

    // Update quest progress based on context
    let questProgress: any[] = [];

    if (context.activityId) {
      questProgress = await questService.onActivityComplete(
        player,
        context.activityId,
        result.itemsAdded
      );
    } else if (context.recipeId) {
      questProgress = await questService.onCraftingComplete(
        player,
        context.recipeId,
        result.itemsAdded
      );
    } else if (context.monsterId) {
      questProgress = await questService.onCombatVictory(
        player,
        context.monsterId
      );
    }

    return {
      ...result,
      questProgress: questProgress || []
    };
  }

  /**
   * Calculate total XP being awarded (for logging/display)
   */
  calculateTotalXP(experience: Record<string, number>): number {
    return Object.values(experience).reduce((sum, xp) => sum + xp, 0);
  }

  /**
   * Calculate total item count being awarded
   */
  calculateTotalItemCount(items: Array<{ quantity: number }>): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

export default new RewardProcessor();
