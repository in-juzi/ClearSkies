/**
 * Housing System Types
 * Shared between frontend and backend
 */

export type PropertyType = 'house' | 'shop' | 'workshop';
export type PropertyTier = 'cottage' | 'house' | 'manor' | 'estate' | 'grand-estate';
export type ProjectType = 'house' | 'room' | 'storage' | 'garden-plot' | 'shop' | 'workshop';
export type ProjectStatus = 'in-progress' | 'completed' | 'abandoned';
export type RoomType = 'kitchen' | 'forge' | 'laboratory' | 'workshop' | 'enchanting-chamber' |
  'loom-room' | 'study' | 'greenhouse' | 'storage-room' | 'garden-extension';

export interface Room {
  roomId: string;
  roomType: RoomType;
  level: number;
  furniture: any[];
}

export interface StorageContainer {
  containerId: string;
  containerType: string;
  name: string;
  capacity: number;
  items: any[];
}

export interface GardenPlot {
  plotId: string;
  crop: string | null;
  plantedAt: Date | null;
  harvestAt: Date | null;
  qualityBonus: number;
}

export interface Property {
  propertyId: string;
  ownerId: string;
  propertyType: PropertyType;
  tier: PropertyTier;
  location: string;
  rooms: Room[];
  storageContainers: StorageContainer[];
  gardens: GardenPlot[];
  createdAt: Date;
  lastVisited: Date;
}

export interface MaterialRequirement {
  itemId: string;
  required: number;
  contributed: number;
}

export interface Contributor {
  userId: string;
  username: string;
  actionsCompleted: number;
  materialsContributed: Record<string, number>;
}

export interface ConstructionProject {
  projectId: string;
  projectType: ProjectType;
  ownerId: string;
  ownerName: string;
  propertyId: string | null;
  location: string;
  requiredMaterials: Record<string, MaterialRequirement>;
  requiredGold: number;
  goldPaid: boolean;
  totalActions: number;
  completedActions: number;
  contributors: Record<string, Contributor>;
  rewards: {
    baseXP: number;
    ownerBonusXP: number;
    completionItem: string | null;
  };
  status: ProjectStatus;
  startedAt: Date;
  completedAt: Date | null;
}

export interface PropertyTierConfig {
  tier: PropertyTier;
  requiredLevel: number;
  plotCost: number;
  maxRooms: number;
  maxStorage: number;
  maxGardens: number;
  buildActions: number;
}
