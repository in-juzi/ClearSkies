import express from 'express';
import * as attributesController from '../controllers/attributesController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All attribute routes require authentication
router.use(protect);

// Get all attributes for the logged-in player
router.get('/', attributesController.getAllAttributes);

// Get a specific attribute
router.get('/:attributeName', attributesController.getAttribute);

// Add experience to a specific attribute
router.post('/:attributeName/experience', attributesController.addAttributeExperience);

export default router;
