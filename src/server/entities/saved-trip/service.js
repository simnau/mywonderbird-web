const { SavedTrip } = require('../../orm/models/saved-trip');
const { SavedTripLocation } = require('../../orm/models/saved-trip-location');
const geoService = require('../geo/service');
const placeService = require('../place/service');
const { indexBy, flatMap } = require('../../util/array');

const INCLUDE_MODELS = [
  {
    model: SavedTripLocation,
    as: 'savedTripLocations',
  },
];

const INCLUDE_ORDER = [
  [
    { model: SavedTripLocation, as: 'savedTripLocations' },
    'sequenceNumber',
    'ASC',
  ],
];

async function findAllByUser(userId) {
  return SavedTrip.findAll({
    where: {
      userId,
    },
    include: INCLUDE_MODELS,
    order: INCLUDE_ORDER,
  });
}

async function create(trip, userId) {
  return SavedTrip.create(
    {
      ...trip,
      userId,
    },
    {
      include: INCLUDE_MODELS,
    },
  );
}

async function findById(id, { includeModels = false } = {}) {
  if (includeModels) {
    return SavedTrip.findByPk(id, {
      include: INCLUDE_MODELS,
      order: INCLUDE_ORDER,
    });
  }

  return SavedTrip.findByPk(id);
}

async function destroy(id) {
  return SavedTrip.destroy({
    where: {
      id,
    },
  });
}

async function update(id, updateData) {
  return SavedTrip.update(updateData, { where: { id } });
}

async function toTripDTO(savedTrip) {
  const tripLocationDTOs = await toTripLocationDTOs(
    savedTrip.savedTripLocations,
  );
  const images = flatMap(tripLocationDTOs, tripLocation => tripLocation.images);
  const imageUrl = images.length ? images[0] : null;

  return {
    id: savedTrip.id,
    title: savedTrip.title,
    startDate: savedTrip.startedAt,
    finishDate: savedTrip.finishedAt,
    imageUrl,
    country: geoService.getLabelBy3LetterCountryCode(savedTrip.countryCode),
    images,
    locations: tripLocationDTOs,
  };
}

async function toTripLocationDTOs(savedTripLocations) {
  if (!savedTripLocations.length) {
    return [];
  }

  const placeIds = savedTripLocations.map(
    savedTripLocation => savedTripLocation.placeId,
  );
  const places = await placeService.findByIds(placeIds);
  const placeMap = indexBy(places, 'id');

  return savedTripLocations.map(savedTripLocation => {
    const place = placeMap[savedTripLocation.placeId];
    const images = place.placeImages.map(placeImage => placeImage.url);

    return {
      id: savedTripLocation.id,
      name: place.title,
      countryCode: place.countryCode,
      country: geoService.getLabelBy3LetterCountryCode(place.countryCode),
      images,
      imageUrl: images.length ? images[0] : null,
      skipped: savedTripLocation.skipped,
      visitedAt: savedTripLocation.visitedAt,
      location: {
        lat: place.lat,
        lng: place.lng,
      },
    };
  });
}

async function findLocationById(locationid) {
  return SavedTripLocation.findByPk(locationid, {
    include: [
      {
        model: SavedTrip,
      },
    ],
  });
}

async function markLocationSkipped(locationId) {
  return SavedTripLocation.update(
    {
      skipped: true,
    },
    {
      where: {
        id: locationId,
      },
    },
  );
}

async function markLocationVisited(locationId) {
  return SavedTripLocation.update(
    {
      visitedAt: new Date(),
    },
    {
      where: {
        id: locationId,
      },
    },
  );
}

async function endTrip(id) {
  return SavedTrip.update(
    {
      finishedAt: new Date(),
    },
    {
      where: { id },
    },
  );
}

module.exports = {
  findAllByUser,
  create,
  findById,
  destroy,
  update,
  toTripDTO,
  findLocationById,
  markLocationSkipped,
  markLocationVisited,
  endTrip,
};
