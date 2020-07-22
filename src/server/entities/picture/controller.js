const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const journeyService = require('../journey/service');

const pictureRouter = Router();

pictureRouter.post(
  '/:journeyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body,
      params: { journeyId },
      user: { id },
    } = req;

    await service.sharePicture(body, journeyId, id);

    res.send({ success: true });
  }),
);

pictureRouter.post(
  '/:journeyId/file',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      files,
      params: { journeyId },
      user: { id },
    } = req;

    const existingJourney = await journeyService.findById(journeyId);

    if (!existingJourney) {
      await journeyService.create({
        id: journeyId,
        userId: id,
        creatorId: id,
        draft: true,
      });
    }

    const response = await service.uploadFiles(files, journeyId);

    res.send(response);
  }),
);

module.exports = pictureRouter;
