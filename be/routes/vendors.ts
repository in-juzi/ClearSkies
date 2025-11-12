import express from 'express';
import * as vendorController from '../controllers/vendorController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All vendor routes require authentication
router.use(protect);

/**
 * GET /api/vendors/:vendorId
 * Get vendor information and stock
 */
router.get('/:vendorId', vendorController.getVendor);

/**
 * POST /api/vendors/:vendorId/buy
 * Buy an item from a vendor
 * Body: { itemId, quantity }
 */
router.post('/:vendorId/buy', vendorController.buyItem);

/**
 * POST /api/vendors/:vendorId/sell
 * Sell an item to a vendor
 * Body: { instanceId, quantity }
 */
router.post('/:vendorId/sell', vendorController.sellItem);

export default router;
