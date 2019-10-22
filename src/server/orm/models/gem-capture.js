const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

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
  url: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  sequenceNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  gemId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'gems',
      key: 'id',
    },
  },
};

const GemCapture = sequelize.define('gemCaptures', FIELDS);

module.exports = {
  GemCapture,
  FIELDS,
};
