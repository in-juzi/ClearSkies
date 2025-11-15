/**
 * Migration: Recalculate HP and MP from Attributes
 *
 * Updates all existing players' current HP and MP values to match the new
 * attribute-based formulas:
 * - maxHP = 10 + (STR × 3) + (END × 2) + (WILL × 1)
 * - maxMP = 10 + (WIS × 6) + (WILL × 3)
 *
 * This ensures existing characters use the dynamic scaling system instead of
 * the old hardcoded 100 HP/MP defaults.
 */

const mongoose = require('mongoose');
const ATTRIBUTE_SCALING = {
  HP_BASE: 10,
  HP_STRENGTH_MULTIPLIER: 3,
  HP_ENDURANCE_MULTIPLIER: 2,
  HP_WILL_MULTIPLIER: 1,

  MP_BASE: 10,
  MP_WISDOM_MULTIPLIER: 6,
  MP_WILL_MULTIPLIER: 3,
};

async function up() {
  const db = mongoose.connection.db;
  const playersCollection = db.collection('players');

  console.log('Starting HP/MP recalculation migration...');

  const players = await playersCollection.find({}).toArray();
  console.log(`Found ${players.length} players to update`);

  let updated = 0;
  let skipped = 0;

  for (const player of players) {
    // Get attribute levels (default to 1 if not present)
    const strength = player.attributes?.strength?.level || 1;
    const endurance = player.attributes?.endurance?.level || 1;
    const will = player.attributes?.will?.level || 1;
    const wisdom = player.attributes?.wisdom?.level || 1;

    // Calculate new max HP and MP using the formula
    const newMaxHP = ATTRIBUTE_SCALING.HP_BASE +
      (strength * ATTRIBUTE_SCALING.HP_STRENGTH_MULTIPLIER) +
      (endurance * ATTRIBUTE_SCALING.HP_ENDURANCE_MULTIPLIER) +
      (will * ATTRIBUTE_SCALING.HP_WILL_MULTIPLIER);

    const newMaxMP = ATTRIBUTE_SCALING.MP_BASE +
      (wisdom * ATTRIBUTE_SCALING.MP_WISDOM_MULTIPLIER) +
      (will * ATTRIBUTE_SCALING.MP_WILL_MULTIPLIER);

    // Get current HP/MP (use defaults if not present)
    const currentHP = player.stats?.health?.current || 100;
    const currentMP = player.stats?.mana?.current || 100;

    // Check if this player has already been migrated
    // If current HP/MP are already close to the calculated max, skip
    if (currentHP === newMaxHP && currentMP === newMaxMP) {
      console.log(`Player ${player._id}: Already migrated, skipping`);
      skipped++;
      continue;
    }

    // For idempotency: Only calculate percentage if values look like old defaults
    // If current HP is close to 100 or very different from new max, use percentage
    // Otherwise, just set to full health (safest option for re-runs)
    let updatedHP, updatedMP;

    if (currentHP >= 80 && currentHP <= 100) {
      // Looks like old system, preserve percentage
      const hpPercentage = currentHP / 100;
      updatedHP = Math.round(newMaxHP * hpPercentage);
    } else {
      // Already partially migrated or unusual value, set to full
      updatedHP = newMaxHP;
    }

    if (currentMP >= 80 && currentMP <= 100) {
      // Looks like old system, preserve percentage
      const mpPercentage = currentMP / 100;
      updatedMP = Math.round(newMaxMP * mpPercentage);
    } else {
      // Already partially migrated or unusual value, set to full
      updatedMP = newMaxMP;
    }

    console.log(`Player ${player._id}:`);
    console.log(`  Attributes: STR=${strength}, END=${endurance}, WILL=${will}, WIS=${wisdom}`);
    console.log(`  Old HP/MP: ${currentHP}, ${currentMP}`);
    console.log(`  New HP/MP: ${updatedHP}/${newMaxHP}, ${updatedMP}/${newMaxMP}`);

    // Update the player document
    await playersCollection.updateOne(
      { _id: player._id },
      {
        $set: {
          'stats.health.current': updatedHP,
          'stats.mana.current': updatedMP
        }
      }
    );

    updated++;
  }

  console.log(`Migration complete: ${updated} players updated, ${skipped} skipped`);

  return {
    message: `Updated ${updated} players, skipped ${skipped}`
  };
}

async function down() {
  const db = mongoose.connection.db;
  const playersCollection = db.collection('players');

  console.log('Rolling back HP/MP recalculation migration...');

  // Reset all players to default 100 HP/MP
  const result = await playersCollection.updateMany(
    {},
    {
      $set: {
        'stats.health.current': 100,
        'stats.mana.current': 100
      }
    }
  );

  console.log(`Rollback complete: ${result.modifiedCount} players reset to 100 HP/MP`);

  return {
    message: `Reset ${result.modifiedCount} players to 100 HP/MP`
  };
}

module.exports = {
  name: '014-recalculate-hp-mp-from-attributes',
  description: 'Recalculate all players\' current HP and MP based on attribute-driven formulas',
  up,
  down
};
