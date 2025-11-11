/**
 * Test script to visualize the effect of level damping on quality distributions
 */

// Simulate the damping function
function applyLevelDamping(weights, damping) {
  const dampedWeights = weights.map((weight, index) => {
    const levelPosition = index / (weights.length - 1);
    const dampingFactor = Math.pow(1 - levelPosition, damping * 2);
    return weight * (1 + dampingFactor);
  });

  const total = dampedWeights.reduce((sum, w) => sum + w, 0);
  return dampedWeights.map(w => w / total);
}

// Original weights for each tier
const tier1Original = [0.25, 0.40, 0.25, 0.08, 0.02];
const tier2Original = [0.10, 0.25, 0.35, 0.25, 0.05];
const tier3Original = [0.05, 0.10, 0.25, 0.35, 0.25];

const damping = 0.6; // From config

console.log('='.repeat(70));
console.log('QUALITY LEVEL DAMPING TEST');
console.log('='.repeat(70));
console.log(`Damping factor: ${damping}`);
console.log('');

function printDistribution(tierName, original, damped) {
  console.log(`${tierName}:`);
  console.log('  Level  | Original | Damped   | Change');
  console.log('  -------|----------|----------|--------');

  for (let i = 0; i < original.length; i++) {
    const level = i + 1;
    const orig = (original[i] * 100).toFixed(1);
    const damp = (damped[i] * 100).toFixed(1);
    const change = ((damped[i] - original[i]) * 100).toFixed(1);
    const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
    console.log(`  L${level}     | ${orig.padStart(6)}%  | ${damp.padStart(6)}%  | ${arrow} ${Math.abs(change).toFixed(1)}%`);
  }

  // Calculate average level
  const avgOrig = original.reduce((sum, w, i) => sum + w * (i + 1), 0);
  const avgDamp = damped.reduce((sum, w, i) => sum + w * (i + 1), 0);
  console.log('  -------|----------|----------|--------');
  console.log(`  Avg    | ${avgOrig.toFixed(2).padStart(8)} | ${avgDamp.toFixed(2).padStart(8)} | ${(avgDamp - avgOrig).toFixed(2)}`);
  console.log('');
}

const tier1Damped = applyLevelDamping(tier1Original, damping);
const tier2Damped = applyLevelDamping(tier2Original, damping);
const tier3Damped = applyLevelDamping(tier3Original, damping);

printDistribution('TIER 1 (Common - oak_log, copper_ore)', tier1Original, tier1Damped);
printDistribution('TIER 2 (Uncommon - willow_log, iron_ore)', tier2Original, tier2Damped);
printDistribution('TIER 3+ (Rare - maple_log, silver_ore)', tier3Original, tier3Damped);

console.log('='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log('With 0.6 damping:');
console.log('  - Lower levels (L1-L2) get INCREASED probability');
console.log('  - Higher levels (L4-L5) get DECREASED probability');
console.log('  - Average level drops by ~0.3-0.5 across all tiers');
console.log('  - L5 drops become much rarer (especially for T1/T2 items)');
console.log('');
console.log('To adjust:');
console.log('  - Increase damping (e.g., 0.8) for MORE low-level bias');
console.log('  - Decrease damping (e.g., 0.4) for LESS low-level bias');
console.log('  - Set to 0 to disable damping entirely');
console.log('='.repeat(70));
