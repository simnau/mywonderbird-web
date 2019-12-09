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
    const profile = await service.findProfileById(id);

    if (!profile) {
      res.status(404).send({ message: 'Profile not found' });
    } else {
      res.send(profile);
    }
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      body,
    } = req;
    await service.createOrUpdateProfile(id, body);

    res.send({ succes: true });
  }),
);

module.exports = router;
