import express from 'express';
import * as storageController from '../controllers/storageController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get storage container items and info
router.get('/items/:containerId', storageController.getStorageItems);

// Get storage container capacity
router.get('/capacity/:containerId', storageController.getStorageCapacity);

// Deposit item to storage container
router.post('/deposit', storageController.depositItem);

// Withdraw item from storage container
router.post('/withdraw', storageController.withdrawItem);

// Legacy endpoint - backward compatibility for bank
router.get('/bank/items', storageController.getBankItems);

export default router;
