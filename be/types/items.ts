/**
 * Item system type definitions
 */

import {
  IconConfig,
  Rarity,
  ItemCategory,
  EquipmentSlot,
  BaseItemProperties,
  QualityMap,
  TraitMap
} from './common';

// ===== BASE ITEM INTERFACE =====

/**
 * Base interface for all items
 */
export interface Item {
  itemId: string;
  name: string;
  description: string;
  category: ItemCategory;
  subcategories: readonly string[];
  baseValue: number;
  rarity: Rarity;
  stackable: boolean;
  maxStack?: number;
  icon: IconConfig;
  properties: ItemProperties;
  allowedQualities: readonly string[];
  allowedTraits: readonly string[];
}

/**
 * Base item properties (all items have these)
 */
export interface ItemProperties extends BaseItemProperties {
  weight: number;
  material: string;
  tier: number;
  skillSource?: string; // For resources
}

// ===== EQUIPMENT ITEMS =====

/**
 * Equipment item (weapons, armor, tools)
 */
export interface EquipmentItem extends Item {
  category: 'equipment';
  stackable: false;
  slot: EquipmentSlot;
  subtype: string;
  properties: EquipmentProperties;
}

/**
 * Equipment-specific properties
 */
export interface EquipmentProperties extends ItemProperties {
  requiredLevel: number;
  // Weapon properties
  damageRoll?: string;
  attackSpeed?: number;
  critChance?: number;
  skillScalar?: string;
  toolEfficiency?: number;
  // Armor properties
  armor?: number;
  evasion?: number;
  blockChance?: number;
}

/**
 * Weapon item (melee, ranged, casting)
 */
export interface WeaponItem extends EquipmentItem {
  subcategories: string[]; // Must include 'weapon'
  properties: WeaponProperties;
}

/**
 * Weapon-specific properties
 */
export interface WeaponProperties extends EquipmentProperties {
  damageRoll: string;
  attackSpeed: number;
  critChance: number;
  skillScalar: string;
  toolEfficiency?: number; // For gathering tools that are also weapons
}

/**
 * Armor item (head, body, accessories)
 */
export interface ArmorItem extends EquipmentItem {
  subcategories: string[]; // Must include 'armor'
  properties: ArmorProperties;
}

/**
 * Armor-specific properties
 */
export interface ArmorProperties extends EquipmentProperties {
  armor?: number;
  evasion?: number;
  blockChance?: number;
}

/**
 * Tool item (gathering tools)
 */
export interface ToolItem extends EquipmentItem {
  subcategories: string[]; // Must include 'tool'
  properties: ToolProperties;
}

/**
 * Tool-specific properties
 */
export interface ToolProperties extends EquipmentProperties {
  toolEfficiency: number;
  damageRoll?: string; // Some tools can be used as weapons
  attackSpeed?: number;
  critChance?: number;
  skillScalar?: string;
}

// ===== CONSUMABLE ITEMS =====

/**
 * Consumable item (food, potions)
 */
export interface ConsumableItem extends Item {
  category: 'consumable';
  properties: ConsumableProperties;
}

/**
 * Consumable-specific properties
 */
export interface ConsumableProperties extends ItemProperties {
  healthRestore?: number;
  manaRestore?: number;
  craftedFrom?: string;
}

// ===== RESOURCE ITEMS =====

/**
 * Resource item (wood, ore, herbs, etc.)
 */
export interface ResourceItem extends Item {
  category: 'resource';
  stackable: true;
  properties: ResourceProperties;
}

/**
 * Resource-specific properties
 */
export interface ResourceProperties extends ItemProperties {
  skillSource: string; // Which skill produces this resource
}

// ===== QUALITY & TRAIT DEFINITIONS =====

/**
 * Quality definition (from qualities.json)
 */
export interface QualityDefinition {
  qualityId: string;
  name: string;
  shorthand: string;
  description: string;
  applicableCategories: string[];
  valueType: string;
  maxLevel: number;
  levels: Record<string, QualityLevel>;
}

/**
 * Quality level (1-5)
 */
export interface QualityLevel {
  name: string;
  description: string;
  effects: {
    alchemy?: {
      potencyMultiplier: number;
    };
    vendorPrice?: {
      modifier: number;
    };
    crafting?: {
      bonusMultiplier?: number;
      qualityBonus?: number;
    };
    cooking?: {
      bonusMultiplier?: number;
      qualityBonus?: number;
      yieldMultiplier?: number;
    };
    smithing?: {
      bonusMultiplier?: number;
      qualityBonus?: number;
    };
    [key: string]: any; // Allow additional effect types
  };
}

/**
 * Trait definition (from traits.json)
 */
export interface TraitDefinition {
  traitId: string;
  name: string;
  shorthand: string;
  description: string;
  rarity: Rarity;
  applicableCategories: string[];
  maxLevel: number;
  levels: Record<string, TraitLevel>;
}

/**
 * Trait level (1-3)
 */
export interface TraitLevel {
  name: string;
  description: string;
  effects: {
    vendorPrice?: {
      modifier: number;
    };
    crafting?: {
      bonusMultiplier?: number;
      damageBonus?: number;
    };
    combat?: {
      bonusMultiplier?: number;
      damageBonus?: number;
      healthDrain?: number;
    };
    alchemy?: {
      bonusProperties: string[];
    };
    smithing?: {
      bonusMultiplier?: number;
      qualityRetention?: number;
      qualityBonus?: number;
    };
    [key: string]: any; // Allow additional effect types
  };
}

// ===== ITEM GENERATION CONFIG =====

/**
 * Item generation configuration
 */
export interface ItemGenerationConfig {
  qualityDistribution: {
    none: number;
    one: number;
    two: number;
    three: number;
    four: number;
  };
  traitAppearanceRates: Record<Rarity, number>;
  qualityLevelDamping: number;
  tierBasedLevelDistribution: {
    enabled: boolean;
    baseLevelForTier: Record<number, number>;
  };
}
