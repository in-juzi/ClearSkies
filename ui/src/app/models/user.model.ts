export interface User {
  id: string;
  username: string;
  email: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Player {
  id: string;
  characterName?: string;
  level: number;
  experience: number;
  stats: PlayerStats;
  attributes: PlayerAttributes;
  skills: PlayerSkills;
  gold: number;
  location: Location;
  currentLocation?: string;  // Location ID string
  inventory: InventoryItem[];
  activeCrafting?: {
    recipeId: string;
    startTime: Date;
    endTime: Date;
  };
  activeActivity?: {
    activityId: string;
    facilityId: string;
    locationId: string;
    startTime: Date;
    endTime: Date;
  };
  activeCombat?: {
    monsterId: string;
    turnCount: number;
    combatLog: any[];
  };
  travelState?: {
    isTravel: boolean;
    targetLocationId: string;
    startTime: Date;
    endTime: Date;
  };
  lastCombatActivityId?: string;
  unlockedRecipes?: string[];
  lastPlayed: Date;
}

export interface PlayerStats {
  health: {
    current: number;
    max: number;
  };
  mana: {
    current: number;
    max: number;
  };
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface Attribute {
  level: number;
  experience: number;
}

export interface PlayerAttributes {
  strength: Attribute;
  endurance: Attribute;
  magic: Attribute;
  perception: Attribute;
  dexterity: Attribute;
  will: Attribute;
  charisma: Attribute;
}

export interface Skill {
  level: number;
  experience: number;
  mainAttribute: string;
}

export interface PlayerSkills {
  woodcutting: Skill;
  mining: Skill;
  fishing: Skill;
  gathering: Skill;  // Renamed from herbalism
  smithing: Skill;
  cooking: Skill;
  alchemy: Skill;    // NEW: Potion/reagent crafting
  // Combat skills
  oneHanded: Skill;
  dualWield: Skill;
  twoHanded: Skill;
  ranged: Skill;
  casting: Skill;
  protection: Skill; // NEW: Tank/defensive skill (replaced gun)
}

export interface AttributeWithProgress extends Attribute {
  xpToNextLevel: number;
}

export interface AttributesResponse {
  [key: string]: AttributeWithProgress;
}

export interface SkillWithProgress extends Skill {
  xpToNextLevel: number;
}

export interface SkillsResponse {
  success: boolean;
  data: {
    skills: {
      woodcutting: SkillWithProgress;
      mining: SkillWithProgress;
      fishing: SkillWithProgress;
      gathering: SkillWithProgress;  // Renamed from herbalism
      smithing: SkillWithProgress;
      cooking: SkillWithProgress;
      alchemy: SkillWithProgress;    // NEW
      // Combat skills
      oneHanded: SkillWithProgress;
      dualWield: SkillWithProgress;
      twoHanded: SkillWithProgress;
      ranged: SkillWithProgress;
      casting: SkillWithProgress;
      protection: SkillWithProgress; // NEW: Tank/defensive skill (replaced gun)
    };
  };
}

export interface SkillExperienceResponse {
  success: boolean;
  message: string;
  data: {
    skill: {
      name: string;
      level: number;
      experience: number;
      leveledUp: boolean;
      oldLevel: number;
      newLevel: number;
      mainAttribute: string;
    };
    attribute: {
      name: string;
      level: number;
      experience: number;
      leveledUp: boolean;
      oldLevel: number;
      newLevel: number;
    };
  };
}

export type SkillName = 'woodcutting' | 'mining' | 'fishing' | 'gathering' | 'smithing' | 'cooking' | 'alchemy' | 'oneHanded' | 'dualWield' | 'twoHanded' | 'ranged' | 'casting' | 'protection';
export type AttributeName = 'strength' | 'endurance' | 'wisdom' | 'perception' | 'dexterity' | 'will' | 'charisma'; // 'magic' renamed to 'wisdom'

export interface Location {
  currentZone: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  equipped: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    player: Player | null;
    token: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}