const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { ADMIN_ROLE } = require('../../constants/roles');

const requireAuth = require('../../middleware/require-auth');
const requireRole = require('../../middleware/require-role');
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

placeRouter.post(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      body,
    } = req;

    const createdPlace = await service.createFull(body);

    res.send({
      place: createdPlace,
    });
  }),
)

placeRouter.delete(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    await service.deleteById(id);

    res.send({
      message: 'Place successfully deleted',
    });
  }),
)

module.exports = placeRouter;
