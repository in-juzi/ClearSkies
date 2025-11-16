const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    { storageContainers: { $exists: false } },
    {
      $set: {
        storageContainers: [
          {
            containerId: 'bank',
            containerType: 'bank',
            name: 'Bank',
            capacity: 200,
            items: []
          }
        ]
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added storage containers (bank with 200 slots) to ${result.modifiedCount} players`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    {},
    {
      $unset: {
        storageContainers: ''
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed storage containers from ${result.modifiedCount} players`
  };
}

module.exports = {
  up,
  down,
  name: '016-add-storage-containers',
  description: 'Adds storage containers system to Player model with default bank container (200 slot capacity)'
};
