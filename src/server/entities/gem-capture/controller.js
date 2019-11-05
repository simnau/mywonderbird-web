const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const gemCaptureRouter = Router();

gemCaptureRouter.post(
  '/file',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      files,
      body: { journeyId },
    } = req;

    const response = await service.uploadFiles(files, journeyId);

    res.send(response);
  }),
);

module.exports = gemCaptureRouter;
