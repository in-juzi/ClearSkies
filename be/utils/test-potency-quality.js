/**
 * Test script to verify Potency quality multiplier applies to consumables
 * Run: node be/utils/test-potency-quality.js
 */

const itemService = require('../dist/be/services/itemService').default;

async function runTests() {
  // Initialize itemService
  await itemService.loadDefinitions();

  console.log('🧪 Testing Potency Quality on Consumables\n');

  // Test health tincture with different potency levels
  const testCases = [
    { level: 0, name: 'No Potency', expectedMultiplier: 1.0 },
    { level: 1, name: 'Potent', expectedMultiplier: 1.10 },
    { level: 2, name: 'Concentrated', expectedMultiplier: 1.20 },
    { level: 3, name: 'Enriched', expectedMultiplier: 1.30 },
    { level: 4, name: 'Sublime', expectedMultiplier: 1.40 },
    { level: 5, name: 'Transcendent', expectedMultiplier: 1.50 }
  ];

  const baseHealthRestore = 20; // Health Tincture base value

  console.log('Item: Health Tincture');
  console.log(`Base healing: ${baseHealthRestore} HP\n`);
  console.log('Testing Potency quality levels:\n');

  for (const testCase of testCases) {
    const qualities = testCase.level > 0 ? { potency: testCase.level } : {};

    const itemInstance = itemService.createItemInstance('health_tincture', 1, qualities, {});
    const effects = itemService.getConsumableEffects(itemInstance);

    const expectedHealing = Math.floor(baseHealthRestore * testCase.expectedMultiplier);
    const actualHealing = effects.healthRestore;
    const passed = actualHealing === expectedHealing;

    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testCase.name.padEnd(15)} (Level ${testCase.level})`);
    console.log(`   Multiplier: ${testCase.expectedMultiplier}x`);
    console.log(`   Expected: ${expectedHealing} HP`);
    console.log(`   Actual: ${actualHealing} HP`);

    if (!passed) {
      console.log(`   ⚠️  MISMATCH!`);
    }
    console.log();
  }

  // Test mana potion with potency
  console.log('\n' + '='.repeat(50));
  console.log('Testing Mana Tincture with Potency Level 3:\n');

  const manaTinctureInstance = itemService.createItemInstance('mana_tincture', 1, { potency: 3 }, {});
  const manaTinctureEffects = itemService.getConsumableEffects(manaTinctureInstance);

  console.log(`Base mana restore: 20 MP`);
  console.log(`Potency Level 3 multiplier: 1.30x`);
  console.log(`Expected: ${Math.floor(20 * 1.30)} MP`);
  console.log(`Actual: ${manaTinctureEffects.manaRestore} MP`);
  console.log(manaTinctureEffects.manaRestore === 26 ? '✅ PASS' : '❌ FAIL');

  console.log('\n✨ Test complete!\n');
}

// Run the tests
runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
