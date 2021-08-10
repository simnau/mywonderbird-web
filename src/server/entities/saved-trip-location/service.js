const { SavedTripLocation } = require('../../orm/models/saved-trip-location');
const sequelize = require('../../setup/sequelize');

async function overrideSavedTripLocations(
  savedTripId,
  savedLocations,
  { transaction },
) {
  const tx = transaction || (await sequelize.transaction());

  const locations = savedLocations.map((savedLocation, index) => ({
    ...savedLocation,
    savedTripId,
    sequenceNumber: index,
  }));

  await SavedTripLocation.destroy({ where: { savedTripId }, transaction: tx });
  await SavedTripLocation.bulkCreate(locations, { transaction: tx });
}

module.exports = {
  overrideSavedTripLocations,
};
