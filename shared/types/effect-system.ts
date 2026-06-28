/**
 * Data-Driven Effect System
 *
 * Flexible, declarative system for defining how modifiers (traits, qualities, affixes)
 * affect different game systems without hardcoding logic in services.
 *
 * Design Principles:
 * 1. Modifiers declare their effects, not services
 * 2. Services use generic evaluators to apply all relevant effects
 * 3. New modifiers = just data, no code changes
 * 4. Supports future complexity (conditions, abilities, stacking rules)
 */

// Import and re-export ModifierType from combat-enums to avoid duplication
import { ModifierType } from './combat-enums';
export { ModifierType };

// ===== EFFECT CONTEXTS =====

/**
 * Where an effect can apply in the game
 * Organized by system for easy discovery
 */
export enum EffectContext {
  // Combat Stats
  COMBAT_DAMAGE = 'combat.damage',
  COMBAT_ARMOR = 'combat.armor',
  COMBAT_EVASION = 'combat.evasion',
  COMBAT_CRIT_CHANCE = 'combat.critChance',
  COMBAT_ATTACK_SPEED = 'combat.attackSpeed',
  COMBAT_HEALTH_REGEN = 'combat.healthRegen',
  COMBAT_MANA_REGEN = 'combat.manaRegen',

  // Activity Bonuses
  ACTIVITY_DURATION = 'activity.duration',
  ACTIVITY_XP_GAIN = 'activity.xpGain',
  ACTIVITY_YIELD_QUANTITY = 'activity.yieldQuantity',
  ACTIVITY_YIELD_QUALITY = 'activity.yieldQuality',

  // Crafting Bonuses
  CRAFTING_QUALITY_BONUS = 'crafting.qualityBonus',
  CRAFTING_SUCCESS_RATE = 'crafting.successRate',
  CRAFTING_YIELD_MULTIPLIER = 'crafting.yieldMultiplier',

  // Economic
  VENDOR_SELL_PRICE = 'vendor.sellPrice',
  VENDOR_BUY_PRICE = 'vendor.buyPrice',

  // Special Effects
  CONSUMABLE_BUFF = 'consumable.buff',
  CONSUMABLE_HOT = 'consumable.hot',
  CONSUMABLE_DOT = 'consumable.dot',
  GRANTS_ABILITY = 'grants.ability',
}

// ===== EFFECT CONDITIONS =====

/**
 * Condition types for conditional effects
 */
export enum ConditionType {
  // Always active
  ALWAYS = 'always',

  // Health thresholds
  HP_BELOW = 'hp.below',       // Below X HP
  HP_BELOW_PERCENT = 'hp.below.percent', // Below X% HP
  HP_ABOVE = 'hp.above',       // Above X HP
  HP_ABOVE_PERCENT = 'hp.above.percent', // Above X% HP

  // Combat state
  IN_COMBAT = 'in.combat',
  OUT_OF_COMBAT = 'out.of.combat',

  // Activity restrictions
  ACTIVITY_TYPE = 'activity.type',       // Specific skill (woodcutting, mining, etc.)
  ACTIVITY_LOCATION = 'activity.location', // Specific location
  ITEM_REQUIRED_FOR_ACTIVITY = 'item.required.for.activity', // Item is required for current activity

  // Enemy targeting
  TARGET_FAMILY = 'target.family',       // Monster family/archetype (beast, undead, goblinoid, ...); matches if any of the target's families is allowed
  TARGET_BELOW_HP_PERCENT = 'target.below.hp.percent',

  // Equipment state
  EQUIPPED_SLOT = 'equipped.slot',       // Item in specific slot
  TWO_HANDED = 'two.handed',            // Using 2H weapon
  DUAL_WIELDING = 'dual.wielding',      // Using 2 weapons
  SHIELD_EQUIPPED = 'shield.equipped',

  // Time-based
  TIME_OF_DAY = 'time.of.day',          // Day/night cycle
  BUFF_ACTIVE = 'buff.active',           // Specific buff active

  // Skill levels
  SKILL_LEVEL_ABOVE = 'skill.level.above', // Skill level > X
  ATTRIBUTE_ABOVE = 'attribute.above',    // Attribute value > X
}

/**
 * Condition definition for effect applicators
 */
export interface EffectCondition {
  type: ConditionType;
  value?: any; // Type depends on ConditionType
}

/**
 * Helper type for condition values
 */
