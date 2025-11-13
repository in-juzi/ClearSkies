// Import Item and IconConfig from shared types (replaces ItemDefinition and ItemIcon)
import { Item, IconConfig } from '@shared/types';

// Re-export IconConfig as ItemIcon for backward compatibility
export type ItemIcon = IconConfig;

export interface QualityLevelData {
  name: string;
  description: string;
  effects: {
    [effectType: string]: {
      [key: string]: any;
    };
  };
}

export interface QualityDefinition {
  qualityId: string;
  name: string;
  shorthand: string;
  description: string;
  applicableCategories: string[];
  valueType: 'level';
  maxLevel: number;
  levels: {
    [level: string]: QualityLevelData;
  };
}

export interface TraitLevelData {
  name: string;
  description: string;
  effects: {
    [effectType: string]: {
      [key: string]: any;
    };
  };
}

export interface TraitDefinition {
  traitId: string;
  name: string;
  shorthand: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  applicableCategories: string[];
  maxLevel: number;
  levels: {
    [level: string]: TraitLevelData;
  };
}

export interface ItemInstance {
  instanceId: string;
  itemId: string;
  quantity: number;
  qualities: { [qualityId: string]: number }; // Map of qualityId -> level (integer)
  traits: { [traitId: string]: number }; // Map of traitId -> level (integer)
  equipped?: boolean;
  acquiredAt: Date;
}

export interface ItemDetails extends ItemInstance {
  definition: Item;
  subcategories?: string[]; // Convenience property from definition
  vendorPrice: number;
  qualityDetails: {
    [qualityId: string]: {
      qualityId: string;
      name: string;
      shorthand: string;
      level: number;
      maxLevel: number;
      levelData: QualityLevelData;
    };
  };
  traitDetails: {
    [traitId: string]: {
      traitId: string;
      name: string;
      shorthand: string;
      rarity: string;
      level: number;
      maxLevel: number;
      levelData: TraitLevelData;
    };
  };
}

export interface InventoryResponse {
  inventory: ItemDetails[];
  capacity: number;
  size: number;
  totalValue: number;
}

export interface AddItemRequest {
  itemId: string;
  quantity?: number;
  qualities?: { [qualityId: string]: number }; // Map of qualityId -> level (integer)
  traits?: { [traitId: string]: number }; // Map of traitId -> level (integer)
}

export interface RemoveItemRequest {
  instanceId: string;
  quantity?: number;
}

export interface ItemDefinitionsResponse {
  items: Item[];
}

// Equipment System

export type EquipmentSlot =
  | 'head'
  | 'body'
  | 'mainHand'
  | 'offHand'
  | 'belt'
  | 'gloves'
  | 'boots'
  | 'necklace'
  | 'ringRight'
  | 'ringLeft';

export interface EquipmentSlots {
  [slotName: string]: string | null; // slot name -> instanceId or null
}

export interface EquippedItemsResponse {
  equippedItems: {
    [slotName: string]: ItemDetails;
  };
  slots: EquipmentSlots;
}

export interface EquipItemRequest {
  instanceId: string;
  slotName: string;
}

export interface UnequipItemRequest {
  slotName: string;
}

export interface EquipmentResponse {
  message: string;
  slot: string;
  item: ItemDetails | null;
  equippedItems: {
    [slotName: string]: ItemInstance;
  };
}
