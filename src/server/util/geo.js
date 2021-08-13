const geohash = require('ngeohash');
const { getBoundingBox, distanceTo } = require('geolocation-utils');
const config = require('config');
const tspsolver = require('node-tspsolver');

const GEOHASH_PRECISION = config.get('location.geohash.precision');

function findCoordinateBoundingBox(coordinates) {
  return getBoundingBox(coordinates);
}

function getGeohash(lat, lng) {
  return geohash.encode(lat, lng, GEOHASH_PRECISION);
}

async function findLocationOrder(locations) {
  const distancesMatrix = createDistancesMatrix(locations);

  const result = await tspsolver.solveTsp(distancesMatrix, false, {});

  return result;
}

function createDistancesMatrix(locations) {
  const distancesMatrix = [];

  for (let i = 0; i < locations.length; i++) {
    distancesMatrix[i] = distancesMatrix[i] || [];
    distancesMatrix[i][i] = 0;
    const point1 = locationToPoint(locations[i]);

    for (let j = i + 1; j < locations.length; j++) {
      const point2 = locationToPoint(locations[j]);
      const distance = distanceTo(point1, point2);
      distancesMatrix[i][j] = distance;
      distancesMatrix[j] = distancesMatrix[j] || [];
      distancesMatrix[j][i] = distance;
    }
  }

  return distancesMatrix;
}

function locationToPoint(location) {
  return {
    lat: location.lat,
    lng: location.lng,
  };
}

function sortLocationsByDistanceToPoint(locations, point) {
  const locationsCopy = [...locations];

  return locationsCopy.sort((prev, curr) => {
    const distanceToPointPrev = distanceTo(prev, point);
    const distanceToPointCurr = distanceTo(curr, point);

    return distanceToPointPrev - distanceToPointCurr;
  });
}

module.exports = {
  findCoordinateBoundingBox,
  getGeohash,
  findLocationOrder,
  sortLocationsByDistanceToPoint,
};
