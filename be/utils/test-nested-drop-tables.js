/**
 * Test script for nested drop table functionality
 * Simulates rolling on mining-copper drop table which includes nested rare-low-mining table
 */

const dropTableService = require('../services/dropTableService');

async function testNestedDropTables() {
  console.log('🎲 Testing Nested Drop Table System\n');
  console.log('=' .repeat(60));

  // Load drop tables
  await dropTableService.loadAll();

  // Test 1: Roll on mining-copper drop table 100 times
  console.log('\n📊 Test 1: Mining Copper (100 rolls)');
  console.log('-' .repeat(60));

  const results = {
    copper_ore: 0,
    quartz: 0,
    citrine: 0,
    amethyst: 0,
    null: 0
  };

  for (let i = 0; i < 100; i++) {
    const drop = dropTableService.rollDropTable('mining-copper');
    if (drop) {
      if (results.hasOwnProperty(drop.itemId)) {
        results[drop.itemId]++;
      } else {
        results[drop.itemId] = 1;
      }
    } else {
      results.null++;
    }
  }

  console.log('\nResults:');
  for (const [itemId, count] of Object.entries(results)) {
    if (count > 0) {
      console.log(`  ${itemId}: ${count} (${count}%)`);
    }
  }

  // Test 2: Verify gemstone drops came from nested table
  console.log('\n\n📊 Test 2: Direct Rare Table Rolls (100 rolls)');
  console.log('-' .repeat(60));

  const rareResults = {
    quartz: 0,
    citrine: 0,
    amethyst: 0,
    null: 0
  };

  for (let i = 0; i < 100; i++) {
    const drop = dropTableService.rollDropTable('rare-low-mining');
    if (drop) {
      if (rareResults.hasOwnProperty(drop.itemId)) {
        rareResults[drop.itemId]++;
      } else {
        rareResults[drop.itemId] = 1;
      }
    } else {
      rareResults.null++;
    }
  }

  console.log('\nResults (should match proportions from rare-low-mining):');
  for (const [itemId, count] of Object.entries(rareResults)) {
    if (count > 0) {
      console.log(`  ${itemId}: ${count} (${count}%)`);
    }
  }

  // Test 3: Show detailed drop from nested table
  console.log('\n\n📊 Test 3: Detailed Drop Examples');
  console.log('-' .repeat(60));

  console.log('\nRolling 20 times on mining-copper, showing gemstone drops:');
  for (let i = 0; i < 20; i++) {
    const drop = dropTableService.rollDropTable('mining-copper');
    if (drop && drop.itemId !== 'copper_ore') {
      console.log(`  Roll ${i + 1}: ${drop.itemId} x${drop.quantity} (qualityBonus: ${drop.qualityBonus || 0})`);
    }
  }

  // Test 4: Test depth protection (create a circular reference simulation)
  console.log('\n\n📊 Test 4: Max Depth Protection');
  console.log('-' .repeat(60));

  // Manually test max depth by calling with increasing depth
  console.log('\nTesting depth limits (should stop at depth 5):');
  for (let depth = 0; depth <= 7; depth++) {
    const result = dropTableService.rollDropTable('rare-low-mining', {}, depth);
    console.log(`  Depth ${depth}: ${result ? 'Success (' + result.itemId + ')' : 'Max depth reached (null)'}`);
  }

  // Test 5: Get drop table stats
  console.log('\n\n📊 Test 5: Drop Table Statistics');
  console.log('-' .repeat(60));

  const copperStats = dropTableService.getDropTableStats('mining-copper');
  console.log('\nMining Copper Stats:');
  console.log(`  Total Weight: ${copperStats.totalWeight}`);
  console.log('  Drops:');
  copperStats.drops.forEach(drop => {
    const type = drop.itemId === 'nothing' ? '[nested table]' : '[item]';
    console.log(`    ${type} ${drop.itemId || 'rare-low-mining'}: ${drop.probability} (weight: ${drop.weight})`);
  });

  const rareStats = dropTableService.getDropTableStats('rare-low-mining');
  console.log('\nRare Low Mining Stats:');
  console.log(`  Total Weight: ${rareStats.totalWeight}`);
  console.log('  Drops:');
  rareStats.drops.forEach(drop => {
    console.log(`    ${drop.itemId}: ${drop.probability} (weight: ${drop.weight}) ${drop.comment || ''}`);
  });

  console.log('\n' + '=' .repeat(60));
  console.log('✅ Nested drop table testing complete!\n');
}

// Run the test
testNestedDropTables().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
