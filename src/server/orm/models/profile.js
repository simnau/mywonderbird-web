const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.STRING,
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
  acceptedNewsletter: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  acceptedTermsAt: {
    type: Sequelize.DATE,
    defaultValue: null,
  },
  providerId: {
    type: Sequelize.STRING,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: true,
  },
};

const Profile = sequelize.define('profiles', FIELDS);

module.exports = {
  Profile,
  FIELDS,
};
