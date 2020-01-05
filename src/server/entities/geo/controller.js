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
    const { q } = req.query;
    const result = await service.searchPlaces(q);

    res.send(result);
  }),
);

module.exports = geoRouter;
