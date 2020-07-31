const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const LIKE_TYPE_GEM_CAPTURE = 10;

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  entityId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const Like = sequelize.define('likes', FIELDS, {
  scopes: {
    gemCapture: {
      where: {
        type: LIKE_TYPE_GEM_CAPTURE,
      },
    },
  },
});

module.exports = {
  Like,
  FIELDS,
  LIKE_TYPE_GEM_CAPTURE,
};
