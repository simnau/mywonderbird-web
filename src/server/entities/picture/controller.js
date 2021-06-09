const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const journeyService = require('../journey/service');
const {
  OLDER_DIRECTION,
  DEFAULT_LIMIT,
} = require('../../constants/infinite-scroll');

const pictureRouter = Router();

pictureRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: {
        title,
        description,
        creationDate,

        journeyId,
        journeyTitle,

        locationTitle,
        locationCountry,
        locationCountryCode,
        locationLat,
        locationLng,
      },
      files,
      user: { id },
    } = req;

    const picture = {
      title,
      description,
      creationDate,
      location: {
        title: locationTitle,
        country: locationCountry,
        countryCode: locationCountryCode,
        lat: locationLat,
        lng: locationLng,
      },
    };

    await service.sharePictureWithJourney({
      picture,
      journeyId,
      journeyTitle,
      userId: id,
      files,
    });

    res.send({ success: true });
  }),
);

pictureRouter.post(
  '/:journeyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body,
      params: { journeyId },
      user: { id },
    } = req;

    await service.sharePicture(body, journeyId, id);

    res.send({ success: true });
  }),
);

pictureRouter.post(
  '/:journeyId/file',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      files,
      params: { journeyId },
      user: { id },
    } = req;

    const existingJourney = await journeyService.findById(journeyId);

    if (!existingJourney) {
      await journeyService.create({
        id: journeyId,
        userId: id,
        creatorId: id,
        draft: true,
      });
    }

    const response = await service.uploadFiles(files, journeyId);

    res.send(response);
  }),
);

pictureRouter.get(
  '/feed',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: {
        lastDatetime,
        limit = DEFAULT_LIMIT,
        direction = OLDER_DIRECTION,
      },
      user: { id },
    } = req;

    const feedItems = await service.findFeedItems(
      lastDatetime,
      limit,
      direction,
    );
    const feedDto = await service.augmentFeed(feedItems, id);

    res.send({ feedItems: feedDto });
  }),
);

module.exports = pictureRouter;
