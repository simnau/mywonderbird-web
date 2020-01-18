const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { Day } = require('./day');

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
  type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  creatorId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  published: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  draft: {
    type: Sequelize.BOOLEAN,
  },
};

const Journey = sequelize.define('journeys', FIELDS);

Journey.hasMany(Day, {
  foreignKey: 'journeyId',
  as: 'days',
  onDelete: 'CASCADE',
});
Day.belongsTo(Journey, {
  onDelete: 'CASCADE',
});

module.exports = {
  Journey,
  FIELDS,
};
