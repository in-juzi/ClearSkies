/**
 * Attribute Scaling Constants
 *
 * Defines how attributes affect player stats (HP, MP, carrying capacity, etc.)
 * These values tune the game's progression and character build diversity.
 */

export const ATTRIBUTE_SCALING = {
  // ===== HP Scaling =====
  // Formula: HP = BASE_HP + (STR × STR_HP_BONUS) + (END × END_HP_BONUS) + (WILL × WILL_HP_BONUS)
  BASE_HP: 10,
  STR_HP_BONUS: 3,  // Primary physical stat - strength increases max health
  END_HP_BONUS: 2,  // Secondary - endurance/stamina/toughness
  WILL_HP_BONUS: 1, // Tertiary - mental fortitude contributes to survival

  // ===== MP Scaling =====
  // Formula: MP = BASE_MP + (WIS × WIS_MP_BONUS) + (WILL × WILL_MP_BONUS)
  BASE_MP: 10,
  WIS_MP_BONUS: 6,  // Primary magical stat - wisdom channels magical energy
  WILL_MP_BONUS: 3, // Secondary - willpower maintains mana reserves

  // ===== Carrying Capacity =====
  // Formula: Capacity (kg) = BASE_CAPACITY_KG + (STR × STR_CAPACITY_BONUS) + (END × END_CAPACITY_BONUS)
  BASE_CAPACITY_KG: 50,      // Average deadlift for untrained individuals
  STR_CAPACITY_BONUS: 2,     // +2 kg per Strength level
  END_CAPACITY_BONUS: 1,     // +1 kg per Endurance level

  // ===== Other Attribute Bonuses =====
  // Perception bonuses (future implementation)
  PERCEPTION_QUALITY_BONUS: 0.01,    // +1% chance for higher quality drops per level
  PERCEPTION_CRIT_BONUS: 0.005,      // +0.5% critical hit chance per level

  // Dexterity bonuses (future implementation)
  DEXTERITY_SPEED_BONUS: 0.005,      // +0.5% activity speed per level (max -25% at level 50)
  DEXTERITY_EVASION_BONUS: 0.01,     // +1% dodge chance per level

  // Charisma bonuses (future implementation)
  CHARISMA_VENDOR_BUY_BONUS: 0.01,   // -1% vendor buy prices per level
  CHARISMA_VENDOR_SELL_BONUS: 0.01,  // +1% vendor sell prices per level
} as const;

/**
 * Attribute names enum for type safety
 */
export enum AttributeName {
  STRENGTH = 'strength',
  ENDURANCE = 'endurance',
  WISDOM = 'wisdom',        // Renamed from 'magic'
  PERCEPTION = 'perception',
  DEXTERITY = 'dexterity',
  WILL = 'will',
  CHARISMA = 'charisma'
}

/**
 * Helper type for attribute maps
 */
export type AttributeMap = {
  [key in AttributeName]?: {
    level: number;
    experience: number;
  };
};
