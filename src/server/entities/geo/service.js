const { countries } = require('country-code-lookup');

const {
  searchForPlaces: hereSearchForPlaces,
  locationToAddress: hereLocationToAddress,
  locationToCountryCode: hereLocationCountry,
  locationToPlace: hereLocationToPlace,
  toDTO: hereToDTO,
} = require('../../providers/location/here');
const countryBoundaries = require('../../resources/countriy-boundaries');

const countryDtoByCodeMap = countries.reduce((result, country) => {
  const uppercaseCode = country.iso3.toUpperCase();

  return {
    ...result,
    [uppercaseCode]: {
      label: country.country,
      value: uppercaseCode,
    },
  };
}, {});

function getCountryDTOs() {
  return Object.values(countryDtoByCodeMap);
}

function getLabelBy3LetterCountryCode(code) {
  if (!code) {
    throw new Error('Code is required');
  }

  const uppercaseCode = code.toUpperCase();

  return countryDtoByCodeMap[uppercaseCode].label;
}

function getCountries() {
  return getCountryDTOs();
}

function searchCountries(query) {
  return getCountryDTOs().filter(country =>
    country.label.toLowerCase().startsWith(query.toLowerCase()),
  );
}

function findByCode(code) {
  if (!code) {
    return null;
  }

  return countryDtoByCodeMap[code.toUpperCase()];
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

async function multiReverseGeocode(locations) {
  const resultLocations = await Promise.all(
    locations.map(async ({ latLng }) => {
      if (!latLng) {
        return null;
      }

      const locationString = `${latLng[0]},${latLng[1]}`;
      const place = await hereLocationToPlace(locationString);

      return place
        ? hereToDTO(place)
        : {
            location: {
              lat: latLng[0],
              lng: latLng[1],
            },
          };
    }),
  );

  return resultLocations;
}

async function locationToAddress(location) {
  const place = await hereLocationToAddress(location);

  return place ? hereToDTO(place) : null;
}

async function locationCountry(location) {
  const countryCode = await hereLocationCountry(location);

  if (!countryCode) {
    return null;
  }

  const country = getLabelBy3LetterCountryCode(countryCode);

  return {
    country,
    countryCode,
  };
}

module.exports = {
  getCountries,
  searchCountries,
  findByCode,
  getLabelBy3LetterCountryCode,
  findBoundsBy3LetterCountryCode,
  reverseGeocode,
  multiReverseGeocode,
  locationCountry,
  locationToAddress,
  searchPlaces,
};
