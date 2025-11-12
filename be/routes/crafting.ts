import express from 'express';
import * as craftingController from '../controllers/craftingController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/crafting/recipes - Get all recipes
router.get('/recipes', craftingController.getAllRecipes);

// GET /api/crafting/recipes/:skill - Get recipes by skill
router.get('/recipes/:skill', craftingController.getRecipesBySkill);

// POST /api/crafting/start - Start crafting
router.post('/start', craftingController.startCrafting);

// POST /api/crafting/complete - Complete crafting
router.post('/complete', craftingController.completeCrafting);

// POST /api/crafting/cancel - Cancel crafting
router.post('/cancel', craftingController.cancelCrafting);

export default router;
