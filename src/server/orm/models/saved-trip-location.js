const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  skipped: {
    type: Sequelize.BOOLEAN,
  },
  sequenceNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  savedTripId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'savedTrips',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  placeId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'places',
      key: 'id',
    },
  },
  visitedAt: {
    type: Sequelize.DATE,
  },
};

const SavedTripLocation = sequelize.define('savedTripLocations', FIELDS);

module.exports = {
  SavedTripLocation,
  FIELDS,
};