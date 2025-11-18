/**
 * Quality Registry - Central registry for all item qualities
 * Generated: Auto-generated
 */

import { QualityDefinition } from '@shared/types';

import { AgeQuality } from './definitions/AgeQuality';
import { GrainQuality } from './definitions/GrainQuality';
import { JuicyQuality } from './definitions/JuicyQuality';
import { PotencyQuality } from './definitions/PotencyQuality';
import { PurityQuality } from './definitions/PurityQuality';
import { SheenQuality } from './definitions/SheenQuality';
import { SizeQuality } from './definitions/SizeQuality';

/**
 * Central registry for all qualities
 */
export class QualityRegistry {
  private static readonly qualities = new Map<string, QualityDefinition>([
    [AgeQuality.qualityId, AgeQuality],
    [GrainQuality.qualityId, GrainQuality],
    [JuicyQuality.qualityId, JuicyQuality],
    [PotencyQuality.qualityId, PotencyQuality],
    [PurityQuality.qualityId, PurityQuality],
    [SheenQuality.qualityId, SheenQuality],
    [SizeQuality.qualityId, SizeQuality],
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
