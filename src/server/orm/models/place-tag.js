const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { Tag } = require('./tag');

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  placeId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tagId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
};

const PlaceTag = sequelize.define('placeTags', FIELDS);

PlaceTag.hasOne(Tag, {
  foreignKey: 'tagId',
  as: 'tag'
});

module.exports = {
  PlaceTag,
  FIELDS,
};
