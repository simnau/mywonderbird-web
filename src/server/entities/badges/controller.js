const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const badgeRouter = Router();

badgeRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
    } = req;

    const badges = await service.findBadges({ userId });

    res.send({ badges });
  }),
);

badgeRouter.get(
  '/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { userId },
    } = req;

    const badges = await service.findBadges({ userId });

    res.send({ badges });
  }),
);

module.exports = badgeRouter;
