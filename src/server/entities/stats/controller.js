const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const router = Router();

router.get(
  '/user',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
    } = req;

    const userStats = await service.findUserStats({ userId });

    res.send(userStats);
  }),
);

router.get(
  '/user/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    const userStats = await service.findUserStats({ userId: id });

    res.send(userStats);
  }),
);

router.get(
  '/visited-countries',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { startDate, endDate },
      user: { id: userId },
    } = req;

    const visitedCountries = await service.findVisitedCountryCodes({
      userId,
      startDate,
      endDate,
    });

    res.send({
      visitedCountries,
    });
  }),
);

router.get(
  '/country',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { countryCode },
      user: { id: userId },
    } = req;

    if (!countryCode) {
      throw new Error(
        'You have to provide a "countryCode" query param with a valid 3 letter country code',
      );
    }

    const visitedTripsAndSpots = await service.findVisitedTripsAndSpots({
      countryCode,
      userId,
    });

    res.send({ stats: visitedTripsAndSpots });
  }),
);

router.get(
  '/country/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { countryCode },
      params: { userId },
    } = req;

    if (!countryCode) {
      throw new Error(
        'You have to provide a "countryCode" query param with a valid 3 letter country code',
      );
    }

    const visitedTripsAndSpots = await service.findVisitedTripsAndSpots({
      countryCode,
      userId,
    });

    res.send({ stats: visitedTripsAndSpots });
  }),
);

module.exports = router;
