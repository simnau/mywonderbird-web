const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const geoRouter = Router();

geoRouter.get(
  '/countries',
  asyncHandler(async (req, res) => {
    const countries = service.getCountries();

    res.send(countries);
  }),
);

geoRouter.get(
  '/countries/search',
  asyncHandler(async (req, res) => {
    const { q } = req.query;
    const countries = service.searchCountries(q);

    res.send(countries);
  }),
);

geoRouter.get(
  '/countries/:code',
  asyncHandler(async (req, res) => {
    const {
      params: { code },
    } = req;
    const country = service.findByCode(code);

    res.send({ country });
  }),
);

geoRouter.get(
  '/country-boundaries/:code',
  asyncHandler(async (req, res) => {
    const { code } = req.params;
    const boundaries = service.findBoundsBy3LetterCountryCode(code);

    res.send(boundaries);
  }),
);

geoRouter.get(
  '/places/search',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { q, location = '0,0' } = req.query;
    const result = await service.searchPlaces(q, location);

    res.send(result);
  }),
);

geoRouter.get(
  '/places/reverse-geocode',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { location } = req.query;
    const result = await service.reverseGeocode(location);

    res.send({ place: result });
  }),
);

geoRouter.post(
  '/places/reverse-geocode',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { locations } = req.body;
    const result = await service.multiReverseGeocode(locations);

    res.send({ locations: result });
  }),
);

geoRouter.get(
  '/places/country',
  asyncHandler(async (req, res) => {
    const {
      query: { location },
    } = req;
    const country = await service.locationCountry(location);

    res.send(country);
  }),
);

module.exports = geoRouter;
