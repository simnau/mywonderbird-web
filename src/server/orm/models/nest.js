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
  platform: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  idOnPlatform: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  dayId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'days',
      key: 'id',
    },
  },
  url: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
};

const Nest = sequelize.define('nests', FIELDS);

module.exports = {
  Nest,
  FIELDS,
};
