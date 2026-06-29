/**
 * Common types shared across all game systems
 */

// ===== ENUMS & LITERAL TYPES =====

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type ItemCategory = 'equipment' | 'consumable' | 'resource';

export type EquipmentSlot =
  | 'mainHand'
  | 'offHand'
  | 'head'
  | 'body'
  | 'belt'
  | 'gloves'
  | 'boots'
  | 'necklace'
  | 'ringRight'
  | 'ringLeft';

export type SkillName =
  | 'woodcutting'
  | 'mining'
  | 'fishing'
  | 'herbalism'  // DEPRECATED: Use 'gathering' instead (migration 008)
  | 'gathering'  // NEW: Renamed from herbalism
  | 'smithing'
  | 'cooking'
  | 'alchemy'    // NEW: Potion/reagent crafting
  | 'construction' // NEW: Building and crafting structures
  | 'enchanting' // NEW: Binding crystallized mana (essences) into socketables (sigils)
  | 'jewelcrafting' // NEW: Fine material craft (DEX) — cut gems + jewelry bases (the vessels)
  | 'oneHanded'
  | 'dualWield'
  | 'twoHanded'
  | 'ranged'
  | 'casting'
  | 'protection'; // NEW: Tank/defensive skill

export type AttributeName =
  | 'strength'
  | 'endurance'
  | 'wisdom'     // Renamed from 'magic'
  | 'perception'
  | 'dexterity'
  | 'will'
  | 'charisma';

// ===== COMMON INTERFACES =====

/**
 * Icon configuration for visual representation
 */
export interface IconConfig {
  path: string;
  material: string;
}

/**
 * Stats with current and max values (health, mana)
 */
export interface Stats {
  current: number;
  max: number;
}

/**
 * Skill with level and experience
 */
export interface Skill {
  level: number;
  experience: number;
  mainAttribute?: AttributeName;
}

/**
 * Attribute with level and experience
 */
export interface Attribute {
  level: number;
  experience: number;
}

/**
 * Quality levels map (qualityId -> level 1-5)
 */
export type QualityMap = Record<string, number>;

/**
 * Trait levels map (traitId -> level 1-3)
 */
export type TraitMap = Record<string, number>;

/**
 * A single filled socket on an item instance.
 * Sockets are stored as a SPARSE list: only filled sockets appear here, and the
 * item's socket CAPACITY is derived separately (see getSocketCount in
 * socket-constants). This decouples capacity from contents so the count rule
 * (currently rarity-gated) can change without a contents migration.
 */
export interface ItemSocket {
  /** The socketable item (e.g. a sigil) bound into this socket. */
  socketableItemId: string;
}

/**
 * Item instance (in player inventory)
 */
export interface ItemInstance {
  instanceId: string;
  itemId: string;
  quantity: number;
  qualities: QualityMap;
  traits: TraitMap;
  equipped: boolean;
  /** Filled sockets (sparse). Absent/empty = nothing socketed. */
  sockets?: ItemSocket[];
}

/**
 * Base properties common to all items
 */
export interface BaseItemProperties {
  weight: number;
  material: string;
  tier: number;
}

/**
 * Quantity range for drops
 */
export interface QuantityRange {
  min: number;
  max: number;
}

/**
 * Experience rewards (skillName -> xp amount)
 */
export type ExperienceRewards = Record<string, number>;
