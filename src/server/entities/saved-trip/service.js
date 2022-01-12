const { Op, fn, col } = require('sequelize');

const { SavedTrip } = require('../../orm/models/saved-trip');
const { SavedTripLocation } = require('../../orm/models/saved-trip-location');
const geoService = require('../geo/service');
const placeService = require('../place/service');
const savedTripLocationService = require('../saved-trip-location/service');
const suggestionService = require('../suggestion/service');
const { indexBy, flatMap } = require('../../util/array');
const sequelize = require('../../setup/sequelize');
const { rearrangeToStartFromPlace } = require('../../util/geo');
const { imagePathToImageUrl } = require('../../util/file-upload');
const { Place } = require('../../orm/models/place');

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

async function findAllFinishedByUser(userId) {
  return SavedTrip.findAll({
    where: {
      userId,
      finishedAt: {
        [Op.ne]: null,
      },
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

async function updateFullTrip(
  existingTrip,
  { id, userId, savedTripLocations, ...updateData },
) {
  const update = {
    ...existingTrip.toJSON(),
    ...updateData,
  };

  const transaction = await sequelize.transaction();

  try {
    await SavedTrip.update(update, {
      where: { id: existingTrip.id },
      include: INCLUDE_MODELS,
      transaction,
    });
    await savedTripLocationService.overrideSavedTripLocations(
      existingTrip.id,
      savedTripLocations,
      {
        transaction,
      },
    );

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

  return findById(existingTrip.id, { includeModels: true });
}

async function startTripFromLocation(existingTrip, startingLocationId) {
  const locationsByPlaceId = indexBy(
    existingTrip.savedTripLocations,
    'placeId',
  );
  const locationsToSortIds = existingTrip.savedTripLocations
    .filter(location => !location.visitedAt && !location.skipped)
    .map(location => location.placeId);

  let locations = await placeService.findByIds(locationsToSortIds);
  locations = rearrangeToStartFromPlace(locations, startingLocationId);
  locations = await suggestionService.sortLocationsByDistance(locations);

  const firstNonVisitedLocationIndex = existingTrip.savedTripLocations.findIndex(
    location => !location.visitedAt && !location.skipped,
  );

  const rearrangedLocations = [
    ...existingTrip.savedTripLocations
      .slice(0, firstNonVisitedLocationIndex)
      .map(location => location.dataValues),
    ...locations.map((location, index) => {
      return {
        ...locationsByPlaceId[location.id].dataValues,
        sequenceNumber: firstNonVisitedLocationIndex + index,
      };
    }),
  ];

  return updateFullTrip(existingTrip, {
    savedTripLocations: rearrangedLocations,
  });
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
    countryCode: savedTrip.countryCode,
    images,
    locations: tripLocationDTOs,
    createdAt: savedTrip.createdAt,
    updatedAt: savedTrip.updatedAt,
  };
}

async function toTripLocationDTOs(savedTripLocations) {
  if (!savedTripLocations.length) {
    return [];
  }

  const placeIds = savedTripLocations.map(
    savedTripLocation => savedTripLocation.placeId,
  );
  const places = await placeService.findByIds(placeIds, {
    includeDeleted: true,
  });
  const placeMap = indexBy(places, 'id');

  return savedTripLocations.map(savedTripLocation => {
    const place = placeMap[savedTripLocation.placeId];
    const images = place.placeImages.map(placeImage =>
      placeImage.imagePath
        ? imagePathToImageUrl(placeImage.imagePath)
        : placeImage.url,
    );

    return {
      id: savedTripLocation.id,
      placeId: place.id,
      name: place.title,
      countryCode: place.countryCode,
      country: geoService.getLabelBy3LetterCountryCode(place.countryCode),
      images,
      imageUrl: images.length ? images[0] : null,
      skipped: savedTripLocation.skipped,
      visitedAt: savedTripLocation.visitedAt,
      dayIndex: savedTripLocation.dayIndex,
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

async function findFinishedTripCountByUserId({ userId }) {
  return SavedTrip.count({
    where: {
      userId,
      finishedAt: {
        [Op.ne]: null,
      },
    },
  });
}

async function findPlannedTripCountByUserId({ userId }) {
  return SavedTrip.count({
    where: {
      userId,
      startedAt: null,
      finishedAt: null,
    },
  });
}

async function findFinishedTripCountryCodesByUserId({ userId }) {
  const savedTripLocations = await SavedTripLocation.findAll({
    include: [
      {
        model: SavedTrip,
        where: {
          userId,
        },
        attributes: ['userId'],
      },
    ],
  });
  const placeIds = savedTripLocations.map(({ placeId }) => placeId);

  const countryCodes = await Place.findAll({
    where: {
      id: {
        [Op.in]: placeIds,
      },
    },
    attributes: [[fn('DISTINCT', col('countryCode')), 'countryCode']],
  });

  return countryCodes.map(({ countryCode }) => countryCode);
}

async function findCurrentTripByUserId({ userId }) {
  const currentTrip = await SavedTrip.findOne({
    where: {
      userId,
      startedAt: {
        [Op.ne]: null,
      },
      finishedAt: null,
    },
    include: INCLUDE_MODELS,
    order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
  });

  if (!currentTrip) {
    return null;
  }

  return toTripDTO(currentTrip);
}

async function findUpcomingTripByUserId({ userId }) {
  const upcomingTrip = await SavedTrip.findOne({
    where: {
      userId,
      startedAt: null,
      finishedAt: null,
    },
    include: INCLUDE_MODELS,
    order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
  });

  if (!upcomingTrip) {
    return null;
  }

  return toTripDTO(upcomingTrip);
}

async function findLastFinishedTripByUserId({ userId }) {
  const lastFinishedTrip = await SavedTrip.findOne({
    where: {
      userId,
      startedAt: {
        [Op.ne]: null,
      },
      finishedAt: {
        [Op.ne]: null,
      },
    },
    include: INCLUDE_MODELS,
    order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
  });

  if (!lastFinishedTrip) {
    return null;
  }

  return toTripDTO(lastFinishedTrip);
}

async function findCurrentTripsByUserId({ userId }) {
  const currentTrips = await SavedTrip.findAll({
    where: {
      userId,
      startedAt: {
        [Op.ne]: null,
      },
      finishedAt: null,
    },
    include: INCLUDE_MODELS,
    order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
  });

  return Promise.all(currentTrips.map(currentTrip => toTripDTO(currentTrip)));
}

async function findUpcomingTripsByUserId({ userId }) {
  const upcomingTrips = await SavedTrip.findAll({
    where: {
      userId,
      startedAt: null,
      finishedAt: null,
    },
    include: INCLUDE_MODELS,
    order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
  });

  return Promise.all(
    upcomingTrips.map(upcomingTrip => toTripDTO(upcomingTrip)),
  );
}

async function findFinishedTripsByUserId({ userId }) {
  const finishedTrips = await SavedTrip.findAll({
    where: {
      userId,
      startedAt: {
        [Op.ne]: null,
      },
      finishedAt: {
        [Op.ne]: null,
      },
    },
    include: INCLUDE_MODELS,
    order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
  });

  return Promise.all(
    finishedTrips.map(finishedTrip => toTripDTO(finishedTrip)),
  );
}

module.exports = {
  findAllByUser,
  findAllFinishedByUser,
  create,
  findById,
  destroy,
  update,
  updateFullTrip,
  startTripFromLocation,
  toTripDTO,
  findLocationById,
  markLocationSkipped,
  markLocationVisited,
  endTrip,
  findFinishedTripCountByUserId,
  findPlannedTripCountByUserId,
  findFinishedTripCountryCodesByUserId,
  findCurrentTripByUserId,
  findUpcomingTripByUserId,
  findLastFinishedTripByUserId,
  findCurrentTripsByUserId,
  findUpcomingTripsByUserId,
  findFinishedTripsByUserId,
};
