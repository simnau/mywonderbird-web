const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const placeRouter = Router();

const DEFAULT_PAGE_SIZE = 20;

placeRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;

    const { places, total } = await service.findAllPaginated({
      page,
      pageSize,
    });

    const placeDTOs = await service.toDTOs(places);

    res.send({
      places: placeDTOs,
      total,
    });
  }),
);

module.exports = placeRouter;
