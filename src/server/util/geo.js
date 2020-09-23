const geohash = require('ngeohash');
const { getBoundingBox } = require('geolocation-utils');
const config = require('config');

const GEOHASH_PRECISION = config.get('location.geohash.precision');

function findCoordinateBoundingBox(coordinates) {
  return getBoundingBox(coordinates);
}

function getGeohash(lat, lng) {
  return geohash.encode(lat, lng, GEOHASH_PRECISION);
}

module.exports = {
  findCoordinateBoundingBox,
  getGeohash,
};
