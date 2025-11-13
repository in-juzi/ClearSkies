/**
 * Location system type definitions
 */
import { ExperienceRewards, QuantityRange, SkillName } from './common';
export type Biome = 'sea' | 'forest' | 'mountain' | 'plains' | 'desert' | 'swamp';
export type FacilityType = 'gathering' | 'resource-gathering' | 'trading' | 'crafting' | 'combat';
export type ActivityType = 'resource-gathering' | 'combat' | 'social';
/**
 * Location definition
 */
export interface Location {
    locationId: string;
    name: string;
    description: string;
    biome: Biome;
    facilities: string[];
    navigationLinks: NavigationLink[];
    isStartingLocation?: boolean;
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
    activities: string[];
}
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
        itemId: string;
        quantity: number;
    }>;
    attributes?: Record<string, number>;
}
/**
 * Resource gathering activity
 */
export interface GatheringActivity extends Activity {
    type: 'resource-gathering';
    duration: number;
    rewards: GatheringRewards;
}
/**
 * Rewards for gathering activities
 */
export interface GatheringRewards {
    experience: ExperienceRewards;
    dropTables?: string[];
    items?: any[];
}
/**
 * Combat activity
 */
export interface CombatActivity extends Activity {
    type: 'combat';
    duration?: number;
    rewards?: any;
    stub?: boolean;
    stubMessage?: string;
    combatConfig?: {
        monsterId: string;
    };
}
/**
 * Union type for all activity types
 */
export type ActivityUnion = GatheringActivity | CombatActivity;
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
    quantity?: QuantityRange | number;
    qualityBonus?: number | Record<string, number>;
    type?: string;
    comment?: string;
    dropNothing?: boolean;
    dropTableId?: string;
}
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
//# sourceMappingURL=locations.d.ts.map