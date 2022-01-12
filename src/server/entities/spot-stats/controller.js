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

    const spots = await service.findSpotsByUserId({ userId: id });

    res.send({
      spots,
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

    const spots = await service.findSpotsByUserId({ userId });

    res.send({
      spots,
    });
  }),
);

module.exports = router;
