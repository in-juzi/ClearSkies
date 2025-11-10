/**
 * Vendor Model - TypeScript interfaces for vendor system
 */

import { ItemDetails } from './inventory.model';

export interface Vendor {
  vendorId: string;
  name: string;
  description: string;
  greeting: string;
  iconPath: string;
  acceptsAllItems: boolean;
  sellPriceMultiplier: number;
  stock: VendorStockItem[];
}

export interface VendorStockItem {
  itemId: string;
  buyPrice: number;
  stockType: 'infinite' | 'limited';
  currentStock?: number;
  itemDefinition?: ItemDefinition;
}

export interface ItemDefinition {
  itemId: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  tier: number;
  baseValue: number;
  iconPath?: string;
  slot?: string;
  subtype?: string;
  maxStack: number;
}

export interface BuyItemRequest {
  itemId: string;
  quantity: number;
}

export interface SellItemRequest {
  instanceId: string;
  quantity: number;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  transaction?: Transaction;
  gold?: number;
  inventory?: ItemDetails[];
}

export interface Transaction {
  type: 'buy' | 'sell';
  itemId: string;
  quantity: number;
  pricePerItem?: number;
  totalCost?: number;
  totalPrice?: number;
  newGold: number;
}

export interface VendorResponse {
  vendor: Vendor;
}
