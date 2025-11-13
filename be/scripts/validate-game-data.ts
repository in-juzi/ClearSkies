/**
 * Game Data Validation Script
 * Validates cross-references between game data registries
 *
 * Usage: npx ts-node scripts/validate-game-data.ts
 */

import { ItemRegistry } from '../data/items/ItemRegistry';
import { DropTableRegistry } from '../data/locations/DropTableRegistry';
import { ActivityRegistry } from '../data/locations/ActivityRegistry';
import { FacilityRegistry } from '../data/locations/FacilityRegistry';
import { LocationRegistry } from '../data/locations/LocationRegistry';
import { MonsterRegistry } from '../data/monsters/MonsterRegistry';
import { AbilityRegistry } from '../data/abilities/AbilityRegistry';
import { VendorRegistry } from '../data/vendors/VendorRegistry';
import { RecipeRegistry } from '../data/recipes/RecipeRegistry';
import { DropTable, GatheringActivity, CombatActivity, ActivityUnion } from '@shared/types';

interface ValidationError {
  severity: 'error' | 'warning';
  category: string;
  message: string;
  location: string;
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
  totalChecks: number;
}

const result: ValidationResult = {
  errors: [],
  warnings: [],
  totalChecks: 0
};

function addError(category: string, message: string, location: string) {
  result.errors.push({ severity: 'error', category, message, location });
}

function addWarning(category: string, message: string, location: string) {
  result.warnings.push({ severity: 'warning', category, message, location });
}

/**
 * Validate drop table item references
 */
function validateDropTables() {
  console.log('\n📦 Validating drop tables...');

  for (const dropTable of DropTableRegistry.getAll()) {
    for (const drop of dropTable.drops) {
      result.totalChecks++;

      // Check for nested drop table references
      if ('dropTableId' in drop && drop.dropTableId) {
        if (!DropTableRegistry.has(drop.dropTableId)) {
          addError(
            'drop-table',
            `Nested drop table not found: ${drop.dropTableId}`,
            `drop-tables/${dropTable.dropTableId}`
          );
        }
      }

      // Check item references
      if (drop.itemId) {
        if (!ItemRegistry.has(drop.itemId)) {
          addError(
            'drop-table',
            `Invalid itemId: ${drop.itemId}`,
            `drop-tables/${dropTable.dropTableId}`
          );
        }
      }

      // Warn if neither itemId nor dropTableId nor dropNothing flag
      if (!drop.itemId && !('dropTableId' in drop) && !('dropNothing' in drop)) {
        addWarning(
          'drop-table',
          `Drop entry has no itemId, dropTableId, or dropNothing flag`,
          `drop-tables/${dropTable.dropTableId}`
        );
      }
    }
  }
}

/**
 * Validate activity references (drop tables, monsters, equipment subtypes)
 */
function validateActivities() {
  console.log('\n⚡ Validating activities...');

  for (const activity of ActivityRegistry.getAll()) {
    // Validate gathering activities
    if (activity.type === 'resource-gathering') {
      const gatheringActivity = activity as GatheringActivity;

      // Check drop table references
      if (gatheringActivity.rewards?.dropTables) {
        for (const dropTableId of gatheringActivity.rewards.dropTables) {
          result.totalChecks++;
          if (!DropTableRegistry.has(dropTableId)) {
            addError(
              'activity',
              `Drop table not found: ${dropTableId}`,
              `activities/${activity.activityId}`
            );
          }
        }
      }
    }

    // Validate combat activities
    if (activity.type === 'combat') {
      const combatActivity = activity as CombatActivity;

      // Check monster reference
      if (combatActivity.combatConfig?.monsterId) {
        result.totalChecks++;
        if (!MonsterRegistry.has(combatActivity.combatConfig.monsterId)) {
          addError(
            'activity',
            `Monster not found: ${combatActivity.combatConfig.monsterId}`,
            `activities/${activity.activityId}`
          );
        }
      }
    }

    // Validate equipment subtype requirements
    if (activity.requirements?.equipped) {
      for (const equipReq of activity.requirements.equipped) {
        result.totalChecks++;

        // Check if any item has this subtype
        const hasMatchingItem = ItemRegistry.getAll().some(item =>
          'subtype' in item && item.subtype === equipReq.subtype
        );

        if (!hasMatchingItem) {
          addWarning(
            'activity',
            `No items found with subtype: ${equipReq.subtype}`,
            `activities/${activity.activityId}`
          );
        }
      }
    }

    // Validate inventory item requirements
    if (activity.requirements?.inventory) {
      for (const invReq of activity.requirements.inventory) {
        result.totalChecks++;
        if (!ItemRegistry.has(invReq.itemId)) {
          addError(
            'activity',
            `Required item not found: ${invReq.itemId}`,
            `activities/${activity.activityId}`
          );
        }
      }
    }
  }
}

