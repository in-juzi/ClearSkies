const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Default equipment slots
  const defaultSlots = new Map([
    ['head', null],
    ['body', null],
    ['mainHand', null],
    ['offHand', null],
    ['belt', null],
    ['gloves', null],
    ['boots', null],
    ['necklace', null],
    ['ringRight', null],
    ['ringLeft', null]
  ]);

  // Find all players without equipmentSlots
  const playersToUpdate = await Player.find({
    $or: [
      { equipmentSlots: { $exists: false } },
      { equipmentSlots: null }
    ]
  });

  console.log(`Found ${playersToUpdate.length} players to update with equipment slots`);

  // Update each player
  for (const player of playersToUpdate) {
    player.equipmentSlots = defaultSlots;
    await player.save();
  }

  return {
    modified: playersToUpdate.length,
    message: `Added equipment slots to ${playersToUpdate.length} players`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Find all players with equipmentSlots
  const playersToUpdate = await Player.find({
    equipmentSlots: { $exists: true }
  });

  console.log(`Found ${playersToUpdate.length} players to rollback`);

  // Remove equipmentSlots from each player
  for (const player of playersToUpdate) {
    player.equipmentSlots = undefined;
    await player.save();
  }

  return {
    modified: playersToUpdate.length,
    message: `Removed equipment slots from ${playersToUpdate.length} players`
  };
}

module.exports = {
  up,
  down,
  name: '004-add-equipment-slots',
  description: 'Adds equipment slot system to all existing players with default 10 slots'
};
