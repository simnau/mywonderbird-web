const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const subscriptionService = require('../subscription/service');
const { AVATAR_FOLDER } = require('../../constants/s3');

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

// TODO: remove when no longer used in the old app (Ionic)
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      body,
    } = req;
    const updatedProfile = await service.createOrUpdateProfileByProviderId(
      id,
      body,
    );

    res.send(updatedProfile);
  }),
);

router.post(
  '/v2',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      body: { username },
      files,
    } = req;

    const profileUpdate = {
      username,
    };

    if (files && Object.entries(files).length) {
      const {
        images: [avatarUrl],
      } = await service.uploadAvatar(files, `${AVATAR_FOLDER}/${id}`);
      await service.deletePreviousAvatar(id);

      profileUpdate.avatarUrl = avatarUrl;
    }

    const updatedProfile = await service.createOrUpdateProfileByProviderId(
      id,
      profileUpdate,
    );

    res.send(updatedProfile);
  }),
);

// TODO: remove when no longer used in the old app (Ionic)
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
    await service.deletePreviousAvatar(id);

    res.send({ images });
  }),
);

router.post(
  '/terms',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { acceptedTerms, acceptedNewsletter },
      user: { id, email },
    } = req;

    if (!acceptedTerms) {
      return res.status(422).send({ error: 'Terms cannot be unaccepted' });
    }

    const profileUpdate = {
      acceptedTermsAt: new Date(),
    };

    if (typeof acceptedNewsletter !== 'undefined') {
      profileUpdate.acceptedNewsletter = acceptedNewsletter;

      if (acceptedNewsletter) {
        await subscriptionService.subscribeNewsletter(email);
      } else {
        await subscriptionService.unsubscribeNewsletter(email);
      }
    }

    const profile = await service.createOrUpdateProfileByProviderId(
      id,
      profileUpdate,
    );

    res.send(profile);
  }),
);

router.post(
  '/communication',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { acceptedNewsletter },
      user: { id, email },
    } = req;

    if (acceptedNewsletter) {
      await subscriptionService.subscribeNewsletter(email);
    } else {
      await subscriptionService.unsubscribeNewsletter(email);
    }

    const profile = await service.createOrUpdateProfileByProviderId(id, {
      acceptedNewsletter,
    });

    res.send(profile);
  }),
);

module.exports = router;
