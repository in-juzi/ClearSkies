export interface Biome {
  biomeId: string;
  name: string;
  description: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export interface NavigationLink {
  targetLocationId: string;
  name: string;
  description: string;
  travelTime: number;
  requirements: {
    attributes?: { [key: string]: number };
    items?: string[];
  };
  encounters: string[];
  available?: boolean;
  requirementFailures?: string[];
}

export interface EquippedRequirement {
  subtype: string;
}

export interface InventoryRequirement {
  itemId: string;
  quantity?: number;
}

export interface Activity {
  activityId: string;
  name: string;
  description: string;
  type: 'resource-gathering' | 'resource-refinement' | 'combat' | 'npc-interaction' | 'trading';
  duration: number;
  requirements: {
    skills?: { [key: string]: number };
    attributes?: { [key: string]: number };
    items?: string[]; // Deprecated: use equipped or inventory instead
    equipped?: EquippedRequirement[];
    inventory?: InventoryRequirement[];
  };
  rewards: {
    experience: { [key: string]: number };
    items: Array<{
      itemId: string;
      quantity: { min: number; max: number };
      chance: number;
    }>;
    gold?: { min: number; max: number };
  };
  stub?: boolean;
  stubMessage?: string;
  available?: boolean;
  requirementFailures?: string[];
  monsterLevel?: number; // Level of the monster for combat activities
}

export interface Facility {
  facilityId: string;
  name: string;
  description: string;
  type: 'resource-gathering' | 'resource-refinement' | 'combat' | 'trading' | 'npc-interaction' | 'crafting';
  icon: string;
  activities: Activity[];
  vendorId?: string; // Deprecated: use vendorIds instead
  vendorIds?: string[]; // Array of vendor IDs for multiple vendors
  craftingSkills?: string[]; // Skills that can be used at this crafting facility
  stub?: boolean;
  stubMessage?: string;
}

export interface Location {
  locationId: string;
  name: string;
  description: string;
  biome: Biome;
  facilities: Facility[];
  navigationLinks: NavigationLink[];
  isStartingLocation: boolean;
}

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
