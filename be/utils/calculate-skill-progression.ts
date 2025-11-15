/**
 * Calculate Player Progression Through Skills
 *
 * This script calculates how many gathering actions are needed to progress
 * through skill levels, helping estimate player progression timelines.
 *
 * Usage: node -r tsconfig-paths/register -r ts-node/register utils/calculate-skill-progression.ts
 */

import { ActivityRegistry } from '../data/locations/ActivityRegistry';
import { RecipeRegistry } from '../data/recipes/RecipeRegistry';
import { MonsterRegistry } from '../data/monsters/MonsterRegistry';
import { Activity, GatheringActivity, Recipe, Monster } from '@shared/types';

// XP Constants from Player model
const XP_PER_LEVEL = 1000;

// XP Scaling formula from locationService.ts
function calculateScaledXP(rawXP: number, playerLevel: number, activityLevel: number): number {
  const levelDiff = playerLevel - activityLevel;

  // Grace range: 0-1 levels over = full XP
  if (levelDiff <= 1) {
    return rawXP;
  }

  // Polynomial decay: 1 / (1 + 0.3 * (diff - 1))
  const effectiveDiff = levelDiff - 1;
  const scalingFactor = 1 / (1 + 0.3 * effectiveDiff);

  // Apply floor of 1 XP
  return Math.max(1, Math.floor(rawXP * scalingFactor));
}

interface ProgressionStep {
  activityName: string;
  activityLevel: number;
  startLevel: number;
  endLevel: number;
  rawXPPerAction: number;
  scaledXPPerAction: number;
  xpNeeded: number;
  actionsNeeded: number;
  timePerAction: number; // seconds
  totalTimeMinutes: number;
  totalTimeHours: number;
}

interface SkillProgression {
  skillName: string;
  steps: ProgressionStep[];
  totalActions: number;
  totalTimeHours: number;
}

/**
 * Calculate progression for combat skills (oneHanded, dualWield, twoHanded, ranged, casting, gun)
 * All combat skills gain XP from defeating monsters, so progression is identical
 */
function calculateCombatProgression(skillName: string, targetLevel: number = 99): SkillProgression {
  // Get all monsters
  const allMonsters = MonsterRegistry.getAll();

  // Sort monsters by level (ascending)
  const sortedMonsters = allMonsters.sort((a, b) => a.level - b.level);

  console.log(`\n========================================`);
  console.log(`Skill: ${skillName.toUpperCase()} (Combat)`);
  console.log(`========================================`);
  console.log(`Found ${sortedMonsters.length} monsters:`);
  sortedMonsters.forEach(monster => {
    console.log(`  - ${monster.name} (Level ${monster.level}, ${monster.experience} XP)`);
  });

  const steps: ProgressionStep[] = [];
  let currentLevel = 1;
  let totalActions = 0;
  let totalTimeSeconds = 0;

  // Estimate average combat duration based on monster level
  // Lower level monsters die faster, higher level take longer
  const estimateCombatDuration = (monsterLevel: number): number => {
    // Base: 30s for level 1, +5s per level
    return 30 + (monsterLevel * 5);
  };

  // For each monster, calculate how long to fight it
  for (let i = 0; i < sortedMonsters.length; i++) {
    const monster = sortedMonsters[i];
    const monsterLevel = monster.level;
    const rawXP = monster.experience;
    const nextMonster = sortedMonsters[i + 1];
    const nextMonsterLevel = nextMonster?.level || targetLevel;

    // Fight this monster until we can do the next one (or reach target level)
    let levelStart = Math.max(currentLevel, monsterLevel);
    let levelEnd = Math.min(nextMonsterLevel, targetLevel);

    // Calculate XP needed and kills for this level range
    let xpNeeded = 0;
    let killsNeeded = 0;
    let totalScaledXP = 0;

    for (let level = levelStart; level < levelEnd; level++) {
      const xpForThisLevel = XP_PER_LEVEL;
      xpNeeded += xpForThisLevel;

      // Calculate scaled XP at this level
      const scaledXP = calculateScaledXP(rawXP, level, monsterLevel);
      const killsForLevel = Math.ceil(xpForThisLevel / scaledXP);

      killsNeeded += killsForLevel;
      totalScaledXP += (killsForLevel * scaledXP);
    }

    if (levelStart < levelEnd) {
      const avgScaledXP = totalScaledXP / killsNeeded;
      const combatDuration = estimateCombatDuration(monsterLevel);
      const timeSeconds = killsNeeded * combatDuration;

      steps.push({
        activityName: monster.name,
        activityLevel: monsterLevel,
        startLevel: levelStart,
        endLevel: levelEnd,
        rawXPPerAction: rawXP,
        scaledXPPerAction: avgScaledXP,
        xpNeeded,
        actionsNeeded: killsNeeded,
        timePerAction: combatDuration,
        totalTimeMinutes: timeSeconds / 60,
        totalTimeHours: timeSeconds / 3600
      });

      totalActions += killsNeeded;
      totalTimeSeconds += timeSeconds;
    }

    currentLevel = levelEnd;

    if (currentLevel >= targetLevel) {
      break;
    }
  }

  return {
    skillName,
    steps,
    totalActions,
    totalTimeHours: totalTimeSeconds / 3600
  };
}

