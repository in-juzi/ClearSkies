/**
 * Effect Evaluator Service
 *
 * Generic engine for evaluating all applicable effects from modifiers (traits, qualities, affixes)
 * Handles condition checking, modifier application, and result aggregation
 */

import {
  EffectContext,
  EffectApplicator,
  EffectEvaluationContext,
  EffectEvaluationResult,
  EffectCondition,
  ConditionType,
  ModifierType,
  AppliedEffect,
  SkippedEffect,
} from '@shared/types/effect-system';
import { TraitRegistry } from '../data/items/traits/TraitRegistry';
import { QualityRegistry } from '../data/items/qualities/QualityRegistry';
import itemService from './itemService';

class EffectEvaluatorService {
  /**
   * Evaluate all effects from a player's equipped items and active buffs
   * for a specific context
   */
  evaluatePlayerEffects(
    player: any,
    effectContext: EffectContext,
    runtimeContext?: EffectEvaluationContext['runtime']
  ): EffectEvaluationResult {
    const context: EffectEvaluationContext = {
      entity: player,
      effectContext,
      runtime: runtimeContext || {},
    };

    const result: EffectEvaluationResult = {
      flatBonus: 0,
      percentageBonus: 0,
      multiplier: 1.0,
      appliedEffects: [],
      skippedEffects: [],
    };

    // 1. Evaluate equipped item traits
    const equippedItems = this.getEquippedItems(player);
    for (const item of equippedItems) {
      // Pass the current item in runtime context for ITEM_REQUIRED_FOR_ACTIVITY checks
      const itemContext = {
        ...context,
        runtime: {
          ...context.runtime,
          currentItem: item,
        },
      };
      this.evaluateItemTraits(item, itemContext, result);
      this.evaluateItemQualities(item, itemContext, result);
    }

    // 2. Evaluate equipped item affixes (future)
    // this.evaluateItemAffixes(item, context, result);

    // 3. Evaluate active buffs (future - buffs may grant temporary effects)
    // this.evaluateActiveBuffs(player, context, result);

    return result;
  }

  /**
   * Evaluate effects for a single item only (not all equipped items)
   * Useful for item inspection/preview
   */
  evaluateSingleItemEffects(
    item: any,
    effectContext: EffectContext,
    runtimeContext?: EffectEvaluationContext['runtime']
  ): EffectEvaluationResult {
    const context: EffectEvaluationContext = {
      entity: {}, // No player context needed for single item
      effectContext,
      runtime: runtimeContext || {},
    };

    const result: EffectEvaluationResult = {
      flatBonus: 0,
      percentageBonus: 0,
      multiplier: 1.0,
      appliedEffects: [],
      skippedEffects: [],
    };

    // Evaluate this item's traits and qualities only
    this.evaluateItemTraits(item, context, result);
    this.evaluateItemQualities(item, context, result);

    return result;
  }

  /**
   * Evaluate all trait effects on an item
   */
  private evaluateItemTraits(
    item: any,
    context: EffectEvaluationContext,
    result: EffectEvaluationResult
  ): void {
    if (!item.traits) return;

    for (const [traitId, level] of item.traits.entries()) {
      const traitDef = TraitRegistry.get(traitId);
      if (!traitDef) continue;

      const levelData = traitDef.levels?.[level.toString()];
      if (!levelData?.effects) continue;

      // New system: Use applicators if present
      if ('applicators' in levelData.effects && levelData.effects.applicators) {
        for (const applicator of levelData.effects.applicators) {
          this.evaluateApplicator(applicator, 'trait', traitId, level, context, result);
        }
      }

      // Legacy system: Check old-style effects for backward compatibility
      // This allows gradual migration
      this.evaluateLegacyTraitEffects(traitId, level, levelData.effects, context, result);
    }
  }

