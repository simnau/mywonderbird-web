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
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'places',
      key: 'id',
    },
    onDelete: 'CASCADE',
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

Tag.hasOne(PlaceTag, {
  foreignKey: 'tagId',
  as: 'tag',
});

module.exports = {
  PlaceTag,
  FIELDS,
};
