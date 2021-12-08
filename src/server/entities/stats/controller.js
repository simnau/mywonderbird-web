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

module.exports = router;
