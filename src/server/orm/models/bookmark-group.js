const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { Bookmark, BOOKMARK_TYPE_GEM_CAPTURE } = require('./bookmark');

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
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const BookmarkGroup = sequelize.define('bookmarkGroups', FIELDS, {
  scopes: {
    gemCapture: {
      where: {
        type: BOOKMARK_TYPE_GEM_CAPTURE,
      },
    },
  },
});

BookmarkGroup.hasMany(Bookmark, {
  foreignKey: 'bookmarkGroupId',
  as: 'bookmarks',
  onDelete: 'CASCADE',
});

module.exports = {
  BookmarkGroup,
  FIELDS,
  BOOKMARK_TYPE_GEM_CAPTURE,
};
