import Geohash from 'latlon-geohash';
import { getBoundingBox } from 'geolocation-utils';
import config from 'config';

const GEOHASH_PRECISION = config.get('location.geohash.precision');

function findCoordinateBoundingBox(coordinates) {
  return getBoundingBox(coordinates);
}

function getGeohash(lat, lng) {
  return Geohash.encode(lat, lng, GEOHASH_PRECISION);
}

module.exports = {
  findCoordinateBoundingBox,
  getGeohash,
};
