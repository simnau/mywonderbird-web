export function getJourneyCoordinates(journey) {
  if (!journey || !journey.days) {
    return [];
  }

  const coordinates = journey.days.map(day => {
    const gemCoordinates = day.gems.map(gem => {
      return [gem.lng, gem.lat];
    });

    return day.nest
      ? [...gemCoordinates, [day.nest.lng, day.nest.lat]]
      : gemCoordinates;
  });

  return coordinates;
}
