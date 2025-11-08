// Test script for drop table system
const dropTableService = require('./services/dropTableService');

async function testDropTables() {
  console.log('=== Drop Table System Test ===\n');

  // Load drop tables
  await dropTableService.loadAll();

  // Test 1: Show drop table statistics
  console.log('--- Drop Table Statistics ---');
  const oakStats = dropTableService.getDropTableStats('woodcutting-oak');
  console.log(JSON.stringify(oakStats, null, 2));
  console.log('');

  // Test 2: Roll on a single drop table multiple times
  console.log('--- Rolling on woodcutting-oak 10 times ---');
  const results = {};
  for (let i = 0; i < 10; i++) {
    const drop = dropTableService.rollDropTable('woodcutting-oak');
    if (drop) {
      const key = `${drop.itemId} (${drop.quantity})`;
      results[key] = (results[key] || 0) + 1;
    } else {
      results['nothing'] = (results['nothing'] || 0) + 1;
    }
  }
  console.log('Results:', results);
  console.log('');

  // Test 3: Roll on multiple drop tables (like an activity would)
  console.log('--- Rolling on multiple tables (woodcutting-oak + rare-woodcutting) 20 times ---');
  const multiResults = { common: {}, rare: {} };
  for (let i = 0; i < 20; i++) {
    const drops = dropTableService.rollMultipleDropTables(['woodcutting-oak', 'rare-woodcutting']);
    drops.forEach(drop => {
      const key = `${drop.itemId} (${drop.quantity})`;
      if (drop.itemId === 'oak_log' || drop.itemId === 'birch_log') {
        multiResults.common[key] = (multiResults.common[key] || 0) + 1;
      } else {
        multiResults.rare[key] = (multiResults.rare[key] || 0) + 1;
      }
    });
  }
  console.log('Common drops:', multiResults.common);
  console.log('Rare drops:', multiResults.rare);
  console.log('');

  // Test 4: Show all drop table stats
  console.log('--- All Drop Tables ---');
  const allTables = dropTableService.getAllDropTables();
  allTables.forEach(table => {
    console.log(`${table.name} (${table.dropTableId})`);
  });
  console.log('');

  console.log('=== Tests Complete ===');
  process.exit(0);
}

testDropTables().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
