const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

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
  url: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  imagePath: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
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
  gemCaptureId: {
    type: Sequelize.UUID,
    allowNull: true,
  },
};

const PlaceImage = sequelize.define('placeImages', FIELDS);

module.exports = {
  PlaceImage,
  FIELDS,
};