/**
 * Calculate progression for a crafting skill (cooking, smithing, alchemy)
 */
function calculateCraftingProgression(skillName: string, targetLevel: number = 99): SkillProgression {
  // Get all recipes for this skill
  const allRecipes = RecipeRegistry.getAll();
  const skillRecipes = allRecipes.filter(recipe => recipe.skill === skillName);

  // Sort recipes by required level (ascending)
  const sortedRecipes = skillRecipes.sort((a, b) => {
    return (a.requiredLevel || 0) - (b.requiredLevel || 0);
  });

  console.log(`\n========================================`);
  console.log(`Skill: ${skillName.toUpperCase()} (Crafting)`);
  console.log(`========================================`);
  console.log(`Found ${sortedRecipes.length} recipes:`);
  sortedRecipes.forEach(recipe => {
    const reqLevel = recipe.requiredLevel || 0;
    const xp = recipe.experience;
    console.log(`  - ${recipe.name} (Level ${reqLevel}, ${xp} XP, ${recipe.duration}s)`);
  });

  const steps: ProgressionStep[] = [];
  let currentLevel = 1;
  let totalActions = 0;
  let totalTimeSeconds = 0;

  // For each recipe, calculate how long to use it
  for (let i = 0; i < sortedRecipes.length; i++) {
    const recipe = sortedRecipes[i];
    const recipeLevel = recipe.requiredLevel || 0;
    const rawXP = recipe.experience;
    const nextRecipe = sortedRecipes[i + 1];
    const nextRecipeLevel = nextRecipe?.requiredLevel || targetLevel;

    // Use this recipe until we can do the next one (or reach target level)
    let levelStart = Math.max(currentLevel, recipeLevel);
    let levelEnd = Math.min(nextRecipeLevel, targetLevel);

    // Calculate XP needed and actions for this level range
    let xpNeeded = 0;
    let actionsNeeded = 0;
    let totalScaledXP = 0;

    for (let level = levelStart; level < levelEnd; level++) {
      const xpForThisLevel = XP_PER_LEVEL;
      xpNeeded += xpForThisLevel;

      // Calculate scaled XP at this level
      const scaledXP = calculateScaledXP(rawXP, level, recipeLevel);
      const actionsForLevel = Math.ceil(xpForThisLevel / scaledXP);

      actionsNeeded += actionsForLevel;
      totalScaledXP += (actionsForLevel * scaledXP);
    }

    if (levelStart < levelEnd) {
      const avgScaledXP = totalScaledXP / actionsNeeded;
      const timeSeconds = actionsNeeded * recipe.duration;

      steps.push({
        activityName: recipe.name,
        activityLevel: recipeLevel,
        startLevel: levelStart,
        endLevel: levelEnd,
        rawXPPerAction: rawXP,
        scaledXPPerAction: avgScaledXP,
        xpNeeded,
        actionsNeeded,
        timePerAction: recipe.duration,
        totalTimeMinutes: timeSeconds / 60,
        totalTimeHours: timeSeconds / 3600
      });

      totalActions += actionsNeeded;
      totalTimeSeconds += timeSeconds;
    }

    currentLevel = levelEnd;

    if (currentLevel >= targetLevel) {
      break;
    }
  }

  return {
    skillName,
    steps,
    totalActions,
    totalTimeHours: totalTimeSeconds / 3600
  };
}

/**
 * Calculate progression for a gathering skill (fishing, woodcutting, mining, gathering)
 */
