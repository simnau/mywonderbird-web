const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const AVATAR_FOLDER = 'avatars';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;
    const profile = await service.findOrCreateProfileByProviderId(id);

    res.send(profile);
  }),
);

router.get(
  '/:providerId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { providerId },
    } = req;
    const profile = await service.findProfileByProviderId(providerId);

    res.send(profile);
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
    await service.createOrUpdateProfileByProviderId(id, body);

    res.send({ succes: true });
  }),
);

router.post(
  '/avatar',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      files,
    } = req;
    const { images } = await service.uploadAvatar(
      files,
      `${AVATAR_FOLDER}/${id}`,
    );

    res.send({ images });
  }),
);

module.exports = router;