/**
 * Validate facility references (activities, vendors)
 */
function validateFacilities() {
  console.log('\n🏛️  Validating facilities...');

  for (const facility of FacilityRegistry.getAll()) {
    // Check activity references
    for (const activityId of facility.activities) {
      result.totalChecks++;
      if (!ActivityRegistry.has(activityId)) {
        addError(
          'facility',
          `Activity not found: ${activityId}`,
          `facilities/${facility.facilityId}`
        );
      }
    }

    // Check vendor references
    if (facility.vendorIds) {
      for (const vendorId of facility.vendorIds) {
        result.totalChecks++;
        if (!VendorRegistry.has(vendorId)) {
          addError(
            'facility',
            `Vendor not found: ${vendorId}`,
            `facilities/${facility.facilityId}`
          );
        }
      }
    }
  }
}

/**
 * Validate location references (facilities)
 */
function validateLocations() {
  console.log('\n🗺️  Validating locations...');

  for (const location of LocationRegistry.getAll()) {
    // Check facility references
    for (const facilityId of location.facilities) {
      result.totalChecks++;
      if (!FacilityRegistry.has(facilityId)) {
        addError(
          'location',
          `Facility not found: ${facilityId}`,
          `locations/${location.locationId}`
        );
      }
    }

    // Check navigation link targets
    for (const navLink of location.navigationLinks) {
      result.totalChecks++;
      if (!LocationRegistry.has(navLink.targetLocationId)) {
        addError(
          'location',
          `Target location not found: ${navLink.targetLocationId}`,
          `locations/${location.locationId} -> ${navLink.targetLocationId}`
        );
      }

      // Check navigation requirements
      if (navLink.requirements?.items) {
        for (const itemReq of navLink.requirements.items) {
          result.totalChecks++;
          if (!ItemRegistry.has(itemReq.itemId)) {
            addError(
              'location',
              `Required item not found: ${itemReq.itemId}`,
              `locations/${location.locationId} navigation`
            );
          }
        }
      }
    }
  }
}

/**
 * Validate monster references (loot tables)
 * Note: Passive abilities are inline definitions, not registry references
 */
function validateMonsters() {
  console.log('\n👹 Validating monsters...');

  for (const monster of MonsterRegistry.getAll()) {
    // Note: passiveAbilities are inline definitions with their own structure,
    // not references to the AbilityRegistry. They have their own abilityId
    // for internal tracking but don't need to exist in AbilityRegistry.

    // Check loot table references
    if (monster.lootTables) {
      for (const lootTableId of monster.lootTables) {
        result.totalChecks++;
        if (!DropTableRegistry.has(lootTableId)) {
          addError(
            'monster',
            `Loot table not found: ${lootTableId}`,
            `monsters/${monster.monsterId}`
          );
        }
      }
    }
  }
}

/**
 * Validate ability references (weapon types)
 */
function validateAbilities() {
  console.log('\n⚔️  Validating abilities...');

  for (const ability of AbilityRegistry.getAll()) {
    // Check weapon type requirements
    if (ability.requirements?.weaponTypes && ability.requirements.weaponTypes.length > 0) {
      for (const weaponType of ability.requirements.weaponTypes) {
        result.totalChecks++;

        const hasMatchingWeapon = ItemRegistry.getAll().some(item =>
          'subtype' in item && item.subtype === weaponType
        );

        if (!hasMatchingWeapon) {
          addWarning(
            'ability',
            `No weapons found with subtype: ${weaponType}`,
            `abilities/${ability.abilityId}`
          );
        }
      }
    }
  }
}

/**
 * Validate vendor references (stock items)
 */
function validateVendors() {
  console.log('\n🛒 Validating vendors...');

  for (const vendor of VendorRegistry.getAll()) {
    // Check stock item references
    for (const stockItem of vendor.stock) {
      result.totalChecks++;
      if (!ItemRegistry.has(stockItem.itemId)) {
        addError(
          'vendor',
          `Stock item not found: ${stockItem.itemId}`,
          `vendors/${vendor.vendorId}`
        );
      }
    }
  }
}

