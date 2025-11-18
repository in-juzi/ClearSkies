/**
 * Housing Controller
 * Handles HTTP endpoints for property management and plot purchases
 */

import { Request, Response } from 'express';
import propertyService, { PROPERTY_TIERS } from '../services/propertyService';
import constructionService from '../services/constructionService';
import Player, { IPlayer } from '../models/Player';
import { PropertyTier } from '../models/Property';

// ============================================================================
// Property Endpoints
// ============================================================================

/**
 * GET /api/housing/properties
 * Get all properties owned by the authenticated player
 */
export async function getPlayerProperties(req: Request, res: Response) {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const properties = await propertyService.getPropertiesByOwner(player.userId);

    res.json({
      properties: properties.map(p => p.toObject()),
      count: properties.length,
      maxProperties: player.maxProperties
    });
  } catch (error: any) {
    console.error('Error fetching player properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
}

/**
 * GET /api/housing/properties/:propertyId
 * Get detailed information about a specific property
 */
export async function getPropertyDetails(req: Request, res: Response) {
  try {
    const { propertyId } = req.params;
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const property = await propertyService.getPropertyById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Verify ownership
    if (property.ownerId.toString() !== player.userId.toString()) {
      return res.status(403).json({ message: 'You do not own this property' });
    }

    // Update last visited
    await propertyService.updateLastVisited(propertyId);

    res.json({ property: property.toObject() });
  } catch (error: any) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ message: 'Failed to fetch property', error: error.message });
  }
}

/**
 * GET /api/housing/tiers
 * Get information about all property tiers
 */
export async function getPropertyTiers(req: Request, res: Response) {
  try {
    res.json({ tiers: PROPERTY_TIERS });
  } catch (error: any) {
    console.error('Error fetching property tiers:', error);
    res.status(500).json({ message: 'Failed to fetch tiers', error: error.message });
  }
}

// ============================================================================
// Plot Purchase Endpoints
// ============================================================================

/**
 * POST /api/housing/purchase-plot
 * Purchase a plot of land for a new property
 * Body: { locationId: string, tier: PropertyTier }
 */
export async function purchasePlot(req: Request, res: Response) {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }
    const { locationId, tier } = req.body;

    if (!locationId || !tier) {
      return res.status(400).json({ message: 'locationId and tier are required' });
    }

    // Validate tier
    if (!PROPERTY_TIERS[tier as PropertyTier]) {
      return res.status(400).json({ message: 'Invalid property tier' });
    }

    // Check if player has reached max properties
    if (player.properties.length >= player.maxProperties) {
      return res.status(400).json({
        message: `Maximum properties reached (${player.maxProperties}). Level up Construction to increase limit.`
      });
    }

    // Check if player can afford
    const affordCheck = propertyService.canAffordProperty(
      tier,
      player.gold,
      player.skills.construction.level
    );

    if (!affordCheck.canAfford) {
      return res.status(400).json({ message: affordCheck.reason });
    }

    // Deduct gold from player
    const tierConfig = PROPERTY_TIERS[tier as PropertyTier];
    player.gold -= tierConfig.plotCost;
    await player.save();

    res.json({
      message: 'Plot purchased successfully',
      plotCost: tierConfig.plotCost,
      remainingGold: player.gold,
      tier,
      location: locationId
    });
  } catch (error: any) {
    console.error('Error purchasing plot:', error);
    res.status(500).json({ message: 'Failed to purchase plot', error: error.message });
  }
}

// ============================================================================
// Construction Project Endpoints
// ============================================================================

/**
 * GET /api/housing/projects
 * Get all construction projects owned by the player
 */
export async function getPlayerProjects(req: Request, res: Response) {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }
    const { status } = req.query;

    const projects = await constructionService.getPlayerProjects(
      player.userId,
      status as string | undefined
    );

    res.json({
      projects: projects.map(p => {
        const obj = p.toObject();
        // Convert Maps to objects for JSON serialization
        if (obj.requiredMaterials instanceof Map) {
          obj.requiredMaterials = Object.fromEntries(obj.requiredMaterials);
        }
        if (obj.contributors instanceof Map) {
          obj.contributors = Object.fromEntries(obj.contributors);
        }
        return obj;
      }),
      count: projects.length
    });
  } catch (error: any) {
    console.error('Error fetching player projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
}

/**
 * GET /api/housing/projects/location/:locationId
 * Get active construction projects at a specific location
 */
export async function getLocationProjects(req: Request, res: Response) {
  try {
    const { locationId } = req.params;

    const projects = await constructionService.getActiveProjectsAtLocation(locationId);

    res.json({
      projects: projects.map(p => {
        const obj = p.toObject();
        // Convert Maps to objects for JSON serialization
        if (obj.requiredMaterials instanceof Map) {
          obj.requiredMaterials = Object.fromEntries(obj.requiredMaterials);
        }
        if (obj.contributors instanceof Map) {
          obj.contributors = Object.fromEntries(obj.contributors);
        }
        return obj;
      }),
      count: projects.length,
      location: locationId
    });
  } catch (error: any) {
    console.error('Error fetching location projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
}

/**
 * POST /api/housing/projects/abandon/:projectId
 * Abandon a construction project (owner only, 80% refund)
 */
export async function abandonProject(req: Request, res: Response) {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }
    const { projectId } = req.params;

    const project = await constructionService.getProjectById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const result = await constructionService.abandonProject(project, player);

    // Refund materials to player inventory
    // TODO: Implement material refund to inventory

    // Refund gold
    if (result.refundedGold > 0) {
      player.gold += result.refundedGold;
      await player.save();
    }

    res.json({
      message: 'Project abandoned successfully',
      refundedMaterials: Object.fromEntries(result.refundedMaterials),
      refundedGold: result.refundedGold
    });
  } catch (error: any) {
    console.error('Error abandoning project:', error);
    res.status(500).json({ message: 'Failed to abandon project', error: error.message });
  }
}

export default {
  getPlayerProperties,
  getPropertyDetails,
  getPropertyTiers,
  purchasePlot,
  getPlayerProjects,
  getLocationProjects,
  abandonProject
};
