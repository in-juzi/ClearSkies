export interface ItemDefinition {
  itemId: string;
  name: string;
  description: string;
  category: 'resource' | 'equipment' | 'consumable' | 'crafted';
  equipmentType?: string;
  consumableType?: string;
  slot?: string; // Equipment slot (head, body, mainHand, etc.)
  baseValue: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stackable: boolean;
  maxStack: number;
  properties: {
    weight: number;
    material: string;
    tier: number;
    [key: string]: any;
  };
  allowedQualities: string[];
  allowedTraits: string[];
}

export interface QualityDefinition {
  qualityId: string;
  name: string;
  description: string;
  applicableCategories: string[];
  valueType: 'numeric' | 'boolean' | 'enum';
  range: [number, number];
  effects: {
    [effectType: string]: {
      [key: string]: any;
    };
  };
}

export interface TraitDefinition {
  traitId: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  applicableCategories: string[];
  effects: {
    [effectType: string]: {
      [key: string]: any;
    };
  };
}

export interface ItemInstance {
  instanceId: string;
  itemId: string;
  quantity: number;
  qualities: { [qualityId: string]: number };
  traits: string[];
  equipped?: boolean;
  acquiredAt: Date;
}

export interface ItemDetails extends ItemInstance {
  definition: ItemDefinition;
  vendorPrice: number;
  qualityDetails: {
    [qualityId: string]: QualityDefinition & { value: number };
  };
  traitDetails: TraitDefinition[];
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
  qualities?: { [qualityId: string]: number };
  traits?: string[];
}

export interface RemoveItemRequest {
  instanceId: string;
  quantity?: number;
}

export interface ItemDefinitionsResponse {
  items: ItemDefinition[];
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