/**
 * Validate recipe references (ingredients, outputs)
 */
function validateRecipes() {
  console.log('\n🍳 Validating recipes...');

  for (const recipe of RecipeRegistry.getAll()) {
    // Check ingredient references
    for (const ingredient of recipe.ingredients) {
      result.totalChecks++;
      if (ingredient.itemId) {
        // Specific item requirement
        if (!ItemRegistry.has(ingredient.itemId)) {
          addError(
            'recipe',
            `Ingredient item not found: ${ingredient.itemId}`,
            `recipes/${recipe.recipeId}`
          );
        }
      } else if (ingredient.subcategory) {
        // Subcategory requirement - validate that at least one item has this subcategory
        const itemsWithSubcategory = ItemRegistry.getAll().filter(
          item => item.subcategories && item.subcategories.includes(ingredient.subcategory!)
        );
        if (itemsWithSubcategory.length === 0) {
          addWarning(
            'recipe',
            `No items found with subcategory: ${ingredient.subcategory}`,
            `recipes/${recipe.recipeId}`
          );
        }
      }
    }

    // Check output references
    for (const output of recipe.outputs) {
      result.totalChecks++;
      if (!ItemRegistry.has(output.itemId)) {
        addError(
          'recipe',
          `Output item not found: ${output.itemId}`,
          `recipes/${recipe.recipeId}`
        );
      }
    }

    // Check unlock condition references
    if (recipe.unlockConditions?.requiredRecipes) {
      for (const requiredRecipeId of recipe.unlockConditions.requiredRecipes) {
        result.totalChecks++;
        if (!RecipeRegistry.has(requiredRecipeId)) {
          addError(
            'recipe',
            `Required recipe not found: ${requiredRecipeId}`,
            `recipes/${recipe.recipeId} unlockConditions`
          );
        }
      }
    }

    if (recipe.unlockConditions?.requiredItems) {
      for (const requiredItemId of recipe.unlockConditions.requiredItems) {
        result.totalChecks++;
        if (!ItemRegistry.has(requiredItemId)) {
          addError(
            'recipe',
            `Required item not found: ${requiredItemId}`,
            `recipes/${recipe.recipeId} unlockConditions`
          );
        }
      }
    }
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Validating game data cross-references...\n');
  console.log(`📊 Loaded registries:`);
  console.log(`   - Items: ${ItemRegistry.size}`);
  console.log(`   - Drop Tables: ${DropTableRegistry.size}`);
  console.log(`   - Activities: ${ActivityRegistry.size}`);
  console.log(`   - Facilities: ${FacilityRegistry.size}`);
  console.log(`   - Locations: ${LocationRegistry.size}`);
  console.log(`   - Monsters: ${MonsterRegistry.size}`);
  console.log(`   - Abilities: ${AbilityRegistry.size}`);
  console.log(`   - Vendors: ${VendorRegistry.size}`);
  console.log(`   - Recipes: ${RecipeRegistry.size}`);

  // Run all validations
  validateDropTables();
  validateActivities();
  validateFacilities();
  validateLocations();
  validateMonsters();
  validateAbilities();
  validateVendors();
  validateRecipes();

  // Report results
  console.log('\n' + '='.repeat(60));
  console.log('📋 VALIDATION RESULTS');
  console.log('='.repeat(60));
  console.log(`Total checks performed: ${result.totalChecks}`);
  console.log(`Errors found: ${result.errors.length}`);
  console.log(`Warnings found: ${result.warnings.length}`);

  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS:\n');
    for (const error of result.errors) {
      console.log(`  [${error.category}] ${error.location}`);
      console.log(`    → ${error.message}\n`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:\n');
    for (const warning of result.warnings) {
      console.log(`  [${warning.category}] ${warning.location}`);
      console.log(`    → ${warning.message}\n`);
    }
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('\n✅ All validations passed! Game data is consistent.\n');
    process.exit(0);
  } else if (result.errors.length > 0) {
    console.log('\n❌ Validation failed with errors. Please fix the issues above.\n');
    process.exit(1);
  } else {
    console.log('\n✅ Validation passed with warnings. Review warnings above.\n');
    process.exit(0);
  }
}

// Run validation
main();
