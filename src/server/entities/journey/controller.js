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

// TODO: make proper API versioning
journeyRouter.get(
  '/v2/my',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;
    const { total, journeys } = await service.findAllByUserV2(
      id,
      page,
      pageSize,
      {
        loadIncludes: true,
      },
    );
    const journeyDTOs = await service.enrichJourneysV2(journeys);

    res.send({ total, journeys: journeyDTOs });
  }),
);

journeyRouter.get(
  '/last',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;
    const lastJourney = await service.findLastByUser(id, { loadIncludes: true });
    const journeyDTO = service.journeyToFeedJourneyDTO(lastJourney);

    res.send({ journey: journeyDTO });
  }),
)

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
  '/draft',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;

    const { journeys, total } = await service.findAllByUser(
      id,
      page,
      pageSize,
      { loadIncludes: true, draft: true },
    );
    const journeyDTOs = await service.enrichJourneys(journeys, id);

    return res.send({ journeys: journeyDTOs, total });
  }),
);

journeyRouter.get(
  '/draft/count',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const count = await service.findDraftCountByUser(id);

    return res.send({ count });
  }),
);

journeyRouter.post(
  '/draft',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body,
      user: { id },
    } = req;

    const existingJourney = await service.findById(body.id);

    if (existingJourney) {
      if (existingJourney.userId !== id || existingJourney.draft === false) {
        const error = new Error('The journey already exists');
        error.status = 400;

        throw error;
      } else {
        const updatedJourney = await service.update(
          existingJourney.id,
          { ...body, draft: true },
          existingJourney,
        );

        return res.send(updatedJourney);
      }
    }

    const savedJourney = await service.create({
      ...body,
      userId: id,
      creatorId: id,
      draft: true,
    });

    return res.send(savedJourney);
  }),
);

journeyRouter.post(
  '/draft-status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { journeyId },
      user: { id: currentUserId, role },
    } = req;

    const journey = await service.findById(journeyId);

    if (!journey) {
      const error = new Error(`Journey with id ${journeyId} does not exist`);
      error.status = 404;

      throw error;
    } else if (role !== ADMIN_ROLE && journey.userId !== currentUserId) {
      const error = new Error('User is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.update(journeyId, { draft: true }, journey);

    return res.send({ message: 'The journey was moved to draft' });
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

    const errors = service.validateJourney(body);

    if (Object.keys(errors).length) {
      return res.status(400).send(errors);
    }

    const existingJourney = await service.findById(body.id);
    let savedJourney;

    if (existingJourney) {
      if (existingJourney.userId !== id || !existingJourney.draft) {
        const error = new Error('The journey already exists');
        error.status = 400;

        throw error;
      } else {
        savedJourney = await service.update(
          existingJourney.id,
          { ...body, draft: false },
          existingJourney,
        );
      }
    } else {
      savedJourney = await service.create({
        ...body,
        userId: id,
        creatorId: id,
        draft: false,
      });
    }

    savedJourney = await service.findById(savedJourney.id);
    const journeyDTO = service.journeyToFeedJourneyDTO(savedJourney.toJSON());

    return res.send(journeyDTO);
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

    const errors = service.validateJourney(body);

    if (Object.keys(errors).length) {
      return res.status(400).send(errors);
    }

    const existingJourney = await service.findById(body.id);

    if (existingJourney) {
      if (existingJourney.userId !== id || !existingJourney.draft) {
        const error = new Error('The journey already exists');
        error.status = 400;

        throw error;
      } else {
        const updatedJourney = await service.update(
          existingJourney.id,
          { ...body, draft: false, userId, creatorId: id },
          existingJourney,
        );

        return res.send(updatedJourney);
      }
    }

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

    const updatedJourney = await service.update(
      id,
      { ...body, draft: false },
      journey,
    );

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
      return res.send({
        message: `Journey with id ${id} deleted`,
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

journeyRouter.post(
  '/publish',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { id },
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

    await service.publish(id);

    return res.send({
      message: `Journey with id ${id} published`,
    });
  }),
);

journeyRouter.post(
  '/unpublish',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { id },
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

    await service.unpublish(id);

    return res.send({
      message: `Journey with id ${id} unpublished`,
    });
  }),
);

module.exports = journeyRouter;
