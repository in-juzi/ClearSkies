/**
 * Crafting system type definitions
 */

import { SkillName } from './common';

// ===== RECIPE DEFINITIONS =====

/**
 * Recipe definition
 */
export interface Recipe {
  recipeId: string;
  name: string;
  description: string;
  skill: SkillName;
  requiredLevel: number;
  duration: number; // seconds
  ingredients: RecipeIngredient[];
  outputs: RecipeOutput[];
  experience: number;
}

/**
 * Recipe ingredient requirement
 */
export interface RecipeIngredient {
  itemId: string;
  quantity: number;
}

/**
 * Recipe output item
 */
export interface RecipeOutput {
  itemId: string;
  quantity: number;
  qualityModifier: QualityModifier;
}

/**
 * Quality modifier for crafted items
 */
export type QualityModifier = 'inherit' | 'skillBased' | 'fixed';

// ===== ACTIVE CRAFTING STATE =====

/**
 * Active crafting state (stored in Player.activeCrafting)
 */
export interface ActiveCrafting {
  recipeId: string;
  facilityId: string;
  startTime: number;
  completionTime: number;
  selectedIngredients: Map<string, string[]>; // itemId -> instanceIds[]
}

// ===== VENDOR DEFINITIONS =====

/**
 * Vendor/NPC definition
 */
export interface Vendor {
  vendorId: string;
  name: string;
  description: string;
  greeting?: string;
  iconPath?: string;
  stock: VendorStock[];
  buyback?: boolean;
  acceptsAllItems?: boolean;
  sellPriceMultiplier: number; // Player selling to vendor
  buyPriceMultiplier?: number; // Player buying from vendor
}

/**
 * Vendor stock item
 */
export interface VendorStock {
  itemId: string;
  price: number;
  stock: number | 'infinite';
  restockInterval?: number; // seconds
  restockQuantity?: number;
}

/**
 * Stock item with metadata
 */
export interface StockItem extends VendorStock {
  name: string;
  description: string;
  icon: any;
  rarity: string;
}
