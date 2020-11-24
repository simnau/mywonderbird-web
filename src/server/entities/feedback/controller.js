const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const feedbackRouter = Router();

feedbackRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { body, user } = req;

    const result = await service.sendFeedback({
      user,
      body,
    });

    res.send({ result });
  }),
);

module.exports = feedbackRouter;
