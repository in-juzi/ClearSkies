/**
 * Housing Routes
 * API endpoints for property management and construction
 */

import express from 'express';
import housingController from '../controllers/housingController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ============================================================================
// Property Routes
// ============================================================================

// Get all properties owned by player
router.get('/properties', housingController.getPlayerProperties);

// Get specific property details
router.get('/properties/:propertyId', housingController.getPropertyDetails);

// Get property tier information
router.get('/tiers', housingController.getPropertyTiers);

// Purchase a plot of land
router.post('/purchase-plot', housingController.purchasePlot);

// ============================================================================
// Construction Project Routes
// ============================================================================

// Get all projects owned by player
router.get('/projects', housingController.getPlayerProjects);

// Get active projects at a location
router.get('/projects/location/:locationId', housingController.getLocationProjects);

// Abandon a construction project
router.post('/projects/abandon/:projectId', housingController.abandonProject);

export default router;
