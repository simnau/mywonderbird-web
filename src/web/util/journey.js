function getPreviousDayLastPoint(days, dayIndex) {
  if (dayIndex <= 0) {
    return null;
  }

  const previousDay = days[dayIndex - 1];

  if (previousDay.nest) {
    return [previousDay.nest.lng, previousDay.nest.lat];
  }

  if (!previousDay.gems || !previousDay.gems.length) {
    return getPreviousDayLastPoint(days, dayIndex - 1);
  }

  const lastCoordinate = previousDay.gems[previousDay.gems.length - 1];

  return [lastCoordinate.lng, lastCoordinate.lat];
}

function getDayCoordinates(gemCoordinates, nest, previousDayLastPoint) {
  let coordinates = [];

  if (previousDayLastPoint) {
    coordinates = nest
      ? [previousDayLastPoint, ...gemCoordinates, [nest.lng, nest.lat]]
      : [previousDayLastPoint, ...gemCoordinates];
  } else {
    coordinates = nest
      ? [...gemCoordinates, [nest.lng, nest.lat]]
      : gemCoordinates;
  }

  return coordinates.filter(
    ([lng, lat]) => (!!lng || lng === 0) && (!!lat || lat === 0),
  );
}

export function getJourneyCoordinates(journey) {
  if (!journey || !journey.days) {
    return [];
  }

  const coordinates = journey.days.map((day, dayIndex) => {
    const gemCoordinates = day.gems.map(gem => {
      return [gem.lng, gem.lat];
    });

    const previousDayLastPoint = getPreviousDayLastPoint(
      journey.days,
      dayIndex,
    );

    return {
      day,
      coordinates: getDayCoordinates(
        gemCoordinates,
        day.nest,
        previousDayLastPoint,
      ),
    };
  });

  return coordinates;
}
