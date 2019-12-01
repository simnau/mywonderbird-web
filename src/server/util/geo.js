const { getBoundingBox } = require('geolocation-utils');

function findCoordinateBoundingBox(coordinates) {
  return getBoundingBox(coordinates);
}

module.exports = {
  findCoordinateBoundingBox,
};
