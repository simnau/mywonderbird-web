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
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
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
  sequenceNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dayId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'days',
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
