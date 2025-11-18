/**
 * Property Service
 * Handles CRUD operations for player properties (houses, shops, workshops)
 */

import { Property, IProperty, PropertyType, PropertyTier, RoomType } from '../models/Property';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

// ============================================================================
// Property Configuration
// ============================================================================

export const PROPERTY_TIERS = {
  cottage: {
    tier: 'cottage' as PropertyTier,
    requiredLevel: 5,
    plotCost: 5000,
    maxRooms: 2,
    maxStorage: 2,
    maxGardens: 3,
    buildActions: 50
  },
  house: {
    tier: 'house' as PropertyTier,
    requiredLevel: 15,
    plotCost: 15000,
    maxRooms: 4,
    maxStorage: 4,
    maxGardens: 6,
    buildActions: 100
  },
  manor: {
    tier: 'manor' as PropertyTier,
    requiredLevel: 25,
    plotCost: 35000,
    maxRooms: 7,
    maxStorage: 6,
    maxGardens: 9,
    buildActions: 150
  },
  estate: {
    tier: 'estate' as PropertyTier,
    requiredLevel: 35,
    plotCost: 75000,
    maxRooms: 10,
    maxStorage: 8,
    maxGardens: 12,
    buildActions: 200
  },
  'grand-estate': {
    tier: 'grand-estate' as PropertyTier,
    requiredLevel: 45,
    plotCost: 150000,
    maxRooms: 13,
    maxStorage: 10,
    maxGardens: 15,
    buildActions: 250
  }
};

// ============================================================================
// Property CRUD Operations
// ============================================================================

/**
 * Create a new property
 */
export async function createProperty(
  ownerId: mongoose.Types.ObjectId,
  tier: PropertyTier,
  location: string,
  propertyType: PropertyType = 'house'
): Promise<IProperty> {
  const propertyId = `property-${uuidv4()}`;

  const property = new Property({
    propertyId,
    ownerId,
    propertyType,
    tier,
    location,
    rooms: [],
    storageContainers: [],
    gardens: [],
    createdAt: new Date(),
    lastVisited: new Date()
  });

  await property.save();
  return property;
}

/**
 * Get property by ID
 */
export async function getPropertyById(propertyId: string): Promise<IProperty | null> {
  return await Property.findOne({ propertyId });
}

/**
 * Get all properties owned by a user
 */
export async function getPropertiesByOwner(ownerId: mongoose.Types.ObjectId): Promise<IProperty[]> {
  return await Property.find({ ownerId }).sort({ createdAt: -1 });
}

/**
 * Get properties at a specific location
 */
export async function getPropertiesByLocation(location: string): Promise<IProperty[]> {
  return await Property.find({ location }).sort({ createdAt: -1 });
}

/**
 * Update property last visited timestamp
 */
export async function updateLastVisited(propertyId: string): Promise<void> {
  await Property.updateOne({ propertyId }, { lastVisited: new Date() });
}

/**
 * Delete a property
 */
export async function deleteProperty(propertyId: string): Promise<boolean> {
  const result = await Property.deleteOne({ propertyId });
  return result.deletedCount > 0;
}

// ============================================================================
// Room Management
// ============================================================================

/**
 * Add a room to a property
 */
export async function addRoom(
  propertyId: string,
  roomType: RoomType,
  roomLevel: number = 1
): Promise<IProperty | null> {
  const property = await Property.findOne({ propertyId });
  if (!property) return null;

  const tierConfig = PROPERTY_TIERS[property.tier];
  if (property.rooms.length >= tierConfig.maxRooms) {
    throw new Error(`Property at max room capacity (${tierConfig.maxRooms})`);
  }

  const roomId = `room-${uuidv4()}`;
  property.rooms.push({
    roomId,
    roomType,
    level: roomLevel,
    furniture: []
  });

  await property.save();
  return property;
}

/**
 * Remove a room from a property
 */
export async function removeRoom(propertyId: string, roomId: string): Promise<IProperty | null> {
  const property = await Property.findOne({ propertyId });
  if (!property) return null;

  property.rooms = property.rooms.filter(r => r.roomId !== roomId);
  await property.save();
  return property;
}

