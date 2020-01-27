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
  },
  stepText: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

const TutorialSteps = sequelize.define('tutorialSteps', FIELDS);

module.exports = {
  TutorialSteps,
  FIELDS,
};
