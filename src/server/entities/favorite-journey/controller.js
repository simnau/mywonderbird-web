const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const journeyService = require('../journey/service');

const favoriteJourneyRouter = Router();

const DEFAULT_PAGE_SIZE = 20;

favoriteJourneyRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;
    const favoriteJourneys = await service.findByUserId(id);
    const journeyIds = favoriteJourneys.map(
      favoriteJourney => favoriteJourney.journeyId,
    );

    const { journeys, total } = await journeyService.findAllByIds(
      journeyIds,
      page,
      pageSize,
      {
        loadIncludes: true,
      },
    );
    const journeyDTOs = await journeyService.enrichJourneys(journeys, id);

    res.send({ journeys: journeyDTOs, total });
  }),
);

favoriteJourneyRouter.get(
  '/count',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;
    const count = await service.countByUserId(id);

    res.send({
      count,
    });
  }),
);

favoriteJourneyRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      body: { journeyId },
    } = req;
    const result = await service.create({ userId: id, journeyId });

    res.send(result);
  }),
);

favoriteJourneyRouter.delete(
  '/:journeyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { journeyId },
    } = req;
    await service.deleteByUserIdAndJourneyId(id, journeyId);

    res.send({
      message: 'Journey successfully removed from favorites',
    });
  }),
);

module.exports = favoriteJourneyRouter;
