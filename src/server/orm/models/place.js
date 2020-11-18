const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');
const { PlaceImage } = require('./place-image');
const { PlaceTag } = require('./place-tag');

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
  countryCode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lat: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  lng: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  geohash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  source: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};

const Place = sequelize.define('places', FIELDS);

Place.hasMany(PlaceImage, {
  foreignKey: 'placeId',
  as: 'placeImages',
  onDelete: 'CASCADE',
});
Place.hasMany(PlaceTag, {
  foreignKey: 'placeId',
  as: 'placeTags',
  onDelete: 'CASCADE',
});
PlaceImage.belongsTo(Place, {
  onDelete: 'CASCADE',
});
PlaceTag.belongsTo(Place, {
  onDelete: 'CASCADE',
});

module.exports = {
  Place,
  FIELDS,
};
