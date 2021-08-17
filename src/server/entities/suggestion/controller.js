const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const suggestionRouter = Router();

suggestionRouter.get(
  '/locations/paginated',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: {
        page = 0,
        pageSize = service.DEFAULT_LOCATIONS_PER_PAGE,
        tags = [],
        latMin,
        latMax,
        lngMin,
        lngMax,
        selectedLocations = [],
      },
      user: { id },
    } = req;

    const suggestedLocations = await service.suggestLocationsPaginated(id, {
      page,
      pageSize,
      tags: Array.isArray(tags) ? tags : [tags],
      latMin,
      latMax,
      lngMin,
      lngMax,
      selectedLocations: Array.isArray(selectedLocations)
        ? selectedLocations
        : [selectedLocations],
    });
    const suggestedLocationDTOs = suggestedLocations.map(
      service.toSuggestedLocationDTO,
    );

    res.send({ locations: suggestedLocationDTOs });
  }),
);

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
        types,
      },
      user: { id },
    } = req;

    const typeArray = types.substring(1, types.length - 1).split(/,\s/);
    const suggestedLocations = await service.suggestLocations(id, {
      country,
      start,
      end,
      duration,
      locationCount,
      travelerCount,
      travelingWithChildren,
      types: typeArray,
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
      body: { locationIds, startingLocation },
      user: { id },
    } = req;

    const suggestedJourney = await service.suggestJourneyByLocations(
      id,
      locationIds,
      startingLocation,
    );

    res.send({ journey: suggestedJourney });
  }),
);

suggestionRouter.post(
  '/locations/from-point',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { locationIds, startingLocationId },
      user: { id },
    } = req;

    const suggestedJourney = await service.suggestJourneyByLocationsFromLocation(
      id,
      locationIds,
      startingLocationId,
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
