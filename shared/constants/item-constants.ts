/**
 * Item Definition Constants
 *
 * Centralized constant values for use in item definitions.
 * Provides consistency and easy maintenance for commonly used values.
 */

import { Rarity } from '../types/common';

// ===== CATEGORY VALUES =====

export const CATEGORY = {
  CONSUMABLE: 'consumable',
  EQUIPMENT: 'equipment',
  RESOURCE: 'resource',
} as const;

// ===== RARITY VALUES =====

export const RARITY = {
  COMMON: 'common' as Rarity,
  UNCOMMON: 'uncommon' as Rarity,
  RARE: 'rare' as Rarity,
  EPIC: 'epic' as Rarity,
  LEGENDARY: 'legendary' as Rarity,
} as const;

// ===== QUALITY SETS =====

/**
 * Common quality combinations for different item types
 */
export const QUALITY_SETS = {
  // No qualities allowed
  NONE: [],

  // Single qualities
  WOOD_GRAIN: ['woodGrain'],
  MOISTURE: ['moisture'],
  PURITY: ['purity'],
  SHEEN: ['sheen'],
  AGE: ['age'],

  // Wood-based items (logs, wooden equipment)
  WOOD: ['woodGrain', 'moisture'],

  // Ore and metal items
  ORE: ['purity'],
  METAL: ['purity', 'sheen'],

  // Gemstones and crystals
  GEMSTONE: ['sheen'],

  // Food items (raw and cooked)
  FOOD: ['age'],

  // Herbs and plants
  HERB: ['age'],
} as const;

/**
 * All quality IDs for reference
 */
export const QUALITY_IDS = {
  WOOD_GRAIN: 'woodGrain',
  MOISTURE: 'moisture',
  AGE: 'age',
  PURITY: 'purity',
  SHEEN: 'sheen',
} as const;

// ===== TRAIT SETS =====

/**
 * Common trait combinations for different item types
 */
export const TRAIT_SETS = {
  // No traits allowed
  NONE: [],

  // Single traits
  PRISTINE: ['pristine'],
  BLESSED: ['blessed'],
  CURSED: ['cursed'],
  FRAGRANT: ['fragrant'],
  KNOTTED: ['knotted'],
  WEATHERED: ['weathered'],
  MASTERWORK: ['masterwork'],

  // Wood-based items
  WOOD: ['knotted', 'weathered'],
  WOOD_PRISTINE: ['pristine', 'knotted', 'weathered'],

  // Metal equipment
  EQUIPMENT: ['masterwork', 'cursed', 'blessed'],
  EQUIPMENT_PRISTINE: ['pristine', 'masterwork', 'cursed', 'blessed'],

  // Gemstones and valuable items
  GEMSTONE: ['pristine', 'blessed'],

  // Food items
  FOOD: ['blessed', 'cursed'],
  FOOD_FRAGRANT: ['fragrant', 'blessed', 'cursed'],

  // Herbs and plants
  HERB: ['fragrant', 'blessed'],
  HERB_PRISTINE: ['pristine', 'fragrant', 'blessed'],

  // Potions and consumables
  POTION: ['blessed', 'cursed'],
} as const;

/**
 * All trait IDs for reference
 */
export const TRAIT_IDS = {
  FRAGRANT: 'fragrant',
  KNOTTED: 'knotted',
  WEATHERED: 'weathered',
  PRISTINE: 'pristine',
  CURSED: 'cursed',
  BLESSED: 'blessed',
  MASTERWORK: 'masterwork',
} as const;

// ===== TIER VALUES =====

export const TIER = {
  T1: 1,
  T2: 2,
  T3: 3,
  T4: 4,
  T5: 5,
} as const;

// ===== INDIVIDUAL SUBCATEGORY VALUES =====

/**
 * Individual subcategory constants for use in recipe ingredients,
 * filtering, and type checking. These provide type safety and
 * autocomplete when working with single subcategory values.
 *
 * Usage:
 * - Recipe ingredients: { subcategory: SUBCATEGORY.HERB, quantity: 2 }
 * - Filtering: items.filter(i => i.subcategories.includes(SUBCATEGORY.HERB))
 * - Type guards: item.subcategories?.includes(SUBCATEGORY.WEAPON)
 */
