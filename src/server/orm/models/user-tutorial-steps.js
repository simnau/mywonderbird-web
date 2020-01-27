const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.STRING,
    defaultValue: Sequelize.UUIDV4,
  },
  stepName: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      model: 'tutorialSteps',
      key: 'stepName',
    },
    onDelete: 'CASCADE',
  },
  passed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

const UserTutorialSteps = sequelize.define('userTutorialSteps', FIELDS);

module.exports = {
  UserTutorialSteps,
  FIELDS,
};
