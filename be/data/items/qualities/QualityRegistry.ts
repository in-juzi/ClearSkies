/**
 * Quality Registry - Central registry for all item qualities
 * Generated: Auto-generated
 */

import { QualityDefinition } from '../../../types/items';

import { AgeQuality } from './definitions/AgeQuality';
import { JuicyQuality } from './definitions/JuicyQuality';
import { MoistureQuality } from './definitions/MoistureQuality';
import { PurityQuality } from './definitions/PurityQuality';
import { SheenQuality } from './definitions/SheenQuality';
import { SizeQuality } from './definitions/SizeQuality';
import { WoodGrainQuality } from './definitions/WoodGrainQuality';

/**
 * Central registry for all qualities
 */
export class QualityRegistry {
  private static readonly qualities = new Map<string, QualityDefinition>([
    [AgeQuality.qualityId, AgeQuality],
    [JuicyQuality.qualityId, JuicyQuality],
    [MoistureQuality.qualityId, MoistureQuality],
    [PurityQuality.qualityId, PurityQuality],
    [SheenQuality.qualityId, SheenQuality],
    [SizeQuality.qualityId, SizeQuality],
    [WoodGrainQuality.qualityId, WoodGrainQuality],
  ]);

  /**
   * Get a quality by ID
   */
  static get(qualityId: string): QualityDefinition | undefined {
    return this.qualities.get(qualityId);
  }

  /**
   * Check if a quality exists
   */
  static has(qualityId: string): boolean {
    return this.qualities.has(qualityId);
  }

  /**
   * Get all qualities
   */
  static getAll(): QualityDefinition[] {
    return Array.from(this.qualities.values());
  }

  /**
   * Get all quality IDs
   */
  static getAllIds(): string[] {
    return Array.from(this.qualities.keys());
  }

  /**
   * Get the total number of qualities
   */
  static get size(): number {
    return this.qualities.size;
  }
}