// ============================================================================
// Storage Management
// ============================================================================

/**
 * Add a storage container to a property
 */
export async function addStorageContainer(
  propertyId: string,
  containerType: string,
  name: string,
  capacity: number
): Promise<IProperty | null> {
  const property = await Property.findOne({ propertyId });
  if (!property) return null;

  const tierConfig = PROPERTY_TIERS[property.tier];
  if (property.storageContainers.length >= tierConfig.maxStorage) {
    throw new Error(`Property at max storage capacity (${tierConfig.maxStorage})`);
  }

  const containerId = `${propertyId}-storage-${uuidv4()}`;
  property.storageContainers.push({
    containerId,
    containerType,
    name,
    capacity,
    items: []
  });

  await property.save();
  return property;
}

// ============================================================================
// Garden Management
// ============================================================================

/**
 * Add a garden plot to a property
 */
export async function addGardenPlot(propertyId: string): Promise<IProperty | null> {
  const property = await Property.findOne({ propertyId });
  if (!property) return null;

  const tierConfig = PROPERTY_TIERS[property.tier];
  if (property.gardens.length >= tierConfig.maxGardens) {
    throw new Error(`Property at max garden capacity (${tierConfig.maxGardens})`);
  }

  const plotId = `plot-${uuidv4()}`;
  property.gardens.push({
    plotId,
    crop: null,
    plantedAt: null,
    harvestAt: null,
    qualityBonus: 0
  });

  await property.save();
  return property;
}

/**
 * Plant a crop in a garden plot
 */
export async function plantCrop(
  propertyId: string,
  plotId: string,
  seedItemId: string,
  growthDuration: number,
  qualityBonus: number = 0
): Promise<IProperty | null> {
  const property = await Property.findOne({ propertyId });
  if (!property) return null;

  const plot = property.gardens.find(g => g.plotId === plotId);
  if (!plot) throw new Error('Garden plot not found');
  if (plot.crop) throw new Error('Plot already has a crop growing');

  const now = new Date();
  plot.crop = seedItemId;
  plot.plantedAt = now;
  plot.harvestAt = new Date(now.getTime() + growthDuration * 1000);
  plot.qualityBonus = qualityBonus;

  await property.save();
  return property;
}

/**
 * Harvest a crop from a garden plot
 */
export async function harvestCrop(
  propertyId: string,
  plotId: string
): Promise<{ property: IProperty; seedItemId: string; qualityBonus: number } | null> {
  const property = await Property.findOne({ propertyId });
  if (!property) return null;

  const plot = property.gardens.find(g => g.plotId === plotId);
  if (!plot) throw new Error('Garden plot not found');
  if (!plot.crop) throw new Error('No crop to harvest');
  if (!plot.harvestAt || plot.harvestAt > new Date()) {
    throw new Error('Crop is not ready to harvest yet');
  }

  const seedItemId = plot.crop;
  const qualityBonus = plot.qualityBonus;

  // Reset plot
  plot.crop = null;
  plot.plantedAt = null;
  plot.harvestAt = null;
  plot.qualityBonus = 0;

  await property.save();
  return { property, seedItemId, qualityBonus };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if player can afford a property tier
 */
export function canAffordProperty(tier: PropertyTier, playerGold: number, constructionLevel: number): {
  canAfford: boolean;
  reason?: string;
} {
  const tierConfig = PROPERTY_TIERS[tier];

  if (constructionLevel < tierConfig.requiredLevel) {
    return {
      canAfford: false,
      reason: `Construction level ${tierConfig.requiredLevel} required`
    };
  }

  if (playerGold < tierConfig.plotCost) {
    return {
      canAfford: false,
      reason: `Insufficient gold (need ${tierConfig.plotCost}g)`
    };
  }

  return { canAfford: true };
}

export default {
  PROPERTY_TIERS,
  createProperty,
  getPropertyById,
  getPropertiesByOwner,
  getPropertiesByLocation,
  updateLastVisited,
  deleteProperty,
  addRoom,
  removeRoom,
  addStorageContainer,
  addGardenPlot,
  plantCrop,
  harvestCrop,
  canAffordProperty
};
