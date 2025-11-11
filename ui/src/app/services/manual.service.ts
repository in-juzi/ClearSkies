import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ItemIcon } from '../models/inventory.model';

/**
 * Interface definitions for manual API responses
 */
export interface ManualSkill {
  skillId: string;
  name: string;
  description: string;
  mainAttribute: string;
  icon: string;
  xpPerLevel: number;
}

export interface ManualAttribute {
  attributeId: string;
  name: string;
  description: string;
  icon: string;
  linkedSkills: string[];
  xpPerLevel: number;
}

export interface ManualItem {
  itemId: string;
  name: string;
  description: string;
  tier: string;
  rarity: string;
  icon: ItemIcon;
  category: string;
  subcategories: string[];
  stackable: boolean;
  slot?: string;
  subtype?: string;
  stats?: any;
}

export interface QualityLevel {
  level: number;
  name: string;
  description: string;
  vendorPriceModifier: number;
}

export interface ManualQuality {
  qualityId: string;
  name: string;
  description: string;
  levels: QualityLevel[];
  applicableTo: string[];
}

export interface TraitLevel {
  level: number;
  name: string;
  description: string;
  vendorPriceModifier: number;
}

export interface ManualTrait {
  traitId: string;
  name: string;
  description: string;
  rarity: string;
  levels: TraitLevel[];
  applicableTo: string[];
}

export interface ManualLocation {
  locationId: string;
  name: string;
  description: string;
  biome: string;
  facilities: string[];
  navigationLinks: Array<{ targetLocationId: string; description: string }>;
}

export interface ManualBiome {
  biomeId: string;
  name: string;
  description: string;
  ambientDescription: string;
  commonResources: string[];
}

/**
 * API Response interfaces
 */
export interface SkillsResponse {
  success: boolean;
  skills: ManualSkill[];
  xpSystem: {
    xpPerLevel: number;
    attributeLinking: string;
    levelFormula: string;
  };
}

export interface AttributesResponse {
  success: boolean;
  attributes: ManualAttribute[];
  xpSystem: {
    xpPerLevel: number;
    skillLinking: string;
    levelFormula: string;
  };
}

export interface ItemsResponse {
  success: boolean;
  categories: {
    resources: ManualItem[];
    equipment: ManualItem[];
    consumables: ManualItem[];
  };
  totalItems: number;
}

export interface QualitiesResponse {
  success: boolean;
  qualities: ManualQuality[];
  system: {
    levelRange: string;
    description: string;
    stacking: string;
  };
}

export interface TraitsResponse {
  success: boolean;
  traits: ManualTrait[];
  system: {
    levelRange: string;
    rarities: Record<string, string>;
    description: string;
    stacking: string;
  };
}

export interface LocationsResponse {
  success: boolean;
  locations: ManualLocation[];
  totalLocations: number;
}

export interface BiomesResponse {
  success: boolean;
  biomes: ManualBiome[];
  totalBiomes: number;
}

/**
 * Manual Service
 * Provides public (unauthenticated) access to game reference data
 */
@Injectable({
  providedIn: 'root'
})
export class ManualService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/manual`;

  /**
   * Get all skills with descriptions and attribute links
   */
  getSkills(): Observable<SkillsResponse> {
    return this.http.get<SkillsResponse>(`${this.apiUrl}/skills`);
  }

  /**
   * Get all attributes with descriptions
   */
  getAttributes(): Observable<AttributesResponse> {
    return this.http.get<AttributesResponse>(`${this.apiUrl}/attributes`);
  }

  /**
   * Get item categories overview
   */
  getItems(): Observable<ItemsResponse> {
    return this.http.get<ItemsResponse>(`${this.apiUrl}/items`);
  }

  /**
   * Get quality definitions
   */
  getQualities(): Observable<QualitiesResponse> {
    return this.http.get<QualitiesResponse>(`${this.apiUrl}/qualities`);
  }

  /**
   * Get trait definitions
   */
  getTraits(): Observable<TraitsResponse> {
    return this.http.get<TraitsResponse>(`${this.apiUrl}/traits`);
  }

  /**
   * Get locations overview
   */
  getLocations(): Observable<LocationsResponse> {
    return this.http.get<LocationsResponse>(`${this.apiUrl}/locations`);
  }

  /**
   * Get biome definitions
   */
  getBiomes(): Observable<BiomesResponse> {
    return this.http.get<BiomesResponse>(`${this.apiUrl}/biomes`);
  }
}
