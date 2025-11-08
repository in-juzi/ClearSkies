export interface User {
  id: string;
  username: string;
  email: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Player {
  id: string;
  level: number;
  experience: number;
  stats: PlayerStats;
  skills: PlayerSkills;
  gold: number;
  location: Location;
  inventory: InventoryItem[];
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

export interface Skill {
  level: number;
  experience: number;
}

export interface PlayerSkills {
  woodcutting: Skill;
  mining: Skill;
  fishing: Skill;
  smithing: Skill;
  cooking: Skill;
}

export interface SkillWithProgress extends Skill {
  progress: number;
  experienceToNext?: number;
}

export interface SkillsResponse {
  success: boolean;
  data: {
    skills: {
      woodcutting: SkillWithProgress;
      mining: SkillWithProgress;
      fishing: SkillWithProgress;
      smithing: SkillWithProgress;
      cooking: SkillWithProgress;
    };
  };
}

export interface SkillExperienceResponse {
  success: boolean;
  message: string;
  data: {
    skill: string;
    level: number;
    experience: number;
    progress: number;
    leveledUp: boolean;
    oldLevel?: number;
    newLevel?: number;
  };
}

export type SkillName = 'woodcutting' | 'mining' | 'fishing' | 'smithing' | 'cooking';

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