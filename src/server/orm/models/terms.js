const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const {
  TERMS_OF_SERVICE_TYPE,
  PRIVACY_POLICY_TYPE,
} = require('../../constants/terms');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  type: {
    type: Sequelize.ENUM(PRIVACY_POLICY_TYPE, TERMS_OF_SERVICE_TYPE),
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};


const Terms = sequelize.define('terms', FIELDS);

module.exports = {
  Terms,
  FIELDS,
};
