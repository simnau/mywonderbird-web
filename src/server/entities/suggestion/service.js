const shuffle = require('shuffle-array');

const bookmarkService = require('../bookmark/service');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const geoService = require('../geo/service');
const {
  findLocationOrder,
  sortLocationsByDistanceToPoint,
} = require('../../util/geo');

const DEFAULT_LOCATIONS_PER_PAGE = 10;

async function suggestJourney(userId, bookmarkGroupId) {
  const bookmarks = await bookmarkService.findByUserIdAndBookmarkGroupId(
    userId,
    bookmarkGroupId,
    { attributes: ['entityId'] },
  );
  const gemCaptureIds = bookmarks.map(bookmark => bookmark.entityId);
  const gemCaptures = await gemCaptureService.findByIds(gemCaptureIds);

  if (!gemCaptures.length) {
    return {};
  }

  const firstGemCapture = gemCaptures[0];
  const gem = firstGemCapture.gem;
  const country = geoService.getLabelBy3LetterCountryCode(gem.countryCode);

  return {
    name: `Trip to ${country}`,
    country: country,
    countryCode: gem.countryCode,
    imageUrl: firstGemCapture.url,
    locations: gemCaptures.map(toLocation),
  };
}

function toLocation(gemCapture) {
  const gem = gemCapture.gem;
  const country = geoService.getLabelBy3LetterCountryCode(gem.countryCode);

  return {
    id: gemCapture.id,
    country,
    countryCode: gem.countryCode,
    name: gemCapture.title,
    imageUrl: gemCapture.url,
    location: {
      lat: gem.lat,
      lng: gem.lng,
    },
  };
}

async function suggestLocations(userId, response) {
  const places = await placeService.findPlacesByQuestionnaire(response);

  return shuffle(places);
}

async function suggestLocationsPaginated(
  userId,
  {
    page = 0,
    pageSize = DEFAULT_LOCATIONS_PER_PAGE,
    tags = [],
    latMin,
    latMax,
    lngMin,
    lngMax,
    selectedLocations,
  },
) {
  const places = await placeService.findPlacesPaginated({
    page,
    pageSize,
    tags,
    latMin,
    latMax,
    lngMin,
    lngMax,
    selectedLocations,
  });

  return places;
}

function toSuggestedLocationDTO(location) {
  const country = geoService.getLabelBy3LetterCountryCode(location.countryCode);

  return {
    id: location.id,
    name: location.title,
    country,
    countryCode: location.countryCode,
    lat: location.lat,
    lng: location.lng,
    images: location.placeImages.map(toSuggestedLocationImageDTO),
  };
}

function toSuggestedLocationImageDTO(locationImage) {
  return {
    id: locationImage.id,
    name: locationImage.title,
    url: locationImage.url,
  };
}

async function suggestJourneyByLocations(
  userId,
  locationIds,
  startingLocation,
) {
  let locations = await placeService.findByIds(locationIds);

  if (startingLocation && startingLocation.lat && startingLocation.lng) {
    locations = sortLocationsByDistanceToPoint(locations, startingLocation);
  }

  const sortedLocations = await sortLocationsByDistance(locations);
  const locationDTOs = sortedLocations.map(toSuggestedLocationDTO);
  const country = findLocationsCountry(locationDTOs);
  const imageUrl = findLocationsImageUrl(locationDTOs);

  return {
    ...country,
    imageUrl,
    locations: locationDTOs,
  };
}

function findLocationsCountry(locationDTOs) {
  const locationWithCountry = locationDTOs.find(
    locationDTO => !!locationDTO.country,
  );

  if (!locationWithCountry) {
    return {
      country: null,
      countryCode: null,
    };
  }

  return {
    country: locationWithCountry.country,
    countryCode: locationWithCountry.countryCode,
  };
}

function findLocationsImageUrl(locationDTOs) {
  const locationWithImages = locationDTOs.find(
    locationDTO => !!locationDTO.images.length,
  );

  return locationWithImages && locationWithImages.images[0].url;
}

async function sortLocationsByDistance(locations) {
  const locationOrder = await findLocationOrder(locations);
  return locationOrder.map(locationIndex => locations[locationIndex]);
}

module.exports = {
  suggestJourney,
  suggestLocations,
  toSuggestedLocationDTO,
  suggestJourneyByLocations,

  suggestLocationsPaginated,
  DEFAULT_LOCATIONS_PER_PAGE,
};
