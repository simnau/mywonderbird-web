const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { Gem } = require('./gem');
const { Nest } = require('./nest');

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
  dayNumber: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  journeyId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'journeys',
      key: 'id',
    },
  },
};

const Day = sequelize.define('days', FIELDS);

Day.hasMany(Gem, {
  foreignKey: 'dayId',
  as: 'gems',
  onDelete: 'CASCADE',
  allowNull: true,
});
Gem.belongsTo(Day, {
  onDelete: 'CASCADE',
});

Day.hasOne(Nest, {
  foreignKey: 'dayId',
  as: 'nest',
  onDelete: 'CASCADE',
});
Nest.belongsTo(Day, {
  onDelete: 'CASCADE',
});

module.exports = {
  Day,
  FIELDS,
};
