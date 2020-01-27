const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const requireRole = require('../../middleware/require-role');
const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const tutorialStepRouter = Router();

tutorialStepRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const tutorialSteps = await service.findAll();

    res.send(tutorialSteps);
  }),
);

tutorialStepRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;
    const tutorialStep = await service.findById(id);

    if (!tutorialStep) {
      return res.status(404).send({ error: `Tutorial step ${id} not found` });
    }

    res.send(tutorialStep);
  }),
);

tutorialStepRouter.post(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { body: tutorialStep } = req;
    const createdTutorialStep = await service.create(tutorialStep);

    res.send(createdTutorialStep);
  }),
);

tutorialStepRouter.put(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      body: tutorialStep,
      params: { id },
    } = req;
    const updatedTutorialStep = await service.update(id, tutorialStep);

    res.send(updatedTutorialStep);
  }),
);

tutorialStepRouter.delete(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    await service.deleteById(id);

    res.send({ message: 'Tutorial step deleted' });
  }),
);

module.exports = tutorialStepRouter;
