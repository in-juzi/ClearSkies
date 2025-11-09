/**
 * Test XP Scaling Formula
 *
 * Tests the polynomial decay formula used for XP scaling
 */

// XP Scaling formula (copied from locationService.js)
function calculateScaledXP(rawXP, playerLevel, activityLevel) {
  const levelDiff = playerLevel - activityLevel;

  // Grace range: 0-1 levels over = full XP
  if (levelDiff <= 1) {
    return rawXP;
  }

  // Polynomial decay: 1 / (1 + 0.3 * (diff - 1))
  const effectiveDiff = levelDiff - 1; // Subtract grace level
  const scalingFactor = 1 / (1 + 0.3 * effectiveDiff);

  // Apply floor of 1 XP
  return Math.max(1, Math.floor(rawXP * scalingFactor));
}

// Test cases
console.log('=== XP Scaling Tests ===\n');
console.log('Activity: Mine Iron (level 5 requirement, 45 raw XP)\n');

const testCases = [
  { playerLevel: 5, activityLevel: 5, rawXP: 45 },
  { playerLevel: 6, activityLevel: 5, rawXP: 45 },
  { playerLevel: 7, activityLevel: 5, rawXP: 45 },
  { playerLevel: 8, activityLevel: 5, rawXP: 45 },
  { playerLevel: 10, activityLevel: 5, rawXP: 45 },
  { playerLevel: 15, activityLevel: 5, rawXP: 45 },
  { playerLevel: 20, activityLevel: 5, rawXP: 45 },
  { playerLevel: 25, activityLevel: 5, rawXP: 45 },
];

console.log('Player Level | Level Diff | Raw XP | Scaled XP | % of Raw | Notes');
console.log('-------------|------------|--------|-----------|----------|-------');

testCases.forEach(test => {
  const scaledXP = calculateScaledXP(test.rawXP, test.playerLevel, test.activityLevel);
  const levelDiff = test.playerLevel - test.activityLevel;
  const percentage = Math.floor((scaledXP / test.rawXP) * 100);

  let notes = '';
  if (levelDiff <= 1) {
    notes = 'Grace range';
  } else if (percentage <= 25) {
    notes = 'Very low';
  } else if (percentage <= 50) {
    notes = 'Low';
  }

  console.log(
    `     ${test.playerLevel.toString().padStart(2)}      |     +${levelDiff.toString().padStart(2)}     | ` +
    `  ${test.rawXP.toString().padStart(2)}   |    ${scaledXP.toString().padStart(2)}     |   ${percentage.toString().padStart(3)}%   | ${notes}`
  );
});

console.log('\n=== Additional Test: Chop Oak (level 1 requirement, 30 raw XP) ===\n');

const oakTestCases = [
  { playerLevel: 1, activityLevel: 1, rawXP: 30 },
  { playerLevel: 2, activityLevel: 1, rawXP: 30 },
  { playerLevel: 3, activityLevel: 1, rawXP: 30 },
  { playerLevel: 5, activityLevel: 1, rawXP: 30 },
  { playerLevel: 10, activityLevel: 1, rawXP: 30 },
  { playerLevel: 20, activityLevel: 1, rawXP: 30 },
];

console.log('Player Level | Level Diff | Raw XP | Scaled XP | % of Raw');
console.log('-------------|------------|--------|-----------|----------');

oakTestCases.forEach(test => {
  const scaledXP = calculateScaledXP(test.rawXP, test.playerLevel, test.activityLevel);
  const levelDiff = test.playerLevel - test.activityLevel;
  const percentage = Math.floor((scaledXP / test.rawXP) * 100);

  console.log(
    `     ${test.playerLevel.toString().padStart(2)}      |     +${levelDiff.toString().padStart(2)}     | ` +
    `  ${test.rawXP.toString().padStart(2)}   |    ${scaledXP.toString().padStart(2)}     |   ${percentage.toString().padStart(3)}%`
  );
});

console.log('\n=== Verifying Minimum XP Floor ===\n');

// Test extreme case
const extremeTest = calculateScaledXP(10, 100, 1);
console.log(`Player L100 doing L1 activity (10 raw XP): ${extremeTest} XP (minimum floor working: ${extremeTest === 1 ? '✓' : '✗'})`);

console.log('\n=== Formula Behavior ===');
console.log('- Grace range: 0-1 levels over = 100% XP');
console.log('- Polynomial decay: 1 / (1 + 0.3 * (diff - 1))');
console.log('- Minimum floor: 1 XP');
console.log('- Smooth curve between linear and exponential');
