/**
 * Crafting system type definitions
 */
import { SkillName } from './common';
/**
 * Recipe unlock conditions
 */
export interface RecipeUnlockConditions {
    discoveredByDefault?: boolean;
    requiredRecipes?: string[];
    requiredItems?: string[];
    questRequired?: string;
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
    duration: number;
    ingredients: RecipeIngredient[];
    outputs: RecipeOutput[];
    experience: number;
    unlockConditions?: RecipeUnlockConditions;
}
/**
 * Recipe ingredient requirement
 * Supports both specific items (itemId) and subcategory matching (subcategory)
 * Exactly one of itemId or subcategory must be provided
 */
export interface RecipeIngredient {
    itemId?: string;
    subcategory?: string;
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
/**
 * Active crafting state (stored in Player.activeCrafting)
 */
export interface ActiveCrafting {
    recipeId: string;
    startTime: Date;
    endTime: Date;
    selectedIngredients: Map<string, string[]>;
}
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
    sellPriceMultiplier: number;
    buyPriceMultiplier?: number;
}
/**
 * Vendor stock item
 */
export interface VendorStock {
    itemId: string;
    buyPrice: number;
    price?: number;
    stockType: 'infinite' | 'limited';
    stock?: number | 'infinite';
    currentStock?: number;
    restockInterval?: number;
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
//# sourceMappingURL=crafting.d.ts.map