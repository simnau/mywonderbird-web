const { countries } = require('country-code-lookup');

const { mapsClient } = require('../../setup/google');
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

function placesResultToDTO(result) {
  const {
    id,
    geometry: { location },
    name,
  } = result;

  return {
    id,
    location,
    name,
  };
}

function searchPlaces(query) {
  return new Promise((resolve, reject) => {
    mapsClient.places(
      {
        query,
      },
      (err, response) => {
        if (err) {
          return reject(err);
        }

        return resolve(response.json.results.map(placesResultToDTO));
      },
    );
  });
}

module.exports = {
  getCountries,
  searchCountries,
  findBoundsBy3LetterCountryCode,
  searchPlaces,
};
