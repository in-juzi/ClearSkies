/**
 * Utility script to add icon field to all item definitions
 * Maps items to appropriate SVG icons based on category/subtype
 */

const fs = require('fs');
const path = require('path');

// Icon mappings based on item type
const ICON_MAPPINGS = {
  // Equipment
  sword: { path: 'item-categories/item_cat_sword.svg' },
  shield: { path: 'item-categories/item_cat_body.svg' },
  helm: { path: 'item-categories/item_cat_body.svg' },
  coif: { path: 'item-categories/item_cat_body.svg' },
  tunic: { path: 'item-categories/item_cat_body.svg' },
  'woodcutting-axe': { path: 'item-categories/item_cat_axe.svg' },
  'mining-pickaxe': { path: 'item-categories/item_cat_tool.svg' },
  'fishing-rod': { path: 'item-categories/item_cat_tool.svg' },

  // Resources - wood
  log: { path: 'item-categories/item_cat_material.svg' },

  // Resources - ore
  ore: { path: 'item-categories/item_cat_ore.svg' },

  // Resources - fish
  fish: { path: 'item-categories/item_cat_meat.svg' },

  // Resources - herbs
  herb: { path: 'item-categories/item_cat_mushroom.svg' },

  // Consumables
  food: { path: 'item-categories/item_cat_food.svg' },
  potion: { path: 'item-categories/item_cat_potion.svg' }
};

// Material mappings (extracted from item ID or properties.material)
function getMaterial(itemId, properties) {
  // First try to get from properties
  if (properties && properties.material) {
    return properties.material;
  }

  // Otherwise extract from itemId (e.g., 'copper_sword' -> 'copper')
  const parts = itemId.split('_');
  return parts[0] || 'generic';
}

// Get icon path based on item data
function getIconPath(item) {
  const { subtype, itemId, category, subcategories = [] } = item;

  // Try subtype first (most specific for equipment)
  if (subtype && ICON_MAPPINGS[subtype]) {
    return ICON_MAPPINGS[subtype].path;
  }

  // Try subcategories
  for (const subcategory of subcategories) {
    if (ICON_MAPPINGS[subcategory]) {
      return ICON_MAPPINGS[subcategory].path;
    }
  }

  // Fallback based on item ID patterns
  if (itemId.includes('_log')) return ICON_MAPPINGS.log.path;
  if (itemId.includes('_ore')) return ICON_MAPPINGS.ore.path;
  if (itemId.includes('fish') || itemId.includes('salmon') || itemId.includes('trout') || itemId.includes('pike') || itemId.includes('shrimp') || itemId.includes('cod')) {
    return ICON_MAPPINGS.fish.path;
  }
  if (subcategories.includes('herb') || category === 'herb') return ICON_MAPPINGS.herb.path;
  if (itemId.includes('potion')) return ICON_MAPPINGS.potion.path;
  if (itemId.includes('bread') || itemId.includes('cooked_')) return ICON_MAPPINGS.food.path;

  // Generic fallback
  return 'item-categories/item_cat_material.svg';
}

// Process a definition file
function processDefinitionFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');
  const items = JSON.parse(content);

  let modifiedCount = 0;

  for (const [itemId, item] of Object.entries(items)) {
    // Skip if already has icon
    if (item.icon) {
      console.log(`  ✓ ${itemId} - already has icon`);
      continue;
    }

    // Determine icon path
    const iconPath = getIconPath(item);
    const material = getMaterial(itemId, item.properties);

    // Add icon field
    item.icon = {
      path: iconPath,
      material: material
    };

    modifiedCount++;
    console.log(`  + ${itemId} - added icon (${material}, ${iconPath})`);
  }

  // Write back to file with proper formatting
  const output = JSON.stringify(items, null, 2);
  fs.writeFileSync(filePath, output + '\n', 'utf8');

  console.log(`✓ Modified ${modifiedCount} items in ${path.basename(filePath)}`);
}

// Main execution
function main() {
  const definitionsDir = path.join(__dirname, '..', 'data', 'items', 'definitions');

  const files = [
    path.join(definitionsDir, 'equipment.json'),
    path.join(definitionsDir, 'resources.json'),
    path.join(definitionsDir, 'consumables.json')
  ];

  console.log('Adding icon fields to item definitions...\n');

  for (const file of files) {
    if (fs.existsSync(file)) {
      processDefinitionFile(file);
    } else {
      console.log(`⚠ File not found: ${file}`);
    }
  }

  console.log('\n✓ All definitions processed!');
}

main();
