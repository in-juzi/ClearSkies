/**
 * Activity XP Update Tool
 *
 * Automatically updates XP values in activity files based on tier recommendations
 */

import * as fs from 'fs';
import * as path from 'path';

// XP tier recommendations
// NOTE: Combat activities are excluded - their XP comes from Monster definitions
const XP_RECOMMENDATIONS: Record<string, number> = {
  // T1 (Levels 1-10) - 20 XP
  'activity-chop-oak': 20,
  // Combat activities removed - XP now comes from Monster.experience
  'activity-fish-cod': 20,
  'activity-fish-shrimp': 20,
  'activity-mine-copper': 20,
  'activity-mine-tin': 20,
  'activity-gather-sage': 20,
  'activity-fish-salmon': 20,
  'activity-gather-nettle': 20,
  'activity-mine-iron': 20,
  'activity-gather-mandrake': 20,

  // T2 (Levels 11-20) - 50 XP
  'activity-gather-moonpetal': 50,
  'activity-gather-dragons-breath': 50,
};

function getActivityFileName(activityId: string): string {
  // Convert kebab-case to PascalCase
  // Note: Some activityIds already start with "activity-" or "combat-"
  const parts = activityId.split('-');
  const pascalCase = parts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

  // If it already starts with Activity or Combat, use as-is
  if (pascalCase.startsWith('Activity') || pascalCase.startsWith('Combat')) {
    return pascalCase;
  }

  // Otherwise prepend Activity
  return 'Activity' + pascalCase;
}

function updateActivityFile(activityId: string, newXP: number): boolean {
  const fileName = getActivityFileName(activityId);
  const filePath = path.join(__dirname, '../data/locations/activities', `${fileName}.ts`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Pattern 1: Match experience object with any skill name (handles quoted keys)
    // Example: "experience": { "woodcutting": 30 } or experience: { woodcutting: 30 }
    const experiencePattern = /"?experience"?\s*:\s*\{\s*"?(\w+)"?\s*:\s*\d+\s*\}/;
    const match = content.match(experiencePattern);

    if (match) {
      const skillName = match[1];
      // Match with optional quotes around keys
      const oldPattern = new RegExp(`"?experience"?\\s*:\\s*\\{\\s*"?${skillName}"?\\s*:\\s*\\d+\\s*\\}`, 'g');
      const newValue = `"experience": {\n      "${skillName}": ${newXP}\n    }`;
      content = content.replace(oldPattern, newValue);

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Updated ${activityId}: ${fileName}.ts → ${newXP} XP`);
      return true;
    }

    // NOTE: Combat activities are no longer supported - XP comes from Monster definitions
    // If we reach here, the file doesn't match gathering activity pattern

    console.warn(`⚠️  Could not find experience pattern in ${activityId}: ${fileName}.ts`);
    return false;

  } catch (error) {
    console.error(`❌ Error updating ${activityId}:`, error);
    return false;
  }
}

console.log('=== ACTIVITY XP UPDATE TOOL ===\n');
console.log(`Updating ${Object.keys(XP_RECOMMENDATIONS).length} activities...\n`);

let successCount = 0;
let failCount = 0;

for (const [activityId, newXP] of Object.entries(XP_RECOMMENDATIONS)) {
  const success = updateActivityFile(activityId, newXP);
  if (success) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`✅ Successfully updated: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`\n💡 Run 'npm run survey:activity-xp' to verify changes`);
