/**
 * Vendor Model - TypeScript interfaces for vendor system
 */

import { ItemDetails } from './inventory.model';
import { Vendor as BaseVendor, VendorStock as BaseVendorStock, Item } from '@shared/types';

// Extended VendorStock with frontend-specific fields
export interface VendorStockItem extends BaseVendorStock {
  itemDefinition?: Item; // Backend populates this when sending vendor data
}

// Alias for backward compatibility
export type VendorStock = VendorStockItem;

// Frontend-specific Vendor type with populated itemDefinition in stock
export interface Vendor extends Omit<BaseVendor, 'stock'> {
  stock: VendorStockItem[]; // Backend populates itemDefinition for each stock item
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
