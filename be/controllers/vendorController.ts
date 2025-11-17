import { Request, Response } from 'express';
import Player from '../models/Player';
import vendorService from '../services/vendorService';
import itemService from '../services/itemService';
import questService from '../services/questService';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface BuyItemRequest {
  itemId: string;
  quantity?: number;
}

interface SellItemRequest {
  instanceId: string;
  quantity?: number;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * GET /api/vendors/:vendorId
 * Get vendor information and stock
 */
export const getVendor = async (
  req: Request<{ vendorId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { vendorId } = req.params;

    const vendor = vendorService.getVendor(vendorId);
    if (!vendor) {
      res.status(404).json({
        message: `Vendor not found: ${vendorId}`
      });
      return;
    }

    // Get stock with populated item definitions
    const stock = vendorService.getVendorStock(vendorId);

    res.json({
      vendor: {
        vendorId: vendor.vendorId,
        name: vendor.name,
        description: vendor.description,
        greeting: vendor.greeting,
        iconPath: vendor.iconPath,
        stock: stock
      }
    });
  } catch (error) {
    console.error('Error getting vendor:', error);
    res.status(500).json({
      message: 'Failed to get vendor information',
      error: (error as Error).message
    });
  }
};

/**
 * POST /api/vendors/:vendorId/buy
 * Buy an item from a vendor
 * Body: { itemId, quantity }
 */
export const buyItem = async (
  req: Request<{ vendorId: string }, {}, BuyItemRequest>,
  res: Response
): Promise<void> => {
  try {
    const { vendorId } = req.params;
    const { itemId, quantity = 1 } = req.body;
    const userId = req.user!._id;

    // Validation
    if (!itemId) {
      res.status(400).json({ message: 'Item ID is required' });
      return;
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      res.status(400).json({ message: 'Quantity must be a positive integer' });
      return;
    }

    // Get vendor
    const vendor = vendorService.getVendor(vendorId);
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    // Check if vendor has item in stock
    if (!vendorService.hasItemInStock(vendorId, itemId)) {
      res.status(400).json({ message: 'Vendor does not sell this item' });
      return;
    }

    // Get player (needed for effect-based price modifiers)
    const player = await Player.findOne({ userId });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Get buy price with player modifiers
    const buyPrice = vendorService.calculateBuyPrice(vendorId, itemId, player);
    if (buyPrice === null) {
      res.status(400).json({ message: 'Failed to calculate buy price' });
      return;
    }

    const totalCost = buyPrice * quantity;

    // Check if player has enough gold
    if (player.gold < totalCost) {
      res.status(400).json({
        message: `Insufficient gold. Need ${totalCost} gold, have ${player.gold} gold.`,
        required: totalCost,
        current: player.gold
      });
      return;
    }

    // Remove gold
    player.removeGold(totalCost);

    // Create item instances and add to inventory
    for (let i = 0; i < quantity; i++) {
      const itemInstance = itemService.createItemInstance(itemId, 1);
      player.addItem(itemInstance);
    }

    // Update quest progress for item acquisition
    await questService.onItemAcquired(player, itemId, quantity);

    await player.save();

    // Get updated inventory with full item details
    const inventory = player.inventory.map(item => {
      return itemService.getItemDetails(item);
    });

    res.json({
      success: true,
      message: `Purchased ${quantity}x ${itemId} for ${totalCost} gold`,
      transaction: {
        type: 'buy',
        itemId,
        quantity,
        pricePerItem: buyPrice,
        totalCost,
        newGold: player.gold
      },
      gold: player.gold,
      inventory
    });
  } catch (error) {
    console.error('Error buying item:', error);
    res.status(500).json({
      message: 'Failed to complete purchase',
      error: (error as Error).message
    });
  }
};

/**
 * POST /api/vendors/:vendorId/sell
 * Sell an item to a vendor
 * Body: { instanceId, quantity }
 */
export const sellItem = async (
  req: Request<{ vendorId: string }, {}, SellItemRequest>,
  res: Response
): Promise<void> => {
  try {
    const { vendorId } = req.params;
    const { instanceId, quantity = 1 } = req.body;
    const userId = req.user!._id;

    // Validation
    if (!instanceId) {
      res.status(400).json({ message: 'Instance ID is required' });
      return;
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      res.status(400).json({ message: 'Quantity must be a positive integer' });
      return;
    }

    // Get vendor
    const vendor = vendorService.getVendor(vendorId);
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    // Get player
    const player = await Player.findOne({ userId });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Find item in inventory
    const itemInstance = player.inventory.find(item => item.instanceId === instanceId);
    if (!itemInstance) {
      res.status(404).json({ message: 'Item not found in inventory' });
      return;
    }

    // Check if player has enough quantity
    if (itemInstance.quantity < quantity) {
      res.status(400).json({
        message: `Insufficient quantity. Have ${itemInstance.quantity}, trying to sell ${quantity}.`,
        available: itemInstance.quantity,
        requested: quantity
      });
      return;
    }

    // Check if item is equipped
    if (itemInstance.equipped) {
      res.status(400).json({
        message: 'Cannot sell equipped items. Unequip the item first.'
      });
      return;
    }

    // Check if vendor accepts this item
    if (!vendorService.canVendorAcceptItem(vendorId, itemInstance.itemId)) {
      res.status(400).json({
        message: `${vendor.name} does not accept this item.`
      });
      return;
    }

    // Calculate sell price (per item) with player modifiers
    const sellPricePerItem = vendorService.calculateSellPrice(vendorId, itemInstance, player);
    const totalSellPrice = sellPricePerItem * quantity;

    // Remove items from inventory
    player.removeItem(instanceId, quantity);

    // Add gold to player
    player.addGold(totalSellPrice);

    await player.save();

    // Get updated inventory with full item details
    const inventory = player.inventory.map(item => {
      return itemService.getItemDetails(item);
    });

    res.json({
      success: true,
      message: `Sold ${quantity}x ${itemInstance.itemId} for ${totalSellPrice} gold`,
      transaction: {
        type: 'sell',
        itemId: itemInstance.itemId,
        quantity,
        pricePerItem: sellPricePerItem,
        totalPrice: totalSellPrice,
        newGold: player.gold
      },
      gold: player.gold,
      inventory
    });
  } catch (error) {
    console.error('Error selling item:', error);
    res.status(500).json({
      message: 'Failed to complete sale',
      error: (error as Error).message
    });
  }
};
