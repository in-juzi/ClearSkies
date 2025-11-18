/**
 * Location system type definitions
 */

import { ExperienceRewards, QuantityRange, SkillName } from './common';

// ===== ENUMS & LITERAL TYPES =====

export type Biome = 'sea' | 'forest' | 'mountain' | 'plains' | 'desert' | 'swamp';

export type FacilityType = 'gathering' | 'resource-gathering' | 'trading' | 'crafting' | 'combat' | 'bank';

export type ActivityType = 'resource-gathering' | 'combat' | 'social' | 'crafting';

// ===== LOCATION DEFINITIONS =====

/**
 * Location definition
 */
export interface Location {
  locationId: string;
  name: string;
  description: string;
  biome: Biome;
  facilities: string[]; // facilityIds
  navigationLinks: NavigationLink[];
  isStartingLocation?: boolean;
  mapPosition?: {
    x: number;
    y: number;
  };
}

/**
 * Navigation link to another location
 */
export interface NavigationLink {
  targetLocationId: string;
  name: string;
  description: string;
  travelTime: number;
  requirements: NavigationRequirements;
  encounters: Encounter[];
}

/**
 * Requirements to travel to a location
 */
export interface NavigationRequirements {
  skills?: Record<SkillName, number>;
  attributes?: Record<string, number>;
  completedQuests?: string[];
  items?: Array<{
    itemId: string;
    quantity: number;
  }>;
}

/**
 * Random encounter during travel
 */
export interface Encounter {
  encounterId: string;
  type: 'combat' | 'event';
  probability: number;
  data: any;
}

// ===== FACILITY DEFINITIONS =====

/**
 * Facility definition (buildings/areas within locations)
 */
export interface Facility {
  facilityId: string;
  name: string;
  description: string;
  type: FacilityType;
  icon: string;
  vendorIds?: string[];
  craftingSkills?: string[];
  activities: string[]; // activityIds
}

// ===== ACTIVITY DEFINITIONS =====

/**
 * Base activity interface
 */
export interface Activity {
  activityId: string;
  name: string;
  description: string;
  type: ActivityType;
  requirements: ActivityRequirements;
}

/**
 * Requirements to perform an activity
 */
export interface ActivityRequirements {
  skills?: Record<string, number>;
  equipped?: Array<{
    subtype: string;
  }>;
  inventory?: Array<{
    itemId?: string;
    subcategory?: string;
    quantity: number;
  }>;
  attributes?: Record<string, number>;
}

/**
 * Resource gathering activity
 */
export interface GatheringActivity extends Activity {
  type: 'resource-gathering';
  duration: number; // seconds
  rewards: GatheringRewards;
}

/**
 * Rewards for gathering activities
 */
export interface GatheringRewards {
  experience: ExperienceRewards;
  dropTables?: string[];
  items?: any[]; // Optional legacy field for direct item rewards
}

/**
 * Combat activity
 * Note: Combat XP is awarded dynamically based on equipped weapon's skillScalar (oneHanded, twoHanded, etc.)
 * Experience is NOT defined in the activity - it comes from the Monster definition
 */
export interface CombatActivity extends Activity {
  type: 'combat';
  duration?: number; // Optional duration for stub activities
  rewards?: {
    // Note: NO experience field - XP awarded based on Monster.experience and weapon skillScalar
    dropTables?: string[]; // Optional legacy field for activity-specific drops (Monster has lootTables)
  };
  stub?: boolean; // Flag for stub activities
  stubMessage?: string; // Message for stub activities
  combatConfig?: {
    monsterId: string;
  };
}

/**
 * Crafting activity
 * Process materials into finished goods
 */
export interface CraftingActivity extends Activity {
  type: 'crafting';
  duration: number; // seconds
  rewards: {
    experience: ExperienceRewards;
    dropTables?: string[];
  };
  consumes?: Array<{
    itemId?: string;
    subcategory?: string;
    quantity: number;
  }>;
}

/**
 * Union type for all activity types
 */
export type ActivityUnion = GatheringActivity | CombatActivity | CraftingActivity;

// ===== DROP TABLE DEFINITIONS =====

/**
 * Drop table definition
 */
export interface DropTable {
  dropTableId: string;
  name: string;
  description: string;
  drops: DropTableEntry[];
}

/**
 * Individual drop entry
 */
export interface DropTableEntry {
  itemId?: string;
  weight: number;
  quantity?: QuantityRange | number; // Can be a number or a range object
  qualityBonus?: number | Record<string, number>; // Can be a number or a map of quality bonuses
  type?: string; // Optional type field for special drop types
  comment?: string; // Optional comment for documentation
  dropNothing?: boolean; // Optional flag for no-drop entries
  dropTableId?: string; // For nested drop tables
}

// ===== BIOME DEFINITIONS =====

/**
 * Biome definition
 */
export interface BiomeDefinition {
  biomeId: Biome;
  name: string;
  description: string;
  ambientDescription?: string;
  characteristics?: string[];
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

// ===== PLAYER LOCATION STATE =====

/**
 * Player's current location state
 */
export interface PlayerLocationState {
  currentLocation: string;
  discoveredLocations: string[];
  activeActivity: ActiveActivity | null;
  travelState: TravelState | null;
}

/**
 * Active activity state
 */
export interface ActiveActivity {
  activityId: string;
  facilityId: string;
  startTime: number;
  completionTime: number;
}

/**
 * Travel state (while traveling between locations)
 */
export interface TravelState {
  fromLocation: string;
  toLocation: string;
  startTime: number;
  arrivalTime: number;
}
