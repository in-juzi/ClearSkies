const Player = require('../models/Player');
const vendorService = require('../services/vendorService');
const itemService = require('../services/itemService');

/**
 * GET /api/vendors/:vendorId
 * Get vendor information and stock
 */
exports.getVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = vendorService.getVendor(vendorId);
    if (!vendor) {
      return res.status(404).json({
        message: `Vendor not found: ${vendorId}`
      });
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
      error: error.message
    });
  }
};

/**
 * POST /api/vendors/:vendorId/buy
 * Buy an item from a vendor
 * Body: { itemId, quantity }
 */
exports.buyItem = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { itemId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validation
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Get vendor
    const vendor = vendorService.getVendor(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Check if vendor has item in stock
    if (!vendorService.hasItemInStock(vendorId, itemId)) {
      return res.status(400).json({ message: 'Vendor does not sell this item' });
    }

    // Get buy price
    const buyPrice = vendorService.calculateBuyPrice(vendorId, itemId);
    if (buyPrice === null) {
      return res.status(400).json({ message: 'Failed to calculate buy price' });
    }

    const totalCost = buyPrice * quantity;

    // Get player
    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if player has enough gold
    if (player.gold < totalCost) {
      return res.status(400).json({
        message: `Insufficient gold. Need ${totalCost} gold, have ${player.gold} gold.`,
        required: totalCost,
        current: player.gold
      });
    }

    // Remove gold
    player.removeGold(totalCost);

    // Create item instances and add to inventory
    for (let i = 0; i < quantity; i++) {
      const itemInstance = itemService.createItemInstance(itemId, 1);
      player.addItem(itemInstance);
    }

    await player.save();

    // Get updated inventory
    const inventory = player.inventory.map(item => {
      const plainItem = item.toObject();
      if (plainItem.qualities instanceof Map) {
        plainItem.qualities = Object.fromEntries(plainItem.qualities);
      }
      if (plainItem.traits instanceof Map) {
        plainItem.traits = Object.fromEntries(plainItem.traits);
      }
      return plainItem;
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
      error: error.message
    });
  }
};

/**
 * POST /api/vendors/:vendorId/sell
 * Sell an item to a vendor
 * Body: { instanceId, quantity }
 */
exports.sellItem = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { instanceId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validation
    if (!instanceId) {
      return res.status(400).json({ message: 'Instance ID is required' });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Get vendor
    const vendor = vendorService.getVendor(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Get player
    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Find item in inventory
    const itemInstance = player.inventory.find(item => item.instanceId === instanceId);
    if (!itemInstance) {
      return res.status(404).json({ message: 'Item not found in inventory' });
    }

    // Check if player has enough quantity
    if (itemInstance.quantity < quantity) {
      return res.status(400).json({
        message: `Insufficient quantity. Have ${itemInstance.quantity}, trying to sell ${quantity}.`,
        available: itemInstance.quantity,
        requested: quantity
      });
    }

    // Check if item is equipped
    if (itemInstance.equipped) {
      return res.status(400).json({
        message: 'Cannot sell equipped items. Unequip the item first.'
      });
    }

    // Check if vendor accepts this item
    if (!vendorService.canVendorAcceptItem(vendorId, itemInstance.itemId)) {
      return res.status(400).json({
        message: `${vendor.name} does not accept this item.`
      });
    }

    // Calculate sell price (per item)
    const sellPricePerItem = vendorService.calculateSellPrice(vendorId, itemInstance);
    const totalSellPrice = sellPricePerItem * quantity;

    // Remove items from inventory
    player.removeItem(instanceId, quantity);

    // Add gold to player
    player.addGold(totalSellPrice);

    await player.save();

    // Get updated inventory
    const inventory = player.inventory.map(item => {
      const plainItem = item.toObject();
      if (plainItem.qualities instanceof Map) {
        plainItem.qualities = Object.fromEntries(plainItem.qualities);
      }
      if (plainItem.traits instanceof Map) {
        plainItem.traits = Object.fromEntries(plainItem.traits);
      }
      return plainItem;
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
      error: error.message
    });
  }
};
