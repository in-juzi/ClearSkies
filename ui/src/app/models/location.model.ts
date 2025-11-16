// Import types from shared (replaces duplicate definitions)
import {
  Activity as BaseActivity,
  GatheringActivity,
  CombatActivity,
  ActivityUnion,
  Biome,
  BiomeDefinition as SharedBiomeDefinition
} from '@shared/types';

// Re-export BiomeDefinition from shared
export type BiomeDefinition = SharedBiomeDefinition;

// Frontend-specific Activity type with populated fields from backend
// The backend populates duration and monsterLevel fields that exist in GatheringActivity/CombatActivity
export interface Activity extends BaseActivity {
  duration?: number; // From GatheringActivity or CombatActivity
  monsterLevel?: number; // From CombatActivity (populated by backend from monster data)
  requirementFailures?: string[]; // Frontend validation errors
  rewards?: any; // Activity rewards
  available?: boolean; // Frontend availability state (based on requirement validation)
  stub?: boolean; // Flag for stub/placeholder activities
  stubMessage?: string; // Message for stub activities
}

// Frontend-specific Facility type with populated activity objects
export interface Facility {
  facilityId: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  vendorIds?: string[]; // Array of vendor IDs
  vendorId?: string; // Legacy single vendor ID (deprecated, for backward compatibility)
  craftingSkills?: string[];
  activities: Activity[]; // Backend populates full activity objects (not just IDs)
  stub?: boolean; // Flag for stub/placeholder facilities
  stubMessage?: string; // Message for stub facilities
}

// Frontend-specific Location type with populated biome and facility objects
export interface Location {
  locationId: string;
  name: string;
  description: string;
  biome: BiomeDefinition; // Backend populates full biome object (not just ID)
  facilities: Facility[]; // Backend populates full facility objects (not just IDs)
  navigationLinks: any[];
  isStartingLocation?: boolean;
  mapPosition?: {
    x: number;
    y: number;
  };
}

// Export shared activity types for type guards
export type { GatheringActivity, CombatActivity, ActivityUnion };

export interface ActiveActivity {
  activityId: string | null;
  facilityId: string | null;
  locationId: string | null;
  startTime: Date | null;
  endTime: Date | null;
}

export interface TravelState {
  isTravel: boolean;
  targetLocationId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  remainingTime?: number;
}

export interface ActivityRewards {
  experience: { [key: string]: any };
  rawExperience?: { [key: string]: number }; // Raw XP values before scaling
  attributes?: { [key: string]: any }; // Attribute XP from skill passthrough
  items: Array<{
    itemId: string;
    quantity: number;
    instanceId: string;
    qualities?: { [key: string]: number };
    traits?: { [key: string]: number };
  }>;
  gold: number;
}

export interface LocationState {
  currentLocation: Location | null;
  discoveredLocations: Location[];
  activeActivity: ActiveActivity | null;
  travelState: TravelState | null;
  selectedFacility: Facility | null;
  activityProgress: {
    active: boolean;
    completed: boolean;
    remainingTime: number;
  } | null;
}