function calculateSkillProgression(skillName: string, targetLevel: number = 99): SkillProgression {
  // Get all activities for this skill
  const allActivities = ActivityRegistry.getAll();
  const skillActivities = allActivities.filter(activity => {
    if (activity.type !== 'resource-gathering') return false;
    const gatheringActivity = activity as GatheringActivity;
    return gatheringActivity.rewards?.experience?.[skillName] !== undefined;
  }) as GatheringActivity[];

  // Sort activities by required level (ascending)
  const sortedActivities = skillActivities.sort((a, b) => {
    const levelA = a.requirements?.skills?.[skillName] || 0;
    const levelB = b.requirements?.skills?.[skillName] || 0;
    return levelA - levelB;
  });

  console.log(`\n========================================`);
  console.log(`Skill: ${skillName.toUpperCase()}`);
  console.log(`========================================`);
  console.log(`Found ${sortedActivities.length} activities:`);
  sortedActivities.forEach(activity => {
    const reqLevel = activity.requirements?.skills?.[skillName] || 0;
    const xp = activity.rewards.experience[skillName];
    console.log(`  - ${activity.name} (Level ${reqLevel}, ${xp} XP, ${activity.duration}s)`);
  });

  const steps: ProgressionStep[] = [];
  let currentLevel = 1;
  let totalActions = 0;
  let totalTimeSeconds = 0;

  // For each activity, calculate how long to use it
  for (let i = 0; i < sortedActivities.length; i++) {
    const activity = sortedActivities[i];
    const activityLevel = activity.requirements?.skills?.[skillName] || 0;
    const rawXP = activity.rewards.experience[skillName];
    const nextActivity = sortedActivities[i + 1];
    const nextActivityLevel = nextActivity?.requirements?.skills?.[skillName] || targetLevel;

    // Use this activity until we can do the next one (or reach target level)
    let levelStart = Math.max(currentLevel, activityLevel);
    let levelEnd = Math.min(nextActivityLevel, targetLevel);

    // Calculate XP needed and actions for this level range
    let xpNeeded = 0;
    let actionsNeeded = 0;
    let totalScaledXP = 0;

    for (let level = levelStart; level < levelEnd; level++) {
      const xpForThisLevel = XP_PER_LEVEL;
      xpNeeded += xpForThisLevel;

      // Calculate scaled XP at this level
      const scaledXP = calculateScaledXP(rawXP, level, activityLevel);
      const actionsForLevel = Math.ceil(xpForThisLevel / scaledXP);

      actionsNeeded += actionsForLevel;
      totalScaledXP += (actionsForLevel * scaledXP);
    }

    if (levelStart < levelEnd) {
      const avgScaledXP = totalScaledXP / actionsNeeded;
      const timeSeconds = actionsNeeded * activity.duration;

      steps.push({
        activityName: activity.name,
        activityLevel,
        startLevel: levelStart,
        endLevel: levelEnd,
        rawXPPerAction: rawXP,
        scaledXPPerAction: avgScaledXP,
        xpNeeded,
        actionsNeeded,
        timePerAction: activity.duration,
        totalTimeMinutes: timeSeconds / 60,
        totalTimeHours: timeSeconds / 3600
      });

      totalActions += actionsNeeded;
      totalTimeSeconds += timeSeconds;
    }

    currentLevel = levelEnd;

    if (currentLevel >= targetLevel) {
      break;
    }
  }

  return {
    skillName,
    steps,
    totalActions,
    totalTimeHours: totalTimeSeconds / 3600
  };
}

/**
 * Display progression table
 */
