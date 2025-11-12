/**
 * Trait Registry - Central registry for all item traits
 * Generated: Auto-generated
 */

import { TraitDefinition } from '../../../types/items';

import { BlessedTrait } from './definitions/BlessedTrait';
import { CursedTrait } from './definitions/CursedTrait';
import { FragrantTrait } from './definitions/FragrantTrait';
import { MasterworkTrait } from './definitions/MasterworkTrait';
import { PristineTrait } from './definitions/PristineTrait';
import { WeatheredTrait } from './definitions/WeatheredTrait';

/**
 * Central registry for all traits
 */
export class TraitRegistry {
  private static readonly traits = new Map<string, TraitDefinition>([
    [BlessedTrait.traitId, BlessedTrait],
    [CursedTrait.traitId, CursedTrait],
    [FragrantTrait.traitId, FragrantTrait],
    [MasterworkTrait.traitId, MasterworkTrait],
    [PristineTrait.traitId, PristineTrait],
    [WeatheredTrait.traitId, WeatheredTrait],
  ]);

  /**
   * Get a trait by ID
   */
  static get(traitId: string): TraitDefinition | undefined {
    return this.traits.get(traitId);
  }

  /**
   * Check if a trait exists
   */
  static has(traitId: string): boolean {
    return this.traits.has(traitId);
  }

  /**
   * Get all traits
   */
  static getAll(): TraitDefinition[] {
    return Array.from(this.traits.values());
  }

  /**
   * Get all trait IDs
   */
  static getAllIds(): string[] {
    return Array.from(this.traits.keys());
  }

  /**
   * Get the total number of traits
   */
  static get size(): number {
    return this.traits.size;
  }
}
