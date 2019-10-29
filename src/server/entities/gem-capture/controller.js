const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const service = require('./service');

const gemCaptureRouter = Router();

gemCaptureRouter.post(
  '/file',
  asyncHandler(async (req, res) => {
    const { files } = req;

    const response = await service.uploadFile(files);

    res.send(response);
  }),
);

module.exports = gemCaptureRouter;
