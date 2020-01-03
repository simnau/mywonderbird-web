const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const requireRole = require('../../middleware/require-role');
const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const journeyRouter = Router();

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
  '/my',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;
    const { total, journeys } = await service.findAllByUser(
      id,
      page,
      pageSize,
      {
        loadIncludes: true,
      },
    );
    const journeyDTOs = await service.enrichJourneys(journeys, id);

    res.send({ total, journeys: journeyDTOs });
  }),
);

journeyRouter.get(
  '/count',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const count = await service.findCountByUser(id);

    return res.send({
      count,
    });
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

journeyRouter.get(
  '/all/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
      params: { userId },
    } = req;

    const { journeys, total } = await service.findAllByUser(
      userId,
      page,
      pageSize,
      { loadIncludes: true, published: true },
    );
    const journeyDTOs = await service.enrichJourneys(journeys, id);

    res.send({ journeys: journeyDTOs, total });
  }),
);

journeyRouter.get(
  '/feed',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;
    const { total, journeys } = await service.findAll(page, pageSize, {
      loadIncludes: true,
      published: true,
    });
    const journeyDTOs = await service.enrichJourneys(journeys, id);

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