export type ConditionValue<T extends ConditionType> =
  T extends ConditionType.HP_BELOW_PERCENT ? number :
  T extends ConditionType.HP_ABOVE_PERCENT ? number :
  T extends ConditionType.ACTIVITY_TYPE ? string | string[] :
  T extends ConditionType.TARGET_FAMILY ? string | string[] :
  T extends ConditionType.EQUIPPED_SLOT ? string :
  T extends ConditionType.SKILL_LEVEL_ABOVE ? { skill: string; level: number } :
  any;

// ===== EFFECT APPLICATOR BASE =====

/**
 * Base interface for all effect applicators
 * All specific applicator types extend this
 */
export interface BaseEffectApplicator {
  /** Unique identifier for this applicator (for debugging/logging) */
  id?: string;

  /** Which game context this effect applies to */
  context: EffectContext;

  /** How the effect modifies the value */
  modifierType: ModifierType;

  /** The magnitude of the effect */
  value: number;

  /** Optional condition for the effect to apply */
  condition?: EffectCondition;

  /** Priority for effect application order (higher = applied first) */
  priority?: number;

  /** Optional description for tooltips/debugging */
  description?: string;
}

// ===== COMBAT EFFECT APPLICATORS =====

export interface CombatDamageApplicator extends BaseEffectApplicator {
  context: EffectContext.COMBAT_DAMAGE;
}

export interface CombatArmorApplicator extends BaseEffectApplicator {
  context: EffectContext.COMBAT_ARMOR;
}

export interface CombatEvasionApplicator extends BaseEffectApplicator {
  context: EffectContext.COMBAT_EVASION;
}

export interface CombatCritChanceApplicator extends BaseEffectApplicator {
  context: EffectContext.COMBAT_CRIT_CHANCE;
}

export interface CombatAttackSpeedApplicator extends BaseEffectApplicator {
  context: EffectContext.COMBAT_ATTACK_SPEED;
}

export interface CombatHealthRegenApplicator extends BaseEffectApplicator {
  context: EffectContext.COMBAT_HEALTH_REGEN;
}

export interface CombatManaRegenApplicator extends BaseEffectApplicator {
  context: EffectContext.COMBAT_MANA_REGEN;
}

// ===== ACTIVITY EFFECT APPLICATORS =====

export interface ActivityDurationApplicator extends BaseEffectApplicator {
  context: EffectContext.ACTIVITY_DURATION;
}

export interface ActivityXpGainApplicator extends BaseEffectApplicator {
  context: EffectContext.ACTIVITY_XP_GAIN;
}

export interface ActivityYieldQuantityApplicator extends BaseEffectApplicator {
  context: EffectContext.ACTIVITY_YIELD_QUANTITY;
}

export interface ActivityYieldQualityApplicator extends BaseEffectApplicator {
  context: EffectContext.ACTIVITY_YIELD_QUALITY;
}

// ===== CRAFTING EFFECT APPLICATORS =====

export interface CraftingQualityBonusApplicator extends BaseEffectApplicator {
  context: EffectContext.CRAFTING_QUALITY_BONUS;
}

export interface CraftingSuccessRateApplicator extends BaseEffectApplicator {
  context: EffectContext.CRAFTING_SUCCESS_RATE;
}

export interface CraftingYieldMultiplierApplicator extends BaseEffectApplicator {
  context: EffectContext.CRAFTING_YIELD_MULTIPLIER;
}

// ===== VENDOR EFFECT APPLICATORS =====

export interface VendorSellPriceApplicator extends BaseEffectApplicator {
  context: EffectContext.VENDOR_SELL_PRICE;
}

export interface VendorBuyPriceApplicator extends BaseEffectApplicator {
  context: EffectContext.VENDOR_BUY_PRICE;
}

// ===== SPECIAL EFFECT APPLICATORS =====

/**
 * Consumable buff effect
 * Applied when consumable is used
 */
export interface ConsumableBuffApplicator extends BaseEffectApplicator {
  context: EffectContext.CONSUMABLE_BUFF;
  buffStat: string;         // Which stat to buff (armor, damage, etc.)
  buffDuration: number;     // Duration in seconds
  buffIsPercentage?: boolean; // Whether value is percentage
}

/**
 * Consumable heal/damage over time
 */
export interface ConsumableHotApplicator extends BaseEffectApplicator {
  context: EffectContext.CONSUMABLE_HOT;
  healPerTick: number;
  ticks: number;
  tickInterval: number;
}

/**
 * Consumable damage over time
 */
export interface ConsumableDotApplicator extends BaseEffectApplicator {
  context: EffectContext.CONSUMABLE_DOT;
  damagePerTick: number;
  ticks: number;
  tickInterval: number;
}

