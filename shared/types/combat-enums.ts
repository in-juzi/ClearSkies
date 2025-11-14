/**
 * Combat System Enums
 *
 * Type-safe enums for combat-related properties to prevent typos
 * and enable autocomplete throughout the codebase.
 */

/**
 * Stats that can be modified by buffs/debuffs
 */
export enum BuffableStat {
  ARMOR = 'armor',
  EVASION = 'evasion',
  DAMAGE = 'damage',
  CRIT_CHANCE = 'critChance',
  ATTACK_SPEED = 'attackSpeed',
  HEALTH_REGEN = 'healthRegen',
  MANA_REGEN = 'manaRegen',
  RESISTANCE = 'resistance',
  LIFESTEAL = 'lifesteal'
}

/**
 * Types of stat modifiers
 */
export enum ModifierType {
  /**
   * Flat bonus/penalty (e.g., +10 armor, -5 damage)
   */
  FLAT = 'flat',

  /**
   * Percentage modifier applied to base value (e.g., +20% damage = 1.2x)
   * Value should be decimal (0.2 = 20%, -0.15 = -15%)
   */
  PERCENTAGE = 'percentage',

  /**
   * Direct multiplier (e.g., 2.0 = double damage)
   * Useful for abilities like "deal triple damage" (3.0)
   */
  MULTIPLIER = 'multiplier'
}

/**
 * Passive ability trigger conditions
 */
export enum PassiveTrigger {
  ALWAYS = 'always',
  BELOW_50_PERCENT_HP = 'below_50_percent_hp',
  ABOVE_75_PERCENT_HP = 'above_75_percent_hp',
  COMBAT_START = 'combat_start',
  KILL_ENEMY = 'kill_enemy',
  TAKE_DAMAGE = 'take_damage',
  DEAL_CRIT = 'deal_crit'
}

/**
 * Combat log entry types for color coding (enum version)
 * Note: CombatLogType type alias exists in combat.ts for backward compatibility
 */
export enum CombatLogTypeEnum {
  SYSTEM = 'system',
  ATTACK = 'attack',
  ABILITY = 'ability',
  BUFF = 'buff',
  DEBUFF = 'debuff',
  HEAL = 'heal',
  MISS = 'miss',
  CRIT = 'crit',
  DODGE = 'dodge'
}
