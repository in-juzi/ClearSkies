/**
 * Test script to verify the level-based quality/trait system
 */

const itemService = require('./be/services/itemService');

async function testLevelSystem() {
  console.log('\n=== Testing Level-Based Quality & Trait System ===\n');

  // Initialize the item service
  await itemService.loadDefinitions();

  // Test 1: Generate random qualities for an oak log
  console.log('1. Testing random quality generation for oak_log:');
  const qualities = itemService.generateRandomQualities('oak_log');
  console.log('   Generated qualities:', qualities);
  console.log('   Expected: Map with integer levels (1-5)\n');

  // Test 2: Generate random traits for an oak log
  console.log('2. Testing random trait generation for oak_log:');
  const traits = itemService.generateRandomTraits('oak_log');
  console.log('   Generated traits:', traits);
  console.log('   Expected: Map with traitId -> level (1-3)\n');

  // Test 3: Create an item instance with specific levels
  console.log('3. Creating item instance with specific quality/trait levels:');
  const item = itemService.createItemInstance('oak_log', 5, {
    woodGrain: 4,
    moisture: 5
  }, {
    fragrant: 2
  });
  console.log('   Item instance:', JSON.stringify(item, null, 2));

  // Test 4: Calculate vendor price with level-based modifiers
  console.log('\n4. Calculating vendor price with level-based modifiers:');
  const price = itemService.calculateVendorPrice(item);
  console.log('   Base price: 10g');
  console.log('   Quality modifiers: woodGrain L4 (1.15x), moisture L5 (1.25x)');
  console.log('   Trait modifiers: fragrant L2 (1.25x)');
  console.log('   Calculated price:', price + 'g');
  console.log('   Expected: ~18g (10 * 1.15 * 1.25 * 1.25 = ~18)\n');

  // Test 5: Get full item details
  console.log('5. Getting full item details with level data:');
  const details = itemService.getItemDetails(item);
  console.log('   Quality details:');
  for (const [qualityId, data] of Object.entries(details.qualityDetails)) {
    console.log(`     - ${data.name}: Level ${data.level} - ${data.levelData.name}`);
    console.log(`       "${data.levelData.description}"`);
  }
  console.log('   Trait details:');
  for (const [traitId, data] of Object.entries(details.traitDetails)) {
    console.log(`     - ${data.name}: Level ${data.level} - ${data.levelData.name}`);
    console.log(`       "${data.levelData.description}"`);
  }

  // Test 6: Stacking logic
  console.log('\n6. Testing stacking logic:');
  const item2 = itemService.createItemInstance('oak_log', 3, {
    woodGrain: 4,
    moisture: 5
  }, {
    fragrant: 2
  });
  const item3 = itemService.createItemInstance('oak_log', 2, {
    woodGrain: 4,
    moisture: 4  // Different level
  }, {
    fragrant: 2
  });

  console.log('   Item 1 (woodGrain:4, moisture:5, fragrant:2) can stack with:');
  console.log('     Item 2 (same levels):', itemService.canStack(item, item2));
  console.log('     Item 3 (moisture:4):', itemService.canStack(item, item3));
  console.log('   Expected: true, false\n');

  console.log('=== All Tests Complete ===\n');
  process.exit(0);
}

testLevelSystem().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