/**
 * Grants ability while equipped
 * For future affix system
 */
export interface GrantsAbilityApplicator extends BaseEffectApplicator {
  context: EffectContext.GRANTS_ABILITY;
  abilityId: string;
}

// ===== UNION TYPES =====

/**
 * Union of all specific applicator types
 */
export type EffectApplicator =
  | CombatDamageApplicator
  | CombatArmorApplicator
  | CombatEvasionApplicator
  | CombatCritChanceApplicator
  | CombatAttackSpeedApplicator
  | CombatHealthRegenApplicator
  | CombatManaRegenApplicator
  | ActivityDurationApplicator
  | ActivityXpGainApplicator
  | ActivityYieldQuantityApplicator
  | ActivityYieldQualityApplicator
  | CraftingQualityBonusApplicator
  | CraftingSuccessRateApplicator
  | CraftingYieldMultiplierApplicator
  | VendorSellPriceApplicator
  | VendorBuyPriceApplicator
  | ConsumableBuffApplicator
  | ConsumableHotApplicator
  | ConsumableDotApplicator
  | GrantsAbilityApplicator;

// ===== EVALUATION CONTEXT =====

/**
 * Context provided when evaluating effects
 * Contains runtime data needed to evaluate conditions
 */
export interface EffectEvaluationContext {
  /** The entity being evaluated (player or monster) */
  entity: any;

  /** Which effect context to evaluate */
  effectContext: EffectContext;

  /** Runtime data for condition evaluation */
  runtime?: {
    /** Current HP percentage (0-1) */
    hpPercent?: number;

    /** Current activity type (e.g., 'woodcutting') */
    activityType?: string;

    /** Current activity location */
    activityLocation?: string;

    /** Current activity definition (for checking requirements) */
    activity?: any;

    /** Current item being evaluated (for checking if it's required) */
    currentItem?: any;

    /** Target entity (for combat targeting conditions) */
    target?: any;

    /** Target HP percentage (0-1) */
    targetHpPercent?: number;

    /** Is entity in combat */
    inCombat?: boolean;

    /** Additional context data */
    [key: string]: any;
  };
}

// ===== EVALUATION RESULT =====

/**
 * Result of evaluating all applicable effects
 */
export interface EffectEvaluationResult {
  /** Total flat modification */
  flatBonus: number;

  /** Total percentage modification (0.20 = +20%, -0.15 = -15%) */
  percentageBonus: number;

  /** Total multiplier (2.0 = 2x, 0.5 = half) */
  multiplier: number;

  /** Final calculated value after all modifiers */
  finalValue?: number;

  /** Effects that were applied */
  appliedEffects: AppliedEffect[];

  /** Effects that were skipped (condition not met) */
  skippedEffects: SkippedEffect[];
}

/**
 * Effect that was successfully applied
 */
export interface AppliedEffect {
  sourceType: 'trait' | 'quality' | 'affix' | 'buff';
  sourceId: string;
  level?: number;
  applicator: EffectApplicator;
  contribution: number; // How much this effect added to the total
}

/**
 * Effect that was skipped
 */
export interface SkippedEffect {
  sourceType: 'trait' | 'quality' | 'affix' | 'buff';
  sourceId: string;
  level?: number;
  applicator: EffectApplicator;
  reason: string; // Why it was skipped
}

// ===== TRIGGERED EFFECTS =====
//
// A SECOND CHANNEL alongside EffectApplicator. Where applicators are passive,
// queried, and return a number, triggered effects are event-driven, probabilistic,
// and side-effecting: "when a hit lands, roll a chance, and if it fires, do something."
// They power on-hit/on-crit/on-kill/on-being-hit/on-block effects (e.g. essence
// socketables like "chance to steal gold on hit").
//
// See project/ideas/triggered-effects.md for the design rationale.

/**
 * Combat events that a triggered effect can hook into.
 */
export enum TriggerType {
  ON_HIT = 'trigger.onHit',           // After a landed attack resolves (attacker's gear)
  ON_CRIT = 'trigger.onCrit',         // When an attack crits (attacker's gear)
  ON_KILL = 'trigger.onKill',         // When an attack defeats the target (attacker's gear)
  ON_BEING_HIT = 'trigger.onBeingHit', // When the wearer is struck (victim's gear)
  ON_BLOCK = 'trigger.onBlock',       // When the wearer blocks/dodges (victim's gear)
}