export const SUBCATEGORY = {
  // Primary categories
  HERB: 'herb',
  FLOWER: 'flower',
  FISH: 'fish',
  ORE: 'ore',
  INGOT: 'ingot',
  GEMSTONE: 'gemstone',
  WOOD: 'wood',
  LOG: 'log',
  ROOT: 'root',

  // Equipment types
  WEAPON: 'weapon',
  ARMOR: 'armor',
  TOOL: 'tool',
  HEADGEAR: 'headgear',

  // Weapon subtypes (as subcategories)
  SWORD: 'sword',
  AXE: 'axe',
  SHIELD: 'shield',
  PICKAXE: 'pickaxe',
  ROD: 'rod',

  // Armor piece types
  BODY_ARMOR: 'body-armor',
  FOOTWEAR: 'footwear',
  HANDWEAR: 'handwear',

  // Weapon characteristics
  MELEE: 'melee',
  ONE_HANDED: 'one-handed',
  DEFENSIVE: 'defensive',

  // Gathering tool types
  WOODCUTTING: 'woodcutting',
  MINING: 'mining',
  FISHING: 'fishing',
  GATHERING: 'gathering',

  // Material types (for subcategories)
  LEATHER: 'leather',

  // Item properties
  ALCHEMICAL: 'alchemical',
  MEDICINAL: 'medicinal',
  AROMATIC: 'aromatic',
  SEASONING: 'seasoning',
  DECORATIVE: 'decorative',
  MAGICAL: 'magical',
  RARE: 'rare',

  // Food categories
  FOOD: 'food',
  COOKED: 'cooked',
  COOKING: 'cooking',
  COOKING_INGREDIENT: 'cooking-ingredient',

  // Crafting skills
  CRAFTING: 'crafting',
  SMITHING: 'smithing',
  SMITHING_INGREDIENT: 'smithing-ingredient',
  ALCHEMY: 'alchemy',

  // Consumable types
  POTION: 'potion',
  HEALING: 'healing',
  MANA: 'mana',
  TINCTURE: 'tincture',
  ELIXIR: 'elixir',
  CONSUMABLE: 'consumable',

  // Monster drops
  MONSTER_DROP: 'monster-drop',

  // Water types
  FRESHWATER: 'freshwater',
  SALTWATER: 'saltwater',
  SHELLFISH: 'shellfish',

  // Material types
  METAL: 'metal',
  MEDIUM_ARMOR: 'medium-armor',
  LIGHT_ARMOR: 'light-armor',
  HEAVY_ARMOR: 'heavy-armor',

  // Other categories
  PLANT: 'plant',
  MEDICINE: 'medicine',
  FUEL: 'fuel',
  TIMBER: 'timber',
  BUILDING_MATERIAL: 'building-material',
  CRYSTAL: 'crystal',
  JEWELRY: 'jewelry',
  ENCHANTING: 'enchanting',
  SALVAGE: 'salvage',
  CLOTH: 'cloth',
} as const;

// ===== SUBCATEGORIES (ARRAYS) =====

/**
 * Common subcategory combinations for item definitions.
 * These provide convenient arrays of related subcategories.
 *
 * Usage:
 * - Item definitions: subcategories: SUBCATEGORIES.HERB
 * - Custom combinations: [SUBCATEGORY.FLOWER, SUBCATEGORY.AROMATIC]
 */
export const SUBCATEGORIES = {
  // Wood resources (logs)
  WOOD: ['wood', 'crafting', 'fuel'],
  WOOD_LOG: ['log', 'wood', 'timber', 'crafting'],
  WOOD_LOG_BUILDING: ['log', 'wood', 'timber', 'building-material'],
  WOOD_LOG_MAGICAL: ['log', 'wood', 'timber', 'magical'],

  // Ore resources
  ORE: ['ore', 'crafting', 'smithing'],

  // Ingot resources
  INGOT: ['ingot', 'crafting', 'smithing', 'metal'],

  // Fish resources (raw)
  FISH: ['fish', 'food', 'cooking'],
  FISH_FRESHWATER: ['fish', 'freshwater'],
  FISH_SALTWATER: ['fish', 'saltwater'],
  FISH_SHELLFISH: ['fish', 'shellfish', 'saltwater'],

  // Gemstone resources
  GEMSTONE: ['gemstone', 'crystal', 'jewelry', 'enchanting'],

  // Herb resources
  HERB: ['herb', 'plant', 'alchemy', 'medicine'],

  // Monster drops
  MONSTER_DROP: ['monster-drop', 'crafting'],
  MONSTER_DROP_ALCHEMY: ['monster-drop', 'alchemy'],
  MONSTER_DROP_FOOD: ['monster-drop', 'food', 'cooking-ingredient'],
  MONSTER_DROP_CLOTH: ['monster-drop', 'cloth', 'salvage'],
  MONSTER_DROP_METAL: ['monster-drop', 'metal', 'smithing-ingredient', 'salvage'],

  // Cooked food
  COOKED_FOOD: ['food', 'cooked', 'consumable'],

  // Potions (health)
  POTION: ['potion', 'consumable', 'alchemy'],
  HEALTH_POTION: ['potion', 'healing', 'alchemical'],
  HEALTH_TINCTURE: ['potion', 'healing', 'alchemical', 'tincture'],
  HEALTH_ELIXIR: ['potion', 'healing', 'alchemical', 'elixir'],

  // Potions (mana)
  MANA_POTION: ['potion', 'mana', 'alchemical'],
  MANA_TINCTURE: ['potion', 'mana', 'alchemical', 'tincture'],
} as const;

