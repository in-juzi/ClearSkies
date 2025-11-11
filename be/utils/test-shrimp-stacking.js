/**
 * Test if shrimp stacking is working correctly
 */

const itemService = require('../services/itemService');

// Simulate the shrimp instances from the database
const shrimpInstances = [
  {
    instanceId: 'cc642731-cae2-49ad-bf8e-665fb1f91e1d',
    itemId: 'shrimp',
    quantity: 49,
    equipped: false,
    qualities: {},
    traits: {}
  },
  {
    instanceId: 'bc00ce57-b349-4739-bdec-d12e72896c72',
    itemId: 'shrimp',
    quantity: 8,
    equipped: false,
    qualities: {},
    traits: {}
  },
  {
    instanceId: '2ea93647-dda3-445e-9b49-e6e3f382918f',
    itemId: 'shrimp',
    quantity: 16,
    equipped: false,
    qualities: {},
    traits: { pristine: 1 }
  }
];

function testStacking() {
  console.log('🧪 Testing Shrimp Stacking Logic\n');
  console.log('=' .repeat(60));

  // Test if instances 1 and 2 can stack (should be true)
  const canStack12 = itemService.canStack(shrimpInstances[0], shrimpInstances[1]);
  console.log('\n✓ Instance 1 (empty) vs Instance 2 (empty):', canStack12 ? 'CAN STACK' : 'CANNOT STACK');

  // Test if instances 1 and 3 can stack (should be false - different traits)
  const canStack13 = itemService.canStack(shrimpInstances[0], shrimpInstances[2]);
  console.log('✓ Instance 1 (empty) vs Instance 3 (pristine:1):', canStack13 ? 'CAN STACK' : 'CANNOT STACK');

  // Show the sorted map strings for debugging
  console.log('\n--- Sorted Map Strings (for comparison) ---');
  const s1q = itemService._sortedMapString(shrimpInstances[0].qualities);
  const s1t = itemService._sortedMapString(shrimpInstances[0].traits);
  const s2q = itemService._sortedMapString(shrimpInstances[1].qualities);
  const s2t = itemService._sortedMapString(shrimpInstances[1].traits);
  const s3q = itemService._sortedMapString(shrimpInstances[2].qualities);
  const s3t = itemService._sortedMapString(shrimpInstances[2].traits);

  console.log('Instance 1 qualities:', s1q, typeof s1q);
  console.log('Instance 1 traits:', s1t, typeof s1t);
  console.log('Instance 2 qualities:', s2q, typeof s2q);
  console.log('Instance 2 traits:', s2t, typeof s2t);
  console.log('Instance 3 qualities:', s3q, typeof s3q);
  console.log('Instance 3 traits:', s3t, typeof s3t);

  console.log('\nComparison:');
  console.log('s1q === s2q:', s1q === s2q, '|', JSON.stringify(s1q), '===', JSON.stringify(s2q));
  console.log('s1t === s2t:', s1t === s2t, '|', JSON.stringify(s1t), '===', JSON.stringify(s2t));

  // Check if item is stackable
  const itemDef = itemService.getItemDefinition('shrimp');
  console.log('\n--- Item Definition ---');
  if (itemDef) {
    console.log('stackable:', itemDef.stackable);
    console.log('maxStack:', itemDef.maxStack);
  } else {
    console.log('Item definition not found - items not loaded yet');
  }

  console.log('\n' + '=' .repeat(60));
}

testStacking();