/**
 * Whether a trigger fires from the attacker's gear (offensive) or the
 * victim's gear (defensive). The combat loop uses this to know whose equipped
 * items to scan. If an effect needs to react to both sides, declare two triggers.
 */
export const TRIGGER_PERSPECTIVE: Record<TriggerType, 'offensive' | 'defensive'> = {
  [TriggerType.ON_HIT]: 'offensive',
  [TriggerType.ON_CRIT]: 'offensive',
  [TriggerType.ON_KILL]: 'offensive',
  [TriggerType.ON_BEING_HIT]: 'defensive',
  [TriggerType.ON_BLOCK]: 'defensive',
};

/**
 * What a triggered effect actually DOES when it fires. Unlike modifier
 * applicators (which return numbers), these mutate game state. Each type is
 * dispatched to a handler in triggerService.
 */
export enum TriggerActionType {
  STEAL_GOLD = 'action.stealGold',     // Transfer gold to the wearer (e.g. goblin essence)
  DEAL_DAMAGE = 'action.dealDamage',   // Immediate bonus damage to the target
  APPLY_DOT = 'action.applyDot',       // Apply damage-over-time to the target
  HEAL = 'action.heal',                // Restore HP to the wearer
  APPLY_BUFF = 'action.applyBuff',     // Apply a buff to the wearer
  APPLY_DEBUFF = 'action.applyDebuff', // Apply a debuff to the target
}

/**
 * The side-effecting action a trigger performs.
 */
export interface TriggerAction {
  type: TriggerActionType;
  /** Primary magnitude (gold amount, damage, heal, etc.) */
  value: number;
  /** Action-specific extras (dotTicks, dotInterval, buffId, damageType, ...) */
  params?: Record<string, any>;
}

/**
 * A triggered effect declared on a trait/quality/affix/socket level.
 * Reuses EffectCondition for gating (e.g. only vs undead).
 */
export interface TriggeredEffect {
  /** Which combat event fires this */
  trigger: TriggerType;
  /** Probability gate, 0-1 (flat for now; stat-scaling is a future enhancement) */
  chance: number;
  /** Optional gate, reusing the existing condition system verbatim */
  condition?: EffectCondition;
  /** What happens when it fires */
  action: TriggerAction;
  /** Optional description for tooltips/logging */
  description?: string;
}

/**
 * Runtime payload emitted into triggerService.fire() at a combat hook point.
 * `source` is the entity whose equipped items provide the triggers; `target`
 * is the opponent. `player` is always the persisted player document (for
 * combat log, gold, and buff plumbing) regardless of perspective.
 */
export interface TriggerEvent {
  type: TriggerType;
  source: any;
  target: any;
  player: any;
  damageDealt?: number;
  isCrit?: boolean;
}

/**
 * A matched triggered effect (after collection + condition check, before the
 * chance roll). Produced by effectEvaluator.collectTriggers().
 */
export interface TriggeredEffectMatch {
  sourceType: 'trait' | 'quality' | 'affix';
  sourceId: string;
  level: number;
  effect: TriggeredEffect;
}

/**
 * Result of a fired trigger action, surfaced to the combat log.
 */
export interface TriggerOutcome {
  triggered: boolean;
  action: TriggerActionType;
  sourceType?: 'trait' | 'quality' | 'affix';
  sourceId?: string;
  level?: number;
  message?: string;
  data?: Record<string, any>;
}

// ===== MODIFIER DEFINITION INTEGRATION =====

/**
 * New structure for trait/quality/affix level effects
 * Replaces the current ad-hoc effects structure
 */
export interface ModifierLevelEffects {
  /** All effect applicators for this modifier level */
  applicators: EffectApplicator[];

  /** Event-driven triggered effects for this modifier level (on-hit, etc.) */
  triggers?: TriggeredEffect[];

  /** Legacy vendor price modifier (for backward compatibility during migration) */
  vendorPrice?: {
    modifier: number;
  };
}

// ===== HELPER TYPES =====

/**
 * Type guard to check if an applicator applies to a specific context
 */
export function appliesToContext(
  applicator: EffectApplicator,
  context: EffectContext
): boolean {
  return applicator.context === context;
}

/**
 * Type guard to check if a condition is met
 */
export function isConditionMet(
  condition: EffectCondition | undefined,
  context: EffectEvaluationContext
): boolean {
  if (!condition || condition.type === ConditionType.ALWAYS) {
    return true;
  }

  // Condition evaluation logic will be implemented in the evaluator service
  // This is just the type definition
  return true;
}