  /**
   * Evaluate all quality effects on an item
   */
  private evaluateItemQualities(
    item: any,
    context: EffectEvaluationContext,
    result: EffectEvaluationResult
  ): void {
    if (!item.qualities) return;

    for (const [qualityId, level] of item.qualities.entries()) {
      const qualityDef = QualityRegistry.get(qualityId);
      if (!qualityDef) continue;

      const levelData = qualityDef.levels?.[level.toString()];
      if (!levelData?.effects) continue;

      // New system: Use applicators if present
      if ('applicators' in levelData.effects && levelData.effects.applicators) {
        for (const applicator of levelData.effects.applicators) {
          this.evaluateApplicator(applicator, 'quality', qualityId, level, context, result);
        }
      }

      // Legacy system: Check old-style effects for backward compatibility
      this.evaluateLegacyQualityEffects(qualityId, level, levelData.effects, context, result);
    }
  }

  /**
   * Evaluate a single effect applicator
   */
  private evaluateApplicator(
    applicator: EffectApplicator,
    sourceType: 'trait' | 'quality' | 'affix',
    sourceId: string,
    level: number,
    context: EffectEvaluationContext,
    result: EffectEvaluationResult
  ): void {
    // 1. Check if this applicator applies to the current context
    if (applicator.context !== context.effectContext) {
      return; // Not relevant to this evaluation
    }

    // 2. Check if condition is met
    if (!this.isConditionMet(applicator.condition, context)) {
      result.skippedEffects.push({
        sourceType,
        sourceId,
        level,
        applicator,
        reason: `Condition not met: ${this.describeCondition(applicator.condition)}`,
      });
      return;
    }

    // 3. Apply the effect based on modifier type
    const contribution = this.applyModifier(applicator, result);

    // 4. Record the applied effect
    result.appliedEffects.push({
      sourceType,
      sourceId,
      level,
      applicator,
      contribution,
    });
  }

  /**
   * Apply a modifier to the result
   * Returns the contribution amount
   */
  private applyModifier(
    applicator: EffectApplicator,
    result: EffectEvaluationResult
  ): number {
    switch (applicator.modifierType) {
      case ModifierType.FLAT:
        result.flatBonus += applicator.value;
        return applicator.value;

      case ModifierType.PERCENTAGE:
        result.percentageBonus += applicator.value;
        return applicator.value;

      case ModifierType.MULTIPLIER:
        result.multiplier *= applicator.value;
        return applicator.value;

      default:
        console.warn(`Unknown modifier type: ${applicator.modifierType}`);
        return 0;
    }
  }

  /**
   * Check if a condition is met
   */
  private isConditionMet(
    condition: EffectCondition | undefined,
    context: EffectEvaluationContext
  ): boolean {
    if (!condition || condition.type === ConditionType.ALWAYS) {
      return true;
    }

    const runtime = context.runtime || {};

    switch (condition.type) {
      // HP-based conditions
      case ConditionType.HP_BELOW_PERCENT:
        return (runtime.hpPercent !== undefined && runtime.hpPercent < condition.value);

      case ConditionType.HP_ABOVE_PERCENT:
        return (runtime.hpPercent !== undefined && runtime.hpPercent > condition.value);

      // Combat state
      case ConditionType.IN_COMBAT:
        return runtime.inCombat === true;

      case ConditionType.OUT_OF_COMBAT:
        return runtime.inCombat === false;

      // Activity restrictions
      case ConditionType.ACTIVITY_TYPE:
        if (!runtime.activityType) return false;
        if (Array.isArray(condition.value)) {
          return condition.value.includes(runtime.activityType);
        }
        return runtime.activityType === condition.value;

      case ConditionType.ACTIVITY_LOCATION:
        if (!runtime.activityLocation) return false;
        if (Array.isArray(condition.value)) {
          return condition.value.includes(runtime.activityLocation);
        }
        return runtime.activityLocation === condition.value;

      case ConditionType.ITEM_REQUIRED_FOR_ACTIVITY:
        return this.isItemRequiredForActivity(runtime.currentItem, runtime.activity);

      // Target restrictions
      case ConditionType.TARGET_TYPE:
        if (!runtime.target?.type) return false;
        if (Array.isArray(condition.value)) {
          return condition.value.includes(runtime.target.type);
        }
        return runtime.target.type === condition.value;

      case ConditionType.TARGET_BELOW_HP_PERCENT:
        return (runtime.targetHpPercent !== undefined && runtime.targetHpPercent < condition.value);

      // Equipment state
      case ConditionType.SHIELD_EQUIPPED:
        return this.hasShieldEquipped(context.entity);

      case ConditionType.TWO_HANDED:
        return this.hasTwoHandedWeapon(context.entity);

      case ConditionType.DUAL_WIELDING:
        return this.isDualWielding(context.entity);

      // Skill/Attribute levels
      case ConditionType.SKILL_LEVEL_ABOVE:
        if (!condition.value?.skill || !condition.value?.level) return false;
        const skillLevel = context.entity.skills?.[condition.value.skill]?.level || 0;
        return skillLevel > condition.value.level;

      case ConditionType.ATTRIBUTE_ABOVE:
        if (!condition.value?.attribute || !condition.value?.value) return false;
        const attrValue = context.entity.attributes?.[condition.value.attribute]?.level || 0;
        return attrValue > condition.value.value;

      default:
        console.warn(`Unknown condition type: ${condition.type}`);
        return false;
    }
  }

