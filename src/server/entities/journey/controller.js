const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const config = require('config');

const { ADMIN_ROLE } = require('../../constants/roles');
const requireRole = require('../../middleware/require-role');
const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const { findCoordinateBoundingBox } = require('../../util/geo');

const journeyRouter = Router();

const feedMaxImageCount = config.get('feed.maxImageCount');
const DEFAULT_PAGE_SIZE = 20;

journeyRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;
    const { journeys, total } = await service.findAllByUser(id, page, pageSize);
    const journeysWithProfile = await service.addUserProfileToJourneys(
      journeys,
    );

    res.send({ journeys: journeysWithProfile, total });
  }),
);

journeyRouter.get(
  '/all',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { userId, page = 1, pageSize = DEFAULT_PAGE_SIZE } = req.query;
    const { journeys, total } = await (userId
      ? service.findAllByUser(userId, page, pageSize)
      : service.findAll(page, pageSize));
    const journeysWithProfile = await service.addUserProfileToJourneys(
      journeys,
    );

    res.send({ journeys: journeysWithProfile, total });
  }),
);

function journeyToFeedJourneyDTO(journey) {
  const { days, ...journeyData } = journey;

  const images = [];
  const coordinates = [];

  for (const day of days) {
    for (const gem of day.gems) {
      if (
        images.length < feedMaxImageCount &&
        gem.gemCaptures &&
        gem.gemCaptures.length &&
        gem.gemCaptures[0].url
      ) {
        images.push(gem.gemCaptures[0].url);
      }

      coordinates.push({
        id: gem.id,
        lat: gem.lat,
        lng: gem.lng,
        type: 'gem',
      });
    }

    if (day.nest) {
      coordinates.push({
        id: day.nest.id,
        lat: day.nest.lat,
        lng: day.nest.lng,
        type: 'nest',
      });
    }
  }

  const boundingBox = findCoordinateBoundingBox(coordinates);

  return {
    ...journeyData,
    images,
    coordinates,
    length: days.length,
    boundingBox,
  };
}

journeyRouter.get(
  '/feed',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;
    const { total, journeys } = await service.findAll(page, pageSize, {
      loadIncludes: true,
      published: true,
    });
    const journeysWithProfile = await service.addUserProfileToJourneys(
      journeys,
    );
    const journeyDTOs = journeysWithProfile.map(journeyToFeedJourneyDTO);

    res.send({ total, journeys: journeyDTOs });
  }),
);

journeyRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const journey = await service.findById(id);

    if (!journey) {
      return res.status(404).send({
        error: `Journey with id ${id} not found`,
      });
    }

    const journeyWithProfle = await service.addUserProfileToJourney(journey);

    return res.send(journeyWithProfle);
  }),
);

journeyRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body,
      user: { id },
    } = req;
    const savedJourney = await service.create({
      ...body,
      userId: id,
      creatorId: id,
    });

    res.send(savedJourney);
  }),
);

journeyRouter.post(
  '/user/:userId',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      body,
      params: { userId },
      user: { id },
    } = req;
    const savedJourney = await service.create({
      ...body,
      userId,
      creatorId: id,
    });

    res.send(savedJourney);
  }),
);

journeyRouter.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      body: { id: ignore, userId, ...body },
      user: { id: currentUserId, role },
    } = req;

    const journey = await service.findById(id);

    if (!journey) {
      const error = new Error(`Journey with id ${id} does not exist`);
      error.status = 404;

      throw error;
    } else if (role !== ADMIN_ROLE && journey.userId !== currentUserId) {
      const error = new Error('User is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    const updatedJourney = await service.update(id, body, journey);

    return res.send(updatedJourney);
  }),
);

journeyRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      user: { id: currentUserId, role },
    } = req;
    const journey = await service.findById(id);

    if (!journey) {
      return res.status(404).send({
        error: `Journey with id ${id} not found`,
      });
    } else if (role !== ADMIN_ROLE && journey.userId !== currentUserId) {
      const error = new Error('User is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.delete(id);

    return res.send({
      message: `Journey with id ${id} deleted`,
    });
  }),
);

module.exports = journeyRouter;
