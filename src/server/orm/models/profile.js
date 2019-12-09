const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bio: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  avatarUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};

const Profile = sequelize.define('profiles', FIELDS);

module.exports = {
  Profile,
  FIELDS,
};
