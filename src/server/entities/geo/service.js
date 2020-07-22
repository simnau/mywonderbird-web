const { countries } = require('country-code-lookup');

const {
  searchForPlaces: hereSearchForPlaces,
  locationToPlace: hereLocationToPlace,
  toDTO: hereToDTO,
} = require('../../providers/location/here');
const countryBoundaries = require('../../resources/countriy-boundaries');

const countryDTOs = countries.map(country => ({
  label: country.country,
  value: country.iso3,
}));

function getCountries() {
  return countryDTOs;
}

function searchCountries(query) {
  return countryDTOs.filter(country =>
    country.label.toLowerCase().startsWith(query.toLowerCase()),
  );
}

function findBoundsBy3LetterCountryCode(code) {
  if (!code) {
    throw new Error('Code is required');
  }

  const uppercaseCode = code.toUpperCase();
  const boundaries = countryBoundaries[uppercaseCode];

  if (!boundaries) {
    throw new Error(`Boundaries for country ${code} not found`);
  }

  return {
    topLeft: [boundaries.bottomLeft.lon, boundaries.topRight.lat],
    bottomRight: [boundaries.topRight.lon, boundaries.bottomLeft.lat],
  };
}

async function searchPlaces(query, location) {
  const places = await hereSearchForPlaces(query, location);

  return places.map(hereToDTO);
}

async function reverseGeocode(location) {
  const place = await hereLocationToPlace(location);

  return place ? hereToDTO(place) : null;
}

module.exports = {
  getCountries,
  searchCountries,
  findBoundsBy3LetterCountryCode,
  reverseGeocode,
  searchPlaces,
};
