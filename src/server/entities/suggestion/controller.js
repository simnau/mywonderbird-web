const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const suggestionRouter = Router();

suggestionRouter.get(
  '/locations',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: {
        country,
        start,
        end,
        duration,
        locationCount,
        travelerCount,
        travelingWithChildren,
      },
      user: { id },
    } = req;

    const suggestedLocations = await service.suggestLocations(id, {
      country,
      start,
      end,
      duration,
      locationCount,
      travelerCount,
      travelingWithChildren,
    });
    const suggestedLocationDTOs = suggestedLocations.map(
      service.toSuggestedLocationDTO,
    );

    res.send({ locations: suggestedLocationDTOs });
  }),
);

suggestionRouter.post(
  '/locations',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { locationIds },
      user: { id },
    } = req;

    const suggestedJourney = await service.suggestJourneyByLocations(
      id,
      locationIds,
    );

    res.send({ journey: suggestedJourney });
  }),
);

suggestionRouter.get(
  '/:bookmarkGroupId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { bookmarkGroupId },
      user: { id },
    } = req;

    const suggestedJourney = await service.suggestJourney(
      id,
      bookmarkGroupId === 'null' ? null : bookmarkGroupId,
    );

    res.send({ journey: suggestedJourney });
  }),
);

module.exports = suggestionRouter;
