import express from 'express';
import * as manualController from '../controllers/manualController';

const router = express.Router();

/**
 * Manual Routes
 * All routes are PUBLIC (no authentication required)
 * Provides reference data for the game manual
 */

// GET /api/manual/skills - Get all skills with descriptions
router.get('/skills', manualController.getSkills);

// GET /api/manual/attributes - Get all attributes with descriptions
router.get('/attributes', manualController.getAttributes);

// GET /api/manual/items - Get item categories overview
router.get('/items', manualController.getItems);

// GET /api/manual/qualities - Get quality definitions
router.get('/qualities', manualController.getQualities);

// GET /api/manual/traits - Get trait definitions
router.get('/traits', manualController.getTraits);

// GET /api/manual/locations - Get locations overview
router.get('/locations', manualController.getLocations);

// GET /api/manual/biomes - Get biome definitions
router.get('/biomes', manualController.getBiomes);

export default router;
