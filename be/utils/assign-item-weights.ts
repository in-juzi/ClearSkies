/**
 * Utility to assign weights to all item definitions
 *
 * This script reads all item definitions and suggests appropriate weights
 * based on category and subcategory.
 */

import * as fs from 'fs';
import * as path from 'path';

// Weight guidelines based on documentation
const WEIGHT_GUIDELINES: Record<string, number> = {
  // Consumables
  'potion': 0.3,
  'elixir': 0.4,
  'tincture': 0.2,
  'draught': 0.3,
  'food': 0.4,

  // Herbs/Flowers
  'herb': 0.08,
  'flower': 0.05,

  // Fish
  'fish_small': 0.5,
  'fish_medium': 1.0,
  'fish_large': 2.0,

  // Ore
  'copper_ore': 3.0,
  'iron_ore': 5.0,
  'gold_ore': 6.0,
  'silver_ore': 5.5,

  // Ingots
  'copper_ingot': 2.0,
  'bronze_ingot': 2.5,
  'iron_ingot': 4.0,
  'steel_ingot': 4.5,

  // Wood/Logs
  'log': 2.0,
  'wood': 1.5,
  'plank': 1.2,

  // Weapons
  'dagger': 1.0,
  'sword': 2.5,
  'axe': 4.0,
  'mace': 3.5,
  'staff': 2.0,
  'bow': 1.5,

  // Armor
  'leather_armor': 3.0,
  'bronze_armor': 6.0,
  'iron_armor': 10.0,
  'helmet': 2.0,
  'boots': 2.0,
  'gloves': 1.0,

  // Tools
  'pickaxe': 2.5,
  'axe_tool': 3.0,
  'fishing_rod': 1.0,
  'gathering_tool': 1.5,

  // Gemstones
  'gemstone': 0.2,
  'ruby': 0.15,
  'sapphire': 0.15,
  'emerald': 0.15,
  'diamond': 0.1,

  // Default fallbacks
  'default_consumable': 0.3,
  'default_resource': 1.0,
  'default_equipment': 2.5,
};

function getWeightForItem(itemId: string, category: string, subcategories: readonly string[]): number {
  // Try exact item ID match first
  if (WEIGHT_GUIDELINES[itemId]) {
    return WEIGHT_GUIDELINES[itemId];
  }

  // Try subcategory matches
  for (const sub of subcategories) {
    if (WEIGHT_GUIDELINES[sub.toLowerCase()]) {
      return WEIGHT_GUIDELINES[sub.toLowerCase()];
    }
  }

  // Check if itemId contains keywords
  const itemIdLower = itemId.toLowerCase();
  for (const [keyword, weight] of Object.entries(WEIGHT_GUIDELINES)) {
    if (itemIdLower.includes(keyword)) {
      return weight;
    }
  }

  // Fallback by category
  switch (category.toLowerCase()) {
    case 'consumable':
      return WEIGHT_GUIDELINES['default_consumable'];
    case 'resource':
      return WEIGHT_GUIDELINES['default_resource'];
    case 'equipment':
      return WEIGHT_GUIDELINES['default_equipment'];
    default:
      return 1.0;
  }
}

function findItemFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.includes('.spec.')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function extractItemInfo(content: string): { itemId: string; category: string; subcategories: string[] } | null {
  // Extract itemId
  const itemIdMatch = content.match(/itemId:\s*['"]([^'"]+)['"]/);
  if (!itemIdMatch) return null;

  // Extract category
  const categoryMatch = content.match(/category:\s*CATEGORY\.(\w+)|category:\s*['"](\w+)['"]/);
  if (!categoryMatch) return null;

  // Extract subcategories
  const subcategoriesMatch = content.match(/subcategories:\s*\[([\s\S]*?)\]/);
  let subcategories: string[] = [];
  if (subcategoriesMatch) {
    const subContent = subcategoriesMatch[1];
    const subMatches = subContent.matchAll(/SUBCATEGORY\.(\w+)|['"](\w+)['"]/g);
    subcategories = Array.from(subMatches).map(m => m[1] || m[2]);
  }

  return {
    itemId: itemIdMatch[1],
    category: categoryMatch[1] || categoryMatch[2],
    subcategories
  };
}

function hasWeight(content: string): boolean {
  return /weight:\s*[\d.]+/.test(content);
}

async function main() {
  const itemsDir = path.join(__dirname, '../data/items/definitions');
  const itemFiles = findItemFiles(itemsDir);

  console.log(`Found ${itemFiles.length} item files\n`);

  const itemsNeedingWeight: Array<{ file: string; itemId: string; category: string; subcategories: string[]; suggestedWeight: number }> = [];
  const itemsWithWeight: Array<{ file: string; itemId: string }> = [];

  for (const file of itemFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const info = extractItemInfo(content);

    if (!info) {
      console.log(`⚠️  Could not extract info from: ${path.basename(file)}`);
      continue;
    }

    if (hasWeight(content)) {
      itemsWithWeight.push({ file, itemId: info.itemId });
    } else {
      const suggestedWeight = getWeightForItem(info.itemId, info.category, info.subcategories);
      itemsNeedingWeight.push({
        file,
        itemId: info.itemId,
        category: info.category,
        subcategories: info.subcategories,
        suggestedWeight
      });
    }
  }

  console.log(`✅ Items with weight: ${itemsWithWeight.length}`);
  console.log(`❌ Items needing weight: ${itemsNeedingWeight.length}\n`);

  if (itemsNeedingWeight.length > 0) {
    console.log('Items needing weight assignment:\n');
    console.log('File | ItemID | Category | Subcategories | Suggested Weight');
    console.log('------|--------|----------|---------------|------------------');

    for (const item of itemsNeedingWeight) {
      const filename = path.basename(item.file);
      console.log(`${filename.padEnd(40)} | ${item.itemId.padEnd(25)} | ${item.category.padEnd(12)} | ${item.subcategories.join(', ').padEnd(20)} | ${item.suggestedWeight} kg`);
    }

    console.log(`\n\n📝 To add weights, add this to the properties object of each item:`);
    console.log(`   weight: X.X  // in kg`);
  }
}

main().catch(console.error);
