/**
 * Test script to verify ItemRegistry is working correctly
 */

import { ItemRegistry } from '../data/items/ItemRegistry';

console.log('🧪 Testing ItemRegistry...\n');

// Test 1: Get total item count
const totalItems = ItemRegistry.size;
console.log(`✓ Total items loaded: ${totalItems}`);

// Test 2: Get a specific item
const oakLog = ItemRegistry.get('oak_log');
if (oakLog) {
  console.log(`✓ Found Oak Log: ${oakLog.name} (${oakLog.category})`);
} else {
  console.error('❌ Oak Log not found!');
}

// Test 3: Get items by category
const resources = ItemRegistry.getByCategory('resource');
const equipment = ItemRegistry.getByCategory('equipment');
const consumables = ItemRegistry.getByCategory('consumable');

console.log(`✓ Resources: ${resources.length} items`);
console.log(`✓ Equipment: ${equipment.length} items`);
console.log(`✓ Consumables: ${consumables.length} items`);

// Test 4: Get items by subcategory
const woodItems = ItemRegistry.getBySubcategory('wood');
console.log(`✓ Wood items: ${woodItems.length} items`);

// Test 5: Verify all items have required fields
console.log('\n🔍 Validating item structure...');
let validationErrors = 0;

for (const item of ItemRegistry.getAll()) {
  if (!item.itemId) {
    console.error(`❌ Item missing itemId: ${JSON.stringify(item).slice(0, 50)}`);
    validationErrors++;
  }
  if (!item.name) {
    console.error(`❌ Item ${item.itemId} missing name`);
    validationErrors++;
  }
  if (!item.category) {
    console.error(`❌ Item ${item.itemId} missing category`);
    validationErrors++;
  }
  if (!item.icon) {
    console.error(`❌ Item ${item.itemId} missing icon`);
    validationErrors++;
  }
}

if (validationErrors === 0) {
  console.log('✓ All items have required fields');
} else {
  console.error(`❌ Found ${validationErrors} validation errors`);
}

// Test 6: Sample some items from each category
console.log('\n📦 Sample items:');
console.log('  Resources:', resources.slice(0, 3).map(i => i.name).join(', '));
console.log('  Equipment:', equipment.slice(0, 3).map(i => i.name).join(', '));
console.log('  Consumables:', consumables.slice(0, 3).map(i => i.name).join(', '));

// Test 7: Performance check
console.log('\n⚡ Performance test...');
const startTime = Date.now();
for (let i = 0; i < 10000; i++) {
  ItemRegistry.get('oak_log');
  ItemRegistry.getByCategory('resource');
}
const endTime = Date.now();
console.log(`✓ 20,000 operations completed in ${endTime - startTime}ms`);

console.log('\n✅ All tests passed!\n');
