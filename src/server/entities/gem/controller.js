const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { ADMIN_ROLE } = require('../../constants/roles');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const placeImageService = require('../place-image/service');

const gemRouter = Router();

gemRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    const gem = await service.findById(id);
    const gemDTO = service.toDTO(gem);
    const placeId = await placeImageService.findPlaceIdByGemCaptureId(
      gemDTO.firstGemCaptureId,
    );

    res.send({ gem: { ...gemDTO, placeId } });
  }),
);

gemRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const gems = await service.findStandaloneByUserId(id);
    const gemDTOs = gems.map(gem => service.toDTO(gem));

    res.send({ gems: gemDTOs });
  }),
);

gemRouter.get(
  '/users/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    const gems = await service.findStandaloneByUserId(id);
    const gemDTOs = gems.map(gem => service.toDTO(gem));

    res.send({ gems: gemDTOs });
  }),
);

gemRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      user: { id: userId, role },
    } = req;

    const gem = await service.findById(id);

    if (!gem) {
      return res.send({
        message: `Gem with id ${id} deleted`,
      });
    } else if (role !== ADMIN_ROLE && gem.userId !== userId) {
      const error = new Error('User is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.delete(gem, userId);

    return res.send({
      message: `Gem with id ${id} deleted`,
    });
  }),
);

module.exports = gemRouter;
