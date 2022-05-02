const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sharedPhotos: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const UserStatistic = sequelize.define('userStatistics', FIELDS);

module.exports = {
  UserStatistic,
  FIELDS,
};
