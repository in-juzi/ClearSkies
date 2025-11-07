export interface User {
  id: string;
  username: string;
  email: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Player {
  id: string;
  characterName: string;
  level: number;
  experience: number;
  stats: PlayerStats;
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
  characterName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}