  /**
   * Helper: Get equipped items from player
   */
  private getEquippedItems(player: any): any[] {
    if (!player.inventory || !player.equipmentSlots) {
      return [];
    }

    const equippedItems = [];
    for (const [slot, instanceId] of player.equipmentSlots.entries()) {
      if (instanceId) {
        const item = player.inventory.find((i: any) => i.instanceId === instanceId);
        if (item) {
          equippedItems.push(item);
        }
      }
    }

    return equippedItems;
  }

  /**
   * Helper: Check if player has shield equipped
   */
  private hasShieldEquipped(player: any): boolean {
    const offHandId = player.equipmentSlots?.get?.('offHand');
    if (!offHandId) return false;

    const offHandItem = player.inventory?.find((i: any) => i.instanceId === offHandId);
    if (!offHandItem) return false;

    const itemDef = itemService.getItemDefinition(offHandItem.itemId);
    return itemDef?.subcategories?.includes('shield') || false;
  }

  /**
   * Helper: Check if player has two-handed weapon
   */
  private hasTwoHandedWeapon(player: any): boolean {
    const mainHandId = player.equipmentSlots?.get?.('mainHand');
    if (!mainHandId) return false;

    const mainHandItem = player.inventory?.find((i: any) => i.instanceId === mainHandId);
    if (!mainHandItem) return false;

    const itemDef = itemService.getItemDefinition(mainHandItem.itemId);
    return itemDef?.subcategories?.includes('two-handed') || false;
  }

  /**
   * Helper: Check if player is dual wielding
   */
  private isDualWielding(player: any): boolean {
    const mainHandId = player.equipmentSlots?.get?.('mainHand');
    const offHandId = player.equipmentSlots?.get?.('offHand');
    if (!mainHandId || !offHandId) return false;

    const mainHandItem = player.inventory?.find((i: any) => i.instanceId === mainHandId);
    const offHandItem = player.inventory?.find((i: any) => i.instanceId === offHandId);
    if (!mainHandItem || !offHandItem) return false;

    const mainHandDef = itemService.getItemDefinition(mainHandItem.itemId);
    const offHandDef = itemService.getItemDefinition(offHandItem.itemId);

    const isMainHandWeapon = mainHandDef?.category === 'equipment' &&
                             mainHandDef?.subcategories?.includes('weapon');
    const isOffHandWeapon = offHandDef?.category === 'equipment' &&
                            offHandDef?.subcategories?.includes('weapon');

    return isMainHandWeapon && isOffHandWeapon;
  }

