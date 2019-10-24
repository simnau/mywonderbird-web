function getPreviousDayLastPoint(days, dayIndex) {
  if (dayIndex <= 0) {
    return null;
  }

  const previousDay = days[dayIndex - 1];

  if (previousDay.nest) {
    return {
      lat: previousDay.nest.lat,
      lng: previousDay.nest.lng,
    };
  }

  if (!previousDay.gems || !previousDay.gems.length) {
    return getPreviousDayLastPoint(days, dayIndex - 1);
  }

  const lastCoordinate = previousDay.gems[previousDay.gems.length - 1];

  return [lastCoordinate.lng, lastCoordinate.lat];
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

    if (previousDayLastPoint) {
      return day.nest
        ? [
            previousDayLastPoint,
            ...gemCoordinates,
            [day.nest.lng, day.nest.lat],
          ]
        : [previousDayLastPoint, ...gemCoordinates];
    }

    return day.nest
      ? [...gemCoordinates, [day.nest.lng, day.nest.lat]]
      : gemCoordinates;
  });

  return coordinates;
}
