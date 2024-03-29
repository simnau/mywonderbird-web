const axios = require('axios');
const config = require('config');
const qs = require('qs');

const {
  BROWSE_FULL_PATH,
  DISCOVER_FULL_PATH,
  REVERSE_GEOCODE_FULL_PATH,
} = require('./urls');
const { CATEGORIES_STRING } = require('./categories');

const SEARCH_LIMIT = 3;
const HERE_PROVIDER = 'HERE';

const hereApiKey = config.get('here.maps.apiKey');
const distanceThreshold = config.get('location.browse.distanceThreshold');

function toDTO(result) {
  const {
    id,
    position,
    title,
    address: { countryName, countryCode },
  } = result;

  return {
    id,
    location: position,
    name: title,
    country: countryName,
    countryCode,
    provider: HERE_PROVIDER,
  };
}

async function searchForPlaces(query, location = '0,0') {
  const queryParams = qs.stringify({
    q: query,
    at: location,
    apiKey: hereApiKey,
    limit: SEARCH_LIMIT,
    lang: 'en-US',
  });
  const { data } = await axios.get(`${DISCOVER_FULL_PATH}?${queryParams}`);

  return data.items;
}

async function locationToPlace(location) {
  const queryParams = qs.stringify({
    at: location,
    apiKey: hereApiKey,
    limit: 5,
    categories: CATEGORIES_STRING,
    lang: 'en-US',
  });
  const {
    data: {
      items: [placeLocation],
    },
  } = await axios.get(`${BROWSE_FULL_PATH}?${queryParams}`);

  if (placeLocation && placeLocation.distance <= distanceThreshold) {
    return placeLocation;
  }

  return null;
}

async function locationToCountryCode(location) {
  const queryParams = qs.stringify({
    at: location,
    apiKey: hereApiKey,
    limit: 1,
    lang: 'en-US',
    level: 'country',
    locationattributes: 'address',
    mode: 'retrieveAddresses',
  });

  const {
    data: {
      items: [place],
    },
  } = await axios.get(`${REVERSE_GEOCODE_FULL_PATH}?${queryParams}`);

  if (!place) {
    return null;
  }

  return place.address.countryCode;
}

async function locationToAddress(location) {
  const queryParams = qs.stringify({
    at: location,
    apiKey: hereApiKey,
    limit: 1,
    lang: 'en-US',
  });
  const {
    data: {
      items: [placeAddress],
    },
  } = await axios.get(`${REVERSE_GEOCODE_FULL_PATH}?${queryParams}`);

  return placeAddress;
}

module.exports = {
  locationToAddress,
  locationToCountryCode,
  locationToPlace,
  searchForPlaces,
  toDTO,
};
