import express from 'express';
import * as inventoryController from '../controllers/inventoryController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get player's inventory
router.get('/', inventoryController.getInventory);

// Get single item from inventory
router.get('/items/:instanceId', inventoryController.getItem);

// Get scaled combat stats for an item
router.get('/items/:instanceId/combat-stats', inventoryController.getItemCombatStats);

// Add item to inventory
router.post('/items', inventoryController.addItem);

// Add item with random qualities/traits
router.post('/items/random', inventoryController.addRandomItem);

// Remove item from inventory
router.delete('/items', inventoryController.removeItem);

// NOTE: Item definition endpoints removed - frontend now uses ItemDataService
// which directly imports backend ItemRegistry (zero API calls needed)

// Reload item definitions (admin) - kept for backward compatibility / hot-reload
router.post('/reload', inventoryController.reloadDefinitions);

// Equipment routes
router.get('/equipment', inventoryController.getEquippedItems);
router.get('/equipment/stats', inventoryController.getEquipmentStats);
router.post('/equipment/equip', inventoryController.equipItem);
router.post('/equipment/unequip', inventoryController.unequipItem);

// Consumable item routes
router.post('/use', inventoryController.useItem);

export default router;
