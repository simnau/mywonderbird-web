const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const BOOKMARK_TYPE_GEM_CAPTURE = 10;

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

const Bookmark = sequelize.define('bookmarks', FIELDS, {
  scopes: {
    gemCapture: {
      where: {
        type: BOOKMARK_TYPE_GEM_CAPTURE,
      },
    },
  },
});

module.exports = {
  Bookmark,
  FIELDS,
  BOOKMARK_TYPE_GEM_CAPTURE,
};
