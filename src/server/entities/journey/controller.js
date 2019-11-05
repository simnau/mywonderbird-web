const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const requireRole = require('../../middleware/require-role');
const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const journeyRouter = Router();

journeyRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;
    const journeys = await service.findAllByUser(id);

    res.send(journeys);
  }),
);

journeyRouter.get(
  '/all',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { userId } = req.query;
    const journeys = await (userId
      ? service.findAllByUser(userId)
      : service.findAll());

    res.send(journeys);
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

    return res.send(journey);
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
    const savedJourney = await service.create({ ...body, userId: id });

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
