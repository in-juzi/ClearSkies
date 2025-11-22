/**
 * Player Combat Service
 * Handles all combat-related operations for players
 * Extracted from Player model to follow Single Responsibility Principle
 */
import { IPlayer } from '../models/Player';
import { CombatLogType } from '@shared/types';
import itemService from './itemService';

class PlayerCombatService {
  /**
   * Apply damage to player
   * @returns true if player died, false otherwise
   */
  async takeDamage(player: IPlayer, amount: number): Promise<boolean> {
    const currentHP = player.stats.health.current;
    const newHP = Math.max(0, currentHP - amount);

    player.stats.health.current = newHP;

    // Check if player died
    if (newHP === 0) {
      return true;
    }

    return false;
  }

  /**
   * Heal player for specified amount
   */
  heal(player: IPlayer, amount: number): void {
    const currentHP = player.stats.health.current;
    const maxHP = player.maxHP;

    player.stats.health.current = Math.min(maxHP, currentHP + amount);
  }

  /**
   * Use mana from player's mana pool
   */
  useMana(player: IPlayer, amount: number): void {
    const currentMP = player.stats.mana.current;
    player.stats.mana.current = Math.max(0, currentMP - amount);
  }

  /**
   * Restore mana to player
   */
  restoreMana(player: IPlayer, amount: number): void {
    const currentMP = player.stats.mana.current;
    const maxMP = player.maxMP;

    player.stats.mana.current = Math.min(maxMP, currentMP + amount);
  }

  /**
   * Use a consumable item (potion, food, etc.)
   * @returns Object with immediate effects (health, mana, buffs)
   */
  useConsumableItem(player: IPlayer, itemInstance: any, itemDefinition: any): {
    healthRestored: number;
    manaRestored: number;
    buffsApplied: any[];
  } {
    const result = {
      healthRestored: 0,
      manaRestored: 0,
      buffsApplied: [] as any[]
    };

    // Get consumable effects from item service
    const effects = itemService.getConsumableEffects(itemInstance);
    if (!effects) {
      return result;
    }

    // Apply health restoration
    if (effects.healthRestore && effects.healthRestore > 0) {
      const beforeHP = player.stats.health.current;
      this.heal(player, effects.healthRestore);
      result.healthRestored = player.stats.health.current - beforeHP;
    }

    // Apply mana restoration
    if (effects.manaRestore && effects.manaRestore > 0) {
      const beforeMP = player.stats.mana.current;
      this.restoreMana(player, effects.manaRestore);
      result.manaRestored = player.stats.mana.current - beforeMP;
    }

    // Apply buffs (handled by combat system)
    if (effects.buffs && effects.buffs.length > 0) {
      result.buffsApplied = effects.buffs;
    }

    return result;
  }

  /**
   * Check if player is currently in combat
   * Matches Player model's isInCombat() - requires both activeCombat AND monsterId
   */
  isInCombat(player: IPlayer): boolean {
    return !!(player.activeCombat && player.activeCombat.monsterId);
  }

  /**
   * Add message to combat log
   */
  addCombatLog(
    player: IPlayer,
    message: string,
    type: CombatLogType = 'system',
    damageValue?: number,
    target?: 'player' | 'monster'
  ): void {
    if (!player.activeCombat) {
      return;
    }

    if (!player.activeCombat.combatLog) {
      player.activeCombat.combatLog = [];
    }

    player.activeCombat.combatLog.push({
      message,
      timestamp: new Date(),
      type: type as any, // Cast to avoid type narrowing issues
      damageValue,
      target
    });

    // Keep only last 50 messages
    if (player.activeCombat.combatLog.length > 50) {
      player.activeCombat.combatLog = player.activeCombat.combatLog.slice(-50);
    }
  }

  /**
   * Clear combat state
   */
  clearCombat(player: IPlayer): void {
    player.activeCombat = undefined;
  }

  /**
   * Check if ability is on cooldown
   */
  isAbilityOnCooldown(player: IPlayer, abilityId: string): boolean {
    if (!player.activeCombat?.abilityCooldowns) {
      return false;
    }

    const availableTurn = player.activeCombat.abilityCooldowns.get(abilityId);
    if (!availableTurn) {
      return false;
    }

    return player.activeCombat.turnCount < availableTurn;
  }

  /**
   * Set ability cooldown
   * Stores the turn number when the ability becomes available again
   */
  setAbilityCooldown(player: IPlayer, abilityId: string, cooldownTurns: number): void {
    if (!player.activeCombat) {
      return;
    }

    if (!player.activeCombat.abilityCooldowns) {
      player.activeCombat.abilityCooldowns = new Map();
    }

    const availableTurn = player.activeCombat.turnCount + cooldownTurns;
    player.activeCombat.abilityCooldowns.set(abilityId, availableTurn);
  }

  /**
   * Get remaining cooldown turns for ability
   */
  getAbilityCooldownRemaining(player: IPlayer, abilityId: string): number {
    if (!player.activeCombat?.abilityCooldowns) {
      return 0;
    }

    const availableTurn = player.activeCombat.abilityCooldowns.get(abilityId);
    if (!availableTurn) {
      return 0;
    }

    const remaining = availableTurn - player.activeCombat.turnCount;
    return Math.max(0, remaining);
  }

  /**
   * Get the active combat skill based on equipped weapon
   * Returns the appropriate combat skill (oneHanded, twoHanded, ranged, etc.)
   */
  getActiveCombatSkill(player: IPlayer): string {
    // Check main hand weapon
    const mainHandId = player.equipmentSlots.get('mainHand');
    if (!mainHandId) {
      return 'oneHanded'; // Default to one-handed (unarmed)
    }

    const mainHandItem = player.inventory.find(item => item.instanceId === mainHandId);
    if (!mainHandItem) {
      return 'oneHanded';
    }

    const itemDef = itemService.getItemDefinition(mainHandItem.itemId);
    if (!itemDef) {
      return 'oneHanded';
    }

    // Determine skill based on weapon subcategories
    if (itemDef.subcategories?.includes('two-handed')) {
      return 'twoHanded';
    }

    if (itemDef.subcategories?.includes('ranged')) {
      return 'ranged';
    }

    if (itemDef.subcategories?.includes('casting')) {
      return 'casting';
    }

    // Check if dual wielding
    const offHandId = player.equipmentSlots.get('offHand');
    if (offHandId) {
      const offHandItem = player.inventory.find(item => item.instanceId === offHandId);
      if (offHandItem) {
        const offHandDef = itemService.getItemDefinition(offHandItem.itemId);
        // If off-hand is a weapon (not shield), it's dual wield
        if (offHandDef?.category === 'equipment' && offHandDef.subcategories?.includes('weapon')) {
          return 'dualWield';
        }
      }
    }

    // Default to one-handed
    return 'oneHanded';
  }
}

export default new PlayerCombatService();
