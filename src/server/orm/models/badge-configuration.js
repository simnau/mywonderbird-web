const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const CONTENT_CREATOR_TYPE = 'content-creator';

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  achievedDescription: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const BadgeConfiguration = sequelize.define('badgeConfigurations', FIELDS);

module.exports = {
  BadgeConfiguration,
  FIELDS,
  CONTENT_CREATOR_TYPE,
};