  /**
   * Helper: Check if an item is required for an activity
   * An item is required if its subtype matches any of the activity's equipment requirements
   */
  private isItemRequiredForActivity(item: any, activity: any): boolean {
    if (!item || !activity) return false;

    // Get the item definition to check its subtype
    const itemDef = itemService.getItemDefinition(item.itemId);
    if (!itemDef) return false;

    // Check if activity has equipment requirements
    const requiredEquipment = activity.requirements?.equipped;
    if (!requiredEquipment || !Array.isArray(requiredEquipment)) return false;

    // Check if the item's subtype matches any required equipment subtype
    for (const requirement of requiredEquipment) {
      if (requirement.subtype) {
        // First check the item's explicit subtype field (only exists on EquipmentItem)
        if ('subtype' in itemDef && itemDef.subtype === requirement.subtype) {
          return true;
        }
        // Also check subcategories array as a fallback
        if (itemDef.subcategories?.includes(requirement.subtype)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Helper: Describe a condition for logging
   */
  private describeCondition(condition: EffectCondition | undefined): string {
    if (!condition) return 'always';
    return `${condition.type}: ${JSON.stringify(condition.value)}`;
  }

  // ===== LEGACY EFFECT SUPPORT =====
  // These methods handle old-style effects during migration
  // Can be removed once all traits/qualities are migrated

  private evaluateLegacyTraitEffects(
    traitId: string,
    level: number,
    effects: any,
    context: EffectEvaluationContext,
    result: EffectEvaluationResult
  ): void {
    // Legacy combat effects
    if (context.effectContext === EffectContext.COMBAT_DAMAGE && effects.combat?.damageBonus) {
      result.flatBonus += effects.combat.damageBonus;
      result.appliedEffects.push({
        sourceType: 'trait',
        sourceId: traitId,
        level,
        applicator: {
          context: EffectContext.COMBAT_DAMAGE,
          modifierType: ModifierType.FLAT,
          value: effects.combat.damageBonus,
        } as any,
        contribution: effects.combat.damageBonus,
      });
    }

    // Legacy activity effects
    if (context.effectContext === EffectContext.ACTIVITY_DURATION && effects.activity?.timeReduction) {
      // timeReduction is negative seconds, so we add it as a flat reduction
      result.flatBonus += -effects.activity.timeReduction; // Convert to negative for duration reduction
      result.appliedEffects.push({
        sourceType: 'trait',
        sourceId: traitId,
        level,
        applicator: {
          context: EffectContext.ACTIVITY_DURATION,
          modifierType: ModifierType.FLAT,
          value: -effects.activity.timeReduction,
        } as any,
        contribution: -effects.activity.timeReduction,
      });
    }
  }

  private evaluateLegacyQualityEffects(
    qualityId: string,
    level: number,
    effects: any,
    context: EffectEvaluationContext,
    result: EffectEvaluationResult
  ): void {
    // Legacy activity time reduction (percentage)
    if (context.effectContext === EffectContext.ACTIVITY_DURATION && effects.activityTime?.reductionPercent) {
      result.percentageBonus += -effects.activityTime.reductionPercent; // Negative for reduction
      result.appliedEffects.push({
        sourceType: 'quality',
        sourceId: qualityId,
        level,
        applicator: {
          context: EffectContext.ACTIVITY_DURATION,
          modifierType: ModifierType.PERCENTAGE,
          value: -effects.activityTime.reductionPercent,
        } as any,
        contribution: -effects.activityTime.reductionPercent,
      });
    }
  }

  // ===== CONVENIENCE METHODS =====

  /**
   * Get total bonus for a combat stat
   * Convenience wrapper for common use case
   */
  getCombatStatBonus(
    player: any,
    stat: 'damage' | 'armor' | 'evasion' | 'critChance' | 'attackSpeed',
    runtimeContext?: EffectEvaluationContext['runtime']
  ): { flat: number; percentage: number; multiplier: number } {
    const contextMap = {
      damage: EffectContext.COMBAT_DAMAGE,
      armor: EffectContext.COMBAT_ARMOR,
      evasion: EffectContext.COMBAT_EVASION,
      critChance: EffectContext.COMBAT_CRIT_CHANCE,
      attackSpeed: EffectContext.COMBAT_ATTACK_SPEED,
    };

    const result = this.evaluatePlayerEffects(player, contextMap[stat], runtimeContext);

    return {
      flat: result.flatBonus,
      percentage: result.percentageBonus,
      multiplier: result.multiplier,
    };
  }

  /**
   * Get activity duration modifier
   */
  getActivityDurationModifier(
    player: any,
    activityType?: string,
    activityLocation?: string,
    activity?: any
  ): { flat: number; percentage: number; multiplier: number } {
    const result = this.evaluatePlayerEffects(
      player,
      EffectContext.ACTIVITY_DURATION,
      { activityType, activityLocation, activity }
    );

    return {
      flat: result.flatBonus,
      percentage: result.percentageBonus,
      multiplier: result.multiplier,
    };
  }

  /**
   * Get crafting quality bonus modifier
   */
  getCraftingQualityBonus(
    player: any,
    skill?: string,
    recipe?: any
  ): { flat: number; percentage: number; multiplier: number } {
    const result = this.evaluatePlayerEffects(
      player,
      EffectContext.CRAFTING_QUALITY_BONUS,
      { skill, recipe }
    );

    return {
      flat: result.flatBonus,
      percentage: result.percentageBonus,
      multiplier: result.multiplier,
    };
  }

  /**
   * Get crafting success rate modifier
   */
  getCraftingSuccessRate(
    player: any,
    skill?: string,
    recipe?: any
  ): { flat: number; percentage: number; multiplier: number } {
    const result = this.evaluatePlayerEffects(
      player,
      EffectContext.CRAFTING_SUCCESS_RATE,
      { skill, recipe }
    );

    return {
      flat: result.flatBonus,
      percentage: result.percentageBonus,
      multiplier: result.multiplier,
    };
  }

  /**
   * Get crafting yield multiplier
   */
  getCraftingYieldMultiplier(
    player: any,
    skill?: string,
    recipe?: any
  ): { flat: number; percentage: number; multiplier: number } {
    const result = this.evaluatePlayerEffects(
      player,
      EffectContext.CRAFTING_YIELD_MULTIPLIER,
      { skill, recipe }
    );

    return {
      flat: result.flatBonus,
      percentage: result.percentageBonus,
      multiplier: result.multiplier,
    };
  }

  /**
   * Get vendor sell price modifier
   */
  getVendorSellPriceModifier(
    player: any,
    itemInstance?: any,
    vendor?: any
  ): { flat: number; percentage: number; multiplier: number } {
    const result = this.evaluatePlayerEffects(
      player,
      EffectContext.VENDOR_SELL_PRICE,
      { item: itemInstance, vendor }
    );

    return {
      flat: result.flatBonus,
      percentage: result.percentageBonus,
      multiplier: result.multiplier,
    };
  }

  /**
   * Get vendor buy price modifier
   */
  getVendorBuyPriceModifier(
    player: any,
    itemId?: string,
    vendor?: any
  ): { flat: number; percentage: number; multiplier: number } {
    const result = this.evaluatePlayerEffects(
      player,
      EffectContext.VENDOR_BUY_PRICE,
      { itemId, vendor }
    );

    return {
      flat: result.flatBonus,
      percentage: result.percentageBonus,
      multiplier: result.multiplier,
    };
  }

  /**
   * Calculate final value after applying all modifiers
   * Formula: (base + flat) * (1 + percentage) * multiplier
   */
  calculateFinalValue(
    baseValue: number,
    result: EffectEvaluationResult
  ): number {
    return (baseValue + result.flatBonus) * (1 + result.percentageBonus) * result.multiplier;
  }
}

// Export singleton instance
export const effectEvaluator = new EffectEvaluatorService();
export default effectEvaluator;
