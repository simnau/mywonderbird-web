const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const service = require('./service');

const journeyRouter = Router();

journeyRouter.get(
  '/',
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
  asyncHandler(async (req, res) => {
    const { body } = req;
    const savedJourney = await service.create(body);

    res.send(savedJourney);
  }),
);

journeyRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      body,
    } = req;

    const updatedJourney = await service.update(id, body);

    return res.send(updatedJourney);
  }),
);

journeyRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const journey = await service.findById(id);

    if (!journey) {
      return res.status(404).send({
        error: `Journey with id ${id} not found`,
      });
    }

    await service.delete(id);

    return res.send({
      message: `Journey with id ${id} deleted`,
    });
  }),
);

module.exports = journeyRouter;
