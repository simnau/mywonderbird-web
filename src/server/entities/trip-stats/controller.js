const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const trips = await service.findTripsByUserId({ userId: id });

    res.send({
      trips,
    });
  }),
);

router.get(
  '/current',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const trips = await service.findCurrentTripsByUserId({ userId: id });

    res.send({
      trips,
    });
  }),
);

router.get(
  '/current/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { userId },
    } = req;

    const trips = await service.findCurrentTripsByUserId({ userId });

    res.send({
      trips,
    });
  }),
);

router.get(
  '/upcoming',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const trips = await service.findUpcomingTripsByUserId({ userId: id });

    res.send({
      trips,
    });
  }),
);

router.get(
  '/upcoming/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { userId },
    } = req;

    const trips = await service.findUpcomingTripsByUserId({ userId });

    res.send({
      trips,
    });
  }),
);

router.get(
  '/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { userId },
    } = req;

    const trips = await service.findTripsByUserId({ userId });

    res.send({
      trips,
    });
  }),
);

module.exports = router;
