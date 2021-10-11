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

function rearrangeToStartFromPlace(locations, startingPlaceId) {
  if (!locations) {
    return [];
  }

  if (locations.length <= 1) {
    return locations;
  }

  const locationIndex = locations.findIndex(
    location => location.id === startingPlaceId,
  );

  const locationsWithoutStartingPoint = [
    ...locations.slice(0, locationIndex),
    ...locations.slice(locationIndex + 1),
  ];

  const startingLocation = locations[locationIndex];

  const {
    location: furthestLocation,
    index: furtherLocationIndex,
  } = locationsWithoutStartingPoint.reduce((currentMax, element, index) => {
    if (!currentMax) {
      return { location: element, index };
    }

    const distanceFromCurrentMax = distanceTo(
      currentMax.location,
      startingLocation,
    );
    const distanceFromCurrentElement = distanceTo(element, startingLocation);

    return distanceFromCurrentMax >= distanceFromCurrentElement
      ? currentMax
      : { location: element, index };
  }, null);

  return [
    startingLocation,
    ...locationsWithoutStartingPoint.slice(0, furtherLocationIndex),
    ...locationsWithoutStartingPoint.slice(furtherLocationIndex + 1),
    furthestLocation,
  ];
}

function toLatLngString(latLng) {
  if (!latLng) {
    return null;
  }

  return `${latLng.lat},${latLng.lng}`;
}

module.exports = {
  findCoordinateBoundingBox,
  getGeohash,
  findLocationOrder,
  sortLocationsByDistanceToPoint,
  rearrangeToStartFromPlace,
  toLatLngString,
};
