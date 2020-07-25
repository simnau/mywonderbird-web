const BROWSE_ROOT_URL = 'https://browse.search.hereapi.com';
const BROWSE_VERSION = 'v1';
const BROWSE_PATH = 'browse';
const BROWSE_FULL_PATH = `${BROWSE_ROOT_URL}/${BROWSE_VERSION}/${BROWSE_PATH}`;

const DISCOVER_ROOT_URL = 'https://discover.search.hereapi.com';
const DISCOVER_VERSION = 'v1';
const DISCOVER_PATH = 'discover';
const DISCOVER_FULL_PATH = `${DISCOVER_ROOT_URL}/${DISCOVER_VERSION}/${DISCOVER_PATH}`;

const REVERSE_GEOCODE_ROOT_URL = 'https://revgeocode.search.hereapi.com';
const REVERSE_GEOCODE_VERSION = 'v1';
const REVERSE_GEOCODE_PATH = 'revgeocode';
const REVERSE_GEOCODE_FULL_PATH = `${REVERSE_GEOCODE_ROOT_URL}/${REVERSE_GEOCODE_VERSION}/${REVERSE_GEOCODE_PATH}`;

module.exports = {
  BROWSE_FULL_PATH,
  DISCOVER_FULL_PATH,
  REVERSE_GEOCODE_FULL_PATH,
};