// ===== SKILL SOURCES =====

export const SKILL_SOURCE = {
  WOODCUTTING: 'woodcutting',
  MINING: 'mining',
  FISHING: 'fishing',
  GATHERING: 'gathering',  // Renamed from HERBALISM
  ALCHEMY: 'alchemy',      // NEW: Potion/reagent crafting
  SMITHING: 'smithing',
  COOKING: 'cooking',
  COMBAT: 'combat',
  ONE_HANDED: 'oneHanded',
  DUAL_WIELD: 'dualWield',
  TWO_HANDED: 'twoHanded',
  RANGED: 'ranged',
  CASTING: 'casting',
  GUN: 'gun',
} as const;

// ===== MATERIAL TYPES =====

export const MATERIAL = {
  // Metals
  BRONZE: 'bronze',
  IRON: 'iron',
  STEEL: 'steel',
  COPPER: 'copper',
  TIN: 'tin',
  SILVER: 'silver',
  GOLD: 'gold',

  // Woods
  OAK: 'oak',
  WILLOW: 'willow',
  MAPLE: 'maple',
  YEW: 'yew',
  BAMBOO: 'bamboo',

  // Gemstones
  AMETHYST: 'amethyst',
  CITRINE: 'citrine',
  AQUAMARINE: 'aquamarine',
  GARNET: 'garnet',
  EMERALD: 'emerald',

  // Other
  LEATHER: 'leather',
  HEMP: 'hemp',
  GEMSTONE: 'gemstone',
  GENERIC: 'generic',
} as const;

// ===== EQUIPMENT SLOTS =====

export const SLOT = {
  MAIN_HAND: 'mainHand',
  OFF_HAND: 'offHand',
  HEAD: 'head',
  BODY: 'body',
  BELT: 'belt',
  GLOVES: 'gloves',
  BOOTS: 'boots',
  NECKLACE: 'necklace',
  RING_RIGHT: 'ringRight',
  RING_LEFT: 'ringLeft',
} as const;

// ===== WEAPON SUBTYPES =====

export const WEAPON_SUBTYPE = {
  SWORD: 'sword',
  AXE: 'axe',
  MACE: 'mace',
  DAGGER: 'dagger',
  STAFF: 'staff',
  BOW: 'bow',
  CROSSBOW: 'crossbow',
  GUN: 'gun',
  SHIELD: 'shield',

  // Tool subtypes
  WOODCUTTING_AXE: 'woodcutting-axe',
  MINING_PICKAXE: 'mining-pickaxe',
  FISHING_ROD: 'fishing-rod',
} as const;

// ===== ARMOR SUBTYPES =====

export const ARMOR_SUBTYPE = {
  HELM: 'helm',
  COIF: 'coif',
  TUNIC: 'tunic',
  PLATE: 'plate',
  GLOVES: 'gloves',
  BOOTS: 'boots',
  BELT: 'belt',
} as const;

// ===== WEAPON TYPES =====

export const WEAPON_TYPE = {
  ONE_HANDED: 'oneHanded',
  DUAL_WIELD: 'dualWield',
  TWO_HANDED: 'twoHanded',
  RANGED: 'ranged',
  CASTING: 'casting',
  GUN: 'gun',
} as const;

// ===== ARMOR TYPES =====

export const ARMOR_TYPE = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
} as const;

// ===== CONSUMABLE SUBTYPES =====

export const CONSUMABLE_SUBTYPE = {
  HEALTH_POTION: 'health-potion',
  MANA_POTION: 'mana-potion',
  FOOD: 'food',
  BUFF_POTION: 'buff-potion',
} as const;
