const GoogleMaps = require('@google/maps');
const config = require('config');

const { apiKey } = config.get('google.maps');

const mapsClient = GoogleMaps.createClient({
  key: apiKey,
});

module.exports = {
  mapsClient,
};
