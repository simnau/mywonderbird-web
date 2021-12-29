const { SAVED_TRIP_TYPE, SHARED_TRIP_TYPE } = require('../../constants/trips');
const { findRouteLength } = require('../../util/geo');
const savedTripService = require('../saved-trip/service');
const journeyService = require('../journey/service');

async function findCurrentTripsByUserId({ userId }) {
  const currentTrips = await savedTripService.findCurrentTripsByUserId({
    userId,
  });

  return currentTrips.map(currentTrip =>
    tripDTOToStatsDTO(currentTrip, SAVED_TRIP_TYPE),
  );
}

async function findUpcomingTripsByUserId({ userId }) {
  const upcomingTrips = await savedTripService.findUpcomingTripsByUserId({
    userId,
  });

  return upcomingTrips.map(upcomingTrip =>
    tripDTOToStatsDTO(upcomingTrip, SAVED_TRIP_TYPE),
  );
}

async function findTripsByUserId({ userId }) {
  const finishedTrips = await savedTripService.findFinishedTripsByUserId({
    userId,
  });
  const sharedTrips = await journeyService.findTripsByUserId({ userId });

  const finishedTripStats = finishedTrips.map(finishedTrip =>
    tripDTOToStatsDTO(finishedTrip, SAVED_TRIP_TYPE),
  );
  const sharedTripStats = sharedTrips.map(sharedTrip =>
    tripDTOToStatsDTO(sharedTrip, SHARED_TRIP_TYPE),
  );
  const allTrips = [...finishedTripStats, ...sharedTripStats];

  return allTrips.sort((trip1, trip2) => trip2.updatedAt - trip1.updatedAt);
}

function tripDTOToStatsDTO(tripDto, tripType) {
  let currentStep = 0;

  tripDto.locations.forEach(({ skipped, visitedAt }) => {
    if (skipped || visitedAt) {
      currentStep++;
    }
  });

  const distance = findRouteLength(tripDto.locations);

  return {
    id: tripDto.id,
    name: tripDto.title,
    spotCount: tripDto.locations.length,
    currentStep,
    imageUrl: tripDto.imageUrl,
    country: tripDto.country,
    countryCode: tripDto.countryCode,
    distance,
    tripType,
    updatedAt: tripDto.updatedAt,
  };
}

module.exports = {
  findCurrentTripsByUserId,
  findUpcomingTripsByUserId,
  findTripsByUserId,
  tripDTOToStatsDTO,
};
