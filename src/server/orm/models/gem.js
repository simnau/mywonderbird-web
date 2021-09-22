const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { GemCapture } = require('./gem-capture');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  countryCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lat: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  lng: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'any',
    allowNull: false,
  },
  sequenceNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  dayId: {
    type: Sequelize.UUID,
    allowNull: true,
    references: {
      model: 'days',
      key: 'id',
    },
  },
  journeyId: {
    type: Sequelize.UUID,
    allowNull: true,
    references: {
      model: 'journeys',
      key: 'id',
    },
  },
};

const Gem = sequelize.define('gems', FIELDS);

Gem.hasMany(GemCapture, {
  foreignKey: 'gemId',
  as: 'gemCaptures',
  onDelete: 'CASCADE',
});
GemCapture.belongsTo(Gem, {
  onDelete: 'CASCADE',
});

module.exports = {
  Gem,
  FIELDS,
};