function displayProgression(progression: SkillProgression, showDetailed: boolean = false): void {
  console.log(`\n========================================`);
  console.log(`PROGRESSION ANALYSIS: ${progression.skillName.toUpperCase()}`);
  console.log(`========================================\n`);

  console.log('Level Range | Activity              | Req Lvl | Raw XP | Avg Scaled XP | Actions | Time (hrs)');
  console.log('------------|----------------------|---------|--------|---------------|---------|------------');

  progression.steps.forEach(step => {
    const levelRange = `${step.startLevel.toString().padStart(2)}-${step.endLevel.toString().padStart(2)}`;
    const activityName = step.activityName.padEnd(20);
    const reqLevel = step.activityLevel.toString().padStart(7);
    const rawXP = step.rawXPPerAction.toString().padStart(6);
    const scaledXP = step.scaledXPPerAction.toFixed(1).padStart(13);
    const actions = step.actionsNeeded.toLocaleString().padStart(7);
    const hours = step.totalTimeHours.toFixed(2).padStart(10);

    console.log(`${levelRange}      | ${activityName} | ${reqLevel} | ${rawXP} | ${scaledXP} | ${actions} | ${hours}`);
  });

  console.log('------------|----------------------|---------|--------|---------------|---------|------------');
  console.log(`TOTAL: ${progression.totalActions.toLocaleString()} actions, ${progression.totalTimeHours.toFixed(2)} hours\n`);

  // Milestones
  console.log('\nMILESTONES:');
  let cumulativeActions = 0;
  let cumulativeHours = 0;

  const milestones = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99];
  milestones.forEach(milestone => {
    let actionsToMilestone = 0;
    let hoursToMilestone = 0;

    for (const step of progression.steps) {
      if (step.endLevel <= milestone) {
        // Full step
        actionsToMilestone += step.actionsNeeded;
        hoursToMilestone += step.totalTimeHours;
      } else if (step.startLevel < milestone && step.endLevel > milestone) {
        // Partial step
        const levelsInStep = step.endLevel - step.startLevel;
        const levelsToMilestone = milestone - step.startLevel;
        const fraction = levelsToMilestone / levelsInStep;
        actionsToMilestone += Math.ceil(step.actionsNeeded * fraction);
        hoursToMilestone += step.totalTimeHours * fraction;
      }
    }

    if (actionsToMilestone > 0) {
      console.log(`  Level ${milestone.toString().padStart(2)}: ${actionsToMilestone.toLocaleString().padStart(7)} actions (${hoursToMilestone.toFixed(2).padStart(7)} hours)`);
    }
  });

  // Show detailed level-by-level breakdown if requested
  if (showDetailed) {
    console.log('\n========================================');
    console.log('DETAILED LEVEL-BY-LEVEL BREAKDOWN');
    console.log('========================================\n');

    for (const step of progression.steps) {
      console.log(`\nActivity: ${step.activityName} (Req Level: ${step.activityLevel}, Raw XP: ${step.rawXPPerAction})`);
      console.log('Level | Scaled XP | Actions Needed | Cumulative Actions | Time (mins)');
      console.log('------|-----------|----------------|--------------------|-----------');

      let cumulative = 0;
      for (let level = step.startLevel; level < step.endLevel; level++) {
        const scaledXP = calculateScaledXP(step.rawXPPerAction, level, step.activityLevel);
        const actions = Math.ceil(XP_PER_LEVEL / scaledXP);
        cumulative += actions;
        const timeMinutes = (actions * step.timePerAction) / 60;

        console.log(
          `${level.toString().padStart(5)} | ` +
          `${scaledXP.toString().padStart(9)} | ` +
          `${actions.toLocaleString().padStart(14)} | ` +
          `${cumulative.toLocaleString().padStart(18)} | ` +
          `${timeMinutes.toFixed(2).padStart(10)}`
        );

        // Show every 5 levels for large ranges
        if (step.endLevel - step.startLevel > 20 && (level + 1) % 5 !== 0 && level !== step.endLevel - 1) {
          continue;
        }
      }
    }
  }
}

/**
 * Calculate progression for multiple skills (gathering, crafting, and combat)
 */
function calculateMultipleSkills(skills: string[], targetLevel: number = 99, showDetailed: boolean = false): void {
  console.log(`\n========================================`);
  console.log(`SKILL PROGRESSION CALCULATOR`);
  console.log(`Target Level: ${targetLevel}`);
  console.log(`========================================`);

  const craftingSkills = ['cooking', 'smithing', 'alchemy'];
  const gatheringSkills = ['fishing', 'woodcutting', 'mining', 'gathering'];
  const combatSkills = ['oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'];

  const progressions = skills.map(skill => {
    if (craftingSkills.includes(skill)) {
      return calculateCraftingProgression(skill, targetLevel);
    } else if (gatheringSkills.includes(skill)) {
      return calculateSkillProgression(skill, targetLevel);
    } else if (combatSkills.includes(skill)) {
      return calculateCombatProgression(skill, targetLevel);
    } else {
      console.error(`Unknown skill: ${skill}`);
      return null;
    }
  }).filter(p => p !== null) as SkillProgression[];

  progressions.forEach(progression => {
    displayProgression(progression, showDetailed);
  });

  // Summary comparison
  if (progressions.length > 1) {
    console.log('\n========================================');
    console.log('SKILL COMPARISON SUMMARY');
    console.log('========================================\n');
    console.log('Skill         | Total Actions | Total Hours | Avg Actions/Level');
    console.log('--------------|---------------|-------------|-------------------');

    progressions.forEach(prog => {
      const skill = prog.skillName.padEnd(12);
      const actions = prog.totalActions.toLocaleString().padStart(13);
      const hours = prog.totalTimeHours.toFixed(2).padStart(11);
      const avgPerLevel = (prog.totalActions / (prog.steps[prog.steps.length - 1]?.endLevel || 1)).toFixed(0).padStart(17);
      console.log(`${skill} | ${actions} | ${hours} | ${avgPerLevel}`);
    });
  }
}

// Run the calculator
// Gathering skills: fishing, woodcutting, mining, gathering
// Crafting skills: cooking, smithing, alchemy
// Combat skills: oneHanded, dualWield, twoHanded, ranged, casting, gun (all have same progression)
const skillsToAnalyze = [
  'fishing', 'woodcutting', 'mining', 'gathering',
  'cooking', 'smithing', 'alchemy',
  'oneHanded' // Represents all combat skills (they all share the same monster XP progression)
];
const targetLevel = 99;
const showDetailed = false; // Set to true for level-by-level breakdown (warning: very verbose for multiple skills)

calculateMultipleSkills(skillsToAnalyze, targetLevel, showDetailed);
