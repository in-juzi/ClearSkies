const Player = require('../models/Player');
const itemService = require('../services/itemService');

/**
 * Get player's inventory with full item details
 */
exports.getInventory = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Enhance inventory with item details
    const enhancedInventory = player.inventory.map(item => {
      const details = itemService.getItemDetails(item.toObject());
      return details;
    });

    res.json({
      inventory: enhancedInventory,
      capacity: player.inventoryCapacity,
      size: player.getInventorySize(),
      totalValue: player.getInventoryValue()
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

/**
 * Add item to player's inventory
 * Body: { itemId, quantity, qualities, traits }
 */
exports.addItem = async (req, res) => {
  try {
    const { itemId, quantity = 1, qualities = {}, traits = [] } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'itemId is required' });
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Create item instance
    const itemInstance = itemService.createItemInstance(itemId, quantity, qualities, traits);

    // Add to player inventory
    await player.addItem(itemInstance);

    // Get enhanced item details
    const details = itemService.getItemDetails(itemInstance);

    res.status(201).json({
      message: 'Item added to inventory',
      item: details,
      inventorySize: player.getInventorySize()
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ message: 'Error adding item', error: error.message });
  }
};

/**
 * Add item with random qualities/traits
 * Body: { itemId, quantity }
 */
exports.addRandomItem = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'itemId is required' });
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Generate random qualities and traits
    const qualities = itemService.generateRandomQualities(itemId);
    const traits = itemService.generateRandomTraits(itemId);

    // Create item instance
    const itemInstance = itemService.createItemInstance(itemId, quantity, qualities, traits);

    // Add to player inventory
    await player.addItem(itemInstance);

    // Get enhanced item details
    const details = itemService.getItemDetails(itemInstance);

    res.status(201).json({
      message: 'Item added to inventory',
      item: details,
      inventorySize: player.getInventorySize()
    });
  } catch (error) {
    console.error('Add random item error:', error);
    res.status(500).json({ message: 'Error adding item', error: error.message });
  }
};

/**
 * Remove item from inventory
 * Body: { instanceId, quantity }
 */
exports.removeItem = async (req, res) => {
  try {
    const { instanceId, quantity } = req.body;

    if (!instanceId) {
      return res.status(400).json({ message: 'instanceId is required' });
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Remove item
    const removedItem = await player.removeItem(instanceId, quantity);

    res.json({
      message: 'Item removed from inventory',
      item: removedItem,
      inventorySize: player.getInventorySize()
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
};

/**
 * Get single item details
 */
exports.getItem = async (req, res) => {
  try {
    const { instanceId } = req.params;

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const item = player.getItem(instanceId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in inventory' });
    }

    const details = itemService.getItemDetails(item.toObject());

    res.json(details);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

/**
 * Get all available item definitions
 */
exports.getItemDefinitions = async (req, res) => {
  try {
    const { category } = req.query;

    let items;
    if (category) {
      items = itemService.getItemsByCategory(category);
    } else {
      items = itemService.getAllItemDefinitions();
    }

    res.json({ items });
  } catch (error) {
    console.error('Get item definitions error:', error);
    res.status(500).json({ message: 'Error fetching item definitions', error: error.message });
  }
};

/**
 * Get single item definition
 */
exports.getItemDefinition = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = itemService.getItemDefinition(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item definition not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item definition error:', error);
    res.status(500).json({ message: 'Error fetching item definition', error: error.message });
  }
};

/**
 * Reload item definitions (admin function)
 */
exports.reloadDefinitions = async (req, res) => {
  try {
    const result = await itemService.reloadDefinitions();

    res.json({
      message: 'Item definitions reloaded successfully',
      ...result
    });
  } catch (error) {
    console.error('Reload definitions error:', error);
    res.status(500).json({ message: 'Error reloading definitions', error: error.message });
  }
};
