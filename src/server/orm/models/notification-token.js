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
  deviceToken: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
  },
};

const NotificationToken = sequelize.define('notificationTokens', FIELDS);

module.exports = {
  NotificationToken,
  FIELDS,
};
