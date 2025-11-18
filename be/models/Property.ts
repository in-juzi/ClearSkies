/**
 * Property Model
 * Represents player-owned properties (houses, shops, workshops)
 */

import mongoose, { Schema, Document } from 'mongoose';
import { InventoryItem } from './Player';

// ============================================================================
// Type Definitions
// ============================================================================

export type PropertyType = 'house' | 'shop' | 'workshop';
export type PropertyTier = 'cottage' | 'house' | 'manor' | 'estate' | 'grand-estate';
export type RoomType = 'kitchen' | 'forge' | 'laboratory' | 'workshop' | 'enchanting-chamber' |
  'loom-room' | 'study' | 'greenhouse' | 'storage-room' | 'garden-extension';

export interface Room {
  roomId: string;
  roomType: RoomType;
  level: number;
  furniture: any[]; // Future: furniture placement
}

export interface StorageContainer {
  containerId: string;
  containerType: string;
  name: string;
  capacity: number;
  items: InventoryItem[];
}

export interface GardenPlot {
  plotId: string;
  crop: string | null; // itemId of planted seed
  plantedAt: Date | null;
  harvestAt: Date | null;
  qualityBonus: number; // From greenhouse room
}

export interface IProperty extends Document {
  propertyId: string;
  ownerId: mongoose.Types.ObjectId; // Reference to User
  propertyType: PropertyType;
  tier: PropertyTier;
  location: string; // locationId (e.g., 'kennik-residential')

  // House-specific fields
  rooms: Room[];
  storageContainers: StorageContainer[];
  gardens: GardenPlot[];

  createdAt: Date;
  lastVisited: Date;
}

// ============================================================================
// Schema Definition
// ============================================================================

const propertySchema = new Schema<IProperty>({
  propertyId: {
    type: String,
    required: true,
    unique: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  propertyType: {
    type: String,
    enum: ['house', 'shop', 'workshop'],
    required: true
  },
  tier: {
    type: String,
    enum: ['cottage', 'house', 'manor', 'estate', 'grand-estate'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rooms: [{
    roomId: { type: String, required: true },
    roomType: {
      type: String,
      enum: ['kitchen', 'forge', 'laboratory', 'workshop', 'enchanting-chamber',
        'loom-room', 'study', 'greenhouse', 'storage-room', 'garden-extension'],
      required: true
    },
    level: { type: Number, default: 1, min: 1 },
    furniture: { type: [Schema.Types.Mixed], default: [] }
  }],
  storageContainers: [{
    containerId: { type: String, required: true },
    containerType: { type: String, required: true },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    items: [{
      instanceId: { type: String, required: true },
      itemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      qualities: { type: Map, of: Number, default: new Map() },
      traits: { type: Map, of: Number, default: new Map() },
      equipped: { type: Boolean, default: false },
      acquiredAt: { type: Date, default: Date.now }
    }]
  }],
  gardens: [{
    plotId: { type: String, required: true },
    crop: { type: String, default: null },
    plantedAt: { type: Date, default: null },
    harvestAt: { type: Date, default: null },
    qualityBonus: { type: Number, default: 0 }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastVisited: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ============================================================================
// Indexes
// ============================================================================

propertySchema.index({ ownerId: 1 });
propertySchema.index({ location: 1 });
propertySchema.index({ propertyType: 1 });

// ============================================================================
// Export Model
// ============================================================================

export const Property = mongoose.model<IProperty>('Property', propertySchema);
