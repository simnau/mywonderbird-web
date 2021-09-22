const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

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

    res.send({ gem: gemDTO });
  }),
);

module.exports = gemRouter;
