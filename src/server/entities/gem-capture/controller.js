const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const journeyService = require('../journey/service');

const gemCaptureRouter = Router();

gemCaptureRouter.post(
  '/file',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      files,
      body: { journeyId },
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

module.exports = gemCaptureRouter;
