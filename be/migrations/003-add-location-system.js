const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    {
      $or: [
        { currentLocation: { $exists: false } },
        { discoveredLocations: { $exists: false } },
        { activeActivity: { $exists: false } },
        { travelState: { $exists: false } }
      ]
    },
    {
      $set: {
        currentLocation: 'kennik',
        discoveredLocations: ['kennik'],
        activeActivity: {
          activityId: null,
          facilityId: null,
          locationId: null,
          startTime: null,
          endTime: null
        },
        travelState: {
          isTravel: false,
          targetLocationId: null,
          startTime: null,
          endTime: null
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added location system fields to ${result.modifiedCount} players`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    {},
    {
      $unset: {
        currentLocation: '',
        discoveredLocations: '',
        activeActivity: '',
        travelState: ''
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed location system fields from ${result.modifiedCount} players`
  };
}

module.exports = {
  up,
  down,
  name: '003-add-location-system',
  description: 'Adds location system fields (currentLocation, discoveredLocations, activeActivity, travelState) to Player model'
};
