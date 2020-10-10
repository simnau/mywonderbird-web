const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { SavedTripLocation } = require('./saved-trip-location');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  countryCode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startedAt: {
    type: Sequelize.DATE,
  },
  finishedAt: {
    type: Sequelize.DATE,
  },
};

const SavedTrip = sequelize.define('savedTrips', FIELDS);

SavedTrip.hasMany(SavedTripLocation, {
  foreignKey: 'savedTripId',
  as: 'savedTripLocations',
  onDelete: 'CASCADE',
});
SavedTripLocation.belongsTo(SavedTrip, {
  onDelete: 'CASCADE',
});

module.exports = {
  SavedTrip,
  FIELDS,
};
