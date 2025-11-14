/**
 * Combat Formulas and Constants
 *
 * Centralized configuration for all combat calculations.
 * Modify these values to balance combat mechanics without searching through code.
 */

export const COMBAT_FORMULAS = {
  // Armor System
  // Formula: reduction = armor / (armor + ARMOR_SCALING_FACTOR)
  // Examples: 100 armor = 9%, 500 armor = 33%, 1000 armor = 50%, 2000 armor = 67%
  ARMOR_SCALING_FACTOR: 1000,

  // Evasion System
  // Formula: chance = evasion / (evasion + EVASION_SCALING_FACTOR)
  // Capped at EVASION_CAP to prevent excessive dodge chance
  // Examples: 100 evasion = 9%, 500 evasion = 33%, 1000 evasion = 50%, 2000 evasion = 67% (capped at 75%)
  EVASION_SCALING_FACTOR: 1000,
  EVASION_CAP: 0.75, // 75% maximum dodge chance

  // Damage System
  CRIT_MULTIPLIER: 2.0, // Critical hits deal 2x damage
  MIN_DAMAGE: 1, // Minimum damage dealt if attack connects

  // Level Scaling System
  // Every N levels grants +1 to damage roll (max bonus capped)
  SKILL_BONUS_PER_LEVELS: 10, // +1 damage per 10 skill levels
  SKILL_BONUS_MAX: 2, // Maximum +2 damage from skill levels
  ATTR_BONUS_PER_LEVELS: 10, // +1 damage per 10 attribute levels
  ATTR_BONUS_MAX: 2, // Maximum +2 damage from attribute levels

  // Attack Speed System
  ATTACK_SPEED_TO_MS: 1000, // Convert attack speed (seconds) to milliseconds

  // Passive Ability Triggers
  BATTLE_FRENZY_HP_THRESHOLD: 0.5 // 50% HP threshold for "below_50_percent_hp" triggers
} as const;

/**
 * Combat Balance Notes:
 *
 * ARMOR_SCALING_FACTOR (1000):
 * - Controls how quickly armor provides diminishing returns
 * - Lower value = armor more effective early, harder to scale
 * - Higher value = armor less effective early, easier to scale
 *
 * EVASION_CAP (0.75):
 * - Prevents full dodge builds from becoming invincible
 * - 75% allows high evasion to be powerful but still risky
 *
 * CRIT_MULTIPLIER (2.0):
 * - Standard 2x damage on critical hits
 * - Increase for glass cannon builds, decrease for more consistent damage
 *
 * LEVEL_SCALING (10 levels per bonus):
 * - Provides steady power progression without exponential scaling
 * - Cap of +2 prevents high-level players from one-shotting everything
 */
