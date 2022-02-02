const { unique } = require('../../util/array');
const journeyService = require('../journey/service');
const savedTripService = require('../saved-trip/service');
const tripStatsService = require('../trip-stats/service');
const gemService = require('../gem/service');
const {
  SAVED_TRIP_TYPE,
  SHARED_TRIP_TYPE,
  FINISHED_TRIP_STATUS,
  PLANNED_TRIP_STATUS,
  IN_PROGRESS_TRIP_STATUS,
} = require('../../constants/trips');

const SPOT_LIMIT = 8;

async function findUserStats({ userId }) {
  const tripCount = await findFinishedTripCount({
    userId,
  });
  const plannedTripCount = await findPlannedTripCount({ userId });
  const visitedCountryCodes = await findVisitedCountryCodes({ userId });
  const spotCount = await findSpotCount({ userId });
  const currentTrip = await findCurrentTrip({ userId });
  const upcomingTrip = await findUpcomingTrip({ userId });
  const lastTrip = await findLastTrip({ userId });
  const spots = await findSpots({ userId });

  return {
    visitedCountryCodes,
    tripCount,
    plannedTripCount,
    spotCount,
    currentTrip,
    upcomingTrip,
    lastTrip,
    spots,
  };
}

async function findFinishedTripCount({ userId }) {
  const sharedTripCount = await journeyService.findTripCountByUserId({
    userId,
  });
  const finishedTripCount = await savedTripService.findFinishedTripCountByUserId(
    { userId },
  );

  return sharedTripCount + finishedTripCount;
}

async function findPlannedTripCount({ userId }) {
  const plannedTripCount = await savedTripService.findPlannedTripCountByUserId({
    userId,
  });

  return plannedTripCount;
}

async function findVisitedCountryCodes({ userId }) {
  // This takes into account the journeys that were created before gems had a userId field
  const sharedLegacyTripCountryCodes = await journeyService.findCountryCodesByUserId(
    {
      userId,
    },
  );
  const sharedTripCountryCodes = await gemService.findCountryCodesByUserId({
    userId,
  });
  const finishedTripCountryCodes = await savedTripService.findFinishedTripCountryCodesByUserId(
    { userId },
  );

  return unique([
    ...sharedLegacyTripCountryCodes,
    ...sharedTripCountryCodes,
    ...finishedTripCountryCodes,
  ]);
}

async function findSpotCount({ userId }) {
  const spotCount = await gemService.findSpotCountByUserId({ userId });

  return spotCount;
}

async function findCurrentTrip({ userId }) {
  const currentTrip = await savedTripService.findCurrentTripByUserId({
    userId,
  });

  if (!currentTrip) {
    return null;
  }

  return tripStatsService.tripDTOToStatsDTO(
    currentTrip,
    SAVED_TRIP_TYPE,
    IN_PROGRESS_TRIP_STATUS,
  );
}

async function findUpcomingTrip({ userId }) {
  const upcomingTrip = await savedTripService.findUpcomingTripByUserId({
    userId,
  });

  if (!upcomingTrip) {
    return null;
  }

  return tripStatsService.tripDTOToStatsDTO(
    upcomingTrip,
    SAVED_TRIP_TYPE,
    PLANNED_TRIP_STATUS,
  );
}

async function findLastTrip({ userId }) {
  const lastSharedTrip = await journeyService.findLastTripByUserId({ userId });
  const lastSavedTrip = await savedTripService.findLastFinishedTripByUserId({
    userId,
  });

  let latestTrip;
  let tripType;

  if (lastSharedTrip && lastSavedTrip) {
    const isSharedTripNewer =
      lastSharedTrip.updatedAt > lastSavedTrip.updatedAt;

    latestTrip = isSharedTripNewer ? lastSharedTrip : lastSavedTrip;
    tripType = isSharedTripNewer ? SHARED_TRIP_TYPE : SAVED_TRIP_TYPE;
  } else if (lastSharedTrip) {
    latestTrip = lastSharedTrip;
    tripType = SHARED_TRIP_TYPE;
  } else if (lastSavedTrip) {
    latestTrip = lastSavedTrip;
    tripType = SAVED_TRIP_TYPE;
  }

  if (!latestTrip) {
    return null;
  }

  return tripStatsService.tripDTOToStatsDTO(
    latestTrip,
    tripType,
    tripType === SAVED_TRIP_TYPE ? FINISHED_TRIP_STATUS : null,
  );
}

async function findSpots({ userId }) {
  const spots = await gemService.findSpotsByUserId({
    userId,
    limit: SPOT_LIMIT,
  });

  return spots.map(({ id, imageUrl }) => ({
    id,
    imageUrl,
  }));
}

module.exports = {
  findUserStats,
};
