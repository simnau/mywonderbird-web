const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { Day } = require('./day');
const { JourneyComment } = require('./journey-comment');

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
    defaultValue: false,
    nullable: false,
  },
};

const Journey = sequelize.define('journeys', FIELDS);

Journey.hasMany(Day, {
  foreignKey: 'journeyId',
  as: 'days',
  onDelete: 'CASCADE',
});
Journey.hasMany(JourneyComment, {
  foreignKey: 'journeyId',
  as: 'comments',
  onDelete: 'CASCADE',
});
JourneyComment.belongsTo(Journey, {
  onDelete: 'CASCADE',
});
Day.belongsTo(Journey, {
  onDelete: 'CASCADE',
});

module.exports = {
  Journey,
  FIELDS,
};
