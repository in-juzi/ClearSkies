const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get player's inventory
router.get('/', inventoryController.getInventory);

// Get single item from inventory
router.get('/items/:instanceId', inventoryController.getItem);

// Add item to inventory
router.post('/items', inventoryController.addItem);

// Add item with random qualities/traits
router.post('/items/random', inventoryController.addRandomItem);

// Remove item from inventory
router.delete('/items', inventoryController.removeItem);

// Get item definitions (catalog)
router.get('/definitions', inventoryController.getItemDefinitions);

// Get single item definition
router.get('/definitions/:itemId', inventoryController.getItemDefinition);

// Reload item definitions (admin)
router.post('/reload', inventoryController.reloadDefinitions);

// Equipment routes
router.get('/equipment', inventoryController.getEquippedItems);
router.post('/equipment/equip', inventoryController.equipItem);
router.post('/equipment/unequip', inventoryController.unequipItem);

module.exports = router;
