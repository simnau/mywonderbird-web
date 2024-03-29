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
        title: locationTitle || title,
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
  '/v2',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: {
        pictureDatas: pictureDatasJson,

        journeyId,
        journeyTitle,
      },
      files,
      user: { id },
    } = req;

    const pictureDatas = JSON.parse(pictureDatasJson).map(pictureData => ({
      title: pictureData.title,
      description: pictureData.description,
      creationDate: pictureData.creationDate,
      location: {
        title: pictureData.locationTitle || pictureData.title,
        country: pictureData.locationCountry,
        countryCode: pictureData.locationCountryCode,
        lat: pictureData.locationLat,
        lng: pictureData.locationLng,
      },
      imageIds: pictureData.imageIds,
    }));

    if (journeyId || journeyTitle) {
      await service.sharePicturesWithJourney({
        pictureDatas,
        journeyId,
        journeyTitle,
        userId: id,
        files,
      });
    } else {
      await service.shareSinglePictures({
        pictureDatas,
        userId: id,
        files,
      });
    }

    res.send({ success: true });
  }),
);

pictureRouter.post(
  '/single',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: {
        title,
        description,
        creationDate,

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
        title: locationTitle || title,
        country: locationCountry,
        countryCode: locationCountryCode,
        lat: locationLat,
        lng: locationLng,
      },
    };

    await service.shareSinglePicture({
      picture,
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

    if (!journeyId || journeyId === 'null') {
      return res.status(400).send({
        message: 'Invalid journeyId',
      });
    }

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

pictureRouter.get(
  '/v2/feed',
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

    const feedItems = await service.findFeedItemsV2(
      lastDatetime,
      limit,
      direction,
    );
    const feedDto = await service.augmentFeed(feedItems, id);

    res.send({ feedItems: feedDto });
  }),
);

module.exports = pictureRouter;
