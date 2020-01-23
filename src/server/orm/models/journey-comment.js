const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
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

const JourneyComment = sequelize.define('journeyComments', FIELDS, {
  charset: 'utf8mb4',
});

module.exports = {
  JourneyComment,
  FIELDS,
};
