const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  journeyId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'journeys',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

const FavoriteJourney = sequelize.define('favoriteJourneys', FIELDS);

module.exports = {
  FavoriteJourney,
  FIELDS,
};
