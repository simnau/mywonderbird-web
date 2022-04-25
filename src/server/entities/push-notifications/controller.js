const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const router = Router();

router.post(
  '/token',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      body: { deviceToken },
    } = req;

    await service.saveToken({
      userId,
      deviceToken,
    });

    res.send({ message: 'Device token stored' });
  }),
);

router.delete(
  '/token/:deviceToken',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { deviceToken },
    } = req;

    await service.removeToken({
      userId,
      deviceToken,
    });

    res.send({ message: 'Device token removed' });
  }),
);

module.exports = router;
