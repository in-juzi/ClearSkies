/**
 * Crafting system type definitions
 */

import { SkillName } from './common';

// ===== RECIPE DEFINITIONS =====

/**
 * Recipe unlock conditions
 */
export interface RecipeUnlockConditions {
  discoveredByDefault?: boolean;      // Default: true for backward compatibility
  requiredRecipes?: string[];         // Must craft these recipes first
  requiredItems?: string[];           // Unlock by possessing items
  questRequired?: string;             // Future: quest completion gate
}

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
  unlockConditions?: RecipeUnlockConditions; // Optional recipe discovery system
}

/**
 * Recipe ingredient requirement
 * Supports both specific items (itemId) and subcategory matching (subcategory)
 * Exactly one of itemId or subcategory must be provided
 */
export interface RecipeIngredient {
  itemId?: string;          // Specific item requirement (traditional)
  subcategory?: string;     // OR match any item with this subcategory (new)
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
  startTime: Date;
  endTime: Date;
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
  buyPrice: number; // Price player pays to buy from vendor
  price?: number; // Legacy field, kept for compatibility
  stockType: 'infinite' | 'limited';
  stock?: number | 'infinite'; // Legacy field, kept for compatibility
  currentStock?: number; // For limited stock items
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
