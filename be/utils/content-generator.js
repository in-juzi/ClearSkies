/**
 * Content Generator Agent
 *
 * Interactive CLI tool for generating locations, facilities, and activities
 * with built-in validation and integrity checks.
 *
 * Usage: node utils/content-generator.js
 */

const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`)
};

/**
 * Validation utilities
 */
class ContentValidator {
  constructor() {
    this.itemDefinitions = new Map();
    this.qualityDefinitions = new Map();
    this.traitDefinitions = new Map();
    this.skillDefinitions = new Set(['woodcutting', 'mining', 'fishing', 'smithing', 'cooking']);
    this.biomes = new Set();
    this.locations = new Map();
    this.facilities = new Map();
    this.dropTables = new Map();
  }

  async loadData() {
    log.info('Loading game data for validation...');

    // Load items
    const itemsPath = path.join(__dirname, '../data/items/definitions');
    const itemFiles = await fs.readdir(itemsPath);
    for (const file of itemFiles) {
      if (file.endsWith('.json')) {
        const data = JSON.parse(await fs.readFile(path.join(itemsPath, file), 'utf8'));
        Object.values(data).forEach(item => {
          this.itemDefinitions.set(item.itemId, item);
        });
      }
    }
    log.success(`Loaded ${this.itemDefinitions.size} item definitions`);

    // Load qualities
    const qualitiesPath = path.join(__dirname, '../data/items/qualities/qualities.json');
    const qualities = JSON.parse(await fs.readFile(qualitiesPath, 'utf8'));
    Object.values(qualities).forEach(quality => {
      this.qualityDefinitions.set(quality.qualityId, quality);
    });
    log.success(`Loaded ${this.qualityDefinitions.size} quality definitions`);

    // Load traits
    const traitsPath = path.join(__dirname, '../data/items/traits/traits.json');
    const traits = JSON.parse(await fs.readFile(traitsPath, 'utf8'));
    Object.values(traits).forEach(trait => {
      this.traitDefinitions.set(trait.traitId, trait);
    });
    log.success(`Loaded ${this.traitDefinitions.size} trait definitions`);

    // Load biomes
    const biomesPath = path.join(__dirname, '../data/locations/biomes');
    const biomeFiles = await fs.readdir(biomesPath);
    for (const file of biomeFiles) {
      if (file.endsWith('.json')) {
        const data = JSON.parse(await fs.readFile(path.join(biomesPath, file), 'utf8'));
        this.biomes.add(data.biomeId);
      }
    }
    log.success(`Loaded ${this.biomes.size} biome definitions`);

    // Load locations
    const locationsPath = path.join(__dirname, '../data/locations/definitions');
    const locationFiles = await fs.readdir(locationsPath);
    for (const file of locationFiles) {
      if (file.endsWith('.json')) {
        const data = JSON.parse(await fs.readFile(path.join(locationsPath, file), 'utf8'));
        this.locations.set(data.locationId, data);
      }
    }
    log.success(`Loaded ${this.locations.size} location definitions`);

    // Load facilities
    const facilitiesPath = path.join(__dirname, '../data/locations/facilities');
    const facilityFiles = await fs.readdir(facilitiesPath);
    for (const file of facilityFiles) {
      if (file.endsWith('.json')) {
        const data = JSON.parse(await fs.readFile(path.join(facilitiesPath, file), 'utf8'));
        this.facilities.set(data.facilityId, data);
      }
    }
    log.success(`Loaded ${this.facilities.size} facility definitions`);

    // Load drop tables
    const dropTablesPath = path.join(__dirname, '../data/locations/drop-tables');
    const dropTableFiles = await fs.readdir(dropTablesPath);
    for (const file of dropTableFiles) {
      if (file.endsWith('.json')) {
        const data = JSON.parse(await fs.readFile(path.join(dropTablesPath, file), 'utf8'));
        this.dropTables.set(data.dropTableId, data);
      }
    }
    log.success(`Loaded ${this.dropTables.size} drop table definitions`);
  }

  validateDropTable(dropTable) {
    const errors = [];

    // Check for missing required fields
    if (!dropTable.dropTableId) errors.push('Missing dropTableId');
    if (!dropTable.name) errors.push('Missing name');
    if (!dropTable.drops || !Array.isArray(dropTable.drops)) {
      errors.push('Missing or invalid drops array');
      return errors;
    }

    // Validate each drop
    dropTable.drops.forEach((drop, index) => {
      // Skip validation for dropNothing entries
      if (drop.dropNothing) return;

      // Check if itemId exists
      if (!drop.itemId) {
        errors.push(`Drop ${index}: Missing itemId`);
      } else if (!this.itemDefinitions.has(drop.itemId)) {
        errors.push(`Drop ${index}: Item '${drop.itemId}' does not exist`);
      }

      // Check weight
      if (drop.weight === undefined || drop.weight <= 0) {
        errors.push(`Drop ${index}: Invalid or missing weight`);
      }

      // Check quantity
      if (drop.quantity) {
        if (drop.quantity.min === undefined || drop.quantity.max === undefined) {
          errors.push(`Drop ${index}: Quantity must have min and max`);
        } else if (drop.quantity.min > drop.quantity.max) {
          errors.push(`Drop ${index}: quantity.min cannot exceed quantity.max`);
        }
      }
    });

    return errors;
  }

  validateActivity(activity) {
    const errors = [];

    // Check required fields
    if (!activity.activityId) errors.push('Missing activityId');
    if (!activity.name) errors.push('Missing name');
    if (!activity.type) errors.push('Missing type');
    if (!activity.duration || activity.duration <= 0) {
      errors.push('Invalid or missing duration');
    }

    // Validate skill requirements
    if (activity.requirements?.skills) {
      Object.keys(activity.requirements.skills).forEach(skill => {
        if (!this.skillDefinitions.has(skill)) {
          errors.push(`Invalid skill requirement: '${skill}'`);
        }
      });
    }

    // Validate equipped requirements
    if (activity.requirements?.equipped) {
      activity.requirements.equipped.forEach((req, index) => {
        if (!req.subtype) {
          errors.push(`Equipped requirement ${index}: Missing subtype`);
        }
      });
    }

    // Validate inventory requirements
    if (activity.requirements?.inventory) {
      activity.requirements.inventory.forEach((req, index) => {
        if (!req.itemId) {
          errors.push(`Inventory requirement ${index}: Missing itemId`);
        } else if (!this.itemDefinitions.has(req.itemId)) {
          errors.push(`Inventory requirement ${index}: Item '${req.itemId}' does not exist`);
        }
        if (!req.quantity || req.quantity <= 0) {
          errors.push(`Inventory requirement ${index}: Invalid or missing quantity`);
        }
      });
    }

    // Validate drop table references
    if (activity.rewards?.dropTables) {
      activity.rewards.dropTables.forEach(dropTableId => {
        if (!this.dropTables.has(dropTableId)) {
          errors.push(`Drop table '${dropTableId}' does not exist`);
        } else {
          // Validate the drop table itself
          const dropTable = this.dropTables.get(dropTableId);
          const dropTableErrors = this.validateDropTable(dropTable);
          if (dropTableErrors.length > 0) {
            errors.push(`Drop table '${dropTableId}' has errors: ${dropTableErrors.join(', ')}`);
          }
        }
      });
    }

    return errors;
  }

  validateFacility(facility) {
    const errors = [];

    // Check required fields
    if (!facility.facilityId) errors.push('Missing facilityId');
    if (!facility.name) errors.push('Missing name');
    if (!facility.type) errors.push('Missing type');

    // Note: We can't validate activity references here since activities
    // might be created after the facility. This will be validated during
    // final review.

    return errors;
  }

  validateLocation(location) {
    const errors = [];

    // Check required fields
    if (!location.locationId) errors.push('Missing locationId');
    if (!location.name) errors.push('Missing name');
    if (!location.biome) {
      errors.push('Missing biome');
    } else if (!this.biomes.has(location.biome)) {
      errors.push(`Biome '${location.biome}' does not exist`);
    }

    // Validate facility references
    if (location.facilities && Array.isArray(location.facilities)) {
      location.facilities.forEach(facilityId => {
        if (!this.facilities.has(facilityId)) {
          errors.push(`Facility '${facilityId}' does not exist`);
        }
      });
    }

    // Validate navigation links
    if (location.navigationLinks && Array.isArray(location.navigationLinks)) {
      location.navigationLinks.forEach((link, index) => {
        if (!link.targetLocationId) {
          errors.push(`Navigation link ${index}: Missing targetLocationId`);
        }
        if (!link.travelTime || link.travelTime <= 0) {
          errors.push(`Navigation link ${index}: Invalid or missing travelTime`);
        }
      });
    }

    return errors;
  }
}

/**
 * Content Generation Agent
 */
class ContentGenerator {
  constructor(validator) {
    this.validator = validator;
  }

  async generateDropTable() {
    log.header('=== CREATE DROP TABLE ===');

    const dropTableId = await question('Drop Table ID (e.g., fishing-mackerel): ');
    const name = await question('Name: ');
    const description = await question('Description: ');

    const dropTable = {
      dropTableId,
      name,
      description,
      drops: []
    };

    // Show available items
    log.info('\nAvailable items:');
    const items = Array.from(this.validator.itemDefinitions.values());
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.itemId}) - ${item.category}`);
    });

    let addingDrops = true;
    while (addingDrops) {
      console.log('\n--- Add Drop Entry ---');

      const dropNothing = await question('Is this a "drop nothing" entry? (y/n): ');

      if (dropNothing.toLowerCase() === 'y') {
        const weight = parseInt(await question('Weight: '));
        const comment = await question('Comment (optional): ');

        dropTable.drops.push({
          dropNothing: true,
          weight,
          ...(comment && { comment })
        });
      } else {
        const itemId = await question('Item ID: ');

        if (!this.validator.itemDefinitions.has(itemId)) {
          log.error(`Item '${itemId}' does not exist!`);
          continue;
        }

        const weight = parseInt(await question('Weight: '));
        const minQty = parseInt(await question('Quantity min: '));
        const maxQty = parseInt(await question('Quantity max: '));
        const qualityBonus = parseFloat(await question('Quality bonus (0-1, optional): ') || '0');
        const comment = await question('Comment (optional): ');

        dropTable.drops.push({
          itemId,
          weight,
          quantity: { min: minQty, max: maxQty },
          ...(qualityBonus > 0 && { qualityBonus }),
          ...(comment && { comment })
        });
      }

      const more = await question('\nAdd another drop? (y/n): ');
      addingDrops = more.toLowerCase() === 'y';
    }

    // Validate
    const errors = this.validator.validateDropTable(dropTable);
    if (errors.length > 0) {
      log.error('Validation errors:');
      errors.forEach(err => console.log(`  - ${err}`));
      const proceed = await question('\nSave anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        log.warning('Drop table creation cancelled');
        return null;
      }
    } else {
      log.success('Validation passed!');
    }

    // Preview
    console.log('\n--- Drop Table Preview ---');
    console.log(JSON.stringify(dropTable, null, 2));

    const confirm = await question('\nSave this drop table? (y/n): ');
    if (confirm.toLowerCase() === 'y') {
      const filePath = path.join(__dirname, '../data/locations/drop-tables', `${dropTableId}.json`);
      await fs.writeFile(filePath, JSON.stringify(dropTable, null, 2));
      log.success(`Drop table saved to ${filePath}`);

      // Add to validator cache
      this.validator.dropTables.set(dropTableId, dropTable);
      return dropTable;
    }

    return null;
  }

  async generateActivity() {
    log.header('=== CREATE ACTIVITY ===');

    const activityId = await question('Activity ID (e.g., activity-fish-mackerel): ');
    const name = await question('Name: ');
    const description = await question('Description: ');
    const type = await question('Type (resource-gathering/crafting/training): ');
    const duration = parseInt(await question('Duration (seconds): '));

    const activity = {
      activityId,
      name,
      description,
      type,
      duration,
      requirements: {},
      rewards: { experience: {} }
    };

    // Skill requirements
    console.log('\n--- Skill Requirements ---');
    log.info(`Available skills: ${Array.from(this.validator.skillDefinitions).join(', ')}`);
    const hasSkillReqs = await question('Add skill requirements? (y/n): ');

    if (hasSkillReqs.toLowerCase() === 'y') {
      activity.requirements.skills = {};
      let addingSkills = true;

      while (addingSkills) {
        const skill = await question('Skill name: ');
        if (this.validator.skillDefinitions.has(skill)) {
          const level = parseInt(await question('Required level: '));
          activity.requirements.skills[skill] = level;
        } else {
          log.error(`Invalid skill: ${skill}`);
        }

        const more = await question('Add another skill? (y/n): ');
        addingSkills = more.toLowerCase() === 'y';
      }
    }

    // Equipment requirements
    console.log('\n--- Equipment Requirements ---');
    const hasEquipReqs = await question('Add equipment requirements? (y/n): ');

    if (hasEquipReqs.toLowerCase() === 'y') {
      activity.requirements.equipped = [];
      let addingEquip = true;

      while (addingEquip) {
        const subtype = await question('Required subtype (e.g., woodcutting-axe): ');
        activity.requirements.equipped.push({ subtype });

        const more = await question('Add another equipment requirement? (y/n): ');
        addingEquip = more.toLowerCase() === 'y';
      }
    }

    // Inventory requirements
    console.log('\n--- Inventory Requirements ---');
    const hasInvReqs = await question('Add inventory requirements? (y/n): ');

    if (hasInvReqs.toLowerCase() === 'y') {
      activity.requirements.inventory = [];
      let addingInv = true;

      while (addingInv) {
        const itemId = await question('Item ID: ');
        if (!this.validator.itemDefinitions.has(itemId)) {
          log.error(`Item '${itemId}' does not exist!`);
          const skip = await question('Skip this item? (y/n): ');
          if (skip.toLowerCase() === 'y') continue;
        }

        const quantity = parseInt(await question('Quantity: '));
        activity.requirements.inventory.push({ itemId, quantity });

        const more = await question('Add another inventory requirement? (y/n): ');
        addingInv = more.toLowerCase() === 'y';
      }
    }

    // Experience rewards
    console.log('\n--- Experience Rewards ---');
    const hasExpRewards = await question('Add experience rewards? (y/n): ');

    if (hasExpRewards.toLowerCase() === 'y') {
      let addingExp = true;

      while (addingExp) {
        const skill = await question('Skill name: ');
        if (this.validator.skillDefinitions.has(skill)) {
          const xp = parseInt(await question('XP amount: '));
          activity.rewards.experience[skill] = xp;
        } else {
          log.error(`Invalid skill: ${skill}`);
        }

        const more = await question('Add another skill XP? (y/n): ');
        addingExp = more.toLowerCase() === 'y';
      }
    }

    // Drop table rewards
    console.log('\n--- Drop Table Rewards ---');
    log.info('Available drop tables:');
    Array.from(this.validator.dropTables.keys()).forEach(id => console.log(`  - ${id}`));

    const hasDropTables = await question('\nAdd drop table rewards? (y/n): ');

    if (hasDropTables.toLowerCase() === 'y') {
      activity.rewards.dropTables = [];
      let addingTables = true;

      while (addingTables) {
        const dropTableId = await question('Drop table ID: ');

        if (!this.validator.dropTables.has(dropTableId)) {
          log.warning(`Drop table '${dropTableId}' not found in cache`);
          const create = await question('Create this drop table now? (y/n): ');

          if (create.toLowerCase() === 'y') {
            await this.generateDropTable();
            // Ask again for the ID after creation
            continue;
          }
        }

        activity.rewards.dropTables.push(dropTableId);

        const more = await question('Add another drop table? (y/n): ');
        addingTables = more.toLowerCase() === 'y';
      }
    }

    // Validate
    const errors = this.validator.validateActivity(activity);
    if (errors.length > 0) {
      log.error('Validation errors:');
      errors.forEach(err => console.log(`  - ${err}`));
      const proceed = await question('\nSave anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        log.warning('Activity creation cancelled');
        return null;
      }
    } else {
      log.success('Validation passed!');
    }

    // Preview
    console.log('\n--- Activity Preview ---');
    console.log(JSON.stringify(activity, null, 2));

    const confirm = await question('\nSave this activity? (y/n): ');
    if (confirm.toLowerCase() === 'y') {
      const filePath = path.join(__dirname, '../data/locations/activities', `${activityId}.json`);
      await fs.writeFile(filePath, JSON.stringify(activity, null, 2));
      log.success(`Activity saved to ${filePath}`);
      return activity;
    }

    return null;
  }

  async generateFacility() {
    log.header('=== CREATE FACILITY ===');

    const facilityId = await question('Facility ID (e.g., kennik-smithy): ');
    const name = await question('Name: ');
    const description = await question('Description: ');
    const type = await question('Type (resource-gathering/crafting/training/market): ');
    const icon = await question('Icon (optional): ');

    const facility = {
      facilityId,
      name,
      description,
      type,
      ...(icon && { icon }),
      activities: []
    };

    // Activities
    console.log('\n--- Activities ---');
    const hasActivities = await question('Add activities to this facility? (y/n): ');

    if (hasActivities.toLowerCase() === 'y') {
      let addingActivities = true;

      while (addingActivities) {
        const activityId = await question('Activity ID: ');
        facility.activities.push(activityId);

        const more = await question('Add another activity? (y/n): ');
        addingActivities = more.toLowerCase() === 'y';
      }
    }

    // Validate
    const errors = this.validator.validateFacility(facility);
    if (errors.length > 0) {
      log.error('Validation errors:');
      errors.forEach(err => console.log(`  - ${err}`));
      const proceed = await question('\nSave anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        log.warning('Facility creation cancelled');
        return null;
      }
    } else {
      log.success('Validation passed!');
    }

    // Preview
    console.log('\n--- Facility Preview ---');
    console.log(JSON.stringify(facility, null, 2));

    const confirm = await question('\nSave this facility? (y/n): ');
    if (confirm.toLowerCase() === 'y') {
      const filePath = path.join(__dirname, '../data/locations/facilities', `${facilityId}.json`);
      await fs.writeFile(filePath, JSON.stringify(facility, null, 2));
      log.success(`Facility saved to ${filePath}`);

      // Add to validator cache
      this.validator.facilities.set(facilityId, facility);
      return facility;
    }

    return null;
  }

  async generateLocation() {
    log.header('=== CREATE LOCATION ===');

    const locationId = await question('Location ID (e.g., iron-mine): ');
    const name = await question('Name: ');
    const description = await question('Description: ');

    log.info(`\nAvailable biomes: ${Array.from(this.validator.biomes).join(', ')}`);
    const biome = await question('Biome: ');

    const location = {
      locationId,
      name,
      description,
      biome,
      facilities: [],
      navigationLinks: [],
      isStartingLocation: false
    };

    // Facilities
    console.log('\n--- Facilities ---');
    log.info('Available facilities:');
    Array.from(this.validator.facilities.keys()).forEach(id => console.log(`  - ${id}`));

    const hasFacilities = await question('\nAdd facilities? (y/n): ');

    if (hasFacilities.toLowerCase() === 'y') {
      let addingFacilities = true;

      while (addingFacilities) {
        const facilityId = await question('Facility ID: ');

        if (!this.validator.facilities.has(facilityId)) {
          log.warning(`Facility '${facilityId}' not found`);
          const create = await question('Create this facility now? (y/n): ');

          if (create.toLowerCase() === 'y') {
            await this.generateFacility();
            continue;
          }
        }

        location.facilities.push(facilityId);

        const more = await question('Add another facility? (y/n): ');
        addingFacilities = more.toLowerCase() === 'y';
      }
    }

    // Navigation links
    console.log('\n--- Navigation Links ---');
    const hasNavLinks = await question('Add navigation links? (y/n): ');

    if (hasNavLinks.toLowerCase() === 'y') {
      let addingLinks = true;

      while (addingLinks) {
        const targetLocationId = await question('Target location ID: ');
        const linkName = await question('Link name (e.g., "Forest Path"): ');
        const linkDesc = await question('Link description: ');
        const travelTime = parseInt(await question('Travel time (seconds): '));

        location.navigationLinks.push({
          targetLocationId,
          name: linkName,
          description: linkDesc,
          travelTime,
          requirements: {},
          encounters: []
        });

        const more = await question('Add another navigation link? (y/n): ');
        addingLinks = more.toLowerCase() === 'y';
      }
    }

    // Validate
    const errors = this.validator.validateLocation(location);
    if (errors.length > 0) {
      log.error('Validation errors:');
      errors.forEach(err => console.log(`  - ${err}`));
      const proceed = await question('\nSave anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        log.warning('Location creation cancelled');
        return null;
      }
    } else {
      log.success('Validation passed!');
    }

    // Preview
    console.log('\n--- Location Preview ---');
    console.log(JSON.stringify(location, null, 2));

    const confirm = await question('\nSave this location? (y/n): ');
    if (confirm.toLowerCase() === 'y') {
      const filePath = path.join(__dirname, '../data/locations/definitions', `${locationId}.json`);
      await fs.writeFile(filePath, JSON.stringify(location, null, 2));
      log.success(`Location saved to ${filePath}`);
      return location;
    }

    return null;
  }

  async showMenu() {
    console.log('\n' + '='.repeat(50));
    console.log('    CONTENT GENERATOR AGENT');
    console.log('='.repeat(50));
    console.log('\nWhat would you like to create?\n');
    console.log('  1. Drop Table');
    console.log('  2. Activity');
    console.log('  3. Facility');
    console.log('  4. Location');
    console.log('  5. Exit\n');

    const choice = await question('Enter your choice (1-5): ');

    switch (choice) {
      case '1':
        await this.generateDropTable();
        break;
      case '2':
        await this.generateActivity();
        break;
      case '3':
        await this.generateFacility();
        break;
      case '4':
        await this.generateLocation();
        break;
      case '5':
        log.info('Goodbye!');
        return false;
      default:
        log.warning('Invalid choice');
    }

    return true;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    log.header('Content Generator Agent Starting...');

    // Initialize validator and load data
    const validator = new ContentValidator();
    await validator.loadData();

    // Create generator
    const generator = new ContentGenerator(validator);

    // Show menu loop
    let running = true;
    while (running) {
      running = await generator.showMenu();
    }

  } catch (error) {
    log.error(`Error: ${error.message}`);
    console.error(error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { ContentValidator, ContentGenerator };
