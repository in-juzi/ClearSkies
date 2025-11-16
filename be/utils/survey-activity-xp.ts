/**
 * Activity XP Survey Tool
 *
 * Analyzes all activities to understand current XP distribution
 * and recommend tier-appropriate XP values based on level requirements.
 */

import { ActivityRegistry } from '../data/locations/ActivityRegistry';
import { MonsterRegistry } from '../data/monsters/MonsterRegistry';
import { ActivityUnion, GatheringActivity, CombatActivity } from '@shared/types';

// XP tier recommendations
const XP_TIERS = [
  { minLevel: 1,  maxLevel: 10,  xp: 20,  label: 'T1' },
  { minLevel: 11, maxLevel: 20,  xp: 50,  label: 'T2' },
  { minLevel: 21, maxLevel: 30,  xp: 100, label: 'T3' },
  { minLevel: 31, maxLevel: 40,  xp: 175, label: 'T4' },
  { minLevel: 41, maxLevel: 50,  xp: 300, label: 'T5' },
];

interface ActivityAnalysis {
  activityId: string;
  name: string;
  type: string;
  minLevel: number;
  currentXP: number;
  recommendedXP: number;
  tier: string;
  needsUpdate: boolean;
  skillName: string;
}

function getMinSkillLevel(activity: ActivityUnion): { level: number; skill: string } {
  if (!activity.requirements?.skills) {
    return { level: 1, skill: 'none' };
  }

  let minLevel = 1;
  let skillName = 'none';

  for (const [skill, level] of Object.entries(activity.requirements.skills)) {
    if (level > minLevel) {
      minLevel = level;
      skillName = skill;
    }
  }

  return { level: minLevel, skill: skillName };
}

function getRecommendedXP(minLevel: number): { xp: number; tier: string } {
  const tier = XP_TIERS.find(t => minLevel >= t.minLevel && minLevel <= t.maxLevel);
  return tier
    ? { xp: tier.xp, tier: tier.label }
    : { xp: XP_TIERS[XP_TIERS.length - 1].xp, tier: 'T5+' };
}

function getCurrentXP(activity: ActivityUnion): number {
  // Combat activities get XP from Monster definition
  if (activity.type === 'combat') {
    const combatActivity = activity as CombatActivity;
    // Combat activities no longer have experience in rewards - it comes from Monster
    if (!combatActivity.combatConfig?.monsterId) return 0;

    const monster = MonsterRegistry.get(combatActivity.combatConfig.monsterId);
    return monster?.experience || 0;
  }

  // Gathering activities
  const gatheringActivity = activity as GatheringActivity;
  if (!gatheringActivity.rewards?.experience) return 0;

  // Get the highest XP reward from any skill
  const xpValues = Object.values(gatheringActivity.rewards.experience);
  return Math.max(...(xpValues as number[]), 0);
}

console.log('=== ACTIVITY XP SURVEY ===\n');

const activities = ActivityRegistry.getAll();
const analysis: ActivityAnalysis[] = [];

console.log(`Found ${activities.length} activities\n`);

// Analyze each activity
for (const activity of activities) {
  const { level: minLevel, skill: skillName } = getMinSkillLevel(activity);
  const currentXP = getCurrentXP(activity);
  const { xp: recommendedXP, tier } = getRecommendedXP(minLevel);

  const needsUpdate = currentXP !== recommendedXP;

  analysis.push({
    activityId: activity.activityId,
    name: activity.name,
    type: activity.type,
    minLevel,
    currentXP,
    recommendedXP,
    tier,
    needsUpdate,
    skillName
  });
}

// Sort by tier, then by level
analysis.sort((a, b) => {
  if (a.tier !== b.tier) return a.tier.localeCompare(b.tier);
  return a.minLevel - b.minLevel;
});

// Display results by tier
console.log('=== ANALYSIS BY TIER ===\n');

for (const tierDef of XP_TIERS) {
  const tierActivities = analysis.filter(a => a.tier === tierDef.label);

  if (tierActivities.length === 0) continue;

  console.log(`${tierDef.label} (Levels ${tierDef.minLevel}-${tierDef.maxLevel}): ${tierDef.xp} XP recommended`);
  console.log('─'.repeat(100));

  for (const activity of tierActivities) {
    const status = activity.needsUpdate ? '⚠️ UPDATE' : '✅ OK';
    const skillDisplay = activity.skillName.padEnd(12);
    const nameDisplay = activity.name.padEnd(35);
    const currentDisplay = `${activity.currentXP} XP`.padEnd(10);
    const recommendedDisplay = activity.needsUpdate ? `→ ${activity.recommendedXP} XP` : '';

    console.log(
      `  ${status} | L${activity.minLevel.toString().padStart(2)} ${skillDisplay} | ${nameDisplay} | ${currentDisplay} ${recommendedDisplay}`
    );
  }

  console.log('');
}

// Summary statistics
const needsUpdateCount = analysis.filter(a => a.needsUpdate).length;
const alreadyCorrect = analysis.length - needsUpdateCount;

console.log('=== SUMMARY ===\n');
console.log(`Total activities: ${analysis.length}`);
console.log(`Already correct: ${alreadyCorrect}`);
console.log(`Need updates: ${needsUpdateCount}`);
console.log('');

// List activities that need updates
if (needsUpdateCount > 0) {
  console.log('=== ACTIVITIES NEEDING UPDATES ===\n');

  const toUpdate = analysis.filter(a => a.needsUpdate);

  for (const activity of toUpdate) {
    console.log(`${activity.activityId}`);
    console.log(`  File: be/data/locations/activities/${getActivityFileName(activity.activityId)}.ts`);
    console.log(`  Current: ${activity.currentXP} XP → Recommended: ${activity.recommendedXP} XP (${activity.tier})`);
    console.log('');
  }
}

// Generate TypeScript update code
console.log('=== SUGGESTED XP VALUES ===\n');
console.log('Copy this to update your activities:\n');

for (const tierDef of XP_TIERS) {
  const tierActivities = analysis.filter(a => a.tier === tierDef.label && a.needsUpdate);
  if (tierActivities.length === 0) continue;

  console.log(`// ${tierDef.label} Activities (Levels ${tierDef.minLevel}-${tierDef.maxLevel})`);
  for (const activity of tierActivities) {
    console.log(`// ${activity.activityId}: ${activity.currentXP} → ${activity.recommendedXP} XP`);
  }
  console.log('');
}

function getActivityFileName(activityId: string): string {
  // Convert kebab-case to PascalCase
  return 'Activity' + activityId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
