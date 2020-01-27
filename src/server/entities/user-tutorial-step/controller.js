const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const userTutorialStepRouter = Router();

userTutorialStepRouter.post(
  '/passed',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { steps },
      user: { id: userId },
    } = req;
    await service.markPassedForUser(userId, steps);

    res.send({
      message: 'Tutorial steps passed',
    });
  }),
);

userTutorialStepRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
    } = req;
    const userTutorialSteps = await service.findByUserId(userId);

    res.send(userTutorialSteps);
  }),
);

module.exports = userTutorialStepRouter;
